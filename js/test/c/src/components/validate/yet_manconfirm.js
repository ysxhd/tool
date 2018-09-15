/*
 * @Author: xiangting
 * @Date: 2018-05-16 16:11:42
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-05-24 09:32:10
 * 人工确认 -- 已验证
 */
import React, { Component } from 'react'
import { Input, Select, Button, Table } from 'antd'
import VerifyInfo from './../verify_info/verify_info'
import { G, _x } from './../../js/index'
import './../../css/not_manconfirm.css'
const Option = Select.Option
const { Column } = Table
const ajax = _x.util.request.request
const orgCode = G.initOrginfo.org_code

class YetManconfirn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSureNum: 0,       //确认提醒数据
      photoNP:0,          //人照未通过总数
      witnessNP:0,          //人证未通过总数
      type: 0,          //0-搜索，1-确认提醒总未通过条数，2-确认提醒人证未通过条数，3-确认提醒人照未通过条数
      seleData: {},      //考试计划
      keyWords: '',      //关键字
      sureVal: 0,      //人工确认,1表示通过，2表示不通过，0表示未确认，-1表示全部
      noPassType: '',      //未通过类型,全部为null或“”，“2”表示人证，“1”表示人照
      pageIndex: 1,
      pageSize: 20,
      tableData: [],      //表格数据
      tableTotal: 0,      //表格数据总数
    }
    this.requestNotNum = this.requestNotNum.bind(this)
  }
  componentDidMount() {
    const props = this.props
    if (props.curExamid){
      const seleData = { planId: props.curExamid.id ? props.curExamid.id : '', playId: props.curExamTime.num ? props.curExamTime.num : '' }
      this.setState({ seleData }, () => {
        this.requestNotNum();
        this.requestNotData(0, 1, 20)
      })
    }
    
  }
  componentWillReceiveProps(props) {
    const { seleData } = this.state;
    if (props.curExamid &&( (seleData.playId !== props.curExamTime.num)|| (seleData.planId !== props.curExamid.id) )) {
      const seleData = { planId: props.curExamid.id, playId: props.curExamTime.num }
      this.setState({ seleData }, () => {
        this.requestNotNum();
        this.requestNotData(0, 1, 20)
      })
    }
  }

  /**
   * 未验证信息数量
   */
  requestNotNum() {
    const { seleData } = this.state
    let req = {
      orgCode: G.initOrginfo.org_code,
      planId: seleData.planId,
      number: seleData.playId,
      // "orgCode":"83.32.01.02","number":1,"planId":"2018999",
      type: 1
    }
    ajax('artificial_confirm/get_remind', req, (res) => {
      if (res.result) {
        const data = res.data
        // const data = { total: 100 }
        this.setState({ toSureNum: data.total,witnessNP:data.witnessNP,photoNP:data.photoNP })
      }
    })
  }
  /**
   * 表格数据请求
   * @param {*} type :0-搜索，1-确认提醒总未通过条数，2-确认提醒人证未通过条数，3-确认提醒人照未通过条数
   * @param {*} pageIndex  页码
   * @param {*} pageSize  每页数量
   */
  requestNotData(type, pageIndex, pageSize) {
    this.setState({type})
    const { keyWords, sureVal, seleData,noPassType } = this.state
    if (type === 1) {
      this.setState({
        keyWords: '',
        sureVal: 0,
        noPassType:""
      })
    }else if (type === 2) {
      this.setState({
        keyWords: '',
        sureVal: 0,
        noPassType:"2"
      })
    }else if (type === 3) {
      this.setState({
        keyWords: '',
        sureVal: 0,
        noPassType:"1"
      })
    }
    let req = {
      orgCode: G.initOrginfo.org_code,
      planId: seleData.planId,
      number: seleData.playId,
      // "orgCode":"83.32.01.02","number":1,"planId":"2018999",
      keyWord: type === 0 ? keyWords : '',
      confirm: sureVal ,
      type: type,
      passType:type===2 ?"2":(type===3 ?"1":(type===1?'':noPassType)),
      pageIndex: pageIndex,
      pageSize: pageSize
    }
    ajax('artificial_confirm/get_validation', req, (res) => {
      if (res.result && res.data) {
        const data = res.data
    const total = res.total
    data.map((item, index) => {
      item.key = index
    })
    this.setState({
      tableTotal: total,
      tableData: data,
    })
      }
    })
  }

  handlePage=(e)=>{
    this.setState({pageIndex:e});
    this.requestNotData(this.state.type, e, 20)
  }
  pass=()=>{
    this.requestNotData(this.state.type, this.state.pageIndex, 20);
    this.requestNotNum();
  }

  render() {
    const { toSureNum, photoNP, witnessNP, noPassType, sureVal, keyWords, pageIndex, pageSize, tableData, tableTotal } = this.state
    const mansure = [
      { name: '全部', id: -1 },
      { name: '通过', id: 1 },
      { name: '未通过', id: 2 },
      { name: '未确认', id: 0 },
    ]
    const mantype = [
        { name: '全部', id: '' },
        { name: '人照', id: '1' },
        { name: '人证', id: '2' },
      ]
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        className: 'mj-nm-lineOne',
        render: (text, record, index) => 
        <p onClick={() => VerifyInfo.show({
          pass:this.pass,
          candidateNumber: record.candidateNumber,
          orgCode:G.initOrginfo.org_code,
          verifyType:record.type=== "2" ? '人证' : '人照',
          planId:this.state.seleData.planId, 
          type: 1,
          number:this.state.seleData.playId,
          name:record.name,sex:record.sex, 
          idCard :record.idNumber,
          sNum:record.setNumber
        })}>{text}</p>,
      }, {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        render: text => <span>{text === 1 ? '男' : '女'}</span>
      }, {
        title: '身份证号',
        dataIndex: 'idNumber',
        key: 'idNumber',
      }, {
        title: '考场号',
        dataIndex: 'roomNumber',
        key: 'roomNumber',
      }, {
        title: '座位号',
        dataIndex: 'setNumber',
        key: 'setNumber',
      }, {
        title: '考号',
        dataIndex: 'candidateNumber',
        key: 'candidateNumber',
      }, {
        title: '场次',
        dataIndex: 'orrder',
        key: 'orrder',
        render: text => <span>{`第${text}场`}</span>
      },{
        title: '验证类型',
        dataIndex: 'type',
        key: 'type',
        render: text => <span>{text === "2" ? '人证' : '人照'}</span>
      }, {
        title: '人工确认',
        dataIndex: 'confirm',
        key: 'confirm',
        render: text => <span>{text === 1 ? '通过' : text === 2 ? '未通过' : '未确认'}</span>
      }
    ];
    return (
      <div className='mj-nm-notContent'>
        {/* 文本栏 */}
        <div className='mj-nm-textCon'>
          <span>确认提醒</span>
          <span>有</span>
          <span onClick={() => this.requestNotData(1, 1, 20)}>{toSureNum}</span>
          <span>条验证未通过的信息需要确认，其中人证合一未通过</span>
          <span onClick={() => this.requestNotData(2, 1, 20)}>{witnessNP}</span>
          <span>条，人照合一未通过</span>
          <span onClick={() => this.requestNotData(3, 1, 20)}>{photoNP}</span>
          <span>条</span>
        </div>
        {/* 搜索栏 */}
        <div className='mj-nm-searchCon mj-clearfix'>
          <div className='mj-nm-keyWords'>
            <span>关键字：</span>
            <Input type='text' placeholder='姓名/身份证号/考号' value={keyWords} maxLength={'100'}
              onChange={(e) => this.setState({ keyWords: e.target.value })} />
          </div>
          <div className='mj-nm-manSure' id='mantype'>
            <span>验证类型：</span>
            <Select value={noPassType} onChange={(value) => this.setState({ noPassType: value })}
                getPopupContainer={() => document.getElementById('mantype')}>
              {
                mantype.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                })
              }
            </Select>
          </div>
          <div className='mj-nm-manSure' id='mansure'>
            <span>人工确认：</span>
            <Select value={sureVal} onChange={(value) => this.setState({ sureVal: value })}
                getPopupContainer={() => document.getElementById('mansure')}>
              {
                mansure.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                })
              }
            </Select>
          </div>
          <Button type="primary" className='mj-nm-btn' onClick={() => this.requestNotData(0, 1, 20)}>搜索</Button>
        </div>
        {/* 表格 */}
        <Table className='lxx-tablebox' columns={columns} dataSource={tableData}
          pagination={{
            pageSize: pageSize, total: tableTotal, size: "small",
            showTotal: (total) => `每页${pageSize}条，共${tableTotal}条 `,
            onChange:(e)=>this.handlePage
          }} />
      </div>
    )
  }
}
export default YetManconfirn;