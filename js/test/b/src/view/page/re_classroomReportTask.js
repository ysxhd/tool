/*
 * @Author: lxx 
 * @Date: 2018-08-28 13:57:34 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:17:33
 * 课堂秩序报表- 任务报表
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import TaskTable from '../components/report/task_table';
import PerfectScrollbar from 'react-perfect-scrollbar';

class ClsReportTask extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            <TaskTable comp="课堂秩序任务报表"></TaskTable>
          </div>
        </PerfectScrollbar>
      </Container>
    );
  }
}

export default ClsReportTask;