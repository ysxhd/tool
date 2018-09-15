/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:36:08 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 10:48:42
 * 缺考 -> 缺考综合处置
 */
import React, { Component } from 'react';
import '../../css/absent_supervise/comprehensive.css'
import { Select ,Table} from 'antd';
import { Switch, Route, Redirect,Link } from 'react-router-dom';
import { Comprehensive, ComprehensiveChild } from "../../components/absent_supervise/index";
import _x from '../../utils/_x/index';
import {G} from '../../utils/g';


const Option = Select.Option;
const { Column } = Table;

 class ComRouter extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      load:false,  //loading
      pagination: {
        total: 0,
        pageSize: 20
      },
      data:[],
      screen:'',  
      examSessionNum: G.examSessionNum,
    }

  this.ss = JSON.parse(sessionStorage.getItem("loginData"));  
  this.examId = JSON.parse(sessionStorage.getItem("examId")); 
  this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
  this._isMounted = true;
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

  componentWillUnmount(){
    this._isMounted = false;
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

  getAbsenceCount (examSessionNum) {
    this.setState({load:true});
    _x.request('homePage/getAbsenceCount', {
      "examId": this.examId,
      "orgCode": this.ss.orgCode,
      "orgCodeFatherId": this.ss.orgCode,
      "examSessionNum": examSessionNum
    }, (res) => {
      this.setState({load:false});
      if (res.result) {
        if (this._isMounted){
          var data = res.data;
          this.setState({data});
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
      this.setState({
        examSessionNum: value
      })
      G.examSessionNum = value
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
      <div className="zn-decre-bg">
          <div className="zn-decre-head clearfix">
          <Select defaultValue={this.state.examSessionNum} className="fr" style={{ width: 174 }} onChange={this.Screening}>
             {this.allExam.map((val,i) => {
               return <Option key={i} value={val.examSessionNum}>{val.subjectName}</Option>
             })}
          </Select>
           <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
            <Table
            key="dispose"
            loading={this.state.load}
            pagination={false}
            dataSource={dataSource} >
            <Column title="机构名称" dataIndex="orgname" key="1" className="zn-font-blue"
              render={(text, record,index) => {
              
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId
                })
                let retId = encodeURIComponent(obj)

                if (record.orgTypeId === 4) {
                  return <Link to={`/absent_supervise/absent_dispose/in/${retId}`}>{text}</Link>
                } else {
                  return <Link to={`/absent_supervise/absent_dispose/out/${retId}`}>{text}</Link>
                }
              }}
            ></Column>
            <Column title="考生总数" dataIndex="totalExamineeNum" className="zn-font-black" key="2"></Column>
            <Column title="身份证缺考" className="ljc-sf-font" dataIndex="authenticationSum" key="3"></Column>
            <Column title="现场上报缺考" className="ljc-sf-font" dataIndex="localAppearSum" key="4"></Column>
            <Column title="视频上报缺考" className="ljc-sf-font" dataIndex="videoAppearSum" key="5"></Column>
            <Column title="阅卷缺考" dataIndex="paperAbsenceSum" className="zn-sf-gray" key="6"></Column>
            <Column title="成绩缺考" dataIndex="scoreAbsenceSum" className="zn-sf-gray" key="7"></Column>
            <Column title="最终缺考人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="8"></Column>
            <Column title="详情" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="9" 
              render={(text, record,index)=>{
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName":record.orgname
                })
                let retId = encodeURIComponent(obj);
                return <Link to={`/absent_supervise/absent_dispose/in/${retId}`}><div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div></Link>
              }}
            ></Column>
          </Table>    
      </div>
    )
  }
}


class AbsentDispose extends Component {
  
  render() {
    const path = this.props.match.path;
    return (
      <div>
        <Switch>
          <Route exact path={`${path}/out`} component={ComRouter} />
          <Route exact path={`${path}/out/:id`} component={Comprehensive} />
          <Route path={`${path}/in/:id`} component={ComprehensiveChild} />
          <Redirect to={`${path}/out`} ></Redirect>
        </Switch>
      </div> 
    );
  }
}

export default AbsentDispose;