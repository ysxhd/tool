/*
 * @Author: JC.Liu 
 * @Date: 2018-07-31 16:28:05 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:00
 * 直播视频播放器
 */
import React, { Component } from 'react';
import { Modal, message } from 'antd';
import VideoDesc from './JC_video_desc';
import { _x } from './../../js/index';
import { HfModal } from '../common';
const ajax = _x.util.request.request;

class VideoPlayer extends Component {
  constructor() {
    super();
    this.state = {
      videoDataLoad: true,
      error: false,
      liveVideoURL: [],
      curData: '',
      uuid: "",
      refresh: false,
      timer: false,
      errorMessage: "加载中...",
      visible: false
    }
    this.index = 0;
    this.renderIndex = 0;
    this.curData = "";
  }

  componentDidUpdate() {
    if (this.props.curData && this.props.curData.live && this.props.curData !== this.state.curData) {
      this.getLiveVideoUrl()
      this.setState({
        curData: this.props.curData,
        refresh: true,
        reRender: true,
        errorMessage: this.props.curData.message
      })
    }
  }

  getLiveVideoUrl() {
    ajax("default/resource/getVideoUrl", {
      curResourceId: this.props.curData.curResourceId,
      videoId: "",
      deviceId: this.props.curData.deviceId,
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
        this.renderLiveVideo(liveVideoURL)
      } else {
        message.warning(res.message, 3)
        this.setState({
          videoDataLoad: false,
          error: true,
          errorMessage: res.message
        })
      }
    }, () => {
      message.error("请求失败", 3)
      this.setState({
        videoDataLoad: false
      });
    })
  }


  renderLiveVideo = (urlArr) => {
    var videoObject = {
      autoLoad: false,
      autoplay: true,
      container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
      variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
      loaded: 'loadedHandler', //当播放器加载后执行的函数
      flashplayer: true,//如果强制使用flashplayer则设置成true
      loop: false,
      live: true,
      playCorrect: true,
      debug: false,//是否开启调试模式
      volume: 0.5,
      video: urlArr
    };

    (function (win, that) {
      let num = 1
      win.player = new win.ckplayer(videoObject);
      win.loadedHandler = function () {
        win.player.addListener('definitionChange', win.definitionChangeHandler); //监听清晰度切换事件
        win.player.addListener('buffer', win.bufferHandler); //监听缓冲状态
        win.player.addListener('duration', win.durationHandler); //监听播放时间
        win.player.addListener('play', win.playHandler);  // 监听视频的播放
        win.player.addListener('error', win.errorHandler); //监听视频加载出错
        win.player.addListener('time', win.timeHandler); //监听视频加载出错
        // 监听视频已加载的字节
        win.player.addListener('bytes', win.bytesHandler);
        // 监听视频播放结束
        win.player.addListener('ended', win.endedHandler);
      }

      // 监听结束
      win.endedHandler = function endedHandler(e) {
        clearInterval(that.timer)
      }

      // 监听视频已加载的字节
      win.bytesHandler = function bytesHandler(e) {
        // console.log(e);
      }
      // 监听时间
      win.timeHandler = function timeHandler(e) {
        // console.log(e)
        that.time = e;
      }
      // 监听错误
      win.errorHandler = function errorHandler(e) {
        // message.error("加载失败!", 3)
        that.refresh()
      }
      win.playHandler = function playHandler(e) {
        //正在播放
        // console.log('正在播放', num)
        if (num > 5 || num === 4) {
          // console.log("请求心跳");
          that.heartbeat(that.state.uuid, e);
        }
      }
      // 当获取BUFFER之后自动执行多次播放事件，从而改善视频丢帧情况
      win.bufferHandler = function bufferHandler(e) {
        // console.log(e);
        num++;
        if (num < 5) {
          win.player.videoPlay()
        }
      }
      // 在切换清晰度后将播放器暂停再播放，以解决卡顿
      win.definitionChangeHandler = function definitionChangeHandler(e) {
        // console.log(e, '切换高标情')
        // 先暂停  在播放
        win.player.videoPause()
        win.player.videoPlay()
        // 切换高标清同时切换下载类型
        if (e === 0) {
          // console.log('切换高清')
          // that.props.changeDownloadType('hd')
        }

        if (e === 1) {
          // console.log('切换标清')
          // that.props.changeDownloadType('ld')
        }
      }
      win.durationHandler = function definitionChangeHandler(e) {
        // console.log('时间监听', e)
      }

    })(window, this)
  }

  // 心跳接口  第一个uuid 为空  第一次uuid为空  后面定时30S 都要带uuid
  heartbeat = (uuid) => {
    ajax("live/liveAdvice/hearbeat", {
      curResourceId: this.props.curData.curResourceId,
      uuid: uuid
    }, res => {
      // console.log("直播心跳:", res);
      if (res.result) {
        if (res.data.status === 1) {
          this.setState({
            uuid: res.data.message
          })
          this.timer = setTimeout(() => {
            this.heartbeat(res.data.message)
          }, 5000);
        } else if (res.data.status === 2) {
          message.error(res.data.message, 2)
          this.setState({
            errorMessage: res.data.message,
            error: true
          })
          clearInterval(this.timer)
        }
      } else {
        clearInterval(this.timer)
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  // 刷新播放组件
  refresh = () => {
    this.index++
    if (this.index > 3) {
      // 调用错误提示窗口
      this.setState({ visible: true })
    } else {
      this.setState({
        error: true
      }, this.setTime())
    }
  }

  setTime = () => {
    setTimeout(() => {
      this.setState({
        error: false
      })
    }, 0);
  }

  render() {
    return (
      <div className="JC-videoPlayer">
        {
          this.props.curData && this.props.curData.live ?
            this.state.curData && !this.state.error ?
              <div id="video" style={{ height: 725, width: 1300 }} ></div>
              :
              <div className="JC-play-error" >
                <p>{this.state.errorMessage}</p>
              </div>
            :
            <div className="JC-play-error" >
              <p>{this.props.curData.message}</p>
            </div>
        }
        <VideoDesc liveVideo={this.props.liveVideo} curData={this.props.curData} />
        <HfModal
          title="提示"
          contents={this.state.error}
          width={400}
          ModalShowOrHide={this.state.visible}
          closeModal={() => this.setState({ visible: false })}
        />
      </div>
    )
  }
}

export default VideoPlayer;
