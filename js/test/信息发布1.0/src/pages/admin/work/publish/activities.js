/*
 * @Author: JCheng.Liu 
 * @Date: 2018-01-12 16:16:24 
 * @Last Modified by: JCheng.Liu
 * @Last Modified time: 2018-02-02 15:44:45
 */
import "../../../../css/admin/activities.css";
import React, { Component } from 'react';
import { Panel } from './../../index';
import { Route, Link, Switch, withRouter, Redirect } from 'react-router-dom';
import { VoteActivities, RegActivities} from '../../index';
export class Activities extends Component {
  constructor(){
    super();
  }
  render(){
    return(
      <Panel>
        <div className="ljc-activities" >
          <div className="ant-tabs-nav" >
            <Route path='/admin/work/publish/activities/:target/' component={Vote} />
          </div>
          <div className="ljc-ac-body" >
            <Switch>
              <Route path='/admin/work/publish/activities/vote' component={VoteActivities} />
              <Route path='/admin/work/publish/activities/reg' component={RegActivities} />
              <Redirect to='/admin/work/publish/activities/vote' />
            </Switch>
          </div>
        </div>
      </Panel>
    )
  }
}

class Vote extends Component{
  constructor(){
    super();
    this.state = {
      curTab:'vote',
    }
  }

  componentDidMount(){
    var target = this.props.match.params.target;
    this.setState({
      curTab: target
    })
  }

  changeTab = curTab =>{
    this.setState({
      curTab: curTab
    })
  }

  render(){
    return(
      <div>
        <Link to='/admin/work/publish/activities/vote' >
          <div className={`ant-tabs-tab ${this.state.curTab === 'vote' ? 'ljc-ac-active' : ''}`} onClick={() => this.changeTab('vote')} >投票活动</div>
        </Link>
        <Link to='/admin/work/publish/activities/reg' >
          <div className={`ant-tabs-tab ${this.state.curTab === 'reg' ? 'ljc-ac-active' : ''}`} onClick={() => this.changeTab('reg')} >报名活动</div>
        </Link>
      </div>
    )
  }
}
