/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:46:37 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 17:01:56
 * 违规 -> 违规综合处置
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect,Link } from 'react-router-dom';
import { Comprehensive, ComprehensiveChild ,ComprehensiveNext } from "../../../components/violation_supervise/index";

class AbsentDispose extends Component {
  
  render() {
    const path = this.props.match.path;
    return (
      <div>
        <Switch>
          <Route exact  path={`${path}/out`} component={Comprehensive} />
          <Route exact path={`${path}/out/:id`} component={ComprehensiveNext} />
          <Route path={`${path}/in/:id`} component={ComprehensiveChild} />
          <Redirect to={`${path}/out`} ></Redirect>
        </Switch>
      </div> 
    );
  }
}

export default AbsentDispose;