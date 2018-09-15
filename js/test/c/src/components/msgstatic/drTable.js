/*
 * @Author: hf 
 * @Date: 2018-05-17 12:38:22 
 * @Last Modified by: hf
 * @Last Modified time: 2018-05-17 13:09:25
 */

import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table, Button, } from 'antd';
import { Container } from '../common';
import { G, _x } from './../../js/index';
const { Column } = Table;
const ajax = _x.util.request.request;
export class DrTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      orgLevel: 0,//机构级别
      hostOrgs: '',//当前机构
      orgname: '',//机构名字
      parentName: '',//父级机构名字
    }
  }

  componentWillReceiveProps(nextProps) {
    var { curExamid, curOrgcode } = { ...nextProps.condition };
    // var examId = this.state.examid;
    // var orgcodeValue = this.state.orgcodeValue;
    if (curExamid.id && curOrgcode.value && curExamid.id) {
      var isLeaf = false;
      if (curOrgcode.type == 4) {
        isLeaf = true
      }
      this.getData(curOrgcode.value, curExamid.id, isLeaf)
      this.setState({
        // orgcodeValue: curOrgcode.value,
        examid: curExamid.id,
        isLeaf: isLeaf,
        orgLevel: 0,
        parentName: {
          0: curOrgcode.label
        }
      })
    }

  }

  /**
   * 下钻
   * @param {机构代码} orgC 
   * @param {是否下钻} has 
   * @param {机构名字} orgN 
   */
  handleJumpNext(orgC, has, orgN) {
    var orgLevel = this.state.orgLevel;
    var parentName = this.state.parentName;
    if (has) {
      orgLevel++;
      parentName[orgLevel] = orgN;
      this.getData(orgC);
      this.setState({
        orgLevel: orgLevel,
        orgname: orgN,
        arentName: parentName,
      })
    } else {
      return false;
    }
  }

  /**
   * 获取对应机构数据
   * @param {* 机构代码} orgC 
   *  @param {考试计划ID} examid 
   *  @param {考点判断} isLeaf true:是，false:不是
   */
  getData(orgC, examid, isLeaf) {
    console.log(this.state.isLeaf)
    this.setState({
      loading: true
    });
    var bLeaf = false;
    if (typeof isLeaf === 'undefined') {
      bLeaf = this.state.isLeaf;
    } else {
      bLeaf = isLeaf
    }

    ajax(
      'data_count/count_list',
      {
        "org_code": orgC,//机构id
        "exam_id": examid || this.state.examid,//考试计划id
        "isLeaf": bLeaf,//机构是否是叶子节点(考点true, 其他false)
      },
      (res) => {
        this.setState({
          datas: res.data.listResult,
          hostOrgs: orgC,
          loading: false,
        })
      })
  }

  /**
   * 返回上级
   */

  backToUp(code) {
    var orgLevel = this.state.orgLevel;
    var hostOrgs = this.state.hostOrgs;
    var hostIndex = hostOrgs.lastIndexOf('.');
    hostOrgs = hostOrgs.substr(0, hostIndex);
    this.getData(hostOrgs);
    this.setState({
      orgLevel: orgLevel - 1,
      orgname: this.state.parentName[orgLevel - 1]
    })
  }

  render() {
    let state = this.state;
    return (
      <Container>
        {
          this.state.orgLevel === 0
            ?
            ''
            :
            <div className="lxx-g-po-search">
              <a className="lxx-m-poIcon" onClick={this.backToUp.bind(this)}>
                <svg className="icon" aria-hidden="true" >
                  <use xlinkHref="#icon-back"></use>
                </svg>
                <span>{this.state.orgname}</span>
              </a>
            </div>
        }
        <Table className="lxx-tablebox" key="table" pagination={false}
          dataSource={state.datas} loading={state.loading} rowKey="org_code">
          <Column title="机构名称" dataIndex="org_name" key="org_name" render={(text, record) => {
            var styleColor;
            if (record.org_type) { //可下钻
              styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline' };
            } else {
              styleColor = { color: '#575757' };
            }
            return <div style={styleColor} className="hf-table-overflow" onClick={this.handleJumpNext.bind(this, record.org_code, record.org_type, record.org_name)}>{text}</div>
          }}></Column>
          <Column title="应下发考点数" dataIndex="all_exam" key="all_exam"></Column>
          <Column title="已下发考点数" dataIndex="get_exam" key="get_exam"></Column>
          <Column title="应下发人数" dataIndex="all_person" key="all_person"></Column>
          <Column title="已下发人数" dataIndex="get_person" key="get_person"></Column>
        </Table>
      </Container>


    )
  }
}