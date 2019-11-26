import React from 'react';
import { Tooltip, Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { HfModal } from './../common';
import CancelOrPubCurModal from './cancelorPubCurModal';
import G from './../../js/g';
import { connect } from 'react-redux';
import { SpinLoad } from './../common';
import { ifChangeWhenSelect_ac } from './../../redux/mc_SubClass.reducer'
@withRouter
@connect(
  state => state.Tm_timeTableReducer,
  { ifChangeWhenSelect_ac }
)
export default class TmClassItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalShowOrHide: false,
      ModalType: ''
    };

  }
  /**
   * 跳转到详细页面
   */
  JumpToDetail = (id) => {
    let obj = this.props.condition;
    this.props.ifChangeWhenSelect_ac(true)

    const path = this.props.match.path;
    this.props.history.push(`${path}/detail/${id}`);

    // let { videoNum, curFinishStatus, vodPubType, vodPubStatus, livePubStatus, curResourceId } = this.props.test
    // console.log(videoNum, curFinishStatus, vodPubType, vodPubStatus, livePubStatus, curResourceId);
  }

  /**
   * 判断本节课的状态：已完成(1)、进行中(0)、未开始(-1)
   * 返回该节课背景颜色
   */
  judgeClassState = (arg) => {
    switch (arg) {
      case -1:
        return '#9bb8cc';
      case 0:
        return '#44aaf2';
      case 1:
        return '#3ec280';
    }
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
    let { videoNum, curFinishStatus, vodPubType, vodPubStatus, livePubStatus, curResourceId } = obj;

    let btns;
    if (curFinishStatus == 1) {
      switch (vodPubStatus) {
        case -2:
          return btns;
        case 0:
          if (videoNum > 0) {
            btns = <div>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={{ width: '100%', marginBottom: 10 }} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' })}>发布到公有</Button>
                  :
                  null
              }

              <Button className="lxx-s-blue" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' })}>发布到私有</Button>
            </div>
          };
          return btns
        case -1:
          if (videoNum > 0) {
            btns = <div>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={{ width: '100%', marginBottom: 10 }} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' })}>发布到公有</Button>
                  :
                  null
              }

              <Button className="lxx-s-blue" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' })}>发布到私有</Button>
            </div>
          };
          return btns
        case 1:
          btns = <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' })}>取消发布</Button>
          return btns;
        case 2:
          btns = <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' })}>取消发布</Button>
          return btns;
        default:
          return btns;
      }
    }
    else if (curFinishStatus == 0 && G.configInfo.liveCurType == 1) {
      switch (livePubStatus) {
        case 1:
          btns = <div>
            <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>终止直播</Button>
          </div>
          return btns;
        case 2:
          btns = <div>
            <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>终止直播</Button>
          </div>
          return btns;
        default:
          return btns;
      }
    } else if (curFinishStatus == -1 && G.configInfo.liveCurType == 1) {
      switch (livePubStatus) {
        case -1:
          btns = <div>
            <Button className="lxx-s-blue" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>发布直播</Button>
          </div>
          return btns
        case 0:
          btns = <div>
            <Button className="lxx-s-blue" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'livePub' })}>发布直播</Button>
          </div>
          return btns
        case 1:
          btns = <div>
            <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>取消直播</Button>
          </div>
          return btns;
        case 2:
          btns = <div>
            <Button className="lxx-s-orange" style={{ width: '100%' }} onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' })}>取消直播</Button>
          </div>
          return btns;
        default:
          return btns;
      }
    } else {
      return btns
    }
  }
  /**
   * 打开弹窗
   * obj:{
   * puborcancel:pub:发布、cancel:取消
   * puborpri:pri:私有、pub:公有
   * }
  */
  openModal = (obj) => {
    this.setState({
      ModalShowOrHide: true,
      ModalType: obj
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
  render() {
    let data = this.props.data;

    const styleCss = {
      item: {
        width: 178,
        height: 280,
        padding: 5,
        lineHeight: '24px',
        float: 'left',
        borderTop: '1px solid #e6e6e6',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
        cursor: 'pointer',
      },
      texts: {
        position: 'relative',
        width: '100%',
        backgroundColor: this.judgeClassState(data.curFinishStatus),
        borderRadius: 5,
        height: 150,
        color: '#fff',
        padding: '10px'
      },
      textbig: {
        fontWeight: 'bold'
      },
      text: {
        fontSize: 12,
        paddingTop: 10,
        borderTop: '1px dashed #fff',
        marginTop: 10,
      },
      cName: {
        display: 'inline-block',
        verticalAlign: 'middle',
        height: 48,
        maxWidth: 147,
      },
      textSmall: {
        fontSize: 12,
      },
      srcs: {
        display: 'flex',
        padding: '7px 2px'
      },
      src: {
        width: '50%',
        color: '#bfbfbf',
      },
      marginLeft: {
        marginLeft: 5,
      }
    };

    let btns = this.operateBtnShowOrHide(
      {
        vodPubStatus: data.vodPubStatus,
        vodPubType: data.vodPubType,
        livePubStatus: data.livePubStatus,
        curFinishStatus: data.curFinishStatus,
        videoNum: data.videoNum,
        curResourceId: data.curResourceId
      }
    )
    let sourceNum = data.daoxueNum + data.jiaoanNum + data.jiaocaiNum + data.sucaiNum + data.xitiNum + data.kejianNum + data.qitaNum;
    return (
      <div style={styleCss.item}>
        <div style={styleCss.texts} onClick={(id) => this.JumpToDetail(data.curResourceId)}>
          <div style={styleCss.textbig}>{data.subName}</div>
          <Tooltip placement="right" title={data.curName}>
            <div className="hf-text-clamp2" style={styleCss.cName} >{data.curName}</div>
          </Tooltip>
          <div style={styleCss.text}>{data.teacherName}（{data.claName}）</div>
          <div style={styleCss.textSmall}>{data.classroomName}</div>
        </div>
        <div style={styleCss.srcs}>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-resource"}></use>
            </svg>
            <span style={styleCss.marginLeft}>{sourceNum}</span>
          </div>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-recordeVideo"}></use>
            </svg>
            <span style={styleCss.marginLeft}>{data.videoNum}</span>
          </div>
        </div>
        {btns}
        <HfModal
          title="消息提示"
          width={600}
          ModalShowOrHide={this.state.ModalShowOrHide}
          closeModal={this.closeModal}
          contents={
            <CancelOrPubCurModal closeModal={this.closeModal} ID={data.curResourceId} ModalType={this.state.ModalType} Role="teacher" />
          }
        />
      </div>
    )
  }
}