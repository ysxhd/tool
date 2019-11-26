/*
 * @Author: JC.liu 
 * @Date: 2018-04-29 21:42:30 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 09:58:04
 */
import React, { Component } from 'react';
import { Table } from 'antd';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Verified_Children, Verified_Detail} from "../../components/absent_supervise/index";
import _x from '../../utils/_x/index';
import { G } from '../../utils/g';
import SelectPlace from '../public_components/select';

const { Column } = Table;
export class Verified extends Component{
  render(){
    return(
      <div>
        <Switch>
          <Route exact path='/absent_supervise/absent_compare/compare_absent/verified/1/' component={UnverifiedFrist} />
          <Route path='/absent_supervise/absent_compare/compare_absent/verified/2/:id' component={Verified_Children} />
          <Route path='/absent_supervise/absent_compare/compare_absent/verified/detail/:id' component={Verified_Detail} />
          <Redirect to='/absent_supervise/absent_compare/compare_absent/verified/1/' />
        </Switch>
      </div>
    )
  }
}

class UnverifiedFrist extends Component{
  constructor(){
    super();
    this.state = {
      data:[],
      OrgCode:""
    };

    this.examId = sessionStorage.getItem("examId");
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
    this._isMounted = true;
  }

  componentWillMount(){
    this._isMounted = true;
    if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    var OrgCode = JSON.parse(sessionStorage.getItem("loginData")).orgCode;
    this.setState({
      OrgCode,
      examSessionNum:G.examSessionNum
    })  
  
     this.getData(OrgCode);
  }

  getData(org){
    this.setState({load:true});
    _x.request('/absenceGeneralManage/getAllExamCenterAbsenceData',{
      "examId": sessionStorage.getItem("examId"),
      "reportSource":"7",
      "examSessionNum":G.examSessionNum,
      "orgCode":org,
      "orgCodeFatherId":org

    },(res)=>{
      if (this._isMounted) {
        if (res.result) {
          this.setState({
            data: res.data,
            load: false
          })
        } else {
          this.setState({
            load: false,
            data: [],
          })
        }
      }
    })
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

      /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    if (value) {
       this.getData(this.state.OrgCode);
    }
  }


  render(){
    const dataSource = this.state.data && this.state.data.length?
    this.state.data.map((item,index)=>{
      return{
        ...item,
        key:index+1
      }
    })
  :[]

    return(
      <div className="zn-decre-bg">
        <Table
          key="unverified"
          loading={this.state.load}
          pagination={false}
          dataSource={dataSource}
        >
          <Column title="机构名称" dataIndex="orgname" key="orgname" className="ljc-col-font-blue"
            render={(text, record) => {
              let obj = JSON.stringify({
                "orgCode": record.orgCode,
                "orgTypeId": record.orgTypeId,
                "schoolName":record.orgname
              })
              let retId = encodeURIComponent(obj)
              if (record.orgTypeId !== 4) {
                return <Link to={`/absent_supervise/absent_compare/compare_absent/verified/2/${retId}`}>{text}</Link>
              } else {
                return <Link to={`/absent_supervise/absent_compare/compare_absent/verified/detail/${retId}`}>{text}</Link>
              }
            }}
          ></Column>
          <Column title="考生总数" dataIndex="totalExamineeNum" key="totalExamineeNum"></Column>
          <Column title="已验证且现场缺考考生数" className="ljc-sf-font" dataIndex="verifiedAbsenceSum" key="verifiedAbsenceSum"></Column>
          <Column title="最终缺考人数" className="ljc-sf-font" dataIndex="confirmAbsentSum" key="confirmAbsentSum"></Column>
          <Column title="详情" dataIndex="detail" key="detail" className="ljc-col-font-blue"
              render={(text, record) => {
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName":record.orgname
                })
                let retId = encodeURIComponent(obj)
                return <Link to={`/absent_supervise/absent_compare/compare_absent/verified/detail/${retId}`}><div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div></Link>
              }}
            ></Column>
        </Table>
        <div className="zn-select-abs">
            <SelectPlace getSelect={this.Screening}/>
        </div>
      </div>
    )
  }
}