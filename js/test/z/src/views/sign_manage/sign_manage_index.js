/*
 * @Author: 甘维添 
 * @Date: 2018-04-10 13:08:50 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-04 17:14:24
 * 监考签到管理
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import './../../css/absent_supervise.css';
import Title from './../../components/public_components/title/title';
import SignManage from './sign_manage';

class SignManageIndex extends Component {
  render() {
    const path = this.props.match.path
    const activeStyle = {
      backgroundColor: '#714bfe',
      color: '#fff'
    }
    return (
      <div className="gwt-absent-container">
        <div className="gwt-header">
          <div className="gwt-header-container">
            <div className="gwt-title">
              <h1
                onClick={() => this.props.history.push('/overview')}
              >监考签到管理</h1>
            </div>
            <div className="gwt-right-content">
              <Title></Title>
            </div>
          </div>
        </div>
        <div className="gwt-absent-body">
          <div className="gwt-absent-side">
            {/* 左侧侧边栏 */}
            <h3>现场监考签到</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/sign_manage`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-xianchangjiankao"></span>
                  签到管理
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="gwt-absent-content">
            <Switch>
              <Route component={SignManage} path={`${path}/sign_manage`}></Route>
              <Redirect to={`${path}/sign_manage`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default SignManageIndex;