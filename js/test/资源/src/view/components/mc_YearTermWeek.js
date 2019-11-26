/*
 * @Author: hf 
 * @Date: 2018-07-24 09:59:11 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 19:06:42
 */

import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

import { getYearSemWeekInfo_ac, getCurrentYSW_ac } from '../../redux/mc_YearTermWeek.reducer';
import { getSubCurInfo_ac } from '../../redux/mc_SubClass.reducer';
import { getSemCurNum_ac, getScheduleList_ac } from './../../redux/mc_Table.reducer';
import { connect } from 'react-redux';

const Option = Select.Option;
@connect(
  state => state.YearTermWeekReducer,
  { getYearSemWeekInfo_ac, getSubCurInfo_ac, getCurrentYSW_ac, getSemCurNum_ac, getScheduleList_ac }
)
export default class McYearTermWeek extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selValue: {
        yearInd: "0",
        termInd: "0",
        weekInd: "0"
      },
    }
  }

  componentDidMount() {
    this.props.getYearSemWeekInfo_ac();
    this.props.getCurrentYSW_ac();
  }
  /**
   * 年级切换
   */
  YearChange = (ind) => {
    let data = this.state.data;
    this.setState({
      selValue: {
        yearInd: ind,
        termInd: "0",
        weekInd: "0"
      }
    })

    this.props.getSubCurInfo_ac({
      "acdYearId": data[ind].acdYearId,
      "semId": data[ind].semList[0].semId,
      "semStartDate": data[ind].semList[0].semBeginDate,
      "weekNum": "1",
    });

  }
  /**
   * 学期切换
   */
  TermChange = (ind) => {
    let data = this.state.data;
    let selValue = this.state.selValue;
    selValue.termInd = ind;
    selValue.weekInd = "0";
    this.setState({
      selValue
    });

    this.props.getSubCurInfo_ac({
      "semId": data[selValue.yearInd].semList[ind].semId,
      "semStartDate": data[selValue.yearInd].semList[ind].semBeginDate,
      "weekNum": "1",
    });

  }
  /**
   * 周次切换
   */
  WeekChange = (ind) => {
    let data = this.state.data;
    var selValue = this.state.selValue;
    selValue.weekInd = ind;
    this.setState({
      selValue
    })

    this.props.getSubCurInfo_ac({
      "weekNum": data[selValue.yearInd].semList[selValue.termInd].weeks[ind].weekTypeId,
    });
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      data: nextprops.yeartermweek,
      currentData: nextprops.currentData
    })

    if (nextprops.yeartermweek.length && nextprops.currentData.acdYearId) {
      this.dealData(nextprops.yeartermweek, nextprops.currentData);
    }
  }

  // 处理数据
  dealData(data, currentData) {

    var { acdYearId, semId, weekNum } = currentData;
    var { yearInd, termInd, weekInd } = this.state.selValue;
    yearInd = _.findIndex(data, function (o) { return o.acdYearId == acdYearId; });
    termInd = _.findIndex(data[yearInd].semList, function (o) { return o.semId == semId; });
    weekInd = _.findIndex(data[yearInd].semList[termInd].weeks, function (o) { return o.weekTypeId == weekNum; });

    this.setState({
      selValue: {
        yearInd: yearInd.toString(),
        termInd: termInd.toString(),
        weekInd: weekInd.toString()
      }
    })

    this.props.getSubCurInfo_ac({
      "acdYearId": data[yearInd].acdYearId,
      "semId": data[yearInd].semList[termInd].semId,
      "semStartDate": data[yearInd].semList[termInd].semBeginDate,
      "weekNum": data[yearInd].semList[termInd].weeks[weekInd].weekTypeId,
    });

    /**
     * 获取学期总课堂数
     */
    this.props.getSemCurNum_ac({
      "acdYearId": data[yearInd].acdYearId,
      "semId": data[yearInd].semList[termInd].semId,
      "weekNum": data[yearInd].semList[termInd].weeks[weekInd].weekTypeId,
    });

  }
  render() {

    var selValue = this.state.selValue;
    var data = this.state.data;
    var termData = [], weeksData = [];
    if (data.length > 0) {
      termData = data[selValue.yearInd].semList;
      weeksData = termData[selValue.termInd].weeks;
    }

    return (
      <div className="hf-mcytw-main" style={{ margin: '30px 0 20px 0' }}>
        <Select value={selValue.yearInd} style={{ width: 200, marginRight: 20 }} onChange={this.YearChange}>
          {
            data.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.acdYearId} 学年</Option>
            })
          }
        </Select>
        <Select value={selValue.termInd} style={{ width: 200, marginRight: 20 }} onChange={this.TermChange}>
          {
            termData.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.semTypeId == 1 ? '上学期' : '下学期'}</Option>
            })
          }
        </Select>
        <Select value={selValue.weekInd} style={{ width: 200, marginRight: 20 }} onChange={this.WeekChange}>
          {
            weeksData.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.weekTypeName}</Option>
            })
          }
        </Select>
      </div>
    )
  }
}