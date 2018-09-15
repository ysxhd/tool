/*
 * @Author: hf 
 * @Date: 2018-07-31 10:47:09 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:13:29
 */

/**
 * 管理员的课堂管理页面
 */

import React from 'react';
import TmChooseBar from './../components/tm_ChooseBar';
import MmTable from './../components/mm_Table';
import MmSourceTab from './../components/mm_sourceTab';
import img from './../../icon/myClass.png';
import { AdminNav } from './JC_header';
import { Admin_FooterBar } from '../components/JC_footer';
import { connect } from 'react-redux';
import { mm_ifChangeWhenSelect_ac } from './../../redux/mm_SubClass.reducer';
import { recordWhenJump_ac } from './../../redux/b_managerClassMan.reducer';
@connect(
  state => state.B_ManagerClassManReducer,
  { recordWhenJump_ac, mm_ifChangeWhenSelect_ac }
)
export default class B_ManagerClassMan extends React.Component {

  componentWillUnmount() {
    this.props.recordWhenJump_ac({})
    this.props.mm_ifChangeWhenSelect_ac(true);
  }
  render() {
    return (
      <div>
        <AdminNav />
        <TmChooseBar role='manager' />
        <MmSourceTab />
        <MmTable />
        <Admin_FooterBar />
      </div>
    )
  }
}