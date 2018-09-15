/*
 * @Author: JC.Liu 
 * @Date: 2018-08-06 16:16:33 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-30 20:03:28
 * 录播（点播）页面
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import Footer from '../components/JC_footer';
import { HeaderNav, TeacherNav, AdminNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
// import ReplayVideo from './../components/JC_replayVideo';
import RecordPlayer from './../components/JC_recordPlayer';
import CommentList from './../components/q_comment';
import ClassrommRes from './../components/q_relateClassromRes';
import { getCommentTotal } from './../../redux/lxx.comment.reducer';
import { _x } from './../../js/index';
import G from './../../js/g';
import noImg from './../../icon/null_b.png';
// import PerfectScrollbar from 'react-perfect-scrollbar';

const Request = _x.util.request.request;

@connect(
  state => state,
  { getCommentTotal }
)
export default class Q_recordVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 0,
      curId: '',
      curData: '',
      resNum: 0,
      resList: [],
    }
  }

  componentDidMount() {
    let params = this.props.match.params,
      curId = params.id;
    this.setState({
      curId: curId
    })
    // 获取评论总数
    let obj = {
      "curId": curId,
      "priType": 2,
    }
    this.props.getCommentTotal(obj);

    // 获取录播视频数据
    let param = { "curResourceId": curId };
    this.getVideoData(param);
  }

  /**
   * 获取录播视频数据
   */
  getVideoData(param) {
    Request('default/resource/getVideoCurResourceInfo', param, (res) => {
      if (res.result && res.data) {
        let data = res.data,
          resList = data.resourceList || [],
          curData = {
            "curResourceId": data.curResourceId,
            "curName": data.curName,
            "actureDate": data.actureDate,
            "weekday": data.weekday,
            "lessonOrder": data.lessonOrder,
            "classroomName": data.classroomName,
            "teacherName": data.teacherName,
            "subName": data.subName,
            "vodPublishTime": data.vodPublishTime,
            "curDesc": data.curDesc,
            "privCommentNum": data.privCommentNum,
            "privScoreAvg": data.privScoreAvg,
            "privWatchNum": data.privWatchNum,
            "pubCommentNum": data.pubCommentNum,
            "pubScoreAvg": data.pubScoreAvg,
            "pubWatchNum": data.pubWatchNum,
            "classType": data.classType,
            "fileId": data.resourceList[0].fileId,
            "resourceId": data.resourceList[0].resourceId,
            "resFormat": data.resourceList[0].resFormat,
            "videoNum": data.videoNum,
            "live": true
          };
        this.setState({
          resList,
          curData,
          resNum: resList.length - 1 || 0,
        });
      } else {
        let curData = {
          "live": false,
          "message": res.message
        }
        this.setState({
          curData,
        })
      }
    }, () => {
      message.error('请求失败', 3);
    })
  }

  render() {
    let state = this.state;
    let paramsTarget = this.props.match.params.target,
      isPub = this.props.match.params.isPub,
      commentReducer = this.props.commentReducer;
    // let userRole = G.userInfo.accTypeId, // 0是超管，1是普管，2是管理者，3是教师，4是学生
    //   classType = state.classType,  // 0 不属于这堂课，判断共有 1属于这堂课，判断私有
    //   configInfo = G.configInfo, // 配置信息
    //   configCom;
    // if(userRole === 0 || userRole === 1 || userRole === 2) {
    //   configCom = true;
    // } else if(userRole === 3) {
    //   if(!classType && !configInfo.teachPubCurCommentType) {
    //     configCom = false;
    //   } else {
    //     configCom = true;
    //   }
    // } else if(userRole === 4) {
    //   if(!classType && !configInfo.stuPubCurCommentType) {
    //     configCom = false;
    //   } else if(classType && !configInfo.stuPrivCurCommentType) {
    //     configCom = false;
    //   } else {
    //     configCom = true;
    //   }
    // }

    return (
      <div>
        {
          paramsTarget === "reception" ?
            <HeaderNav />
            : paramsTarget === "teacher" ?
              <TeacherNav />
              :
              <AdminNav />
        }
        <div className="lxx-g-player">
          <RecordPlayer liveVideo={2} curData={state.curData} videoType="record" isPub={isPub} />
        </div>
        <div className="lxx-g-mainCnt">
          <div className="lxx-m-tab">
            <span className={!state.selected ? 'lxx-u-tab tab-selectd' : 'lxx-u-tab'} onClick={() => { this.setState({ selected: 0 }) }}>相关课堂资源（{state.resNum}）</span>
            <span className={state.selected ? 'lxx-u-tab tab-selectd' : 'lxx-u-tab'} onClick={() => { this.setState({ selected: 1 }) }}>评论（{commentReducer.total}）</span>
          </div>
          <div style={{ paddingBottom: 30 }}>
            {
              !state.selected
                ?
                state.resList.length === 1 || !state.resList.length
                  ?
                  <div className="lxx-g-noData">
                    <img src={noImg} alt="" />
                    <p>暂无课堂关联数据</p>
                  </div>
                  :
                  <ClassrommRes resList={state.resList} />
                :
                <CommentList curId={state.curId} isPub={this.props.match.params.isPub} classType={state.curData.classType} />
            }
          </div>
        </div>
        <Q_FooterBar />
      </div>
    )
  }
}
