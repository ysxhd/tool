/*
 * @Author: zhangning 
 * @Date: 2018-02-24 14:30:38 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-02-26 14:55:34
 */
import React, { Component } from 'react';
import { Button ,Checkbox } from 'antd';
import '../../css/teacher/teaWishHope.css';
import _x from '../../js/_x/index';
import { SVG } from './../base.js';

export class TeaWishHope extends Component {
  constructor(){
    super();
    this.state={
      dataList:[], //存储内容列表的数据
      newsChecked:false //是否选中
    }
    this.NewsListenChange = this.NewsListenChange.bind(this);  //单选
    this.onCheckAll = this.onCheckAll.bind(this); //全选
  }
 //组件挂载前获取数据 
 getWishHope(){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/get_teacher_message',
    data: {
      classId: this.props.clsId
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //更新父组件的数据
    that.props.changeData("clsH",ret.data);
  });
}

//点击通过、不通过当前点击的dom消失  1表示审核通过 ，2 审核不通过
passOrNo(e){
    var cont = e.target.firstChild.innerHTML,
        id = e.target.parentNode.dataset.id,
        that = this;
    if(cont === "通 过"){
        this.clwPsNoFun(id,1);
    }else if(cont === "不通过"){
        this.clwPsNoFun(id,2);
    }
}

//点击通过执行ajax
clwPsNoFun(id,num){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/audit_teacher_message',
    data: {
      id: id,
      status:num
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //审核成功重新请求数据
    if(ret.result){
      that.getWishHope();
    }
  });
}

// 单选框
NewsListenChange(){
    this.setState({
        newsChecked:!this.state.newsChecked
    })
}

//全选
onCheckAll(){
  
}


  render(){
      var data,
          dataId;
      data = this.props.data;
      if (data) {
         dataId = data.id;
      }
    return (
      <div className="zn-teaContBox2">
        {/* 数据没有获取时 */}
        {/* {!data ? <img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
          :""
          } */}
           {/* <div className="zn-wishHope-edit">
              <Checkbox onChange={this.onCheckAll} checked={this.state.dataList.length ? this.state.ids.length === this.state.dataList.length ? true : false:false} >全选</Checkbox>
              <Button onClick={this.addNews}>批量通过</Button>
              <Button disabled={this.state.ids.length ? false : true} onClick={this.batchDelNew}>批量不通过</Button>
          </div> */}
          <ul className='zn-wishHope-con'>
                <li>
                    <span>
                        <Checkbox checked={this.state.newsChecked} onClick={this.NewsListenChange}></Checkbox>
                    </span>
                    <div className="zn-wishHope-bod">
                      王羲之
                    </div>
                    <div className="zn-wishHope-body">
                          <p>sdkjfhskjdfhskdj说的发生的机会福克斯的计划开发速度和空间</p>
                          <ul className="passOrNo">
                              <li >通过</li>
                              <li>不通过</li>
                          </ul>
                    </div>
                </li>
                <li>
                    <span>
                        <Checkbox checked={this.state.newsChecked} onClick={this.NewsListenChange}></Checkbox>
                    </span>
                    <div className="zn-wishHope-bod">
                      王羲之
                    </div>
                    <div className="zn-wishHope-body">
                          <p>sdkjfhskjdfhskdj说的发生的机会福克斯的计划开发速度和空间</p>
                          <ul className="passOrNo">
                              <li >通过</li>
                              <li>不通过</li>
                          </ul>
                    </div>
                </li>
          </ul>
      </div>
    );
  }
}