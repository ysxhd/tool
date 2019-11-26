/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-13 14:16:57
 * 班风班训发布组件
 */
import React, { Component } from 'react';
import { Input, Modal, Button } from 'antd';
import './../../css/student/stuPubTrain.css';

const { TextArea } = Input;

export class StuPubTrain extends Component {
  constructor(props){
    super(props);
    this.state = {
      textNum: 0,
    }
  }

  componentWillMount() {
    let cnt = this.props.infoData;
    if(cnt.length){
        this.props.setSet({
          modalOneText: cnt
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
      modalOneText: textCnt
    })
  }

  componentDidMount() {
    // 计算班风信息字数
    let infoData = this.props.infoData;
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
    return (
      <div className="lxx-stuPub-g-dia"> 
        <Input
          maxLength="20" 
          placeholder="请输入发布内容"
          defaultValue={this.props.infoData}
          onChange={this.changePublishCnt.bind(this)}
           />
        <p><span>{this.state.textNum}</span>/20</p>
        <span className={!this.props.showModalInform ? 'hidden' : 'lxx-dia-u-inform'}>*内容不能为空</span>
      </div>
    );
  }
}