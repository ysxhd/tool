/*
 * @Author: JC.Liu 
 * @Date: 2018-07-30 13:44:08 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:28:27
 * 直播预告页面
 */
import React, { Component } from "react";
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import { HeaderNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import { SVG } from './../common';
import './../../css/liveTrail.css';
import ClassrommRes from './../components/q_relateClassromRes';
import { _x } from './../../js/index';
import noImg from './../../icon/null_b.png';

const Request = _x.util.request.request;
const toChinese = _x.util.number.toChinese;
const formatDate = _x.util.date.format;

// 倒计时组件
class NoPlay extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: '',
      day: 0,
      hour: 0,
      minute: 0,
      second: 0,
      curData: this.props.curData,
      unfoldCnt: false,
      showCnt: false,
      cntHei: 0,
    }
  }

  componentDidMount() {
  }

  /**
   * 计算直播倒计时
   * @param {* 时间戳} time 
   */
  countTime(time) {
    this.interval = setInterval(() => {
      let endTime = new Date(time),
        nowTime = new Date(),
        t = endTime.getTime() - nowTime.getTime();
      if (t >= 0) {
        this.setState({
          day: Math.floor(t / 1000 / 60 / 60 / 24),
          hour: Math.floor(t / 1000 / 60 / 60 % 24),
          minute: Math.floor(t / 1000 / 60 % 60),
          second: Math.floor(t / 1000 % 60)
        })
      } else if (t < 0) {
        clearInterval(this.interval);
        this.props.history.push(`/q_liveVideo/${this.props.params.target}/${this.props.params.id}`);
        return;
      }
    }, 1000);
  }

  /**
   * 获取模块菜单高度
   */
  getBoxHei() {
    let hei = 0;
    let cnt = this.cntbox;
    hei = cnt.clientHeight;
    if (hei > 25) {
      cnt.style.paddingRight = '80px';
      cnt.style.height = '25px';
      this.setState({
        unfoldCnt: true,
        cntHei: hei,
      });
    };
  }

  /**
   * 展开收缩菜单
   * @param {* 操作指向状态} staus 
   */
  handleShowHide(staus) {
    let state = this.state;
    state.showCnt = staus;
    let cnt = this.cntbox;
    if (state.showCnt) {
      cnt.style.height = state.cntHei + 'px';
    } else {
      cnt.style.height = '25px';
    }
    this.setState(state);
  }

  componentDidUpdate() {
    if (this.props.time && this.props.time !== this.state.time && this.props.time !== 'un') {

      let time = this.props.time;
      this.countTime(time);
      this.setState({
        time: this.props.time
      })
    } else if (this.props.time !== this.state.time && this.props.time === 'un') {
      // console.log(this.state.time);
      this.setState({
        time: 'un'
      })
    }
    // 更新课堂信息
    if (this.props.curData !== this.state.curData) {
      let data = this.props.curData;
      this.setState({
        curData: data,
      }, () => {
        this.getBoxHei();
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let state = this.state,
      data = state.curData;
    // console.log(data);

    return (
      <div>
        <div className="lxx-pl-g-cnt">
          <div className="lxx-m-inf">
            <SVG type="waitCheck" />
            {
              state.time
                ?
                state.time === 'un'
                  ? <div>
                    <p>暂无课堂录播资源</p>
                  </div>
                  : <div>
                    <p>课程即将开始，敬请期待...</p>
                    <div className="lxx-m-timeDown">
                      <span>{this.state.day}</span>天
                      <span>{this.state.hour}</span>时
                      <span>{this.state.minute}</span>分
                      <span>{this.state.second}</span>秒
                    </div>
                  </div>
                :
                ''
            }
          </div>
        </div>
        {
          data ?
            <div className="lxx-g-playCnt">
              <p className="lxx-pc-g-name">{data.curName}</p>
              <div className="lxx-g-flex-center lxx-pc-g-msg">
                <span>授课时间：{formatDate(new Date(data.actureStartTime), 'yyyy-MM-dd')}（周{toChinese(data.weekday, false)}）第{toChinese(data.lessonOrder, false)}节</span>
                <span>授课班级：{data.classroomName || '-'}</span>
                <span>授课老师：{data.teacherName || '-'}</span>
                <span>科目：{data.subName || '-'}</span>
                {
                  state.time === 'un'
                    ? ''
                    : <span>发布时间：{formatDate(new Date(data.livePublishTime), 'yyyy-MM-dd')}</span>
                }
              </div>
              <div style={{ position: 'relative' }}>
                <div ref={(ref) => this.cntbox = ref} style={{ overflow: 'hidden' }}>
                  {data.curDesc || '暂无简介'}
                </div>
                {
                  !state.unfoldCnt
                    ?
                    ''
                    :
                    <div className="lxx-m-isUnfold" onClick={this.handleShowHide.bind(this, !state.showCnt)}>
                      <span>{!state.showCnt ? '展开' : '收缩'}</span>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={!state.showCnt ? '#icon-pullDown' : '#icon-pullUp'}></use>
                      </svg>
                    </div>
                }
              </div>
            </div>
            :
            <div className="lxx-g-playCnt">
              <p className="lxx-pc-g-name">-</p>
              <div className="lxx-g-flex-center lxx-pc-g-msg">
                <span>授课时间：-</span>
                <span>授课班级：-</span>
                <span>授课老师：-</span>
                <span>科目：-</span>
                <span>发布时间：-</span>
              </div>
              <div style={{ position: 'relative' }}>
                <div ref={(ref) => this.cntbox = ref} style={{ overflow: 'hidden' }}>
                  暂无简介
                </div>
              </div>
            </div>
        }
      </div>
    )
  }
}
const NoPlayer = withRouter(NoPlay);

class Q_LiveTrail extends Component {
  constructor() {
    super();
    this.state = {
      selected: 0,
      resList: [],
      curData: '',
      resNum: 0,
      curId: '',
      time: '',
    }
  }
  componentDidMount() {
    let params = this.props.match.params,
      id = params.id,
      time = params.time;
    let param = { "curResourceId": id };
    this.setState({
      curId: id,
      time: time,
    })
    this.getLiveTrailData(param, time);
  }

  /**
   * 获取直播预告数据
   */
  getLiveTrailData(param, sign) {
    if (sign === 'un') {
      Request('default/resource/getResRelationInfo', param, (res) => {
        if (res.result && res.data) {
          let data = res.data,
            resList = data.resourceList || [],
            curData = {
              "curResourceId": data.curResourceId,
              "curName": data.curName,
              "actureStartTime": data.actureStartTime,
              "weekday": data.weekday,
              "lessonOrder": data.lessonOrder,
              "classroomName": data.classroomName,
              "teacherName": data.teacherName,
              "subName": data.subName,
              "livePublishTime": data.livePublishTime,
              "curDesc": data.curDesc,
            };
          // console.log(curData);
          this.setState({
            resList: resList,
            curData: curData,
            resNum: resList.length,
            time: data.actureStartTime
          });
        }
      }, () => {
        message.warning('请求失败');
      })
    } else {
      Request('default/resource/getLiveCurResourceInfo', param, (res) => {
        if (res.result && res.data) {
          let data = res.data,
            resList = data.resourceList || [],
            curData = {
              "deviceId": data.deviceId,
              "curResourceId": data.curResourceId,
              "curName": data.curName,
              "actureStartTime": data.actureStartTime,
              "weekday": data.weekday,
              "lessonOrder": data.lessonOrder,
              "classroomName": data.classroomName,
              "teacherName": data.teacherName,
              "subName": data.subName,
              "livePublishTime": data.livePublishTime,
              "curDesc": data.curDesc,
            };
          // console.log(curData);
          this.setState({
            resList: resList,
            curData: curData,
            resNum: resList.length - 1 || 0,
            time: data.actureStartTime
          });
        }
      }, () => {
        message.warning('请求失败');
      })
    }

  }

  render() {
    let state = this.state,
      time = this.props.match.params.time;
    let para = time && time === 'un' ? time : Number(time);

    return (
      <div className="lxx-g-blackBg">
        <HeaderNav />
        <div className="lxx-g-player">
          <NoPlayer
            curData={state.curData}
            params={this.props.match.params}
            time={para === 'un' ? para : state.time} />
        </div>
        <div className="lxx-g-mainCnt">
          <div className="lxx-m-tab">
            <span className="lxx-u-tab tab-selectd">相关课堂资源（{state.resNum}）</span>
          </div>
          <div style={{ paddingBottom: 30 }}>
            {
              state.resList.length === 1 || !state.resList.length
                ?
                <div className="lxx-g-noData">
                  <img src={noImg} alt="" />
                  <p>暂无课堂关联数据</p>
                </div>
                :
                <ClassrommRes resList={state.resList} />
            }
          </div>
        </div>
        <Q_FooterBar />
      </div>
    )
  }
}

export default Q_LiveTrail; 