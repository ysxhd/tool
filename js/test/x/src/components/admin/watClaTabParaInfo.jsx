/*
 * @Author: kangyl 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-15 13:50:27
 * 状态监督——参数设置组件
 */
import React, { Component } from 'react';
import { Modal, Tabs, Progress, Tag } from 'antd';
import WatClaViewListCon from './watClaViewListCon';
import WatClaTabLog from './watClaTabLog';
import { SVG } from '../base';
import './../../css/admin/watClaTabParaInfo.css';
import _x from './../../js/_x/index';

export default class WatClaTabParaInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShow: this.props.modalIsShow,
      val1: this.props.val,
      id: this.props.id,
      data: {
        "class":"",
        "mark": "",
        "RP": "",
        "version":"",
        "space": "",
        "system": "",
        "IP": "",
        "inTime": "",
        "onLine": "",
        "cpu": 0,
        "memory": 0,
        "usedSpace": 0,
        "status": ""
      }
    }
    this.request = this.request.bind(this)
  }
  request(id ) {
    // console.log(this.props.id)
    var req = {
      action: 'api/web/manager_manage_class_card/device_detail_info',
      data: {
        id:id
      }
    }
    _x.util.request.formRequest(req, (res) => {
      const data=res.data
      if(data==null){
        // let time=_x.util.date.format(new Date(data.registDate),'yyyy-MM-dd HH:mm')
        //如果没有数据，直接使用data里的假数据
        return ;
      }
      if (res) {
        // 将后台传的时间戳 转换为yyyy-MM-dd HH:mm的格式。
        
        let time=_x.util.date.format(new Date(data.registDate),'yyyy-MM-dd HH:mm')
        // console.log(data.onlineTime)
        var days = parseInt(data.onlineTime*1000 / (1000 * 60 * 60 * 24));
        var hours = parseInt((data.onlineTime*1000 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((data.onlineTime*1000 % (1000 * 60 * 60)) / (1000 * 60));
        var onlineT= days + " 天 " + hours + " 小时 " + minutes + " 分钟 " ;

        this.setState({
          data:{
             "class":this.props.class,
             "mark": id,
             "RP": data.resolution,
             "version": data.softwareVersion,
             "space": this.props.location,
             "system": data.os,
             "IP": data.ipAddress,
             "inTime": time,
             "onLine": onlineT,
             "cpu": Math.round(data.cpu*100),
             "memory": Math.round(data.memory*100),
             "usedSpace": Math.round(data.space*100),
             "status": this.props.status
          }
        }) 
        // setTimeout(() => {
        // //   console.log(typeof(this.state.data.cpu))
        // // console.log(typeof(this.state.data.memory*100))
        // // console.log(typeof(this.state.data.space))
        // }, 1);
        } else {
        console.log("错误")
      }
    })
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
    // console.log(this.props.id)
    this.request(this.props.id)
  }
  callback = (key) => {
    // console.log(key);
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  componentWillMount() {
    //  console.log(this.state.data.onLine);
  }
  componentDidMount() {
    //  console.log(this.props.bpData);
  }
  render() {
    const TabPane = Tabs.TabPane;
    return (
      <div className="kyl-wctpif-seeMsgModal">
        {
          this.state.val1 === 1 ?
            <div onClick={this.showModal}>查看信息</div>
            :
            <span onClick={this.showModal}>
              <SVG type='params'></SVG>
            </span>
        }
        <div>
          <Modal className="kyl-wctpif-modal"
            title="参数信息"
            visible={this.state.visible}
            onCancel={this.handleCancel}
          >
            <div className="kyl-wctpif-tabs">
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="基本信息" key="1">
                  <div className="kyl-wctpif-msgHeader">
                    <div><p className="kyl-wctpif-class" title={this.state.data.class}>班级&nbsp;:&nbsp;{this.state.data.class}</p></div>
                    <div className="kyl-wctpif-rHeader"><p className="kyl-wctpif-space" style={{marginLeft:"17px"}} title={this.state.data.space}>场所&nbsp;:&nbsp;{this.state.data.space}</p></div>
                  </div>
                  <div className="kyl-wctpif-container">
                    <div className="kyl-wctpif-msgLeft">
                      <p>终端识别&nbsp;:&nbsp;<span title={this.state.data.mark}>{this.state.data.mark}</span></p>
                      <p>分辨率&nbsp;:&nbsp;<span title={this.state.data.RP}>{this.state.data.RP}</span></p>
                      <p>终端版本&nbsp;:&nbsp;<span title={this.state.data.version}>{this.state.data.version}</span></p>
                    </div>
                    <div className="kyl-wctpif-msgRight">
                      <p>操作系统&nbsp;:&nbsp;<span title={this.state.data.system}>{this.state.data.system}</span></p>
                      <p>IP地址&nbsp;:&nbsp;<span title={this.state.data.IP}>{this.state.data.IP}</span></p>
                      <p>接入时间&nbsp;:&nbsp;<span title={this.state.data.inTime}>{this.state.data.inTime}</span></p>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="运行状态" key="2">
                  <div className="kyl-wctpif-runStatus">
                    <p className="kyl-wctpif-p1">在线情况&nbsp;:&nbsp;
                    {this.state.data.status===1
                    ?
                    <span>{this.state.data.onLine}</span>
                    :
                    ''
                    }
                    
                    </p>
                    <Tag color={this.state.data.status === 1 ? "#00cd89" : "#ff7575"} className={this.state.data.status?"kyl-wctpif-tag":"kyl-wctpif-offtag"}>{this.state.data.status === 1 ? "在线" : "离线"}</Tag>
                    <p className="kyl-wctpif-p2">CPU使用率&nbsp;:&nbsp;</p><Progress className="kyl-wctpif-progress1" percent={this.state.data.cpu}></Progress>
                    <p>内存使用率&nbsp;:&nbsp;</p><Progress className="kyl-wctpif-progress2" percent={this.state.data.memory}></Progress>
                    <p>已使用空间&nbsp;:&nbsp;</p><Progress className="kyl-wctpif-progress3" percent={this.state.data.usedSpace}></Progress>
                  </div>
                </TabPane>
                <TabPane tab="日志记录" key="3">
                  <WatClaTabLog id={this.props.id}></WatClaTabLog>
                </TabPane>
              </Tabs>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

