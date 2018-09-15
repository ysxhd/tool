/*
 * @Author: 甘维添 
 * @Date: 2018-04-10 13:08:50 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 16:52:51
 * 综合缺考管理
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import './../../css/absent_supervise.css';

import Title from './../../components/public_components/title/title';
// 违规视频
import Camera_router from './camera/camera_router';

// 违规现场
import Scene_router from './scene/scene_router';
// 违规综合
import AbsentDispose from './dispose/absent_dispose';

class ViolationSupervise extends Component {
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
              >综合违规管理</h1>
            </div>
            <div className="gwt-right-content">
              <Title></Title>
            </div>
          </div>
        </div>
        <div className="gwt-absent-body">
          <div className="gwt-absent-side">
            {/* 左侧侧边栏 */}
            <h3>违规数据管理</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/site_invigilate`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-xianchangjiankao"></span>
                  现场监考上报违规
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${path}/camera_invigilate`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-shipinjiankao"></span>
                  视频监考上报违规
                </NavLink>
              </li>
            </ul>
            <h3>违规综合处理</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/absent_dispose`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-quekaozonghechuzhi"></span>
                  违规综合处置
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="gwt-absent-content">
            <Switch>
              {/* 现场监考上报违规 */}
              <Route path={`${path}/site_invigilate`} component={Scene_router}></Route>
              {/* 视频监考违规 */}
              <Route path={`${path}/camera_invigilate`} component={Camera_router}></Route>
              {/* 缺考综合处置 */}
              <Route path={`${path}/absent_dispose`} component={AbsentDispose}></Route>
              <Redirect to={`${path}/site_invigilate`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default ViolationSupervise;