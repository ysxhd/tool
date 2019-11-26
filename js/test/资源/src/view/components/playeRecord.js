/*
 * @Author: JC.Liu 
 * @Date: 2018-08-28 18:57:54 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-03 15:24:02
 * 录播播放器实例化组件
 */
import React, { Component } from 'react';
export default class Player_Record extends Component {

  state = {
    a: false
  }

  componentDidMount() {
    console.log("录播播放器：", this.props.urls);

    if (this.props.urls) {
      this.renderRecordVideo(this.props.urls)
    }
  }

  renderRecordVideo = (urlArr) => {
    console.log("加载播放器:", urlArr);
    if (!urlArr) {
      urlArr = [
        ['', '', '标清', 10],
        ['', '', '高清', 0],
      ]
    }
    var videoObject = {
      autoLoad: false,
      autoplay: true,
      container: '#video',//“#”代表容器的ID，“.”或“”代表容器的class
      variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
      loaded: 'loadedHandler', //当播放器加载后执行的函数
      flashplayer: true,//如果强制使用flashplayer则设置成true
      loop: false,
      live: false,
      playCorrect: true,
      debug: false,//是否开启调试模式
      volume: 0.5,
      video:
        urlArr
      // [
      //   ["rtmp://10.20.5.145:1936/vod|/file/local://D:/fms_TRMS/data/file/20180827/multi/11/bd7cf4dccea2418fa077f50aaedbdf54.mp4", "", "标清", 10],
      //   ["rtmp://10.20.5.145:1936/vod|/file/local://D:/fms_TRMS/data/file/20180827/multi/11/bd7cf4dccea2418fa077f50aaedbdf54.mp4", "", "高清", 0]
      // ]
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
        // 监听时候暂停
        win.player.addListener('paused', win.pausedHandler);

      }
      // 监听是否暂停
      win.pausedHandler = function pausedHandler() {
        console.log("暂停暂停暂停暂停暂停暂停暂停");
        that.pause = true
      }
      // 监听视频播放结束
      win.endedHandler = function endedHandler() {
        // 播放结束后  刷新播放器
        that.props.refresh();
      }

      // 监听视频已加载的字节
      win.bytesHandler = function bytesHandler(e) {
        console.log(e);
      }

      // 监听时间
      win.timeHandler = function timeHandler(e) {
        that.time = e;
        // win.player.videoPlay()
      }

      // 监听错误
      win.errorHandler = function errorHandler(e) {
        // message.error("加载失败!", 3)
        that.props.refresh()
      }

      win.playHandler = function playHandler() {
        //正在播放
        console.log('正在播放')
      }

      // 当获取BUFFER之后自动执行多次播放事件，从而改善视频丢帧情况
      win.bufferHandler = function bufferHandler(e) {
        console.log(e);
        num++;
        if (num < 10) {
          win.player.videoPlay()
        }
      }

      // 在切换清晰度后将播放器暂停再播放，以解决卡顿
      win.definitionChangeHandler = function definitionChangeHandler(e) {
        // var timer = setTimeout(() => {
        //   win.player.videoPlay()
        //   clearTimeout(timer);
        // playOrPause
        // videoPause
        // videoPlay
        // }, 1000);
        // win.player.videoPause()

        var timer = setTimeout(() => {
          // win.player.videoPause()
          win.player.videoPlay()
          console.log("播放播放播放播放播放");
          clearTimeout(timer);
        }, 1000);

        // 切换高标清同时切换下载类型
        var setTimeOut = false
        if (e === 0) {
          console.log('切换标清')
          that.props.videoRelotion("ld");
        }
        if (e === 1) {
          console.log('切换高清')
          that.props.videoRelotion("hd");
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
        <div style={{ height: 725, width: 1300 }} id="video"></div>
      </div>
    )
  }
}