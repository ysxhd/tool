/*
 * @Author: JC.liu 
 * @Date: 2018-04-29 21:42:30 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 16:43:23
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { UnverifiedFrist, UnverifiedFristNext, Verified_Detail } from "../../../components/absent_supervise/index";

export default class Verified_router extends Component{
  render(){
    return(
      <div>
        <Switch>
          <Route exact path='/absent_supervise/absent_compare/compare_absent/verified/1/' component={UnverifiedFrist} />
          <Route path='/absent_supervise/absent_compare/compare_absent/verified/2/:id' component={UnverifiedFristNext} />
          <Route path='/absent_supervise/absent_compare/compare_absent/verified/detail/:id' component={Verified_Detail} />
          <Redirect to='/absent_supervise/absent_compare/compare_absent/verified/1/' />
        </Switch>
      </div>
    )
  }
}