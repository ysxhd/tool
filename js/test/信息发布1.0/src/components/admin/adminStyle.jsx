/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:25:42 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:04:39
 * 教师学生风采组件
 */
import React, { Component } from 'react';
import { SVG, IMG } from '../base';
import { Link } from 'react-router-dom';
import {confirmDia,success} from './index';
import _x from '../../js/_x/index';
import '../../css/admin/schoolStory.css';
import '../../css/admin/adminStyle.css';

export class AdminStyle extends Component {
  constructor(){
    super();
    this.state = {
      listVis:false,          //下拉框是否可见
      total:0,                //相册中总图片数目
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
   * 编辑按钮
   */
  editActive = (uid,e) => {
    e.preventDefault();
    this.props.showModalEdit(uid);
  };

  /**
   * 删除按钮
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
    this.props.getData(1);
  }

  mouseLeave=()=>{
    this.setState({
      listVis: false
    })
  }

  render(){
    const data = this.props.data;
    const type = this.props.type;
    return (
      <div className="cjy-ss cjy-as"  onMouseLeave={this.mouseLeave}> 
        <Link to={`/admin/work/publish/story/${type==='0'?'tea':'stu'}/in/${data.uid}`}>
          <div className="cjy-ss-coverBox cjy-as-coverBox">
            <IMG src={data.coverAddress}/>
            <div className="cjy-ss-dropBox">
              <ul className={`ant-dropdown-menu ${this.state.listVis?'cjy-ss-block':'cjy-ss-none'}`}>
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
            <span className="cjy-as-total">{data.total}</span>
          </div>
          <div className="cjy-ss-title cjy-as-title cjy-ellip">{data.title}</div>
        </Link>
      </div>
    );
  }
}