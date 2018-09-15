/*
 * @Author: JC.Liu 
 * @Date: 2018-07-11 13:55:54 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-09 13:54:25
 * 中间 教室显示
 */
import React, { Component } from 'react'
import { Progress } from 'antd'
import './body.css'
import request from '../../js/_x/util/request'
import G from '../../js/g'
const ajax = request.request

export class BodyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: [],
      // 用来渲染
      renderData: [],
      // 用来翻页
      classInfoData: [],
      haveMsg: false,
      message: ""
    }
    this.index = 1;
    this.timerData = []
  }

  componentDidMount() {
    this.request()
  }
  request() {
    ajax("find_classmessage", {
      buildingid: G.buildingId,
    }, function (res) {
      if (res.result && res.data && res.data.length) {
        // 将数据转为重构后的数据结构
        let data = res.data;
        // 筛选去掉 show：false 的数据
        let filterData = []

        for (var i = 0; i < data.length; i++) {
          filterData.push({
            floor: data[i].floor,
            classes: this.filter(data[i].classes)
          })
        }

        // 将展示的数据再做一次遍历，去掉classes为空的
        let renderData = []
        filterData.map((item) => {
          if (item.classes && item.classes.length) {
            renderData.push(item)
          }
        })
        this.setState({
          classInfoData: renderData
        })
        this.testRenderData(renderData)
      } else {
        this.setState({
          haveMsg: true,
          message: res.message
        })
      }
    }.bind(this),
      function (err) {
        this.setState({
          message: "服务器未响应"
        })
      }.bind(this))
  }

  // 去除false的数据
  filter(classes) {
    let data = classes;
    let recive = []
    for (var i = 0; i < data.length; i++) {
      if (data[i].show) {
        recive.push(data[i])
      }
    }
    return recive
  }


  testRenderData(data) {
    this.timerData = data
    let bodyELeHeight = document.documentElement.clientHeight
    // 获取body 高度
    // let body = this.body
    // 获取item 高度
    // let bodyHeight = body.clientHeight

    let itemHeight = 180
    // item 的高度为120px + margin-bottom
    // itemHeight += 40
    // css 的padding 2%
    let padding = Math.ceil(bodyELeHeight * 0.02 * 2)
    // 获取 边界高度
    // 展示区域的宽度 - padding 的宽度，除以item 的高度，得到能放多少行
    let rowNum = Math.floor((bodyELeHeight - padding) / itemHeight)
    // 假设能放5行
    // var rowNum = 5;
    // 有5列
    var rolNum = 5;
    var renderData = []
    // 渲染第一页数据
    this.renderNextPage(data, rowNum, rolNum, rowNum, rowNum * rolNum, renderData)
    // 定时翻页 在第二页开始

    this.timer = setInterval(() => {
      if (this.timerData && this.timerData.length && this.timerData[0].classes && this.timerData[0].classes.length) {
        this.renderNextPage(this.timerData, rowNum, rolNum, rowNum, rowNum * rolNum, renderData = [])
      } else {
        clearInterval(this.timer)
        this.request()
      }
    }, 20000)
  }

  /**
   * 拼接下一页数据
   * @param {*} data         数据
   * @param {*} rowNum       每页最大放置行数
   * @param {*} rolNum       每页列数
   * @param {*} rowNum       剩余行数
   * @param {*} manLen       剩余长度
   * @param {*} renderData   需要渲染的翻页数据  递归添加
   */
  renderNextPage(data, rowNum, rolNum, useRow, maxLen, renderData) {
    // var data = data,
    //   renderData = renderData,
    //   useRow = useRow,
    //   maxLen = maxLen;
    // 如果第一组数据的 classes 的长度 小于或等于可放置的长度
    if (data[0].classes.length < maxLen || data[0].classes.length === maxLen) {
      // console.log("小于一页放置长度");
      // 表示第一组数据可以在一页显示完
      // 余下多少行
      useRow = useRow - Math.ceil(data[0].classes.length / rolNum)
      renderData.push(data[0])
      // 删除添加进去的组
      data.splice(0, 1);
      // 还有剩余的空间，
      if (useRow > 0) {
        if (data && data.length && data[0].classes.length) {
          this.renderNextPage(data, rowNum, rolNum, useRow, useRow * 5, renderData)
        } else {
          // console.log("最后一页数据");
          clearInterval(this.timer)
          setTimeout(() => {
            this.request()
          }, 20000);
        }
      }
    } else {
      // console.log("大于一页放置长度");
      // 剩余长度
      // 第一组数据的长度大于了剩余长度 则截取剩余长度 的数据出来
      // 复制第一组数据
      var firstData = data[0];
      var target = {};
      var classes = [];
      for (var i = 0; i < maxLen; i++) {
        classes.push(firstData.classes[i])
      }
      target.floor = firstData.floor
      target.classes = classes
      renderData.push(target)
      data[0].classes.splice(0, maxLen)
    }
    this.timerData = data
    this.setState({
      renderData,
    })
  }

  /**
   * 剩余时间转换
   */
  renderNextTime(time) {
    // 时间戳 是当天时间的最后一秒 - 减去当前时间的时分秒
    var nowHours = new Date().getHours(),
      nowMin = new Date().getMinutes();
    var lastHours = new Date(time).getHours(),
      lastMin = new Date(time).getMinutes()
    
    var restHours 
    if (lastHours > nowHours){
      restHours = lastHours - nowHours;
    }else{
      restHours = nowHours - lastHours ;
    }

    var restMin
    if (lastMin > nowMin) {
      restMin = lastMin - nowMin;
    } else {
      restMin = nowMin - lastMin;
    }
    return `${restHours}h   ${restMin}m`;
  }

  /**
   * num 转 中文
   */
  floor = (floor) => {
    switch (floor) {
      case 1:
        return "一";
      case 2:
        return "二";
      case 3:
        return "三";
      case 4:
        return "四";
      case 5:
        return "五";
      case 6:
        return "六";
      case 7:
        return "七";
      case 8:
        return "八";
      case 9:
        return "九";
      case 10:
        return "十";
      case 11:
        return "十一";
      case 12:
        return "十二";
      case 13:
        return "十三";
      case 14:
        return "十四";
      case 15:
        return "十五";
      case 16:
        return "十六";
      case 17:
        return "十七";
      case 18:
        return "十八";
      case 19:
        return "十九";
      case 20:
        return "二十";
      default:
        break;
    }
  }

  /**
   * 保留一位小数的百分比
   * @param {*} p float
   */
  percent(p) {
    var percent = p + 0
    var num = (percent * 100).toFixed(1)
    return parseFloat(num)
  }

  /**
   * render 数据
   * @param {*} data 教室展示数据
   */
  renderCard(data) {
    return data.classes.map((item, ind) => {
      if (item.isonclass) {
        // 使用中的教室
        return (
          <div
            key={ind}
            className="JC-item"
          >
            <div className="JC-card-point"></div>
            <div className="JC-card-body">
              <div className="JC-card-body-left" >
                {item.className}
              </div>
              <div className="JC-card-body-right" >
                <div className="JC-c-b-r-class">{item.courseName}</div>
                <div className="JC-c-b-r-tea">({item.teacherName})</div>
              </div>
            </div>
          </div>
        )
      } else {
        // 空闲教室
        return (
          <div key={ind} className="JC-item">
            <div className="JC-card-body">
              <div className="JC-card-body-left-Progress" >
                <Progress type="circle" strokeWidth={13} percent={this.percent(item.usageRate)} format={() => item.className} />
              </div>
              <div className="JC-card-body-right-info" >
                <div className="">使用率：<span className="JC-card-body-info-use" >{this.percent(item.usageRate)}</span>&nbsp;%</div>
                <div className="">剩余空闲：{this.renderNextTime(item.nextTime)}</div>
              </div>
            </div>
          </div>
        )
      }
    })
  }

  render() {
    return (
      <div className="JC-bs-body" ref={node => this.body = node} >
        {
          this.state.renderData.map((item, index) => {
            if (item.classes.length) {
              return (
                <div className="JC-card" key={index} >
                  <div className="JC-card-left" >{this.floor(item.floor)}楼</div>
                  <div className="JC-card-right">{this.renderCard(item)}</div>
                </div>
              )
            } else {
              return null
            }
          })
        }
      </div>
    )
  }
}