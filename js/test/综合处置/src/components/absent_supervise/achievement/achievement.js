/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:32:15 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 10:41:12
 * 缺考 -> 成绩缺考组件
 */
import React, { Component } from 'react';
import imgNoData from '../../../static/img/noData.png'

export class Achievement extends Component {
  render() {
    return (
      <div className="zn-position-relative">
        <img src={imgNoData} alt="" className="zn-all-center"/>
      </div>
    )
  }
}
