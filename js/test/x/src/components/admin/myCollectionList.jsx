/*
 * @Author: huangjing 
 * @Date: 2018-01-10 14:26:19 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:42:22
 * 我的收藏列表数据
 */
import React, { Component } from 'react';
import {Panel,SVG,IMG} from './../../components/base';
import {Checkbox} from 'antd';
import './../../css/admin/myCollectionList.css';


export class MyCollectionList extends Component {
  constructor(){
    super();
    this.state = {
      isOpen:false,   //判断列表右侧弹出框是否出现
      data: [],         //数据
      checked: false,   //是否选中
    }
  }
  // 拿到父组件数据
  componentDidMount(){
    this.setState({
      data:this.props.data
    });
  }
  // 判断checked状态
  listOnChange = (e) =>{
    this.props.listOnChange(this.state.data.id,e.target.checked);
  }
 // 全选时判断checked状态
  componentWillReceiveProps = (nextProps) => {
    if(nextProps.ids.indexOf(nextProps.data.id)===-1){
      this.setState({
        checked: false
      });
    }else{
      this.setState({
        checked: true
      });
    }
  } 
  // 鼠标移入事件
  onmouseover = () =>{
    this.setState({isOpen:true}); 
  }
  
  // 鼠标移出时间
  onmouseleave = () =>{
    this.setState({isOpen:false})
  }

  render () {
      const hoverStyle=this.state.isOpen?"visible":"hidden";
      return (
         
        <div>
        <div className='hj-mcl-body' onMouseOver={this.onmouseover} onMouseLeave = {this.onmouseleave}>
            <div className='hj-mcl-select'><Checkbox checked={this.state.checked} onChange={this.listOnChange}> </Checkbox></div>
            <div className='hj-mcl-content'>
              <div className='hj-mcl-left'><IMG src='http://pic.58pic.com/58pic/15/30/51/01Z58PICyq9_1024.jpg'  alt='这是文件图标' /></div>
              <div className='hj-mcl-right'>
                  <div className='hj-mcl-top'>{this.props.data.title}</div>
                  <div className='hj-mcl-bottom'>
                    <p className='hj-mcl-formart'>格式 ：{this.props.data.formart}</p>
                    <p className='hj-mcl-uploader'>上传者 ：{this.props.data.uploader}</p>
                    <p className='hj-mcl-size'>大小 ：{this.props.data.size}</p>
                    <p className='hj-mcl-date'>创建时间 ：{this.props.data.date}</p>
                  </div>
                  <div className='hj-mcl-pop'   style={{visibility:hoverStyle}}>
                    <div className='hj-mcl-load'>
                      <svg className="icon" aria-hidden="true">
                        <use xlinkHref={"#icon-download" }></use>
                      </svg>
                    </div>
                    <div className='hj-mcl-del'>
                      <svg className="icon" aria-hidden="true" >
                        <use xlinkHref={"#icon-cross" }></use>
                      </svg>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }