/*
 * @Author: zhangning 
 * @Date: 2018-05-08 09:20:23 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-14 09:50:23
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect,Link } from 'react-router-dom';
import { SignDetail , Justnowsign , JustnowsignNext} from "../../components/sign/index";



class SignManage extends Component {
  render() {
    const path = this.props.match.path;
    return (
      <div>
        <Switch>
          <Route exact  path={`${path}/out`} component={Justnowsign} />
          <Route exact path={`${path}/out/:id`} component={JustnowsignNext} />
          <Route path={`${path}/in/:id`} component={SignDetail} />
          <Redirect to={`${path}/out`} ></Redirect>
        </Switch>
      </div>
    );
  }
}

export default SignManage;