/*
 * @Author: kyl 
 * @Date: 2018-05-16 14:32:47 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-05-30 16:44:03
 */

import React, { Component } from 'react'
import './../../css/exam_after_result.css';
import { Table, Icon, Divider ,Spin} from 'antd';
import { G, _x } from '../../js/index';

const ajax = _x.util.request.request;
export default class ExamAfterResult extends Component {
  constructor(props){
    super(props)
    this.state={
        loading:false,
        data:[],
        planName: '',
        orgName: '',
        orgCode: '',
        examId: '',
        isShow: false
    }
  }

  getData(examId,orgCode) {
    this.setState({
      loading: true
    })
    ajax("get_finish_exstu_count", {
      "orgCode": orgCode,
      "examplanID": examId,
    }, (res) => {
      if (res.result && res.data) {
        var data = res.data;
        this.setState({
            data
        })
      }else{
        this.setState({ 
            data:[]
        }) 
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.exmOrg.curExamid.id !== this.state.examId || nextProps.exmOrg.curOrgcode.value !== this.state.orgCode) {
        if(!!nextProps.exmOrg.curExamid.id && !!nextProps.exmOrg.curOrgcode.value) {
            let examId = nextProps.exmOrg.curExamid,
              orgCode = nextProps.exmOrg.curOrgcode;
          // 获取对应机构数据
          this.getData(examId.id, orgCode.value);
          // 更新组件state
          this.setState({
              examId: examId.id,
              orgCode: orgCode.value,
              planName: examId.name,
              orgName: orgCode.label
          })
        }
    }
}


     /* 收缩展开 */
  showHide() {
      this.setState({
          isShow: !this.state.isShow
      })
  }
  
  // componentDidUpdate() {
  //     // 考试计划或机构变更时，更新对应数据
  //     if(this.props.exmOrg.curExamid.id !== this.state.examId || this.props.exmOrg.curOrgcode.value !== this.state.orgCode) {
  //         if(!!this.props.exmOrg.curExamid && !!this.props.exmOrg.curOrgcode.value) {
  //             let examId = this.props.exmOrg.curExamid,
  //                 orgCode = this.props.exmOrg.curOrgcode;
  //             // 获取对应机构数据
  //             this.getData(examId.id, orgCode.value);
  //             // 更新组件state
  //             this.setState({
  //                 examId: examId.id,
  //                 orgCode: orgCode.value,
  //                 planName: examId.name,
  //                 orgName: orgCode.label
  //             })
  //         }

  //     } 
  // }

  render() {
    let state = this.state; 
    let sdata = [];
    state.data ? sdata = state.data:"";
    let height =  sdata.length * 26+"px";
    return (
      <div>
        <div className="lxx-g-text">
        {
            sdata.length > 0 ? <svg className="icon lxx-m-meg" aria-hidden="true" onClick={this.showHide.bind(this)}>
                                 <use xlinkHref={!state.isShow ? '#icon-down' : '#icon-up'}></use>
                               </svg>:
                               ""
        }
                <h2>{state.planName}</h2>
                <h2>{state.orgName} 考后验证统计简报</h2>
          <div style={state.isShow ? {height:height}:{} }  className={!state.isShow ? 'hideVi' : 'showVi'}>
          {
            sdata.length ? sdata.map((item,i) =>{
                
             return  <p key={i}>第{item.examNum}场验证统计汇报&nbsp;:&nbsp;验证通过数<b>&nbsp;{item.passNum}&nbsp;</b>人,
              未通过数<b>&nbsp;{item.notPassNum}&nbsp;</b>人,未验证数<b>&nbsp;{item.unverified}&nbsp;</b>人,入场进度<b>&nbsp;{item.progressRate}%</b>。</p>
            }):""
          }

          </div>
        </div>
      </div>
    )
  }
}
