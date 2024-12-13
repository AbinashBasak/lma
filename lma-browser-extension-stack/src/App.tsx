import React from 'react';
import Capture from './components/screens/Capture';
import LoginCognito from './components/screens/LoginCognito';
import { useUserContext } from './context/UserContext';
import { TooltipProvider } from 'components/ui/tooltip';
import { Toaster } from 'components/ui/toaster';
import Loading from 'components/screens/Loading';

function App() {
    const { loggedIn, isLoading } = useUserContext();

    return (
        <div className="w-[358px] rounded-[8px] overflow-hidden h-full">
            <TooltipProvider>{isLoading ? <Loading /> : loggedIn ? <Capture /> : <LoginCognito />}</TooltipProvider>
            <Toaster />
        </div>
    );
}

export default App;
