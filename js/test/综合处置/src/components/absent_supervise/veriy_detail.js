/*
 * @Author: JC.liu 
 * @Date: 2018-04-30 11:08:33 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 10:03:55
 */
import '../../css/absent_supervise/comprehensive.css'
import React, { Component } from 'react';
import { Table, Select, Button } from 'antd';
import { G } from '../../utils/g';
import _x from '../../utils/_x/index';
import SelectPlace from '../public_components/select';

const { Column } = Table;
export class Verified_Detail extends Component {
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

      data: [
          // { "examineeName": "张三", "sex": "1", "recordNum": 5454, "examNum": 5645, "subjectCode": 1,"localAppear": 0, "authentication": 1, "confirmAbsentStatus": 0 },
      ]
    }

    this.examId = JSON.parse(sessionStorage.getItem("examId"));
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
    this._isMounted = true;
  }

  componentWillMount() {
    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var orgTypeId = params.orgTypeId,
       schoolName = params.schoolName,
      orgCode = params.orgCode;
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      schoolName,
      orgTypeId,
      orgCode,
      examid,
      examSessionNum: G.examSessionNum
    })
    this._isMounted = true;
    this.getData(orgCode, orgTypeId, 1);
  }

  getData(org, orgTypeId, pageindex) {
    this.setState({ load: true });
    _x.request('/absenceGeneralManage/getAllAbsenceDataByExamCenter', {
      "examId": sessionStorage.getItem("examId"),
      "reportSource":"7",
      "examSessionNum":G.examSessionNum,
      "orgCode":org,
      "orgTypeId":orgTypeId,
      "currentPage":pageindex,
      "pageSize":10
    }, (res) => {
      if (res.result) {
        if (this._isMounted) {
          this.setState({
            data: res.data ? res.data.pageData : [],
            pagination: {
              total: res.data.totalRow,
              pageSize: 10,
              current: pageindex
            },
            load: false
          })
        }
      } else {
        this.setState({
          data: [],
          pagination: {
            total: 0,
            pageSize: 10,
            current: 1
          },
          load: false,
        })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  /**
* 分页
*/
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getData(this.state.orgCode, this.state.orgTypeId, pager.current);
  }

        /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    if (value) {
      this.getData(this.state.orgCode,this.state.orgTypeId, 1);
    }
  }

  render() {
    const quekao = {
      background: "#e54b00",
      color: "#ffffff",
      padding: "0 5px"
    }

    const canyu = {
      background: "#3ae3bd",
      color: "#ffffff",
      padding: "0 5px"
    }
    const dataSource = this.state.data && this.state.data.length ?
      this.state.data.map((item, index) => {
        return {
          ...item,
          key: index + 1
        }
      })
      : []
    return (
      <div>
        <div className="zn-decre-bg" >
        <div className="zn-select-abs">
            <SelectPlace getSelect={this.Screening}/>
          </div>
          <div className="zn-decre-head zn-bg-white clearfix">
            <div className="zn-school-name">{this.state.schoolName}</div>
          </div>
          <Table key="identity_detail"
            loading={this.state.load}
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
              render={(text, record, index) => {
                return text ? <div>【{text}】</div> : ""
              }}
            ></Column>
            <Column title="现场上报缺考" dataIndex="localAppear" key="localAppear"
              render={(text, record, index) => (
                <div key={index} className="zn-block-text">缺考</div>
              )
              }
            ></Column>
            <Column title="验证缺考" dataIndex="authentication" key="authentication"
              render={(text, record, index) => (
                text === 0 ? <span key={index} style={canyu} >确认参与</span>
                : text === 1 ? <span key={index} style={quekao} >确认缺考</span>
                : ''
              )
              }
            ></Column>
            <Column title="最终缺考确认" dataIndex="confirmAbsentStatus" key="confirmAbsentStatus"
              render={(text, record, index) => (
                text === 0 ? <span key={index} style={canyu} >确认参与</span>
                : text === 1 ? <span key={index} style={quekao} >确认缺考</span>
                : ''
              )
              }
            ></Column>
          </Table>
        </div>
        <div className="zn-decre-head-name"><Button  onClick={() => { this.props.history.goBack() }} className="zn-go-button">返回上级</Button></div>
      </div>
    )
  }
}