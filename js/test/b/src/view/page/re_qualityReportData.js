/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:57:34 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:20:31
 * 课堂质量报表-原始数据
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import InitDataTable from '../components/report/initData_table';
import PerfectScrollbar from 'react-perfect-scrollbar';

class QuaReportData extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <InitDataTable comp="课堂质量原始数据"></InitDataTable>
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default QuaReportData;