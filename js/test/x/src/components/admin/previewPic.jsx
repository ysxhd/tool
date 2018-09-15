/*
 * @Author: JudyC 
 * @Date: 2018-01-25 11:15:14 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-02-02 16:31:18
 */
import React, { Component } from 'react';
import {Icon} from 'antd';
import { IMG } from '../base';
import '../../css/admin/previewPic.css';

export class PreviewPic extends Component {
  render(){
    return (
      <div className="cjy-pp">
        <div className="cjy-pp-closeLine">
          <span className="cjy-pp-closeBtn" onClick={this.props.hidePre}><Icon type="close"/></span>
        </div>
        <div>
          <div className="cjy-pp-left">
            <span className="cjy-pp-leftBtn" onClick={this.props.lastPic}><Icon type="left"/></span>
          </div>
          <div className="cjy-pp-middle">
            <IMG src={this.props.src}/>
          </div>
          <div className="cjy-pp-right">
            <span className="cjy-pp-RightBtn" onClick={this.props.nextPic}><Icon type="right"/></span>
          </div>
        </div>
      </div>
    )
  }
}