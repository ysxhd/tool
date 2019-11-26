import React, { Component } from 'react';
import { Equipment_Condition, Preparetion_Before_Exam, Post_Examination_Statistics, In_examination } from "../../components/platoverview/index";
import ExamPlan from '../../components/examPlan';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { G } from '../../js/index';



export class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _props: {
        curExamid: '',
        curOrgcode: '',
        examTimeList: ''
      }
    }
  }



  changeProps() {
    let newProps = {
      curExamid: G.exam,
      curOrgcode: G.curOrgTree,
      examTimeList: G.examTimes
    }
    this.setState({
      _props: {
        ...newProps
      }
    })
  }

  componentDidMount() {
    this.changeProps();
  }
  render() {
    return (
      <div >
        <ExamPlan planChan={this.changeProps.bind(this)} type={1} />
        <div className="zn-bg-exam">
          {/* 设备情况 */}
          <Equipment_Condition {...this.state._props} />
          {/* 考前准备 */}
          <Preparetion_Before_Exam {...this.state._props} />
          {/* 考中 */}
          <In_examination  {...this.state._props} />
          {/* 考后准备 */}
          <Post_Examination_Statistics {...this.state._props} />
        </div>
      </div>
    )
  }
}