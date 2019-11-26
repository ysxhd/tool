/*
 * @Author: hf 
 * @Date: 2018-08-06 15:15:14 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:03
 */

import React from 'react';
import { Checkbox, Button, Radio, message } from 'antd';
import MmAutoPublicItem from './mm_autoPublic_item';
import { Container } from './../common';
import { _x } from './../../js/index';

const RadioGroup = Radio.Group;
const Request = _x.util.request.request;

export default class MmAutoPublic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      colData: [],
      value: 1, // 1 私有 2 公有
      btnVal: 0,  // 0 学院保存  1 部分自动设置保存
      trgInfos: {
        pubStatus: 0,
        trgId: '',
        trgName: '',
        autoPubUsers: []
      },
      teaCheckNum: 0, // 选择老师的数量
    }
  }
  componentDidMount() {
    this.getAutoPubConfigInfo();
  }

  /**
   * 获取学院自动发布设置数据
   */
  getAutoPubConfigInfo() {
    Request('default/sysconfig/getAutoPubTrgInfo', null, (res) => {
      if (res.result && res.data) {
        let data = res.data;
        this.setState({
          colData: data
        })
      }
    })
  }

  /**
   * 部分自动发布
   */

  partAutoPublic = (trgId) => {
    let params = {
      trgId: trgId
    }
    Request('default/sysconfig/getAutoPubTeaAndSubInfo', params, (res) => {
      if (res.result && res.data) {
        let data = res.data;
        this.setState({
          trgInfos: data
        })
      }
    })
    this.setState({
      left: -600,
      btnVal: 1
    })
  }

  /**
   * 返回
   */
  goback = () => {
    this.setState({
      left: 0,
      btnVal: 0
    })
  }

  /**
   * 共私有选择
   */
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  /**
   * 改变学院checkbox的状态
   * @param {* } trgId 学院id
   * @param {* } bol true 全选  false 取消全选
   */
  handleCheck = (trgId, bol) => {
    let colData = this.state.colData,
      value = this.state.value;
    colData.map(li => {
      if (li.trgId === trgId) {
        if (value === 1 && bol) {
          li.pubStatus = 1;
        } else if (value === 2 && bol) {
          li.pubStatus = 2;
        } else {
          li.pubStatus = 0;
        }
      }
    })
    this.setState({
      colData
    })
  }

  /**
   * 提交设置
   */
  handleSaveSet = () => {
    let btnVal = this.state.btnVal;
    if (!btnVal) {
      // 提交修改学院自动设置
      let params = {
        autoPubTrgInfos: this.state.colData
      };
      Request('default/sysconfig/updateAutoPubTrgInfo', params, (res) => {
        if (res.result && res.data) {
          message.success('设置成功');
          this.props.closeModal();
        } else {
          message.warning('设置失败');
        }
      }, () => {
        message.warning('设置失败');
      });
    } else {
      // 提交教师科目自动发布设置
      let params = this.state.trgInfos;
      // console.log(params);
      Request('default/sysconfig/updateAutoPubTeaAndSubInfo', params, (res) => {
        if (res.result && res.data) {
          message.success('设置成功');
          this.props.closeModal();
        } else {
          message.warning('设置失败');
        }
      }, () => {
        message.warning('设置失败');
      });
    }
  }

  /**
   * 全选老师
   */
  handleCheckAll = (bol) => {
    let trgInfos = this.state.trgInfos,
      value = this.state.value, teaCheckNum = this.state.teaCheckNum;
    if (bol) {
      trgInfos.pubStatus = value;
      trgInfos.autoPubUsers.map(li => {
        li.pubStatus = value;
        li.autoPubSubjects.map(it => {
          it.pubStatus = value;
        })
      })
      teaCheckNum = trgInfos.autoPubUsers.length;
    } else {
      trgInfos.pubStatus = bol;
      trgInfos.autoPubUsers.map(li => {
        li.pubStatus = 0;
        li.autoPubSubjects.map(it => {
          it.pubStatus = 0;
        })
      })
      teaCheckNum = 0;
    }
    this.setState({
      trgInfos,
      teaCheckNum
    });
  }

  /**
   * 全选该老师涉及科目
   */
  handleCheckTeacher = (bol, userId) => {
    let trgInfos = this.state.trgInfos,
      value = this.state.value,
      teaCheckNum = this.state.teaCheckNum;
    if (bol) {
      trgInfos.autoPubUsers.map(li => {
        // console.log(li.userId, userId);
        if (li.userId === userId) {
          teaCheckNum = teaCheckNum + 1;
          li.pubStatus = value;
          li.autoPubSubjects.map(it => {
            it.pubStatus = value;
          })
        }
      })
    } else {
      trgInfos.autoPubUsers.map(li => {
        if (li.userId === userId) {
          teaCheckNum = teaCheckNum - 1;
          li.pubStatus = 0;
          li.autoPubSubjects.map(it => {
            it.pubStatus = 0;
          })
        }
      })
    }
    if (teaCheckNum === trgInfos.autoPubUsers.length) {
      trgInfos.pubStatus = value;
    } else {
      trgInfos.pubStatus = 0;
    }
    this.setState({
      trgInfos,
      teaCheckNum
    })
  }

  /**
   * 选择科目
   */
  handleCheckSub = (bol, subId, userId) => {
    let trgInfos = this.state.trgInfos,
      value = this.state.value,
      teaCheckNum = this.state.teaCheckNum;
    if (bol) {
      trgInfos.autoPubUsers.map(li => {
        let status = true;
        if (li.userId === userId) {
          li.autoPubSubjects.map(it => {
            if (it.subjectId === subId) {
              it.pubStatus = value;
            }
            // console.log(it.pubStatus, value, it.pubStatus === value);
            if (it.pubStatus !== value) {
              status = false;
            }
          })
          if (status) {
            li.pubStatus = value;
            teaCheckNum = teaCheckNum + 1;
          }
        }
      })
    } else {
      trgInfos.autoPubUsers.map(li => {
        if (li.userId === userId) {
          let status = false;
          li.autoPubSubjects.map(it => {
            if (it.subjectId === subId) {
              it.pubStatus = 0;
            }
            if (it.pubStatus) {
              status = true;
            }
          })
          if (status) {
            li.pubStatus = 0;
            teaCheckNum = teaCheckNum - 1;
          }
        }
      })
    }
    if (teaCheckNum === trgInfos.autoPubUsers.length) {
      trgInfos.pubStatus = value;
    } else {
      trgInfos.pubStatus = 0;
    }
    this.setState({
      trgInfos,
      teaCheckNum
    })
  }

  render() {
    let state = this.state,
      autoPubUsers = this.state.trgInfos.autoPubUsers;
    let checkedAll;  // 选中全部老师
    if (state.trgInfos) {
      if (state.trgInfos.pubStatus === state.value) {
        checkedAll = true;
      }
    }

    return (
      <div style={{ height: 465, overflow: 'hidden' }}>
        <div className="hf-mmapi-container" style={{ left: this.state.left }}>
          <div className="hf-mmapi-box">
            <div className="hf-mmapi-flexDiv hf-mmapi-titleBar">
              <div className="hf-mmapi-adcName">按学院设置</div>
              <div>
                <RadioGroup onChange={this.onChange} value={state.value}>
                  <Radio value={1}>私有发布</Radio>
                  <Radio value={2}>公有发布</Radio>
                </RadioGroup>
              </div>
            </div>
            <div className="hf-mmapi-contentBox">
              {
                state.colData.map((items, index) => {
                  let isCheck;
                  if (items.pubStatus === state.value) {
                    isCheck = true;
                  }
                  return <div key={index} className="hf-mmapi-flexDiv">
                    <div className="hf-mmapi-adcName">{items.trgName}</div>
                    <div>
                      <Checkbox checked={isCheck} onChange={() => this.handleCheck(items.trgId, !isCheck)}>全部自动发布</Checkbox>
                    </div>
                    <div>
                      {
                        !isCheck
                          ? <Button className="lxx-s-blue" onClick={() => this.partAutoPublic(items.trgId)}>部分自动发布</Button>
                          : <Button className="lxx-s-blueUnable">部分自动发布</Button>
                      }

                    </div>
                  </div>
                })
              }
            </div>
          </div>
          <div className="hf-mmapi-box">
            <div className="hf-mmapi-flexDiv hf-mmapi-titleBar">
              <div className="hf-mmapi-adcName">
                <svg className="icon hf-mmapi-icon" aria-hidden="true" onClick={this.goback}>
                  <use xlinkHref={"#icon-goBack"}></use>
                </svg>
                {state.trgInfos.trgName || '-'} 课堂自动发布设置
              </div>
              <div>{state.value === 1 ? '私有发布' : '公有发布'}</div>
            </div>
            <div className="hf-mmapi-contentBox">
              <div className="hf-mmapi-flexList" style={{ marginTop: 15 }}><Checkbox checked={checkedAll} onChange={() => this.handleCheckAll(!checkedAll)}>选择全部老师</Checkbox></div>
              {
                autoPubUsers.map((item, index) => {
                  let subjectData = item.autoPubSubjects;
                  let teaChecked;  // 全选改老师涉及科目
                  if (item.pubStatus === state.value) {
                    teaChecked = true;
                  }
                  return <div key={index}>
                    <div className="hf-mmapi-flexList lxx-list-u-line"><Checkbox checked={teaChecked} onChange={() => this.handleCheckTeacher(!teaChecked, item.userId)}>{item.username}</Checkbox></div>
                    <div className="hf-mmapi-flexList">
                      {
                        subjectData.map((list, index) => {
                          let subChecked; // 选中科目
                          if (list.pubStatus === state.value) {
                            subChecked = true;
                          }
                          return <Checkbox key={index} checked={subChecked} onChange={() => this.handleCheckSub(!subChecked, list.subjectId, item.userId)}>{list.subName}</Checkbox>
                        })
                      }
                    </div>
                  </div>
                })
              }
            </div>
          </div>
        </div>
        <div className="hf-m-buttons">
          <Button className="lxx-s-blue hf-m-button" style={{ height: 40, width: 90 }} onClick={() => this.handleSaveSet()}>保存</Button>
        </div>
      </div>
    )
  }
}

