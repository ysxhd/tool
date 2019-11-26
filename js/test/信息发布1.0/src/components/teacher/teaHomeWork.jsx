/*
 * @Author: zhangning 
 * @Date: 2018-01-15 09:38:16 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-14 11:28:37
 */
import React, { Component } from 'react';
import { Button  } from 'antd';
import '../../css/teacher/teaClsSpecial.css';
import _x from '../../js/_x/index';

export class TeaHomeWork extends Component {
  constructor(){
    super();
    this.state={
      dataList:[] //存储内容列表的数据
    }
  }
 //组件挂载前获取数据 
 getHomeWork(){
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
      that.getHomeWork();
    }
  });
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
        {!data ? <img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
          :
          <div className="zn-b-teaClsSpecial-cont">
              <div className="zn-b-teaClsSpecial-bg">
                  <pre>{data.teacherMessage}</pre>
              </div>
              <div className="zn-b-duty-btn" data-id={dataId} onClick={this.passOrNo.bind(this)}><Button>通过</Button><Button>不通过</Button></div>
          </div>}
      </div>
    );
  }
}