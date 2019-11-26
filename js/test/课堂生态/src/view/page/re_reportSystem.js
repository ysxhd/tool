/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:06:22 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-07 11:08:21
 * 报告中心-系统报告
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import {Container} from './../common';
import ReportSystem from './../components/report/znReportSystem'
import PerfectScrollbar from 'react-perfect-scrollbar';

class RepSystem extends React.Component {
  render() {
    return (
      <Container>
      <TopMenu />
      <ReportMenu />
      <PerfectScrollbar>
      <div className='zq-report-container'>
             <ReportSystem/>
      </div>
      </PerfectScrollbar>
    </Container>
    );
  }
}

export default RepSystem;
