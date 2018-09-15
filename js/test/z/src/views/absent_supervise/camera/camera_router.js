/*
 * @Author: JCheng.L 
 * @Date: 2018-04-11 11:23:50 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 11:05:23
 * 缺考 -> 视频监考
 */
import React, { Component } from 'react';
import { Camera, IdentityDetail, Camera_first_component} from "../../../components/absent_supervise/index";
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Camera_router extends Component {
  render() {
    var match = this.props.match;
    return (
      <div>
        <Switch>
          <Route exact path="/absent_supervise/camera_invigilate" component={Camera_first_component} />
          <Route exact path={`${match.url}/:id`} component={Camera} />
          <Route path={`${match.url}/detail/:id`} component={IdentityDetail} />
          <Redirect to="/absent_supervise/camera_invigilate" />
        </Switch>
      </div>
    )
  }
}

