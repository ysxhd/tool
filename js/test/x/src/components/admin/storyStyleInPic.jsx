/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:17:37 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:07:13
 * 事迹风采内部照片组件
 */
import React, { Component } from 'react';
import {IMG, SVG} from '../base';
import {Checkbox} from 'antd';
import {confirmDia,success} from './index';
import _x from '../../js/_x/index';
import '../../css/admin/storyStyleInPic.css';

export class StoryStyleInPic extends Component {
  constructor(){
    super();
    this.state = {
      listVis:false,          //下拉框是否可见
      checked: false,         //是否选中
      picData:{},             //数据
      preVis:false,           //图片预览组件
      disabSet:false,         //设置封面禁用
    }
  };

  componentWillReceiveProps(nextProps){
    if(nextProps.ids.indexOf(nextProps.picData.uid)===-1){
      this.setState({
        checked: false
      });
    }else{
      this.setState({
        checked: true
      });
    }
  }

  /**
   * 操作栏是否显示
   */
  listVis = (e) => {
    e.stopPropagation();
    if(this.state.listVis==false){
      this.setState({
        listVis: !this.state.listVis
      })
    }else{
      this.setState({
        listVis: !this.state.listVis
      })
    }
    
  };

  /**
   * 编辑活动
   */
  editActive = (uid,e) => {
    e.stopPropagation();
    this.props.showModalEdit(uid);
  };

  /**
   * 设置封面
   */
  setCover = (uid,e) => {
    var that = this;
    e.stopPropagation();
    this.setState({
      disabSet:true
    });
    let req = {
      action:'api/web/information/manager_deed/cover_picture',
      data:{
        uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        success('设置封面成功',1500);
        this.props.getPicData(1);
        this.props.getData();
      }
      this.setState({
        disabSet:false
      });
    });
  };

  /**
   * 删除按钮
   */
  del = (uid,e) => {
    e.stopPropagation();
    confirmDia({
      title:'信息提示',
      content:'确定要删除吗？',
      className:0,
      okText:'确定',
      fnOK:() => {
        let req = {
          action:'api/web/information/manager_deed/delete_picture',
          data:{
            ids:[uid]
          }
        };
        _x.util.request.formRequest(req,(ret)=>{
          if(ret.result){
            success('删除成功',1500);
            this.props.getPicData(1);
          }
        });
      },
      fnCancel:() => {
      }
    })
  };

  /**
   * 选中栏改变
   */
  listOnChange = (uid,e) => {
    this.props.listOnChange(uid,e.target.checked);
  };

  /**
   * 阻止复选框冒泡事件
   */
  clickCheck = (e) => {
    e.stopPropagation();
  }
  mouseLeave=()=>{
    this.setState({
      listVis: false
    })
  }

  render(){
    const picData = this.props.picData
    return (
      <div className="cjy-ssip"> 
        <div className={`cjy-ssip-picBox ${picData.isCover?'cjy-ssip-cover':''}`} onMouseLeave={this.mouseLeave} >
          <IMG src={picData.pictureAddress?picData.pictureAddress:require('../../img/baby.png')}/>
          {
            picData.isCover
            ? ''
            : <Checkbox checked={this.state.checked} onChange={(e)=>this.listOnChange(picData.uid,e)} onClick={this.clickCheck}/>
          }
          <div className="cjy-ssip-dropBox">
            {
              picData.isCover
              ? 
              <ul className={`ant-dropdown-menu ${this.state.listVis?'cjy-ssip-block':'cjy-ssip-none'}`}>
                <li className="ant-dropdown-menu-item" onClick={(e)=>this.editActive(picData.uid,e)} >
                    编辑信息
                </li>
              </ul>
              : 
              <ul className={`ant-dropdown-menu ${this.state.listVis?'cjy-ssip-block':'cjy-ssip-none'}`}>
                <li className="ant-dropdown-menu-item" onClick={(e)=>this.editActive(picData.uid,e)}>
                    编辑信息
                </li>
                <li className={`ant-dropdown-menu-item ${this.state.disabSet===true?'cjy-ssip-disabled':''}`} onClick={(e) => this.setCover(picData.uid,e)}>
                    设为封面
                </li>
                <li className="ant-dropdown-menu-item" onClick={(e) => this.del(picData.uid,e)}>
                    删除
                </li>
              </ul>
            }
            <span className="cjy-ssip-drop" onClick={this.listVis}><SVG type="down"/></span>
          </div>
        </div>
        <div className="cjy-ellip cjy-ssip-picTitle">{picData.title}</div>
      </div>
    );
  }
}