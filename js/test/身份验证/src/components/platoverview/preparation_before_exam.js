/*
 * @Author: JC.liu 
 * @Date: 2018-05-16 09:32:19 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-23 21:44:51
 * 总览 - 考前准备模块
 */
import '../../css/preparation_before_exam.css'
import React, { Component, PropTypes } from 'react'
import { Spin } from 'antd'
import { SVG } from '../common';
import { G, _x } from '../../js/index';
const ajax = _x.util.request.request;

export class Preparetion_Before_Exam extends Component {
  constructor() {
    super();
    this.state = {
      allPercent: ['', '', '', '', '', '', '', '', '', ''],
      loading1: false,
      loading2: false,
      loading3: false,
      item1: {
        colletion: 0,
        AllColletion: 0,
        percentInt: 0,
        percent: 0,
      },
      item2: {
        useExamNum: 0,
        AllExamNum: 0,
        percentInt: 0,
        percent: 0,
      },
      item3: {
        useExaminee: 0,
        AllExaminee: 0,
        percentInt: 0,
        percent: 0,
      }
    }
    this.examName = ""
  }

  componentWillReceiveProps(p) {
    if (this.props.curExamid) {
      this.getData(p.curOrgcode.value, p.curExamid.id)
        this.examName= p.curExamid.name
    }
  }

  getData(orgcode, id) {
    let state = this.state
    this.setState({
      loading1: true,
      loading2: true,
      loading3: true,
    })
    ajax("test_preparation", {
      "orgcode": orgcode,//机构id
      "id": id//考试计划id
    }, (res) => {
      if (res.result && res.data) {
        var data = res.data;
        state.loading1 = false
        state.loading2 = false
        state.loading3 = false
        state.item1 = {
          colletion: data.collectNum, //已采集人数
          AllColletion: data.totalNum,//总报考人数
          percent: data.collectRate,//采集进度
          percentInt: Math.round((data.collectNum / data.totalNum).toFixed(4) * 10)
        },
          state.item2 = {
            useExamNum: data.issueTestNum,//应下发考点数
            AllExamNum: data.testNum, //已下发考点数
            percent: data.issueTestRate,//下发考点进度 
            percentInt: Math.round((data.issueTestNum / data.testNum).toFixed(4) * 10)
          },
          state.item3 = {
            useExaminee: data.issueExamineeNum,  //已下发考生数
            AllExaminee: data.examineeNum, //应下发考生数
            percent: data.issueExamineeRate, //下发考生进度
            percentInt: Math.round((data.issueExamineeNum / data.examineeNum).toFixed(4) * 10)
          }
        this.setState({
          ...state,
        })

      } else {
        this.setState({
          allPercent: ['', '', '', '', '', '', '', '', '', ''],
          loading1: false,
          loading2: false,
          loading3: false,
          item1: {
            colletion: 0,
            AllColletion: 0,
            percentInt: 0,
            percent: 0,
          },
          item2: {
            useExamNum: 0,
            AllExamNum: 0,
            percentInt: 0,
            percent: 0,
          },
          item3: {
            useExaminee: 0,
            AllExaminee: 0,
            percentInt: 0,
            percent: 0,
          }
        })
      }
    })
  }

  render() {
    return (
      <div className="ljc-overview-before">
        <div className="ljc-o-b-head" >
          <div className="ljc-o-b-h-l" >考前准备</div>
          <div className="ljc-o-b-h-r" >{this.examName}</div>
        </div>
        <div className="ljc-o-b-body" >
          <div className="ljc-o-b-item ljc-o-b-item1">
            <div className="ljc-o-b-auto" >
              <Spin spinning={this.state.loading1}>
                <div className="ljc-o-b-item-row1 ljc-o-b-i1-row1" >
                  <span>已采集人数</span>
                  /已报考人数：
                  <span>{this.state.item1.colletion}</span>
                  &nbsp;/&nbsp;{this.state.item1.AllColletion}
                </div>
                <div className="ljc-o-b-item-row2 ljc-o-b-i1-row2" >采集进度：</div>
                <div className="ljc-o-b-item-row3 ljc-o-b-i1-row3" >
                  {
                    this.state.allPercent.map((item, index) => {
                      if (index < this.state.item1.percentInt) {
                        return <span key={index} className="ljc-o-p-svg" ><SVG type="person" color="#1aab65" width="20px" height="20px" /></span>
                      }
                      return <span key={index} className="ljc-o-p-svg"><SVG type="person" color="#d7d7d7" width="20px" height="20px" /></span>
                    })
                  }
                  <span className="ljc-o-b-item3-percent " >{this.state.item1.percent ? this.state.item1.percent : 0}%</span>
                </div>
              </Spin>
            </div>

          </div>

          <div className="ljc-o-b-item ljc-o-b-item2">
            <div className="ljc-o-b-auto" >
              <Spin spinning={this.state.loading2}>
                <div className="ljc-o-b-item-row1 ljc-o-b-i2-row1" >
                  <span>已下发考点数</span>
                  /应下发考点数：
                  <span>{this.state.item2.useExamNum}</span>
                  &nbsp;/&nbsp;{this.state.item2.AllExamNum}
                </div>
                <div className="ljc-o-b-item-row2 ljc-o-b-i2-row2" >
                  下发考点进度：
                </div>
                <div className="ljc-o-b-item-row3 ljc-o-b-i2-row3" >
                  {
                    this.state.allPercent.map((item, index) => {
                      if (index < this.state.item2.percentInt) {
                        return <span key={index} className="ljc-o-p-svg"><SVG type="point" color="#1aab65" width="20px" height="20px" /></span>
                      }
                      return <span key={index} className="ljc-o-p-svg"><SVG type="point" color="#d7d7d7" width="20px" height="20px" /></span>
                    })
                  }
                  <span className="ljc-o-b-item3-percent " >{this.state.item2.percent ? this.state.item2.percent : 0}%</span>
                </div>
              </Spin>
            </div>
          </div>

          <div className="ljc-o-b-item ljc-o-b-item3">
            <div className="ljc-o-b-auto" >
              <Spin spinning={this.state.loading3}>
                <div className="ljc-o-b-item-row1 ljc-o-b-i3-row1" >
                  <span>已下发考生数</span>
                  /应下发考生数：
                <span>{this.state.item3.useExaminee}</span>
                  &nbsp;/&nbsp;{this.state.item3.AllExaminee}
                </div>
                <div className="ljc-o-b-item-row2 ljc-o-b-i3-row2" >
                  下发考生进度：
              </div>
                <div className="ljc-o-b-item-row3 ljc-o-b-i3-row3" >
                  {
                    this.state.allPercent.map((item, index) => {
                      if (index < this.state.item3.percentInt) {
                        return <span key={index} className="ljc-o-p-svg"><SVG type="person" color="#1aab65" width="20px" height="20px" /></span>
                      }
                      return <span key={index} className="ljc-o-p-svg"><SVG type="person" color="#d7d7d7" width="20px" height="20px" /></span>
                    })
                  }
                  <span className="ljc-o-b-item3-percent " >{this.state.item3.percent ? this.state.item3.percent : 0}%</span>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    )
  }
}