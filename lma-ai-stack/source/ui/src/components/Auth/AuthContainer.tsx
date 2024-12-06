import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthState, CognitoUserInterface } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import AmplifySignIn from 'components/Auth/AmplifySignIn';
import AmplifySignUp from './AmplifySignUp';
import VerifyContact from './VerifyContact';
import AmplifySignUpConfirm from './AmplifySignUpConfirm';
import AmplifyResetPassword from './AmplifyResetPassword';

// Define the type for the context
interface AuthContainerContextType {
  authState: AuthState;
  authData: CognitoUserInterface | undefined;
  onAuthStateChange: (nextAuthState: AuthState, data?: CognitoUserInterface) => Promise<void>;
}

// Create the context with a default value of undefined
const AuthContainerContext = createContext<AuthContainerContextType | undefined>(undefined);

// Custom hook to use the context
export const useAuthContainerContext = () => {
  const context = useContext(AuthContainerContext);
  if (!context) {
    throw new Error('useAuthContainerContext must be used within a UserProvider');
  }
  return context;
};

export const AuthContainerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.SignIn);
  const [authData, setAuthData] = useState<CognitoUserInterface>();

  const checkUser = async (): Promise<void> => {
    if (!Auth || typeof Auth.currentAuthenticatedUser !== 'function') {
      return;
    }

    return Auth.currentAuthenticatedUser()
      .then(() => {
        console.log('user');
      })
      .catch(() => {
        //
      });
  };
  useEffect(() => {
    checkUser();
  }, []);

  const onAuthStateChange = async (nextAuthState: AuthState, data?: CognitoUserInterface) => {
    if (nextAuthState === undefined) return;

    if (nextAuthState === AuthState.SignedOut) {
      setAuthState(AuthState.SignIn);
    } else {
      setAuthState(nextAuthState);
    }

    setAuthData(data);
  };

  return <AuthContainerContext.Provider value={{ authState, authData, onAuthStateChange }}>{children}</AuthContainerContext.Provider>;
};

export const AuthContainerAuthenticator = () => {
  const { authState } = useAuthContainerContext();

  switch (authState) {
    case AuthState.SignIn:
      return <AmplifySignIn />;
    // case AuthState.ConfirmSignIn:
    //   return <amplify-confirm-sign-in user={this.authData} />;
    case AuthState.SignUp:
      return <AmplifySignUp />;
    case AuthState.ConfirmSignUp:
      return <AmplifySignUpConfirm />;
    case AuthState.ForgotPassword:
      return <AmplifyResetPassword />;
    // case AuthState.ResetPassword:
    //   return <AmplifyResetPassword />;
    case AuthState.VerifyContact:
      return <VerifyContact />;
    // case AuthState.TOTPSetup:
    //   return <amplify-totp-setup user={this.authData} />;
    case AuthState.SignedIn:
    case AuthState.Loading:
      return <div>Loading...</div>;
    default:
      return <AmplifySignIn />;
  }
};
