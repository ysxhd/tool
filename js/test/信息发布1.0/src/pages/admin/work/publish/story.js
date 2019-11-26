/*
 * @Author: JudyC 
 * @Date: 2018-01-25 10:46:19 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:08:49
 */
import React, { Component } from 'react';
import { Panel, IMG } from './../../index';
import { Route, Link, Switch, withRouter, Redirect } from 'react-router-dom';
import { StoryOut, TeaStyleOut, StuStyleOut, StoryIn, TeaStyleIn, StuStyleIn } from '../../index';
import '../../../../css/admin/story.css';

export class Story extends Component {

  render(){
    return (
      <Panel>
        <div className="cjy-story"> 
          <div className="ant-tabs-nav">
            <Route path='/admin/work/publish/story/:target/:page' component={CampusTab}/>
          </div>
          <div className="cjy-story-body">
            <Switch>
              <Route path="/admin/work/publish/story/campus/out" component={StoryOut}/>
              <Route path="/admin/work/publish/story/campus/in/:uid" component={StoryIn}/>
              <Route path="/admin/work/publish/story/tea/out" component={TeaStyleOut}/>
              <Route path="/admin/work/publish/story/tea/in/:uid" component={TeaStyleIn}/>
              <Route path="/admin/work/publish/story/stu/out" component={StuStyleOut}/>
              <Route path="/admin/work/publish/story/stu/in/:uid" component={StuStyleIn}/>
              {<Redirect to="/admin/work/publish/story/campus/out"/>}
            </Switch>
          </div>
        </div>
      </Panel>
    );
  }
}

class Campustab extends Component{
  constructor(){
    super();
    this.state = {
      curTab:'campus',         //当前tab
    };
  };

  componentDidMount(){
    var target = this.props.match.params.target;
    this.setState({
      curTab:target
    });
  };

  changeTab = (curTab) => {
    // if(curTab==='campus'){
    //   this.props.history.push('/admin/work/publish/story/campus/out');
    // }else if(curTab==='tea'){
    //   this.props.history.push('/admin/work/publish/story/tea/out');
    // }else if(curTab==='stu'){
    //   this.props.history.push('/admin/work/publish/story/stu/out');
    // }
    this.setState({
      curTab:curTab
    });
  };

  render(){
    return (
      <div>
        <Link to="/admin/work/publish/story/campus/out"><div className={`ant-tabs-tab ${this.state.curTab==='campus'?'cjy-story-active':''}`} onClick={() => this.changeTab('campus')}>校园大事记</div></Link>
        <Link to="/admin/work/publish/story/tea/out"><div className={`ant-tabs-tab ${this.state.curTab==='tea'?'cjy-story-active':''}`} onClick={() => this.changeTab('tea')}>教师风采</div></Link>
        <Link to="/admin/work/publish/story/stu/out"><div className={`ant-tabs-tab ${this.state.curTab==='stu'?'cjy-story-active':''}`} onClick={() => this.changeTab('stu')}>学生风采</div></Link>
      </div>
    );
  }
}

const CampusTab = withRouter(Campustab)