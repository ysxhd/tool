/*
 * @Author: JC.liu 
 * @Date: 2018-05-08 09:18:14 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:56:36
 * 监考签到-详情页
 */
import QueueAnim from 'rc-queue-anim'
import React, { Component } from 'react';
import { Table, Select } from 'antd';
import _x from '../../utils/_x/index';
import { G } from '../../utils/g';
const Option = Select.Option;

export class SignDetail extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1
      },
      schoolName: '',
      examId: '',    // 考试计划
      orgCode: '',   // 机构代码
      examSessionNum: '',
      orgTypeId: '',   // 机构类型id 
      // reportSource: "1",    // 缺考上报来源  （1：身份验证缺考 2：现场缺考  3：视频缺考  4：阅卷缺考  5：成绩缺考）   
      examid: '',
      data: [],
    }

    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }

  componentWillMount() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }

    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var orgTypeId = params.orgTypeId,
      schoolName = params.schoolName,
      orgCode = params.orgCode;

    this.setState({
      orgTypeId,
      orgCode,
      examid,
      schoolName,
      examSessionNum: G.examSessionNum
    })
    this.getDatas(orgCode, examid, G.examSessionNum, 1)
  }

  // ajax
  getDatas(org, examid, examNum, pageindex) {
    this.setState({
      loading: true
    })
    _x.request('/signInManage/getSignInDetailInfo', {
      "orgCode": org,
      // "orgCode": "86.32.07.01.03",
      "examId": examid,
      "examSessionNum": examNum,
      "currentPage": pageindex,
      "pageSize": 10
    }, (res) => {
      if (res.result && res.data) {
        if (res.data.pageData && res.data.pageData.length) {
          var data = [],
            resData = res.data.pageData;
          // resData = this.state.data
          resData.map((item) => {
            var b_1,
              b_2,
              b_3,

              q_1,
              q_2,
              q_3,

              b_1_u,
              b_2_u,
              b_3_u,

              q_1_u,
              q_2_u,
              q_3_u,

              logicExrNo;
            logicExrNo = item.logicExrNo;
            if (item.arrangeExaminerList && item.arrangeExaminerList.length) {
              item.arrangeExaminerList.map((item) => {
                if (item.type === "1") {
                  b_1 = item.name;
                  b_1_u = item.uid;
                } else if (item.type === "2") {
                  b_2 = item.name;
                  b_2_u = item.uid;
                } else if (item.type === "3") {
                  b_3 = item.name;
                  b_3_u = item.uid;
                }
              })
            } else {
              b_1 = null;
              b_1_u = null;

              b_2 = null;
              b_2_u = null;

              b_3 = null;
              b_3_u = null;
            }

            if (item.signExaminerList && item.signExaminerList.length) {
              item.signExaminerList.map((item) => {
                if (item.type === "1") {
                  q_1 = item.name;
                  q_1_u = item.uid;
                } else if (item.type === "2") {
                  q_2 = item.name;
                  q_2_u = item.uid;
                } else if (item.type === "3") {
                  q_3 = item.name;
                  q_3_u = item.uid;
                }
              })
            } else {
              q_1 = null;
              q_1_u = null;

              q_2 = null;
              q_2_u = null;

              q_3 = null;
              q_3_u = null;
            }
            data.push({ b_1, b_2, b_3, q_1, q_2, q_3, b_1_u, b_2_u, b_3_u, q_1_u, q_2_u, q_3_u, logicExrNo })
          })
          this.setState({
            data,
            loading: false,
            pagination: {
              total: res.data.totalRow,
              pageSize: 10,
              current: pageindex
            },
          })
        } else {
          this.setState({
            loading: false,
            data: [],
            pagination: {
              total: 0,
              pageSize: 10,
              current: 1
            },
          })
        }
      } else {
        this.setState({
          loading: false,
          data: [],
          pagination: {
            total: 0,
            pageSize: 10,
            current: 1
          },
        })
      }
    })
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
      this.getDatas(this.state.orgCode, this.state.examid, value, 1)
    }
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
    this.getDatas(this.state.orgCode, this.state.examid, this.state.examSessionNum, pager.current, );
  }

  render() {
    let columns = [{
      title: "考场编号",
      dataIndex: "logicExrNo",
      key: "logicExrNo",
      render: (text, record) => {
        let style = {};
        if (!record.q_1 && !record.q_2 && !record.q_3) {
          style = { color: "red" }
        }
        return (<div style={style} >{text}</div>)
      }
    }, {
      title: '编排',
      children: [{
        title: '甲',
        dataIndex: 'b_1',
        key: 'b_1',
        render: (text) => {
          if (!text) return "—"
          return (<div>{text}</div>)
        }
      }, {
        title: '乙',
        dataIndex: 'b_2',
        key: 'b_2',
        render: (text) => {
          if (!text) return "—"
          return (<div>{text}</div>)
        }
      }, {
        title: '丙',
        dataIndex: 'b_3',
        key: 'b_3',
        render: (text) => {
          if (!text) return "—"
          return (<div>{text}</div>)
        }
      }]
    }, {
      title: '签到',
      children: [{
        title: '甲',
        dataIndex: 'q_1',
        key: 'q_1',
        render: (text, record) => {
          let style = {};
          if(!text) {
            return "—"
          }else{
            if (record.q_1_u !== record.b_1_u) {
              style = { color: "red" }
            }
            return (<div style={style} >{text}</div>)
          }
        }
      }, {
        title: '乙',
        dataIndex: 'q_2',
        key: 'q_2',
        render: (text, record) => {
          let style = {};
          if (!text) {
            return "—"
          } else {
            if (record.q_2_u !== record.b_2_u) {
              style = { color: "red" }
            }
            return (<div style={style} >{text}</div>)
          }
         
        }
      }, {
        title: '丙',
        dataIndex: 'q_3',
        key: 'q_3',
        render: (text, record) => {
          let style = {};
          if (!text) {
            return "—"
          } else {
            if (record.q_3_u !== record.b_3_u) {
              style = { color: "red" }
            }
            return (<div style={style} >{text}</div>)
          }
        }
      }]
    }]

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
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i>{this.state.schoolName}</div>
          <Select defaultValue={this.state.examSessionNum} className="fr" style={{ width: 174 }} onChange={this.Screening}>
            {this.allExam.map((val, i) => {
              return <Option key={i} value={val.examSessionNum}>{val.subjectName}</Option>
            })}
          </Select>
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>
        <div className="ljc-table" >
          <Table
            key="sign_detail"
            loading={this.state.loading}
            pagination={{ ...this.state.pagination, showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
            dataSource={dataSource}
            columns={columns}
            bordered={true}
            onChange={this.handleTableChange}
          >
          </Table>
        </div>
      </div>
      </QueueAnim>
    )
  }
}

