/*
 * @Author: JC.Liu 
 * @Date: 2018-08-21 16:47:44 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:25:57
 * 录播资源播放器
 */

import '../../css/JC_video.css';
import React, { Component } from 'react';
import { Modal, message } from 'antd';
import VideoDesc from './JC_video_desc';
import { _x } from './../../js/index';
import Player_Record from './playeRecord';
import { HfModal } from '../common';
const ajax = _x.util.request.request;

class RecordPlayer extends Component {
  constructor() {
    super();
    this.state = {
      refresh: false,
      videoRelotion: "ld",
      urls: "",
      visible: false,
      contents: "播放失败，请下载后进行观看~",
      errorMessage: "加载中..."
    }
    this.index = 0;
  }

  componentDidUpdate() {
    if (this.props.curData && this.props.curData !== this.state.curData) {
      this.getRecordVideoUrl()
      this.setState({
        curData: this.props.curData,
      })
    }
  }

  getRecordVideoUrl() {
    ajax("default/resource/getVideoUrl", {
      curResourceId: this.props.curData.curResourceId,
      videoId: this.props.curData.fileId,
      deviceId: "",
    }, res => {
      if (res.data && res.result && res.data.length) {
        let liveVideoURL = [];
        res.data.map((item, index) => {
          liveVideoURL.push([
            item.videoUrl,
            '',
            item.type === "ld" ? "标清" : "高清",
            item.type === "ld" ? 10 : 0,
          ])
        })
        // liveVideoURL = [
        //   ["rtmp://10.20.5.145:1936/vod|/file/local://D:/fms_T…827/multi/11/bd7cf4dccea2418fa077f50aaedbdf54.mp4", "", "标清", 10],
        //   ["rtmp://10.20.5.145:1936/vod|/file/local://D:/fms_T…827/multi/11/bd7cf4dccea2418fa077f50aaedbdf54.mp4", "", "高清", 0]
        // ]
        // console.log("liveVideoURL:", liveVideoURL);

        this.setState({
          urls: liveVideoURL
        })
        // this.renderRecordVideo(liveVideoURL);
      } else {
        message.error(res.message, 3)
        this.setState({
          error: false,
          errorMessage: res.message
        })
        // this.renderRecordVideo('');
        this.setState({
          urls: ""
        })
      }
    }, () => {
      message.error("请求失败", 3);
      this.setState({
        urls: "",
      })
      // this.renderRecordVideo('');
    })
  }

  refresh = () => {
    // console.log("刷新", );
    this.index++
    if (this.index > 3) {
      // 调用错误提示窗口
      this.setState({
        visible: true,
        contents: "播放失败，请下载后进行观看~"
      })
    } else {
      this.setState({
        refresh: true
      }, this.setTimeout())
    }
  }

  setTimeout = () => {
    setTimeout(() => {
      this.setState({
        refresh: false
      })
    }, 0);
  }

  // 播放器切换清晰度  下载按钮也下载对应的视频
  videoRelotion = (level) => {
    // console.log("dsadasdas:", level);
    this.setState({
      videoRelotion: level
    })
  }

  render() {
    return (
      <div className="lxx-g-player" >
        <div className="JC-videoPlayer">
          {
            this.props.curData.live ?
              !this.state.refresh && this.state.urls ?
                <Player_Record urls={this.state.urls} refresh={this.refresh} videoRelotion={this.videoRelotion} />
                :
                <div className="JC-play-error">
                  <p>{this.state.errorMessage}</p>
                </div>
              :
              <div className="JC-play-error">
                <p>{this.props.message}</p>
              </div>
          }
          <VideoDesc
            liveVideo={this.props.liveVideo}
            curData={this.props.curData}
            videoType={this.props.videoType}
            isPub={this.props.isPub}
            videoRelotion={this.state.videoRelotion}

          />
          <div className="JC-record-modal" >
            <HfModal
              ModalShowOrHide={this.state.visible}
              title="提示"
              closeModal={() => this.setState({
                visible: false
              })}
              width={400}
              contents={
                <div className="JC-rc-cont" >
                  {this.state.contents}
                </div>
              }
            />
          </div>
        </div>
      </div>
    )
  }
}


export default RecordPlayer;