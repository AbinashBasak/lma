// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useEffect } from 'react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

const useUserAuthState = (awsconfig) => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    onAuthUIStateChange((nextAuthState, authData) => {
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
    });
  }, [awsconfig]);

  return { authState, setAuthState, user, setUser };
};

export default useUserAuthState;
