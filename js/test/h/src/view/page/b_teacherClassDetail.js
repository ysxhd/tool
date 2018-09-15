/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 15:16:32 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:10:06
 */
/**
 * 教师的课堂管理页面
 */

import React from 'react';
import { TeacherNav } from './JC_header';
import { Tea_FooterBar } from '../components/JC_footer';
import TmDetailTop from './../components/tm_DetailTop';
import TmDetailList from './../components/tm_DetailList';
import { getCurDetailed_ac, getCurRecord_ac } from './../../redux/b_teacherClassDetail.reducer';
import { connect } from 'react-redux';
import { message } from 'antd';
import { SpinLoad } from './../common';
import noData from './../../icon/null_b.png'
import { tm_recordWhenJump_ac } from './../../redux/b_teacherClassMan.reducer';
@connect(
  state => state,
  { getCurDetailed_ac, getCurRecord_ac, tm_recordWhenJump_ac }
)
export default class B_TeacherClassDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() {
    const curID = this.props.match.params.id;
    this.props.getCurDetailed_ac(curID);
    this.props.getCurRecord_ac(curID);
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.B_TacherClassManDetailReducer.pubDesc_data != nextprops.B_TacherClassManDetailReducer.pubDesc_data) {
      this.dealCallback(nextprops.B_TacherClassManDetailReducer.pubDesc_data);
    }
    if (this.props.B_TacherClassManDetailReducer.cutRel_data != nextprops.B_TacherClassManDetailReducer.cutRel_data) {
      this.dealCallback(nextprops.B_TacherClassManDetailReducer.cutRel_data)
    }
  }


  /**
   * 处理操作返回值
   */
  dealCallback = (data) => {
    if (data.result) {
      message.success(data.message)
      const curID = this.props.match.params.id;
      this.props.getCurDetailed_ac(curID);
      this.props.getCurRecord_ac(curID);
    } else {
      message.error(data.message)
    }
  }

  render() {
    let item;
    if (!this.props.B_TacherClassManDetailReducer.detailData) {
      item = <div style={{ textAlign: 'center', margin: 30, height: 300 }}>
        <SpinLoad />
      </div>
    } else {
      item = <div>
        <TmDetailTop />
        <div className="lxx-g-boxShadow"></div>
        <TmDetailList />
      </div>
    }

    return (
      <div>
        <TeacherNav />
        {item}
        <Tea_FooterBar />
      </div>
    )
  }
}