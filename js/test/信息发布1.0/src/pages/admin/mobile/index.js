import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { WatchingClass } from './watching/class';
import { WatchingSchool } from './watching/school';
import { SettingsClass } from './settings/class';
import { SettingsSchool } from './settings/school';
import { UpgradeClass } from './upgrade/class';
import { UpgradeSchool } from './upgrade/school';

class Mobile extends Component {
  render(){
    return (
      <Switch>
        <Route path='/admin/mobile/watching/class' component={WatchingClass}/>
        <Route path='/admin/mobile/watching/school' component={WatchingSchool}/>

        <Route path='/admin/mobile/settings/class' component={SettingsClass}/>
        <Route path='/admin/mobile/settings/school' component={SettingsSchool}/>

        <Route path='/admin/mobile/upgrade/class' component={UpgradeClass}/>
        <Route path='/admin/mobile/upgrade/school' component={UpgradeSchool}/>
        <Redirect to={ this.props.location.pathname + '/class'} />
      </Switch>
    );
  }
}

export const MobileRouter = withRouter(Mobile);