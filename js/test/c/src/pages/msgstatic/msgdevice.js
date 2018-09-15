/*
 * @Author: lxx 
 * @Date: 2018-05-16 14:34:38 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-05-23 16:46:18
 */

import React, { Component } from 'react';
import { Container } from './../../components/common';
import { StaticTable } from './../../components/msgstatic/staticTable';
import { PointTable } from './../../components/msgstatic/pointTable';
import { MsgText } from './../../components/msgstatic/msgText';
import ExamPlan from '../../components/examPlan';
import { G } from '../../js/index';
import './../../css/msgdevice.css';

export class MsgDevice extends Component {
  constructor(props) {
    super(props);
    // console.log(G)
    this.state = {
      typeId: 1,
      curOrgCode: '',
      // orgCode: '',
      // examId: '',
      bfOrgCode: '', // 当前机构
      orgLevel: 0, // 机构层级
      orgname: '', // 机构名称
      parentName: '',//父级机构名字
      isJump: false,
      props: {
        curExamid: '',
        curOrgcode: '',
        examTimeList: ''
      },
      isDetail: true
    }
  }
  componentDidMount(){

  }
  changeProps() {
    let newProps = {
      curExamid: G.exam,
      curOrgcode: G.curOrgTree,
      examTimeList: G.examTimes
    }
    this.setState({
      props: {
        ...newProps
      },
      isJump: false
    })
  }

  setSet(obj) {
    this.setState(obj)
  }

  render() {
    let state = this.state;
    return (
      <Container>
        <div>
          <ExamPlan planChan={this.changeProps.bind(this)} type={1} />
        </div>
        <div className="lxx-g-content">
          <MsgText exmOrg={state.props} />
          <div className="lxx-g-table">
            {
              state.typeId === 4 && !state.isDetail
                ?
                <PointTable 
                  typeId={state.typeId} 
                  exmOrg={state.props} 
                  bfOrgCode={state.bfOrgCode} 
                  parentName={state.parentName}
                  orgName={state.orgname}
                  orgLevel={state.orgLevel}
                  setSet={this.setSet.bind(this)} />
                :
                <StaticTable 
                  typeId={state.typeId} 
                  exmOrg={state.props} 
                  bfOrgCode={state.bfOrgCode}  
                  parentName={state.parentName}
                  orgName={state.orgname}
                  orgLevel={state.orgLevel}
                  isJu={state.isJump}
                  isDetail={state.isDetail}
                  setSet={this.setSet.bind(this)} />
            }
          </div>
        </div>
      </Container>

    )
  }
}