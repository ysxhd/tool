/*
 * @Author: JC.liu 
 * @Date: 2018-05-16 09:30:44 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-24 10:46:43
 * 总览 - 设备情况模块
 */
import '../../css/equipment_condition.css';
import React, { Component, PropTypes } from 'react'
import { SVG } from '../common';
import { Progress, Spin, Row, Col } from 'antd';
import { Pie_Echarts } from './index'
import { G, _x } from '../../js/index';
const ajax = _x.util.request.request;

const initState = {
  loading1: false,
  loading2: false,
  loading3: false,
  status: ["正常", "软件异常", "硬件异常", "数据异常", "其他异常", "巡查"],
  item1: {
    percent: 0,
    allEquipNum: 0,
    useEquipNum: 0,
  },
  item2: {
    percent: 0,
    allEquipNum: 0,
    useEquipNum: 0,
  },
  item3: {
    percent: 0,
    normal: 0,
    software: 0,
    hardware: 0,
    data: 0,
    other: 0,
    noInspection: 0,
  }
}

export class Equipment_Condition extends Component {
  constructor() {
    super();
    this.state = {
      loading1: false,
      loading2: false,
      loading3: false,
      status: ["正常", "软件异常", "硬件异常", "数据异常", "其他异常", "巡查"],
      item1: {
        percent: 0,
        allEquipNum: 0,
        useEquipNum: 0,
      },
      item2: {
        percent: 0,
        allEquipNum: 0,
        useEquipNum: 0,
      },
      item3: {
        percent: 0,
        normal: 0,
        software: 0,
        hardware: 0,
        data: 0,
        other: 0,
        noInspection: 0,
      }
    }
  }

  componentWillReceiveProps(p) {
    console.log("props", p);
    this.getData(p.curOrgcode.value, p.curExamid.id)
  }

  getData(orgcode, id) {
    let state = this.state
    this.setState({
      loading1: true,
      loading2: true,
      loading3: true
    })
    ajax("equipment_situation", {
      "orgcode": orgcode,
      "id": id
    },
      (res) => {
        if (res.result && res.data) {
          var data = res.data;
          state.loading1 = false
          state.loading2 = false
          state.loading3 = false
          state.item1 = {
            percent: data.gatherStartRate,//身份采集设备使用率 
            allEquipNum: data.gatherTotalNum,
            useEquipNum: data.gatherStartNum,
          },
            state.item2 = {
              percent: data.identityStartRate,
              allEquipNum: data.identityTotalNum,
              useEquipNum: data.identityStartNum,
            },
            state.item3 = {
              percent: data.inspectionRate,    // 巡检进度
              normal: data.normal,             //"正常",
              software: data.softwareException,// "软件异常",
              hardware: data.hardwareException,//"硬件异常",
              data: data.dataException,        // '数据异常',
              other: data.otherException,      // "其他异常",
              noInspection: data.noInspection, // "未巡检",
            }
          this.setState({ ...state })

        } else {
          this.setState({
            ...initState
          })
        }
      })
  }

  render() {
    return (
      <div className="ljc-overview-equipment-wrap" >
        <div className="ljc-overview-equipment" >
          <div className="ljc-o-tit" >
            <span>设备情况</span>
          </div >
          <div className="ljc-o-p-body">
            <Row key="1" >
              <Col span={16}>
                <div className="ljc-o-p-left" >
                  {/* 身份采集设备 */}
                  <div className="ljc-o-p-item1" >
                    <Spin spinning={this.state.loading1} >
                      <p><SVG type="collectDev" width="40px" height="40px" />&nbsp;&nbsp;身份采集设备</p>
                      <div className="ljc-o-p-static" >
                        <span className="ljc-o-p-1-allEquipNum" >{this.state.item1.allEquipNum}</span>&nbsp;&nbsp;台
                      <div className="ljc-o-p-1-point" ></div>
                        <span className="ljc-o-p-1-useEquipNum" >已启用：{this.state.item1.useEquipNum}</span>台
                    </div>
                      <div className="ljc-o-p-progress">
                        已启率&nbsp;&nbsp;&nbsp;&nbsp;<Progress percent={this.state.item1.percent} status="active" />
                      </div>
                    </Spin>
                  </div>
                  {/* 身份验证设备 */}
                  <div className="ljc-o-p-item1 ljc-o-p-item2" >
                    <Spin spinning={this.state.loading2} >
                      <p><SVG type="validateDev" width="40px" height="40px" />&nbsp;&nbsp;身份验证设备</p>
                      <div className="ljc-o-p-static" >
                        <span className="ljc-o-p-1-allEquipNum" >{this.state.item2.allEquipNum}</span>&nbsp;&nbsp;台
                    <div className="ljc-o-p-1-point" ></div>
                        <span className="ljc-o-p-1-useEquipNum" >已启用：{this.state.item2.useEquipNum}</span>台
                  </div>
                      <div className="ljc-o-p-progress" >
                        已启率&nbsp;&nbsp;&nbsp;&nbsp;<Progress percent={this.state.item2.percent} status="active" />
                      </div>
                    </Spin>
                  </div>
                  <div className="ljc-o-p-left-tit">建设和启用情况</div>
                </div>
              </Col>
              <Col span={8} >
                {/* echarts 统计图 */}
                <div className="ljc-o-p-item3"  >
                  <Spin spinning={this.state.loading3} >
                    <div className="ljc-o-p-e" >
                      <Pie_Echarts type="1" echartsData={this.state.item3} />
                    </div>
                    <div className="ljc-o-p-item3-ul" >
                      <ul>
                        {
                          this.state.status.map((item, index) => (
                            <li key={index} className={`ljc-o-p-item3-li ljc-o-p-item3-li${index}`}><div></div>{item}</li>
                          ))
                        }
                      </ul>
                      <div className="ljc-o-p-progress">
                        巡查进度&nbsp;&nbsp;&nbsp;&nbsp;<Progress percent={this.state.item3.percent} status="active" />
                      </div>
                    </div>
                  </Spin>
                  <div className="ljc-o-p-item3-tit" >
                    设备巡查情况
                  </div>
                </div>
              </Col>

            </Row>
          </div>
        </div>
      </div>
    )
  }
}