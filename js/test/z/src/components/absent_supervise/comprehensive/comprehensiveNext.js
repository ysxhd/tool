/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:37:04 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 16:27:30
 * 缺考 -> 缺考综合处置组件
 */
import React, { Component } from 'react';
import { Select ,Table} from 'antd';
import {Link } from 'react-router-dom';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import SelectPlace from '../../../components/public_components/select';
import QueueAnim from 'rc-queue-anim';


const { Column } = Table;

export class ComprehensiveNext extends Component {
  constructor(){
    super();
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      data:[],
      OrgCode:"",
      type:"",
      pagination: {
        total: 0,
        pageSize: 20
      },

      screen:'',  
    }

    this.examId = JSON.parse(sessionStorage.getItem("examId")); 
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
    this._isMounted = true;
  }

   handleChange(value) {
    console.log(`selected ${value}`);
  }

  componentWillMount(){
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id));
    var OrgCode = params.orgCode;
    if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.getAbsenceCount(OrgCode);
    this.setState({
      OrgCode,
      examSessionNum:G.examSessionNum
    })  
  }

  getAbsenceCount(OrgCode) {
    this.setState({load:true});
    _x.request('homePage/getAbsenceCount', {
      "examId": this.examId,
      "orgCode": OrgCode,
      "orgCodeFatherId": OrgCode,
      "examSessionNum": G.examSessionNum
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

  componentWillUnmount(){
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps){
    var params = JSON.parse(decodeURIComponent(nextProps.match.params.id));
    var orgCode = params.orgCode;
    this.getAbsenceCount(orgCode,G.examSessionNum);
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
  }

    /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    if (value) {
      this.getAbsenceCount(this.state.OrgCode);
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
          <div className="zn-decre-head-name fl" onClick={()=>{this.props.history.goBack()}}><i className="iconfont icon-xiala"></i></div>
             <SelectPlace getSelect={this.Screening}/>
           <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
            <Table key="identity"
            loading={this.state.load}
            pagination={false}
            dataSource={dataSource}
            onChange={this.handleTableChange.bind(this)}>
            <Column title="机构名称" dataIndex="orgname" key="1" className="zn-font-blue"
              render={(text, record,index) => {
              
                let obj = JSON.stringify({
                  "orgCode": record.orgCode,
                  "orgTypeId": record.orgTypeId,
                  "schoolName":record.orgname
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
      </QueueAnim>
    )
  }
}
