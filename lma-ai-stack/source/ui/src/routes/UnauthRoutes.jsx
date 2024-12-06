import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { LOGIN_PATH, LOGOUT_PATH, REDIRECT_URL_PARAM } from './constants';
import { AuthContainerAuthenticator, AuthContainerProvider } from 'components/Auth/AuthContainer';

const UnAuthRoutes = ({ location }) => (
  <Switch>
    <Route path={LOGIN_PATH}>
      <AuthContainerProvider>
        <AuthContainerAuthenticator />
      </AuthContainerProvider>
    </Route>
    <Route path={LOGOUT_PATH}>
      <Redirect to={LOGIN_PATH} />
    </Route>
    <Route>
      <Redirect
        to={{
          pathname: LOGIN_PATH,
          search: `?${REDIRECT_URL_PARAM}=${location.pathname}${location.search}`,
        }}
      />
    </Route>
  </Switch>
);

UnAuthRoutes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};

export default UnAuthRoutes;
