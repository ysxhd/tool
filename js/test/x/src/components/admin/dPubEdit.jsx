/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:52:16 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-04-23 13:34:16
 * 日常通知发布和编辑组件
 */
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { success, error } from './index';
import _x from '../../js/_x/index';
import '../../css/admin/dPubEdit.css';

const { TextArea } = Input;

export class DPubEdit extends Component {
  constructor(){
    super();
    this.state = {
      title:'',         //modal的title内容
      content:'',       //modal的内容
      disabPub:false,   //是否禁用发布按钮
    };
    this.changeIpt= this.changeIpt.bind(this);
    this.changeTxt = this.changeTxt.bind(this);
    this.pub = this.pub.bind(this);
  }

  componentDidMount(){
    if(this.props.chosedId){
      this.getData(this.props.chosedId);
    }
  };

  /**
   * 获取编辑数据
   */
  getData = (id) => {
    let req = {
      action:'api/web/manager_campus_notice/get_one_daily_notification',
      data:{
        id:id
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.setState({
          title:ret.data.title,
          content:ret.data.content
        });
      }
    });
  }
  
  /**
   * 输入框改变
   * @param {*} e 
   */
  changeIpt(e){
    this.setState({
      title: e.target.value
    });
  };

  /**
   * 文本框改变
   * @param {*} e 
   */
  changeTxt(e){
    this.setState({
      content: e.target.value
    });
  };

  /**
   * 发布通知
   */
  pub(){
    if(this.state.title.trim()===''){
      error('请填写通知标题',1500);
    }else if(this.state.content.trim()===''){
      error('请填写通知内容',1500);
    }else{
      this.setState({
        disabPub:true
      });
      let req = {
        action:'api/web/manager_campus_notice/add_or_update_daily_notification',
        data:{
          id:this.props.chosedId?this.props.chosedId:'',
          title:this.state.title,
          content:this.state.content
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          this.props.hideModal();
          this.props.getDailyData(1);
          success('发布成功',1500);
        }
        this.setState({
          disabPub:true
        });
      })
    }
  }

  render(){
    return (
      <div>
        <div className="cjy-dpe-flex">
          <span>标题：</span>
          <Input maxLength="50" value={this.state.title} onChange={this.changeIpt}/>
        </div>
        <div className="cjy-dpe-countFont">
          <span>{this.state.title?this.state.title.length:0}</span><span>/50</span>
        </div>
        <div className="cjy-dpe-flex cjy-dpe-txtBox">
          <span>内容：</span>
          <TextArea value={this.state.content} onChange={this.changeTxt}/>
        </div>
        <div className="cjy-dpe-countFont">
          {/* <span>{this.state.content?this.state.content.length:0}</span><span>/500</span> */}
        </div>
        <div className="ant-modal-footer">
          <Button className={`cjy-btn ${this.state.disabPub===true?'zn-disable-btn':'cjy-grey-sure'}`} disabled={this.state.disabPub} onClick={this.pub}>发布</Button>
          <Button className="cjy-btn" onClick={this.props.hideModal}>取消</Button>
        </div>
      </div>
    );
  }
}