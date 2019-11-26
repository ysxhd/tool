/*
 * @Author: junjie.lean
 * @Date: 2018-07-25 13:32:30
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 15:47:16
 */
/**
 * 组件和路由对应关系统一放在这里管理
 */
import React from 'react';
import Loading from './page/loading';
import { Route, Switch } from 'react-router-dom';

//router 切换动效
// import Switch from 'react-router-animated-switch';
// 学生 公共课堂
import Q_PubClass from './page/q_publicClass';
// 我的课堂
import Q_MyClass from './page/q_myClass';
// 首页
import Q_Index from './page/q_index';
// 直播页
import LiveVideo from './page/q_liveVideo';
// 搜索页面
import Q_SearchResult from './page/q_searchResult';
// 反馈页面
import Q_FeedBack from './page/q_feedback';
// 反馈详情页
import B_FeedBack_detail from './page/b_feedback_detail';
// 直播首页
import Q_LivePage from './page/q_livePage';
// 直播预告页面
import Q_LiveTrail from './page/q_liveTrail';
// 用户上传的普通视频播放组件
import ReplayVideo from './page/q_replayVideo';
// 录播（点播）页面
import Q_recordVideo from './page/q_recordVideo';

// PDF
import PDFShow from './page/pdfShow';

// 管理员 审核管理
import B_CheckMan from './page/b_checkMan';
// 课堂管理
import B_ManagerClassMan from './page/b_managerClassMan';
import B_ManagerClassDetail from './page/b_managerClassDetail';

// 反馈
import B_Feedback from './page/b_feedback';
// 平台配置
import B_SysteamCon from './page/b_systeamCon';

// 后台 - 老师身份
// 云盘管理
import B_TeaCherNetDisk from './page/b_teaNetdiskMan';
// 课堂管理
import TeacherClassMan from './page/b_teacherClassMan';
import B_TeacherClassDetail from './page/b_teacherClassDetail';

// Error
import ErrorPage from './page/error';

export default class RouterRelation extends React.Component {
  render() {
    const style = {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
    const switchStyle = {
      flexGrow: 1
    }

    return (
      <div style={style} className="lxx-g-layout">
        <Switch>
          {/* loadding */}
          <Route exact path="/" component={Loading} />
          {/* 前台页面 */}
          {/* 首页 */}
          <Route exact path="/index" component={Q_Index} />
          {/* 公共课堂 */}
          <Route path="/q_publicClass/:cid/:sid/:tid/:sta" component={Q_PubClass} />
          {/* 我的课堂 */}
          <Route path="/q_myClass" component={Q_MyClass} />
          {/* 搜索页面 */}
          <Route path="/q_searchResult" component={Q_SearchResult} />
          {/* 搜索页面 公共*/}
          {/* <Route path="/q_searchResult_public" component={Q_SearchResult} /> */}
          {/* 搜索页面 私有*/}
          {/* <Route path="/q_searchResult_private" component={Q_SearchResult} /> */}

          {/* 直播首页 不带有播放器 点击跳转到直播页 或者预告页*/}
          <Route path="/q_livepage/:cid/:sid" component={Q_LivePage} />
          {/* 直播预告页面 */}
          <Route path="/q_liveTrail/:target/:id/:time" component={Q_LiveTrail} />

          {/* 点击辅助资源 跳转的 PDF 页面 */}
          <Route path="/PDFShow" component={PDFShow} />

          {/* 后台页面 */}
          {/* 课堂管理 */}
          <Route exact path="/b_managerClassMan" component={B_ManagerClassMan} />
          <Route exact path="/b_managerClassMan/detail/:id" component={B_ManagerClassDetail} />

          {/* 审核管理 */}
          <Route path="/b_checkMan" component={B_CheckMan} />
          {/* 意见反馈 */}
          <Route path="/b_feedback" component={B_Feedback} />
          {/* 反馈详情页 */}
          <Route path="/b_feedback_detail/:id" component={B_FeedBack_detail} />
          {/* 平台配置 */}
          <Route path="/b_systeamCon" component={B_SysteamCon} />


          {/* 老师的页面 */}
          {/* 云盘管理 */}
          <Route path="/b_teaCherNetDisk" component={B_TeaCherNetDisk} />
          {/* 课堂管理 */}
          <Route exact path="/b_teacherClassMan" component={TeacherClassMan} />
          <Route path="/b_teacherClassMan/detail/:id" component={B_TeacherClassDetail} />

          {/* public */}
          {/* 直播页面 前后台都会跳到 
          *target ： 前台界面跳转的 传reception  老师后台传 teacher  管理员后台传 admin
        */}
          <Route path="/q_liveVideo/:target/:id" component={LiveVideo} />
          {/* 反馈页面 */}
          <Route path="/q_feedback/:target" component={Q_FeedBack} />
          {/* 用户上传的普通资源 */}
          <Route path="/q_replayVideo/:target/:id/:type" component={ReplayVideo} />
          {/* 录播（点播）页面 
          入参：target {string} 表示身份来展示不同的header 前台页面统统写 reception  老师后台 teacher  管理员后台 admin 
                id {string} 该资源的id 用于请求视频
                isPub {boolean true 表示公有资源  false 私有 } 用于区分是公有资源  还是私有资源   展示不同视频浏览量 公有浏览量 或 私有浏览量
        */}
          <Route path="/q_recordVideo/:target/:id/:isPub" component={Q_recordVideo} />
          {/* error报错页面 */}
          <Route path="/error" component={ErrorPage} />

          {/* 默认走loading */}
          {/* <Redirect to="/" /> */}
          {/* </Switch> */}
        </Switch>
      </div>
    )
  }
}