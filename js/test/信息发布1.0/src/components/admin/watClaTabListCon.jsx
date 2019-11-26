/*
 * @Author: KangYL 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:37:02
 * 状态监督——列表列表单个组件
 */
import React, { Component } from 'react';
import { Checkbox, Progress } from 'antd';
import { IMG, SVG } from './../base';
import { G } from './../../js/g';
import { WatClaTerminCtrl } from '../../components/admin/index';
import '../../css/admin/watClaTabListCon.css';
import WatClaTabParaInfo from '../../components/admin/watClaTabParaInfo';

export class WatClaTabListCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      dataId: '',            //dataId
      hoverIsShow: false,
      online: 1,
      notLine: 2,
      isOnLine: true,
      ifContral: false,        //终端控制modal是否显示
    }
    this.terminalContrl = this.terminalContrl.bind(this);
    this.ifTerContrl = this.ifTerContrl.bind(this);
    this.checkCli = this.checkCli.bind(this);
    this.deleCli = this.deleCli.bind(this);
  }
  // componentWillMount() {
  // }
  mouseHover = () => {
    /当鼠标进入列表/
    this.setState({
      hoverIsShow: true
    })
  }
  mouseLeave = () => {
    /当鼠标离开列表/
    this.setState({
      hoverIsShow: false,
    })
  }
  checkCli(e) {
    // /点击删除发送ssid/
    this.props.listCli(e.target.checked, this.props.data.ssid);
  }
  //终端控制modal
  ifTerContrl(id) {
    this.setState({
      ifContral: true,
      dataId: id
    })
  }
  //终端控制回调函数
  terminalContrl() {
    this.setState({
      ifContral: false
    })
  }
  //单项删除
  deleCli(id) {
    this.props.deleData(id)
  }

  render() {
    const hoverStyle = this.state.hoverIsShow ? "visible" : "hidden";
    // status 为点的样式      status1为字的样式
    const status = this.props.data.status === this.state.online ? "#00cd89" : "#cccccc";
    const status1 = this.props.data.status === this.state.online ? "#00cd89" : "#ff9090";
    const online1 = this.props.data.status === this.state.online ? "#808080" : "#acacac";
    const online2 = this.props.data.status === this.state.online ? "#4d4d4d" : "#b2b2b2";
    const online3 = this.props.data.status === this.state.online ? "#666666" : "#a3a3a3";
    const online4 = this.props.data.status === this.state.online ? "在" : "离";
    return (
      <div>
        <div className="kyl-wctblc-all"
          className="kyl-wctblc-list cjy-clearfix" onMouseOver={this.mouseHover} onMouseLeave={this.mouseLeave}>
          {/* checkbox */}
          <div className="cjy-clearfix" className="kyl-wctblc-checkbox" >
            <Checkbox checked={this.props.ifChecked} onClick={this.checkCli}></Checkbox>
          </div>
          {/* 图片 */}
          <div className="cjy-clearfix" className="kyl-wctlc-img">
            {this.props.data.status === this.state.online ?
              // <IMG src={require('../../img/machine.png')}  alt=""></IMG>
              <img src={G.serverUrl + this.props.data.devicePic} ref={img => this.img = img} onError={() => this.img.src = require('../../img/machine.png')} />
              :
              <div className="kyl-wctlc-notOnlinePic" style={{ display: "block" }} > </div>}
          </div>
          {/* 中间内容信息 */}
          <div className="cjy-clearfix" className="kyl-wctlc-midCont" >
            <div className="kyl-wctlc-sp3">
              <span className="kyl-wctlc-className" style={{ color: online1 }}>班级&nbsp;:&nbsp;<span className="kyl-wctlc-cont" title={this.props.data.className} style={{ color: online2 }}>{this.props.data.className}</span></span>
              <span className="kyl-wctlc-IP" style={{ color: online1 }}>IP&nbsp;:&nbsp;<span className="kyl-wctlc-cont" title={this.props.data.ipAddress} style={{ color: online2 }}>{this.props.data.ipAddress}</span></span>
              <span className="kyl-wctlc-status" style={{ color: online1 }}>状态&nbsp;:&nbsp;</span>
              <div className="kyl-wctlc-isOnline" style={{ backgroundColor: status }}><span className="kyl-wctlc-cont1" style={{ color: status1 }}>{online4}线</span></div>
            </div>
            <div className="kyl-wctlc-sp2">
              <span className="kyl-wctlc-location" style={{ color: online1 }}>场所&nbsp;:&nbsp;<span className="kyl-wctlc-cont" title={this.props.data.location} style={{ color: online2 }}>{this.props.data.location}</span></span>
              <span className="kyl-wctlc-finVersion" style={{ color: online1 }}>终端版本&nbsp;:&nbsp;<span className="kyl-wctlc-cont" title={this.props.data.softwareVersion} style={{ color: online2, marginLeft: "25px" }}>{this.props.data.softwareVersion}</span></span>
            </div>
            {/* 右边设备使用情况图表 */}
            <div className="kyl-wctlc-percent" >
              <div style={{ width: 170 }}>
                <span style={{ color: online3 }}>CPU:</span>
                {this.props.data.status === 1 ?
                  <Progress percent={Math.round(this.props.data.cpu * 100)} size="small" className="kyl-wctlc-online" /> : <Progress percent={Math.round(this.props.data.cpu * 100)} size="small" className="kyl-wctlc-notOnline" />}
                <span style={{ color: online3 }}>内存:</span>
                {this.props.data.status === 1 ?
                  <Progress percent={Math.round(this.props.data.memory * 100)} size="small" className="kyl-wctlc-online" /> :
                  <Progress percent={Math.round(this.props.data.memory * 100)} size="small" className="kyl-wctlc-notOnline" />}
                <span style={{ color: online3 }}>空间:</span>
                {this.props.data.status === 1 ?
                  <Progress percent={Math.round(this.props.data.space * 100)} size="small" className="kyl-wctlc-online" /> : <Progress percent={Math.round(this.props.data.space * 100)} size="small" className="kyl-wctlc-notOnline" />}
              </div>
            </div>
          </div>
          {/* 单个设备操作框  */}
          <div className="kyl-wctlc-svg"
            style={{ visibility: hoverStyle }}>
            <span className="kyl-wctlc-params">
              <WatClaTabParaInfo id={this.props.data.ssid} class={this.props.data.className} location={this.props.data.location}
                status={this.props.data.status}></WatClaTabParaInfo>
            </span>
            <span onClick={() => this.ifTerContrl(this.props.data.ssid)} className="kyl-wctlc-interactive">
              <SVG type='interactive'></SVG>
            </span>
            <span className="kyl-wctlc-cross" onClick={this.deleCli.bind(this, this.props.data.ssid)}>
              <SVG type='cross'></SVG>
            </span>
          </div>
        </div>
        {
          this.state.ifContral
            ?
            <WatClaTerminCtrl
              ifContral={this.state.ifContral}
              dataId={[this.state.dataId]}
              status={this.props.data.status}
              terminalContrl={this.terminalContrl}></WatClaTerminCtrl>
            :
            null
        }
      </div>
    );
  }
}