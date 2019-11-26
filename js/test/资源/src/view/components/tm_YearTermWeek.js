/*
 * @Author: hf 
 * @Date: 2018-07-24 09:59:11 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 09:46:14
 */

import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';

import { getYearSemWeekInfo_ac, getCurrentYSW_ac, changeCurrentWeek_ac } from '../../redux/mc_YearTermWeek.reducer';
import { getSubCurInfo_ac, ifChangeWhenSelect_ac } from '../../redux/mc_SubClass.reducer';
import { getColSubTeaClaTree_ac, mm_ifChangeWhenSelect_ac } from '../../redux/mm_SubClass.reducer';
import { connect } from 'react-redux';

const Option = Select.Option;
@connect(
  state => state,
  {
    getYearSemWeekInfo_ac,
    getSubCurInfo_ac,
    getCurrentYSW_ac,
    ifChangeWhenSelect_ac,
    getColSubTeaClaTree_ac,
    mm_ifChangeWhenSelect_ac,
    changeCurrentWeek_ac
  }
)
export default class TmYearTermWeek extends React.Component {

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
    let data = this.props.YearTermWeekReducer.yeartermweek;
    this.setState({
      selValue: {
        yearInd: ind,
        termInd: "0",
        weekInd: "0"
      }
    })
    let role = this.props.role;
    let param = {
      "acdYearId": data[ind].acdYearId,
      "semId": data[ind].semList[0].semId,
      "semStartDate": data[ind].semList[0].semBeginDate,
      "weekNum": "1",
    }
    if (role == 'teacher') {
      this.props.getSubCurInfo_ac(param);
      this.props.ifChangeWhenSelect_ac(false)
    } else {
      this.props.getColSubTeaClaTree_ac(param);
      this.props.mm_ifChangeWhenSelect_ac(false)
    }

  }
  /**
   * 学期切换
   */
  TermChange = (ind) => {
    let data = this.props.YearTermWeekReducer.yeartermweek;
    let selValue = this.state.selValue;
    selValue.termInd = ind;
    selValue.weekInd = "0";
    this.setState({
      selValue
    });

    let role = this.props.role;
    let param = {
      "semId": data[selValue.yearInd].semList[ind].semId,
      "semStartDate": data[selValue.yearInd].semList[ind].semBeginDate,
      "weekNum": "1",
    }
    if (role == 'teacher') {
      this.props.getSubCurInfo_ac(param);
      this.props.ifChangeWhenSelect_ac(false)
    } else {
      this.props.getColSubTeaClaTree_ac(param);
      this.props.mm_ifChangeWhenSelect_ac(false)
    }

  }
  /**
   * 周次切换
   */
  WeekChange = (ind) => {
    let data = this.props.YearTermWeekReducer.yeartermweek;
    var selValue = this.state.selValue;
    selValue.weekInd = ind;
    this.setState({
      selValue
    })

    let role = this.props.role;
    let param = {
      "weekNum": data[selValue.yearInd].semList[selValue.termInd].weeks[ind].weekTypeId,
    };
    if (role == 'teacher') {
      this.props.getSubCurInfo_ac(param);
      this.props.ifChangeWhenSelect_ac(false)
    } else {
      this.props.getColSubTeaClaTree_ac(param);
      this.props.mm_ifChangeWhenSelect_ac(false)
    }
  }

  componentWillReceiveProps(nextprops) {

    let YearTermWeekReducer = nextprops.YearTermWeekReducer;
    if (this.props.YearTermWeekReducer != YearTermWeekReducer) {
      let Tm_timeTableReducer = nextprops.Tm_timeTableReducer;
      let B_ManagerClassManReducer = nextprops.B_ManagerClassManReducer;
      let B_TacherClassManReducer = nextprops.B_TacherClassManReducer;
      let role = this.props.role;

      if (role == 'manager') {
        if (B_ManagerClassManReducer.record_data.acdYearId) {//二级页面跳转到页面
          if (YearTermWeekReducer.yeartermweek.length) {
            this.dealData(YearTermWeekReducer.yeartermweek, B_ManagerClassManReducer.record_data);
          }
        } else {
          if (YearTermWeekReducer.yeartermweek.length && YearTermWeekReducer.currentData.acdYearId) {
            this.dealData(YearTermWeekReducer.yeartermweek, YearTermWeekReducer.currentData);
          }
        }
      } else {
        if (B_TacherClassManReducer.record_data.acdYearId) {//二级页面跳转到页面
          this.setState({
            currentData: B_TacherClassManReducer.record_data
          })

          if (YearTermWeekReducer.yeartermweek.length) {
            this.dealData(YearTermWeekReducer.yeartermweek, B_TacherClassManReducer.record_data);
          }
        } else {
          if (YearTermWeekReducer.yeartermweek.length && YearTermWeekReducer.currentData.acdYearId) {
            this.dealData(YearTermWeekReducer.yeartermweek, YearTermWeekReducer.currentData);
          }
        }
      }

    }
  }

  // 处理数据
  dealData(data, currentData) {
    var { acdYearId, semId, weekNum } = currentData;
    console.log(currentData)
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

    let role = this.props.role;
    let param = {
      "acdYearId": data[yearInd].acdYearId,
      "semId": data[yearInd].semList[termInd].semId,
      "semStartDate": data[yearInd].semList[termInd].semBeginDate,
      "weekNum": data[yearInd].semList[termInd].weeks[weekInd].weekTypeId,
    };

    if (role == 'teacher') {
      this.props.getSubCurInfo_ac(param);
      // this.props.ifChangeWhenSelect_ac(false)
    } else {
      this.props.getColSubTeaClaTree_ac(param);
      // this.props.mm_ifChangeWhenSelect_ac(false)
    }
  }

  componentWillUnmount() {
    this.props.changeCurrentWeek_ac(true)
  }
  render() {

    var selValue = this.state.selValue;
    var data = this.props.YearTermWeekReducer.yeartermweek;
    var termData = [], weeksData = [];
    if (data.length > 0) {
      termData = data[selValue.yearInd].semList;
      weeksData = termData[selValue.termInd].weeks;
    }

    const width = this.props.width;
    return (
      <div className="hf-mcytw-main" style={{ width: (width + 30) * 3 }}>
        <Select value={selValue.yearInd} style={{ width: width + 30, marginRight: 20 }} onChange={this.YearChange}>
          {
            data.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.acdYearId} 学年</Option>
            })
          }
        </Select>
        <Select value={selValue.termInd} style={{ width: width, marginRight: 20 }} onChange={this.TermChange}>
          {
            termData.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.semTypeId == 1 ? '上学期' : '下学期'}</Option>
            })
          }
        </Select>
        <Select value={selValue.weekInd} style={{ width: width, marginRight: 20 }} onChange={this.WeekChange}>
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