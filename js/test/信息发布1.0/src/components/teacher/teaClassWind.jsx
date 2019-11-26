/*
 * @Author: zhangning 
 * @Date: 2018-01-11 13:39:00 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-23 10:37:28
 */
import React, { Component } from 'react';
import '../../css/teacher/teaClassWind.css';
import _x from '../../js/_x/index';
import { Spin } from 'antd';
import { G } from '../../js/g';
import { SVG } from './../base.js';
import MaskLayer from '../shared/maskLayer';
import {PreviewPic} from '../admin/index'
import {error} from './../../components/student/index'

export class TeaClassWind extends Component {
  constructor(){
    super();
    this.state={
      bigPic:true, //放大图片是否显示
      load:false, //loading是否显示
      dataList:[],  //存储内容列表的数据
      clsId:"" ,//存储班级ID
      picSrc:'',            //图片预览url
      ab:"",
      picSrcList:[],        //图片src列表
    }
    this.srcIndex = 0;      //当前展示src
  }

  //组件挂载前获取数据 
  getClsWind(){
    var that = this;
    let req = {
      action: 'api/web/teacher_class_brand_management/get_class_style',
      data: {
        classId: this.props.clsId
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      that.setState({load:false});
      //更新父组件的数据
      that.props.changeData("clsW",ret.data);
    });
  }

//点击通过、不通过当前点击的dom消失  1表示审核通过 ，2 审核不通过
  passOrNo(e){
      var cont = e.target.innerHTML,
          id = e.target.parentNode.dataset.id,
          that = this,
          thisLi;
      if(cont === "通过"){ 
        that.clwPsNoFun(id,1);
      }else if(cont === "不通过"){
          this.clwPsNoFun(id,2);
      }
  }

  //点击通过执行ajax
  clwPsNoFun(id,num){
    var that = this;
    this.setState({load:true});
    let req = {
      action: 'api/web/teacher_class_brand_management/audit_class_style',
      data: {
        id: id,
        status:num
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      //审核成功重新请求数据
      if(ret.result){
        that.getClsWind();
      }
    });
  }

  //点击图片放大
  bigPic(id){
    this.getAllPic(id);
  }


  //获取所有的图片
  getAllPic(id){
  
    var that = this;
    let req = {
      action: 'api/web/monitor_class_for_students/class_style/find_class_style',
      data: {
        id: id
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      //审核成功重新请求数据
      if(ret.result){
        that.setState({
          picSrcList:ret.data.images
        },()=>{
          if(!that.state.picSrcList.length){
            error("没有风采图片",1000);
            return;
          }
          that.srcIndex = 0;
          var span =  document.createElement('span');
          var left =  document.createElement('span');
          var right =  document.createElement('span');
          var img =  document.createElement('img');
          var div =  document.createElement('div');
          var box =  document.createElement('div');
          img.src = G.serverUrl + that.state.picSrcList[that.srcIndex];
          span.className="zn-cls-g-delete"
          div.className="zn-cls-g-bgipic";
          box.className="zn-screenModal2";
          left.className="zn-cls-g-left";
          right.className="zn-cls-g-right";
          img.className="zn-change-img";
      
          div.appendChild(img);
          div.appendChild(span);
          div.appendChild(left);
          div.appendChild(right);
          box.appendChild(div);
          document.body.appendChild(box);
      
          span.onclick = function () {
            document.body.removeChild(box);
          }
      
          left.onclick = function (){
            that.lastPic();
          }
      
          right.onclick = function (){
            that.nextPic();
          }
        });
      }else{
        error("没有风采图片",1000);
      }
    });
  }


  /**
   * 下一张
   */
  nextPic = () => {
    var img = document.getElementsByClassName('zn-change-img')[0];
    if(this.srcIndex===this.state.picSrcList.length - 1){
      this.srcIndex = 0;
    }else{
      this.srcIndex++;
    }
    this.setState({
      picSrc:this.state.picSrcList[this.srcIndex]
    },()=>{
      img.src=G.serverUrl + this.state.picSrc;
    });
  };

  /**
   * 上一张
   */
  lastPic = () => {
    var img = document.getElementsByClassName('zn-change-img')[0];
    if(this.srcIndex===0){
      this.srcIndex = this.state.picSrcList.length - 1;
    }else{
      this.srcIndex--;
    }
    this.setState({
      picSrc:this.state.picSrcList[this.srcIndex]
    },()=>{
      img.src=G.serverUrl + this.state.picSrc;
    });
  };

    render(){
      var data = this.props.data;

      var mypic = function() {
        return <div class="zn-screenModal2">
                    
               </div>
      }
      if(data){
        //将时间戳转换为日期
          data.map((item) => {
          var createTime = new Date(item.createTime);
          item.createTime = _x.util.date.format(createTime, 'yyyy-MM-dd HH:mm:ss');
        });
      }
      return (
        <div className="zn-teaContBox">
             <Spin style={this.state.load?{display:'block'}:{display:'none'}}/>
             
             {/* 数据没有获取时 */}
             {!data.length?<img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
                   :
                  
                 <ul className="zn-b-clw-cont">
                  {
                    // 有数据循环输出
                    data.map((item,index)=>{
                      let imgUrl = G.serverUrl + item.cover;
                      return  <li key={index}>
                          <div className='zn-b-teaPicBox'><img src={imgUrl ? imgUrl : require('./../../img/noData.png')} onClick={this.bigPic.bind(this,item.id)}/></div> 
                          <div className="zn-b-teaclsFlex">
                            <h6>{item.title}</h6>
                            <p title={item.content}>{item.content}</p>
                            <p>{item.createTime}</p>
                          </div>
                          <ul className="passOrNo" data-id={item.id} onClick={this.passOrNo.bind(this)}>
                            <li>通过</li>
                            <li>不通过</li>
                          </ul>
                         </li>
                    })
                  }
                 </ul>}
          <MaskLayer ref="myMask" />
          {
            this.state.preVis
              ? <PreviewPic src={this.state.picSrc} hidePre={this.hidePre} nextPic={this.nextPic} lastPic={this.lastPic} />
              : ''
          }
        </div>
      );
    }
  }