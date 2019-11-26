/*
 * @Author: hf 
 * @Date: 2018-07-24 14:16:49 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:13
 */
/**
 * 学科  + 班级
 */
import React from 'react';
import { Select, Button, Radio, Modal } from 'antd';
import './../../css/mc_subClass.css';
import MmAutoPublic from './mm_autoPublic';
import { HfModal } from './../common';
import { changeCurrentWeek_ac } from '../../redux/mc_YearTermWeek.reducer';
import { Mm_getCurTableOfAdmin_ac } from './../../redux/mm_Table.reducer';
import { getCol_ac, mm_ifChangeWhenSelect_ac } from './../../redux/mm_SubClass.reducer';
import { Mm_getCurTotalNum_ac, Mm_getPublicCurNum_ac, Mm_getPrivateCurNum_ac } from './../../redux/mm_sourceTab.reducer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
@withRouter
@connect(
  state => state,
  {
    Mm_getCurTableOfAdmin_ac,
    Mm_getCurTotalNum_ac,
    Mm_getPublicCurNum_ac,
    Mm_getPrivateCurNum_ac,
    getCol_ac,
    mm_ifChangeWhenSelect_ac,
    changeCurrentWeek_ac
  }
)
export default class MmSubClass extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      classData: [],
      selValue: {
        subInd: 'all',
        classInd: 'all',
        teacherInd: 'all',
        academyInd: 'all'
      },
      ModalShowOrHide: false
    }
  }

  componentWillReceiveProps(nextprops) {

    let MmSubClassReducer = nextprops.MmSubClassReducer;
    if (this.props.MmSubClassReducer != MmSubClassReducer) {
      /**
        * 班级数据
        */
      if (this.props.MmSubClassReducer.class_data != MmSubClassReducer.class_data && MmSubClassReducer.class_data) {
        let selValue = this.state.selValue;
        this.setState({
          classData: MmSubClassReducer.class_data,
        });
      }
      let param = {};
      let { grdGroupId } = nextprops.B_ManagerClassManReducer.record_data;
      let { acdYearId, semId, weekNum, semStartDate } = this.props.MmSubClassReducer.condition;
      if (!grdGroupId) {
        param = {
          acdYearId,
          semId,
          weekNum,
          semStartDate,
          grdGroupId: 'all',
          subjectId: 'all',
          claId: 'all',
          teacherId: 'all'
        }
      }
      else {
        param = nextprops.B_ManagerClassManReducer.record_data;
        this.dealData(this.props.MmSubClassReducer.subClass, MmSubClassReducer.class_data, param)
      }
      // console.log(grdGroupId, this.props.B_ManagerClassManReducer.record_data, nextprops.B_ManagerClassManReducer.record_data)
      // if (!grdGroupId || this.props.B_ManagerClassManReducer.record_data != nextprops.B_ManagerClassManReducer.record_data) {
      if (MmSubClassReducer.ifquery) {
        let { semId, weekNum, semStartDate, acdYearId } = MmSubClassReducer.condition;
        // console.log(param)
        this.props.Mm_getCurTableOfAdmin_ac(param);
        this.setRequest({ semId, weekNum, semStartDate })
      }
      // }
    }

  }

  // 处理数据
  dealData(data, classData, currentData) {
    let { grdGroupId, subjectId, claId, teacherId } = currentData
    let { classInd, subInd, teacherInd, academyInd } = this.state.selValue;
    if (grdGroupId == 'all') {
      return;
    } else {
      academyInd = _.findIndex(data, function (o) { return o.trgId == grdGroupId; });
      if (subjectId != 'all' && data.length) {
        subInd = _.findIndex(data[academyInd].subjectList, function (o) { return o.subjectId == subjectId; });
        if (data[academyInd].subjectList.length && teacherId != 'all') {
          teacherInd = _.findIndex(data[academyInd].subjectList[subInd].userList, function (o) { return o.userId == teacherId; });
        }
      }

      this.setState({
        selValue: {
          academyInd: academyInd.toString(),
          subInd: subInd.toString(),
          teacherInd: teacherInd.toString(),
          classInd: classInd.toString()
        }
      })
    }

  }


  /**
 * 查询
 */
  queryHandle = () => {
    var data = this.props.MmSubClassReducer.subClass;
    var selValue = this.state.selValue;
    var grdGroupId = 'all', subjectId = 'all', claId = 'all', teacherId = 'all', classData = [], subjectData = [], teacherData = [];
    if (data.length > 0 && selValue.academyInd != 'all') {
      grdGroupId = data[selValue.academyInd].trgId;
      subjectData = data[selValue.academyInd].subjectList || [];
      if (subjectData.length > 0 && selValue.subInd != 'all') {
        subjectId = subjectData[selValue.subInd].subjectId;
        teacherData = subjectData[selValue.subInd].userList || [];
        if (teacherData.length > 0 && selValue.teacherInd != 'all') {
          teacherId = teacherData[selValue.teacherInd].userId;
        }
      }
    }


    classData = this.state.classData;
    if (classData.length > 0 && selValue.classInd != 'all') {
      claId = classData[selValue.classInd].classId
    }

    let { acdYearId, semId, semStartDate, weekNum } = this.props.MmSubClassReducer.condition;

    this.props.Mm_getCurTableOfAdmin_ac(
      {
        acdYearId,
        semId,
        semStartDate,
        weekNum,
        "grdGroupId": grdGroupId,
        "subjectId": subjectId,
        "claId": claId,
        "teacherId": teacherId
      }
    );
    this.setRequest({
      semId,
      weekNum,
      "grdId": grdGroupId,
      "subjectId": subjectId,
      "claId": claId,
      "teacherId": teacherId
    });
  }

  setRequest = (param) => {
    this.props.Mm_getCurTotalNum_ac(param);
    this.props.Mm_getPublicCurNum_ac(param);
    this.props.Mm_getPrivateCurNum_ac(param);
  }

  /**
   *学院选择
   */
  academyChange = (ind) => {
    let data = this.props.MmSubClassReducer.subClass;
    this.setState({
      selValue: {
        academyInd: ind,
        subInd: 'all',
        teacherInd: 'all',
        classInd: "all",
      }
    })
  }
  /**
   * 科目选择
   */
  subChange = (ind) => {
    let selValue = this.state.selValue;
    let data = this.props.MmSubClassReducer.subClass;
    this.setState({
      selValue: {
        academyInd: selValue.academyInd,
        subInd: ind,
        teacherInd: 'all',
        classInd: "all"
      }
    })
  }
  /**
  * 老师选择
  */
  teacherChange = (ind) => {
    let data = this.props.MmSubClassReducer.subClass;
    let selValue = this.state.selValue;
    this.setState({
      selValue: {
        academyInd: selValue.academyInd,
        subInd: selValue.subInd,
        teacherInd: ind,
        classInd: "all",
      }
    });

    this.props.getCol_ac({
      "semId": this.props.MmSubClassReducer.condition.semId,
      "grdGroupId": data[selValue.academyInd].trgId,
      "subjectId": data[selValue.academyInd].subjectList[selValue.subInd].subjectId,
      "teacherId": ind == 'all' ? 'all' : data[selValue.academyInd].subjectList[selValue.subInd].userList[ind].userId
    })
    this.props.mm_ifChangeWhenSelect_ac(false)
  }


  /**
   * 班级选择
   */
  classChange = (ind) => {
    let selValue = this.state.selValue;
    selValue.classInd = ind;
    this.setState({
      selValue
    })
  }


  /**
    * 打开弹窗
    */

  openModal = () => {
    this.setState({
      ModalShowOrHide: true
    })
  }

  /**
   * 关闭Modal
   */

  closeModal = () => {
    this.setState({
      ModalShowOrHide: false
    })
  }

  render() {
    let data = this.props.MmSubClassReducer.subClass;
    let { academyInd, subInd, teacherInd, classInd } = this.state.selValue;
    let classData = this.state.classData;
    let subjectData = [], teacherData = [];
    if (data.length > 0 && academyInd != 'all' && academyInd != '-1') {
      subjectData = data[academyInd].subjectList || [];
      if (subjectData.length > 0 && subInd != 'all') {
        teacherData = subjectData[subInd].userList || [];
      }
    }

    let width = this.props.width;
    return (
      <div className="hf-msc-main" style={{ marginBottom: 30 }}>
        <Select value={academyInd} style={{ width: width, marginRight: 20 }} onChange={this.academyChange}>
          <Option value="all">全部学院</Option>
          {
            data.map((item, i) => {
              return <Option key={i} value={i.toString()} title={item.trgName}>{item.trgName}</Option>
            })
          }
        </Select>

        <Select value={subInd} style={{ width: width, marginRight: 20 }} onChange={this.subChange}>
          <Option value="all">全部科目</Option>
          {
            subjectData.map((item, i) => {
              return <Option key={i} value={i.toString()} title={item.subName}>{item.subName}</Option>
            })
          }
        </Select>

        <Select
          showSearch
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          value={teacherInd}
          style={{ width: width, marginRight: 20 }}
          onChange={this.teacherChange}
          notFoundContent={null}
        >
          <Option value="all">全部教师</Option>
          {
            teacherData.map((item, i) => {
              return <Option key={i} value={i.toString()}>{item.username}</Option>
            })
          }
        </Select>

        <Select value={classInd} style={{ width: width, marginRight: 20 }} onChange={this.classChange}>
          <Option value="all">全部班级</Option>
          {
            classData.map((item, i) => {
              return <Option key={i} value={i.toString()} title={item.className}>{item.className}</Option>
            })
          }
        </Select>

        <Button className="lxx-s-blue" onClick={this.queryHandle}>查询</Button>

        <Button onClick={this.openModal} style={{ marginLeft: 80 }}>课堂自动发布设置</Button>
        <HfModal
          ModalShowOrHide={this.state.ModalShowOrHide}
          closeModal={this.closeModal}
          width={600}
          title="课堂自动发布设置"
          contents={<MmAutoPublic closeModal={this.closeModal} />} />
      </div>
    )
  }
}

