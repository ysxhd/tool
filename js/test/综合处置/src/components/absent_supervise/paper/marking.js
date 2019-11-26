/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:22:55 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 10:42:01
 * 缺考 -> 阅卷缺考组件
 */
import React, { Component } from 'react';
import imgNoData from '../../../static/img/noData.png'

export class Marking extends Component {
  render() {
    return (
      <div className="zn-position-relative">
        <img src={imgNoData} alt="" className="zn-all-center"/>
      </div>
    )
  }
}