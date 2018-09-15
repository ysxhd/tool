/*
 * @Author: kangyl
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:40:25
 * 状态监督——视图列表单个组件
 */
import React, { Component } from 'react';
import { IMG, SVG } from '../base';
import { Checkbox } from 'antd';
import { G } from './../../js/g';
import '../../css/admin/watClaViewListCon.css';
import WatClaTabParaInfo from './watClaTabParaInfo';
import { WatClaTerminCtrl } from './../../components/admin/index';
import { ConfirmDia } from './index.js';
import WatClaTabLog from './watClaTabLog';

export class WatClaViewListCon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      hoverIsShow: false,
      chioceStatus: false,
      online: 1,
      modalIsShow: false,
      ctrlModal: false,        //远程控制modal
      id: this.props.data.ssid
    }
    this.checkCli = this.checkCli.bind(this);
    this.showModal = this.showModal.bind(this);
    this.ctrlCli = this.ctrlCli.bind(this);
    this.terminalContrl = this.terminalContrl.bind(this);
    this.deleCli = this.deleCli.bind(this);
  }
  handleClick = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }
  mouseHover = () => {
    this.setState({
      hoverIsShow: true
    })
  }
  mouseLeave = () => {
    this.setState({
      hoverIsShow: false,
      isShow: true
    })
  }
  choice = () => {
    this.setState({
      chioceStatus: !this.state.chioceStatus
    })
  }
  checkCli(e) {
    this.props.listCli(e.target.checked, this.props.data.ssid);
  }
  showModal() {
    this.setState({
      modalIsShow: true
    })
  }
  componentDidMount() {
  }
  //远程控制modal
  ctrlCli(id) {
    this.setState({
      ctrlModal: true,
      dataId: id
    })
  }
  terminalContrl(val) {
    this.setState({
      ctrlModal: val
    })
  }
  //删除点击
  deleCli(id) {
    this.props.deleData(id);
  }
  render() {
    const check = this.props.ifChecked;
    const editStyle = this.state.isShow ? "none" : "block";
    const hoverStyle = this.state.hoverIsShow ? "visible" : "hidden";
    const chioceStyle = this.state.chioceStatus ? "none" : "block";
    const isOnline1 = this.props.data.status === 1 ? "#808080" : "#acacac";
    const isOnline2 = this.props.data.status === 1 ? "#4d4d4d" : "#a2a2a2 ";
    return (
      <div>
        <div className="kyl-wcvlc-msgList"
          onMouseOver={this.mouseHover}
          onMouseLeave={this.mouseLeave}>
          <div className="kyl-wcvlc-listPic">
            {this.props.data.status == this.state.online ?
              // <IMG src={require('../../img/machine.png')}></IMG>
              <img src={G.serverUrl + this.props.data.devicePic} ref={img => this.img = img} onError={() => this.img.src = require('../../img/machine.png')} />
              :
              <div className="kyl-wcvlc-notOnlinePic" style={{ display: "block" }} ></div>}
            {/* 左上白色的点 */}
            <Checkbox checked={check} onClick={this.checkCli}></Checkbox>

            {/* 右上的下拉选项框 */}
            <div className="kyl-wcvlc-edit"
              onClick={this.handleClick}
              style={{ visibility: hoverStyle }}>
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={"#icon-down"}></use>
              </svg>
            </div>
            <div className="kyl-wcvlc-set" style={{ display: editStyle }}>
              <table></table>
              <WatClaTabParaInfo val={1} bpData={this.props.noData} id={this.props.data.ssid} class={this.props.data.className} location={this.props.data.location}
                status={this.props.data.status}
              ></WatClaTabParaInfo>
              <div onClick={() => this.ctrlCli(this.props.data.ssid)}>远程控制</div>
              <div className="kyl-wcvlc-delete" onClick={this.deleCli.bind(this, this.props.data.ssid)}>&nbsp;&nbsp;&nbsp;&nbsp;删除</div>
            </div>
          </div>
          <div className="kyl-wcvlc-listCont">
            <span className="kyl-wcvlc-sp1" style={{ color: isOnline1 }}>班级&nbsp;:&nbsp;
              <span className="kyl-wcvlc-sp2" title={this.props.data.className} style={{ color: isOnline2 }}>{this.props.data.className}</span>
            </span>
            <span className="kyl-wcvlc-sp1" style={{ color: isOnline1 }}>场所&nbsp;:&nbsp;
              <span className="kyl-wcvlc-sp2" title={this.props.data.location} style={{ color: isOnline2 }}>{this.props.data.location}</span>
            </span>
            <span className="kyl-wcvlc-sp1" style={{ color: isOnline1 }}>IP&nbsp;:&nbsp;
              <span className="kyl-wcvlc-sp2,kyl-wcvlc-etr3" title={this.props.data.ipAddress} style={{ color: isOnline2 }}>{this.props.data.ipAddress}</span>
            </span>
            <span className="kyl-wcvlc-sp1" style={{ color: isOnline1 }}>终端版本&nbsp;:&nbsp;
              <span className="kyl-wcvlc-sp2,kyl-wcvlc-etr4" title={this.props.data.softwareVersion} style={{ color: isOnline2 }}>{this.props.data.softwareVersion}</span>
            </span>
          </div>
        </div>
        {
          this.state.ctrlModal ?
            <WatClaTerminCtrl
              ifContral={this.state.ctrlModal}
              dataId={[this.state.dataId]}
              status={this.props.data.status}
              terminalContrl={this.terminalContrl}></WatClaTerminCtrl> : null
        }
      </div>
    );
  }
}