/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:37:04 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 10:23:12
 * 缺考 -> 缺考综合处置组件
 */
import React, { Component } from 'react';
import '../../css/absent_supervise/comprehensive.css'
import { Select ,Table} from 'antd';
import {Link } from 'react-router-dom';
import _x from '../../utils/_x/index';
import {G} from '../../utils/g';
import SelectPlace from '../public_components/select';

const { Column } = Table;

export class Comprehensive extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      load:false,
      pagination: {
        total: 0,
        pageSize: 20
      },
      screen:'',  
      data:[]
    }
    this.examId = JSON.parse(sessionStorage.getItem("examId")); 
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
    this._isMounted = true;
  }

  componentWillMount(){
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var OrgCode = params.orgCode;
    if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      examSessionNum:G.examSessionNum
    })
    this.getAbsenceCount(OrgCode,G.examSessionNum);
  }

  getAbsenceCount(OrgCode,examSessionNum) {
    this.setState({load:true});
    _x.request('homePage/getDisciplineCount', {
      "examId": this.examId,
      "orgCode": OrgCode,
      "orgCodeFatherId": OrgCode,
      "examSessionNum": examSessionNum
    }, (res) => {
      this.setState({load:false});
      if (res.result) {
        if (this._isMounted){
          var data = res.data;
          this.setState({
            data,
            OrgCode
          });
        }
      }
    })
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps){
    var params = JSON.parse(decodeURIComponent(nextProps.match.params.id))
    var OrgCode = params.orgCode;
    this.getAbsenceCount(OrgCode,G.examSessionNum);
  }

   handleChange(value) {
    console.log(`selected ${value}`);
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
      this.getAbsenceCount(this.state.OrgCode,value);
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
      <div className="zn-decre-bg">
          <div className="zn-decre-head clearfix">
          <div className="zn-decre-head-name fl" onClick={()=>{this.props.history.goBack()}}><i className="iconfont icon-xiala"></i></div>
              <SelectPlace getSelect={this.Screening}/>
           <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
          <Table key="identity"
            loading={this.state.load}
            pagination={false}
            dataSource={dataSource}
            >
            <Column title="机构名称" dataIndex="orgname" key="1" className="zn-font-blue"
              render={(text, record,index) => {
              
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName":record.orgname
                })
                 let retId = encodeURIComponent(obj)
                if (record.orgTypeId === 4) {
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
    )
  }
}
