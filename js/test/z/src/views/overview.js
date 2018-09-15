/*
 * @Author: 甘维添 
 * @Date: 2018-04-10 14:55:23 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-07 17:37:18
 */
import React, { Component } from 'react';
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import ReactEcharts from 'echarts-for-react';
import { Carousel, Spin } from 'antd';
import './../css/overview.css';
import _x from './../utils/_x/index';
import noData from './../static/img/noData.png'

class Overview extends Component {
  constructor(props) {
    super(props);
    this.data = ['2012', '2013', '2014', '2015', '2016', '2016']
    this.state = {
      AbsenceCount: { // 综合缺考管理数据
        authenticationSum: [],
        confirmAbsentSum: [],
        examSessionNum: [],
        localAppearSum: [],
        orgCode: [],
        orgTypeId: [],
        orgname: [],
        paperAbsenceSum: [],
        scoreAbsenceSum: [],
        totalExamineeNum: [],
        videoAppearSum: []
      },
      DisciplineCount: {  // 综合违规管理数据
        videoAppearSum: [],
        localAppearSum: [],
        confirmAbsentSum: [],
        orgname: []
      },
      SignManage: { // 签到管理
        totalExamroomNum: []
      },
      modalVisible: false, // 模态框是否显示
      absentOption: null, // 综合缺考管理设置
      violationOption: null, // 综合违规管理设置
      signManageOption: null, // 监考签到管理
      noAbsent: false, // 是否展示缺考无数据
      noViolation: false, // 是否展示违规无数据
      noSignManage: false // 是否展示签到管理无数据
    }

    // chart公共配置
    this.chartOptions = {
      grid: {
        left: 80,
        right: 40,
        bottom: 300
      },
      datazoom: {
        start: 0,//默认为0  
        end: 50,//默认为100  
        // end: 100 * (5 / 7),//默认为100  
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        // handleSize: 0,//滑动条的 左右2个滑动条的大小  
        height: 25,//组件高度  
        // left: 50, //左边的距离  
        // right: 40,//右边的距离  
        bottom: 250,//右边的距离  
        // handleColor: '#ddd',//h滑动图标的颜色  
        // handleStyle: {
        //   borderColor: "#cacaca",
        //   borderWidth: "1",
        //   shadowBlur: 2,
        //   background: "#ddd",
        //   shadowColor: "#ddd",
        // },
        // backgroundColor: '#ddd',//两边未选中的滑动条区域的颜色  
        // showDataShadow: false,//是否显示数据阴影 默认auto  
        // showDetail: false,//即拖拽时候是否显示详细数值信息 默认true  
        // handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
        // filterMode: 'none',
        minValueSpan: 3,
        maxValueSpan: 8,
        // zoomLock: true

      }
    }

    this.loginData = JSON.parse(sessionStorage.loginData)
    this.examId = sessionStorage.examId
  }

  /**
   * 公共路由跳转方法
   * @param {string} path 路由地址 
   */
  jumpLocation(path) {
    if (path === '/x') {
      this.modalToggle('true')
      return null
    }
    this.props.history.push(path)
  }

  /**
   * 模态框切换
   * @param {Boolean} isVisible 是否显示模态框
   */
  modalToggle(isVisible) {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  /**
   * 综合缺考管理图表数据 
   * @param {object} data  请求参数
   */
  getAbsentOption(data = {}) {
    let chartConfig = {
      barGap: '20%',
      barWidth: 18,
      legend: ['身份验证', '现场上报', '视频上报', '阅卷缺考', '成绩缺考', '最终缺考'],
      label: {
        show: true,
        position: 'bottom',
        color: '#bec5d4',
        fontSize: 18
      },
    }

    let option = {
      title: {
        show: true,
        text: '综合缺考管理',
        textStyle: {
          fontSize: 20,
          color: '#3696e9',
          fontWeight: 'normal'
        }
      },
      color: ['#20d408', '#135ee8', '#03d5e2', '#04aa5a', '#04aa8d', '#b318ed'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        itemWidth: 26,
        itemGap: 15,
        data: chartConfig.legend,
        right: 0,
        textStyle: {
          color: '#a8b2c5'
        }
      },
      toolbox: { // 隐藏工具栏
        show: false,
      },

      grid: {
        ...this.chartOptions.grid
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: data.orgname,
        splitArea: {
          interval: 2
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          }
        }
      ],
      dataZoom: [//给x轴设置滚动条  
        {
          ...this.chartOptions.datazoom
        }
      ],
      series: [
        { // 身份验证
          name: chartConfig.legend[0],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [55, 63]
          },
          barWidth: chartConfig.barWidth,
          data: data.authenticationSum
        },
        { // 现场上报
          name: chartConfig.legend[1],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [32, 97]
          },
          barWidth: chartConfig.barWidth,
          data: data.localAppearSum
        },
        { // 视频上报
          name: chartConfig.legend[2],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [9, 130]
          },
          barWidth: chartConfig.barWidth,
          data: data.videoAppearSum
        },
        { // 阅卷缺考
          name: chartConfig.legend[3],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [-14, 164]
          },
          barWidth: chartConfig.barWidth,
          data: data.paperAbsenceSum
        },
        { // 成绩缺考
          name: chartConfig.legend[4],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [-37, 197]
          },
          barWidth: chartConfig.barWidth,
          data: data.scoreAbsenceSum
        },
        { // 最终缺考
          name: chartConfig.legend[5],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [-60, 230]
          },
          barWidth: chartConfig.barWidth,
          data: data.confirmAbsentSum
        }
      ]
    };

    return option;
  }

  /**
   * 综合违规管理图表数据 
   * @param {object} data  请求参数
   */
  getViolationOption(data = {}) {
    let chartConfig = {
      barGap: '20%',
      barWidth: 18,
      legend: ['身份验证', '现场上报', '视频上报', '阅卷违规', '成绩违规', '最终违规'],
      label: {
        show: true,
        position: 'bottom',
        color: '#bec5d4',
        fontSize: 18
      },
    }

    let option = {
      title: {
        show: true,
        text: '综合违规管理',
        textStyle: {
          fontSize: 20,
          color: '#3696e9',
          fontWeight: 'normal'
        }
      },
      color: ['#20d408', '#135ee8', '#03d5e2', '#04aa5a', '#04aa8d', '#b318ed'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        itemWidth: 26,
        itemGap: 15,
        data: chartConfig.legend,
        right: 0,
        textStyle: {
          color: '#a8b2c5'
        }
      },
      toolbox: { // 隐藏工具栏
        show: false,
      },
      grid: {
        ...this.chartOptions.grid
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: data.orgname,
        // data: [1, 2, 3, 5, 6, 7, 8],
        // min: 0,
        // max: this.data.length - 1,
        splitArea: {
          interval: 2
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          }
        }
      ],
      dataZoom: [//给x轴设置滚动条  
        {
          ...this.chartOptions.datazoom
        }
      ],
      series: [
        { // 现场上报
          name: chartConfig.legend[1],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [25, 63]
          },
          barWidth: chartConfig.barWidth,
          data: data.localAppearSum
        },
        { // 视频上报
          name: chartConfig.legend[2],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [2, 97]
          },
          barWidth: chartConfig.barWidth,
          data: data.videoAppearSum
        },
        { // 最终缺考
          name: chartConfig.legend[5],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [-21, 130]
          },
          barCategoryGap: '-100',
          barWidth: chartConfig.barWidth,
          data: data.confirmAbsentSum
        }
      ]
    };

    return option;
  }

  /**
  * 监考签到管理图表
  * @param {object} data  请求参数
  */
  getSignManageOption(data = {}) {
    let chartConfig = {
      barGap: '20%',
      barWidth: 18,
      legend: ['签到考场总数'],
      label: {
        show: true,
        position: 'bottom',
        color: '#bec5d4',
        fontSize: 18
      },
    }

    let option = {
      title: {
        show: true,
        text: '签到考场总数',
        textStyle: {
          fontSize: 20,
          color: '#3696e9',
          fontWeight: 'normal'
        }
      },
      color: ['#20d408'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        itemWidth: 26,
        itemGap: 15,
        data: chartConfig.legend,
        right: 0,
        textStyle: {
          color: '#a8b2c5'
        }
      },
      toolbox: { // 隐藏工具栏
        show: false,
      },
      grid: {
        ...this.chartOptions.grid
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        data: data.orgname,
        // data: [1, 2, 3, 5, 6, 7, 8],
        // min: 0,
        // max: this.data.length - 1,
        splitArea: {
          interval: 2
        }
      },
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false
          }
        }
      ],
      dataZoom: [//给x轴设置滚动条  
        {
          ...this.chartOptions.datazoom
        }
      ],
      series: [
        { // 现场上报
          name: chartConfig.legend[0],
          type: 'bar',
          label: {
            ...chartConfig.label,
            offset: [25, 63]
          },
          barWidth: chartConfig.barWidth,
          data: data.totalExamroomNum
        }
      ]
    };

    return option;
  }

  /**
   * 获取机构类型列表
   */
  getOrgTypeCodeList() {
    _x.request('homePage/getOrgTypeCodeList', {
      //入参
    }, (res) => {
      if (res.result) {
        // console.log(res)
        sessionStorage.setItem("orgType", JSON.stringify(res.data))
        // G.orgTypeId = res.data
      }
    })
  }

  /**
 * 测试代码
 */
  // getSignInDetailInfo() {
  //   _x.request('/signInManage/getSignInDetailInfo', {
  //     "examId": this.examId,
  //     "orgCode": this.loginData.orgCode,
  //     "orgCodeFatherId": this.loginData.orgCode,
  //     "examSessionNum": "1",
  //     "currentPage": 1,
  //     "pageSize": 10
  //   }, (res) => {
  //     if (res.result) {
  //       console.log(res.data)
  //       let data = res.data.pageData || [];
  //       let list = [];
  //       // 遍历当前数组
  //       data.map((item, index) => {
  //         // console.log(item)
  //         // 选长的数组作为遍历数组
  //         let eachList = item.arrangeExaminerList.length > item.signExaminerList.lenght
  //           ? item.arrangeExaminerList
  //           : item.signExaminerList

  //           console.log(eachList)
  //         eachList.map((item1, index) => {
  //           let obj = {}
  //           obj.logicExrNo = item.logicExrNo;
  //           obj.orgCode = item.orgCode;
  //           obj.orgName = item.orgName;
  //           obj.orgTypeId = item.orgTypeId;

  //           //编排甲乙丙
  //           obj.arraNameA = null;
  //           obj.arraTypeA = null;
  //           obj.arraUidA = null;
  //           obj.arraNameB = null;
  //           obj.arraTypeB = null;
  //           obj.arraUidB = null;
  //           obj.arraNameC = null;
  //           obj.arraTypeC = null;
  //           obj.arraUidC = null;

  //           //签到甲乙丙
  //           obj.signNameA = null;
  //           obj.signTypeA = null;
  //           obj.signUidA = null;
  //           obj.signNameB = null;
  //           obj.signTypeB = null;
  //           obj.signUidB = null;
  //           obj.signNameC = null;
  //           obj.signTypeC = null;
  //           obj.signUidC = null;

    
  //         })






  //       })
  //     }
  //   })
  // }

  /**
   * 获取综合缺考管理数据
   */
  getAbsenceCount() {
    _x.request('homePage/getAbsenceCount', {
      "examId": this.examId,
      "orgCode": this.loginData.orgCode,
      "orgCodeFatherId": this.loginData.orgCode,
      "examSessionNum": ""
    }, (res) => {
      if (res.result) {
        // console.log(res)
        // 拆分 bar 数据
        if (res.data.length) {
          let obj = {}
          res.data.forEach((item, index) => {
            for (let i in item) {
              if (!obj[i]) {
                obj[i] = []
                obj[i].push(item[i])
              } else {
                obj[i].push(item[i])
              }
            }
          })

          // 综合缺考图表配置信息
          let absentOption = this.getAbsentOption(obj)
          this.setState({ AbsenceCount: obj, absentOption })
        } else {
          this.setState({ noAbsent: true })
        }

      }
    })
  }

  /**
   * 获取综合违规管理数据
   */
  getDisciplineCount() {
    _x.request('homePage/getDisciplineCount', {
      "examId": this.examId,
      "orgCode": this.loginData.orgCode,
      "orgCodeFatherId": this.loginData.orgCode,
      "examSessionNum": ""
    }, (res) => {
      if (res.result) {
        // 拆分 bar 数据
        if (res.data.length) {
          let obj = {}
          res.data.forEach((item, index) => {
            for (let i in item) {
              if (!obj[i]) {
                obj[i] = []
                obj[i].push(item[i])
              } else {
                obj[i].push(item[i])
              }
            }
          })

          // 综合缺考图表配置信息
          let violationOption = this.getViolationOption(obj)
          this.setState({ DisciplineCount: obj, violationOption })
        } else {
          this.setState({ noViolation: true })
        }

      }
    })
  }

  /**
   * 获取签到考场总数数据
   */
  getSignInOrgList() {
    _x.request('/signInManage/getSignInOrgList', {
      "examId": this.examId,
      "orgCode": this.loginData.orgCode,
      "orgCodeFatherId": this.loginData.orgCode,
      "examSessionNum": ""
    }, (res) => {
      if (res.result) {
        // 拆分 bar 数据
        if (res.data.length) {
          let obj = {}
          res.data.forEach((item, index) => {
            for (let i in item) {
              if (!obj[i]) {
                obj[i] = []
                obj[i].push(item[i])
              } else {
                obj[i].push(item[i])
              }
            }
          })
          // // 综合缺考图表配置信息
          let signManageOption = this.getSignManageOption(obj)
          this.setState({ SignManage: obj, signManageOption })
        } else {
          this.setState({ noSignManage: true })
        }

      }
    })
  }

  /**
   * 综合缺考管理滚动事件 (暂时弃用)
   * 预留，后期可能随着需求变更会用到
   */
  absentChartsEvents() {
    let zoomEvent = (e, c) => {
      // console.log(e, c)
      // 由于 在antd的轮播组建内通过ref的方式获取dom节点存在bug
      // 所以需要使用原生方法获dom节点
      // let absentContent = document.getElementById('absent-content')
      // // 容器宽度
      // let absentContentWidth = parseInt(absentContent.style.width)
      // // 综合缺考管理图表数据
      // let data = this.state.AbsenceCount
      // // 绑定datazoom事件
      // let offsetPer = e.start / 100
      // let left = offsetPer * absentContentWidth
      // absentContent.style.left = '-' + left + 'px';
    }
    return {
      'datazoom': zoomEvent,
    }
  }

  /**
   * 综合违规管理滚动事件（暂时弃用）
   * 预留，后期可能随着需求变更会用到
   */
  violationChartsEvents() {
    let zoomEvent = (e, c) => {
      // console.log(e, c)
      // 由于 在antd的轮播组建内通过ref的方式获取dom节点存在bug
      // 所以需要使用原生方法获dom节点
      // 下方列表容器
      // let violationContent = document.getElementById('violation-content')
      // // 容器宽度
      // let violationContentWidth = parseInt(violationContent.style.width)
      // // 综合缺考管理图表数据
      // let offsetPer = e.start / 100
      // let left = offsetPer * violationContentWidth
      // console.log(e)
      // violationContent.style.left = '-' + left + 'px';
    }
    return {
      'datazoom': zoomEvent,
    }
  }

  componentWillMount() {
    // 获取机构类型
    this.getOrgTypeCodeList()
    // 获取综合缺考管理数据
    this.getAbsenceCount()
    // 获取综合违规管理数据
    this.getDisciplineCount()
    // 获取监考签到数据
    this.getSignInOrgList()

    //this.getSignInDetailInfo()
  }

  render() {
    let {
      authenticationSum, // 身份验证人数
      confirmAbsentSum, // 最终缺考人数
      // examSessionNum, // 考试场次
      localAppearSum, // 本地上报缺考数量
      paperAbsenceSum,  // 阅卷缺考数量
      scoreAbsenceSum,  // 成绩缺考数量
      videoAppearSum,  // 视频上报缺考数量
      // orgname
    } = this.state.AbsenceCount
    // 累加器
    let reducer = (accumulator, currentValue) => accumulator + currentValue
    // 身份验证总人数
    let authNum = authenticationSum.length ? authenticationSum.reduce(reducer) : 0
    // 现场上报总人数
    let localNum = localAppearSum.length ? localAppearSum.reduce(reducer) : 0
    // 视频上报总人数
    let videoNum = videoAppearSum.length ? videoAppearSum.reduce(reducer) : 0
    // 阅卷缺考总人数
    let paperNum = paperAbsenceSum.length ? paperAbsenceSum.reduce(reducer) : 0
    // 成绩缺考总人数
    let scoreNum = scoreAbsenceSum.length ? scoreAbsenceSum.reduce(reducer) : 0
    // 最终缺考总人数
    let confirmNum = confirmAbsentSum.length ? confirmAbsentSum.reduce(reducer) : 0

    // 下方为综合违规管理的总览数据
    let _confirmAbsentSum = this.state.DisciplineCount.confirmAbsentSum || []
    let _localAppearSum = this.state.DisciplineCount.localAppearSum || []
    let _videoAppearSum = this.state.DisciplineCount.videoAppearSum || []
    // let _orgname = this.state.DisciplineCount.orgname

    // 最终缺考总人数
    let _confirmNum = _confirmAbsentSum.length ? _confirmAbsentSum.reduce(reducer) : 0
    // 现场上报总人数
    let _localNum = _localAppearSum.length ? _localAppearSum.reduce(reducer) : 0
    // 视频上报总人数
    let _videoNum = _videoAppearSum.length ? _videoAppearSum.reduce(reducer) : 0

    // 下方为签到管理总览数据
    let { totalExamroomNum } = this.state.SignManage

    // 考场总数
    let totalExam = totalExamroomNum.length ? totalExamroomNum.reduce(reducer) : 0
    return (
      <div className="gwt-overview">
        <div className="gwt-header">
          <div>
            <h1>缺考违纪管理系统 </h1>
            <h2>{this.loginData.orgName}</h2>
          </div>
        </div>
        <div className="gwt-overview-content">
          <div className="gwt-tabs">
            <div
              className="gwt-zhqk"
              onClick={this.jumpLocation.bind(this, '/absent_supervise')}>
              <div>
                <h3>综合缺考管理</h3>
                <p>最终缺考：{confirmNum}</p>
              </div>
              <ul>
                <li>
                  <p>身份验证</p>
                  <p>{authNum}</p>
                </li>
                <li>
                  <p>现场上报</p>
                  <p>{localNum}</p>
                </li>
                <li>
                  <p>视频上报</p>
                  <p>{videoNum}</p>
                </li>
                <li>
                  <p>阅卷缺考</p>
                  <p>{paperNum}</p>
                </li>
                <li>
                  <p>成绩缺考</p>
                  <p>{scoreNum}</p>
                </li>
              </ul>
            </div>
            <div
              className="gwt-zhwg"
              onClick={this.jumpLocation.bind(this, '/violation_supervise')}>
              <div>
                <h3>综合违规管理</h3>
                <p>最终违规：{_confirmNum}</p>
              </div>
              <ul>
                <li>
                  <p>现场上报</p>
                  <p>{_localNum}</p>
                </li>
                <li>
                  <p>视频上报</p>
                  <p>{_videoNum}</p>
                </li>
              </ul>
            </div>
            <div
              className="gwt-jkqd"
              onClick={this.jumpLocation.bind(this, '/sign_manage_index')}>
              <div>
                <h3>监考签到管理</h3>
                <p>签到考场总数：{totalExam}</p>
              </div>
              <ul>
                <li>
                  <p style={{ opacity: 0 }}>彩蛋</p>
                </li>
              </ul>
            </div>
          </div>
          <Carousel
            effect="scrollx"
            autoplay
          >

            <div className="gwt-chart-container">
              {/* 综合缺考管理图表 */}
              {
                this.state.absentOption
                  ?
                  <React.Fragment>
                    <div className="gwt-charts-content">
                      <ReactEcharts
                        style={{ width: '1320px', height: 555 }}
                        option={this.state.absentOption}
                        onEvents={this.absentChartsEvents()}
                      />
                    </div>
                    <div className="gwt-table">
                      <ul>
                        <li>身份验证</li>
                        <li>现场上报</li>
                        <li>视频上报</li>
                        <li>阅卷缺考</li>
                        <li>成绩缺考</li>
                        <li>最终缺考</li>
                      </ul>
                      <div className="gwt-table-content">
                        {/* 身份验证 */}
                        <p></p>
                        {/* 现场上报 */}
                        <p></p>
                        {/* 视频上报 */}
                        <p></p>
                        {/* 阅卷缺考 */}
                        <p></p>
                        {/* 成绩缺考 */}
                        <p></p>
                        {/* 最终缺考 */}
                        <p></p>
                      </div>
                    </div>
                  </React.Fragment>
                  : this.state.noAbsent
                    ? <div style={{ textAlign: 'center' }}>
                      <img src={noData} style={{ margin: '0 auto' }} />
                      <p style={{ fontSize: 16, paddingTop: 15 }}>暂无缺考数据！</p>
                    </div>
                    : <div className="gwt-loading">
                      <Spin />
                    </div>
              }
            </div>
            {/* 综合违规管理图表 */}
            <div className="gwt-chart-container">
              {
                this.state.violationOption
                  ?
                  <React.Fragment>
                    <div className="gwt-charts-content">
                      <ReactEcharts
                        style={{ width: '1320px', height: 555 }}
                        option={this.state.violationOption}
                        onEvents={this.violationChartsEvents()}
                      />
                    </div>
                    <div className="gwt-table">
                      <ul>
                        <li>现场上报</li>
                        <li>视频上报</li>
                        <li>最终违规</li>
                      </ul>
                      <div className="gwt-table-content">
                        {/* 现场上报 */}
                        <p></p>
                        {/* 视频上报 */}
                        <p></p>
                        {/* 最终缺考 */}
                        <p></p>
                      </div>
                    </div>
                  </React.Fragment>
                  : this.state.noViolation
                    ? <div style={{ textAlign: 'center' }}>
                      <img src={noData} style={{ margin: '0 auto' }} />
                      <p style={{ fontSize: 16, paddingTop: 15 }}>暂无违规数据！</p>
                    </div>
                    : <div className="gwt-loading">
                      <Spin />
                    </div>
              }
            </div>
            {/*  监考签到管理 */}
            <div className="gwt-chart-container">
              {/* 综合缺考管理图表 */}
              {
                this.state.signManageOption
                  ?
                  <React.Fragment>
                    <div className="gwt-charts-content">
                      <ReactEcharts
                        style={{ width: '1320px', height: 555 }}
                        option={this.state.signManageOption}
                      />
                    </div>
                    <div className="gwt-table">
                      <ul>
                        <li>签到考场总数</li>
                      </ul>
                      <div className="gwt-table-content">
                        {/* 考场总数 */}
                        <p></p>
                      </div>
                    </div>
                  </React.Fragment>
                  : this.state.noSignManage
                    ? <div style={{ textAlign: 'center' }}>
                      <img src={noData} style={{ margin: '0 auto' }} />
                      <p style={{ fontSize: 16, paddingTop: 15 }}>暂无签到数据！</p>
                    </div>
                    : <div className="gwt-loading">
                      <Spin />
                    </div>
              }
            </div>
          </Carousel>
        </div>
      </div>
    );
  }
}

export default Overview;