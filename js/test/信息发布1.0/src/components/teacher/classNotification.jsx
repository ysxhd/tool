/*
 * @Author: zhangning 
 * @Date: 2018-01-11 13:39:00 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-20 11:14:21
 */
import React, { Component } from 'react';
import '../../css/teacher/teaClassNotification.css';
import _x from '../../js/_x/index';

export class TeaClassNotification extends Component {
  constructor(){
    super();
    this.state={
      dataList:[] //存储内容列表的数据
    }
  }
  

  //组件挂载前获取数据 
  getClsNotify(){
    var that = this;
    let req = {
      action: 'api/web/teacher_class_brand_management/get_class_inform',
      data: {
        classId: this.props.clsId
      }
    }
    _x.util.request.formRequest(req, function (ret) {
            //将时间戳转换为日期
      ret.data.map((item) => {
        var createTime = new Date(item.createTime);
        item.createTime = _x.util.date.format(createTime, 'yyyy-MM-dd HH:mm:ss');
      });
      //更新父组件的数据
      that.props.changeData("clsN",ret.data);
    });
  }
//点击通过、不通过,当前点击的dom消失  1表示审核通过 ，2 审核不通过
  passOrNo(e){
      var cont = e.target.innerHTML,
          id = e.target.parentNode.dataset.id,
          that = this,
          thisLi;
      if(cont === "通过"){
          this.clwPsNoFun(id,1);
      }else if(cont === "不通过"){
          this.clwPsNoFun(id,2);
      }
  }

  //点击通过执行ajax
  clwPsNoFun(id,num){
    var that = this;
    let req = {
      action: 'api/web/teacher_class_brand_management/audit_class_inform',
      data: {
        id: id,
        status:num
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      //审核成功重新请求数据
      if(ret.result){
        that.getClsNotify();
      }
    });
  }
  
    render(){
      var data = this.props.data;
      if(data){
        //将时间戳转换为日期
          data.map((item) => {
          var createTime = new Date(item.createTime);
          item.createTime = _x.util.date.format(createTime, 'yyyy-MM-dd HH:mm:ss');
        });
      }
      return (
        <div className="zn-teaContBox">
          
             {/* 无数据时 */}
                 {
                   !data.length ? <img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
                   :
                   <ul className="zn-b-activity-cont">
                   {
                    // 有数据循环输出
                    data.map((item,index)=>{
                      var id = item.id;
                      return  <li className="zn-b-activity-detail zn-b-notice-con0" key={index}>
                                 
                                      <h6>{item.title}</h6>
                                      <p className="zn-b-activity-neirong" title={item.content}>{item.content}</p>
                                      <p>{item.createTime}</p>
                            
                                  <ul className="passOrNo" data-id={item.id} onClick={(e) => this.passOrNo(e)}>
                                      <li>通过</li>
                                      <li>不通过</li>
                                  </ul>
                            </li>
                    })
                  }
                  </ul>
                 }
        </div>
      );
    }
  }