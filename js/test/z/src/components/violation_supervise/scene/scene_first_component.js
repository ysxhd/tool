/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:41:35 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:59:17
 * 违规 -> 现场监考违规 
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import {  Link } from 'react-router-dom';
import { Table, Select } from 'antd';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import _ from 'lodash'
const { Column } = Table;
const Option = Select.Option;

export class Scene_first_component extends Component {

  constructor() {
    super();
    this.state = {
      pagination: {
        total: 0,
        pageSize: 20
      },
      loading: false,
      examSessionNum: '',
      examid: '',
    }
    this._isMounted = true
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }

  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      examSessionNum: G.examSessionNum
    })

    var examid = sessionStorage.getItem("examId");
    var loginData = JSON.parse(sessionStorage.getItem("loginData"));
    this.setState({
      orgCode: loginData.orgCode,
      examid
    })
    this.getData(G.examSessionNum, loginData.orgCode, examid);
  }

  getData(examNum, org, examid) {
    this.setState({
      loading: true
    })
    // var exam = examNum ? examNum :this.state.examSessionNum;
    _x.request('/disciplineManage/getDisciplineCountDataBySource', {
      'examId': examid,
      'examSessionNum': examNum,
      'orgCode': org,
      'orgCodeFatherId': org,
      "reportSource": "2"
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
    if (value) {
      this.setState({
        examSessionNum: value
      })
      G.examSessionNum = value;
      this.getData(value, this.state.orgCode, this.state.examid);
    }
  }
  componentWillUnmount() {
    this._isMounted = true
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
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}></div>

          <Select defaultValue={this.state.examSessionNum} className="fr" style={{ width: 174 }} onChange={this.Screening}>
            {this.allExam.map((val, i) => {
              return <Option key={i} value={val.examSessionNum}>{val.subjectName}</Option>
            })}
          </Select>
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>
        {
          <div className="ljc-table" >
            <Table key="site_invigilate"
              loading={this.state.loading}
              pagination={false}
              dataSource={dataSource}
            >
              <Column title="机构名称" dataIndex="orgname" key="orgname" className="ljc-col-font-blue"
                render={(text, record) => {
                  let obj = JSON.stringify({
                    "orgCode": record.orgCode,
                    "type": "scene",
                    "schoolName": record.orgname,
                    "orgTypeId": record.orgTypeId
                  })
                  let retId = encodeURIComponent(obj)
                  if (record.orgTypeId === 4) {
                    return <Link to={`/violation_supervise/site_invigilate/detail/${retId}`}>{text}</Link>
                  } else {
                    return <Link to={`/violation_supervise/site_invigilate/${retId}`}>{text}</Link>
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
              <Column title="违规人数" className="ljc-sf-font" dataIndex="localAppearSum" key="localAppearSum"></Column>
              <Column title="最终违规人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="confirmAbsentSum"></Column>
              <Column title="详情" render={(text, record) => {
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "schoolName": record.orgname,
                  "orgTypeId": record.orgTypeId,
                  "type": "scene",
                })
                let retId = encodeURIComponent(obj)
                return <Link to={`/violation_supervise/site_invigilate/detail/${retId}`}>
                  <div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div>
                </Link>
              }}
              ></Column>
            </Table>
          </div>


        }

      </div>
      </QueueAnim>
    )
  }
}