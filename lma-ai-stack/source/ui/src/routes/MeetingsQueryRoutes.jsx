// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import MeetingsQueryLayout from '../components/meetings-query-layout';
import CallAnalyticsTopNavigation from '../components/call-analytics-top-navigation';

const MeetingsQueryRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path}>
        <div>
          <CallAnalyticsTopNavigation />
          <MeetingsQueryLayout />
        </div>
      </Route>
    </Switch>
  );
};

export default MeetingsQueryRoutes;
