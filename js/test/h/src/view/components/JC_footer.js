/*
 * @Author: JC.Liu 
 * @Date: 2018-07-23 17:00:51 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-03 17:01:01
 * footer
 */
import '../../css/JC_footer.css';
import React, { Component } from 'react';
import { SVG } from '../common';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import request from '../../js/_x/util/request';
import G from '../../js/g';
const ajax = request.request;
const RequestList = request.requestMultiple;


let serverName = G.configInfo ? G.configInfo.sysName : G.title;

document.querySelector('title').innerHTML = serverName;

class QFooterBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inlineNum: 0
    }
  }
  componentDidMount() {
    let reList = [
      {
        method: 'default/index/getConfigInfo',
        params: {},
        success: (res) => {

          if (res.result && res.data) {
            G.configInfo = res.data;
            sessionStorage.setItem("configInfo", JSON.stringify(res.data));
          }
        }
      },
      {
        method: 'default/index/getColSubTeaInfo',
        params: {},
        success: (res) => {
          if (res.data) {
            let treeInfos = res.data;
            G.colSubTeaInfo = treeInfos;
            sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
          }
        },
        fail: () => {
          let treeInfos = { treeInfos: [] };
          G.colSubTeaInfo = treeInfos;
          sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
        }
      },
      {
        method: "default/cloudDiskManage/getResourceFormatList",
        params: {},
        success: (res) => {
          if (res.result && res.message === "OK") {
            G.resourceFormatList = [...res.data];
            sessionStorage.resourceFormatList = JSON.stringify(G.resourceFormatList)
          }
        }
      },
      {
        method: "default/MyClass/getYearSemWeekInfo",
        params: {},
        success: (res) => {
          if (res.result && res.data) {
            G.yearTermWeek = res.data;
            sessionStorage.setItem("yearTermWeek", JSON.stringify(res.data));
          }
        }
      }, {
        method: "default/index/getOnlineNum",
        params: {},
        success: res => {
          if (res.result) {
            this.setState({
              inlineNum: res.data.onlineNum
            })
          }
        }
      }
    ];
    RequestList(reList, () => { })
  }
  render() {
    return (
      <div className="JC-footer" >
        <div className="JC-footer-wrap" >
          <div className="JC-ft-desc JC-hd-inline">
            <div>
              <Button className="lxx-s-darkblue" onClick={() => this.props.history.push("/q_feedback/student")}>
                <SVG type="feedback" title="意见反馈" />
                <span className="JC-ft-btn" >意见反馈</span>
              </Button>
            </div>
            <div>当前在线人数：{this.state.inlineNum}</div>
            <div>技术运营支持：成都佳发安泰教育科技股份有限公司</div>
            <div>CopyRight 2002-{new Date().getFullYear()} All rights reserved</div>
          </div>
          <div className="JC-ft-wx JC-hd-inline">
            <div className="JC-ft-wximg">
              <img src={require('../../icon/qrcode.png')} alt="" />
            </div>
            <p className="JC-ft-wxdesc">关注佳发教育</p>
          </div>
        </div>
      </div>
    )
  }
}

class AdminFooterBar extends Component {
  constructor() {
    super()
    this.state = {
      inlineNum: 0
    }
  }
  componentDidMount() {
    let reList = [
      {
        method: 'default/index/getConfigInfo',
        params: {},
        success: (res) => {

          if (res.result && res.data) {
            G.configInfo = res.data;
            sessionStorage.setItem("configInfo", JSON.stringify(res.data));
          }
        }
      },
      {
        method: 'default/index/getColSubTeaInfo',
        params: {},
        success: (res) => {
          if (res.data) {
            let treeInfos = res.data;
            G.colSubTeaInfo = treeInfos;
            sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
          }
        },
        fail: () => {
          let treeInfos = { treeInfos: [] };
          G.colSubTeaInfo = treeInfos;
          sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
        }
      },
      {
        method: "default/cloudDiskManage/getResourceFormatList",
        params: {},
        success: (res) => {
          if (res.result && res.message === "OK") {
            G.resourceFormatList = [...res.data];
            sessionStorage.resourceFormatList = JSON.stringify(G.resourceFormatList)
          }
        }
      },
      {
        method: "default/MyClass/getYearSemWeekInfo",
        params: {},
        success: (res) => {
          if (res.result && res.data) {
            G.yearTermWeek = res.data;
            sessionStorage.setItem("yearTermWeek", JSON.stringify(res.data));
          }
        }
      }, {
        method: "default/index/getOnlineNum",
        params: {},
        success: res => {
          if (res.result) {
            this.setState({
              inlineNum: res.data.onlineNum
            })
          }
        }
      }
    ];
    RequestList(reList, () => { })
  }

  render() {
    return (
      <div className="JC-footer" >
        <div className="JC-footer-wrap" >
          <div className="JC-ft-desc JC-hd-inline">
            <div>
              <Button className="lxx-s-darkblue" onClick={() => this.props.history.push("/q_feedback/admin")}>
                <SVG type="feedback" />
                <span className="JC-ft-btn" >意见反馈</span>
              </Button>
            </div>
            <div>当前在线人数：{this.state.inlineNum}</div>
            <div>技术运营支持：成都佳发安泰教育科技股份有限公司</div>
            <div>CopyRight 2002-{new Date().getFullYear()} All rights reserved</div>
          </div>
          <div className="JC-ft-wx JC-hd-inline">
            <div className="JC-ft-wximg">
              <img src={require('../../icon/qrcode.png')} alt="" />
            </div>
            <p className="JC-ft-wxdesc">关注佳发教育</p>
          </div>
        </div>
      </div>
    )
  }
}

class TeaFooterBar extends Component {
  constructor() {
    super()
    this.state = {
      inlineNum: 0
    }
  }
  componentDidMount() {
    let reList = [
      {
        method: 'default/index/getConfigInfo',
        params: {},
        success: (res) => {

          if (res.result && res.data) {
            G.configInfo = res.data;
            sessionStorage.setItem("configInfo", JSON.stringify(res.data));
          }
        }
      },
      {
        method: 'default/index/getColSubTeaInfo',
        params: {},
        success: (res) => {
          if (res.data) {
            let treeInfos = res.data;
            G.colSubTeaInfo = treeInfos;
            sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
          }
        },
        fail: () => {
          let treeInfos = { treeInfos: [] };
          G.colSubTeaInfo = treeInfos;
          sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
        }
      },
      {
        method: "default/cloudDiskManage/getResourceFormatList",
        params: {},
        success: (res) => {
          if (res.result && res.message === "OK") {
            G.resourceFormatList = [...res.data];
            sessionStorage.resourceFormatList = JSON.stringify(G.resourceFormatList)
          }
        }
      },
      {
        method: "default/MyClass/getYearSemWeekInfo",
        params: {},
        success: (res) => {
          if (res.result && res.data) {
            G.yearTermWeek = res.data;
            sessionStorage.setItem("yearTermWeek", JSON.stringify(res.data));
          }
        }
      }, {
        method: "default/index/getOnlineNum",
        params: {},
        success: res => {
          if (res.result) {
            this.setState({
              inlineNum: res.data.onlineNum
            })
          }
        }
      }
    ];
    RequestList(reList, () => { })
  }
  render() {
    return (
      <div className="JC-footer" >
        <div className="JC-footer-wrap" >
          <div className="JC-ft-desc JC-hd-inline">
            <div>
              <Button className="lxx-s-darkblue" onClick={() => this.props.history.push("/q_feedback/teacher")}>
                <SVG type="feedback" />
                <span className="JC-ft-btn" >意见反馈</span>
              </Button>
            </div>
            <div>当前在线人数：{this.state.inlineNum}</div>
            <div>技术运营支持：成都佳发安泰教育科技股份有限公司</div>
            <div>CopyRight 2002-{new Date().getFullYear()} All rights reserved</div>
          </div>
          <div className="JC-ft-wx JC-hd-inline">
            <div className="JC-ft-wximg">
              <img src={require('../../icon/qrcode.png')} alt="" />
            </div>
            <p className="JC-ft-wxdesc">关注佳发教育</p>
          </div>
        </div>
      </div>
    )
  }
}

const Q_FooterBar = withRouter(QFooterBar);
const Admin_FooterBar = withRouter(AdminFooterBar);
const Tea_FooterBar = withRouter(TeaFooterBar);
export { Q_FooterBar, Admin_FooterBar, Tea_FooterBar }