import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthState } from '@aws-amplify/ui-components';

import UnauthRoutes from './UnauthRoutes';

import useAppContext from '../contexts/app';
import AuthRoutes from './AuthRoutes';

import { REDIRECT_URL_PARAM } from './constants';

const Routes = () => {
  const { authState, user, currentCredentials } = useAppContext();
  const location = useLocation();
  const [urlSearchParams, setUrlSearchParams] = useState(new URLSearchParams({}));
  const [redirectParam, setRedirectParam] = useState('');

  useEffect(() => {
    if (!location?.search) {
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    setUrlSearchParams(searchParams);
  }, [location]);

  useEffect(() => {
    const redirect = urlSearchParams?.get(REDIRECT_URL_PARAM);
    if (!redirect) {
      return;
    }
    setRedirectParam(redirect);
  }, [urlSearchParams]);

  return !(authState === AuthState.SignedIn && user && currentCredentials) ? (
    <UnauthRoutes location={location} />
  ) : (
    <AuthRoutes redirectParam={redirectParam} />
  );
};

export default Routes;
