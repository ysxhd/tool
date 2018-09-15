/*
 * @Author: JC.Liu 
 * @Date: 2018-07-02 16:13:03 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-25 13:47:06
 * 操作通知
 */
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { Modal, Button } from 'antd'
import './modal.css'
const confirm = Modal.confirm;

/**
 * 操作提示框 
 * @class ModalConfrim
 * @extends {Component}
 */
class ModalConfrim extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
     this.node.className = "show";
  }

  ok = () =>{
    this.props.okFn ? this.props.okFn() : null;
    this.remove();
  }

  cancle = () =>{
    this.props.cancleFn ? this.props.cancleFn() : null
    this.remove();
  }
  //删除dom
  remove(){
    this.node.className = "hide";
    let animationEvent = this.whichAnimationEvent();  
    this.node.addEventListener(animationEvent,()=>{
      let parentNode = this.node.parentNode;
      ReactDOM.unmountComponentAtNode(parentNode)
      parentNode.parentNode.removeChild(parentNode)
      
    })
  }

  whichAnimationEvent(){
    var t,
        el = document.createElement("fakeelement");
  
    var animations = {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    }
  
    for (t in animations){
      if (el.style[t] !== undefined){
        return animations[t];
      }
    }
  }

  render() {
    return (
      <div className="zn-modal-root" ref={node => this.node = node}>
        <div className="ant-modal-mask" ></div>
        <div className="JC-global-modal" >
          <div className="JC-gm-title" >{this.props.title ? this.props.title : "操作提示"}</div>
          <div className="JC-gm-contnet" >
            <img src="../../static/warning.png" alt="" />
            <div className="JC-gm-desc" >{this.props.content ? this.props.content : "确认执行该操作？"}</div>
          </div>
          <div className="JC-gm-btn">
            <div className="JC-gm-btn-y" onClick={this.ok} >确认</div>
            <div className="JC-gm-btn-n" onClick={this.cancle}>取消</div>
          </div>
        </div>
      </div>
    )
  }
}


// 错误提示模态框
ModalConfrim.show = function (params) {
  let div = document.createElement('div');
  div.id = 'ModalConfrim';
  document.body.appendChild(div);
  ReactDOM.render(<ModalConfrim {...params} />, div);
}






class ModalSuccess extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    let timer;
    let props = this.props;
    let time = props.time || 1000; //多少s之后模态框消失
    let animationEvent = this.whichAnimationEvent();  
    this.node.className = "ant-modal-mask show";
    
    this.node.addEventListener(animationEvent,()=>{
       timer = setTimeout(() => {
        this.node.className = "ant-modal-mask hide";
        
        // 由于使用了CSS3动画，动画设定时长为1S 故1S后移除组件
        this.node.addEventListener(animationEvent,()=>{
          clearTimeout(timer);
          let parentNode = this.node.parentNode.parentNode;
          ReactDOM.unmountComponentAtNode(parentNode)
          parentNode.parentNode.removeChild(parentNode)
          
        })
      }, time);
    })
  }
  //兼容性处理
   whichAnimationEvent(){
    var t,
        el = document.createElement("fakeelement");
  
    var animations = {
      "animation"      : "animationend",
      "OAnimation"     : "oAnimationEnd",
      "MozAnimation"   : "animationend",
      "WebkitAnimation": "webkitAnimationEnd"
    }
  
    for (t in animations){
      if (el.style[t] !== undefined){
        return animations[t];
      }
    }
  }


  render() {
    return (
      <div className="zn-modal-mask-box">
        <div className="zn-modal-mask"
          ref={node => this.node = node}
        >
          <div className="JC-suc-modal" >
            <img src={this.props.flag ? require('../../static/success.png'):require('../../static/warning.png')} alt="" />
            <div>{this.props.data ? this.props.data:this.props.flag?"添加成功 !":""}</div>
          </div>
        </div>

      </div>

    )
  }
}

// 错误提示模态框
ModalSuccess.show = function (params) {
  let div = document.createElement('div');
  div.id = 'ModalSuccess';
  document.body.appendChild(div);
  ReactDOM.render(<ModalSuccess {...params} />, div);
}


export { ModalConfrim, ModalSuccess, ModalError }