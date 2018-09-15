/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:18:51 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 15:37:09
 * 编辑事迹照片组件
 */
import React, { Component } from 'react';
import {Input, Button} from 'antd';
import {error,success} from './index';
import _x from '../../js/_x/index';
import '../../css/admin/editStoryStyle.css';

const { TextArea } = Input;

export class StoryEditPic extends Component {
  constructor(){
    super();
    this.state = {
      title:'',         //照片标题
      intro:'',         //照片简介
      disabPub:false,   //发布禁用
    };
    this.uid = '';      //照片id
  };

  componentDidMount(){
    if(this.props.uid){
      this.uid = this.props.uid
      this.getData();
    }
  }

  /**
   * 获取图片信息
   */
  getData = () => {
    let req = {
      action:'api/web/information/manager_deed/picture_info',
      data:{
        uid:this.uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.setState({
          title:ret.data.picTitle,
          intro:ret.data.introduction
        });
      }
    });
  }

  /**
   * 改变标题
   */
  changeTitle = (e) => {
    this.setState({
      title: e.target.value,
    })
  };

  /**
   * 改变内容
   */
  changeTxt = (e) => {
    this.setState({
      intro: e.target.value
    });
  };

  /**
   * 发布图片信息
   */
  pub = () => {
    if(this.state.title.trim()===''){
      error('请填写照片标题',1500);
    }else{
      this.setState({
        disabPub:true
      });
      let req = {
        action:'api/web/information/manager_deed/picture_edit',
        data:{
          uid:this.uid,
          picTitle:this.state.title,
          introduction:this.state.intro
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          success('保存成功',1500);
          this.props.getPicData(1);
          this.props.hideModalEdit();
        }
        this.setState({
          disabPub:false
        });
      });
    }
  };

  render(){
    return (
      <div> 
        <div className="cjy-ess-titleLine">
          <span className="cjy-label">照片标题：</span>
          <Input maxLength="50" value={this.state.title} onChange={this.changeTitle}/>
        </div>
        <div className="cjy-ess-titleLen">{this.state.title?this.state.title.length:0}/50</div>
        <div className="cjy-ess-introLine">
          <span className="cjy-label">照片内容：</span>
          <TextArea maxLength="500" value={this.state.intro} onChange={this.changeTxt}/>
        </div>
        <div className="cjy-ess-titleLen">{this.state.intro?this.state.intro.length:0}/500</div>
        <div className="ant-modal-footer">
          <Button className={`cjy-btn ${this.state.disabPub===true?'zn-disable-btn':'cjy-orange-sure'}`} disabled={this.state.disabPub} onClick={this.pub}>发布</Button>
          <Button className="cjy-btn" onClick={this.props.hideModalEdit}>取消</Button>
        </div>
      </div>
    );
  }
}