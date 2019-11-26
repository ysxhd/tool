/*
 * @Author: kangyl 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:42:29
 * 在线升级——更新日志单个组件
 */
import React, { Component } from 'react';
import { UpgradeClaLogList } from './upgradeClaLogList';
import { SVG } from '../base';
import { Timeline } from 'antd';
import '../../css/admin/upgradeClaLogListCon.css';

export class UpgradeClaLogListCon extends Component {
  constructor(props) {
    super(props);
    this.state=({
      isStar:[],//是否高亮
      elHeight:[],//元素距离文档的高度
      data:[]
    })
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentWillMount(){
    // 组件加载时将属性赋给this.state.data
    this.setState({
      data:this.props.data
    })
  }
  
  componentDidMount() {
    //获取当前文档的监听事件
    var xtContent = document.getElementsByClassName('xt-content')[0];
    xtContent.addEventListener('scroll', this.handleScroll);
    setTimeout(() => {
      //获取每个id=item+index的距文档的高度  
      for(let i=0;i<this.state.data.length;i++){
        var ids = document.getElementById('item' + i).offsetTop;
        // 将每个id元素距离文档高度放到数组elHeight中去
        this.state.elHeight.push(ids);
        
      }
      
    }, 200);
  }
  componentWillUnmount() {
    // 移除当前文档的监听事件
    var xtContent = document.getElementsByClassName('xt-content')[0]
    xtContent.removeEventListener('scroll', this.handleScroll); 
  }
  handleScroll(e) {
    // 将当前文档滚动保存到scroll中去
    var scroll=document.getElementsByClassName("xt-content")[0].scrollTop;
    // 将当前加载的列表条数放入是否高亮放入一个数组中     true为高亮   false为不亮
    for(let n=0;n<this.state.data.length-1;n++){
      // 为isStar  是否高亮设置初始值
        if(n==0){
           this.state.isStar.push(true);
        }else{
           this.state.isStar.push(false);
        }   
    }
    // scroll为页面滚动高度
    // 将每个元素距离文档高度-页面滚动高度去判断当前是否高亮
    for (let j=0;j<this.state.elHeight.length;j++){
      var star=this.state.elHeight[j]-scroll;
      if(this.state.elHeight[0]>1000){
        if(star<1150){
          // 当高亮高度小于1150时将数组中的第一个值设置为true，并且修改状态isStar
          //将isStar数组中的从第j个元素起后的第一个元素改变是否高亮
            this.state.isStar.splice(j,1,true)
            this.setState({
              isStar:this.state.isStar
            })
          }else{
          // 当高亮高度大于1150时将数组中的第一个值设置为false，并且修改状态isStar
          //将isStar数组中的从第j个元素起后的第一个元素改变是否高亮
            this.state.isStar.splice(j,1,false)
            this.setState({
              isStar:this.state.isStar
            })
          }
      }else{
        if(star<250){
        // 当高亮高度小于250时将数组中的第一个值设置为true，并且修改状态isStar
          this.state.isStar.splice(j,1,true)
          this.setState({
            isStar:this.state.isStar
          })
        }else{
        // 当高亮高度大于250时将数组中的第一个值设置为false，并且修改状态isStar
          this.state.isStar.splice(j,1,false)
          this.setState({
            isStar:this.state.isStar
          })
        }
      } 
    }
  } 
  render() {
    return (
       <div className="kyl-ucllc-list1">
        {
          this.state.data.map((item,index)=>(
            <div id={'item' + index} key={index}>
            {/* 当第一个元素为的下标为0或者数组isStar中的index下标的元素是true时为高亮，否则为不高亮 */}
              <div className="kyl-ucllc-svg0" style={{backgroundColor:index===0||this.state.isStar[index]?"#ff9934":"#828d99"}}>
                <SVG type="android"></SVG>
              </div>
              <div className="kyl-ucllc-id" ref={"id"+index} style={{backgroundColor:index===0||this.state.isStar[index]?"#ffe9d3":"#dfe4eb"}}>
                <span className="kyl-ucllc-idWord" style={{color:index===0||this.state.isStar[index]?"#e97400":"#4c5259"}} >{this.state.data[index].id}</span>
              </div>
              <Timeline className="kyl-ucllc-list" >
                <Timeline.Item>
                  <div className="kyl-ucllc-container">
                    {this.state.data[index].name}
                    {/* zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz */}
                  </div>
                </Timeline.Item>
              </Timeline> 
              <div className={index===this.state.data.length-1?"kyl-ucllc-lastBottomLine":"kyl-ucllc-bottomLine"}></div>
            </div>
          ))
        }
       </div>
    );
  }
}
