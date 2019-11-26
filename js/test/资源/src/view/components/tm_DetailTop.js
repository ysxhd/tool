/*
 * @Author: hf 
 * @Date: 2018-08-01 14:58:40 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-15 19:30:31
 */

/**
 * 教师的课堂管理页面 > 课堂详情 头部
 */

import React from 'react';
import { Button, Tooltip, Input, Popover, message } from 'antd';
import { withRouter } from 'react-router-dom';
import TmDetailRelMyupload from './../components/tm_DetailRelMyupload';
import TmDetailOperateDoc from './../components/tm_DetailOperateDoc';
import '../../js/_x/util/sundry';
import { HfModal } from './../common';
import CancelOrPubCurModal from './cancelorPubCurModal';
import { modifyCurName_ac, getCurDetailed_ac, removeComponent_ac } from './../../redux/b_teacherClassDetail.reducer';
import G from './../../js/g';
import { connect } from 'react-redux';
import url from './../../js/_x/util/url';
import { tm_recordWhenJump_ac } from './../../redux/b_teacherClassMan.reducer';


const goWith = url.goWith;


@withRouter
@connect(
  state => state,
  { modifyCurName_ac, getCurDetailed_ac, removeComponent_ac, tm_recordWhenJump_ac }
)
export default class TmDetailTop extends React.Component {

  constructor() {
    super()
    this.state = {
      editable: false,
      ModalShowOrHide: false,
      curName: '',
      ModalType: '',
      ifMessage: false,
    }
  }

  componentWillReceiveProps(nextprops) {
    nextprops = nextprops.B_TacherClassManDetailReducer;
    let props = this.props.B_TacherClassManDetailReducer;
    if (props.curName_data != nextprops.curName_data) {
      if (nextprops.curName_data.result) {
        message.success('修改成功')
        this.props.getCurDetailed_ac(this.props.match.params.id)
      } else {
        message.error(nextprops.curName_data.message)
      }
    }
    if (props.relMyupload_data != nextprops.relMyupload_data) {
      if (nextprops.relMyupload_data.result) {
        message.success('关联成功');
        this.closeModal()
        this.props.getCurDetailed_ac(this.props.match.params.id)
      } else {
        message.error(nextprops.relMyupload_data.message)
      }
    }
  }


  //出现输入框
  handleEdit = () => {
    this.setState({
      editable: true
    })
  }

  /**
   * 保存修改后的课堂
   * id:资源id
   */
  handleSave = (id) => {
    this.setState({
      editable: false
    })
    if (this.state.curName != '') {
      this.props.modifyCurName_ac(
        {
          "curResourceId": id,
          "curName": this.state.curName
        }
      )
    }
  }

  /**
   * 取消修改课堂名称
   */
  handleCancel = () => {
    this.setState({
      editable: false,
      curName: ''
    })
  }

  /**
   *课程名称修改
   */
  handleInput = (e) => {
    this.setState({
      curName: e.target.value
    })
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
    this.setState({
      ModalShowOrHide: true,
      ModalType: obj,
      ifMessage: obj.puborcancel
    })
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
     * 跳转到播放页
     * fileId:文件id
     */

  jumpToVideo = (fileId, curFinishStatus, vodPubType) => {
    // let url = {};
    // switch (curFinishStatus) {
    //   case -1:
    //     url = {
    //       to: 'q_recordVideo',
    //       with: ['teacher', fileId, true]
    //     };
    //     break;
    //   case 0:
    //     url = {
    //       to: 'q_recordVideo',
    //       with: ['teacher', fileId, true]
    //     };
    //     break;
    //   case 1:
    //     url = {
    //       to: 'q_recordVideo',
    //       with: ['teacher', fileId, true]
    //     };
    //     break;
    // }
  }

  /**
   * 课堂的操作按钮显示
   * (课堂只涉及12)
   * vodPubStatus: 点播发布状态:-2空课堂，-1审核未通过，0未申请，1申请中，2审核通过(2.1)
   * autoPubType: 自动发布状态 -1不自动发布，0未设置，1自动发布到私有，2自动发布到公有(3)
   * vodPubType: 点播发布类型，0默认值（未发布），1私有，2公有(2.1.1)
   * videoSaveStatus:录播视频状态 -1抓取失败，0抓取中，1已抓取，2人工上传(3)
   * livePubStatus: 直播发布状态 -1审核未通过，0未申请，1申请中，2审核通过(2.2)
   * curFinishStatus: 课堂完成状态，-1未开始，0进行中，1已完成(1)
   * videoNum:录播数量
   * curResourceId:课堂资源ID
   */
  operateBtnShowOrHide = (obj) => {
    const styleCss = {
      button: {
        marginRight: 20,
      }
    }
    let { videoNum, curFinishStatus, vodPubType, vodPubStatus, livePubStatus, curResourceId } = obj;
    let btns;
    if (curFinishStatus == 1) {
      switch (vodPubStatus) {
        case -2:
          btns = <div>
            <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
          </div>
          return btns;
        case -1:
          if (videoNum > 0) {
            btns = <div>
              <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' })}>发布到公有</Button>
                  :
                  null
              }

              <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' })}>发布到私有</Button>
            </div>
          }
          else {
            btns = <div>
              <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
            </div>
          }
          return btns
        case 0:
          if (videoNum > 0) {
            btns = <div>
              <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' })}>发布到公有</Button>
                  :
                  null
              }

              <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' })}>发布到私有</Button>
            </div>
          }
          else {
            btns = <div>
              <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
            </div>
          }
          return btns
        case 1:
          btns = <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' })}>取消发布</Button>
          return btns;
        case 2:
          btns = <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' })}>取消发布</Button>
          return btns;
        default:
          return btns;
      }
    } else if (curFinishStatus == 0) {
      // console.log(livePubStatus)
      switch (livePubStatus) {
        case -1:
          btns = <div>
            <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>

          </div>
          return btns
        case 0:
          btns = <div>
            <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>

          </div>
          return btns;
        case 1:
          if (G.configInfo.liveCurType == 1) {
            btns = <div>
              {
                G.configInfo.liveCurType == 1
                  ?
                  <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>终止直播</Button>
                  :
                  null
              }

            </div>
          }

          return btns;
        case 2:
          if (G.configInfo.liveCurType == 1) {
            btns = <div>
              {
                G.configInfo.liveCurType == 1
                  ?
                  <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>终止直播</Button>
                  :
                  null
              }
            </div>
          }

          return btns;
        default:
          return btns;
      }
    } else if (curFinishStatus == -1) {
      switch (livePubStatus) {
        case -1:
          btns = <div>
            <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
            {
              G.configInfo.liveCurType == 1
                ?
                <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>发布直播</Button>
                :
                null
            }
          </div>
          return btns
        case 0:
          btns = <div>
            <Button style={styleCss.button} className="lxx-s-blue" onClick={this.openModal}>关联我的上传</Button>
            {
              G.configInfo.liveCurType == 1
                ?
                <Button className="lxx-s-blue" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>发布直播</Button>
                :
                null
            }
          </div>
          return btns
        case 1:
          btns = <div>
            {
              G.configInfo.liveCurType == 1
                ?
                <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>取消直播</Button>
                :
                null
            }
          </div>
          return btns;
        case 2:
          btns = <div>
            {
              G.configInfo.liveCurType == 1
                ?
                <Button className="lxx-s-orange" style={styleCss.button} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>取消直播</Button>
                :
                null
            }

          </div>
          return btns;
        default:
          return btns;
      }
    }
  }

  /**
   * 是否可以修改
   * {data.vodPubStatus}{data.livePubStatus}{data.curFinishStatus}
   */
  judgeEditOrNot = (obj) => {
    const styleCss = {
      edit: {
        fontSize: 14,
        color: '#3b98f0',
        display: 'inline-block',
        verticalAlign: 'super',
        cursor: 'pointer',
        marginLeft: 5,
        flex: 1,
        paddingTop: 10
      }
    }
    let { vodPubStatus, livePubStatus, curFinishStatus } = obj;
    let items;
    switch (curFinishStatus) {
      case 1:
        if (vodPubStatus < 1) {
          items = <div style={styleCss.edit} onClick={this.handleEdit}>修改</div>
        }
        return items
      case 0:
        if (livePubStatus < 1) {
          items = <div style={styleCss.edit} onClick={this.handleEdit}>修改</div>
        }
        return items
      case -1:
        if (livePubStatus < 1) {
          items = <div style={styleCss.edit} onClick={this.handleEdit}>修改</div>
        }
        return items
    }
  }

  componentWillUnmount() {
    this.props.removeComponent_ac()
  }

  /**
   * 返回
   */
  jumpBack = () => {
    const obj = this.props.Tm_timeTableReducer.condition;
    this.props.tm_recordWhenJump_ac(obj)
    this.props.history.push('/b_teacherClassMan')
  }
  render() {
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto'
      },
      titleBox: {
        height: 40,
        display: 'flex',
      },
      title: {
        fontSize: 20,
        maxWidth: 550,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      },
      button: {
        marginLeft: 20,
      },
      flexDiv: {
        display: 'flex',
        marginBottom: 15,
        color: '#666666',
        fontSize: 14,
        position: 'relative',
      },
      flex1: {
        flex: 1
      },
      marginRight: {
        marginRight: 30
      },
      marginRight15: {
        marginRight: 15,
        color: '#48a3f4'
      },
      sup: {
        background: '#ff7559',
        color: '#fff',
        width: 15,
        height: 15,
        textAlign: 'center',
        lineHeight: '15px',
        fontSize: 12,
        position: 'absolute',
        top: -15,
        right: 0,
        zIndex: 2
      },
      arrow: {
        background: '#ff7559',
        width: 7,
        height: 11,
        position: 'absolute',
        top: -8,
        right: 4,
        transform: 'rotate(70deg)',
        zIndex: 1,
      }
    }
    let data = this.props.B_TacherClassManDetailReducer.detailData;
    if (!data) return false;
    let operateRecord = this.props.B_TacherClassManDetailReducer.operateRecord || [];

    let btns = this.operateBtnShowOrHide(
      {
        vodPubStatus: data.vodPubStatus,
        vodPubType: data.vodPubType,
        livePubStatus: data.livePubStatus,
        curFinishStatus: data.curFinishStatus,
        videoNum: data.videoNum,
        curResourceId: data.curResourceId
      }
    );//按钮的显示隐藏
    let items = this.judgeEditOrNot(
      {
        vodPubStatus: data.vodPubType,
        livePubStatus: data.livePubStatus,
        curFinishStatus: data.curFinishStatus,
      }
    )//判断是否可以修改课堂名

    let CurNameEditOrNot = this.state.editable
      ?
      <div style={styleCss.flex1}>
        <Input style={{ width: 550 }} maxLength={100} defaultValue={data.curName} onChange={this.handleInput} />
        <Button style={styleCss.button} onClick={(id) => this.handleSave(data.curResourceId)}>保存</Button>
        <Button style={styleCss.button} onClick={this.handleCancel}>取消</Button>
      </div>
      :
      <div style={{ ...styleCss.flexDiv, flex: 1 }}>
        <Tooltip placement="left" title={data.curName}>
          <div style={styleCss.title} onClick={(id) => this.jumpToVideo(data.curResourceId)}>{data.curName}</div>
        </Tooltip>
        {items}
      </div>

    return (
      <div style={styleCss.container}>
        <div style={styleCss.titleBox} >
          {CurNameEditOrNot}
          {btns}
          <Button style={styleCss.button} className="lxx-s-wathet" onClick={this.jumpBack}>返回</Button>
        </div>
        <div style={styleCss.flexDiv}>
          <div style={styleCss.marginRight}>科目：{data.subName}</div>
          <div style={styleCss.marginRight}>授课时间：{Number(data.actureDate).formatTime()}（周{Number(data.weekday).toChinese()}）第{Number(data.lessonOrder).toChinese()}节</div>
          <div style={styleCss.marginRight}>授课老师：{data.teacherName}</div>
        </div>
        <div style={styleCss.flexDiv} >
          {
            data.videoNum
              ?
              <div style={styleCss.marginRight}>录播：{data.videoNum}</div>
              :
              null
          }
          {
            data.daoxueNum
              ?
              <div style={styleCss.marginRight}>导学：{data.daoxueNum}</div>
              :
              null
          }
          {
            data.jiaoanNum
              ?
              <div style={styleCss.marginRight}>教案：{data.jiaoanNum}</div>
              :
              null
          }
          {
            data.jiaocaiNum
              ?
              <div style={styleCss.marginRight}>教材：{data.jiaocaiNum}</div>
              :
              null
          }
          {
            data.kejianNum
              ?
              <div style={styleCss.marginRight}>课件：{data.kejianNum}</div>
              :
              null
          }
          {
            data.xitiNum
              ?
              <div style={styleCss.marginRight}>习题：{data.xitiNum}</div>
              :
              null
          }
          {
            data.sucaiNum
              ?
              <div style={styleCss.marginRight}>素材：{data.sucaiNum}</div>
              :
              null
          }

          <div style={{ ...styleCss.marginRight, flex: 1 }}>{data.qitaNum ? `其他：${data.qitaNum}` : null}</div>

          <div style={styleCss.marginRight15} id="hfPopContainer">
            {
              operateRecord.length > 0
                ?
                <Popover
                  placement="bottomLeft"
                  title={null}
                  trigger="click"
                  getPopupContainer={() => document.getElementById('hfPopContainer')}
                  content={<TmDetailOperateDoc />}
                >
                  <div style={{ width: 60, cursor: 'pointer' }}>操作记录</div>
                  <div style={styleCss.sup}>{operateRecord.length}</div>
                  <div style={styleCss.arrow}></div>
                </Popover>
                :
                null
            }
          </div>
        </div>

        {
          this.state.ifMessage
            ?
            <HfModal
              title="消息提示"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={600}
              closeModal={this.closeModal}
              contents={<CancelOrPubCurModal closeModal={this.closeModal} ID={data.curResourceId} ModalType={this.state.ModalType} />}
            />
            :
            <HfModal
              title="关联我的上传"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={1000}
              headerBtn={true}
              closeModal={this.closeModal}
              contents={<TmDetailRelMyupload />}
            />
        }


      </div>
    )
  }
}