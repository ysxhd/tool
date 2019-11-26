/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 16:10:12 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-21 13:37:43
 * 后台 - 意见反馈主页
 */

import React from 'react';
import {AdminNav} from './JC_header';
import { Admin_FooterBar} from '../components/JC_footer';
import FeekbackList from '../components/feedbackList';
export default class B_Feedback extends React.Component {
  render() {
    return (
      <div>
        <AdminNav />
        <FeekbackList />
        <Admin_FooterBar />
      </div>
    )
  }
}