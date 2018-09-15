import React, { Component } from 'react';
import ExamPlan from '../../components/examPlan';
import { G } from '../../js/index';
import { DrTable, MsgTitle } from './../../components/msgstatic/index'
import { Container } from '../../components/common';

export class MsgReady extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    props: {
      curExamid: G.exam,
      curOrgcode: G.curOrgTree,
      examTimeList: G.examTimes
    }
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
      }
    })
  }
  render() {
    return (
      <Container>
        <div>
          <ExamPlan planChan={this.changeProps.bind(this)} type={1} />
        </div>
        <div className="lxx-g-content">
          <div>
            <MsgTitle type={1}  {...this.state.props} />
          </div>
          <div className="lxx-g-table" style={{ padding: '1%' }}>
            <DrTable condition={this.state.props} />
          </div>
        </div>
      </Container>
    )
  }
}