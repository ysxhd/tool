/*
 * @Author: kyl 
 * @Date: 2018-05-16 14:00:57 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-05-29 09:29:26
 */
import React, { Component } from 'react';
import "../../css/post_examination_statistics.css";
import { Select, Spin } from 'antd';
import { Pie_Echarts } from './index'
import { LeftMenu } from '../common';
import date from '../../js/_x/util/date';
import { G, _x } from '../../js/index';

const ajax = _x.util.request.request;
const Option = Select.Option;

export class Post_Examination_Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading1: false,
      loading2: false,
      data: [],   //下拉场次数据
      defaultData: "",    //下拉默认数据
      params: {
        "shtgrsNum": "0",//人工通过人数
        "shtgrsRate": "0",//人工通过占比
        "validationNum": "0",//验证通过人数
        "validationRate": "0",//验证通过占比
        "notThroughNum": "0",//未通过人数
        "notThroughRate": "0",//未通过占比
        "noValidationNum": "0",//未验证人数
        "noValidationRate": "0",//未验证占比
        "examineeNum": "0",//考生总人数
        "qkrs": "0",//验证缺考人数
        "qkrsRate": "0",//验证缺考占比
        "zhbdqkrs": "0",//确认缺考人数
        "zhbdqkrsRate": "0",//确认缺考占比
        "normalMissNum": "0",//正常人数
        "normalMissRate": "0"//正常占比
      },       //请求参数对象
      // examineeNum:"",  //总人数
      // qkrsRate:"",    //验证缺考
      // zhbdqkrs:""     //确认缺考
    }
  }

  request = (params) => {
    this.setState({
      loading1: true,
      loading2: true,
    })
    ajax("after_the_test_statistic",
      params
      , (res) => {
        if (res.result && res.data) {
          this.setState({
            loading1: false,
            loading2: false,
            params: res.data,
          })
        } else {
          this.setState({
            loading1: false,
            loading2: false,
          })
        }
      })
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      data: newProps.examTimeList
    }, () => {
      this.renderSelect(newProps.examTimeList, newProps)
    })
  }

  renderSelect = (listData, othPar) => {
    //获取当前系统时间
    var date = Date.parse(new Date());
    listData.map((item, index) => {
      if (item.startTime < date && date < item.endTime) {
        this.setState({
          defaultData: listData[index].num
        }, () => {
          console.log(55555)
          this.request({ "id": othPar.curExamid.id, "orgcode": othPar.curOrgcode.label, "num": index + 1 });
          return;
        })
      } else {
        this.setState({
          defaultData: listData[0].num
        })
      }
    })
    this.request({ 
    "id": 
    // 2018100101,
    othPar.curExamid.id,
    "orgcode": othPar.curOrgcode.value,
     "num": this.state.defaultData
     });
    console.log(this.state.defaultData)
  }

  handleChange = (value) => {
    var othPar = this.props;
    console.log(value);
    if (value) {
      this.setState({
        defaultData: value
      }, () => {
        this.request({ "id": othPar.curExamid.id, "orgcode": othPar.curOrgcode.value, "num": this.state.defaultData })
      })
    }
  }


  render() {
    return (
      <div className="kyl-pes-all">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="kyl-pes-comtitle">
            <span>考后统计</span>
            <div className="kyl-top-line"></div>
          </div>
          <div>
            <Select
              className="kyl-pes-dropd"
              value={this.state.defaultData}
               onChange={this.handleChange}
            >
              {
                this.state.data.map((item, index) => {
                  // console.log(item)
                  return <Option key={index} value={item.num} className="kyl-pes-option">
                    {item.name}
                  </Option>
                })
              }
            </Select>
          </div>
        </div>
        <div className="kyl-pes-allCom">
          <Spin className="kyl-pes-pie" spinning={this.state.loading1}></Spin>
          <div className="kyl-pes-contLeft">
            <div className="kyl-pes-res">
              <div className="kyl-pes-fWord">
                <p style={{ lineHeight: "157px" }}>验证结果统计</p>
              </div>
              <div className="kyl-pes-pieRes" >
                <Pie_Echarts type={"2"} params={this.state.params} ></Pie_Echarts>
              </div>
              <div className="kyl-pes-pointFirst">
                <ul className="kyl-pes-ul">
                  <li style={{ marginBottom: "25px" }}><span className="kyl-pes-rgtg"></span>人工通过</li>
                  <li><span className="kyl-pes-wyz"></span>未验证</li>
                </ul>
              </div>
              <div className="kyl-pes-pointFirst">
                <ul className="kyl-pes-ul" style={{ marginLeft: "-14px" }}>
                  <li style={{ marginBottom: "25px" }}><span className="kyl-pes-jytg"></span>验证通过</li>
                  <li><span className="kyl-pes-wtg"></span>未通过</li>
                </ul>
              </div>
            </div>

          </div>
          <div className="kyl-pes-res kyl-pes-block">
            <div style={{ width: "30%",marginLeft:"4%"  }}>
              <p style={{ lineHeight: "157px",width:"103%"  }}>身份验证缺考统计</p>
            </div>
            <div className="kyl-pes-pieRes kyl-pes-pie2">
              <Pie_Echarts type={"3"} params1={this.state.params}></Pie_Echarts>
            </div>
            <div className="kyl-pes-pointFirst">
              <ul className="kyl-pes-bs">
                <li className="kyl-pes-li kyl-pes-bsLi"><span className="kyl-pes-zc"></span>正常</li>
                <li className="kyl-pes-li kyl-pes-bsLi"><span className="kyl-pes-yzqk"></span>验证缺考</li>
                <li className="kyl-pes-li"><span className="kyl-pes-qrqk"></span>确认缺考</li>
              </ul>
            </div>
            <div className="kyl-pes-pointFirst">
              <ul className="kyl-pes-lastWord">
                <li>总人数&nbsp;:&nbsp;<b>{this.state.params.examineeNum}</b>人</li>
                <li>验证缺考数&nbsp;:&nbsp;<b>{this.state.params.qkrsRate}</b>人</li>
                <li>确认缺考数&nbsp;:&nbsp;<b>{this.state.params.zhbdqkrs}</b>人</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
