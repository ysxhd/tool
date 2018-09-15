/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:01:04 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-13 16:52:46
 * 可视化中心-教师考勤
 */

import React from 'react';
import LineChart from '../components/visual/line_chart';
import BarChartBorder from '../components/visual/bar_chart_border';
import { Row, Col, Table, Icon } from 'antd';
import { Panel, SVG } from './../common';
import { VisualTop, VisualMenu } from './../components/base/visual';
import _x from '../../js/_x/index';
import './../../css/scrollTable.css';

let loopkey1, loopkey2;

class ClassroomTea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseNum: 0,             //今日总览——课堂分数
      unusualNum: 0,             //今日总览——异常分数
      attData: [],          //教师迟到数据
      changeData: [],          //调课换课数据
      checked: 1,            //选择时间。1：本周，2：本月，3：本学期
      order: -1,                //考勤异常类型次数排行;1表示升序，-1表示降序
      aveOrder: 1,                //教师考勤异常次数比例排行排行;1表示升序，-1表示降序
      weekData: [],                //本周考勤异常次数数据
      monthData: [],                //本月考勤异常次数数据
      termData: [],                //本学期考勤异常次数数据
      weekAxis: [],                //本周横坐标
      monthAxis: [],                //本月横坐标
      termAxis: [],                //本学期横坐标
      typeData: [],                //教学机构违纪扣分排行数据
      teaData: [],                //教师违纪扣分排行数据
      typeAxis: [],                //教学机构违纪扣分排行横坐标
      teaAxis: [],                //教师违纪扣分排行横坐标
      attLoading: false,
      changeLoading: false,
      LineChartLoading: false,
      overviewLoading: false,
      teaLoading: false,
      typeLoading: false,
      height: 0,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.require();
      this.tableData(1);
      this.tableData(0);
      this.typeData();
      this.teaData();
    }, 300000);
    this.require();
    this.tableData(1);
    this.tableData(0);
    this.typeData();
    this.teaData();
    this.size();
    window.addEventListener('resize', this.size)
  }

  size = () => {
    this.setState({ height: this.tea.clientHeight })
  }

  require = () => {
    this.setState({ overviewLoading: true, LineChartLoading: true })
    //今日总览数据请求
    _x.util.request.request(
      'api/web/tea_attendence/get_overview',
      {}
      , (res) => {
        this.setState({ overviewLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({
              courseNum: res.data.courseNum,
              unusualNum: res.data.unusualNum,
            })
          } else {
            this.setState({ todayAllNull: true })
          }
        }
      }).catch(() => {
        this.setState({ todayAllNull: true })
        this.setState({ overviewLoading: false })
      })
    //考勤异常次数数据
    _x.util.request.request(
      'api/web/tea_attendence/get_attendence_by_type',
      {}
      , (res) => {
        this.setState({ LineChartLoading: false })
        if (res.result) {
          if (res.data) {
            let weekData = [], weekAxis = [], weekNumber = [];
            let monthData = [], monthAxis = [], monthNumber = [];
            let termData = [], termAxis = [], termNumber = [];
            let week = res.data.week,
              month = res.data.month,
              total = res.data.total;
            for (let i = 0; i < week.length; i++) {
              weekData.push(week[i].number);
              weekAxis.push(('周' + _x.util.number.toChinese(week[i].weekday)));
              weekNumber.push(week[i].coursesNumber);
            }
            for (let j = 0; j < month.length; j++) {
              monthData.push(month[j].number)
              monthAxis.push(('第' + month[j].weeks + '周'))
              monthNumber.push(month[j].coursesNumber);
            }
            for (let k = 0; k < total.length; k++) {
              termData.push(total[k].number);
              termAxis.push((total[k].month + '月'));
              termNumber.push(total[k].coursesNumber);
            }
            this.setState({ weekData, weekAxis, termData, termAxis, monthData, monthAxis, weekNumber, monthNumber, termNumber })
          }
        }
      }).catch(() => {
        this.setState({ LineChartLoading: false })
      })
  }

  tableData = (type) => {
    //教师迟到及调换课
    //type:1——迟到；0——调换课
    if (type === 1) {
      _x.util.animation.remove(loopkey1);
      this.setState({ attLoading: true })
    } else {
      _x.util.animation.remove(loopkey2);
      this.setState({ changeLoading: true })
    }
    _x.util.request.request(
      'api/web/tea_attendence/get_attendence',
      {
        type
      },
      (res) => {
        if (type === 1) {
          this.setState({ attLoading: false })
        } else {
          this.setState({ changeLoading: false })
        }
        if (res.result) {
          if (res.data) {
            if (type === 1) {
              this.setState({ attData: res.data }, () => {
                if (res.data.length > 4) {
                  this.handleScroll(1);
                }
              })
            } else {
              this.setState({ changeData: res.data }, () => {
                if (res.data.length > 4) {
                  this.handleScroll(2);
                }
              })
            }
          }
        }
      }).catch(() => {
        if (type === 1) {
          this.setState({ attLoading: false })
        } else {
          this.setState({ changeLoading: false })
        }
      })
  }

  typeData = () => {
    //考勤异常类型次数排行数据
    this.setState({ typeLoading: true })
    _x.util.request.request(
      'api/web/tea_attendence/get_type_unnormal',
      {
        type: this.state.checked,
        order: this.state.order
      }
      , (res) => {
        this.setState({ typeLoading: false })
        if (res.result) {
          if (res.data) {
            let typeData = [], typeAxis = [],typeNumber=[];
            for (let i = 0; i < res.data.length; i++) {
              typeData.push(res.data[i].number);
              typeAxis.push(res.data[i].typeName);
              typeNumber.push(res.data[i].coursesNumber);
            }
            this.setState({ typeData, typeAxis ,typeNumber})
          }
        }
      }).catch(() => {
        this.setState({ typeLoading: false })
      })
  }

  teaData = () => {
    //教师考勤异常次数比例排行数据
    this.setState({ teaLoading: true })
    _x.util.request.request(
      'api/web/tea_attendence/get_tea_unnormal',
      {
        type: this.state.checked,
        order: this.state.aveOrder
      }
      , (res) => {
        this.setState({ teaLoading: false })
        if (res.result) {
          if (res.data) {
            let teaData = [], teaAxis = [],teaNumber=[];
            for (let i = 0; i < res.data.length; i++) {
              teaData.push(Math.floor(res.data[i].number));
              teaAxis.push(res.data[i].teacherName);
              teaNumber.push(res.data[i].coursesNumber);
            }
            this.setState({ teaData, teaAxis,teaNumber })
          }
        }
      }).catch(() => {
        this.setState({ teaLoading: false })
      })
  }

  //时间切换
  checked = (index) => {
    this.setState({ checked: index + 1 }, () => {
      this.typeData();
      this.teaData();
    })
  }

  //考勤异常类型次数排行
  order = () => {
    if (this.state.order === 1) {
      this.setState({ order: -1 }, () => this.typeData())
    } else {
      this.setState({ order: 1 }, () => this.typeData())
    }
  }

  //教师考勤异常平均次数排行
  aveOrder = () => {
    if (this.state.aveOrder === 1) {
      this.setState({ aveOrder: -1 }, () => this.teaData())
    } else {
      this.setState({ aveOrder: 1 }, () => this.teaData())
    }
  }

  /*滚动*/
  handleScroll = (type) => {
    if (type === 1) {
      loopkey1 = _x.util.animation.add(0.02, false, function () {
        this.teaTable1.scrollTop = this.teaTable1.scrollTop + 2.5;
        if (this.teaTable1.scrollTop >= this.teaTableChild1.offsetHeight - 200) {
          _x.util.animation.remove(loopkey1);
          this.teaTable1.scrollTop = 0;
          this.tableData(1);
        }
      }.bind(this), true);
    } else {
      loopkey2 = _x.util.animation.add(0.02, false, function () {
        this.teaTable2.scrollTop = this.teaTable2.scrollTop + 2.5;
        if (this.teaTable2.scrollTop >= this.teaTableChild2.offsetHeight - 200) {
          _x.util.animation.remove(loopkey2);
          this.teaTable2.scrollTop = 0;
          this.tableData(0);
        }
      }.bind(this), true);
    }
  }

  /*暂停滚动*/
  handleStop = (type) => {
    _x.util.animation.remove(type);
  }

  /*开启滚动*/
  handleStart = (type) => {
    if (type === 1 && this.state.attData.length > 4) {
      this.handleScroll(type);
    } else if (type === 2 && this.state.changeData.length > 4) {
      this.handleScroll(type);
    }
  }

  componentWillUnmount() {
    // alert(121212)
    _x.util.animation.remove(loopkey1);
    _x.util.animation.remove(loopkey2);
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
      },
    ];

    //表格表头
    const columns = [
      {
        dataIndex: 'teacherName',
        key: 'teacherName',
      }, {
        dataIndex: 'courseName',
        key: 'courseName',
        render: (text) => <div>{text.length > 11 ? text.slice(0, 10) + '...' : text}</div>,
      }, {
        dataIndex: 'roomName',
        key: 'roomName',
        render: (text) => {
          let item = [];
          for (let i = 0; i < Math.floor(text.length / 11); i++) {
            item.push(text.slice(i * 11, (i + 1) * 11))
          }
          if ((text.length % 11) > 0) {
            item.push(text.slice(Math.floor(text.length / 11) * 11))
          }
          return <div>
            {
              item.map((item, index) => <div key={'index' + index}>{item}</div>)
            }
          </div>
        },
      },
    ]

    //日期切换
    const checked = ['本周', '本月', '本学期'];
    return (
      <div className='lxx-g-showCenter xt-classroom-dis xt-clearfix xt-classroomTea' ref={(tea) => this.tea = tea}>
        <VisualTop curVisMenu='教师考勤' />
        <div className='zq-g-visBox'>
          <div className='zq-g-visContent'>
            <Row gutter={10}>
              <Col span={6}>
                <Panel
                  loading={this.state.overviewLoading}
                  style={{ height: this.state.height * 0.275 + 'px' }}
                  className='xt-clearfix xt-today'
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-jrzl"}></use>
                  </svg>&nbsp;&nbsp;<span>今日总览</span></div>} >
                  {
                    title.map((item, index) => (
                      <div className='xt-today-item xt-tea-today xt-clearfix' key={'index' + index}>
                        <div className='xt-today-name' style={{ background: item.background }}>{item.name}</div>
                        <div className='xt-today-sroce'>{item.score}</div>
                      </div>
                    ))
                  }
                </Panel>
              </Col>
              <Col span={9}>
                <Panel
                  loading={this.state.attLoading}
                  className='xt-classroom-dis-table'
                  style={{ height: this.state.height * 0.275 + 'px' }}
                  title={<div>
                    教师迟到
                  </div>} >
                  {
                    this.state.attData.length ?
                      <div className='zq-comn-table xt-tea-table'>
                        <table ref={re => this.teaTable1 = re} onMouseEnter={() => this.handleStop(loopkey1)}
                          onMouseLeave={() => this.handleStart(1)} className='zq-stabl-table' >
                          <tbody ref={re => this.teaTableChild1 = re}>
                            {
                              this.state.attData.map((item,index) => {
                                return <tr key={'att'+index}>
                                  <td>{item.teacherName}</td>
                                  <td>{item.courseName}</td>
                                  <td>{item.roomName}</td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table >
                      </div>
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                  {/* <Table
                    id='zq-aa'
                    className='xt-nothead-table'
                    dataSource={this.state.attData}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: false, y: 200 }}
                  /> */}
                </Panel>
              </Col>
              <Col span={9}>
                <Panel
                  loading={this.state.changeLoading}
                  style={{ height: this.state.height * 0.275 + 'px' }}
                  className='xt-classroom-dis-table'
                  title={<div>
                    调课换课
                  </div>} >
                  {
                    this.state.changeData.length ?
                      <div className='zq-comn-table xt-tea-table'>
                        <table ref={re => this.teaTable2 = re} onMouseEnter={() => this.handleStop(loopkey2)}
                          onMouseLeave={() => this.handleStart(2)} className='zq-stabl-table' style={{height:this.state.height * 0.25 + 'px'}}>
                          <tbody ref={re => this.teaTableChild2 = re}>
                            {
                              this.state.changeData.map((item,index) => {
                                return <tr key={'change'+index}>
                                  <td>{item.teacherName}</td>
                                  <td>{item.courseName}</td>
                                  <td>{item.roomName}</td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table >
                      </div>
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                  {/* <Table
                    className='xt-nothead-table'
                    dataSource={this.state.changeData}
                    columns={columns}
                    pagination={false}
                    scroll={{ x: false, y: 200 }}
                  /> */}
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
                  </svg>&nbsp;&nbsp;<span>本周考勤异常次数概览</span></div>} >
                  {
                    this.state.weekData.length ?
                      <LineChart color='#b9c2bf' type={3} number={this.state.weekNumber} style={{ height: this.state.height * 0.21 + 'px' }} data={this.state.weekData} xAxis={this.state.weekAxis} />
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
                  </svg>&nbsp;&nbsp;<span>本月考勤异常次数概览</span></div>} >
                  {
                    this.state.monthData.length ?
                      <LineChart color='#783ec8' type={3} number={this.state.monthNumber} style={{ height: this.state.height * 0.21 + 'px' }} data={this.state.monthData} xAxis={this.state.monthAxis} />
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
                  </svg>&nbsp;&nbsp;<span>本学期考勤异常次数概览</span></div>} >
                  {
                    this.state.termData.length ?
                      <LineChart color='#32bac5' type={3} number={this.state.termNumber} style={{ height: this.state.height * 0.21 + 'px' }} data={this.state.termData} xAxis={this.state.termAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
            </Row>

            <Row gutter={10} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px' }}>
              <Col span={2}>
                <div className='xt-checked'>
                  {
                    checked.map((item, index) => (
                      <div onClick={this.checked.bind(this, index)} key={'index' + index} style={this.state.checked === index + 1 ? { background: '#31a9ff', color: '#fff' } : { background: '#013341', color: '#376b79' }}>{item}</div>
                    ))
                  }
                </div>
              </Col>
              <Col span={11}>
                <div className='xt-rank-title'>
                  <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-ph"}></use>
                  </svg>
                  &nbsp;&nbsp;
                  <span>考勤异常类型次数排行</span>
                  &nbsp;&nbsp;
                  <span className='xt-sort' onClick={this.order}>
                    <Icon style={this.state.order === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.order === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel loading={this.state.typeLoading} style={{ height: this.state.height * 0.25 + 'px' }}>
                  {
                    this.state.typeData.length ?
                      <BarChartBorder type={3} number={this.state.typeNumber} style={{ height: this.state.height * 0.25 + 'px' }} color='#d3582d' data={this.state.typeData} xAxis={this.state.typeAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={11}>
                <div className='xt-rank-title'>
                  <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-ph"}></use>
                  </svg>
                  &nbsp;&nbsp;
                  <span>教师考勤异常次数比例排行</span>
                  &nbsp;&nbsp;
                  <span className='xt-sort' onClick={this.aveOrder}>
                    <Icon style={this.state.aveOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                    <Icon style={this.state.aveOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                  </span>
                </div>
                <Panel loading={this.state.teaLoading} style={{ height: this.state.height * 0.25 + 'px' }}>
                  {
                    this.state.teaData.length ?
                      <BarChartBorder type={4} max={'100%'} number={this.state.teaNumber} style={{ height: this.state.height * 0.25 + 'px' }} color='#d3582d' data={this.state.teaData} xAxis={this.state.teaAxis} />
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

export default ClassroomTea;