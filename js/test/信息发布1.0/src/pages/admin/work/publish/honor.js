/*
 * @Author: JCheng.Liu 
 * @Date: 2018-01-23 14:45:54 
 * @Last Modified by: JCheng.Liu
 * @Last Modified time: 2018-02-02 15:42:03
 */
import "../../../../css/admin/honor.css";

import React, { Component } from 'react';

import { Panel } from './../../index';

import { Route, Link, Switch, withRouter, Redirect } from 'react-router-dom';

import { VoteActivities, RegActivities } from '../../index';

import HonorClassBox from "../../../../components/admin/honorClassBox";
import HonorTeaBox from "../../../../components/admin/honorTeaBox";
import HonorStuBox from "../../../../components/admin/honorStuBox";

export class Honor extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="ljc-honor" >
        <Panel>
          <div className="ljc-honor" >
            <div className="ant-tabs-nav" >
              <Route path='/admin/work/publish/honor/:target/' component={Class} />
            </div>
            <div className="ljc-ac-body" >
              <Switch>
                <Route path='/admin/work/publish/honor/class' component={HonorClassBox} />
                <Route path='/admin/work/publish/honor/teacher' component={HonorTeaBox} />
                <Route path='/admin/work/publish/honor/student' component={HonorStuBox} />
                <Redirect to='/admin/work/publish/honor/class' />
              </Switch>
            </div>
          </div>
        </Panel>
      </div>
    )
  }
}

class Class extends Component {
  constructor() {
    super();
    this.state = {
      curTab: 'class',
    }
  }

  componentDidMount() {
    var target = this.props.match.params.target;
    this.setState({
      curTab: target
    })
  }

  changeTab = curTab => {
    this.setState({
      curTab: curTab
    })
  }

  render() {
    return (
      <div>
        <Link to='/admin/work/publish/honor/class' >
          <div className={`ant-tabs-tab ${this.state.curTab === 'class' ? 'ljc-ac-active' : ''}`} onClick={() => this.changeTab('class')} >荣誉班级
          </div>
        </Link>

        <Link to='/admin/work/publish/honor/teacher' >
          <div className={`ant-tabs-tab ${this.state.curTab === 'teacher' ? 'ljc-ac-active' : ''}`} onClick={() => this.changeTab('teacher')} >荣誉教师</div>
        </Link>

        <Link to='/admin/work/publish/honor/student' >
          <div className={`ant-tabs-tab ${this.state.curTab === 'student' ? 'ljc-ac-active' : ''}`} onClick={() => this.changeTab('student')} >荣誉学生</div>
        </Link>
      </div>
    )
  }
}
