import { AuthState } from '@aws-amplify/ui-components';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';

const useUserAuthState = () => {
  const [authState, setAuthState] = useState(AuthState.Loading);
  const [user, setUser] = useState();

  const checkUser = async () => {
    if (!Auth || typeof Auth.currentAuthenticatedUser !== 'function') {
      return;
    }

    return Auth.currentAuthenticatedUser()
      .then((user) => {
        if (user) {
          setAuthState(AuthState.SignedIn);
          setUser(user);
        }
      })
      .catch(() => {
        setAuthState(AuthState.SignIn);
      });
  };
  useEffect(() => {
    checkUser();
  }, []);

  const handleOnAuthUIStateChange = (nextAuthState, authData) => {
    setAuthState(nextAuthState);
    setUser(authData);
    if (authData && authData.signInUserSession) {
      // prettier-ignore
      localStorage.setItem(`${authData.pool.clientId}idtokenjwt`, authData.signInUserSession.idToken.jwtToken);
      // prettier-ignore
      localStorage.setItem(`${authData.pool.clientId}accesstokenjwt`, authData.signInUserSession.accessToken.jwtToken);
      // prettier-ignore
      localStorage.setItem(`${authData.pool.clientId}refreshtoken`, authData.signInUserSession.refreshToken.jwtToken);
    }
  };

  return { authState, setAuthState, user, setUser, handleOnAuthUIStateChange };
};

export default useUserAuthState;
