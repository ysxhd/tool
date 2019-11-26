/*
 * @Author: hf 
 * @Date: 2018-08-09 14:44:19 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 15:40:24
 */

//  二次提示框

import React from 'react';
import { Button, Input, message } from 'antd';
import { withRouter } from 'react-router-dom';
import G from './../../js/g';
import { connect } from 'react-redux';
import {
  pubOrCancelOnCurOfTea_ac,
  pubPriCurOfTea_ac,
  pubPubCurOfTea_ac,
  cancelCurOfTea_ac,
  addPubCurList_ac,
  cancelPubCurList_ac,
  addPriCurList_ac,
  addOrCancelCurList_ac
} from './../../redux/cancelOrPubCurModal.reducer';
import { getCurDetailed_ac, getCurRecord_ac } from './../../redux/b_teacherClassDetail.reducer';
import { getOneLesCurList_ac } from './../../redux/b_managerClassDetail.reducer';
import { ifChangeWhenSelect_ac } from './../../redux/mc_SubClass.reducer';
import { Tm_getScheduleList_ac } from '../../redux/tm_Table.reducer';

const TextArea = Input.TextArea;
@withRouter
@connect(
  state => state,
  {
    cancelCurOfTea_ac,
    pubPubCurOfTea_ac,
    pubPriCurOfTea_ac,
    pubOrCancelOnCurOfTea_ac,
    addPubCurList_ac,
    cancelPubCurList_ac,
    addPriCurList_ac,
    addOrCancelCurList_ac,
    getCurDetailed_ac,
    getOneLesCurList_ac,
    getCurRecord_ac,
    ifChangeWhenSelect_ac,
    Tm_getScheduleList_ac
  }
)
export default class CancelOrPubCurModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: ""
    }
  }

  /**
 * 编写原因
 */
  handleChange = (e) => {
    this.setState({
      reason: e.target.value
    })
  }
  /**
   * 确定取消发布
   * id：课堂资源id
   * Role：角色判断 
   */
  ComfirmClick = (id, Role) => {
    if (Role == 'manager') {
      this.props.cancelPubCurList_ac({
        "curResources": id,
        "reason": this.state.reason
      })
    } else {
      this.props.cancelCurOfTea_ac({
        "curId": id,
        "reason": this.state.reason
      })
    }
  }

  /**
   * 发布
   * id：课堂资源id
   * type: pub:公有、pri:私有
   * Role:分角色，manager: 管理员，teacher:老师
   */
  pubOrpriPublishCur = (id, type, Role) => {
    if (type == 'pub') {
      if (Role == 'manager') {
        this.props.addPubCurList_ac({
          "curResources": id,
          "reason": this.state.reason
        })
      } else {
        this.props.pubPubCurOfTea_ac({
          "curId": id,
          "reason": this.state.reason
        })
      }
    } else {
      if (Role == 'manager') {
        this.props.addPriCurList_ac({
          "curResources": id,
          "reason": this.state.reason
        })
      } else {
        this.props.pubPriCurOfTea_ac({
          "curId": id,
          "reason": this.state.reason
        })
      }
    }
  }

  /**
   * 直播的发布与取消
   * id：课堂资源id
   * status: A:发布，S:取消
   * Role:角色
   */
  livePubOrCancel = (id, status, Role) => {
    if (Role == 'manager') {
      this.props.addOrCancelCurList_ac({
        "curResources": id,
        "operationType": status,
        "reason": this.state.reason
      })
    }
    else {
      this.props.pubOrCancelOnCurOfTea_ac({
        "curId": id,
        "status": status,
        "reason": this.state.reason
      })
    }

  }

  componentWillReceiveProps(nextprops) {
    let props = this.props.cancelOrPubCurModalReducer;
    let cpprops = nextprops.cancelOrPubCurModalReducer;
    if (cpprops.cancelcur && props.cancelcur != cpprops.cancelcur) {
      this.dealCallback(cpprops.cancelcur)
    }
    if (cpprops.public_data && props.public_data != cpprops.public_data) {
      this.dealCallback(cpprops.public_data)
    }
    if (cpprops.pravite_data && props.pravite_data != cpprops.pravite_data) {
      this.dealCallback(cpprops.pravite_data)
    }
    if (cpprops.broadcast && props.broadcast != cpprops.broadcast) {
      this.dealCallback(cpprops.broadcast)
    }
  }

  /**
   * 处理操作返回值
   */
  dealCallback = (data) => {
    let Role = this.props.Role;
    if (data.result) {
      message.success('操作成功')
      this.props.closeModal();
      if (Role == 'manager') {
        const curID = this.props.match.params.id;
        let obj = JSON.parse(decodeURIComponent(curID));
        this.props.getOneLesCurList_ac(obj);
      } else if (Role == "teacher") {
        let { semId, weekNum, subjectId, claId, semStartDate } = this.props.Tm_timeTableReducer.condition;
        let param = { semId, weekNum, subjectId, claId, semStartDate }
        this.props.Tm_getScheduleList_ac(param);
        this.props.ifChangeWhenSelect_ac(false)
      }
      else {
        const curID = this.props.match.params.id;
        this.props.getCurDetailed_ac(curID);
        this.props.getCurRecord_ac(curID);
      }
    } else {
      message.error(data.message)
    }
  }

  render() {
    const styleCss = {
      container: {
        padding: 40,
      },
      redText: {
        color: '#ff6464',
        marginBottom: 10
      },
      textarea: {
        height: 160,
        marginTop: 10,
        fontSize: 12,
        resize: 'none',
      }
    }
    let { ModalType, ID, Role } = this.props;

    let items;
    switch (ModalType.puborcancel) {
      case 'pub':
        items = <div style={styleCss.container}>
          <p style={styleCss.redText}>课堂发布后，将会在“{G.configInfo.sysName}”上显示</p>
          <p>您确定要发布吗？</p>
          <TextArea value={this.state.reason} maxLength="256" placeholder="请输入发布原因" style={styleCss.textarea} onChange={this.handleChange} />
          <div className="hf-m-buttons">
            <Button className="lxx-s-blue hf-m-button" onClick={(id, type) => this.pubOrpriPublishCur(ID, ModalType.puborpri, Role)}>确定</Button>
            <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
          </div>
        </div>
        return items
      case 'cancel':
        items = <div style={styleCss.container}>
          <p style={styleCss.redText}>一旦取消发布，课堂将不会在“{G.configInfo.sysName}”</p>
          <p>您确定要取消发布吗？</p>
          <TextArea value={this.state.reason} maxLength="256" placeholder="请输入取消发布原因" style={styleCss.textarea} onChange={this.handleChange} />
          <div className="hf-m-buttons">
            <Button className="lxx-s-blue hf-m-button" onClick={(id, role) => this.ComfirmClick(ID, Role)}>确定</Button>
            <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
          </div>
        </div>
        return items
      case 'livePub':
        items = <div style={styleCss.container}>
          <p style={styleCss.redText}>开启直播后，课堂将会在“{G.configInfo.sysName}”上显示</p>
          <p>您确定要开启直播吗？</p>
          <TextArea value={this.state.reason} maxLength="256" placeholder="请输入开启原因" style={styleCss.textarea} onChange={this.handleChange} />
          <div className="hf-m-buttons">
            <Button className="lxx-s-blue hf-m-button" onClick={(id, status) => this.livePubOrCancel(ID, 'A', Role)}>确定</Button>
            <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
          </div>
        </div>
        return items
      case 'liveCancel':
        items = <div style={styleCss.container}>
          <p style={styleCss.redText}>一旦取消直播，课堂将不会在“{G.configInfo.sysName}”上显示</p>
          <p>您确定要取消直播吗？</p>
          <TextArea value={this.state.reason} maxLength="256" placeholder="请输入取消直播原因" style={styleCss.textarea} onChange={this.handleChange} />
          <div className="hf-m-buttons">
            <Button className="lxx-s-blue hf-m-button" onClick={(id, status) => this.livePubOrCancel(ID, 'S', Role)}>确定</Button>
            <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
          </div>
        </div>
        return items
    }
    return (
      { items }
    )
  }
}