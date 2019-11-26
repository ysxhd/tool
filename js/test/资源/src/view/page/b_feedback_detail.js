/*
 * @Author: JC.Liu 
 * @Date: 2018-08-01 17:12:39 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-21 13:41:05
 * 后台 - 意见反馈的详情页
 */

import React, { Component } from 'react';
import { AdminNav } from './JC_header';
import {Admin_FooterBar} from '../components/JC_footer';
import FeedbackDetailPage from '../components/feedbackDetail';

class B_FeedBack_detail extends Component {
  render() {
    return (
      <div>
        <AdminNav />
          <FeedbackDetailPage />
        <Admin_FooterBar />
      </div>
    )
  }
}
export default B_FeedBack_detail ;