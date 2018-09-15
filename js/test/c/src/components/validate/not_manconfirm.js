/*
 * @Author: MinJ 
 * @Date: 2018-05-16 16:11:42
 * @Last Modified by: MinJ
 * @Last Modified time: 2018-05-28 10:21:33
 * 人工确认 -- 未验证
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

class NotManconfirn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toSureNum: 0,       //确认提醒数据
      type: 0,          //0未点击确认提醒    1点击确认提醒
      seleData: {},      //考试计划
      keyWords: '',      //关键字
      sureVal: '0',      //人工确认
      pageIndex: 1,
      pageSize: 20,
      tableData: [],      //表格数据
      tableTotal: 0,      //表格数据总数
    }
    this.requestNotNum = this.requestNotNum.bind(this)
    this.pageChange = this.pageChange.bind(this)
  }
  componentDidMount() {
    const props = this.props
    const seleData = { planId: props.curExamid.id ? props.curExamid.id : '', playId: props.curExamTime.id ? props.curExamTime.id : '', num: props.curExamTime.num }
    this.setState({ seleData }, () => {
      this.requestNotNum();
      this.requestNotData(0, 1, 20)
    })
  }
  componentWillReceiveProps(props) {
    const { seleData } = this.state
    if ((props.curExamid && seleData.planId !== props.curExamid.id && seleData.playId !== props.curExamTime.id) ||
      (props.curExamid && seleData.planId === props.curExamid.id && seleData.playId !== props.curExamTime.id)) {
      const seleData = { planId: props.curExamid.id, playId: props.curExamTime.id, num: props.curExamTime.num }
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
      number: seleData.num,
      type: 2,
      // orgCode: '83.32.01.02',
      // planId: '2018999',
      // number: 1,
    }
    ajax('artificial_confirm/get_remind', req, (res) => {
      if (res.result) {
        const data = res.data.total
        // const data = 100
        this.setState({ toSureNum: data })
      }
    })
  }
  /**
   * 表格数据请求
   * @param {*} type 确认提醒
   * @param {*} pageIndex  页码
   * @param {*} pageSize  每页数量
   */
  requestNotData(type, pageIndex, pageSize) {
    const { keyWords, sureVal, seleData } = this.state
    if (type === 1) {
      this.setState({
        keyWords: '',
        sureVal: '0',
      })
    }
    let req = {
      // orgCode: '83.32.01.02',
      // planId: '2018999',
      // number: 1,
      orgCode: G.initOrginfo.org_code,
      planId: seleData.planId,
      number: seleData.num,
      keyWord: type === 0 ? keyWords : '',
      confirm: sureVal ,
      type: type,
      pageIndex: pageIndex,
      pageSize: 20
    }
    ajax('artificial_confirm/get_novalidation', req, (res) => {
      if (res.result && res.data) {
        const data = res.data
        // console.log(req)
        const data1 = [
          // {
          //   uid: 'xxxx',
          //   name: '王明',
          //   sex: 0,
          //   idNumber: 5131664,
          //   roomNumber: '839827K',
          //   setNumber: 6,
          //   candidateNumber: 513166466,
          //   order: 2,
          //   confirm: null,
          // }, {
          //   uid: 'xxxxX',
          //   name: '王明',
          //   sex: 1,
          //   idNumber: 5131664,
          //   roomNumber: '839827K',
          //   setNumber: 6,
          //   candidateNumber: 513166466,
          //   order: 4,
          //   confirm: 1,
          // }, {
          //   uid: 'x1xxxX',
          //   name: '王明',
          //   sex: 0,
          //   idNumber: 5131664,
          //   roomNumber: '839827K',
          //   setNumber: 6,
          //   candidateNumber: 513166466,
          //   order: 6,
          //   confirm: -1,
          // }
        ]
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
  pass=()=>{
    this.requestNotData(0, this.state.pageIndex, 20);
    this.requestNotNum();
  }

  //页码改变
  pageChange(page, pageSize) {
    this.setState({ pageIndex: page }, this.requestNotData(0, page, 20))
  }

  render() {
    const { toSureNum, sureVal, keyWords, pageIndex, pageSize, tableData, tableTotal, seleData } = this.state
    const mansure = [
      { name: '全部', id: '-1' },
      { name: '通过', id: '1' },
      { name: '未通过', id: '2' },
      { name: '未确认', id: '0' },
      { name: '缺考', id: '3' },
    ]
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        className: 'mj-nm-lineOne',
        // render: (text, record, index) => <p onClick={() => VerifyInfo.show({ type: 2, uid: record.candidateNumber, planId: '2018999', number: seleData.playId, orgCode: G.initOrginfo.org_code })}>{text}</p>,
        render: (text, record, index) =>
          <p onClick={() => VerifyInfo.show({
            type: 2,
            candidateNumber: record.candidateNumber,
            planId: seleData.planId, number: seleData.num,
            orgCode: G.initOrginfo.org_code,
            name: record.name,
            sex: record.sex === 1 ? '男' : '女',
            idCard: record.idNumber,
            sNum: record.roomNumber,
            pass:this.pass
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
      }, {
        title: '人工确认',
        dataIndex: 'confirm',
        key: 'confirm',
        render: text => <span>{text === 1 ? '通过' : text === 2 ? '未通过' : text === 3 ?"缺考":'未确认'}</span>
      }
    ];
    return (
      <div className='mj-nm-notContent'>
        {/* 文本栏 */}
        <div className='mj-nm-textCon'>
          <span>确认提醒</span>
          <span>有</span>
          <span onClick={() => this.requestNotData(1, pageIndex, pageSize)}>{toSureNum}</span>
          <span>条未验证信息需要确认</span>
        </div>
        {/* 搜索栏 */}
        <div className='mj-nm-searchCon mj-clearfix'>
          <div className='mj-nm-keyWords'>
            <span>关键字：</span>
            <Input type='text' placeholder='姓名/身份证号/考号' value={keyWords} maxLength={'100'}
              onChange={(e) => this.setState({ keyWords: e.target.value })} />
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
          <Button type="primary" className='mj-nm-btn' onClick={() => this.requestNotData(0, pageIndex, pageSize)}>搜索</Button>
        </div>
        {/* 表格 */}
        <Table className='lxx-tablebox' columns={columns} dataSource={tableData}
          pagination={{
            pageSize: pageSize, total: tableTotal, size: "small",
            showTotal: (total) => `每页${pageSize}条，共${tableTotal}条 `,
            onChange: this.pageChange
          }} />
      </div>
    )
  }
}
export default NotManconfirn;