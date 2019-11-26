/*
 * @Author: 康玉良 
 * @Date: 2018-01-05 16:40:32 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-20 13:03:01
 */

import React, { Component } from 'react';
import  "../../../../css/admin/settingsClass.css";
import { LeftMenu } from '../../../../components/base';
import { Select } from 'antd';
import _x from '../../../../js/_x/index';
import {success, error} from '../../../../components/student/index';

export class SettingsClass extends Component {
  
  constructor(props){
    super(props);
    this.state={
      //minute，second为编辑变量    minute1和second1为显示变量
      isShow:true,
      isHidden:false,
      minute:300,
      second:30,
      minute1:300,
      second1:30,
      data:{}
    };
  }
  componentWillMount(){
    var req={
      action:'api/web/manager_device_manage/get_info',
      // action:'api/web/manager_device_manage/set_info',
      data:{
        // unloginToHome:this.state.minute,
        // loginToHome:this.state.second
      }
    }
    _x.util.request.formRequest(req,(res)=>{
      const data=res.data;
      // console.log(data);
      if(res){
        this.setState({
           minute:data.unloginToHome,
           second:data.loginToHome
        })
      // console.log(this.state.minute1,this.state.second1)
      }else{
        console.log("err")
      }
    })
  }
  componentDidMount(){
    // console.log(this.state.data.loginToHome)
  }
  editClick = (e) =>{
    // 点击编辑按钮时  编辑框消失，保存和取消框出现
      e.preventDefault();
      this.setState({
        isShow:!this.state.isShow,
        isHidden:!this.state.isHidden
      });  
     
  }
  saveClick =(e,value)=>{
    // 点击保存按钮  保存和取消消失，更新设置的时间，编辑框出现,将改变的编辑变量值保存到显示变量中
    e.preventDefault();
    this.setState({
      isShow:!this.state.isShow,
      isHidden:!this.state.isHidden,
      minute1:this.state.minute,
      second1:this.state.second
    }); 
    var req={
      // action:'api/web/manager_device_manage/get_info',
      action:'api/web/manager_device_manage/set_info',
      data:{
        unloginToHome:this.state.minute,
        loginToHome:this.state.second
      }
    }
    _x.util.request.formRequest(req,(res)=>{
      const data=res.data;
      // console.log(data);
      if(res.result){
        success('操作成功',1000);
      }else{
        error('操作失败',1000);
      }
    })
     
  }
  cancelClick=(e)=>{
    // 点击取消按钮  保存和取消框消失，编辑框出现，将编辑变量设置为默认值
    e.preventDefault();
    this.setState({
      isShow:!this.state.isShow,
      isHidden:!this.state.isHidden,
      minute:this.state.minute1,
      second:this.state.second1
      
    });  
  }
  handleMinuteChange=(value)=>{
     // 点击然后把值保存到编辑的变量中
        this.setState({
          minute:value,
          minute1:this.state.minute
        })
      }
      
  handleSecondChange=(value)=>{
    // 点击然后把值保存到编辑的变量中
      this.setState({
        second:value,
        second1:this.state.second
     })
   }
  render(){
    const editStyle=this.state.isShow?"block":"none";
    const saveStyle=this.state.isHidden?"block":"none";
    const Option = Select.Option;
    const min=this.state.minute;
    const sec=this.state.second;
    return (
      <div className="kyl-sc-setting"> 
        <div className="kyl-sc-title">
          <span>界面回位设置</span>
            <div className="kyl-sc-bj" onClick={this.editClick}  style={{display:editStyle}}>
            <span>编 辑</span>
          </div>
          <div className="kyl-sc-edited" style={{display:saveStyle }}>
            <span className="kyl-sc-save"
             onClick={this.saveClick}>保 存
             
             </span>
            <span className="kyl-sc-cancel"  onClick={this.cancelClick}>取 消</span>
          </div>         
        </div>
        <div className="kyl-sc-status">
        <div className="kyl-sc-statusBox">
          <div className="kyl-sc-log">
            <div className="kyl-sc-square">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={"#icon-key"}></use>
                </svg>
              </div>
              <p className="kyl-sc-p1">非登录状态</p>
              <p className="kyl-sc-p2">间隔&nbsp;&nbsp;</p>
              <Select 
              className="kyl-sc-min1" 
              value={this.state.minute} onChange={this.handleMinuteChange} 
              style={{display:saveStyle}}
              >
                  <Option value="120" >120</Option>
                  <Option value="300" >300</Option>
                  <Option value="600" >600</Option> 
              </Select>
              <p className="kyl-sc-p3" style={{display:editStyle}}>{min}</p>
              <p className="kyl-sc-p4">&nbsp;&nbsp;秒 回到首页</p>
            </div>
            <div className="kyl-sc-unlog">
              <div className="kyl-sc-square">
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref={"#icon-user"}></use>
                </svg>
              </div>
              <p className="kyl-sc-p11">登录状态</p>
              <p className="kyl-sc-p22">间隔&nbsp;&nbsp;</p>
              <Select className="kyl-sc-min1" value={this.state.second} onChange={this.handleSecondChange} 
              style={{display:saveStyle}}     
              >
                  <Option  value="10">10</Option>
                  <Option  value="20">20</Option>
                  <Option  value="30">30</Option>
              </Select>  
              <p className="kyl-sc-p33"  style={{display:editStyle}}>{sec}</p>
              <p className="kyl-sc-p44">&nbsp;&nbsp;秒 回到首页</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}