import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Activities } from './publish/activities';
import { Features } from './publish/features';
import { Honor } from './publish/honor';
import { News } from './publish/news';
import { Notice } from './publish/notice';
import { Story } from './publish/story';
import { Websites } from './publish/websites';

export class Work extends Component {
  render(){
    return (
      <Switch>
        <Route path='/admin/work/publish/activities' component={Activities}/>
        <Route path='/admin/work/publish/features' component={Features}/>
        <Route path='/admin/work/publish/honor' component={Honor}/>
        <Route path='/admin/work/publish/news' component={News}/>
        <Route path='/admin/work/publish/notice' component={Notice}/>
        <Route path='/admin/work/publish/story' component={Story}/>
        <Route path='/admin/work/publish/websites' component={Websites}/>
        <Redirect to='/admin/work/publish/notice' />
      </Switch>
    );
  }
}

export const WorkRouter = withRouter(Work);