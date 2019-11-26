/*
 * @Author: JC.liu 
 * @Date: 2018-05-16 09:30:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-30 19:57:57
 * 总览 - 设备情况模块
 */
import React, { Component, PropTypes } from 'react'
import { SVG } from '../common';
import { Select ,Progress ,Spin } from 'antd';
import date from '../../js/_x/util/date';
import { _x } from '../../js/index';
import "../../css/in_examination.css";

const ajax = _x.util.request.request;
const Option = Select.Option;
export class In_examination extends Component {
    constructor(){
        super();
        this.state = {
            loading: false,
            data: [],   //下拉场次数据
            defaultData: "",  
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
          data: newProps.examTimeList
        })
        this.renderSelect(newProps.examTimeList, newProps)
      }
    
      renderSelect = (listData, othPar) => {
        //获取当前系统时间
        var date = Date.parse(new Date());
        listData.map((item, index) => {
          if (item.startTime < date && date < item.endTime) {
            this.setState({
              defaultData: listData[index].num
            }, () => {
              this.getData({ "id": othPar.curExamid.id, "orgcode": othPar.curOrgcode.label, "num": index + 1 });
              return;
            })
          } else {
            this.setState({
              defaultData: listData[0].num
            })
          }
        })
        this.getData({ 
        "id":othPar.curExamid.id,
        "orgcode": othPar.curOrgcode.value,
         "num": this.state.defaultData
         });
      }
    

      getData(params) {
          console.log(params);
        this.setState({
          loading: true
        })
        ajax("validation", params, (res) => {
          if (res.result && res.data) {
            var data = res.data;
            this.setState({
                loading:false, 
                "idenRenzhaoTotalNum":data.idenRenzhaoTotalNum,//人照合一的考生总数
                "idenRenzhaoPassNum":data.idenRenzhaoPassNum,//人照合一未通过人数
                "idenRenzhaoRate":data.idenRenzhaoRate,//人照合一通过率
                "idenRenzhengTotalNum":data.idenRenzhengTotalNum,//人证合一的考生总数
                "idenRenzhengPassNum":data.idenRenzhengPassNum,//人证合一未通过人数 
                "idenRenzhengRate":data.idenRenzhengRate,//人证合一通过率
                "idenNotPassNum":data.idenNotPassNum,//未验证人数 
                "throughRate":data.throughRate,//验证进度
                "examineeNum":data.examineeNum,//应入场总人数
                "idenEntryNum":data.idenEntryNum,//已入场人数 
                "idenEntryRate":data.idenEntryRate//入场进度
            })
          }else{
            this.setState({ 
                loading:false, 
                "idenRenzhaoTotalNum":0,//人照合一的考生总数
                "idenRenzhaoPassNum":0,//人照合一未通过人数
                "idenRenzhaoRate":0,//人照合一通过率
                "idenRenzhengTotalNum":0,//人证合一的考生总数
                "idenRenzhengPassNum":0,//人证合一未通过人数 
                "idenRenzhengRate":0,//人证合一通过率
                "idenNotPassNum":0,//未验证人数 
                "throughRate":0,//验证进度
                "examineeNum":0,//应入场总人数
                "idenEntryNum":0,//已入场人数 
                "idenEntryRate":0//入场进度
            }) 
          }
        })
      }
    
      handleChange = (value) => {
        var othPar = this.props;
        if (value) {
          this.setState({
            defaultData: value
          }, () => {
            this.getData({ "id": othPar.curExamid.id, "orgcode": othPar.curOrgcode.value, "num": this.state.defaultData })
          })
        }
      }
    

  render() {
      var state = this.state;
    return (
      <div className="" >
        <div className="zn-examin-head">
            <div className="zn-pes-comtitle"><span>考中验证</span><div className="zn-top-line"></div></div>
            <div>       
            <Select
              className="kyl-pes-dropd"
              value={this.state.defaultData}
               onChange={this.handleChange}
            >
              {
                this.state.data.map((item, index) => {
                  return <Option key={index} value={item.num} className="kyl-pes-option">
                    {item.name}
                  </Option>
                })
              }
            </Select>
            </div>
        </div>
        <div className="zn-examin-body">
           <Spin spinning={this.state.loading}/>
            <div className="zn-examin-left">
                <div className="zn-examin-top">
                    <div className="zn-examin-top-box zn-border-right">
                        <div className="zn-mb26">人证合一</div>
                        <div className="zn-flex-spacebetween">
                            <div className="zn-examin-number">
                                <span>{state.idenRenzhengTotalNum}</span>人
                            </div>
                            <div className="zn-flex-spacebetween">
                                <div className="zn-examin-ball-red"></div>
                                <div>未通过 ：{state.idenRenzhengPassNum}人</div>
                            </div>
                        </div>
                        <div className="zn-examin-progress">
                            <div>通过率</div>
                            <Progress percent={state.idenRenzhengRate} />
                        </div>
                    </div>
                    <div className="zn-examin-top-box">
                       <div className="zn-mb26">人照合一</div>
                        <div className="zn-flex-spacebetween">
                            <div className="zn-examin-number">
                                <span>{state.idenRenzhaoTotalNum}</span>人
                            </div>
                            <div className="zn-flex-spacebetween">
                                <div className="zn-examin-ball-red"></div>
                                <div>未通过 ：{state.idenRenzhaoPassNum}人</div>
                            </div>
                        </div>
                        <div className="zn-examin-progress">
                        <div>通过率</div>
                            <Progress percent={state.idenRenzhaoRate} />
                        </div>
                    </div>
                </div>
                <div className="zn-examin-bottom">
                   验证统计
                </div>
                
            </div>
            <div className="zn-examin-left zn-border-rnone">
                <div className="zn-examin-top">
                    <div className="zn-examin-top-box zn-border-right">
                        <div className="zn-mb26">未验证人数</div>
                        <div className="zn-flex-spacebetween">
                            <div className="zn-examin-number">
                                <span>{state.idenNotPassNum}</span>人
                            </div>
                        </div>
                        <div className="zn-examin-progress">
                        <div>验证进度</div>
                            <Progress percent={state.throughRate} />
                        </div>
                    </div>
                    <div className="zn-examin-top-box">
                       <div className="zn-mb26">应入场人数</div>
                        <div className="zn-flex-spacebetween">
                            <div className="zn-examin-number">
                                <span>{state.examineeNum} </span>人
                            </div>
                            <div className="zn-flex-spacebetween">
                                <div className="zn-examin-ball-green"></div>
                                <div>已入场 ：{state.idenEntryNum} 人</div>
                            </div>
                        </div>
                        <div className="zn-examin-progress">
                        <div>入场进度</div>
                            <Progress percent={state.idenEntryRate}  />
                        </div>
                    </div>
                </div>
                <div className="zn-examin-bottom">
                   入场进度
                </div>
                
            </div>
        </div>
      </div>
    )
  }
}