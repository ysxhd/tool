/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:54:07 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-08-30 16:07:05
 * 教师考勤报表-教师报表
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import Teacher from '../components/report/teacher';
import PerfectScrollbar from 'react-perfect-scrollbar';

class TeaReportTea extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <Teacher />
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default TeaReportTea;