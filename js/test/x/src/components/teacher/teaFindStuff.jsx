/*
 * @Author: zhangning 
 * @Date: 2018-01-12 09:34:00 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-21 13:23:39
 */
import React, { Component } from 'react';
import '../../css/teacher/teaFindStuff.css';
import _x from '../../js/_x/index';

export class TeaFindStuff extends Component {
    constructor(){
        super();
        this.state={
          dataList:[]  //存储内容列表的数据
        }
      }
 //组件挂载前获取数据 
 getClsFind(){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/get_lost_and_found',
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
    that.props.changeData("clsF",ret.data);
  });
}

//点击通过、不通过当前点击的dom消失  1表示审核通过 ，2 审核不通过
passOrNo(e){
    var cont = e.target.innerHTML,
        id = e.target.parentNode.dataset.id,
        that = this,
        thisLi;
  // window.setTimeout(() => {
  //   thisLi.style.cssText = "left:4000px;height:0;opacity:0;border:0;margin:0;padding:0;";
  // }, 300);
    thisLi = e.target.parentNode.parentNode;
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
    action: 'api/web/teacher_class_brand_management/audit_lost_and_found',
    data: {
      id: id,
      status:num
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //审核成功重新请求数据
    if(ret.result){
      that.getClsFind();
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
               !data.length ?<img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
               :
                <ul className="zn-b-findStuff-cont">
                {
                    data.map((item,index)=>{
                        // type:3表示失物招领，4表示寻物启示
                        return <li key={index} className="zn-b-findStuff-detail">
                            <h6><span style={item.type == 3?{ backgroundColor: '#ba7ff5' }:{backgroundColor: '#3ebbfa'}}>{item.type == 3?'失物招领':'寻物启示'}</span> {item.title}</h6>
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