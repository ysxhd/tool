/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:56:13 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:36:43
 * 紧急通知发布和编辑组件
 */
import React, { Component } from 'react';
import { Button, Radio, DatePicker, Input, Tabs } from 'antd';
import {SVG} from '../base';
import { ChoiceClass } from './shared/choiceClass';
import {success, error} from './index';
import _x from '../../js/_x/index';
import moment from 'moment';
import '../../css/admin/uPubEdit.css';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export class UPubEdit extends Component {
  constructor(){
    super();
    this.state = {
      timeChange:false,  //是否重新选择了时间
      content:'',         //txt内容
      addressIds:[],      //场所ID
      ssIds:[],           //发布地点ID
      value:1,            //滚动方式，0全屏，1底部滚动
      choiceAdrVis:false, //选择场所栏是否可见
      // endTime:new Date(), //截止时间
      endTime:'', //截止时间
      time:'',            //时间
      status:'',          //当前选中历史通知的状态，C过期
      disabPub:false,     //发布禁用
    };
  };

  componentDidMount(){
    if(this.props.chosedId){
      this.getData(this.props.chosedId);
    }
  };

  /**
   * 获取紧急通知数据
   */
  getData = (id) => {
    let req = {
      action:'api/web/manager_campus_notice/get_one_urgent_notice',
      data:{
        id:id
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.setState({
          addressIds:ret.data.addressIds,
          endTime:ret.data.endTime,
          title:ret.data.title,
          content:ret.data.content,
          value:ret.data.type,
          status:ret.data.status,
          ssIds:ret.data.ssId
        });
      }
    });
  }

  /**
   * 全屏底部单选框改变
   */
  changeRadio = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  /**
   * 时间改变
   */
  changeTime = (value,dateString) => {
    this.setState({
      endTime:value,
      timeChange:true
    });
  };

  onOk = (value) => {
  };

  /**
   * 内容改变
   */
  changeTxt = (e) => {
    this.setState({
      content:e.target.value
    });
  };

  /**
   * 显示选择范围
   */
  showChoiceAdr = () => {
    this.setState({
      choiceAdrVis:true
    });
  };

  /**
   * 隐藏选择范围
   */
  hideChoiceAdr = (addressObj,ssIds) => {
    if(addressObj.length){
      let addressIds = [];
      addressObj.map(ao=>{
        addressIds.push(ao.addressId);
      });
      this.setState({
        choiceAdrVis:false,
        addressIds,
        ssIds:ssIds?[...new Set([...ssIds,...this.state.ssIds])]:this.state.ssIds
      });
    }else{
      this.setState({
        choiceAdrVis:false
      });
    }
  };
  
  /**
   * 发布按钮
   */
  pub = () => {
    if(this.state.addressIds.length===0){
      error('请选择场所',1500);
    }else if(this.state.endTime===''||this.state.endTime==null){
      error('请填写截止时间',1500);
    }else if(this.state.endTime<new Date()){
      error('截止时间必须大于当前时间',1500);
    }else if(this.state.content.trim()===''){
      error('请填写通知内容',1500);
    }else{
      this.setState({
        disabPub:true
      });
      let req = {
        action:'api/web/manager_campus_notice/add_or_update_urgent_notice',
        data:{
          id:this.props.chosedId?this.props.chosedId:'',
          addressIds:this.state.addressIds,
          ssIds:this.state.ssIds,
          type:this.state.value,
          endTime:this.state.timeChange ? Date.parse(this.state.endTime) : this.state.endTime,
          content:this.state.content
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          this.props.hideModal();
          this.props.getCurData();
          success('发布成功',1500);
          this.setState({
            timeChange:false
          })
        }
        this.setState({
          disabPub:false
        });
      })
    }
  };

  /**
   * 禁用日期选择框
   */
  // disabledStartDate = (value) => {
  //   if (!value ) {
  //     return false;
  //   }
  //   return value.valueOf() < new Date().valueOf();
    // return value.valueOf() < new Date().valueOf();
    // return value.valueOf() + new Date().getSeconds()*1000 < new Date().valueOf();
  // };

  // disabledDateTime = () => {
  //   return {
  //     disabledHours: () => this.range(0, new Date().getHours())
  //   };
  // };

  // range = (start, end) => {
  //   const result = [];
  //   for (let i = start; i < end; i++) {
  //     result.push(i);
  //   }
  //   return result;
  // }

  handlePanelChange = (value, mode) => {
  }

  render(){
    const endTime = this.state.endTime?moment(new Date(this.state.endTime), 'YYYY/MM/DD HH:mm'):null;
    return (
      <div> 
        <div className="cjy-upe-rangLine">
          <span className="cjy-label">范围：</span>
          <span className="cjy-upe-range" onClick={this.showChoiceAdr}><SVG type="plus"/>发布范围</span>
          <span className="cjy-upe-left10">已选择{this.state.addressIds?this.state.addressIds.length:0}个</span>
        </div>
        <div className="cjy-upe-visStyle cjy-upe-top20">
          <span className="cjy-label">方式：</span>
          <RadioGroup onChange={this.changeRadio} value={this.state.value}>
            <Radio value={1}>底部滚动</Radio>
            <Radio value={0}>全屏显示</Radio>
          </RadioGroup>
        </div>
        <div className="cjy-upe-time cjy-upe-top20">
          <span className="cjy-label">截止时间：</span>
          <DatePicker showTime={{format:'HH:mm'}} value={endTime} onPanelChange={this.handlePanelChange} 
          format="YYYY-MM-DD HH:mm" placeholder="" onChange={this.changeTime} onOk={this.onOk}/>
        </div>
        <div className="cjy-upe-con cjy-upe-top20">
          <span className="cjy-label">内容：</span>
          <TextArea maxLength="200" value={this.state.content} onChange={this.changeTxt}/>
        </div>
        <div className="cjy-upe-countFont">
          <span>{this.state.content.length}</span><span>/200</span>
        </div>
        <div className="ant-modal-footer">
          {
            this.state.status==='C'
            ? ''
            : <Button className={`cjy-btn ${this.state.disabPub===true?'zn-disable-btn':'cjy-orange-sure'}`} disabled={this.state.disabPub} onClick={this.pub}>发布</Button>
          }
          <Button className="cjy-btn" onClick={this.props.hideModal}>取消</Button>
        </div>
        <ChoiceClass choiceAdrVis={ this.state.choiceAdrVis } hideChoiceAdr={this.hideChoiceAdr} addressIds={this.state.addressIds}/>
      </div>
    );
  }
}