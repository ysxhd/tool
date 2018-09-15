/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:54:48 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:05:07
 * 紧急通知显示方式组件
 */
import React, { Component } from 'react';
import { SVG } from '../base';
import { confirmDia } from './index';
import '../../css/admin/displayMode.css';

export class DisplayMode extends Component {
  constructor(){
    super();
    this.state = {
      data:{},          //该组件数据
    };
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount(){
    this.setState({
      data: this.props.data
    });
  }


  componentDidUpdate() {
    if(this.state.data !== this.props.data){
      this.setState({
        data: this.props.data
      });
    }
}

  // edit(){}

  /**
   * 撤销
   */
  cancel(id){
    confirmDia({
      title:'信息提示',
      content:'确定要撤销该条紧急通知吗？',
      className:0,
      okText:'确定',
      fnOK:() => {
        this.props.cancel(id);
      },
      fnCancel:() => {
      }
    })
  }

  render(){
    return (
      <div className="cjy-dm"> 
        <div className="cjy-dm-iconLine">
          <div className="cjy-dm-disIconBox">
            <span className="cjy-dm-disIcon">
              <SVG type={`${this.state.data.type===0 ? 'square' : 'bottom'}`}/>
            </span>
            <span className="cjy-dm-disIconTxt">{this.state.data.type===0 ? '全屏显示' : '底部显示'}</span>
          </div>
          <div className="cjy-dm-timeBox">
            <span className="cjy-dm-disIcon">
              <SVG type="clock"/>
            </span>
            <span className="cjy-ellip cjy-dm-timeIconTxt">{`${this.state.data.createDate} 至 ${this.state.data.endTime}`}</span>
          </div>
        </div>
        <p className="cjy-dm-con">{this.state.data.content}</p>
        <div className="cjy-dm-setBtnBox">
          <span onClick={()=>this.props.getEditInfo(this.state.data.id)}><SVG type="pen"/></span>
          <span onClick={()=>this.cancel(this.state.data.id)}><SVG type="abolish"/></span>
        </div>
      </div>
    );
  }
}