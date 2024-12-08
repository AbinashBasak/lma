import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import NavigationProvider from './context/NavigationContext';
import SettingsProvider from './context/SettingsContext';
import UserProvider from './context/UserContext';
import IntegrationProvider from './context/ProviderIntegrationContext';
import { amplifyConfig } from 'amplifyConfig';

amplifyConfig();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <SettingsProvider>
            <UserProvider>
                <NavigationProvider>
                    <IntegrationProvider>
                        <App />
                    </IntegrationProvider>
                </NavigationProvider>
            </UserProvider>
        </SettingsProvider>
    </React.StrictMode>,
);
