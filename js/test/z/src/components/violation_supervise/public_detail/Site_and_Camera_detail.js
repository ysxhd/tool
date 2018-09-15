/*
 * @Author: JCheng.L 
 * @Date: 2018-04-12 12:52:48 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 15:58:33
 * 违规 -> 详情页
 */
import QueueAnim from 'rc-queue-anim'
import '../../../css/absent_supervise/identity_detail.css'
import React, { Component } from 'react';
import { Table, Select } from 'antd';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
const { Column } = Table;
const Option = Select.Option;

export class SiteAndCameraDetail extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
      },
      type: '',
      orgCode: '',
      orgTypeId: '',
      reportSource: '',
      schoolName: '',
      examSessionNum: '',
      examid: '',
    }
    this._isMounted = true
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
  }

  componentWillMount() {
    this.getDetailData();
  }

  getDetailData() {
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }

    var params = JSON.parse(decodeURIComponent(this.props.match.params.id));
    var orgCode = params.orgCode,
      orgTypeId = params.orgTypeId,
      reportSource = params.type === 'scene' ? "2" : "3",
      schoolName = params.schoolName;

    var examid = sessionStorage.getItem("examId");


    this.setState({
      orgCode,
      orgTypeId,
      reportSource,
      type: params.type,
      schoolName,
      examid,
      examSessionNum: G.examSessionNum
    })

    this.getData(orgCode, orgTypeId, reportSource, G.examSessionNum, 1, examid)
  }

  getData(org, type, source, examNum, paegindex, examid) {
    this.setState({
      loading: true
    })
    var index = paegindex;
    _x.request('/disciplineManage/getDisciplineListBySource', {
      'examId': examid,
      "reportSource": source,
      'examSessionNum': examNum,
      'orgCode': org,
      'orgTypeId': type,
      'currentPage': index,
      'pageSize': 10,
    }, function (ret) {
      if (this._isMounted) {
        if (ret.result && ret.data) {
          this.setState({
            data: ret.data.pageData,
            pagination: {
              total: ret.data.totalRow,
              pageSize: 10,
              current: index
            },
          })
        } else {
          this.setState({
            data: [],
            pagination: {
              total: 0,
              pageSize: 10,
              current: 1
            },
          })
        }
        this.setState({
          loading: false
        })
      }
    }.bind(this))
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
    this.getData(this.state.orgCode, this.state.orgTypeId, this.state.reportSource, this.state.examSessionNum, pager.current, this.state.examid);
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
      this.getData(this.state.orgCode, this.state.orgTypeId, this.state.reportSource, value, 1, this.state.examid);
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
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i>{this.state.schoolName}</div>
          <Select defaultValue={this.state.examSessionNum} className="fr" style={{ width: 174 }} onChange={this.Screening}>
            {this.allExam.map((val, i) => {
              return <Option key={i} value={val.examSessionNum}>{val.subjectName}</Option>
            })}
          </Select>
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>
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
            <Column title="学校代码" dataIndex="schoolCode" key="schoolCode"></Column>
            <Column title="考生类型" dataIndex="examineeTypeCode" key="examineeTypeCode"></Column>
            <Column title="科目类别" dataIndex="subjectCode" key="subjectCode"></Column>
            <Column title="科目组" dataIndex="subjectGroupCode" key="subjectGroupCode"></Column>
            <Column title="外语语种" dataIndex="foreignLanguageCode" key="foreignLanguageCode"></Column>

            {
              this.state.type === 'scene' ?
                <Column title="现场上报违规代码" width="180px" dataIndex="localDisciplineFoulCodeList" key="localDisciplineFoulCodeList"
                  render={(text, record) => (
                    text.map((item, index) => (
                      <div className="ljc-d-nowrap" key={index} title={item.fdesc} ><span className="ljc-colo-font-y" >【{item.fcode}】</span>{item.fdesc}</div>
                    ))
                  )}
                ></Column>
                :
                <Column title='视频上报违规代码' width="180px" dataIndex="videoDisciplineFoulCodeList" key="videoDisciplineFoulCodeList"
                  render={(text, record) => (
                    text.map((item, index) => (
                      <div className="ljc-d-nowrap" key={index} title={item.fdesc} ><span className="ljc-colo-font-y" >【{item.fcode}】</span>{item.fdesc}</div>
                    ))
                  )}
                ></Column>
            }
            <Column title="最终违规确认" dataIndex="confirmAbsentStatus" key="confirmAbsentStatus"
              render={(text, record, index) => (
                text === 0 ? <div key={index} className="ljc-d-lost" >确认违规</div>
                  : text === 1 ? <div key={index} className="ljc-d-in" >确认正常</div>
                    : ''
              )
              }
            ></Column>
          </Table>
        </div>


      </div>
      </QueueAnim>
    )
  }
}