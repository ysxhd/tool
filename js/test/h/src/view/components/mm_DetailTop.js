/*
 * @Author: hf 
 * @Date: 2018-08-01 14:58:40 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-15 19:01:02
 */

/**
 * 管理员的课堂管理页面 > 课堂详情 头部
 */
import number from './../../js/_x/util/number';
import '../../js/_x/util/sundry';
import React from 'react';
import { Button, Tooltip, Input, Popover, message } from 'antd';
import { withRouter } from 'react-router-dom';
import MmStickManage from './../components/mm_stickManage';
import { connect } from 'react-redux';
import { HfModal } from './../common';
import CancelOrPubCurModal from './cancelorPubCurModal';
import G from './../../js/g';
import request from './../../js/_x/util/request';
import { recordWhenJump_ac } from './../../redux/b_managerClassMan.reducer';
const Request = request.request;
@withRouter
@connect(
  state => state.B_ManagerClassManDetaileReducer,
  { recordWhenJump_ac }
)
export default class MmDetailTop extends React.Component {

  constructor() {
    super()
    this.state = {
      ModalShowOrHide: false,
      ModalType: '',
      ifMessage: false,
    }
  }
  /**
      * 打开弹窗
      * obj:{
      * puborcancel:pub:发布、cancel:取消
      * puborpri:pri:私有、pub:公有
      * }
      * obj：false : 关联上传弹框，true ：操作提示框
     */
  openModal = (obj) => {
    if (obj.puborcancel) {
      if (this.props.select_data.length) {
        this.setState({
          ModalShowOrHide: true,
          ModalType: obj,
          ifMessage: obj.puborcancel
        })
      } else {
        message.warning('请至少选择一个课堂')
      }
    } else {
      this.setState({
        ModalShowOrHide: true,
      })
    }
  }


  /**
   * 关闭Modal
   */

  closeModal = () => {
    this.setState({
      ModalShowOrHide: false
    })
  }

  /**
   * 判断本节课的完成状态，并且显示相应的按钮
   *curFinishStatus -1未开始，0进行中，1已完成
   */
  batchBtnShowOrHide = (curFinishStatus) => {
    const styleCss = {
      button: {
        marginLeft: 20,
      }
    };
    let btns, nowDate = new Date().getTime();
    if (curFinishStatus == -1) {
      //未开始
      btns = <div>
        <Button style={styleCss.button} className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>批量开启直播</Button>
        <Button style={styleCss.button} className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>批量取消直播</Button>
      </div>
    }
    else if (curFinishStatus == 1) {
      //已完成
      btns = <div>
        {
          G.configInfo.pubCurType == 1
            ?
            <Button style={styleCss.button} className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' })}>发布到公有</Button>
            :
            null
        }
        <Button style={styleCss.button} className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' })}>发布到私有</Button>
        <Button style={styleCss.button} className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' })}>取消发布</Button>
      </div>
    }
    else if (curFinishStatus == 0) {
      //进行中
      btns = <div>
        <Button style={styleCss.button} className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>批量开启直播</Button>
        <Button style={styleCss.button} className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>批量终止直播</Button>
      </div>
    }
    return btns;
  }

  /**
   * 返回
   */
  jumpBack = () => {
    const curID = this.props.match.params.id;
    let obj = JSON.parse(decodeURIComponent(curID));
    this.props.recordWhenJump_ac(obj);
    this.props.history.push('/b_managerClassMan')
  }

  render() {
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto',
        display: 'flex',
      },
      text: {
        fontSize: 20,
        marginRight: 30,
      },
      button: {
        marginLeft: 20,
      }
    }

    let data = this.props.detail_data[0];

    let btns = this.batchBtnShowOrHide(data.curFinishStatus)
    return (
      data
        ?
        <div style={styleCss.container} >
          <div style={styleCss.text}>周{Number(data.weekday).toChinese()}（{Number(data.actureDate).formatTime().substring(5)}）</div>
          <div style={styleCss.text}>第{Number(data.weekday).toChinese()}节 ({Number(data.lessonStartTime).formatTime(false).substring(11)} ~ {Number(data.lessonEndTime).formatTime(false).substring(11)})</div>
          <div style={{ flex: 1 }} >
            <Button onClick={this.openModal}>置顶管理</Button>
          </div>
          {btns}
          <Button style={styleCss.button} className="lxx-s-wathet" onClick={this.jumpBack}>返回</Button>
          {
            this.state.ifMessage
              ?
              <HfModal
                title="消息提示"
                ModalShowOrHide={this.state.ModalShowOrHide}
                width={600}
                closeModal={this.closeModal}
                contents={<CancelOrPubCurModal closeModal={this.closeModal} ID={this.props.select_data} ModalType={this.state.ModalType} Role="manager" />}
              />
              :
              <HfModal
                title="置顶管理"
                ModalShowOrHide={this.state.ModalShowOrHide}
                width={1000}
                closeModal={this.closeModal}
                contents={
                  <MmStickManage closeModal={this.closeModal} />
                }
              />
          }


        </div>
        :
        null
    )
  }
}