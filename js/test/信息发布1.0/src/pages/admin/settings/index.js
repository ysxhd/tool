import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Auditing } from './auditing';
import { Upload } from './upload';

class Settings extends Component {
  render(){
    return (
      <Switch>
        <Route path='/admin/settings/auditing/index' component={Auditing}/>
        <Route path='/admin/settings/upload/index' component={Upload}/>
        <Redirect to={ this.props.location.pathname + '/index'}/>
      </Switch>
    );
  }
}

export const SettingsRouter = withRouter(Settings);