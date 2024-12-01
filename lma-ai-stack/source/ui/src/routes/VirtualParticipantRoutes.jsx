import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import VirtualParticipantLayout from '../components/virtual-participant-layout';
import CallAnalyticsTopNavigation from '../components/call-analytics-top-navigation';

const VirtualParticipantRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path}>
        <div>
          <CallAnalyticsTopNavigation />
          <VirtualParticipantLayout />
        </div>
      </Route>
    </Switch>
  );
};

export default VirtualParticipantRoutes;
