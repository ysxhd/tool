import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Cloud } from './mine/cloud';
import { Collection } from './mine/collection';

class Resource extends Component {
  render(){
    return (
      <Switch>
        <Route path='/admin/resource/mine/cloud' component={Cloud}/>
        <Route path='/admin/resource/mine/collection' component={Collection}/>
        <Redirect to='/admin/resource/mine/cloud'/>
      </Switch>
    );
  }
}

export const ResourceRouter = withRouter(Resource);