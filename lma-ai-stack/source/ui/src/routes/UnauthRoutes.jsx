// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AmplifyAuthContainer, AmplifyAuthenticator, AmplifySignIn, AmplifySignUp } from '@aws-amplify/ui-react';

import { LOGIN_PATH, LOGOUT_PATH, REDIRECT_URL_PARAM } from './constants';

const UnauthRoutes = ({ location }) => (
  <Switch>
    <Route path={LOGIN_PATH}>
      <AmplifyAuthContainer>
        <AmplifyAuthenticator>
          <AmplifySignIn headerText="Welcome to Live Meeting Assistant!" hideSignUp={false} slot="sign-in" className="test" />
          <AmplifySignUp
            headerText="Welcome to Live Meeting Assistant!"
            slot="sign-up"
            usernameAlias="email"
            formFields={[
              {
                type: 'email',
                inputProps: { required: true, autocomplete: 'email' },
              },
              { type: 'password' },
            ]}
          />
        </AmplifyAuthenticator>
      </AmplifyAuthContainer>
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

UnauthRoutes.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};

export default UnauthRoutes;
