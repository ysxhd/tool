/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:45:20 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-23 15:40:56
 * 日常通知及紧急通知列表内组件
 */
import React, { Component } from 'react';
import { Checkbox } from 'antd';
import { SVG } from '../base';
import { confirmDia } from './index';
import '../../css/admin/dailyUrgentNo.css';

export class DailyUrgentNo extends Component {
  constructor(){
    super();
    this.state = {
      checked: false,   //是否选中
      show: false,      //是否显示删除按钮
    }
    this.check = this.check.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.ids.indexOf(nextProps.data.id)===-1){
      this.setState({
        checked: false
      });
    }else{
      this.setState({
        checked: true
      });
    }
  }

  /**
   * 选中通知改变
   */
  listOnChange = (id,e) => {
    this.props.listOnChange(id,e.target.checked);
  }

  /**
   * 多选框
   * @param {*} bl 
   */
  check(bl) {
    if(bl){
      this.setState({
        checked: true
      });
    }else{
      this.setState({
        checked: false
      });
    }
  };

  /**
   * 删除按钮
   */
  del = (id,e) => {
    e.stopPropagation();
    confirmDia({
      title:'信息提示',
      content:'确定要删除该条通知吗？',
      className:0,
      okText:'确定',
      fnOK:() => {
        if(this.props.type==='0'){
          this.props.delDailyNo(id);
        }else{
          this.props.delUrgentNo(id);
        }
      },
      fnCancel:() => {
      }
    })
  };

  /**
   * 阻止复选框冒泡事件
   */
  clickCheck = (e) => {
    e.stopPropagation();
  }
  
  render(){
    const data = this.props.data;
    return (
      <div className="cjy-dun"> 
        <span className="cjy-dun-selectBox" onClick={this.clickCheck}>
        {
          this.props.type==='1'
          ? data.status==='B'||data.status==='C'
            ? <Checkbox checked={this.state.checked} onChange={(e)=>this.listOnChange(data.id,e)}></Checkbox>
            : ''
          : <Checkbox checked={this.state.checked} onChange={(e)=>this.listOnChange(data.id,e)}></Checkbox>
        }
        </span>
        <div className="cjy-dun-txtBox">
          <span className="cjy-dun-title cjy-ellip">
            {
              data.status
              ? data.status === 'B'
                ? <span className="cjy-dun-status">撤销</span>
                : <span className="cjy-dun-status">过期</span>
              : ''
            }
            <span className={`${data.status?'cjy-dun-cancel':''}`}>{this.props.type==='0'?data.title:data.content}</span>
          </span>
          <span className={`cjy-dun-date ${data.status?'cjy-dun-cancel':''}`}>{this.props.type==='0'?data.date:data.createDate}</span>
          <span className={`cjy-dun-del ${this.props.type==='1'?!data.status?'cjy-dun-none':'cjy-dun-ib':''}`} onClick={(e)=>this.del(data.id,e)}><SVG type="cross"/></span>
        </div>
      </div>
    );
  }
}