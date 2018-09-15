/*
 * @Author: JC.liu 
 * @Date: 2018-04-29 21:17:32 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-11 16:44:34
 */
import React, { Component } from 'react';
import '../../../css/absent_supervise/comprehensive.css'
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import Unverified_router from './unverified_router';
import Verified_router from './verified_router'

export default class Compare_router extends Component{
  render(){
    return(
      <div>
        <div>
            <Route path='/absent_supervise/absent_compare/compare_absent/:target/' component={Tab} />
        </div>
        <div>
          <Switch>
            <Route path='/absent_supervise/absent_compare/compare_absent/unverified' component={Unverified_router} />
            <Route path='/absent_supervise/absent_compare/compare_absent/verified' component={Verified_router} />
            <Redirect to='/absent_supervise/absent_compare/compare_absent/unverified' />
          </Switch>
        </div>
      </div>
    )
  }
}

class Tab extends Component{
  constructor(){
    super();
    this.state = {
      curTab: 'unverified',
    }
  }


  componentDidMount(){
    var target = this.props.match.params.target;
    this.setState({
      curTab:target
    })
  }

  changeTab=(value)=>{
    this.setState({
      curTab: value
    })
  }

  render(){
    return(
      <div className="zn-flex">
        <Link to='/absent_supervise/absent_compare/compare_absent/unverified' >
          <div className={`ant-tabs-tab zn-tab ${this.state.curTab === 'unverified' ? 'zn-tab-blue' : ''}`} onClick={()=>this.changeTab('unverified')} >未验证且现场无缺考</div>
        </Link>
        <Link to='/absent_supervise/absent_compare/compare_absent/verified' >
          <div className={`ant-tabs-tab zn-tab ${this.state.curTab === 'verified' ? 'zn-tab-blue' : ''}`} onClick={()=>this.changeTab('verified')} >已验证且现场缺考</div>
        </Link>
      </div>
    )
  }
}