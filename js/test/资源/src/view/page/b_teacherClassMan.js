/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 15:16:32 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:09:37
 */
/**
 * 教师的课堂管理页面
 */

import React from 'react';
import TmChooseBar from './../components/tm_ChooseBar';
import TmTable from './../components/tm_Table';
import ClassLookDetail from './../components/classLookDetail';
import TmSourceTab from './../components/tm_sourceTab';
import { TeacherNav } from './JC_header';
import { Tea_FooterBar } from '../components/JC_footer';
import { tm_recordWhenJump_ac } from './../../redux/b_teacherClassMan.reducer';
import { connect } from 'react-redux';

@connect(
  state => state.B_TacherClassManReducer,
  { tm_recordWhenJump_ac }
)
export default class TeacherClassMan extends React.Component {
  componentWillUnmount() {
    this.props.tm_recordWhenJump_ac({});
  }
  render() {
    const styleCss = {
      title: {
        width: 1300,
        margin: '20px auto',
        fontSize: 20,
      }
    };

    return (
      <div>
        <TeacherNav />
        <div style={styleCss.title}>课堂管理</div>
        <TmChooseBar role='teacher' />
        <div className="lxx-g-boxShadow"></div>
        <div style={this.props.tableOrList == 'table' ? { display: 'block' } : { display: 'none' }}>
          <TmSourceTab />
          <TmTable />
        </div>
        <div style={this.props.tableOrList == 'list' ? { display: 'block' } : { display: 'none' }}>
          <ClassLookDetail />
        </div>
        <Tea_FooterBar />
      </div>
    )
  }
}