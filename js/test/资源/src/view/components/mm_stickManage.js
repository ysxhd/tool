/*
 * @Author: hf 
 * @Date: 2018-08-07 09:16:58 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-15 19:08:49
 */


import React from 'react';
import { Button } from 'antd';
import MmStickManageItem from './mm_stickManage_item';
import { connect } from 'react-redux';
import noData from './../../icon/null_b.png'
@connect(
  state => state.B_ManagerClassManDetaileReducer,
)
export default class MmStickManage extends React.Component {

  render() {
    const data = this.props.top_data;
    return (<div style={{ overflow: 'hidden' }}>
      {
        data.length == 0
          ?
          <div className="lxx-g-noData">
            <img src={noData} />
            <p>无数据</p>
          </div>
          :
          data.map((item) => (
            <MmStickManageItem key={item.curResourceId} data={item} />
          ))

      }

    </div>)
  }
}

