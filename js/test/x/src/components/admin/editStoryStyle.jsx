/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:15:02 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:05:20
 * 编辑事迹风采组件
 */
import React, { Component } from 'react';
import {Input, DatePicker, Button} from 'antd';
import {error,success} from './index';
import moment from 'moment';
import _x from '../../js/_x/index';
import '../../css/admin/editStoryStyle.css';

const { TextArea } = Input;

export class EditStoryStyle extends Component {
  constructor(){
    super();
    this.state = {
      title:'',         //事记标题
      date:'',          //事记日期
      intro:'',         //事记简介
      disabPub:false    //发布禁用
    };
    this.uid = '';      //编辑事记id
  };

  componentDidMount(){
    if(this.props.uid){
      this.uid = this.props.uid;
      this.getData();
    }
  }

  /**
   * 获取数据
   */
  getData = () => {
    let req = {
      action:'api/web/information/manager_deed/find',
      data:{
        uid:this.uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.setState({
          title:ret.data.title,
          date:ret.data.recordDate?ret.data.recordDate:'',
          intro:ret.data.description
        })
      }
    });
  };

  /**
   * 改变标题
   */
  changeTitle = (e) => {
    this.setState({
      title: e.target.value,
    })
  };

  /**
   * 改变日期
   */
  changeDate = () => {
    this.setState({
      date:dateString
    });
  }

  /**
   * 改变内容
   */
  changeTxt = (e) => {
    this.setState({
      intro: e.target.value
    });
  };

  /**
   * 发布通知
   */
  pub = () => {
    var data;//时间参数
    if(this.state.title.trim()===''){
      error('请填写事记标题',1500);
    }else if(this.props.type==='1'&&this.state.date===''){
      error('请选择事记发布日期',1500);
    }else{
      this.setState({
        disabPub:true
      });
      if(this.state.date){
        data = new Date(this.state.date);
        data = _x.util.date.format(data, 'yyyy-MM-dd')
      }

      let req = {
        action:'api/web/information/manager_deed/edit_info',
        data:{
          uid:this.uid,
          title:this.state.title,
          recordDate:data?data:'',
          description:this.state.intro
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          success('保存成功',1500);
          this.props.hideModalEdit();
          this.props.getData(1);
        }
        this.setState({
          disabPub:false
        });
      });
    }
  };

  /**
   * 改变时间
   */
  changeTime = (value,dateString) => {
    this.setState({
      date:value
    });
  };

  render(){
    const type = this.props.type;
    return (
      <div> 
        <div className="cjy-ess-titleLine">
          <span className="cjy-label">{type==='1'?'事记':'风采'}标题：</span>
          <Input maxLength="50" value={this.state.title} onChange={this.changeTitle}/>
        </div>
        <div className="cjy-ess-titleLen">{this.state.title?this.state.title.length:0}/50</div>
        {
          type==='1'
          ? <div className="cjy-ess-dateLine">
            <span className="cjy-label">事记时间：</span>
            <DatePicker onChange={this.changeDate} value={this.state.date?moment(new Date(this.state.date), 'YYYY/MM/DD'):''} onChange={this.changeTime}></DatePicker>
          </div>
          : ''
        }
        <div className="cjy-ess-introLine">
          <span className="cjy-label">{type==='1'?'事记':'风采'}内容：</span>
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