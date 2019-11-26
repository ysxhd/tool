/*
 * @Author: JC.liu 
 * @Date: 2018-05-11 12:22:19 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 12:54:34
 */
import React, { Component } from 'react';
import { Scene_second_component, SiteAndCameraDetail, Scene_first_component } from "../../../components/violation_supervise/index";
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Scene_router extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/violation_supervise/site_invigilate" component={Scene_first_component} />
          <Route exact path='/violation_supervise/site_invigilate/:id' component={Scene_second_component} />
          <Route exact path='/violation_supervise/site_invigilate/detail/:id' component={SiteAndCameraDetail} />
          <Redirect to="/violation_supervise/site_invigilate" />
        </Switch>
      </div>
    )
  }
}