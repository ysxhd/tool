/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:54:07 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-04 18:58:34
 * 学生出勤报表-原始数据
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import StuRepData from './../components/report/lxx_stuRepData';
import { Container } from './../common';
import PerfectScrollbar from 'react-perfect-scrollbar';

class StuReportData extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <StuRepData />
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default StuReportData;