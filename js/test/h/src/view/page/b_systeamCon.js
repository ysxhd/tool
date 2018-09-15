/*
 * @Author: junjie.lean
 * @Date: 2018-07-23 16:08:05
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-14 09:45:38
 * 后台 - 平台配置主页
 */
import React from 'react';
import { AdminNav } from './JC_header';
import { Button, Switch, Modal, message } from 'antd';
import { Admin_FooterBar } from '../components/JC_footer';
import { SVG } from '../common';
import {
  setSysteamConfig_action,
  screenMaskOpen_action,
  screenMaskClose_action,
  getSysteamCloudDiskData
} from '../../redux/lean.reducers';

import G from '../../js/g';
import '../../css/sysConf.css';
import { connect } from 'react-redux';

const action = {
  setSysteamConfig_action,
  screenMaskOpen_action,
  screenMaskClose_action,
  getSysteamCloudDiskData
}

message.config({
  maxCount: 1,
  duration: 3
})
//平台功能配置
class SysFun extends React.Component {
  constructor(props) {
    super(props)
    // console.log(G.configInfo)
    let title = G.configInfo.sysName,
      pubCurType = Boolean(G.configInfo.pubCurType),
      liveCurType = Boolean(G.configInfo.liveCurType);
    this.state = {
      title,
      pubCurType,
      liveCurType,
      visible: false
    }
  }

  static getDerivedStateFromProps(props, state) {
    let data = {
      ...G.configInfo,
      ...props.systeamConfigReducer.data
    }, _data = {};

    // console.log(data);
    if (!data) {
      return false
    } else {
      _data.pubCurType = data.pubCurType === 1 ? true : false;
      _data.liveCurType = data.liveCurType === 1 ? true : false;
      _data.title = data.sysName;
    }
    return {
      ...state,
      ..._data
    }
  }

  changeTitleHandle() {
    this.setState({
      ...this.state,
      changeNameState: true
    })
    setTimeout(() => {
      let targetEle = document.querySelector('.lean-sysconf-changeTitle-inputBox>input');
      if (targetEle) {
        targetEle.focus();
      }
    }, 4)
  }

  changeTitleCommit() {
    let targetEle = document.querySelector('.lean-sysconf-changeTitle-inputBox>input');
    let reg = new RegExp("[`~!@#$_^&*()=|{}':;',\\[\\].<>/?~！%@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    if (targetEle.value == "") {
      message.warning('请填写标题名称')
      targetEle.focus();
      return false;
    } else if (targetEle.value.indexOf(' ') != -1) {
      message.warning('不能包含空格');
      return false
    } else if (reg.test(targetEle.value)) {
      //正则验证
      message.warning('不能包含特殊字符');
      return false
    } else {
      this.setState({
        ...this.state,
        visible: true,
        newTitleName: targetEle.value || ""
      })
    }
  }

  changeTitleCancel() {
    this.setState({
      ...this.state,
      changeNameState: false
    })
  }

  handleOk() {
    let pr = {
      sysName: this.state.newTitleName
    }
    let scb = () => {
      message.success('设置成功');
      document.querySelector('title').innerHTML = pr.sysName;
      this.setState({
        ...this.state,
        changeNameState: false,
        visible: false,
        newTitleName: ""
      })
    }
    let fcb = () => {
      message.warning('设置失败');
      this.setState({
        ...this.state,
        visible: false,
        newTitleName: ""
      })
    }
    this.props.setSysteamConfig_action(pr, scb, fcb);

  }

  handleCancel() {
    this.setState({
      ...this.state,
      visible: false
    })
  }

  pubClassSwitch(e) {
    let pr = {
      pubCurType: e ? 1 : 0
    };
    this.props.setSysteamConfig_action(pr);
  }

  liveSwitch(e) {
    let pr = {
      liveCurType: e ? 1 : 0
    };
    this.props.setSysteamConfig_action(pr);
  }

  render() {
    return (
      <div className="lean-sysconf-modules">
        <Modal
          title="请注意："
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText="确认"
          cancelText="取消"
        >
          <div className='lean-sysconf-warningBox'>
            <p>
              点击确定后，整个系统的名称将由"{G.configInfo.sysName}"变更为"{this.state.newTitleName}"
          </p>
            <p>
              您确定将做此更改吗？
          </p>
          </div>
        </Modal>
        <h3 className="lean-sysconf-innerTitle">
          平台功能
        </h3>
        <ul>
          <li>
            <span>平台名称</span>
            {
              this.state.changeNameState
                ?
                <span className="lean-sysconf-changeTitle-inputBox">
                  <input type='text' placeholder="此处填写系统名称" maxLength="15" />
                  <SVG
                    type='ok'
                    onClick={this.changeTitleCommit.bind(this)}
                    className='lean-sysconf-changeTitleCommit' />
                  <SVG
                    type='cancel'
                    onClick={this.changeTitleCancel.bind(this)}
                    className='lean-sysconf-changeTitleCancel' />
                </span>
                :
                <span>
                  {this.state.title}
                  <Button
                    className="lean-sysconf-changeTitleBtn lxx-s-blue"
                    onClick={this.changeTitleHandle.bind(this)} >修改</Button>
                </span>
            }

          </li>
          <li>
            <span>公共课堂</span>
            <span>
              关闭后平台不再显示公共课堂，学生和教师均只能看到自己的课程
              <Switch
                onChange={this.pubClassSwitch.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.pubCurType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>
          <li>
            <span>直播功能</span>
            <span>
              关闭后平台将不再显示直播课程，相关的审核功能也会关闭
              <Switch
                onChange={this.liveSwitch.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.liveCurType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>
        </ul>
      </div>
    )
  }
}

//云盘管理配置
class NetdeskMan extends React.Component {
  constructor(props) {
    super(props)
    let gc = {
      ...JSON.parse(sessionStorage.configInfo)
    }
    let cloudType = Boolean(gc.cloudType);
    let privCloudNum = (gc.privCloudNum / 1024 / 1024).toFixed(0) - 0;
    let globleTotle = 1000,
      globleUse = 1;
    this.state = {
      cloudType,
      globleUse,
      globleTotle,
      privCloudNum
    }
  }
  componentDidMount() {
    // console.log(this.state)
  }
  static getDerivedStateFromProps(props, state) {
    // console.log(props.systeamConfigReducer);
    // console.log('props 刷新', props.systeamConfigReducer);
    let data = {
      ...G.configInfo,
      ...props.systeamConfigReducer.data
    }, _data = {};
    if (!data || !props.systeamCloudDiskDataReducer.data) {
      return false
    } else {
      _data.cloudType = data.cloudType === 1 ? true : false;
      _data.globleTotle = props.systeamCloudDiskDataReducer.data.totalCapacity;
      _data.globleUse = props.systeamCloudDiskDataReducer.data.usedCapacity;
      // _data.privCloudNum = props.systeamConfigReducer.data.privCloudNum / 1024 / 1024;
    }
    return {
      ...state,
      ..._data
    }
  }

  netDeskSwitch(e) {
    let pr = {
      cloudType: e ? 1 : 0
    }
    this.props.setSysteamConfig_action(pr);
  }

  netDeskConfirm() {
    let pr = {
      privCloudNum: this.state.privCloudNum * 1024 * 1024
    }
    let scb = () => {
      message.success('调整配额成功')
    };
    let fcb = (r) => {
      message.error('调整配额失败，', r)
    }
    // console.log(this.props.systeamConfigReducer.data.privCloudNum);
    // if (this.state.privCloudNum * 1024 * 1024 == this.props.systeamConfigReducer.data.privCloudNum) {
    //   return fasle;
    // }
    this.props.setSysteamConfig_action(pr, scb, fcb);
  }

  deskSetAdd() {
    if ((this.state.privCloudNum + 1) * 1024 * 1024 > this.state.globleTotle) {
      message.error('不能超过最大值');
      return false;
    }
    this.setState({
      ...this.state,
      privCloudNum: this.state.privCloudNum + 1
    })
  }

  deskSetMinus() {
    let privCloudNum = this.state.privCloudNum == 0 ? 0 : this.state.privCloudNum - 1;
    this.setState({
      ...this.state,
      privCloudNum
    })
  }

  render() {
    // console.log(this.state.privCloudNum);
    let netDeskCompute = () => {
      let use, unUse;
      use = this.state.globleUse / this.state.globleTotle;
      use = use >= 75 ? 75 : use <= 25 ? 25 : use;
      unUse = 100 - use;
      return {
        use,
        unUse
      }
    }

    let useStyle = {
      width: netDeskCompute().use + '%'
    }, unuseStyle = {
      width: netDeskCompute().unUse + '%'
    }


    return (
      <div className="lean-sysconf-modules">
        <h3 className="lean-sysconf-innerTitle">
          云盘管理
        </h3>
        <ul>
          <li>
            <span>云盘</span>
            <span>
              开启/关闭云盘上传功能，关闭后云盘上已有的文件不会被删除
              <Switch onChange={this.netDeskSwitch.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.cloudType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>
          <li>
            <span>云盘配额</span>
            <span>
              <span className="lean-sysconf-netdeskAll">
                <span style={useStyle}>已用{this.state.globleUse.formatSize()}</span>
                <span style={unuseStyle}>空闲{(this.state.globleTotle - this.state.globleUse).formatSize()}</span>
              </span>
              当前配额/G：
              <span className="lean-sysconf-netdeskSet">
                <button onClick={this.deskSetMinus.bind(this)}> — </button>
                <span>{this.state.privCloudNum}</span>
                <button onClick={this.deskSetAdd.bind(this)}>＋</button>
              </span>
              <Button onClick={this.netDeskConfirm.bind(this)} className="lean-sysconf-netDeskCof lxx-s-blue">应用</Button>
            </span>

          </li>
        </ul>
      </div>
    )
  }
}

//评论及评价配置
class Comment extends React.Component {
  constructor(props) {
    super(props)
    let stuPrivCurCommentType = Boolean(G.configInfo.stuPrivCurCommentType),
      stuPubCurCommentType = Boolean(G.configInfo.stuPubCurCommentType),
      teachPubCurCommentType = Boolean(G.configInfo.teachPubCurCommentType);
    this.state = {
      stuPrivCurCommentType,
      stuPubCurCommentType,
      teachPubCurCommentType
    }
  }

  static getDerivedStateFromProps(props, state) {
    let data = {
      ...G.configInfo,
      ...props.systeamConfigReducer.data,
    }, _data = {};
    if (!data) {
      return false
    } else {
      _data.stuPrivCurCommentType = data.stuPrivCurCommentType === 1 ? true : false;
      _data.stuPubCurCommentType = data.stuPubCurCommentType === 1 ? true : false;
      _data.teachPubCurCommentType = data.teachPubCurCommentType === 1 ? true : false;
    }
    return {
      ...state,
      ..._data
    }
  }


  teacherCommentPubClass(e) {
    let pr = {
      teachPubCurCommentType: e ? 1 : 0
    }
    this.props.setSysteamConfig_action(pr);
  }

  studentCommentMyClass(e) {
    let pr = {
      stuPrivCurCommentType: e ? 1 : 0
    }
    this.props.setSysteamConfig_action(pr);

  }

  studentCommentPubClass(e) {
    let pr = {
      stuPubCurCommentType: e ? 1 : 0
    }
    this.props.setSysteamConfig_action(pr);
  }

  render() {
    return (
      <div className="lean-sysconf-modules">
        <h3 className="lean-sysconf-innerTitle">
          评论/评价及回复
        </h3>
        <ul>
          <h3>教师</h3>
          <li>
            <span>公共课堂资源</span>
            <span>
              允许教师对公共课堂资源进行评论和评价
            <Switch onChange={this.teacherCommentPubClass.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.teachPubCurCommentType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>
          <h3>学生</h3>
          <li>
            <span>我的课堂资源</span>
            <span>
              允许学生对我的课堂资源进行评论和评价
            <Switch onChange={this.studentCommentMyClass.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.stuPrivCurCommentType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>
          <li>
            <span>公共课堂资源</span>
            <span>
              允许学生对公共课堂资源进行评论和评价
            <Switch onChange={this.studentCommentPubClass.bind(this)}
                checkedChildren="开"
                unCheckedChildren="关"
                defaultChecked={this.state.stuPubCurCommentType}
                className="lean-sysconf-pubclassSwitch" />
            </span>
          </li>

        </ul>
      </div>
    )
  }
}

//全屏遮罩 通过redux进行控制
class ScreenMask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShow: false/**默认应当是false，关闭状态 */
    }
  }
  componentDidMount() {
  }
  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      ...props.screenMaskReducer
    }
  }
  render() {
    let isShow = this.state.isShow;
    let [show,
      hide] = [
        {
          zIndex: "99",
          display: "block"
        }, {
          zIndex: "-1",
          display: "none"
        }
      ];
    return (
      <div
        className="lean-netdesk-ScreenMask"
        style={isShow
          ? show
          : hide}></div>
    )
  }
}

@connect(state => state, { ...action })
export default class B_SysteamCon extends React.Component {
  constructor(props) {
    super(props);
    /**获取云盘配置操作 */
    this.props.getSysteamCloudDiskData();
    /**初始化当前模块配置 */
    // this.props.setSysteamConfig_action({ ...G.configInfo })
  }
  render() {
    return (
      <div>
        <AdminNav />
        <div className="lean-sysconf-contentContainer">
          <SysFun  {...this.props} />
          <NetdeskMan {...this.props} />
          <Comment {...this.props} />
          <ScreenMask {...this.props} />
        </div>
        <Admin_FooterBar />
      </div>
    )
  }

}