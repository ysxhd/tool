/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:48:32
 * 值日发布组件
 */
import React, { Component } from 'react';
import { SVG } from '../base.js';
import { Tag, Modal, Button, Popover } from 'antd';
import { StuSet } from './index.js';
import _x from '../../js/_x/index.js';
import '../../css/student/stuPubDuty.css';

const weekDay = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export class StuPubDuty extends Component {
  constructor(props){
    super(props);
    this.state = {
      showAdd: false,
      showSetModal: false,
      studentList: [],
      choiceStuList: [],
      addDutyTime: "",
      curStuDutyData: []
    };
    this.curStuDutyData = [];
  }

  componentWillMount() {
    let data = this.props.curStuDutyData;
    this.setState({
      curStuDutyData: data
    })
    this.curStuDutyData = data;
  }

  // 鼠标滑过显示添加图标
  mouseOverShow(i) {
    let ad = document.querySelectorAll('div.lxx-wk-m-add');
    let al = document.querySelectorAll('.lxx-wk-g-cnt>div');
    ad[i].style.display = 'block';
    al[i+ 1].style.paddingTop = '30px';
  }
  // 鼠标移出
  mouseOutHide(i){
    let ad = document.querySelectorAll('div.lxx-wk-m-add');
    let al = document.querySelectorAll('.lxx-wk-g-cnt>div');
    ad[i].style.display = 'none';
    al[i+1].style.paddingTop = '0px';
  }

  // 显示设置学生弹窗
  showModalStuChoice(obj){
    if(obj.fl){
      // ajax请求该班学生列表
      let pr = {
        action: "api/web/teacher_class_brand_management/get_my_students",
        data: {
          classId: this.props.classId,
          name: ""
        }
      }
      _x.util.request.formRequest(pr, (res) => {
          let data = res.data;
          if(!data){
            this.setState({
              studentList : []
            }, () =>{
              let time = this.props.curStuDutyData[obj.index].dutyTime;
              this.setState({
                showSetModal: true,
                addDutyTime: time
              })
            })
          } else {
            this.setState({
              studentList: data
            }, () =>{
              let time = this.props.curStuDutyData[obj.index].dutyTime;
              this.setState({
                showSetModal: true,
                addDutyTime: time
              })
            })
          }
          
      })
    }
  }

  handleCancelModel(){
    this.setState({
      showSetModal: false,
    });
  }

  /**
   * 接收设置学生子组件弹窗所选学生
   * @param {* 子组件所选学生数组} data 
   */
  getChoiceDutyStuList(data){
    let t = this.state.addDutyTime,
      dutyList = this.state.curStuDutyData;
    for(let i in dutyList){
      if(t == dutyList[i].dutyTime){
        if(!dutyList[i].dutyStudent){
          dutyList[i].dutyStudent = data;
        } else {
          var list = dutyList[i].dutyStudent;
          // 剔除值日列表已存在学生数据
          for(let n in list){
            for(let j in data){
              if(data[j].id == list[n].id){
                data.splice(j,1)
              }
            }
          }
          // 添加至对应值日列表
          for(let n in data){
            dutyList[i].dutyStudent.push({
              "name": data[n].name,
              "id": data[n].id
            })
          }

        }
      }
    }
    this.setState({
      curStuDutyData: dutyList
    })
    this.curStuDutyData = dutyList;
  }

  /**
   * 删除当前周内的值日学生
   * @param {* 所删除值日学生所在周几列表} ind
   * @param {* 所删除值日学生下标} i
   * @param {* 所删除值日学生id} d 
   * @param {* 所删除值日学生所在日期} t
   */
  delTag(ind, i, d, t){
    let data = this.state.curStuDutyData;
    // var deId = data[ind].dutyStudent[i].id;
    data[ind].dutyStudent.splice(i,1);
    this.setState({
      curStuDutyData: data
    })
  }

  // 修改父组件的state值
  setSet(obj) {
    this.setState(obj);
  }
  

  componentDidUpdate() {
    if (this.props.curStuDutyData !== this.curStuDutyData) {
      this.curStuDutyData = this.props.curStuDutyData;
    }
  }

  render(){
    let data = this.state.curStuDutyData;
    let weekOrder = parseInt(data[0].weekOrder),
      weekStart = _x.util.date.format(new Date(data[0].dutyTime), 'yyyy-MM-dd'),
      weekEnd = _x.util.date.format(new Date(data[6].dutyTime), 'yyyy-MM-dd');
      
    return (
      <div> 
        <p className="lxx-dt-g-til"><span>第{weekOrder}周</span><span>{weekStart} ~ {weekEnd}</span></p>
        <div className="lxx-dt-g-week">
          <div className="lxx-wk-g-top">
            <div></div>
            {
              weekDay.map(function(item, index){
                return(
                  <div key={index} onMouseOver={this.mouseOverShow.bind(this, index)} onMouseOut={this.mouseOutHide.bind(this, index)}>
                    {item}
                    <div 
                      className="lxx-wk-m-add" 
                      onClick={this.showModalStuChoice.bind(this, {fl: true, index: index})}>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={"#icon-add"}></use>
                      </svg>
                      <span>添加</span>
                    </div>
                  </div>
                )
              }.bind(this))
            }
          </div>
          <div className="lxx-wk-g-cnt">
            <div className="lxx-wk-m-no">
              <SVG type="brush" />
              <span>值日</span>
            </div>
            {
              data.map(function(item, index){
                let stuList = item.dutyStudent;
                return(
                  <div key={index} onMouseOver={this.mouseOverShow.bind(this, index)} onMouseOut={this.mouseOutHide.bind(this, index)}>
                    {
                      stuList
                      ?
                      stuList.map(function(list, i){
                        return(
                          <div key={i} className="lxx-tag lxx-wk-m-tag" value={list.id}>
                            <span>{list.name}</span>
                            <svg className="icon" aria-hidden="true" onClick={this.delTag.bind(this, index, i, list.id, data[index].dutyTime)}>
                                <use xlinkHref={"#icon-cross" }></use>
                            </svg>
                          </div>
                        )
                      }.bind(this))
                      :
                      ""
                    }
                  </div>
                )
              }.bind(this))
            }
          </div>
        </div>

        <Modal
          title="班级成员"
          visible={this.state.showSetModal}
          width={900}
          maskClosable={false}
          destroyOnClose={true}
          className="lxx-g-dialog lxx-cho-g-dia"
          footer={false}
          onCancel={this.handleCancelModel.bind(this)}
        > 
          <StuSet 
            classId={this.props.classId}
            stuData={this.state.studentList} 
            stuListChange={this.getChoiceDutyStuList.bind(this)}
            setSet={this.setSet.bind(this)}/>
        </Modal>
      </div>
    );
  }
}