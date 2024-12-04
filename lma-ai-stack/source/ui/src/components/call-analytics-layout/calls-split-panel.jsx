import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { CALLS_PATH } from '../../routes/constants';

import CallListSplitPanel from '../call-list/CallListSplitPanel';

const CallsSplitPanel = () => {
  return (
    <Switch>
      <Route exact path={CALLS_PATH}>
        <CallListSplitPanel />
      </Route>
    </Switch>
  );
};

export default CallsSplitPanel;
