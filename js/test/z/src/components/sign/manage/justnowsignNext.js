/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:37:04 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-14 09:54:21
 * 缺考 -> 缺考综合处置组件
 */
import React, { Component } from 'react';
import '../../../css/absent_supervise/comprehensive.css'
import { Select, Table } from 'antd';
import { Link } from 'react-router-dom';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import SelectPlace from '../../public_components/select';


export class JustnowsignNext extends Component {
  constructor() {
    super();
    this.state = {
      load: false,
      pagination: {
        total: 0,
        pageSize: 20
      },
      screen: '',
      data: []
    }
    this.examId = JSON.parse(sessionStorage.getItem("examId"));
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
    this._isMounted = true;
    this.data1 = [
      { 'key': 1, 'orgname': "南京市招生委员办公室", 'totalexamNum': 100, 'examNum': 200, 'signNum': 300, 'NoexamNum': 400, 'NosignNum': 500111111111, 'detail': '暂无数据', 'orgTypeId': 1 },
      { 'key': 2, 'orgname': "南京市招生委员办公室", 'totalexamNum': 100, 'examNum': 200, 'signNum': 300, 'NoexamNum': 400, 'NosignNum': 500, 'detail': '暂无数据', 'orgTypeId': 4 },
    ]
  }

  componentWillMount() {  
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var OrgCode = params.orgCode;
    if (!G.examSessionNum) {
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      examSessionNum: G.examSessionNum,
      OrgCode
    });
    this.getAbsenceCount(OrgCode);
  }

  getAbsenceCount(OrgCode) {
    this.setState({ load: true });
    _x.request('signInManage/getSignInOrgList', {
      "examId": this.examId,
      "orgCode": OrgCode,
      "orgCodeFatherId": OrgCode,
      "examSessionNum": G.examSessionNum
    }, (res) => {
      if (this._isMounted) {
        if (res.result) {
          this.setState({
            data: res.data,
            load: false
          })
        } else {
          this.setState({
            data: [],
            load: false
          })
        }
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(nextProps) {
    var params = JSON.parse(decodeURIComponent(nextProps.match.params.id))
    var OrgCode = params.orgCode;
    this.setState({OrgCode})
    this.getAbsenceCount(OrgCode);
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
      this.getAbsenceCount(this.state.OrgCode);
    }
  }

  render() {
    const columns = [{
      title: '机构名称',
      dataIndex: 'orgname',
      key: 'orgname',
      render: (text, record) => {
        let obj = JSON.stringify({
          "orgCode": record.orgCode,
          "schoolName": record.orgname,
          "orgTypeId": record.orgTypeId
        })
         let retId = encodeURIComponent(obj)
        if (record.orgTypeId === 4) {
          return <Link to={`/sign_manage_index/sign_manage/in/${retId}`}>{text}</Link>
        } else {
          return <Link to={`/sign_manage_index/sign_manage/out/${retId}`}>{text}</Link>
        }
      }
    },{
      title: '总考场数',
      dataIndex: 'totalExamroomNum',
      key: 'totalExamroomNum',
    }, {
      title: '已编排监考教师',
      children: [{
        title: '考场数',
        dataIndex: 'arrangeTeaExamroomNum',
        key: 'arrangeTeaExamroomNum',
      }, {
        title: '考场签到数',
        dataIndex: 'arrangeTeaSignInExamroomNum',
        key: 'arrangeTeaSignInExamroomNum',
      }],
    },  {
      title: '未编排监考教师',
      children: [{
        title: '考场数',
        dataIndex: 'unArrangeTeaExamroomNum',
        key: 'unArrangeTeaExamroomNum',
      }, {
        title: '考场签到数',
        dataIndex: 'unArrangeTeaSignInExamroomNum',
        key: 'unArrangeTeaSignInExamroomNum',
      }],
    }, {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      render: (text, record) => {
        let obj = JSON.stringify({
            "orgCode": record.orgCode,
            "schoolName": record.orgname,
            "orgTypeId": record.orgTypeId,
          })
           let retId = encodeURIComponent(obj)           
          return <Link to={`/sign_manage_index/sign_manage/in/${retId}`}><div className="iconfont icon-icon-chakanxq zn-go-detail-search"></div></Link>
      }
    }];

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
          <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i></div>
              <SelectPlace getSelect={this.Screening}/>
          <div className="zn-decre-head-title fr">场次&nbsp;:</div>
        </div>
        <Table key="dispose"
          bordered={true}
          loading={this.state.load}
          pagination={false}
          columns={columns}
          dataSource={dataSource} >
        </Table>
      </div>
    )
  }
}
