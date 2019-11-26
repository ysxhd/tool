/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:01:04 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-13 16:23:16
 * 可视化中心-学生出勤
 */

import React from 'react';
import { Row, Col, Table, Icon } from 'antd';
import { Panel, SVG } from './../common';
import LineChart from '../components/visual/line_chart';
import BarChartSimple from '../components/visual/bar_chart_simple';
import { VisualTop, VisualMenu } from './../components/base/visual';
import _x from '../../js/_x/index';
import G from '../../js/g';

let loopkey;

class ClassroomStu extends React.Component {
  state = {
    courseNum: 0,             //今日总览——课堂分数
    unusualNum: 0,             //今日总览——异常分数
    averageAttendence: 0,             //今日总览——违纪扣分分数
    data: [],
    role: 'stu',         //今日违纪角色；学生：stu，教师：tea
    checked: 1,            //选择时间。1：本周，2：本月，3：本学期
    attOrder: 1,                //出勤排行;1表示升序，-1表示降序
    courOrder: 1,                //课程热度;1表示升序，-1表示降序
    teaOrder: 1,                //教师热度;1表示升序，-1表示降序
    todayAllNull: false,           //有无今日总览数据
    weekData: [],                //本周概览数据
    monthData: [],                //本月概览数据
    termData: [],                //本学期概览数据
    weekAxis: [],                //本周横坐标
    monthAxis: [],                //本月横坐标
    termAxis: [],                //本学期横坐标
    attData: [],                //教学机构违纪扣分排行数据
    teaData: [],                //教师违纪扣分排行数据
    courData: [],                //违纪类型次数排行数据
    attAxis: [],                //教学机构违纪扣分排行横坐标
    teaAxis: [],                //教师违纪扣分排行横坐标
    courAxis: [],                //违纪类型次数排行横坐标
    attLoading: false,
    courLoading: false,
    LineChartLoading: false,
    teaLoading: false,
    totayDisLoading: false,
    todayAllLoading: false,
    height: 0,
  }

  componentDidMount() {
    this.req();
    this.size();
    window.addEventListener('resize', this.size)
  }

  req = () => {
    this.require();
    this.tableData();
    this.teaData();
    this.attData();
    this.courData();
  }

  componentWillUnmount() {
    _x.util.animation.remove(loopkey);
    window.removeEventListener('resize', this.size)
  }

  size = () => {
    this.setState({ height: this.stu.clientHeight })
  }

  require = () => {
    //今日总览数据请求
    this.setState({ todayAllLoading: true, totayDisLoading: true, LineChartLoading: true })
    _x.util.request.request(
      'api/web/stu_attendence/get_overview',
      {}
      , (res) => {
        this.setState({ todayAllLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({
              courseNum: res.data.courseNum,
              averageAttendence: res.data.averageAttendence,
              unusualNum: res.data.unusualNum,
            })
          } else {
            this.setState({ todayAllNull: true })
          }
        }
      }).catch(() => {
        this.setState({ todayAllLoading: false })
      })
    //概览数据
    _x.util.request.request(
      'api/web/stu_attendence/get_attendence_by_type',
      {}
      , (res) => {
        this.setState({ LineChartLoading: false })
        if (res.result) {
          if (res.data) {
            let weekData = [], weekAxis = [],weekNumber=[];
            let monthData = [], monthAxis = [],monthNumber=[];
            let termData = [], termAxis = [],termNumber=[];
            let week = res.data.week.weekDayData,
              month = res.data.month.weeksData,
              total = res.data.total.monthData;
            for (let i = 0; i < week.length; i++) {
              weekData.push(week[i].averageAttendence);
              weekAxis.push(('周' + _x.util.number.toChinese(week[i].weekday)) || '-');
              weekNumber.push(week[i].coursesNumber);
            }
            for (let j = 0; j < month.length; j++) {
              monthData.push(month[j].averageAttendence)
              monthAxis.push(('第' + month[j].weeks + '周') || '-')
              monthNumber.push(month[j].coursesNumber);
            }
            for (let k = 0; k < total.length; k++) {
              termData.push(total[k].averageAttendence);
              termAxis.push(total[k].month + '月' || '-');
              termNumber.push(total[k].coursesNumber);
            }
            this.setState({ weekData, weekAxis, termData, termAxis, monthData, monthAxis, weekNumber, monthNumber, termNumber })
          }
        }
      }).catch(() => {
        this.setState({ LineChartLoading: false })
      })
  }

  //今日违纪数据请求
  tableData = () => {
    _x.util.animation.remove(loopkey);
    _x.util.request.request(
      'api/web/stu_attendence/get_unnormal_ad',
      {},
      (res) => {
        this.setState({ totayDisLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({ data: res.data });
            if (res.data.length > 4) {
              this.handleScroll();
            } else {
              setTimeout(() => {
                this.req();
              }, 120000);
            }
          } else {
            setTimeout(() => {
              this.req();
            }, 120000);
          }
        }
      }).catch(() => {
        this.setState({ totayDisLoading: false })
      })
  }

  attData = () => {
    this.setState({ attLoading: true })
    //出勤排行数据
    _x.util.request.request(
      'api/web/stu_attendence/get_attendence_order',
      {
        type: this.state.checked,
        order: this.state.attOrder
      }
      , (res) => {
        this.setState({ attLoading: false })
        if (res.result) {
          if (res.data) {
            let attData = [], attAxis = [], attNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              attData.push(res.data[i].rate);
              attAxis.push(res.data[i].gradeName);
              attNumber.push(res.data[i].coursesNumber);
            }
            this.setState({ attData, attAxis, attNumber })
          }
        }
      }).catch(() => {
        this.setState({ attLoading: false })
      })
  }

  teaData = () => {
    //教师热度数据
    this.setState({ teaLoading: true })
    _x.util.request.request(
      'api/web/stu_attendence/get_teacher_order',
      {
        type: this.state.checked,
        order: this.state.teaOrder
      }
      , (res) => {
        this.setState({ teaLoading: false })
        if (res.result) {
          if (res.data) {
            let teaData = [], teaAxis = [], teaNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              teaData.push(res.data[i].rate);
              teaAxis.push(res.data[i].teacherName || '-');
              teaNumber.push(res.data[i].coursesNumber);
            }
            this.setState({ teaData, teaAxis, teaNumber })
          }
        }
      }).catch(() => {
        this.setState({ teaLoading: false })
      })
  }

  courData = () => {
    //课程热度数据
    this.setState({ courLoading: true })
    _x.util.request.request(
      'api/web/stu_attendence/get_course_order',
      {
        type: this.state.checked,
        order: this.state.courOrder,
      }
      , (res) => {
        this.setState({ courLoading: false })
        if (res.result) {
          if (res.data) {
            let courData = [], courAxis = [], courNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              courData.push(res.data[i].rate);
              courAxis.push(res.data[i].courseName || '-');
              courNumber.push(res.data[i].coursesNumber);
            }
            this.setState({ courData, courAxis, courNumber })
          }
        }
      }).catch(() => {
        this.setState({ courLoading: false })
      })
  }

  //时间切换
  checked = (index) => {
    this.setState({ checked: index + 1 }, () => {
      this.teaData();
      this.attData();
      this.courData();
    })
  }

  //出勤排行
  attOrder = () => {
    if (this.state.attOrder === 1) {
      this.setState({ attOrder: -1 }, () => this.attData())
    } else {
      this.setState({ attOrder: 1 }, () => this.attData())
    }
  }

  //课程热度
  courOrder = () => {
    if (this.state.courOrder === 1) {
      this.setState({ courOrder: -1 }, () => this.courData())
    } else {
      this.setState({ courOrder: 1 }, () => this.courData())
    }
  }

  //教师热度
  teaOrder = () => {
    if (this.state.teaOrder === 1) {
      this.setState({ teaOrder: -1 }, () => this.teaData())
    } else {
      this.setState({ teaOrder: 1 }, () => this.teaData())
    }
  }

  /*滚动*/
  handleScroll = () => {
    loopkey = _x.util.animation.add(0.02, false, function () {
      this.teaTable.scrollTop = this.teaTable.scrollTop + 2.5;
      if (this.teaTable.scrollTop >= this.teaTableChild.offsetHeight - 170) {
        _x.util.animation.remove(loopkey);
        this.teaTable.scrollTop = 0;
        this.req();
      }
    }.bind(this), true);
  }

  /*暂停滚动*/
  handleStop = () => {
    _x.util.animation.remove(loopkey);
  }

  /*开启滚动*/
  handleStart = () => {
    if (this.state.data.length > 4) {
      this.handleScroll();
    }
  }

  render() {
    //今日总览
    const title = [
      {
        name: '课堂',
        score: this.state.courseNum,
        background: '#2abd80'
      }, {
        name: '异常',
        score: this.state.unusualNum,
        background: '#d3582d'
      }, {
        name: '出勤率',
        score: this.state.averageAttendence,
        background: '#783ec8'
      },
    ];

    //日期切换
    const checked = ['本周', '本月', '本学期'];
    return (
      <div className='lxx-g-showCenter xt-classroom-dis xt-clearfix' ref={(stu) => this.stu = stu}>
        <VisualTop curVisMenu="学生出勤" />
        <div className='zq-g-visBox'>
          <div className='zq-g-visContent'>
            <Row gutter={10}>
              <Col span={8}>
                <Panel
                  style={{ height: this.state.height * 0.275 + 'px' }}
                  loading={this.state.todayAllLoading}
                  className='xt-clearfix xt-today'
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-jrzl"}></use>
                  </svg>&nbsp;&nbsp;<span>今日总览</span></div>} >
                  {
                    this.state.todayAllNull ?
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                      :
                      <div>
                        {
                          title.map((item, index) => (
                            <div className='xt-today-item xt-clearfix' key={'index' + index}>
                              <div className='xt-today-name' style={{ background: item.background }}>{item.name}</div>
                              <div className='xt-today-sroce'>{item.score}{index === 2 ? <span style={{ fontSize: '16px' }}>%</span> : null}</div>
                            </div>
                          ))
                        }
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={16}>
                <Panel
                  loading={this.state.totayDisLoading}
                  style={{ height: this.state.height * 0.275 + 'px' }}
                  className='xt-classroom-dis-table'
                  title={<div>
                    <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                      <use xlinkHref={"#icon-jrwj"}></use>
                    </svg>&nbsp;&nbsp;<span>今日出勤异常</span>
                  </div>} >
                  {
                    this.state.data.length ?
                      <div className='zq-comn-table'>
                        <ul>
                          <li>时间</li>
                          <li>课程</li>
                          <li>教师</li>
                          <li>{G.isVer?'教室':'班级'}</li>
                          <li style={{ flex: "0.4" }}>出勤率</li>
                        </ul>
                        <table ref={re => this.teaTable = re} onMouseEnter={this.handleStop}
                          onMouseLeave={this.handleStart} className='zq-crs-table' >
                          <tbody ref={re => this.teaTableChild = re}>
                            {
                              this.state.data.map((item, i) => {
                                return <tr key={i}>
                                  <td><span>第{_x.util.number.toChinese(item.lessonOrder)}节</span></td>
                                  <td><span>{item.courseName}</span></td>
                                  <td><span>{item.teacherName}</span></td>
                                  <td><span>{item.roomName}</span></td>
                                  <td><span>{item.attendence}%</span></td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table >
                      </div>
                      // <Table
                      //   dataSource={this.state.data}
                      //   columns={columns}
                      //   pagination={false}
                      //   scroll={{ x: false, y: 160 }}
                      // />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
            </Row>

            <Row gutter={10}>
              <Col span={8}>
                <Panel
                  loading={this.state.LineChartLoading}
                  style={{ height: this.state.height * 0.25 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-week"}></use>
                  </svg>&nbsp;&nbsp;<span>本周概览</span></div>} >
                  {
                    this.state.weekData.length ?
                      <LineChart color='#b9c2bf' number={this.state.weekNumber} type={2} style={{ height: this.state.height * 0.22 + 'px' }} data={this.state.weekData} xAxis={this.state.weekAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={8}>
                <Panel
                  loading={this.state.LineChartLoading}
                  style={{ height: this.state.height * 0.25 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-month"}></use>
                  </svg>&nbsp;&nbsp;<span>本月概览</span></div>} >
                  {
                    this.state.monthData.length ?
                      <LineChart color='#783ec8' number={this.state.monthNumber} type={2} style={{ height: this.state.height * 0.22 + 'px' }} data={this.state.monthData} xAxis={this.state.monthAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={8}>
                <Panel
                  loading={this.state.LineChartLoading}
                  style={{ height: this.state.height * 0.25 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-qi"}></use>
                  </svg>&nbsp;&nbsp;<span>本学期概览</span></div>} >
                  {
                    this.state.termData.length ?
                      <LineChart color='#32bac5' number={this.state.termNumber} type={2} style={{ height: this.state.height * 0.22 + 'px' }} data={this.state.termData} xAxis={this.state.termAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
            </Row>

            <Row gutter={8} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', marginBottom: '30px' }}>
              <Col span={2}>
                <div className='xt-checked'>
                  {
                    checked.map((item, index) => (
                      <div
                        onClick={this.checked.bind(this, index)}
                        key={'index' + index}
                        style={this.state.checked === index + 1 ? { background: '#31a9ff', color: '#fff' } : { background: '#013341', color: '#376b79' }}
                      >
                        {item}
                      </div>
                    ))
                  }
                </div>
              </Col>
              <Col span={8}>
                <div className='xt-rank-title'>
                  <span>出勤排行</span>&nbsp;&nbsp;
                  <span className='xt-sort' onClick={this.attOrder}>
                    <Icon style={this.state.attOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.attOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel loading={this.state.attLoading} style={{ height: this.state.height * 0.25 + 'px' }}>
                  {
                    this.state.attData.length ?
                      <BarChartSimple color='#783ec8' number={this.state.attNumber} type={2} style={{ height: this.state.height * 0.25 + 'px' }} max={'100%'} data={this.state.attData} xAxis={this.state.attAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={7}>
                <div className='xt-rank-title'>
                  <span>课程热度</span>&nbsp;&nbsp;
                <span className='xt-sort' onClick={this.courOrder}>
                    <Icon style={this.state.courOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.courOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel loading={this.state.courLoading} style={{ height: this.state.height * 0.25 + 'px' }}>
                  {
                    this.state.courData.length ?
                      <BarChartSimple color='#2abd80' number={this.state.courNumber} type={2} max={'100%'} style={{ height: this.state.height * 0.25 + 'px' }} data={this.state.courData} xAxis={this.state.courAxis} />
                      :
                      <div style={{ height: '200px' }} className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={7}>
                <div className='xt-rank-title'>
                  <span>教师热度</span>&nbsp;&nbsp;
                  <span className='xt-sort' onClick={this.teaOrder}>
                    <Icon style={this.state.teaOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.teaOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel loading={this.state.teaLoading} style={{ height: this.state.height * 0.25 + 'px' }}>
                  {
                    this.state.teaData.length ?
                      <BarChartSimple style={{ height: this.state.height * 0.25 + 'px' }} number={this.state.teaNumber} type={2} max='100%' data={this.state.teaData} xAxis={this.state.teaAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
            </Row>
          </div>
          <VisualMenu />
        </div>
      </div>
    );
  }
}

export default ClassroomStu;

