/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:46:37 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 17:01:35
 * 违规 -> 违规综合处置
 */
import React, { Component } from 'react';
import { Table} from 'antd';
import { Link } from 'react-router-dom';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import SelectPlace from '../../public_components/select';
import QueueAnim from 'rc-queue-anim';

const { Column } = Table;
export class Comprehensive extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      examSessionNum:"",
      pagination: {
        total: 0,
        pageSize: 20
      },

      screen:'',  
    }

    this.ss = JSON.parse(sessionStorage.getItem("loginData"));
    this.examId = JSON.parse(sessionStorage.getItem("examId")); 
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
     
    this.data = [
      { '1': "南京市招生委员办公室", '2': 100, '3': 200, '4': 300, '5': 400, '6': 500, '7': '暂无数据','8':'暂无数据','Type':1},
      { '1': "南京市招生委员办公室", '2': 100, '3': 200, '4': 300, '5': 400, '6': 500, '7': '暂无数据','8':'暂无数据','Type':2},
      { '1': "南京市招生委员办公室", '2': 100, '3': 200, '4': 300, '5': 400, '6': 500, '7': '暂无数据','8':'暂无数据','Type':3},
      { '1': "南京市招生委员办公室", '2': 100, '3': 200, '4': 300, '5': 400, '6': 500, '7': '暂无数据','8':'暂无数据','Type':4},
      { '1': "南京市招生委员办公室", '2': 100, '3': 200, '4': 300, '5': 400, '6': 500, '7': '暂无数据','8':'暂无数据','Type':1}
    ]

  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  handleTableChange = (pagination, filters, sorter) => {
    
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
  }

  componentWillMount(){
    if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      examSessionNum:G.examSessionNum
    })
    this.getAbsenceCount(G.examSessionNum);
  }

  getAbsenceCount(examSessionNum) {
    this.setState({load:true});
    _x.request('homePage/getDisciplineCount', {
      "examId": this.examId,
      "orgCode": this.ss.orgCode,
      "orgCodeFatherId": this.ss.orgCode,
      "examSessionNum": examSessionNum
    }, (res) => {
      this.setState({load:false});
      if (res.result) {
        var data = res.data;
        this.setState({data});
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
      this.getAbsenceCount(value)
    }
  }

  render() {
    const dataSource = this.state.data && this.state.data.length?
    this.state.data.map((item,index)=>{
      return{
        ...item,
        key:index+1
      }
    })
  :[]
    return (
      <QueueAnim delay={300} type="bottom" className="queue-simple">
      <div key="1" className="zn-decre-bg">
          <div className="zn-decre-head clearfix">
              <SelectPlace getSelect={this.Screening}/>
           <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
          <Table key="dispose"
            loading={this.state.load}
            pagination={false}
            dataSource={dataSource} >
            <Column title="机构名称" dataIndex="orgname" key="1" className="zn-font-blue"
              render={(text, record,index) => {
              
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "schoolName":record.orgname,
                  "orgTypeId": record.orgTypeId
                })
                let retId = encodeURIComponent(obj)

                if (record.Type === 4) {
                  return <Link to={`/violation_supervise/absent_dispose/in/${retId}`}>{text}</Link>
                } else {
                  return <Link to={`/violation_supervise/absent_dispose/out/${retId}`}>{text}</Link>
                }
              }}
            ></Column>
            <Column title="考生总数" dataIndex="totalExamineeNum" className="zn-font-black" key="2"></Column>
            <Column title="现场上报违规" className="ljc-sf-font" dataIndex="localAppearSum" key="4"></Column>
            <Column title="视频上报违规" className="ljc-sf-font" dataIndex="videoAppearSum" key="5"></Column>
            <Column title="最终违规人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="8"></Column>
            <Column title="详情" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="9" 
              render={(text, record,index)=>{
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName":record.orgname
                })
                let retId = encodeURIComponent(obj);
                return <Link to={`/violation_supervise/absent_dispose/in/${retId}`}><div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div></Link>
              }}
            ></Column>
          </Table>
      </div>
      </QueueAnim>
    )
  }
}
