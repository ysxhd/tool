/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:57:34 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:21:21
 * 课堂质量报表-教师报表
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import WjsjTable from '../components/report/wjsj_table';
import PerfectScrollbar from 'react-perfect-scrollbar';

class QuaReportTea extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <WjsjTable comp="课堂质量教师报表"></WjsjTable>
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default QuaReportTea;