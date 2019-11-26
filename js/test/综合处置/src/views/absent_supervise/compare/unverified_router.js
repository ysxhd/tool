/*
 * @Author: JC.liu 
 * @Date: 2018-04-29 21:42:30 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:31:50
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Unverified_second_component, Unverified_Detail, Unverified_frist_component } from "../../../components/absent_supervise/index";

export default class Unverified_router extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/absent_supervise/absent_compare/compare_absent/unverified/' component={Unverified_frist_component} />
          <Route exact path='/absent_supervise/absent_compare/compare_absent/unverified/:id' component={Unverified_second_component} />
          <Route path='/absent_supervise/absent_compare/compare_absent/unverified/detail/:id' component={Unverified_Detail} />
          <Redirect to='/absent_supervise/absent_compare/compare_absent/unverified' />
        </Switch>
      </div>
    )
  }
}

