/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:54:07 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-06 16:35:26
 * 教师考勤报表-原始数据
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import Oringinal from '../components/report/oringinal.jsx';
import PerfectScrollbar from 'react-perfect-scrollbar';


// 原始数据
class TeaReportData extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <Oringinal />
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default TeaReportData;