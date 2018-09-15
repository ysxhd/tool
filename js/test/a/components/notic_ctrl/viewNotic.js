/*
 * @Author: JC.Liu 
 * @Date: 2018-07-03 09:34:58 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-18 19:01:55
 * 查看通知组件
 */

import React, { Component } from "react"
import { Modal } from 'antd'
import Capacity from '../public/capacity'
import './viewNotic.css'
import { view_modal_false } from '../../redux/notic/tableOperat.redux'
import { connect } from 'react-redux'

@connect(state => state.TableOperatReducer, { view_modal_false })
export class ViewNotic extends Component {
  
  render() {
    return (
      <Modal
        className="JC-vn-modal"
        visible={this.props.viewNoticShow}
        title="查看通知"
        footer={null}
        destroyOnClose={true}
        onCancel={() => this.props.view_modal_false()}
      >
        <div className="JC-vn-header" >
          <div className="JC-vn-tit" >{this.props.singleData.title}</div>
          <div className="JC-vn-date" > {this.props.singleData.noticeTime}</div>
        </div>
        {/* content */}
        <div className="JC-vn-content" >
          <Capacity className="JC-vn-capacity">
            <div className="JC-vn-desc" >{this.props.singleData.content}</div>
          </Capacity>
        </div>
      </Modal>
    )
  }
}