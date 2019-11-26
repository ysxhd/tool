/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-03-13 10:20:02
 * 留言作业发布组件
 */

import React, { Component } from 'react';
import { Input, Modal, Button } from 'antd';
import './../../css/student/stuPubMessage.css';

const { TextArea } = Input;

export class StuPubMessage extends Component {
  constructor(props){
    super(props);
    this.state = {
      textNum: 0,
    }
  }

  componentWillMount() {
    let cnt = this.props.teaInfo;
    if(cnt.length){
        this.props.setSet({
          workText: cnt
        })
    }
  }

  // 监控输入框内容
  changePublishCnt(e) {
    let textCnt = e.target.value;
    this.setState({
      textNum: textCnt.length
    })
    this.props.setSet({
      workText: textCnt
    })
  }

  // 输入框将回车换行改为空格
  changeEnterToSpace(e){
    if(e.keyCode == 13){
      // 避免回车键换行
      e.preventDefault();
    }
  }
  
  componentDidMount() {
    let infoData = this.props.teaInfo;
    if(!infoData){
      this.setState({
        textNum: 0
      })
    } else {
      this.setState({
        textNum: infoData.length
      })
    }
  }

  render(){
    // console.log(this.props.infoStatus);
    return (
      <div className="lxx-stuPub-g-dia"> 
        <TextArea
          rows={7} 
          maxLength="100" 
          defaultValue={this.props.teaInfo}
          placeholder="请输入发布内容"
          onChange={this.changePublishCnt.bind(this)}
          onPressEnter={this.changeEnterToSpace.bind(this)}
           />
        <p><span>{this.state.textNum}</span>/100</p>
        <span className={!this.props.showWorkInform ? 'hidden' : 'lxx-dia-u-inform'}>*内容不能为空</span>
      </div>
    );
  }
}