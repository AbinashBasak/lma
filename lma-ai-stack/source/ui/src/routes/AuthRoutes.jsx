import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import { AmplifySignOut } from '@aws-amplify/ui-react';

import { SettingsContext } from '../contexts/settings';
import useParameterStore from '../hooks/use-parameter-store';
import useAppContext from '../contexts/app';

import { CALLS_PATH, DEFAULT_PATH, LOGIN_PATH, LOGOUT_PATH, STREAM_AUDIO_PATH, VIRTUAL_PARTICIPANT_PATH, MEETINGS_QUERY_PATH } from './constants';
import UserForm from './UserForm';

// Lazy-loaded components
const CallsRoutes = lazy(() => import('./CallsRoutes'));
const StreamAudioRoutes = lazy(() => import('./StreamAudioRoutes'));
const VirtualParticipantRoutes = lazy(() => import('./VirtualParticipantRoutes'));
const MeetingsQueryRoutes = lazy(() => import('./MeetingsQueryRoutes'));

const AuthRoutes = ({ redirectParam }) => {
  const { currentCredentials } = useAppContext();
  const settings = useParameterStore(currentCredentials);
  const settingsContextValue = { settings };

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path={CALLS_PATH}>
            <CallsRoutes />
          </Route>
          <Route path={STREAM_AUDIO_PATH}>
            <StreamAudioRoutes />
          </Route>
          <Route path={LOGIN_PATH}>
            <Redirect to={!redirectParam || redirectParam === LOGIN_PATH ? DEFAULT_PATH : `${redirectParam}`} />
          </Route>
          <Route path={LOGOUT_PATH}>
            <AmplifySignOut />
          </Route>
          <Route path={MEETINGS_QUERY_PATH}>
            <MeetingsQueryRoutes />
          </Route>
          <Route path={VIRTUAL_PARTICIPANT_PATH}>
            <VirtualParticipantRoutes />
          </Route>
          <Route>
            <Redirect to={DEFAULT_PATH} />
          </Route>
        </Switch>
      </Suspense>
      <UserForm />
    </SettingsContext.Provider>
  );
};

AuthRoutes.propTypes = {
  redirectParam: PropTypes.string.isRequired,
};

export default AuthRoutes;
