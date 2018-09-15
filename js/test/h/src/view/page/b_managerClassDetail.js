/*
 * @Author: hf 
 * @Date: 2018-08-06 16:37:51 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:14:27
 */

/**
 * 管理员的课堂管理页面
 */

import React from 'react';
import MmDetailTop from './../components/mm_DetailTop';
import MmDetailList from './../components/mm_DetailList';
import { message } from 'antd';
import img from './../../icon/myClass.png';
import { AdminNav } from './JC_header';
import { Admin_FooterBar } from '../components/JC_footer';
import { connect } from 'react-redux';
import { mm_ifChangeWhenSelect_ac } from './../../redux/mm_SubClass.reducer';
import { getOneLesCurList_ac, getTopRecommendCurList_ac, mm_removeComponent_ac } from './../../redux/b_managerClassDetail.reducer';
import { SpinLoad } from './../common';
import noData from './../../icon/null_b.png'

@connect(
  state => state.B_ManagerClassManDetaileReducer,
  { getOneLesCurList_ac, getTopRecommendCurList_ac, mm_removeComponent_ac, mm_ifChangeWhenSelect_ac }
)
export default class B_ManagerClassDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    const curID = this.props.match.params.id;
    let obj = JSON.parse(decodeURIComponent(curID));
    delete obj.acdYearId;
    this.props.getOneLesCurList_ac(obj);
    this.props.getTopRecommendCurList_ac();
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.cancelTop_data != nextprops.cancelTop_data) {
      this.dealCallback(nextprops.cancelTop_data);
    }
  }

  /**
     * 处理操作返回值
     */
  dealCallback = (data) => {
    if (data.result) {
      message.success('操作成功');
      const curID = this.props.match.params.id;
      let obj = JSON.parse(decodeURIComponent(curID));
      this.props.getOneLesCurList_ac(obj);
      this.props.getTopRecommendCurList_ac();
    } else {
      message.error(data.message)
    }
  }

  componentWillUnmount() {
    this.props.mm_removeComponent_ac();
    this.props.mm_ifChangeWhenSelect_ac(true)
  }
  render() {
    let item;
    if (!this.props.detail_data) {
      item = <div style={{ textAlign: 'center', margin: 30, height: 300 }}>
        <SpinLoad />
      </div>
    } else {
      if (!this.props.detail_data.length) {
        item = <div className="lxx-g-noData">
          <img src={noData} />
          <p>无数据</p>
        </div>
      } else {
        item = <div>
          <MmDetailTop />
          <div className="lxx-g-boxShadow"></div>
          <MmDetailList />
        </div>
      }
    }
    return (
      <div>
        <AdminNav />
        {item}
        <Admin_FooterBar />
      </div>
    )
  }
}