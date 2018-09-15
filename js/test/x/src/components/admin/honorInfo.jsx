/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:31:09 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-19 09:51:48
 * 荣誉组件
 */
import '../../css/admin/honorInfo.css';
import React, { Component } from 'react';
import { SVG, IMG } from "../base";
import { Button, Checkbox, Pagination, Select, Tabs, Card } from "antd";
import { confirmDia, RegCount, error, success } from './index.js';
import _x from '../../js/_x/index';
const Option = Select.Option;

export default class HonorInfo extends Component {
  constructor(){
    super();
    this.state={
      toolDownShow:"none",//操作栏下拉按钮显示
      toolListShow:"none",//操作栏下拉菜单显示
      toolDownClick:false,//下拉按钮 被点击
      iconTopBgColor:"",//右上角icon的背景色

    }
    this.toolSlidDown = this.toolSlidDown.bind(this);
    this.del = this.del.bind(this);
  }

  getDelData(type,ids){
    let _this =this;
    let req ={
      action:'api/web/information/manager_honor/delete',
      data:{
        "ids":ids,
      }
    }
    _x.util.request.formRequest(req,function(rep){
      if(rep.result){
        // 更新组件
        // 1 班级  2老师 3学生
        if(type === 1){
          _this.props.claRender(null, null, null)
        }else if(type === 2){
          _this.props.teaRengder(null,null,null)
        }else if(type === 3){
          _this.props.stuRengder(null, null, null)
        }
      }
    })
  }

  // 操作栏的鼠标移入事件
  toolSlidDown(e){
    e.stopPropagation()
    if (this.state.toolListShow=="none"){
      this.setState({
        toolListShow: "block",
        // toolDownClick:true
      })
    }else if(this.state.toolListShow=="block"){
      this.setState({
        toolListShow:"none",
        // toolDownClick: false
      })
    }
  }

  del(){
    confirmDia({
      title: '信息提示',
      content: '确认要删除该文件吗？',
      className: 0,
      okText: "删除",
      fnOK: function () {
        let id = [];
        id.push(this.props.data.uid)
        if (this.props.belongType === 1) {
          // 执行删除函数 1班级 2教师 3学生
          this.getDelData(1, id);
        } else if (this.props.belongType === 2) {
          this.getDelData(2, id);
        } else if (this.props.belongType === 3) {
          this.getDelData(3, id);
        }
      }.bind(this),
      fnCancel: function () {
      }.bind(this)
    })


   
  }

  render(){
    // 1 是 奖杯 2是奖牌 3是红花 4是红旗
    const iconTopBgColor = {
      background: 
      this.props.data.honorType === 1 
      ? "#ff9934" 
      : this.props.data.honorType === 2 
      ? "#ff9934" 
      : this.props.data.honorType === 3 
      ? "#ff6767" 
      : this.props.data.honorType === 4 
      ? "#ff6767" 
      : "#ff9934"
    }
    const toolListDown ={
      display: this.state.toolDownShow,
    }
    const  toolListShow ={
      display: this.state.toolListShow,
    }
    return (
      <div className="ljc-hninfo-ctn" onMouseLeave={() => this.setState({ toolDownShow: "none", toolListShow:"none"})} onMouseOver={() => this.setState({ toolDownShow:"block"})} >
        <div className="ljc-hninfo-hntags" key={this.props.data.uid}  >
          <div className="ljc-hninfo-info" >
            <ul>
              <li>
                {
                  this.props.belongType === 1
                  ?       
                  <div className="ljc-hninfo-pos"  >
                    <div className="ljc-hninfo-cIbg" > 
                      <SVG type={this.props.data.honorType === 1 ? "trophy" : this.props.data.honorType === 2 ? "medal" : this.props.data.honorType === 3 ? "flower" : "banner"} width="60px" height="60px" color="#ff6767" />
                    </div>
                  </div>
                  :
                  this.props.belongType === 2
                  ?
                  <div className="ljc-hninfo-icon" >
                    <SVG type="teacher" width="100px" height="100px" />
                    <div className="ljc-hninfo-itop" style={iconTopBgColor} >
                      <SVG type={this.props.data.honorType === 1 ? "trophy-w" : this.props.data.honorType === 2 ? "medal-w" : this.props.data.honorType === 3 ? "flower" : "banner"} width="28px" height="28px" color="#ffffff" />
                    </div>
                  </div>
                  :
                  this.props.belongType === 3
                  ?
                  <div className="ljc-hninfo-icon">
                    <SVG type="man" width="100px" height="100px" />
                    <div className="ljc-hninfo-itop" style={iconTopBgColor} >
                      <SVG type={this.props.data.honorType === 1 ? "trophy-w" : this.props.data.honorType === 2 ? "medal-w" : this.props.data.honorType === 3 ? "flower" : "banner"} width="28px" height="28px" color="#ffffff" />
                    </div>
                  </div>
                  : ""
                }
              </li>
              <li>
                <div className="ljc-hninfo-tit" >{this.props.data.title}</div>
              </li>
              <li >
                <span className="ljc-hninfo-span" >共{this.props.data.total}个</span>
              </li>
            </ul>

            {/* tool down */}
            <div className="ljc-hninfo-tdown" onClick={this.toolSlidDown} style={toolListDown} >
              <SVG type="down" color="#ff9934" />
            </div>

            {/* tool */}
            <div className="ljc-hninfo-tool" style={toolListShow}  >
              <div className="ljc-hninfo-tmenu" >
                <ul>
                  <li onClick={()=>this.props.showModal(1,this.props.data.uid)}>编辑</li>
                  <li onClick={this.del} >删除</li> 
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}