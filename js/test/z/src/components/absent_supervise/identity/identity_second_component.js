/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:23:09 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 16:01:20
 * 缺考 -> 身份验证缺考组件
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import { Table  } from 'antd';
import { Link } from 'react-router-dom';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import _ from 'lodash';
import SelectPlace from '../../public_components/select';
const { Column } = Table;

export class Identity_second_component extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        total: 0,
        pageSize: 20
      },
      loading: false,
      pageindex: 1,

      examId: '',    // 考试计划
      orgCode: '',   // 机构代码
      examSessionNum: '',
      orgTypeId: '',   // 机构类型id 
      reportSource: "1",    // 缺考上报来源  （1：身份验证缺考 2：现场缺考  3：视频缺考  4：阅卷缺考  5：成绩缺考）   
      examid: '',
      // _isMounted: true
    }
    this._isMounted = true
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }

  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }

    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var orgTypeId = params.orgTypeId,
      orgCode = params.orgCode;
    this.setState({
      orgTypeId,
      orgCode,
      examid,
      examSessionNum: G.examSessionNum
    })

    this.getData(orgCode, G.examSessionNum, examid);
  }

  componentWillReceiveProps(nextProps) {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(nextProps.match.params.id))
    var orgTypeId = params.orgTypeId,
      orgCode = params.orgCode;

    this.setState({
      orgTypeId,
      orgCode,
      examid,
      examSessionNum: G.examSessionNum
    })

    this.getData(orgCode, G.examSessionNum, examid);
  }

  /**
   * 
   * @param {*} org        机构代码
   * @param {*} examNum    场次
   * @param {*} paegindex  页数
   */
  getData(org, examNum, examid) {
    this.setState({
      loading: true
    })
    // var exam = examNum ? examNum : this.state.examSessionNum;
    _x.request('/absenceGeneralManage/getAllExamCenterAbsenceData', {
      'examId': examid,
      'examSessionNum': examNum,
      'orgCode': org,
      'orgCodeFatherId': org,
      'reportSource': "1",
    }, function (ret) {
      if (this._isMounted) {
        if (ret.result && ret.data) {
          this.setState({
            data: ret.data
          })
        } else {
          this.setState({
            data: []
          })
        }
        this.setState({
          loading: false
        })
      }
    }.bind(this))
  }

  /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    console.log(value)
    if (value) {
      this.getData(this.state.orgCode, value, this.state.examid)
    }
  }


  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const dataSource = this.state.data && this.state.data.length ?
      this.state.data.map((item, index) => {
        return {
          ...item,
          key: index + 1
        }
      })
      : []
    return (
      <QueueAnim delay={300} type="bottom" className="queue-simple">
      <div key="1" className="zn-decre-bg" >
        <div className="zn-decre-head clearfix">
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i></div>
          <SelectPlace getSelect={this.Screening} />
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>
        <div className="ljc-table" >
          <Table
            key="identity"
            loading={this.state.loading}
            pagination={false}
            dataSource={dataSource}
          >
            <Column title="机构名称" dataIndex="orgname" key="orgname" className="ljc-col-font-blue"
              render={(text, record) => {
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "type": "sf",
                  "orgTypeId": record.orgTypeId,
                  "schoolName": record.orgname,
                })
                let retId = encodeURIComponent(obj)
                if (record.orgTypeId === 4) {
                  return <Link to={`/absent_supervise/authentication_absent/detail/${retId}`}>{text}</Link>
                } else {
                  return <Link to={`/absent_supervise/authentication_absent/${retId}`}>{text}</Link>
                }
              }}
            ></Column>
            <Column title="机构类型" dataIndex="orgTypeId" key="orgTypeId"
              render={(text, record) => {
                var orgTypeIdData = JSON.parse(sessionStorage.getItem("orgType"))
                var data = _.find(orgTypeIdData, { orgTypeId: text });
                if (data) {
                  return data.orgTypeName
                } else {
                  return ' '
                }
              }}
            ></Column>
            <Column title="考生总数" dataIndex="totalExamineeNum" key="totalExamineeNum"></Column>
            <Column title="入场人数" dataIndex="attendanceNum" key="attendanceNum"></Column>
            <Column title="验证通过人数" dataIndex="passVerifyNum" key="passVerifyNum"></Column>
            <Column title="缺考人数" className="ljc-sf-font" dataIndex="authenticationSum" key="authenticationSum"></Column>
            <Column title="最终缺考人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="confirmAbsentSum"></Column>
            <Column title="详情" render={(text, record) => {
              let obj = JSON.stringify({
                "orgCode": record.orgCode,
                "type": "sf",
                "schoolName": record.orgname,
                "orgTypeId": record.orgTypeId,
              })
              let retId = encodeURIComponent(obj)
              return <Link to={`/absent_supervise/authentication_absent/detail/${retId}`}>
                <div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div>
              </Link>
            }}
            ></Column>
          </Table>
        </div>
      </div>
      </QueueAnim>
    )
  }
}