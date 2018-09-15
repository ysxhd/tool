/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:01:04 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-13 16:09:22
 * 可视化中心-课堂秩序
 */

import React from 'react';
import '../../css/sh_classroomDis.css';
import LineChart from '../components/visual/line_chart';
import BarChartSimple from '../components/visual/bar_chart_simple';
import { Row, Col, Table, Icon } from 'antd';
import { Panel, SVG } from './../common';
import { VisualTop, VisualMenu } from './../components/base/visual';
import _x from '../../js/_x/index';
import './../../css/scrollTable.css';
import G from '../../js/g';

let loopkey;

class ClassroomDis extends React.Component {
  state = {
    courseNum: 0,             //今日总览——课堂分数
    unusualNum: 0,             //今日总览——异常分数
    disciplinePoints: 0,             //今日总览——违纪扣分分数
    data: [],             //今日违纪数据
    todayRole: 1,         //今日违纪角色；学生：1，教师：2
    rankRole: 1,         //今日违纪角色；学生：1，教师：2
    checked: 1,            //选择时间。1：本周，2：本月，3：本学期
    orgOrder: 0,                //教学机构违纪扣分排行;1表示升序，0表示降序
    typeOrder: 0,                //违纪类型次数排行;1表示升序，0表示降序
    teaOrder: 0,                //教师违纪扣分排行;1表示升序，0表示降序
    todayAllNull: false,           //有无今日总览数据
    weekData: [],                //本周概览数据
    monthData: [],                //本月概览数据
    termData: [],                //本学期概览数据
    weekAxis: [],                //本周横坐标
    monthAxis: [],                //本月横坐标
    termAxis: [],                //本学期横坐标
    orgData: [],                //教学机构违纪扣分排行数据
    teaData: [],                //教师违纪扣分排行数据
    typeData: [],                //违纪类型次数排行数据
    orgAxis: [],                //教学机构违纪扣分排行横坐标
    teaAxis: [],                //教师违纪扣分排行横坐标
    typeAxis: [],                //违纪类型次数排行横坐标
    attData: [],
    monthLoading: false,
    termLoading: false,
    weekLoading: false,
    overviewLoading: false,
    orgLoading: false,
    typeLoading: false,
    overviewLoading: false,
    todayDisLoading: false,
    height: 0
  }

  componentDidMount() {
    this.req();
    this.size();
    window.addEventListener('resize', this.size);
  }

  req = () => {
    this.require();
    this.todayDis();
    this.teaData();
    this.orgData();
    this.typeData();
  }

  size = () => {
    this.setState({ clientHeight: this.dis.clientHeight });
  }

  require = () => {
    this.setState({ overviewLoading: true, weekLoading: true, monthLoading: true, termLoading: true })
    //今日总览数据请求
    _x.util.request.request(
      'api/web/classroom_order/get_today_overview',
      {}
      , (res) => {
        this.setState({ overviewLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({
              courseNum: res.data.courseNum,
              disciplinePoints: res.data.disciplinePoints,
              unusualNum: res.data.unusualNum,
            })
          } else {
            this.setState({ todayAllNull: true })
          }
        }
      }).catch(() => {
        this.setState({ overviewLoading: false })
      })
    //本周概览数据
    _x.util.request.request(
      'api/web/classroom_order/get_overview_week',
      {}
      , (res) => {
        this.setState({ weekLoading: false })
        if (res.result) {
          if (res.data) {
            let weekData = [], weekAxis = [], weekNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              weekData.push(res.data[i].yData);
              weekAxis.push('周' + _x.util.number.toChinese(res.data[i].xData));
              weekNumber.push(res.data[i].totalNum)
            }
            this.setState({ weekData, weekAxis, weekNumber })
          }
        }
      }).catch(() => {
        this.setState({ weekLoading: false })
      })
    //本月概览数据
    _x.util.request.request(
      'api/web/classroom_order/get_overview_month',
      {}
      , (res) => {
        this.setState({ monthLoading: false })
        if (res.result) {
          if (res.data) {
            let monthData = [], monthAxis = [], monthNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              monthData.push(res.data[i].yData)
              monthAxis.push('第' + res.data[i].xData + '周')
              monthNumber.push(res.data[i].totalNum)
            }
            this.setState({ monthData, monthAxis, monthNumber })
          }
        }
      }).catch(() => {
        this.setState({ monthLoading: false })
      })
    //本学期概览数据
    _x.util.request.request(
      'api/web/classroom_order/get_overview_semester',
      {}
      , (res) => {
        this.setState({ termLoading: false })
        if (res.result) {
          if (res.data) {
            let termData = [], termAxis = [], termNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              termData.push(res.data[i].yData);
              termAxis.push(res.data[i].xData + '月');
              termNumber.push(res.data[i].totalNum)
            }
            this.setState({ termData, termAxis, termNumber })
          }
        }
      }).catch(() => {
        this.setState({ termLoading: false })
      })
  }

  todayDis = () => {
    //今日违纪数据请求
    this.setState({ todayDisLoading: true })
    _x.util.animation.remove(loopkey);
    _x.util.request.request(
      'api/web/classroom_order/get_today_violation',
      { type: this.state.todayRole }
      , (res) => {
        this.setState({ todayDisLoading: false })
        if (res.result) {
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].eventName = res.data[i].eventName.split(',');
              if (res.data[i].eventName.length > 2) {
                res.data[i].eventName = res.data[i].eventName.slice(0, 2);
                res.data[i].eventName.join(',');
                res.data[i].eventName = res.data[i].eventName + '...';
              }
            }
            this.setState({ data: res.data });
            if (res.data.length > 4) {
              this.handleScroll();
            } else {
              setTimeout(() => {
                this.req();
              }, 300000);
            }
          } else {
            setTimeout(() => {
              this.req();
            }, 300000);
          }
        }
      }).catch(() => {
        this.setState({ todayDisLoading: false })
      })
  }

  orgData = () => {
    //教学机构违纪扣分排行数据
    this.setState({ orgLoading: true })
    _x.util.request.request(
      'api/web/classroom_order/get_org_rank',
      {
        type: this.state.checked,
        order: this.state.orgOrder
      }
      , (res) => {
        this.setState({ orgLoading: false })
        if (res.result) {
          if (res.data) {
            let orgData = [], orgAxis = [], orgNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              orgData.push(res.data[i].yData);
              orgNumber.push(res.data[i].totalNum)
              orgAxis.push(res.data[i].xData);
            }
            this.setState({ orgData, orgAxis, orgNumber })
          }
        }
      }).catch(() => {
        this.setState({ orgLoading: false })
      })
  }

  teaData = () => {
    //教师违纪扣分排行数据
    this.setState({ teaLoading: true })
    _x.util.request.request(
      'api/web/classroom_order/get_teacher_rank',
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
              teaData.push(res.data[i].yData);
              teaAxis.push(res.data[i].xData);
              teaNumber.push(res.data[i].totalNum)
            }
            this.setState({ teaData, teaAxis, teaNumber })
          }
        }
      }).catch(() => {
        this.setState({ teaLoading: false })
      })
  }

  typeData = () => {
    //违纪类型次数排行数据
    this.setState({ typeLoading: true })
    _x.util.request.request(
      'api/web/classroom_order/get_discipline_type_rank',
      {
        type: this.state.checked,
        order: this.state.typeOrder,
        role: this.state.rankRole
      }
      , (res) => {
        this.setState({ typeLoading: false })
        if (res.result) {
          if (res.data) {
            let typeData = [], typeAxis = [], typeNumber = [];
            for (let i = 0; i < res.data.length; i++) {
              typeData.push(res.data[i].yData);
              typeAxis.push(res.data[i].xData);
              typeNumber.push(res.data[i].totalNum)
            }
            this.setState({ typeData, typeAxis, typeNumber })
          }
        }
      }).catch(() => {
        this.setState({ typeLoading: false })
      })
  }

  //教学机构违纪扣分排行
  orgOrder = () => {
    if (this.state.orgOrder === 1) {
      this.setState({ orgOrder: 0 }, () => this.orgData())
    } else {
      this.setState({ orgOrder: 1 }, () => this.orgData())
    }
  }

  //违纪类型次数排行
  typeOrder = () => {
    if (this.state.typeOrder === 1) {
      this.setState({ typeOrder: 0 }, () => this.typeData())
    } else {
      this.setState({ typeOrder: 1 }, () => this.typeData())
    }
  }

  //教师违纪扣分排行
  teaOrder = () => {
    if (this.state.teaOrder === 1) {
      this.setState({ teaOrder: 0 }, () => this.teaData())
    } else {
      this.setState({ teaOrder: 1 }, () => this.teaData())
    }
  }

  //时间切换
  checked = (index) => {
    this.setState({ checked: index + 1 }, () => {
      this.teaData();
      this.orgData();
      this.typeData();
    })
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

  componentWillUnmount() {
    _x.util.animation.remove(loopkey);
    window.removeEventListener('resize', this.size)
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
        name: <div>违纪<br />扣分</div>,
        score: this.state.disciplinePoints>999?'999+':this.state.disciplinePoints,
        background: '#d37f2d'
      },
    ];

    //日期切换
    const checked = ['本周', '本月', '本学期'];
    return (
      <div className='lxx-g-showCenter xt-classroom-dis xt-clearfix' ref={(dis) => this.dis = dis}>
        <VisualTop curVisMenu="课堂秩序" />
        <div className='zq-g-visBox'>
          <div className='zq-g-visContent'>
            <Row gutter={10}>
              <Col span={8}>
                <Panel
                  loading={this.state.overviewLoading}
                  style={{ height: this.state.clientHeight * 0.27 + 'px' }}
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
                              <div className='xt-today-sroce'>{item.score}</div>
                            </div>
                          ))
                        }
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={16}>
                <Panel
                  loading={this.state.todayDisLoading}
                  style={{ height: this.state.clientHeight * 0.27 + 'px' }}
                  className='xt-classroom-dis-table'
                  title={<div>
                    <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                      <use xlinkHref={"#icon-jrwj"}></use>
                    </svg>&nbsp;&nbsp;<span>今日违纪</span>
                    <div className='xt-stu-tea'>
                      <span style={{ background: this.state.todayRole === 1 ? '#31a9ff' : '' }} onClick={() => this.setState({ todayRole: 1 }, () => this.todayDis())}>学生</span>
                      <span style={{ background: this.state.todayRole === 2 ? '#31a9ff' : '' }} onClick={() => this.setState({ todayRole: 2 }, () => this.todayDis())}>教师</span>
                    </div>
                  </div>} >
                  {
                    this.state.data.length ?
                      <div className='zq-comn-table'>
                        <ul>
                          <li>时间</li>
                          <li>课程</li>
                          <li>教师</li>
                          <li>{G.isVer?'教室':'班级'}</li>
                          <li>违纪事件</li>
                        </ul>
                        <table ref={re => this.teaTable = re} onMouseEnter={this.handleStop}
                          onMouseLeave={this.handleStart} className='zq-slds-table'>
                          <tbody ref={re => this.teaTableChild = re}>
                            {
                              this.state.data.map((item, i) => {
                                return <tr key={i}>
                                  <td><span>第{_x.util.number.toChinese(item.section)}节</span></td>
                                  <td><span>{item.courseName}</span></td>
                                  <td><span>{item.teacherName}</span></td>
                                  <td><span>{item.className}</span></td>
                                  <td><span>{item.eventName}</span></td>
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
                  loading={this.state.weekLoading}
                  style={{ height: this.state.clientHeight * 0.23 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-week"}></use>
                  </svg>&nbsp;&nbsp;<span>本周概览</span></div>} >
                  {
                    this.state.weekData.length ?
                      <LineChart color='#b9c2bf' type={1} style={{ height: this.state.clientHeight * 0.2 + 'px' }} number={this.state.weekNumber} data={this.state.weekData} xAxis={this.state.weekAxis} />
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
                  loading={this.state.monthLoading}
                  style={{ height: this.state.clientHeight * 0.23 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-month"}></use>
                  </svg>&nbsp;&nbsp;<span>本月概览</span></div>} >
                  {
                    this.state.monthData.length ?
                      <LineChart style={{ height: this.state.clientHeight * 0.2 + 'px' }} type={1} number={this.state.monthNumber} color='#783ec8' data={this.state.monthData} xAxis={this.state.monthAxis} />
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
                  loading={this.state.termLoading}
                  style={{ height: this.state.clientHeight * 0.23 + 'px' }}
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-qi"}></use>
                  </svg>&nbsp;&nbsp;<span>本学期概览</span></div>} >
                  {
                    this.state.termData.length ?
                      <LineChart style={{ height: this.state.clientHeight * 0.2 + 'px' }} type={1} number={this.state.termNumber} color='#32bac5' data={this.state.termData} xAxis={this.state.termAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
            </Row>

            <Row gutter={10} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px', marginBottom: '30px' }}>
              <Col span={2}>
                <div className='xt-checked'>
                  {
                    checked.map((item, index) => (
                      <div onClick={this.checked.bind(this, index)} key={'index' + index} style={this.state.checked === index + 1 ? { background: '#31a9ff', color: '#fff' } : { background: '#013341', color: '#376b79' }}>{item}</div>
                    ))
                  }
                </div>
              </Col>
              <Col span={8}>
                <div className='xt-rank-title'>
                  <span>教学机构违纪扣分排行</span>
                  &nbsp;&nbsp;
                <span className='xt-sort' onClick={this.orgOrder}>
                    <Icon style={this.state.orgOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.orgOrder === 0 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel
                  loading={this.state.orgLoading}
                  style={{ height: this.state.clientHeight * 0.25 + 'px' }}
                >
                  {
                    this.state.orgData.length ?
                      <BarChartSimple style={{ height: this.state.clientHeight * 0.25 + 'px' }} type={1} number={this.state.orgNumber} data={this.state.orgData} xAxis={this.state.orgAxis} />
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
                  <span>教师违纪扣分排行</span>
                  &nbsp;&nbsp;
                <span className='xt-sort' onClick={this.teaOrder}>
                    <Icon style={this.state.teaOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.teaOrder === 0 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel
                  loading={this.state.teaLoading}
                  style={{ height: this.state.clientHeight * 0.25 + 'px' }}
                >
                  {
                    this.state.teaData.length ?
                      <BarChartSimple style={{ height: this.state.clientHeight * 0.25 + 'px' }} type={1} number={this.state.teaNumber} data={this.state.teaData} xAxis={this.state.teaAxis} />
                      :
                      <div className='xt-noData' style={{ height: '200px' }} >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={7}>
                <div className='xt-rank-title'>
                  <span>违纪类型次数排行</span>
                  &nbsp;&nbsp;
                  <span className='xt-sort' onClick={this.typeOrder}>
                    <Icon style={this.state.typeOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.typeOrder === 0 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                  <div className='xt-stu-tea' style={{ border: 0 }}>
                    <span style={{ background: this.state.rankRole === 1 ? '#31a9ff' : '' }} onClick={() => this.setState({ rankRole: 1 }, () => this.typeData())}>学生</span>
                    <span style={{ background: this.state.rankRole === 2 ? '#31a9ff' : '' }} onClick={() => this.setState({ rankRole: 2 }, () => this.typeData())}>教师</span>
                  </div>
                </div>
                <Panel
                  loading={this.state.typeLoading}
                  style={{ height: this.state.clientHeight * 0.25 + 'px' }}
                >
                  {
                    this.state.typeData.length ?
                      <BarChartSimple style={{ height: this.state.clientHeight * 0.25 + 'px' }} type={3} number={this.state.typeNumber} data={this.state.typeData} xAxis={this.state.typeAxis} />
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

export default ClassroomDis;