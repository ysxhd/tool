/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:34:35 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-25 15:57:51
 * 统计分析
 */
import React, { Component } from 'react'
import './statistics.css'
import Advise from './advise'
import Use from './use'
import { connect } from 'react-redux';
import { getPlaceData_action } from '../../redux/place/place.redux';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;

@connect(
  state => state,
  {  getPlaceData_action }
)
export default class Statistics extends Component {
  constructor() {
    super();
  }

  componentDidMount(){
    // 初始化楼层数据
    if(!this.props.placeReducer.nowBuilding){
      this.props.getPlaceData_action();
    }
  }

  render() {
    return (
      <div className="zn-tab-bg">
        <Tabs defaultActiveKey="1">
           <TabPane tab="使用情况" key="1"><Use/></TabPane>
          <TabPane tab="意见反馈" key="2"><Advise/></TabPane>  
        </Tabs>
      </div>
    )
  }
}