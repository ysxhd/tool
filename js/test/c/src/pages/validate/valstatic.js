import React, { Component } from 'react';
import Exam_After_Result from '../../components/validate/exam_after_result';
import Text_After_Result from '../../components/validate/text_result'
import ExamPlan from '../../components/examPlan';
import ValidateTongJi from '../../components/validate/validateTongJi';
import ValidateTongJiDetail from '../../components/validate/validateTongJiDetail';
import ExamAfterTableDetail from '../../components/validate/exam_after_table_detail';
import ExamAfterTable from '../../components/validate/exam_after_table';
import StaticAlertModal from '../../components/validate/static_alert_modal';
import { G } from '../../js/index';
import { Tabs } from 'antd';

const TabPane = Tabs.TabPane;
export class ValStatic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeId: Number(G.initOrginfo.org_type_id),
      typeId2: Number(G.initOrginfo.org_type_id),
      orgname: '', // 机构名称
      orgname2: '', // 机构名称
      parentName: '',//父级机构名字
      parentName2: '',//父级机构名字
      orgLevel: 0, // 机构层级
      orgLevel2: 0, // 机构层级
      curOrgCode: '',// 当前机构
      curOrgCode2: '',// 当前机构
      bfOrgCode: '',
      bfOrgCode2 : '',
      isJump: false,
      isJump2: false,
      isDetail: true,
      isDetail2: true,
      props: {
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
      examTimeList: G.curExamTime
    }
    // console.log(newProps)
    console.log(this.state.typeId2)
    this.setState({
      props: {
        ...newProps
      },
      isJump: false,
      isJump2: false,
    })
  }
  openChildModal(condition) {
    console.log("弹窗调用入参：", condition);
    this.refs.alertMoadl.openModal(condition);
    
  }

  setSet(obj) {
    this.setState(obj)
  }
  render() {

    let state = this.state, _this = this;
    return (
      <div className='mj-mc-manconfirm'>
        {/* <button onClick={this.openChildModal.bind(_this, { id: "3I293K", type: 0, orgname: "南京市鼓楼区第二中学", orgcode: "sgg5543da", examTime: "4be9026e3", exmaId: "00041026e3" })}>展开组件测试按钮</button> */}
        <ExamPlan planChan={this.changeProps.bind(this)} type={3}></ExamPlan>
        <Tabs defaultActiveKey="1">
          <TabPane tab='考中验证统计' key="1">
            <div className="lxx-g-content">
              <div>
                <Text_After_Result  exmOrg={state.props}></Text_After_Result>
              </div>
              <div className="lxx-g-table">
                {
                  state.typeId === 4 && !state.isDetail
                    ?
                    <ValidateTongJiDetail
                     exmOrg={state.props} 
                     bfOrgCode={state.bfOrgCode} 
                     parentName={state.parentName}
                     orgName={state.orgname}
                     orgLevel={state.orgLevel}
                     typeId={state.typeId}
                     curOrgCode={state.curOrgCode}
                     planId={G.exam}
                     examList={G.curExamTime}
                     setSet={this.setSet.bind(this)} 
                     openChildModal={this.openChildModal.bind(_this)} />
                    :
                    <ValidateTongJi
                        isDetail={state.isDetail}
                        typeId={state.typeId} 
                        exmOrg={state.props} 
                        bfOrgCode={state.bfOrgCode}  
                        parentName={state.parentName}
                        orgName={state.orgname}
                        orgLevel={state.orgLevel}
                        isJu={this.state.isJump}
                        setSet={this.setSet.bind(this)}/>
                }
              </div>
            </div>

          </TabPane>
          <TabPane tab='考后结果统计' key="2">
            <div className="lxx-g-content">
              <div>
                <Exam_After_Result  exmOrg={state.props}></Exam_After_Result>
              </div>
              <div className="lxx-g-table">
                {
                  state.typeId2 === 4&& !state.isDetail2
                    ?
                    <ExamAfterTableDetail
                     {...this.state.props}
                     exmOrg={state.props} 
                     bfOrgCode={state.bfOrgCode2} 
                     parentName={state.parentName2}
                     orgName={state.orgname2}
                     orgLevel={state.orgLevel2}
                     typeId={state.typeId2}
                     curOrgCode={state.curOrgCode2}
                     planId={G.exam}
                     examList={G.curExamTime}
                     setSet={this.setSet.bind(this)} 
                     openChildModal={this.openChildModal.bind(_this)} />
                    :
                    <ExamAfterTable
                      {...this.state.props}
                      isDetail={state.isDetail2}
                      typeId={state.typeId2} 
                      exmOrg={state.props} 
                      bfOrgCode={state.bfOrgCode2}  
                      parentName={state.parentName2}
                      orgName={state.orgname2}
                      orgLevel={state.orgLevel2}
                      isJu={this.state.isJump2}
                      setSet={this.setSet.bind(this)}
                      curOrgcode={state.curOrgCode2} />
                }
              </div>
            </div>
          </TabPane>
        </Tabs>
        <StaticAlertModal ref="alertMoadl"  {...this.state.props} type={1} />
      </div>
    )
  }
}