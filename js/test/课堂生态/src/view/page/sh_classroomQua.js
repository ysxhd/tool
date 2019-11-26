/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:01:04 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-13 16:13:08
 * 可视化中心-课堂质量
 */

import React from 'react';
import '../../css/sh_classroomQua.css';
import LineChart from '../components/visual/line_chart';
import BarChartBorder from '../components/visual/bar_chart_border';
import { Row, Col, Table, Icon } from 'antd';
import { Panel, SVG } from './../common';
import { VisualTop, VisualMenu } from './../components/base/visual';
import { lang } from 'moment';
import _x from '../../js/_x/index';
import './../../css/scrollTable.css';

let loopkey;

class ClassroomQua extends React.Component {
  state = {
    researchScore: 0,             //教研总览——教研评分
    researchCount: 0,             //教研总览——教研课数
    data: [],
    goalOrder: -1,                //教师教研评分排行;1表示升序，-1表示降序
    teaOrder: -1,                //评分项得分比例排行;1表示升序，-1表示降序
    allNull: false,              //教研总览是否有数据
    goalData: [],                //
    goalAxis: [],                //
    teaData: [],               //
    teaAxis: [],               //
    viewLoading: false,
    listLoading: false,
    teaLoading: false,
    goalLoading: false,
    height: 0,
    attdate: [],
    noScroll: true
  }

  componentDidMount() {
    this.req();
    this.size();
    window.addEventListener("resize", this.size);
    // if (this.state.noScroll) {
    //   setTimeout(() => {
    //     this.require();
    //     this.tableData();
    //     this.teaData();
    //     this.goalData();
    //   }, 3000);
    // }

  }

  req = () => {
    this.require();
    this.tableData();
    this.teaData();
    this.goalData();
  }

  componentWillUnmount() {
    _x.util.animation.remove(loopkey);
    window.removeEventListener('resize', this.size);
  }

  size = () => {
    this.setState({ height: this.qua.clientHeight })
  }

  require = () => {
    //教研总览数据请求
    this.setState({ viewLoading: true, listLoading: true })
    _x.util.request.request(
      'api/web/research_statistics/research_view',
      {}
      , (res) => {
        this.setState({ viewLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({
              researchCount: res.data.researchCount,
              researchScore: res.data.researchScore,
            })
          } else {
            this.setState({ allNull: true })
          }
        }
      }).catch(() => {
        this.setState({ viewLoading: false })
      })
  }

  /*今日教研课*/
  tableData = () => {
    _x.util.animation.remove(loopkey);
    _x.util.request.request(
      'api/web/research_statistics/today_research_list',
      {}
      , (res) => {
        this.setState({ listLoading: false })
        if (res.result) {
          if (res.data) {
            this.setState({ data: res.data });
            if (res.data.length > 7) {
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
        this.setState({ listLoading: false })
      })
  }

  teaData = () => {
    //教研总览数据请求
    this.setState({ teaLoading: true })
    _x.util.request.request(
      'api/web/research_statistics/teacher_score_rank',
      {
        order: this.state.teaOrder
      }
      , (res) => {
        this.setState({ teaLoading: false })
        if (res.result) {
          if (res.data) {
            if (res.data) {
              let teaData = [], teaAxis = [],teaNumber=[];
              for (let i = 0; i < res.data.length; i++) {
                teaData.push(res.data[i].score);
                teaAxis.push(res.data[i].teacher);
                teaNumber.push(res.data[i].ccount);
              }
              this.setState({ teaData, teaAxis,teaNumber })
            }
          }
        }
      }).catch(() => {
        this.setState({ teaLoading: false })
      })
  }

  goalData = () => {
    //教研总览数据请求
    this.setState({ goalLoading: true })
    _x.util.request.request(
      'api/web/research_statistics/big_subitem_rank',
      {
        order: this.state.goalOrder
      }
      , (res) => {
        this.setState({ goalLoading: false })
        if (res.result) {
          if (res.data) {
            if (res.data) {
              let goalData = [], goalAxis = [],goalNumber=[];
              for (let i = 0; i < res.data.length; i++) {
                goalData.push(res.data[i].ratio);
                goalAxis.push(res.data[i].evaluateModelName);
                goalNumber.push(res.data[i].schoolAvg);                
              }
              this.setState({ goalData, goalAxis,goalNumber })
            }
          }
        }
      }).catch(() => {
        this.setState({ goalLoading: false })
      })
  }

  //教师教研评分排行
  teaOrder = () => {
    if (this.state.teaOrder === 1) {
      this.setState({ teaOrder: -1 })
    } else {
      this.setState({ teaOrder: 1 })
    }
  }

  //评分项得分比例排行
  goalOrder = () => {
    if (this.state.goalOrder === 1) {
      this.setState({ goalOrder: -1 })
    } else {
      this.setState({ goalOrder: 1 })
    }
  }

  /*滚动*/
  handleScroll = () => {
    loopkey = _x.util.animation.add(0.02, false, function () {
      this.teaTable.scrollTop = this.teaTable.scrollTop + 2.5;
      if (this.teaTable.scrollTop >= this.teaTableChild.offsetHeight - 293) {
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
    if (this.state.data.length > 7) {
      this.handleScroll();
    }
  }

  render() {
    //今日总览
    const title = [
      {
        name: '教研评分',
        score: this.state.researchScore,
        background: '#2abd80'
      }, {
        name: '教研课数',
        score: this.state.researchCount,
        background: '#32bac5'
      },
    ];

    //表格表头
    const columns = [
      {
        title: '时间',
        dataIndex: 'order',
        key: 'order',
        width: '25%',
      }, {
        title: '课程',
        dataIndex: 'course',
        key: 'course',
        width: '25%',
        render: (text) => <div>{text.length > 11 ? text.slice(0, 10) + '...' : text}</div>,
      }, {
        title: '教师',
        width: '25%',
        dataIndex: 'teacher',
        key: 'teacher',
      }, {
        title: '状态',
        width: '25%',
        dataIndex: 'states',
        key: 'states',
        render: text => <div style={{ width: '100%', paddingLeft: 'calc(50% - 25px)' }}>
          <div style={text === '已结束' ? { color: '#475363', background: '#273241', width: '60px', textAlign: 'center' } :
            text === '进行中' ? { color: '#1ed4e3', background: '#134347', width: '60px', textAlign: 'center' } :
              { color: '#fff', background: '#273241', width: '60px', textAlign: 'center' }}>{text}</div>
        </div>
      },
    ]
    return (
      <div className='xt-classroom-qua lxx-g-showCenter' ref={(qua) => this.qua = qua}>
        <VisualTop curVisMenu="课堂质量" />
        <div className='zq-g-visBox'>
          <div className='zq-g-visContent'>
            <Row gutter={10}>
              <Col span={12}>
                <Panel
                  loading={this.state.viewLoading}
                  style={{ height: this.state.height * 0.4 + 'px' }}
                  className='xt-clearfix xt-qua-item'
                  title={<div><svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                    <use xlinkHref={"#icon-jrzl"}></use>
                  </svg>&nbsp;&nbsp;<span>教研总览</span></div>} >
                  {
                    this.state.allNull ?
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                      :
                      <div>
                        {
                          title.map((item, index) => (
                            <div className='xt-tea-res-item xt-clearfix' key={'index' + index}>
                              <div className='xt-tea-res-name' style={{ background: item.background }}>{item.name}</div>
                              <div className='xt-tea-res-sroce'>{item.score}</div>
                            </div>
                          ))
                        }
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={12}>
                <Panel
                  loading={this.state.listLoading}
                  className='xt-classroom-dis-table xt-qua-item'
                  style={{ height: this.state.height * 0.4 + 'px' }}
                  title={<div>
                    <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                      <use xlinkHref={"#icon-jrwj"}></use>
                    </svg>&nbsp;&nbsp;<span>今日教研课</span>
                  </div>} >
                  {
                    this.state.data.length ?
                      <div className='zq-comn-table'>
                        <ul>
                          <li>时间</li>
                          <li>课程</li>
                          <li>教师</li>
                          <li style={{ flex: "0.8" }}>状态</li>
                        </ul>
                        <table ref={re => this.teaTable = re} onMouseEnter={this.handleStop}
                          onMouseLeave={this.handleStart} className='zq-crq-table'>
                          <tbody ref={re => this.teaTableChild = re}>
                            {
                              this.state.data.map((item, i) => {
                                return <tr key={i}>
                                  <td><span>第{_x.util.number.toChinese(item.order)}节</span></td>
                                  <td><span>{item.course}</span></td>
                                  <td><span>{item.teacher}</span></td>
                                  {
                                    item.states === '已结束' ?
                                      <td><span className='end'>{item.states}</span></td> :
                                      (
                                        item.states === '未开始' ?
                                          <td><span className='nostart'>{item.states}</span></td> :
                                          <td><span className='ing'>{item.states}</span></td>
                                      )
                                  }
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
                      //   scroll={{ x: false, y: 293 }}
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
              <Col span={12}>
                <Panel
                  loading={this.state.teaLoading}
                  style={{ height: this.state.height * 0.4 + 'px' }}
                  className='xt-clearfix xt-qua-item'
                  title={<div>
                    <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                      <use xlinkHref={"#icon-ph"}></use>
                    </svg>
                    &nbsp;&nbsp;
                    <span>教师教研评分排行</span>
                    &nbsp;&nbsp;
                    <span className='xt-sort' onClick={this.teaOrder}>
                      <Icon style={this.state.teaOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                      <Icon style={this.state.teaOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                    </span>
                  </div>} >
                  {
                    this.state.teaData.length ?
                      <BarChartBorder type={1} number={this.state.teaNumber} style={{ height: this.state.height * 0.36 + 'px' }} color='#30c3da' data={this.state.teaData} xAxis={this.state.teaAxis} />
                      :
                      <div className='xt-noData' >
                        <img src={require('../../img/nodata2.png')} alt='' />
                        <div>暂无数据</div>
                      </div>
                  }
                </Panel>
              </Col>
              <Col span={12}>
                <Panel
                  loading={this.state.goalLoading}
                  style={{ height: this.state.height * 0.4 + 'px' }}
                  className='xt-qua-item'
                  title={<div>
                    <svg className="icon hf-mmapi-icon" color='#00f3f1' aria-hidden="true">
                      <use xlinkHref={"#icon-ph"}></use>
                    </svg>
                    &nbsp;&nbsp;
                    <span>评分项得分比例排行</span>
                    &nbsp;&nbsp;
                    <span className='xt-sort' onClick={this.goalOrder}>
                      <Icon style={this.state.goalOrder === 1 ? { color: '#3498db' } : {}} type="caret-up" />
                      <Icon style={this.state.goalOrder === -1 ? { color: '#3498db' } : {}} type="caret-down" />
                    </span>
                  </div>} >
                  {
                    this.state.goalData.length ?
                      <BarChartBorder type={2} number={this.state.goalNumber} max='100%' style={{ height: this.state.height * 0.36 + 'px' }} color='#d3b62d' data={this.state.goalData} xAxis={this.state.goalAxis} />
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

export default ClassroomQua;