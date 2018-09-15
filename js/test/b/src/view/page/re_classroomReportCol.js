/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:04:28 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-13 14:24:27
 * 课堂秩序报表-学院报表
 */
import React from 'react';
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import { Container } from './../common';
import CollegeTable from '../components/report/college_table';
import PerfectScrollbar from 'react-perfect-scrollbar';

class ClsReportCol extends React.Component {
  render() {
    return (
      <Container>
        <TopMenu />
        <ReportMenu />
        <PerfectScrollbar>
          <div className='zq-report-container'>
            {
              sessionStorage.isShowdetail ?
                (JSON.parse(sessionStorage.isShowdetail) ?
                  <CollegeTable comp="课堂秩序学院报表"></CollegeTable> :
                  <div className='zq-report-nodates'>
                    <img src={require('./../../img/tishi.png')} alt="" />
                    <p>没有报表中心权限</p>
                    <p>点击左上角按钮进入 "可视化中心"</p>
                  </div>

                )
                : null
            }
          </div>
        </PerfectScrollbar>
        {/* <PerfectScrollbar>
          <div className='zq-report-container'>
            <CollegeTable comp="课堂秩序学院报表"></CollegeTable>
          </div>
        </PerfectScrollbar> */}
      </Container>
    );
  }
}

export default ClsReportCol;