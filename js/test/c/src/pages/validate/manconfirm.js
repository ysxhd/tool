import React, { Component } from 'react';
import { Tabs } from 'antd';
import { G } from './../../js/index';
import ExamPlan from './../../components/examPlan';
import NotManconfirn from './../../components/validate/not_manconfirm';
import YetManconfirn from './../../components/validate/yet_manconfirm';
import VerifyInfo from './../../components/verify_info/verify_info';
import './../../css/manconfirm.css';
const TabPane = Tabs.TabPane;

export class ManConfirm extends Component {
  constructor() {
    super();
    this.state = {
      props: {},
      sele: false,
      tabIndex: '1'
    }
    this.changeProps = this.changeProps.bind(this)
  }

  changeProps() {
    let newProps = {
      curExamid: G.exam,
      curOrgcode: G.curOrgTree,
      curExamTime: G.curExamTime
    }
    this.setState({
      props: {
        ...newProps
      }
    })
  }
  render() {
    const { seleData, tabIndex } = this.state
    return (
      <div className='mj-mc-manconfirm'>
        <ExamPlan planChan={this.changeProps} type={2}></ExamPlan>
        <Tabs activeKey={tabIndex} onChange={(tabIndex) => this.setState({ tabIndex })}>
          <TabPane tab='已验证' key="1">
            {tabIndex === '1' ? <YetManconfirn {...this.state.props} /> : ''}
          </TabPane>
          <TabPane tab='未验证' key="2">
            {tabIndex === '2' ? <NotManconfirn {...this.state.props}></NotManconfirn> : ''}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}