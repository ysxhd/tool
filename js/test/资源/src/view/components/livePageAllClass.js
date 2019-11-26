/*
 * @Author: xq 
 * @Date: 2018-07-26 09:47:56 
 * @Last Modified by: xq
 * @Last Modified time: 2018-08-31 16:03:53
 * 直播首页-全部直播列表和预告信息列表
 */
import React from 'react';
import { Link,Router } from 'react-router-dom';
import { getLiveList_ac } from '../../redux/xq_livePage.reducer';
import { connect } from "react-redux";
import _x from '../../js/_x/util/index';
import _ from 'lodash';
import url from './../../js/_x/util/url';
import '../../css/livePage.css';
import '../../css/indexPubClass.css';
import {SVG,SpinLoad} from '../common';

const format = _x.date.format;
const goWith = url.goWith;
@connect(state => state, { getLiveList_ac})
export default class LivePageAllClass extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            liveList:[],// 直播列表
            previewListBox:[]// 预告列表
        }
        this.initListData = this.initListData.bind(this);
    }

    initListData(){
        this.setState({
            liveList:this.props.LivePageReducer.liveListR,
            previewListBox:this.props.LivePageReducer.previewListBoxR
        })
    }

      //跳转到 直播/直播预告 页面
  goLivePage(isLive, id,stime) {
    if (isLive == '2') {
      // 预告 /q_liveTrail
      // this.props.history.push(`/q_liveTrail/reception/${id}/${stime}`)
      let goWhere = {
        to: 'q_liveTrail',
        with:['reception',`${id}`,'true',`${stime}`]
      }
      goWith(goWhere);
    } else if (isLive == '1') {
      // 直播 /q_liveVideo
      // this.props.history.push(`/q_liveVideo/reception/${id}`) 
      let goWhere = {
        to: 'q_liveVideo',
        with:['reception',`${id}`,'true']
      }
      goWith(goWhere);
    }
  }
    componentDidMount(){
       this.initListData();

    }
    
    render (){
        let liveList =this.props.LivePageReducer.liveListR;   // 直播课堂列表
        let previewListBox = this.props.LivePageReducer.previewListBoxR;
        let isFirst = this.props.LivePageReducer.isFirstData;
        return (
            <div className='xq-class-all-live'>
                <div className='xq-class-head-center'>全部直播</div>
                <div className='xq-class-items'>
                {
                    liveList.length>0?(
                        liveList.map((item,index)=>{
                            return (
                                <div key={index} className='xq-class-item' onClick={this.goLivePage.bind(this, item.isLive, item.curResourceId)} key={index}>
                                    <div className='xq-class-cover'>
                                    {/*缩略图字段  item.thumbnailId*/}
                                        <img src={require('../../icon/default_1.png')} alt=""/>
                                        <div className='xq-class-cover-t'>{item.grdName}</div>
                                        
                                    </div>
                                    <div className='xq-item-info'>
                                        <div className='xq-item-info-t'>课堂直播中...</div>
                                        <div className='xq-item-info-ul'>
                                        <div className='xq-item-info-li'>
                                            <span>
                                                <SVG type='teacher'></SVG>
                                            </span>
                                            <div className='xq-item-infor-p'>{item.teacherName}</div>
                                        </div>
                                        <div className='xq-item-info-li'>
                                            <span>
                                            <SVG type='browseNum'></SVG>
                                            </span>
                                            <div className='xq-item-infor-p'>{item.concurrentNum}</div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                
                            )
                            })
                        ):(
                            <div>
                                {
                                    isFirst?
                                    <div className='xq-live-loading'>
                                        <SpinLoad />
                                    </div>
                                    :(
                                        <div className='lxx-g-noData xq-noData'>
                                            <img src={require('./../../icon/null_b.png')} alt=""/>
                                            <p>暂无数据列表</p>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                        
                </div>
                <div className='xq-class-all-preview'>
                    <div className='xq-class-head-center'>全部预告</div>
                    <div className='xq-preview-ul'>
                    {
                        previewListBox.length?(
                            previewListBox.map((item,index)=>{
                                return (
                                    <div className='xq-preview-li' key={index}>
                                        <div className='xq-preview-title'>{item.time}</div>
                                        <div className='xq-preview-items'>
                                        {
                                            item.adviceList.map((n,i)=>{
                                                return (
                                                   <div key={i} className='xq-preview-item' onClick={this.goLivePage.bind(this, n.isLive, n.curResourceId,n.actureStartTime)}>
                                                        <div className='xq-preview-item-time'>
                                                            {format(new Date(n.actureStartTime), 'HH:mm')} ~ {format(new Date(n.actureEndTime), 'HH:mm')}
                                                        </div>
                                                        <div className='xq-preview-item-name'>
                                                            {n.curName}
                                                        </div>
                                                        <div className='xq-preview-item-ul'>
                                                        <div className='xq-preview-item-li'>
                                                            <span>学院：</span>
                                                            <span title={n.grdName}>{n.grdName}</span>
                                                        </div>
                                                        <div className='xq-preview-item-li'>
                                                            <span>专业2：</span>
                                                            <span title={n.subName}>{n.subName}</span>
                                                        </div>
                                                        <div className='xq-preview-item-li'>
                                                            <span>老师：</span>
                                                            <span title={n.teacherName}>{n.teacherName}</span>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    
                                                   
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                )
                            })
                        ):(
                            <div>
                                {
                                    isFirst?
                                    <div className='xq-live-loading'>
                                        <SpinLoad />
                                    </div>
                                    :(
                                        <div className='lxx-g-noData xq-noData'>
                                            <img src={require('./../../icon/null_b.png')} alt=""/>
                                            <p>暂无数据列表</p>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                    </div>
                </div>
            </div>
        )
    }
}