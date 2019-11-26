import React, { Component } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { closeModal_action } from '../../redux/analysis/advise.redux'
import server_config from '../../server/server-conf';
import { format } from '../../js/_x/util/date';
import { IMG } from './noImg';

@connect(
    state=>state,
    {closeModal_action}
  )
export default class CheckNotic extends Component{
     constructor(){
         super();
         this.state = {

         }
     }
     
    //放大图片
    bigPic = (e) =>{    
       var musk  = document.querySelector('.zn-mask');
       musk.style.display = 'block';
       var img = document.createElement('img');
       img.src = e;
       img.className = 'zn-bg-img';
       musk.appendChild(img);
       musk.onclick = function(){
        musk.innerHTML="";   
        musk.style.display = 'none';
       }
    } 



     render(){
         let data = this.props.TableAdvise_reducer.singleData;
         let imgData = this.props.TableAdvise_reducer.imgList,imgWidth;
         if(data.date){
            data.date = new Date(data.date)
             data.date = format(data.date,"yyyy-MM-dd");
         }
         //获取服务器地址与图片拼接
         let url = server_config.server_config.tureServicePath+':'+ server_config.server_config.tureServicePort+'/isgct';
         if(imgData.length){
            imgWidth = 280 * imgData.length;
         }
         return <div className="hf-an-main">
         <div className="hf-an-bar">
           <span className="hf-an-title">查看详情</span>
           <i className="iconfont icon-close hf-an-iClose" onClick={this.props.closeModal_action}></i>
         </div>
         <div className="zn-modal-cont">
            <div className="zn-modal-font">
                <span>反馈类型 ：{data.feedType}</span>
            </div>
            <div className="zn-modal-font">
                <span>反馈内容 ：{data.content}</span>
            </div>
            <div className="zn-flex-spacebet">
                <div>{data.date}</div>
                <div>来源 ：{data.account}</div>
            </div>
            <div className="zn-mt30">
            <Spin spinning={this.props.TableAdvise_reducer.loading_detail}>
            <PerfectScrollbar>
                <div style={{width:imgWidth+"px"}} className="zn-flex-justcont">
                         {
                             imgData.map((val,i)=>{
                                 let address = url+val;
                                 return <div key={i} className="zn-img-item" onClick={()=>{
                                     this.bigPic(address)}
                                     } >
                                     <IMG
                                     src={address}/></div>
                             })
                         }
                </div>
             </PerfectScrollbar>
             </Spin>
            </div>
         </div>
         <div className="zn-mask"></div>
       </div>
     }
}