/*
 * @Author: zhangning 
 * @Date: 2018-01-10 13:41:26 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-27 10:42:54
 */
import React, { Component } from 'react';
import '../../css/teacher/teaLeft.css';
import { SVG } from './../base.js';
import { Modal } from 'antd';
import { TeaModal } from './index.js';
import _x from '../../js/_x/index';


export class TeaLeft extends Component {
  constructor(props){
    super(props);
    this.state = {
      select:null,//被选中的学生
      monitorId:"",//monitorId传递给子组件
      showAdd: false,
      showSetModal: false,
      studentList: [],//存储所有的学生
      clsId:"",//班级ID
      monitor: null,  //班长信息
    };
    this.curStuDutyData = [];
  }

    // 显示设置学生弹窗
    showModalStuChoice(obj){
      if(obj.fl){
        this.setState({
          showSetModal: true,

        })
      }
    }


  //获取班长信息
  getMonitor(){
    if(!this.props.clsId){
      return;
    }
        var that = this; 
        let req = {
            action:'api/web/teacher_class_brand_management/get_monitor_name',
            data:{
              classId:this.props.clsId
            }
        }
        _x.util.request.formRequest(req,function(ret){
          that.setState({
            monitor: ret.data
          })

    });
  }

 //请求所有学生的数据
  getMyStudent() {
    var that = this;
    that.setState({
      studentList: []
    }, () => {
    
      //请求所有学生的数据
      let req = {
        action: 'api/web/teacher_class_brand_management/get_my_students',
        data: {
          classId: this.props.clsId
        }
      }
      _x.util.request.formRequest(req, function (ret) {
        if (ret.result) {
          that.setState({
            studentList: ret.data,
            select:null,
            monitorId:null
          }, () =>{
            for (let i = 0; i < ret.data.length; i++) {
              //存储之前选中的班长被选中
              if (ret.data[i].monitorId) {
                that.setState({
                  monitorId: ret.data[i].monitorId,
                  select: i
                })
              }
            }
          });

        }
      });
    });

  }

   componentDidUpdate(){
    // 如果班级切换那么重新请求数据
    if(this.state.clsId != this.props.clsId){
        this.setState({clsId: this.props.clsId})  //重设当前班级Id
        this.getMyStudent();  //获取学生
        this.getMonitor();   //获取班长
    }
  }
 //模态框关闭
  handleCancelModel(){
    this.setState({
      showSetModal: false,
      select:null,
      clsId:""
    });
  }

   // 修改父组件的state值
   setSet(obj) {
    this.setState(obj);
  }

  //子组件搜索学生设置班牌
  stuSearch(data){
    this.setState({
      studentList:data
    })
  }

  render(){
    let data = this.state.monitor;//班长的存储数据
    let result=null;
    if(data){
        let name = data.monitorName,//学生名字
            img='',//svg
            sex = parseInt(data.sex);//学生姓名
        if (!sex) {
          img = <SVG type="female-o" />;
        } else {
          img = <SVG type="male-o" />;
        }
      
      //求出选中后的学生信息
       result = <div className="zn-bp-paizi">{img}
                  <h4>{name}</h4>
                  <p onClick={this.showModalStuChoice.bind(this, {fl: true})}>修改班牌管理员</p></div>;
    }
    return (
      <div> 
          <div className="zn-bp-cont">
          {!data?
            <div className="zn-bp-paizi">
                <SVG type="portrait"/>
                <p onClick={this.showModalStuChoice.bind(this, {fl: true})}>设置本班班牌管理员</p>
            </div>
            :
                result
            }
           
             
          <Modal
            title="设置管理员"
            visible={this.state.showSetModal}
            width={900}
            maskClosable={false}
            className="lxx-g-dialog lxx-cho-g-dia"
            footer={false}
            onCancel={this.handleCancelModel.bind(this)}
          >
            <TeaModal
              monitorId={this.state.monitorId}
              select={this.state.select}
              clsId={this.props.clsId}
              stuData={this.state.studentList}
              stuSearch={data => this.stuSearch(data)}
              setSet={this.setSet.bind(this)} 
              />
          </Modal>
          </div>
      </div>
    );
  }
}