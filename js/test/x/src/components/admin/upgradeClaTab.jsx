/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: MinJ
 * @Last Modified time: 2018-03-22 09:20:00
 * 在线升级——升级管理组件
 */
import React, { Component } from 'react';
import { Progress, Table, Badge, Select } from 'antd';
import { SVG, IMG } from './../base';
import _x from './../../js/_x/index';
import '../../css/admin/upgradeClaTab.css';
const Option = Select.Option;

export class UpgradeClaTab extends Component {
  constructor() {
    super();
    this.state = {
      upNowData: [],       //刷新及初始化表格数据
      total: '',           //列表数据总数
      upData: [],          //选择后进行升级
      upNum: [],             //当前上级成功及失败个数
      upTotal: 0,            //当前升级总数
      seleList: [],            //选中的 升级终端
      seleVersion: '',      //选中的  升级版本
      ifNew: true,        //初始化页面
      pageIndex: 1,          //页码
      pageSize: 20,          //每页数目
    }
    this.requestDataList = this.requestDataList.bind(this);
    this.requestUpData = this.requestUpData.bind(this);
    this.pageSizeChan = this.pageSizeChan.bind(this);
    this.requestUpNum = this.requestUpNum.bind(this);
    this.pageChan = this.pageChan.bind(this);
  }
  componentWillMount() {
    this.requestUpNum(true);
    this.requestInitialData(1, 20);
    this.timer = setInterval(
      () => {
        this.requestUpNum(false);
        this.requestInitialData(this.state.pageIndex, this.state.pageSize);
      },
      30000
    );
  }
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.setState({
      seleList: nextProps.seleList,
      seleVersion: nextProps.seleVersion
    })
    // console.log(nextProps.seleList.length);
    if (nextProps.seleList.length) {
      this.requestUpData(nextProps.seleList, nextProps.seleVersion);
    }
    // !this.state.ifNew && nextProps.seleList.length ?
    //   this.requestDataList(nextProps.seleList) :
    //   ''
  }


  // 初始化获取表格数据
  requestInitialData(pageIndex, pageSize) {
    // console.log(1111);
    var req = {
      action: 'api/web/manager_device_software/get_device_list',
      data: {
        pageIndex: pageIndex,
        // pageSize: 5
        pageSize: pageSize
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret.request);
      if (ret.result && ret.data) {
        const data = ret.data;
        this.setState({
          total: ret.total,
          // upNowData: data,
          ifNew: false,
          seleList: data
        })
        this.requestDataList(data);
      }
    })
  }
  /**
   * 获取列表数据
   * ssid终端列表
   */
  requestDataList(ssid) {
    // console.log(1111);
    var req = {
      action: 'api/web/manager_device_software/get_status',
      data: {
        // ssid: ['GZ_1']
        ssid: ssid
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret.data);
      if (ret.result) {
        const data = ret.data;
        var upNowData = [];
        for (var n in data) {
          data[n].id = n;
          upNowData.push(data[n]);
        }
        this.setState({
          upNowData: upNowData
        })
      }
    })
  }
  /**
   * 选择版本及设备进行升级
   * ssid选中设备
   * version版本号
   */
  requestUpData(ssid, version) {
    // console.log(ssid + ':\\' + version);
    version === 'all' ? version = '' : '';
    var req = {
      action: 'api/web/manager_device_software/update_device',
      data: {
        ssid: ssid,
        softwareVersionId: version
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        // console.log(ret.data);
        this.requestUpNum(false);
        this.requestInitialData(1, 20);
      }
    })
  }
  /**
   * 当前升级 成功及失败个数（无入参）
   */
  requestUpNum(ifInit) {
    var req = {
      action: 'api/web/manager_device_manage/get_device_number',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        // console.log(ret.data);
        var data = ret.data;
        var date = _x.util.date.format(new Date(data.updateTime), 'yyyy-MM-dd HH:mm');
        data.updateTime = date;
        this.setState({
          upNum: ret.data,
          // upTotal: ret.total
        })
        if (ifInit && ret.data.updateDeviceVersion !== '0') {
          // console.log(ret.data.updateDeviceVersion);
          this.props.initVersion(ret.data.updateDeviceVersion);
        }
      }
    })
  }

  //改变每页条数
  pageSizeChan(value) {
    // console.log(this.state.seleList);
    this.setState({
      pageSize: value,
      pageIndex: 1
    })
    this.requestInitialData(1, value);
  }
  pageChan(page) {
    this.setState({
      pageIndex: page
    })
    this.requestInitialData(page, this.state.pageSize);
  }

  render() {
    // console.log(this.state.upNowData);
    // 分页样式
    function itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
    const columns = [
      {
        title: '班级',
        dataIndex: 'className',
        key: 'className'
      }, {
        title: '场所',
        dataIndex: 'location',
        key: 'location'
      }, {
        title: '终端IP',
        dataIndex: 'ipAddress',
        key: 'ipAddress'
      }, {
        title: '当前版本',
        dataIndex: 'softwareVersion',
        key: 'softwareVersion'
      }, {
        title: '在线状态',
        dataIndex: 'onlineState',
        key: 'onlineState',
        render: (text, record) => (
          // console.log(record),
          <span>
            {
              text
                ?
                (

                  <Badge status="success" text='在线'></Badge>
                )
                :

                <Badge status="default" text='离线' ></Badge>
            }
          </span >
        )
      }, {
        title: '升级状态',
        dataIndex: 'updateState',
        key: 'updateState',
        render: (text, record) => (
          <span className='mj-uct-upStatus'>
            {
              (
                () => {
                  switch (text) {
                    case 'A': return <span className='mj-uct-upSucces'><SVG type='choice'></SVG><span>成功</span></span>;
                    case 'UF': return <span className='mj-uct-upDefaul'><SVG type='fail'></SVG><span>失败</span></span>;
                    case 'WU': return <span className='mj-uct-upWait'><SVG type='wait'></SVG><span>等待</span></span>;
                    case 'U': return <span>升级中...</span>;
                  }
                }
              )()
            }
          </span>
        )
      }
    ];
    return (
      <div className='mj-uct-content cjy-clearfix'>
        {/* 头部 */}
        <div className='mj-uct-title'>升级管理</div>
        {
          this.state.upNowData.length
            ?
            <div>
              <div className='mj-uct-text'>
                <span>{`升级于  ${this.state.upNum.updateTime === -1 ? '' : this.state.upNum.updateTime}`}</span>
                <Progress
                  className='mj-uct-progress'
                  percent={Math.floor(this.state.upNum.success / this.state.upNum.all * 10000) / 100}
                  format={percent => `${this.state.upNum.success}/${this.state.upNum.all}`}
                ></Progress>
                <div className='mj-uct-succes'>
                  <SVG type='choice'></SVG>
                  <span>{`成功 ${this.state.upNum.success}`}</span>
                </div>
                <div className='mj-uct-default'>
                  <SVG type='fail'></SVG>
                  <span>{`失败  ${this.state.upNum.fail}`}</span>
                </div>
              </div>
              {/* 表格 */}
              <div className='mj-uct-tabCon'>
                <Table
                  columns={columns}
                  dataSource={this.state.upNowData}
                  bordered
                  rowKey={this.state.upNowData.id}
                  pagination={{
                    // pageSize: 5,
                    pageSize: this.state.pageSize,
                    itemRender: itemRender,
                    defaultCurrent: 1,
                    total: this.state.total,
                    onChange: this.pageChan,
                    current: this.state.pageIndex
                  }}></Table>
                <div className='mj-uct-subCon'>
                  <span>{`共${this.state.total}条数据，每页`}</span>
                  <Select className='mj-uct-subSele' defaultValue={20} onChange={this.pageSizeChan}>
                    <Option value={10}>10</Option>
                    <Option value={20}>20</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                  </Select>
                  条
                </div>
              </div>
            </div>
            :
            <div className='mj-uct-noData cjy-clearfix'>
              <div>
                <IMG src={require('../../img/noData.png')} width="150px" height="150px" />
                <div className="mj-ucv-txt">暂无相关内容</div>
              </div>
            </div>
        }
      </div>
    );
  }
}