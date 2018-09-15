/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 15:16:32 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-06 15:05:57
 */
/**
 * 教师的课堂管理页面 操作记录
 */

import React from 'react';
import { Timeline } from 'antd';
import './../../css/tm_DetailOperateDoc.css'
import { connect } from 'react-redux';
import '../../js/_x/util/sundry';
@connect(
  state => state.B_TacherClassManDetailReducer,
)
export default class TmDetailOperateDoc extends React.Component {
  render() {
    let data = this.props.operateRecord;
    return (
      <div className="hf-tmdod-container">
        <Timeline>
          {
            data.map((item) => (
              <Timeline.Item key={item.pubRecordId}>
                <div className="hf-tmdod-box">
                  <div className="hf-tmdod-title">{item.operation}</div>
                  <div className="hf-tmdod-reason">原因：{item.reason}</div>
                  <div className="hf-tmdod-flexDiv">
                    <div className="hf-tmdod-time">{Number(item.timestamp).formatTime(false)}</div>
                    <div>操作员：{item.user}</div>
                  </div>
                </div>
              </Timeline.Item>
            ))
          }
        </Timeline>
      </div>
    )
  }
}