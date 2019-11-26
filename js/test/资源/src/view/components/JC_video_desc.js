/*
 * @Author: JC.Liu 
 * @Date: 2018-07-31 16:30:42 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:26:26
 * 视频播放时 下边的描述 及下载按钮
 */
import React, { Component } from 'react';
import '../../css/JC_video_desc.css';
import { SVG, DownloadFile } from '../common';
import { connect } from 'react-redux';
import { Rate } from 'antd';
import { LiveVideo_desc_ac, } from '../../redux/JC_video.reducer';
import { handleModalShow } from './../../redux/lxx.download.reducer';
import { format } from '../../js/_x/util/date';
import { _x } from './../../js/index';

const formatPoint = _x.util.number.formatPoint;

@connect(state => state, { handleModalShow })
class VideoDesc extends Component {
  state = {
    pulldown: true,
    pulldownShow: false
  }

  componentDidMount() {
    if (this.descContentBox) {
      this.wrapHeight = this.descContentBox.clientHeight;
      if (this.wrapHeight < 31) {
        this.setState({
          pulldownShow: false
        })
      } else {
        this.setState({
          pulldownShow: true
        })
      }
      this.descContentBox.style.height = 25 + "px";
      this.setState({
        pulldown: false
      })
    }
  }

  // 直播描述组件 的下载按钮
  liveVideoDownLoad = (resId, resName, resSize, resFormat) => {
    // console.log("videoRelotion:", this.props.videoRelotion);
    let params = {
      resourceId: resId,
      resName: resName,
      resSize: resSize ? resSize : 0,
      resFormat: resFormat,
      definition: this.props.videoRelotion,
    };
    // 显示下载弹窗
    this.props.handleModalShow(true, params);
  }

  pulldown_up = (pulldown) => {
    if (pulldown) {
      this.descContentBox.style.height = 25 + "px"
    } else {
      this.descContentBox.style.height = this.wrapHeight + "px"
    }
    this.setState({
      pulldown: !pulldown
    })
  }

  curDesc = (curData) => {
    if (!curData.curDesc) {
      return "暂无介绍"
    } else {
      return curData.curDesc
    }
  }

  weekDay = (day) => {
    if (day === 1) {
      return "一"
    } else if (day === 2) {
      return "二"
    } else if (day === 3) {
      return "三"
    } else if (day === 4) {
      return "四"
    } else if (day === 5) {
      return "五"
    } else if (day === 6) {
      return "六"
    } else if (day === 7) {
      return "七"
    } else if (day === 8) {
      return "八"
    } else if (day === 9) {
      return "九"
    } else if (day === 10) {
      return "十"
    } else if (day === 11) {
      return "十一"
    } else if (day === 12) {
      return "十二"
    }
    else if (day === 13) {
      return "十三"
    }
    else if (day === 14) {
      return "十四"
    }
    else if (day === 15) {
      return "十五"
    }
    else if (day === 16) {
      return "十六"
    }
    else if (day === 17) {
      return "十七"
    }
    else {
      return day
    }
  }

  render() {
    const props = this.props.videoDesc;
    const curData = this.props.curData;
    const videoType = this.props.videoType;
    // console.log("直播：", curData);

    return (
      <div >
        {
          !this.props.liveVideo ?
            null
            :
            this.props.liveVideo === 1 ?
              // 直播
              <div className="JC-videoDesc">
                <div className="JC-vd-tit JC-vd-col" >
                  {/* <span>{curData.actureDate ? format(new Date(curData.actureDate), "yyyy-MM-dd") : "-"}</span> */}
                  {/* <span>-</span> */}
                  {/* <span>{curData.lessonOrder ? `第${curData.lessonOrder}节` : "-"}</span> */}
                  {/* <span>-</span> */}
                  <span>{curData.curName ? curData.curName : "-"}</span>
                  {/* <span>{curData.teacherName ? curData.teacherName : "-"}</span>
                  <span>-</span>
                  <span>{curData.subjectName ? curData.subjectName : "-"}</span> */}
                </div>
                <div className="JC-vd-col JC-vd-color">
                  <span>授课时间：{curData.actureDate ? format(new Date(curData.actureDate), "yyyy-MM-dd") : "-"}</span>
                  <span>(周{curData.weekday ? `${this.weekDay(curData.weekday)}` : "-"})</span>
                  <span>第{curData.lessonOrder ? this.weekDay(curData.lessonOrder) : "-"}节</span>
                  <span>授课班级：{curData.classroomName ? curData.classroomName : "-"}</span>
                  <span>授课教师：{curData.teacherName ? curData.teacherName : "-"}</span>
                  <span>科目：{curData.subName ? curData.subName : "-"}</span>
                  <span>发布时间：{curData.livePublishTime ? format(new Date(curData.livePublishTime), "yyyy-MM-dd") : "-"}</span>
                </div>
                <div
                  className={this.state.pulldown ?
                    "JC-vd-col JC-vd-color JC-vd-descPulldown JC-vd-pulldowDesc "
                    :
                    "JC-vd-col JC-vd-color JC-vd-desc JC-vd-pulldowDesc"
                  }
                  ref={node => this.descContentBox = node}
                >
                  {this.curDesc(curData)}
                  <span
                    onClick={() => this.pulldown_up(this.state.pulldown)}
                    // className={this.state.pulldown ? "JC-vd-pulldown" : " JC-vd-pullUp"} 
                    className="JC-vd-pulldown"
                  >
                    {
                      this.state.pulldownShow ?
                        this.state.pulldown ?
                          <span>
                            收缩&nbsp;&nbsp;<SVG type="pullUp" />
                          </span>
                          :
                          <span>
                            展开&nbsp;&nbsp;<SVG type="pullDown" />
                          </span>
                        : ''
                    }
                  </span>
                </div>
              </div>
              :
              this.props.liveVideo === 2 ?
                // 录播
                <div className="JC-videoDesc">
                  <div className="JC-vd-tit JC-vd-col" >
                    <span>{curData.actureDate ? format(new Date(curData.actureDate), "yyyy-MM-dd") : "-"}</span>
                    {/* <span>-</span> */}
                    <span>第{curData.lessonOrder ? curData.lessonOrder : "-"}节</span>
                    {/* <span>-</span> */}
                    <span>{curData.curName ? curData.curName : "-"}</span>
                    {/* <span>-</span>
                    <span>{curData.subjectName ? curData.subjectName : "-"}</span> */}
                    {/* 评分 */}
                    {
                      !curData.videoNum
                        ? ''
                        : <span className="JC-vd-download" onClick={() => this.liveVideoDownLoad(curData.resourceId, curData.curName, 0, curData.resFormat)} >
                          <SVG type="download" width="20px" height="20px" />
                        </span>
                    }
                    <span className="JC-vd-rate" >
                      <Rate
                        allowClear={false}
                        allowHalf={true}
                        count={5}
                        disabled
                        value={
                          curData ?
                            this.props.VideoReducer.priStype === 2 ?
                              formatPoint(curData.pubScoreAvg) ?
                                formatPoint(curData.pubScoreAvg)
                                : 0
                              : formatPoint(curData.privScoreAvg)
                            : 0
                        }
                      />
                      <span className="JC-vd-rate-count" >
                        {
                          curData ?
                            this.props.VideoReducer.priStype === 2 ?
                              curData.pubScoreAvg ? curData.pubScoreAvg : 0
                              : curData.privScoreAvg
                            : 0
                        }
                        分
                      </span>
                    </span>

                  </div>
                  <div className="JC-vd-col JC-vd-color">
                    <span>授课时间：{curData.actureDate ? format(new Date(curData.actureDate), "yyyy-MM-dd") : "-"}</span>
                    <span>星期{curData.weekday ? this.weekDay(curData.weekday) : "-"}</span>
                    <span>第{curData.lessonOrder ? curData.lessonOrder : "-"}节</span>
                    <span>授课班级：{curData.classroomName ? curData.classroomName : "-"}</span>
                    <span>授课教师：{curData.teacherName ? curData.teacherName : "-"}</span>
                    <span>科目：{curData.subName ? curData.subName : "-"}</span>
                    <span>发布时间：{curData.vodPublishTime ? format(new Date(curData.vodPublishTime), "yyyy-MM-dd") : "-"}</span>
                    {/* <span>浏览量：{this.props.isPub ? curData.pubWatchNum : curData.privWatchNum}</span> */}
                    <span>浏览量：{curData.classType === "0" ? curData.pubWatchNum : curData.privWatchNum}</span>
                  </div>
                  <div
                    className={this.state.pulldown ?
                      "JC-vd-col JC-vd-color JC-vd-descPulldown JC-vd-pulldowDesc "
                      :
                      "JC-vd-col JC-vd-color JC-vd-desc JC-vd-pulldowDesc"
                    }
                    ref={node => this.descContentBox = node}
                  >
                    {this.curDesc(curData)}
                    <span
                      onClick={() => this.pulldown_up(this.state.pulldown)}
                      // className={this.state.pulldown ? "JC-vd-pulldown" : " JC-vd-pullUp"} 
                      className="JC-vd-pulldown"
                    >
                      {
                        this.state.pulldownShow ?
                          this.state.pulldown ?
                            <span>
                              收缩&nbsp;&nbsp;<SVG type="pullUp" />
                            </span>
                            :
                            <span>
                              展开&nbsp;&nbsp;<SVG type="pullDown" />
                            </span>
                          : null
                      }
                    </span>
                  </div>
                </div>
                :
                this.props.liveVideo === 3 ?
                  // 普通资源播放
                  <div className="JC-vd-tit JC-vd-mp4">
                    {curData.resName ? curData.resName : "-"}
                    <span className="JC-vd-download" onClick={() => this.liveVideoDownLoad(curData.resourceId, curData.resName, curData.resSize, curData.resFormat)} >
                      <SVG type="download" width="20px" height="20px" />
                    </span>
                  </div>
                  :
                  null
        }
        <DownloadFile
          isShow={this.props.downloadReducer.isShow}
          closeModal={() => { this.props.handleModalShow(false); }}
          params={this.props.downloadReducer.params} />
      </div>
    )
  }
}

export default VideoDesc;
