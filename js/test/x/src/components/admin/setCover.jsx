/*
 * @Author: JudyC 
 * @Date: 2018-01-19 15:38:15 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:06:10
 * 设置封面组件
 */
import React, { Component } from 'react';
import {IMG} from '../base';
import {Select, Pagination} from 'antd';
import {success} from './index';
import _x from '../../js/_x/index';
import {G} from '../../js/g.js';
import '../../css/admin/setCover.css';

const Option = Select.Option;

export class SetCover extends Component {
  constructor(){
    super();
    this.state = {
      data:[],          //图片数据
      // pageSize:20,      //数据每页条数
      current:1,        //当前页数
      disabSet:false,   //设置封面禁用
    };
    this.pageSize = 20; //数据每页条数
    this.uid = '';      //事记id
    this.total = 0;     //total总数
    this.selectNumArr = [10,20,50,100];
  };

  componentDidMount(){
    if(this.props.uid){
      this.uid = this.props.uid;
    }
    this.getData(1);
  };

  /**
   * 获取图片列表
   */
  getData = (page) => {
    let req = {
      action:'api/web/information/manager_deed/picture_page',
      data:{
        uid:this.uid,
        pageIndex:page,
        pageSize:this.pageSize
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let data = [];
        ret.data.pageContent.map(dt=>{
          data.push({
            uid:dt.uid,
            pictureAddress:dt.pictureAddress?G.serverUrl+dt.pictureAddress:'',
            isCover:dt.isCover
          });
        });
        this.total = ret.data.totalElements;
        this.setState({
          data
        });
      }
    });
  };

  /**
   * 每页多少条
   */
  sltChange = (value) => {
    this.setState({
      // pageSize: value,
      current:1
    });
    this.pageSize = value;
    this.getData(1);
  };

  /**
   * 页数改变
   */
  onChange = (page) => {
    this.setState({
      current:page
    });
    this.getData(page);
  };

  /**
   * 上一页下一页样式
   * @param {*} current 
   * @param {*} type 
   * @param {*} originalElement 
   */
  itemRender(current, type, originalElement){
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };

  /**
   * 设置封面
   */
  setCover = (uid) => {
    this.setState({
      disabSet:true
    });
    var that = this;
    let req = {
      action:'api/web/information/manager_deed/cover_picture',
      data:{
        uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        success('设置封面成功',1500);
        that.props.getData(1);
      }
      this.setState({
        disabSet:false
      });
    });
    this.props.hideModalSet();
  }

  render(){
    return (
      <div className="cjy-sc"> 
        {
          this.state.data.map(dt => (
            <div key={dt.uid} className={`cjy-sc-imgBox ${dt.isCover?'cjy-sc-cover':''} ${this.state.disabSet===true?'cjy-sc-disabled':''}`} onClick={() => this.setCover(dt.uid)}>
              <IMG src={dt.pictureAddress}/>
            </div>
          ))
        }
        <div className="cjy-sc-pageBox">
          <div className="cjy-sc-selectPgsz">
            <span>共{this.total}条数据，每页</span>
            <Select defaultValue={this.selectNumArr[1]} style={{width: 80}} onChange={ this.sltChange }>
              {
                this.selectNumArr.map(slt => (
                  <Option key={slt} value={slt}>{slt}</Option>
                ))
              }
            </Select>
            <span>条</span>
          </div>
          <Pagination current={this.state.current} defaultPageSize={this.selectNumArr[1]} total={this.total} onChange={this.onChange} itemRender={this.itemRender}></Pagination>
        </div>
      </div>
    )
  }
}