/*
 * @Author: 甘维添 
 * @Date: 2018-04-10 13:08:50 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 15:56:46
 * 综合缺考管理
 */
import React, { Component } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import '../../css/absent_supervise.css';
// 身份缺考 
import Identity_router from './identity/identity_router';
// 现场缺考
import Scene_router from './scene/scene_router';
// 视频缺考
import Camera_router from './camera/camera_router';
// 阅卷缺考
import PaperAbsent from './paper/paper_absent';
// 成绩缺考
import AchievementAbsent from './achievement/achievement_absent';
// 验证对比
import Compare_router from './compare/compare_absent';
// 综合
import AbsentDispose from './dispose/absent_dispose';
import Title from './../../components/public_components/title/title';



class AbsentSupervise extends Component {
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
              >综合缺考管理</h1>
            </div>
            <div className="gwt-right-content">
              <Title></Title>
            </div>
          </div>
        </div>
        <div className="gwt-absent-body">
          <div className="gwt-absent-side">
            {/* 左侧侧边栏 */}
            <h3>缺考数据管理</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/authentication_absent`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-shenfenyanzhengquekao"></span>
                  身份验证缺考
                  </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${path}/site_invigilate`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-xianchangjiankao"></span>
                  现场监考上报缺考
                  </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${path}/camera_invigilate`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-shipinjiankao"></span>
                  视频监考上报缺考
                  </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${path}/paper_absent`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-yuejuanquekao"></span>
                  阅卷缺考
                  </NavLink>
              </li>
              <li>
                <NavLink
                  to={`${path}/achievement_absent`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-chengjiquekao"></span>
                  成绩缺考
                  </NavLink>
              </li>
            </ul>
            <h3>缺考对比分析</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/absent_compare`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-quekaozonghechuzhi"></span>
                  验证&现场比对
                  </NavLink>
              </li>
            </ul>
            <h3>缺考综合处理</h3>
            <ul>
              <li>
                <NavLink
                  to={`${path}/absent_dispose`}
                  activeStyle={activeStyle}
                >
                  <span className="iconfont icon-quekaozonghechuzhi"></span>
                  缺考综合处置
                  </NavLink>
              </li>
            </ul>
          </div>
          <div className="gwt-absent-content">
            <Switch>
              {/* 身份验证缺考 */}
              <Route path={`${path}/authentication_absent`} component={Identity_router}></Route>
              {/* 现场监考上报缺考 */}
              <Route path={`${path}/site_invigilate`} component={Scene_router}></Route>
              {/* 视频监考 */}
              <Route path={`${path}/camera_invigilate`} component={Camera_router}></Route>
              {/* 阅卷缺考 */}
              <Route path={`${path}/paper_absent`} component={PaperAbsent}></Route>
              {/* 成绩缺考 */}
              <Route path={`${path}/achievement_absent`} component={AchievementAbsent}></Route>
              {/* 验证比对 */}
              <Route path={`${path}/absent_compare`} component={Compare_router}></Route>
              {/* 缺考综合处置 */}
              <Route path={`${path}/absent_dispose`} component={AbsentDispose}></Route>
              <Redirect to={`${path}/authentication_absent`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default AbsentSupervise;