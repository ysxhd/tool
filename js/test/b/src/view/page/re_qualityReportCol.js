/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:57:34 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:20:07
 * 课堂质量报表-学院报表
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import CollegeTable from '../components/report/college_table';
import PerfectScrollbar from 'react-perfect-scrollbar';

class QuaReportCol extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <CollegeTable comp="课堂质量学院报表"></CollegeTable>
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default QuaReportCol;