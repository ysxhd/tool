/*
 * @Author: JC.liu 
 * @Date: 2018-04-29 21:42:30 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 10:01:02
 */
import React, { Component } from 'react';
import { Select, Table, Button } from 'antd';
import { Link } from 'react-router-dom';
import _x from '../../utils/_x/index';
import { G } from '../../utils/g';
import SelectPlace from '../public_components/select';

const { Column } = Table;
export class Verified_Children extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      OrgCode:""
    }
    this.examId = JSON.parse(sessionStorage.getItem("examId"));
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
    this._isMounted = true;
  }

  componentWillMount() {
    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var orgTypeId = params.orgTypeId,
       OrgCode = params.orgCode;
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      orgTypeId,
      OrgCode,
      examid,
      examSessionNum: G.examSessionNum
    })
    this._isMounted = true;
    this.getData(OrgCode);
  }

  componentWillReceiveProps(nextProps) {
    var examid = sessionStorage.getItem("examId");
    var params = JSON.parse(decodeURIComponent(nextProps.match.params.id));
    var orgTypeId = params.orgTypeId,
      OrgCode = params.orgCode;

    this.setState({
      orgTypeId,
      OrgCode,
      examid,
      // examSessionNum: G.examSessionNum
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
      if(res.result){
        if (this._isMounted){
          this.setState({
            data:res.data,
            load:false
          })
        }
      }else{
        this.setState({
          load:false
        })
      }
    })
  }

  componentWillUnmount() {
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
      <div>
        <div className="zn-decre-bg" >
          <div className="zn-select-abs">
             <SelectPlace getSelect={this.Screening}/>
          </div>
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
        </div>
        <div className="zn-decre-head-name"><Button onClick={() => { this.props.history.goBack() }} className="zn-go-button">返回上级</Button></div>
      </div>
    )
  }
}