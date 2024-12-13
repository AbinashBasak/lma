import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';

import { AppContext } from './contexts/app';

import useUserAuthState from './hooks/use-user-auth-state';
import useAwsConfig from './hooks/use-aws-config';
import useCurrentSessionCreds from './hooks/use-current-session-creds';

import Routes from './routes/Routes';

import './App.css';
import { Toaster } from 'components/ui/toaster';
import { TooltipProvider } from 'components/ui/tooltip';

const App = () => {
  const awsConfig = useAwsConfig();
  const { authState, setAuthState, user, setUser, handleOnAuthUIStateChange } = useUserAuthState();
  const { currentSession, currentCredentials } = useCurrentSessionCreds({ authState });
  const [errorMessage, setErrorMessage] = useState();
  const [navigationOpen, setNavigationOpen] = useState(true);

  const appContextValue = {
    authState,
    setAuthState,
    awsConfig,
    errorMessage,
    currentCredentials,
    currentSession,
    setErrorMessage,
    user,
    setUser,
    navigationOpen,
    setNavigationOpen,
    handleOnAuthUIStateChange,
  };

  return (
    <div className="App">
      <AppContext.Provider value={appContextValue}>
        <TooltipProvider>
          <HashRouter>
            <Routes />
          </HashRouter>
        </TooltipProvider>
        <Toaster />
      </AppContext.Provider>
    </div>
  );
};

export default App;
