/*
 * @Author: JC.Liu 
 * @Date: 2018-08-29 15:51:29 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:18
 */
import React, { Component } from 'react';
export default class Player_Replayer extends Component {

  componentDidMount() {
    this.renderLiveVideo(this.props.curData.url, this.props.curData.type, this.props.resFormat)
  }

  renderLiveVideo = (url, type, format) => {
    // console.log(url);
    let address
    if (!url) {
      address = `${G.dataServices}/default\/resource\/getOnlineResource\/2.1.20180807/`
    } else {
      address = {
        file: url,
        type: `${type}/${format}`
      }
    }
    // console.log("播放地址：", address);
    var videoObject = {
      autoLoad: false,
      autoplay: true,
      container: '#replayVideo',//“#”代表容器的ID，“.”或“”代表容器的class
      variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
      loaded: 'loadedHandler', //当播放器加载后执行的函数
      flashplayer:
        format === "mp3" || format === "wma" || format === "amr" || format === "aac" || format === "ape" || format === "OggVorbis" ? false : true,//如果强制使用flashplayer则设置成true
      loop: false,
      live: false,
      playCorrect: true,
      debug: false,//是否开启调试模式
      volume: 0.5,
      video: address
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
      }

      // 监听视频已加载的字节
      win.bytesHandler = function bytesHandler(e) {
        // console.log(e);
      }

      // 监听时间
      win.timeHandler = function timeHandler(e) {
        that.time = e;
      }

      // 监听错误
      win.errorHandler = function errorHandler(e) {
        that.props.refresh()
      }

      win.playHandler = function playHandler() {
        //正在播放
        // console.log('正在播放')
      }

      // 当获取BUFFER之后自动执行多次播放事件，从而改善视频丢帧情况
      win.bufferHandler = function bufferHandler(e) {
        // console.log(e);
        num++;
        if (num < 10) {
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

      win.durationHandler = function definitionChangeHandler() {
        // console.log(1, '时间监听')
      }

    })(window, this)
  }

  render() {
    return (
      <div className="JC-player" >
        <div style={{ height: 725, width: 1300 }} id="replayVideo"></div>
      </div>
    )
  }
}
