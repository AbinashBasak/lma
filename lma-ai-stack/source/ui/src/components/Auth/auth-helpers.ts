import { CognitoUser, SignUpParams } from '@aws-amplify/auth';
import { AuthState, AuthStateHandler, ChallengeName, CognitoUserInterface, Translations } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import { isEmpty } from '@aws-amplify/core';
import { toast } from 'components/ui/use-toast';

export const isCognitoUser = (user: CognitoUserInterface) => {
  return user instanceof CognitoUser;
};

export async function checkContact(user: CognitoUserInterface, handleAuthStateChange: AuthStateHandler) {
  if (!Auth || typeof Auth.verifiedContact !== 'function') {
    throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
  }

  // If `user` is a federated user, we shouldn't call `verifiedContact`
  // since `user` isn't `CognitoUser`
  if (!isCognitoUser(user)) {
    handleAuthStateChange(AuthState.SignedIn, user);
    return;
  }

  const data = await Auth.verifiedContact(user);
  if (!isEmpty(data.verified) || isEmpty(data.unverified)) {
    handleAuthStateChange(AuthState.SignedIn, user);
  } else {
    const newUser = Object.assign(user, data);
    handleAuthStateChange(AuthState.VerifyContact, newUser);
  }
}

export const handleSignIn = async (username: string, password: string, handleAuthStateChange: AuthStateHandler) => {
  if (!Auth || typeof Auth.signIn !== 'function') {
    throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
  }
  try {
    const user = await Auth.signIn(username, password);
    if (user.challengeName === ChallengeName.SMSMFA || user.challengeName === ChallengeName.SoftwareTokenMFA) {
      handleAuthStateChange(AuthState.ConfirmSignIn, user);
    } else if (user.challengeName === ChallengeName.NewPasswordRequired) {
      handleAuthStateChange(AuthState.ResetPassword, user);
    } else if (user.challengeName === ChallengeName.MFASetup) {
      handleAuthStateChange(AuthState.TOTPSetup, user);
    } else if (user.challengeName === ChallengeName.CustomChallenge && user.challengeParam?.trigger === 'true') {
      handleAuthStateChange(AuthState.CustomConfirmSignIn, user);
    } else {
      await checkContact(user, handleAuthStateChange);
    }
  } catch (error: any) {
    if (error.code === 'UserNotConfirmedException') {
      handleAuthStateChange(AuthState.ConfirmSignUp, {
        username,
        signUpAttrs: {
          username,
          password,
          attributes: {
            email: username,
          },
        },
      });
    } else if (error.code === 'PasswordResetRequiredException') {
      handleAuthStateChange(AuthState.ForgotPassword, { username });
    } else {
      if (typeof error.message === 'string') {
        toast({
          title: 'Error',
          description: error.message,
        });
      }
    }
  }
};

export const authSignUp = async (params: SignUpParams): Promise<any> => {
  const data = await Auth.signUp(params);
  if (!data) {
    throw new Error(Translations.SIGN_UP_FAILED);
  }

  return data;
};
