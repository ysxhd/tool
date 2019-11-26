/*
 * @Author: lxx 
 * @Date: 2018-08-28 10:06:22 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-10 13:03:45
 * 报告中心-自定义报告
 */
import React from 'react';
import '../../css/znReport.css'
import ZnReportHead from './../components/report/znReportHead'
import ZnReportTable from './../components/report/znReportTable'
import TopMenu from './../components/base/topMenu';
import ReportMenu from './../components/base/reportMenu';
import {Container} from './../common';
import PerfectScrollbar from 'react-perfect-scrollbar';

class RepCustom extends React.Component {

  constructor(){
    super();
    this.state = {
      width:""
    }
  }

  componentDidMount(){
    let box = this.tablebox.clientHeight;
    this.setState({
      width: box - 222
    })
  }

  render() {
    return (
      <Container>
      <TopMenu />
      <ReportMenu />
      <PerfectScrollbar>
      <div className='zq-report-container'>
      <div ref={(ref) => this.tablebox = ref} className="zn-bg">
          <ZnReportHead/>
          <ZnReportTable wid={this.state.width}/>
      </div>
      </div>
      </PerfectScrollbar>
    </Container>

    );
  }
}

export default RepCustom;
