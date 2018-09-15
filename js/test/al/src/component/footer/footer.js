/*
 * @Author: JC.Liu 
 * @Date: 2018-07-11 13:55:54 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-06 17:23:53
 * 底部通知 socket 实现
 */
import React, { Component } from "react";
import "./footer.css";
import request from "../../js/_x/util/request";
import G from "../../js/g";

const ajax = request.request;

export class FooterComponent extends Component {
  constructor() {
    super();
    this.state = {
      notic: []
    };
  }

  // 走马灯实现方式  操作dom节点 进行定位的 left 实现
  // 1.获取wrapWidth的节点宽度
  // 2.获取通知消息noticWidth的宽度
  // 3.消息通知定时往前面移动 像素位置
  // 4.当移动到noticWidth的宽度 的位置后，重新进行 滚动函数
  // 10秒走完 wrapWidth + noticWidth ， （ wrapWidth + noticWidth ）/ 10S 得到每秒走多少像素

  // 每次减少一定的像素后，要重新计算 left 在去减少 px

  componentDidMount() {
    this.request();
  }

  request() {
    ajax("find_notice", { buildingid: G.buildingId }, res => {
      if (res.result && res.data && res.data.length) {
        console.log(res.data);
        this.setState({
          notic: res.data
          // notic: []
        });
        this.zoumadeng();
      } else {
        let timer = setTimeout(() => {
          this.request();
          clearTimeout(timer);
        }, 5000);
      }
    });
  }

  zoumadeng() {
    let wrapNode = this.wrapNode;
    let noticNode = this.noticNode;
    let wrapWidth = wrapNode.clientWidth,
      noticWidth = noticNode.clientWidth;

    let noticWrapWidth = 0;

    for (var i = 0; i < this.noticNode.childNodes.length; i++) {
      console.log(this.noticNode.childNodes[i].clientWidth);
      noticWrapWidth += this.noticNode.childNodes[i].clientWidth + 200
    }

    console.log("notic:", noticWrapWidth);

    // 将消息置出外
    noticNode.style.left = wrapWidth + "px";
    // noticNode.style.width = noticWrapWidth + "px";
    // 10S 完成动画，每秒走10%   也就是 1s =  wrapWidth * 10% ，
    // 规定没 300ms 执行一次 ，300 / 1000 = x / wrapWidth * 10%
    // 设置动画完成所需要时间
    // let time = 10000;
    // 每次 300ms 执行一次
    let delay = 30;
    // 10s走完 每秒 10%
    // let percent = 0.3
    // 没300ms 走的距离
    // let x = Math.ceil((delay / time) * wrapWidth * percent)
    let x = 1;
    this.timer(wrapWidth, noticNode, noticWrapWidth, x, delay);
  }

  timer = (wrapWidth, target, targetWidth, x, delay) => {
    let _this = this;
    let styleLeft = target.style.left;
    // let left = parseInt(styleLeft)
    let left = parseInt(styleLeft);
    let timer1 = setInterval(() => {
      if (left < - targetWidth) {
        // 走完了 自己的消息宽度
        clearInterval(timer1);
        target.style.left = wrapWidth + "px";
        // 走完了自己消息宽度后  重新请求新的数据  再重新执行走马灯
        _this.request();

      } else {
        target.style.left = left - x + "px";
        left -= x;
      }
    }, delay);
  };

  render() {
    console.log(this.state.notic);
    return (
      <div className="JC-bs-footer">
        <div className="JC-bs-f-notic">
          <div className="JC-bs-f-inline  JC-bs-f-tit">
            <span className="JC-bs-f-n JC-bs-f-n1">通</span>
            <span className="JC-bs-f-n JC-bs-f-n2">知：</span>
            <img
              className="JC-bg-f-icon"
              src={require("../../static/bg/通知图标.png")}
              alt=""
            />
          </div>
          <div
            className="JC-bs-f-info JC-bs-f-inline"
            ref={node => (this.wrapNode = node)}
          >
            <div
              className="JC-bs-n-f-am JC-bs-f-inline"
              ref={node => (this.noticNode = node)}
            >
              {
                this.state.notic.map((item, index) => (
                  <div key={index} className="JC-bs-f-inline JC-bs-f-notic-info" ref={node => this.notic = node} >
                    {item.title}
                    &nbsp;:&nbsp;
                  {item.content}
                  </div>
                ))
              }
            </div>
          </div>
          <div className="JC-bs-f-right  JC-bs-f-inline">
            <div className="JC-bs-f-inline JC-bs-f-point-div">
              <div className="JC-bs-f-point JC-point1 JC-bs-f-inline" />
              <span className="JC-bg-f-f1">授课中</span>
            </div>
            <div className="JC-bs-f-inline JC-bs-f-point-div">
              <div className="JC-bs-f-point JC-point2 JC-bs-f-inline" />
              <span className="JC-bg-f-f2">使用率</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
