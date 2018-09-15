/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:22:14 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:53:43
 * 缺考 -> 现场监考
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table  } from 'antd';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import _ from 'lodash'
import SelectPlace from '../../../components/public_components/select';

const { Column } = Table;

export class Scene_first_component extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        total: 0,
        pageSize: 20
      },
      pageindex: 1,
      reportSource: "2",
      examSessionNum: '',
      loading: false,
      orgCode: '',
      examid: '',
    }
    this._isMounted = true
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;

  }

  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }

    var examid = sessionStorage.getItem("examId");
    var orgCode = JSON.parse(sessionStorage.getItem("loginData")).orgCode;
    this.setState({
      orgCode,
      examSessionNum: G.examSessionNum,
      examid
    })
    this.getData(G.examSessionNum, orgCode, examid);
  }

  getData(examNum, org, examid) {
    this.setState({
      loading: true
    })
    _x.request('/absenceGeneralManage/getAllExamCenterAbsenceData', {
      'examId': examid,
      'examSessionNum': examNum,
      'orgCode': org,
      'orgCodeFatherId': org,
      'reportSource': "2",
    }, function (ret) {
      if (this._isMounted) {
        this.setState({
          loading: false
        })
        if (ret.result && ret.data) {
          this.setState({
            data: ret.data
          })
        } else {
          this.setState({
            data: []
          })
        }
      }
    }.bind(this))
  }

  /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    if (value) {
      this.getData(value, this.state.orgCode, this.state.examid)
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
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}></div>
          <SelectPlace getSelect={this.Screening} />
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>

        {
          <div className="ljc-table" >
            <Table key="site"
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
                    return <Link to={`/absent_supervise/site_invigilate/detail/${retId}`}>{text}</Link>
                  } else {
                    return <Link to={`/absent_supervise/site_invigilate/${retId}`}>{text}</Link>
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
              <Column title="缺考人数" className="ljc-sf-font" dataIndex="localAppearSum" key="localAppearSum"></Column>
              <Column title="最终缺考人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="confirmAbsentSum"></Column>
              <Column title="详情" render={(text, record) => {
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "type": "scene",
                  "schoolName": record.orgname,
                  "orgTypeId": record.orgTypeId,
                })
                let retId = encodeURIComponent(obj)
                return <Link to={`/absent_supervise/site_invigilate/detail/${retId}`}>
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