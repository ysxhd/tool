/*
 * @Author: JC.Liu 
 * @Date: 2018-07-25 17:19:20 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 16:35:34
 * 前台 意见反馈
 */
import React, { Component } from 'react';
import { HeaderNav, TeacherNav, AdminNav } from './JC_header';
import FeekbackEdit from '../components/feedbackEdit';
import Footer from '../components/JC_footer';


export default class Q_FeedBack extends Component {
  render() {
    const target = this.props.match.params.target;
    return (
      <div>
        {
          target === "admin" ?
            <AdminNav />
            :
            target === "teacher" ?
              <TeacherNav />
              :
              target === "student" ?
                <HeaderNav />
                : null
        }
        <FeekbackEdit />
      </div>

    )
  }
}
