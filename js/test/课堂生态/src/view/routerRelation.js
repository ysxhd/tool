/*
 * @Author: zhengqi 
 * @Date: 2018-08-28 10:39:31 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-12 13:35:27
 */
/**
 * 组件和路由对应关系统一放在这里管理
 */
import React, { Component } from 'react';
import Loading from './page/loading';
import {
  BrowserRouter,
  Router,
  Route,
  Redirect,
  browserHistory as history,
  NavLink,
  withRouter,
  HashRouter,
  Link,
  Switch
} from 'react-router-dom';
import ClsReportCol from './page/re_classroomReportCol';
import ClsReportRule from './page/re_classroomReportRule';
import ClsReportTask from './page/re_classroomReportTask';
import ClsReportData from './page/re_classroomReportData';
import QuaReportCol from './page/re_qualityReportCol';
import QuaReportData from './page/re_qualityReportData';
import QuaReportTask from './page/re_qualityReportTask';
import QuaReportTea from './page/re_qualityReportTea';
import RepCustom from './page/re_reportCustom';
import RepSystem from './page/re_reportSystem';
import StuReportCol from './page/re_studentReportCol';
import StuReportData from './page/re_studentReportData';
import TeaReportAtt from './page/re_teacherReportAtt';
import TeaReportCol from './page/re_teacherReportCol';
import TeaReportData from './page/re_teacherReportData';
import TeaReportTea from './page/re_teacherReportTea';

import ClassroomDis from './page/sh_classroomDis';
import ClassroomQua from './page/sh_classroomQua';
import ClassroomStu from './page/sh_classroomStu';
import ClassroomTea from './page/sh_classroomTea';

// Error
import ErrorPage from './page/error';
import Pdf from './page/pdf';
import Initialize from './page/initialize';
import Setting from './page/setting';

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
      <div className="lxx-g-layout">
        {/* <Switch style={switchStyle} itemStyle={{ overflow: "scroll" }}> */}
        <Switch>
          {/* loadding */}
           <Route exact path="/loading" component={Loading} /> 
          {/* 报表中心页面 */}
          {/* 首页 */}
          <Route path="/bd/r_crc" component={ClsReportCol} />          {/*课堂秩序报表-学院报表*/}
          <Route path="/bd/r_crr" component={ClsReportRule} />         {/*课堂秩序报表-违纪事件报表*/}
          <Route path="/bd/r_crt" component={ClsReportTask} />         {/*课堂秩序报表-任务报表*/}
          <Route path="/bd/r_crd" component={ClsReportData} />         {/*课堂秩序报表-原始数据*/}
          <Route path="/bd/r_qrc" component={QuaReportCol} />          {/*课堂质量报表-学院报表*/}
          <Route path="/bd/r_qrd" component={QuaReportData} />         {/*课堂质量报表-原始数据*/}
          <Route path="/bd/r_qrta" component={QuaReportTask} />        {/*课堂质量报表-课堂任务报表*/}
          <Route path="/bd/r_qrte" component={QuaReportTea} />         {/*课堂质量报表-教师报表*/}
          <Route path="/bd/r_recu" component={RepCustom} />            {/*报告中心-自定义报告*/}
          <Route path="/bd/r_resy" component={RepSystem} />            {/*报告中心-系统报告*/}
          <Route path="/bd/r_src" component={StuReportCol} />          {/*学生出勤报表-学院报表*/}
          <Route path="/bd/r_srd" component={StuReportData} />         {/*学生出勤报表-原始数据*/}
          <Route path="/bd/r_tra" component={TeaReportAtt} />          {/*教师考勤报表-考勤异常类型报表*/}
          <Route path="/bd/r_trc" component={TeaReportCol} />          {/*教师考勤报表-学院报表*/}
          <Route path="/bd/r_trd" component={TeaReportData} />         {/*教师考勤报表-原始数据*/}
          <Route path="/bd/r_trt" component={TeaReportTea} />          {/*教师考勤报表-教师报表*/}
          {/* 可视化页面 */}
          {/* 首页 */}
          <Route exact path="/bd/s_crd" component={ClassroomDis} />    {/*可视化中心-课堂秩序*/}
          <Route path="/bd/s_crq" component={ClassroomQua} />          {/*可视化中心-课堂质量*/}
          <Route path="/bd/s_crs" component={ClassroomStu} />          {/*可视化中心-学生出勤*/}
          <Route path="/bd/s_crt" component={ClassroomTea} />          {/*可视化中心-教师考勤*/}

          {/* error报错页面 */}
          <Route path="/error" component={ErrorPage} />

          {/* pdf页面 */}
          <Route path="/pdf/:id" component={Pdf} />

          {/*初始化页面*/}
          <Route path="/init" component={Initialize} />

          {/*设置页面*/}
          <Route exact path="/setting" component={Setting} />
          
          <Redirect to="/loading" />   
        </Switch>
      </div>
    )
  }
}