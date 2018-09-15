/*
 * @Author: hf 
 * @Date: 2018-07-24 14:16:49 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 13:35:04
 */
/**
 * 学科  + 班级
 */
import React from 'react';
import { Select, Button, Radio } from 'antd';
import './../../css/mc_subClass.css';
import { getSubCurInfo_ac, ifChangeWhenSelect_ac } from './../../redux/mc_SubClass.reducer';
import { Tm_getScheduleList_ac } from '../../redux/tm_Table.reducer';
import { changeTabelOrList_ac } from './../../redux/b_teacherClassMan.reducer';
import { Tm_getCurTotalNum_ac, Tm_getPriCurNumOfTea_ac, Tm_getPubCurNumOfTea_ac } from './../../redux/tm_sourceTab.reducer';
import { connect } from 'react-redux';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@connect(
  state => state,
  { getSubCurInfo_ac, Tm_getScheduleList_ac, changeTabelOrList_ac, Tm_getCurTotalNum_ac, Tm_getPriCurNumOfTea_ac, Tm_getPubCurNumOfTea_ac, ifChangeWhenSelect_ac }
)
export default class TmSubClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selValue: {
        subInd: 'all',
        classInd: 'all'
      },
    }
  }

  componentWillReceiveProps(nextprops) {
    let SubClassReducer = nextprops.SubClassReducer;
    let B_TacherClassManReducer = nextprops.B_TacherClassManReducer;

    if (this.props.SubClassReducer != SubClassReducer && SubClassReducer) {
      let { subjectId, claId } = B_TacherClassManReducer.record_data;
      let { subClass, ifquery, condition } = SubClassReducer;
      if (subClass && this.props.SubClassReducer.subClass != subClass) {
        let param = {};
        let { acdYearId, semId, weekNum, semStartDate } = condition;
        if (!subjectId) {
          param = {
            acdYearId,
            semId,
            weekNum,
            semStartDate,
            "subjectId": 'all',
            "claId": 'all',
          };
          this.setState(
            {
              selValue: {
                subInd: 'all',
                classInd: 'all'
              },
            }
          );
        }
        else {
          param = B_TacherClassManReducer.record_data;
          this.dealData(SubClassReducer.subClass, param);
          if (!ifquery) {
            this.setState(
              {
                selValue: {
                  subInd: 'all',
                  classInd: 'all'
                },
              }
            );
          }
        }

        this.setState(
          {
            data: subClass,
          }
        );

      }

      if (!subjectId) {//未进二级页面
        if (ifquery && !B_TacherClassManReducer.record_data.semId || B_TacherClassManReducer.record_data != this.props.B_TacherClassManReducer.record_data) {
          let { acdYearId, semId, weekNum, semStartDate } = condition;
          let param = {
            "semId": condition.semId,
            "weekNum": condition.weekNum,
            "semStartDate": condition.semStartDate
          }
          this.props.Tm_getScheduleList_ac({ acdYearId, semId, weekNum, semStartDate });
          this.setRequest({ semId, weekNum, semStartDate })
        }
      } else {//进二级页面后
        if (ifquery && B_TacherClassManReducer.record_data.subjectId || B_TacherClassManReducer.record_data != this.props.B_TacherClassManReducer.record_data) {
          let { acdYearId, semId, weekNum, semStartDate } = condition;
          let param = {
            "semId": condition.semId,
            "weekNum": condition.weekNum,
            "semStartDate": condition.semStartDate
          }
          this.props.Tm_getScheduleList_ac({ acdYearId, semId, weekNum, semStartDate });
          this.setRequest({ semId, weekNum, semStartDate })
        }
      }
    }
  }

  // 处理数据
  dealData(data, currentData) {
    let { subjectId, claId } = currentData
    let { classInd, subInd } = this.state.selValue;
    if (subjectId == 'all') {
      return;
    } else {
      subInd = _.findIndex(data, function (o) { return o.subjectId == subjectId; });
      if (claId != 'all' && data.length) {
        classInd = _.findIndex(data[subInd].classList, function (o) { return o.classId == claId; });
      }

      this.setState({
        selValue: {
          subInd: subInd.toString(),
          classInd: classInd.toString()
        }
      })
    }

  }

  /**
   * 查询
   */
  queryHandle = () => {
    let { data, selValue } = this.state;
    var props = this.props.SubClassReducer;
    let param = {
      "acdYearId": props.condition.acdYearId,
      "semId": props.condition.semId,
      "semStartDate": props.condition.semStartDate,
      "weekNum": props.condition.weekNum,
      "subjectId": selValue.subInd == 'all' ? 'all' : data[selValue.subInd].subjectId,
      "claId": selValue.subInd == 'all' ? 'all' : selValue.classInd == 'all' ? 'all' : data[selValue.subInd].classList[selValue.classInd].classId
    }
    //课表
    this.props.Tm_getScheduleList_ac(param)
    this.setRequest(param)
  }

  setRequest = (param) => {
    //已完成总课堂数
    this.props.Tm_getCurTotalNum_ac(param)
    //公有课堂数
    this.props.Tm_getPubCurNumOfTea_ac(param)
    //私有课堂数
    this.props.Tm_getPriCurNumOfTea_ac(param)
  }

  /**
   * 科目选择
   */
  subChange = (ind) => {
    let data = this.state.data;
    this.setState({
      selValue: {
        subInd: ind,
        classInd: "all"
      }
    })
  }
  /**
   * 班级选择
   */
  classChange = (ind) => {
    let data = this.state.data;
    let selValue = this.state.selValue;
    selValue.classInd = ind;
    this.setState({
      selValue
    })
  }


  /**
   * radio切换：
   * table:按课表查看
   * list:按列表查看
   */
  RadiohandleChange = (e) => {
    this.props.changeTabelOrList_ac(e.target.value)
  }

  componentWillUnmount() {
    this.props.changeTabelOrList_ac('table');
    this.props.ifChangeWhenSelect_ac(true)
  }

  render() {
    let data = this.state.data;
    let selValue = this.state.selValue;
    let classData = [];
    if (data.length > 0 && selValue.subInd != 'all') {
      classData = data[selValue.subInd].classList;
    }

    let width = this.props.width;
    return (
      <div className="hf-msc-main" style={{ marginBottom: 30 }}>
        <Select value={selValue.subInd} style={{ width: width, marginRight: 20 }} onChange={this.subChange}>
          <Option value="all">全部科目</Option>
          {
            data.map((item, i) => {
              return <Option key={i} value={i.toString()} title={item.subName}>{item.subName}</Option>
            })
          }
        </Select>

        <Select value={selValue.classInd} style={{ width: width, marginRight: 20 }} onChange={this.classChange}>
          <Option value="all">全部班级</Option>
          {
            classData.map((item, i) => {
              return <Option key={i} value={i.toString()} title={item.className}>{item.className}</Option>
            })
          }
        </Select>

        <Button className="lxx-s-blue" onClick={this.queryHandle}>查询</Button>

        <RadioGroup defaultValue="table" style={{ marginLeft: 132 }} onChange={this.RadiohandleChange}>
          <RadioButton value="table">按课表查看</RadioButton>
          <RadioButton value="list">按列表查看</RadioButton>
        </RadioGroup>
      </div>
    )
  }
}