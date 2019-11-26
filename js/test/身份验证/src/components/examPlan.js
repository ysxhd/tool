/*
 * @Author: MinJ 
 * @Date: 2018-05-16 10:00:07
 * @Last Modified by: MinJ
 * @Last Modified time: 2018-05-21 17:39:28
 * 考试计划
 */
import React, { Component } from 'react';
import { Select, TreeSelect } from 'antd';
import _ from 'lodash';
import { G, _x } from './../js/index';
import './examPlan.css';
import { stringify } from 'zrender/lib/tool/color';
const ajax = _x.util.request.request
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

class ExamPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,  //首页1  验证统计3  人工确认2
      planCon: [],     //考试计划
      planVal: null,     //考试计划选值
      playCon: [],      //场次
      playVal: null,   //场次值
      orgCon: [],       //机构
      orgVal: null,    //机构值
    }
    this.requestPlan = this.requestPlan.bind(this);
    this.requestPlay = this.requestPlay.bind(this);
    this.requestOrg = this.requestOrg.bind(this);
    this.planChange = this.planChange.bind(this);
    this.playChange = this.playChange.bind(this)
    this.orgChange = this.orgChange.bind(this)
    this.analyData = this.analyData.bind(this)
  }
  componentWillMount() {
    this.requestPlan(0);
  }

  /**
   * 获取考试计划
   * @param {*} ifNew 是否是初始化页面 0初始化  1考试计划切换
   */
  requestPlan(ifNew) {
    const planCon1 = [
      //   { name: '考试计划1', id: '1' },
      //   { name: '考试计划2', id: '2' },
      //   { name: '考试计划3', id: '3' },
      //   { name: '考试计划4', id: '4' },
    ]
    const exams = G.exams
    let planCon = []
    if (exams.length) {
      exams.map(item => {
        planCon.push({ name: item.name, id: item.uid })
      })

      const loginType = G.initOrginfo.org_type_id
      const { type } = this.state
      const exam = G.exam;
      exam.id ? '' : G.exam = planCon[0]

      this.setState({
        planCon: planCon,
        planVal: G.exam.id
      })
      this.requestPlay(ifNew, G.exam.id)
      this.requestOrg(ifNew, G.exam.id)
    }
  }
  /**
   * 获取场次
   * @param {*} ifNew 是否是初始化页面 0初始化  1考试计划切换
   * @param {*} plan 考试计划
   */
  requestPlay(ifNew, plan) {
    const playCon1 = [
      // { name: '场次1', id: '1', num: 1, startTime: 1477808630404, endTime: 1477908630404 },
      // { name: '场次2', id: '2', num: 2, startTime: 1477808630404, endTime: 1477908630404 },
      // { name: '场次3', id: '3', num: 3, startTime: 1477808630404, endTime: 1477908630404 },
      // { name: '场次4', id: '4', num: 4, startTime: 1477808630404, endTime: 1477908630404 },
    ]
    ajax('examPlan/detail', { planId: plan }, (res) => {
      if (res.result) {
        const curExamTime = G.curExamTime
        if (res.data) {
          const playCon = res.data
          const index = _.findIndex(playCon, ['id', curExamTime.id])
          index !== -1 && ifNew === 0 ? '' : G.curExamTime = playCon[0]

          G.examTimes = playCon
          this.setState({ playCon, playVal: G.curExamTime.id }, () => this.props.planChan())
          console.log(G)
        } else {
          G.curExamTime = {}
          this.setState({ playCon: [], playVal: '' }, () => this.props.planChan())
          console.log(G)
        }
      }
    })
  }
  /**
   * 获取机构
   * @param {*} ifNew 是否是初始化页面 0初始化  1考试计划切换
   * @param {*} plan 考试计划
   */
  requestOrg(ifNew, plan) {
    const data1 = [
      // {
      //   name: "江苏省考试院",
      //   id: '32.01',
      //   type: 1,
      //   childernList: [
      //     {
      //       name: '南京市招生办公室',
      //       id: '32.01.01',
      //       type: 2,
      //       childernList: [
      //         {
      //           name: '区县招生办公室',
      //           id: '32.01.01.01',
      //           type: 3,
      //           childernList: [
      //             {
      //               name: '中学1',
      //               id: '32.01.01.01.01',
      //               type: 4,
      //             }, {
      //               name: '中学2',
      //               id: '32.01.01.01.02',
      //               type: 4,
      //             },
      //           ]
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   name: "机构222",
      //   id: "1121",
      //   type: 1,
      //   childernList: [
      //     {
      //       name: "第二机构11441",
      //       id: "1551",
      //       type: 2,
      //       childernList: [
      //         {
      //           name: "第三机构11981",
      //           id: "1115611",
      //           type: 2,
      //         },
      //         {
      //           name: "第三机构23452",
      //           id: "111983",
      //           type: 2,
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
    const loginData = G.initOrginfo
    if (loginData.org_type_id === '4') {
      const curOrgTree = { label: loginData.org_name, value: loginData.org_code, key: loginData.org_code, type: 4 }
      G.curOrgTree = curOrgTree
    } else {
      ajax('orgTree/find', { id: plan }, (res) => {
        if (res.result) {
          if (res.data.id) {
            const curOrgTree = G.curOrgTree
            const data = [res.data]
            let orgCon = this.analyData(data)
            G.orgtree = res.data

            if (curOrgTree.value && ifNew === 0) {
              this.setState({
                orgCon,
                orgVal: curOrgTree.value
              })
            } else {
              const cur = {
                label: orgCon[0].label,
                value: orgCon[0].value,
                key: orgCon[0].key,
                type: orgCon[0].type
              }
              G.curOrgTree = cur
              this.setState({
                orgCon,
                orgVal: orgCon[0].value
              }, () => this.props.planChan())
            }
            console.log(G)
          } else {
            G.curOrgTree = {}
            this.setState({ orgCon: [], orgVal: '' }, () => this.props.planChan())
            console.log(G)
          }
        }
      })
    }
  }

  // 机构数结构整理函数
  analyData = (data) => {
    return data.map(dt => {
      if (dt.childrenList.length) {
        return {
          label: dt.name,
          type: dt.type,
          value: dt.id,
          key: dt.id,
          children: this.analyData(dt.childrenList)
        }
      } else {
        return {
          label: dt.name,
          type: dt.type,
          value: dt.id,
          key: dt.id,
        }
      }
    });
  }
  //考试计划选择
  planChange(value) {
    const { planCon } = this.state
    const index = _.findIndex(planCon, ['id', value])
    G.exam = planCon[index]
    this.props.planChan()
    this.setState({ planVal: value })
    this.requestPlay(1, value)
    this.requestOrg(1, value)
  }
  //场次选择
  playChange(playVal) {
    const { playCon } = this.state
    const index = _.findIndex(playCon, ['id', playVal])
    G.curExamTime = playCon[index]
    this.props.planChan()
    this.setState({ playVal })
  }
  //机构选择
  orgChange(orgVal, label, extra) {
    // console.log(extra)
    if (extra.triggerValue !== G.curOrgTree.value) {
      const { orgCon } = this.state
      const dataRef = extra.triggerNode.props.dataRef
      const curPlan = {
        label: dataRef.label,
        type: dataRef.type,
        value: dataRef.value,
        key: dataRef.key,
      }
      G.curOrgTree = curPlan
      this.props.planChan()
      this.setState({ orgVal });
    }
  }
  //机构树
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.label} key={item.key} type={item.type} value={item.value} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.label} key={item.key} type={item.type} value={item.value} dataRef={item} />;
    });
  };

  render() {
    // console.log(G)
    const { type, planCon, planVal, playCon, playVal, orgCon, orgVal } = this.state
    const loginType = G.initOrginfo.org_type_id
    return (
      <div className='mj-ep-planContent mj-clearfix'>
        <div className='mj-ep-plan' id='area'>
          <span>考试计划：</span>
          <Select value={planVal} onChange={this.planChange}
            getPopupContainer={() => document.getElementById('area')}>
            {
              planCon.length ?
                planCon.map((item, index) => {
                  return <Option key={item.id} value={item.id} title={item.name}>{item.name}</Option>
                }) : ''
            }
          </Select>
        </div>
        {
          type === 2 || type === 3 ?
            <div className='mj-ep-play' id='play'>
              <span>场次：</span>
              <Select value={playVal} onChange={this.playChange}
                getPopupContainer={() => document.getElementById('play')}>
                {
                  playCon.length ?
                    playCon.map(item => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    }) : ''
                }
              </Select>
            </div> : ''
        }
        {
          loginType !== '4' && (type === 3 || type === 1) ?
            <div className='mj-ep-org' id='tree'>
              <span>机构：</span>
              <TreeSelect
                value={orgVal}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Please select"
                treeDefaultExpandAll
                onChange={this.orgChange}
                getPopupContainer={() => document.getElementById('tree')}
              >
                {this.renderTreeNodes(orgCon)}
              </TreeSelect>
            </div> : ''
        }
      </div>
    )
  }
}
export default ExamPlan;