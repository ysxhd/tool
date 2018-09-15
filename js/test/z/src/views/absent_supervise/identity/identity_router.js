/*
 * @Author: JC.liu 
 * @Date: 2018-05-11 10:02:06 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 11:09:34
 * 缺考身份 - 路由
 */
import React, { Component } from 'react';
import { Identity_second_component, IdentityDetail, Identity_first_component } from "../../../components/absent_supervise/index";
import { Route, Switch, Redirect } from 'react-router-dom';

export default class Identity_router extends Component {
  render() {
    var match = this.props.match;
    return (
      <div>
        <Switch>
          {/* 第一层 */}
          <Route exact path={`${match.url}`} component={Identity_first_component} />
          {/* 第二层 */}
          <Route exact path={`${match.url}/:id`} component={Identity_second_component} />
          {/* 详情页 */}
          <Route path={`${match.url}/detail/:id`} component={IdentityDetail} />
          <Redirect to={`${match.url}`} />
        </Switch>
      </div>
    )
  }
}