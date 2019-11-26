/*
 * @Author: huangjing 
 * @Date: 2018-01-08 17:01:34 
 * @Last Modified by: huangjing
 * @Last Modified time: 2018-01-09 14:04:43
 * 遮罩层
 */
import React, { Component } from 'react'
import './maskLayer.css'
import classnames from 'classnames'

export default class MaskLayer extends Component {
  constructor() {
    super();
    this.state = {
      symbol: false,
    };
  }
  //   打开遮罩
  show = () => {
    this.setState({ symbol: true });
  }
  //关闭遮罩
  close = () => {
    this.setState({ symbol: false });
  }

  render() {
    return (
      <div className={classnames('hj-ml-shade', { 'isShow': this.state.symbol })} ></div>
    )
  }
}

