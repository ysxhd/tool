/*
 * @Author: JCheng.L 
 * @Date: 2018-04-10 15:36:08 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 16:09:39
 * 缺考 -> 缺考综合处置
 */
import React, { Component } from 'react';
import '../../../css/absent_supervise/comprehensive.css'
import { Select ,Table} from 'antd';
import { Switch, Route, Redirect,Link } from 'react-router-dom';
import { Comprehensive , ComprehensiveNext , ComprehensiveChild } from "../../../components/absent_supervise/index";


class AbsentDispose extends Component {
  
  render() {
    const path = this.props.match.path;
    return (
      <div>
        <Switch>
          <Route exact path={`${path}/out`} component={Comprehensive} />
          <Route exact path={`${path}/out/:id`} component={ComprehensiveNext} />
          <Route path={`${path}/in/:id`} component={ComprehensiveChild} />
          <Redirect to={`${path}/out`} ></Redirect>
        </Switch>
      </div> 
    );
  }
}

export default AbsentDispose;