/*
 * @Author: JC.Liu 
 * @Date: 2018-08-03 19:44:06 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:26:18
 * 普通资源播放器
 */
import '../../css/JC_video.css';
import React, { Component } from 'react';
import { Modal, message } from 'antd';
import VideoDesc from './JC_video_desc';
import { _x } from './../../js/index';
import Player_Replayer from './playerReplayer';
import { HfModal } from '../common';
const ajax = _x.util.request.request;

class ReplayVideo extends Component {
  constructor() {
    super();
    this.state = {
      curData: "",
      url: {},
      refresh: false,
      resFormat: "",
      errorMessage: "加载中... "
    }
    this.index = 1;
  }

  componentDidMount() {
    this.setState({
      url: { file: this.props.curData.url, type: `${this.props.curData.type}/${this.props.curData.resFormat}` }
    })
  }

  componentDidUpdate() {
    if (this.props.curData) {
      if (this.props.curData.resFormat && this.props.curData.resFormat !== this.state.resFormat) {
        this.setState({
          resFormat: this.props.curData.resFormat,
          curData: this.props.curData
        })
      }
    }
  }

  refresh = () => {
    // console.log("刷新");
    this.index++
    if (this.index > 3) {
      this.setState({
        visible: true
      })
    } else {
      this.setState({
        refresh: true
      }, this.setTime())
    }
  }

  setTime = () => {
    setTimeout(() => {
      this.setState({
        refresh: false
      })
    }, 0);
  }

  render() {
    // console.log("sdsadsaL:", this.state.refresh);
    return (
      <div className="lxx-g-player" >
        <div className="JC-videoPlayer">
          {
            this.props.curData.live ?
              !this.state.refresh && this.state.resFormat ?
                <Player_Replayer resFormat={this.state.resFormat} curData={this.state.curData} refresh={this.refresh} />
                :
                <div className="JC-play-error" >
                  <p>{this.state.errorMessage}</p>
                </div>
              :
              <div className="JC-play-error" >
                <p>{this.props.message}</p>
              </div>
          }
          <VideoDesc
            liveVideo={this.props.liveVideo}
            curData={this.props.curData}
            videoType={this.props.videoType}
            isPub={this.props.isPub}
          />

          <HfModal
            title="提示"
            ModalShowOrHide={this.state.visible}
            width={400}
            contents={
              <div className="JC-rc-cont">播放失败，请下载进行播放~</div>
            }
            closeModal={() => {
              this.setState({
                visible: false
              })
            }}
          />

        </div>
      </div>
    )
  }
}

export default ReplayVideo;