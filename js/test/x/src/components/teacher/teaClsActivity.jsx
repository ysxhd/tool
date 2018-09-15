/*
 * @Author: zhangning 
 * @Date: 2018-01-12 09:34:00 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:34:45
 */
import React, { Component } from 'react';
import '../../css/teacher/teaClsActivity.css';
import _x from '../../js/_x/index';

export class TeaClsActivity extends Component {
  constructor(){
    super();
    this.state={
      dataList:[]  //存储内容列表的数据
    }
  }
   
 //组件挂载前获取数据 
 getClsActivity(){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/get_class_vote',
    data: {
      classId: this.props.clsId
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //更新父组件的数据
    that.props.changeData("clsA",ret.data);
  });
}

//点击通过、不通过当前点击的dom消失  1表示审核通过 ，2 审核不通过
passOrNo(e){
    var cont = e.target.innerHTML,
        id = e.target.parentNode.dataset.id,
        that = this,
        thisLi;
        thisLi = e.target.parentNode.parentNode;
    if(cont === "通过"){
         this.clwPsNoFun(id,1,thisLi);
    }else if(cont === "不通过"){
        this.clwPsNoFun(id,2,thisLi);
    }
}

componentDidMount(){
}

//点击通过执行ajax
clwPsNoFun(id,num,thisLi){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/audit_class_vote',
    data: {
      id: id,
      status:num
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //审核成功重新请求数据
    if(ret.result){
       that.getClsActivity();
    }
  });
}
  
  render(){
    var data = this.props.data;
    if(data){
      //将时间戳转换为日期
        data.map((item) => {
        var startTime = new Date(item.startTime);
        var endTime = new Date(item.endTime);
        var createTime = new Date(item.createTime);
        item.startTime = _x.util.date.format(startTime, 'yyyy-MM-dd HH:mm:ss');
        item.endTime = _x.util.date.format(endTime, 'yyyy-MM-dd HH:mm:ss');
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
                 data.map((item,index)=>{
                     let status="";  //投票状态： 0表示未开始，1表示正在进行，2表示已结束。
                     if(item.status == 1){
                         status = "正在进行";
                     }else if(item.status == 2){
                         status = "已结束";
                     }else{
                          status = "未开始";
                     }
                     return <li key={index} className="zn-b-activity-detail">
                                <h6>{item.title}</h6>
                                <p className="zn-b-activity-neirong" title={item.content}>{item.content}</p>
                                <p>{item.createTime}</p>
                                <p className="zn-b-activity-p">投票项 ： {item.choice.map((value,i)=>{
                                   return <span key={i}>{i+1} .{value.choiceName}</span>
                                })}</p>
                                <p>投票期限 ： {item.startTime} 至 {item.endTime} &nbsp;({status})</p>
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