/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 14:30:08 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-03 13:01:14
 * 公共容具
 */
import './capacity.css'
import React, { Component } from 'react'

export class Capacity extends Component {
  render() {
    return (
      <div className={this.props.className ? `${this.props.className} JC-capacity` :"JC-capacity"} >
        {this.props.children}
      </div>
    )
  }
}

export default Capacity