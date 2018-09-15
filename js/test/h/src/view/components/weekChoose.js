/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 18:41:37
 */

import React from 'react';
import { message } from 'antd';
import { getYearSemWeekInfo_ac, changeCurrentWeek_ac } from '../../redux/mc_YearTermWeek.reducer';
import { getScheduleList_ac } from '../../redux/mc_Table.reducer';
import { getSubCurInfo_ac, ifChangeWhenSelect_ac } from '../../redux/mc_SubClass.reducer';
import { connect } from 'react-redux';
import { recordWhenJump_ac } from './../../redux/b_managerClassMan.reducer';
import { tm_recordWhenJump_ac } from './../../redux/b_teacherClassMan.reducer';
@connect(
  state => state,
  {
    getYearSemWeekInfo_ac,
    getSubCurInfo_ac,
    getScheduleList_ac,
    changeCurrentWeek_ac,
    ifChangeWhenSelect_ac,
    recordWhenJump_ac,
    tm_recordWhenJump_ac
  }
)
export default class WeekChoose extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  /**
   * 上一周
   */
  preHandle = () => {
    let { allWeek, weekInd } = this.weekDeal();
    if (weekInd === 0) {
      message.warning('已到第一周')
      return false;
    } else {
      weekInd--;
      this.weekChange(allWeek, weekInd)
    }
  }

  /**
   * 周次切换
   */
  weekChange = (allWeek, weekInd) => {
    let props = this.props, currentDatas;
    if (props.Role == 'manager') {
      let { acdYearId, semId, weekNum } = this.props.Mm_timeTableReducer.condition;
      currentDatas = {
        "semId": semId,
        "weekNum": Number(allWeek[weekInd].weekTypeId),
        "acdYearId": acdYearId
      }
      this.props.changeCurrentWeek_ac(currentDatas);
      this.props.recordWhenJump_ac(currentDatas);
      this.props.ifChangeWhenSelect_ac(true);// 针对管理后台，点击查询才出发按钮
    }
    else if (props.Role == 'teacher') {
      let { acdYearId, semId, weekNum } = this.props.Tm_timeTableReducer.condition;
      currentDatas = {
        "semId": semId,
        "weekNum": Number(allWeek[weekInd].weekTypeId),
        "acdYearId": acdYearId
      };
      this.props.changeCurrentWeek_ac(currentDatas);
      this.props.tm_recordWhenJump_ac(currentDatas);
      this.props.ifChangeWhenSelect_ac(true);// 针对管理后台，点击查询才出发按钮
    }
    else if (props.Role == 'reception') {
      let { acdYearId, semId, weekNum } = this.props.timeTableReducer.condition;
      currentDatas = {
        "semId": semId,
        "weekNum": Number(allWeek[weekInd].weekTypeId),
        "acdYearId": acdYearId
      };
      this.props.changeCurrentWeek_ac(currentDatas);
    }
  }

  /**
    * 处理周数，返回所有周的数据和当前周的ID
    */
  weekDeal = () => {
    let props = this.props;
    let data = props.YearTermWeekReducer.yeartermweek;
    let weekInd, termInd, yearInd, allWeek;
    if (props.Role == 'manager') {
      let { acdYearId, semId, weekNum } = props.Mm_timeTableReducer.condition;
      yearInd = _.findIndex(data, function (o) { return o.acdYearId == acdYearId });
      termInd = _.findIndex(data[yearInd].semList, function (o) { return o.semId == semId });
      weekInd = _.findIndex(data[yearInd].semList[termInd].weeks, function (o) { return o.weekTypeId == weekNum });
      allWeek = data[yearInd].semList[termInd].weeks;
    }
    else if (props.Role == 'teacher') {
      let { acdYearId, semId, weekNum } = props.Tm_timeTableReducer.condition;
      yearInd = _.findIndex(data, function (o) { return o.acdYearId == acdYearId });
      termInd = _.findIndex(data[yearInd].semList, function (o) { return o.semId == semId });
      weekInd = _.findIndex(data[yearInd].semList[termInd].weeks, function (o) { return o.weekTypeId == weekNum });
      allWeek = data[yearInd].semList[termInd].weeks;
    }
    else if (props.Role == 'reception') {
      yearInd = _.findIndex(data, function (o) { return o.acdYearId == props.SubClassReducer.condition.acdYearId; });
      termInd = _.findIndex(data[yearInd].semList, function (o) { return o.semId == props.SubClassReducer.condition.semId; });
      weekInd = _.findIndex(data[yearInd].semList[termInd].weeks, function (o) { return o.weekTypeId == props.SubClassReducer.condition.weekNum; });
      allWeek = data[yearInd].semList[termInd].weeks;
    }
    return { allWeek, weekInd }
  }
  /**
    * 下一周
    */
  nextHandle = () => {
    let { allWeek, weekInd } = this.weekDeal();
    if (weekInd === allWeek.length - 1) {
      message.warning('已到最后一周')
      return false;
    } else {
      weekInd++;
      this.weekChange(allWeek, weekInd);
    }
  }

  render() {
    let styleCss = {
      container: {
        display: 'flex',
      },
      icon: {
        color: '#30a2f2',
        cursor: 'pointer',
        userSelect: 'none'
      },
      text: {
        margin: '0 15px'
      }
    }
    return (
      <div style={styleCss.container}>
        <div style={styleCss.icon} onClick={this.preHandle}>
          <svg className="icon" aria-hidden="true">
            <use xlinkHref={"#icon-lastWeek"}></use>
          </svg>
          <span style={styleCss.text}>上一周</span>
        </div>
        <div style={styleCss.icon} onClick={this.nextHandle}>
          <span style={styleCss.text}>下一周</span>
          <svg className="icon" style={styleCss.icon} aria-hidden="true">
            <use xlinkHref={"#icon-nextWeek"}></use>
          </svg>
        </div>
      </div>
    )
  }
}