/*
 * @Author: JC.liu 
 * @Date: 2018-05-11 11:17:15 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 14:08:08
 */
import React, { Component } from 'react';
import { Camera_second_component, SiteAndCameraDetail, Camera_first_component } from "../../../components/violation_supervise/index";
import { Route, Switch, Redirect, } from 'react-router-dom';

export default class Camera_router extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/violation_supervise/camera_invigilate" component={Camera_first_component} />
          <Route exact path='/violation_supervise/camera_invigilate/:id' component={Camera_second_component} />
          <Route exact path='/violation_supervise/camera_invigilate/detail/:id' component={SiteAndCameraDetail} />
          <Redirect to="/violation_supervise/camera_invigilate" />
        </Switch>
      </div>
    )
  }
}
