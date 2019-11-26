/*
 * @Author: JC.liu 
 * @Date: 2018-05-11 15:24:37 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:55:19
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import _x from '../../../../utils/_x/index';
import { G } from '../../../../utils/g';
import SelectPlace from '../../../../components/public_components/select';
const { Column } = Table;

export class Unverified_frist_component extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      data: [],
      orgCode: '',
      examid: '',
      orgTypeId: '',
      examSessionNum: G.examSessionNum
    }
    this._isMonuted = true;
    this.examId = JSON.parse(sessionStorage.getItem("examId"));
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }


  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    var examid = sessionStorage.getItem("examId");
    var orgCode = JSON.parse(sessionStorage.getItem("loginData")).orgCode;
    this.setState({
      examSessionNum: G.examSessionNum,
      examid,
      orgCode,
    })

    this.getData(orgCode, examid, G.examSessionNum);
  }

  componentWillUnmount() {
    this._isMonuted = false
  }

  getData(org, examid, examNum) {
    this.setState({
      loading: true
    })
    _x.request('/absenceGeneralManage/getAllExamCenterAbsenceData', {
      "orgCode": org,
      "examId": examid,
      "examSessionNum": examNum,
      "orgCodeFatherId": org,
      "reportSource": "6"
    }, (res) => {
      if (this._isMonuted) {
        if (res.result) {
          this.setState({
            data: res.data,
            loading: false
          })
        } else {
          this.setState({
            loading: false,
            data: [],
          })
        }
      }
    })
  }

  /**
  * 场次
  * @param {*} value 
  */
  Screening = (value) => {
    if (value) {
      this.getData(this.state.orgCode, this.state.examid, value);
    }
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
        <div className="ljc-table" >
          <Table
            key="unverified"
            loading={this.state.loading}
            pagination={false}
            dataSource={dataSource}
          >
            <Column title="机构名称" dataIndex="orgname" key="orgname" className="ljc-col-font-blue"
              render={(text, record) => {
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName": record.orgname,
                })
                let retId = encodeURIComponent(obj)
                if (record.orgTypeId !== 4) {
                  return <Link to={`/absent_supervise/absent_compare/compare_absent/unverified/${retId}`}>{text}</Link>
                } else {
                  return <Link to={`/absent_supervise/absent_compare/compare_absent/unverified/detail/${retId}`}>{text}</Link>
                }
              }}
            ></Column>
            <Column title="考生总数" dataIndex="totalExamineeNum" key="totalExamineeNum"></Column>
            <Column title="未验证且现场无缺考考生数" dataIndex="unverifiedApendSum" key="unverifiedApendSum" className="ljc-sf-font" ></Column>
            <Column title="最终缺考人数" dataIndex="confirmAbsentSum" key="confirmAbsentSum" className="ljc-sf-font"  ></Column>
            <Column title="详情" render={(text, record) => {
              let obj = JSON.stringify({
                "orgCode": record.orgCode,
                // "type": "scene",
                "schoolName": record.orgname,
                "orgTypeId": record.orgTypeId,
              })
              let retId = encodeURIComponent(obj)
              return <Link to={`/absent_supervise/absent_compare/compare_absent/unverified/detail/${retId}`}>
                <div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div>
              </Link>
            }}
            ></Column>
          </Table>
          <div className="zn-select-abs">
            <SelectPlace getSelect={this.Screening} />
          </div>
        </div>
      </div>
      </QueueAnim>
    )
  }
}