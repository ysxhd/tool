/*
 * @Author: JC.liu 
 * @Date: 2018-04-30 11:08:33 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:54:49
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import _x from '../../../../utils/_x/index';
import { G } from '../../../../utils/g';
import SelectPlace from '../../../../components/public_components/select';

const { Column } = Table;
export class Unverified_Detail extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      schoolName: "",
      loading: false,
      orgCode: '',
      examid: '',
      orgTypeId: '',
      examSessionNum: G.examSessionNum
    }
    this._isMounted = true;
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }

  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var orgTypeId = params.orgTypeId,
      orgCode = params.orgCode,
      schoolName = params.schoolName
    this.setState({
      orgTypeId,
      orgCode,
      examid,
      schoolName,
      examSessionNum: G.examSessionNum
    })
    this.getData(orgCode, examid, G.examSessionNum, orgTypeId, 1)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  getData(org, examid, examNum, orgTypeId, pageindex) {
    this.setState({
      loading: true
    })
    _x.request('/absenceGeneralManage/getAllAbsenceDataByExamCenter', {
      'orgCode': org,
      'examId': examid,
      'examSessionNum': examNum,
      "currentPage": pageindex,
      "orgTypeId": orgTypeId,
      'pageSize': 10,
      "reportSource": "6"
    }, (res) => {
      if (this._isMounted) {
        if (res.result && res.data) {
          this.setState({
            data: res.data.pageData && res.data.pageData.length ? res.data.pageData : [],
            pagination: {
              total: res.data.totalRow,
              pageSize: 10,
              current: pageindex
            },
            loading: false
          })
        } else {
          this.setState({
            data: [],
            pagination: {
              total: 0,
              pageSize: 10,
              current: 1
            },
            loading: false,
          })
        }
      }
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getData(this.state.orgCode, this.state.examid, G.examSessionNum, this.state.orgTypeId, pager.current);
  }



  /**
  * 场次
  * @param {*} value 
  */
  Screening = (value) => {
    if (value) {
      this.getData(this.state.orgCode, this.state.examid, value, this.state.orgTypeId, 1);
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
      : [];

    const quekao = {
      background: "#e54b00",
      color: "#ffffff",
      padding: "0 5px",
      borderRadius: "4px"
    }

    const canyu = {
      background: "#3ae3bd",
      color: "#ffffff",
      padding: "0 5px",
      borderRadius: "4px"
    }
    return (
      <QueueAnim delay={300} type="bottom" className="queue-simple">
      <div key="1" className="zn-decre-bg " >
        <div className="zn-decre-head zn-bg-white clearfix">
          <div className="zn-decre-head-name fl">{this.state.schoolName}</div>
        </div>
        {
          <div className="ljc-table" >
            <Table key="identity_detail"
              loading={this.state.loading}
              pagination={{ ...this.state.pagination, showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
              dataSource={dataSource}
              onChange={this.handleTableChange}
            >
              <Column title="姓名" className="ljc-col-font-blue" dataIndex="examineeName" key="examineeName"></Column>
              <Column title="性别" dataIndex="sex" key="sex"
                render={(text, record) => (
                  text === '0' ? '未知性别' : text === '1' ? '男' : text === '2' ? '女' : text === '9' ? '未说明性别' : ''
                )}
              ></Column>
              <Column title="考籍号" className="ljc-col-font-blue" dataIndex="recordNum" key="recordNum"></Column>
              <Column title="准考证号" className="ljc-col-font-blue" dataIndex="examNum" key="examNum"></Column>
              <Column title="科目类别" dataIndex="subjectCode" key="subjectCode"
                render={(val) => (
                  val ? <span>【{val}】</span> : ''
                )}
              ></Column>
              <Column title="验证缺考" dataIndex="authentication" key="authentication"
                render={(text, record, index) => (
                  <div key={index} className="ljc-d-qk"><span>缺考</span></div>
                )
                }
              ></Column>
              <Column title="现场上报缺考" dataIndex="localAppear" key="localAppear"
                render={(text, record, index) => (
                  text === 0 ? <span key={index} style={canyu} >确认参与</span>
                    : text === 1 ? <span key={index} style={quekao} >确认缺考</span>
                      : ''
                )
                }
              ></Column>
              <Column title="最终缺考确认" dataIndex="confirmAbsentStatus" key="confirmAbsentStatus"
                render={(text, record, index) => (
                  text === 0 ? <span key={index} style={quekao} >确认缺考</span>
                    : text === 1 ? <span key={index} style={canyu} >确认参与</span>
                      : ''
                )
                }
              ></Column>
            </Table>
            <div className="zn-select-abs">
              <SelectPlace getSelect={this.Screening} />
            </div>
            <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><Button className="zn-go-button">返回上级</Button></div>
          </div>

        }
      </div>
      </QueueAnim>
    )
  }
}