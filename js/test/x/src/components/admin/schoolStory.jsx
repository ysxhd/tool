/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:13:03 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 18:17:32
 * 校园事迹组件
 */
import React, { Component } from 'react';
import { SVG, IMG } from '../base';
import { Link } from 'react-router-dom';
import {confirmDia,success} from './index';
import _x from '../../js/_x/index';
import '../../css/admin/schoolStory.css';

export class SchoolStory extends Component {
  constructor(){
    super();
    this.state = {
      listVis:false,          //下拉框是否可见
    }
  };

  /**
   * 操作栏是否可见
   */
  listVis = (e) => {
    e.preventDefault();
    this.setState({
      listVis: !this.state.listVis
    })
  };

  /**
   * 编辑事记
   */
  editActive = (uid,e) => {
    e.preventDefault();
    this.props.showModalEdit(uid);
  };

  /**
   * 删除事记
   */
  del = (uid,e) => {
    e.preventDefault();
    confirmDia({
      title:'信息提示',
      content:'删除后相册内的照片将全部删除,确定要删除该相册吗？',
      className:0,
      okText:'确定',
      width:550,
      fnOK:() => {
        let req = {
          action:'api/web/information/manager_deed/delete',
          data:{
            ids:[uid]
          }
        };
        _x.util.request.formRequest(req,(ret)=>{
          if(ret.result){
            success('删除成功',1500);
            this.props.getData(1);
          }
        });
      },
      fnCancel:() => {
      }
    })
  };

  /**
   * 设置封面
   */
  setCover = (uid,e) => {
    e.preventDefault();
    this.props.showModalSet(uid);
  }

  mouseLeave=()=>{
    this.setState({
      listVis: false
    })
  }

  render(){
    const data = this.props.data;
    return (
      <div className="cjy-ss" onMouseLeave={this.mouseLeave}> 
        <Link to={`/admin/work/publish/story/campus/in/${data.uid}`}>
          <div className="cjy-ss-coverBox">
            <IMG src={data.coverAddress}/>
            {/* <Checkbox/> */}
            <div className="cjy-ss-dropBox">
              <ul className={`ant-dropdown-menu ${this.state.listVis?'cjy-ss-block':'cjy-ss-none'}`} >
                <li className="ant-dropdown-menu-item" onClick={(e)=>this.editActive(data.uid,e)}>
                  编辑风采
                </li>
                <li className="ant-dropdown-menu-item" onClick={(e)=>this.setCover(data.uid,e)}>
                  设置封面
                </li>
                <li className="ant-dropdown-menu-item" onClick={(e)=>this.del(data.uid,e)}>
                  删除
                </li>
              </ul>
              <span className="cjy-ss-drop" onClick={this.listVis}><SVG type="down"/></span>
            </div>
          </div>
          <div className="cjy-ss-title cjy-ellip">{data.title}</div>
          <div className="cjy-ss-des">{data.description}</div>
          <div className="cjy-ss-time">{data.recordDate}</div>
        </Link>
      </div>
    );
  }
}