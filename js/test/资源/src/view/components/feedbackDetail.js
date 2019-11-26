/*
 * @Author: xq 
 * @Date: 2018-08-01 17:26:56 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-03 16:51:23
 */
import React from 'react';
import { withRouter,Link } from 'react-router-dom';
import request from '../../js/_x/util/request';
import { message, Button } from 'antd';
import _x from '../../js/_x/util/index';
import '../../css/feedbackList.css';
import { spawn } from 'child_process';

const format = _x.date.format;
const Request = request.request;
class FeedbackDetailPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            feedDtail:'',
            feedId:'',
            time:''
        }
        this.getFeedbackDetail = this.getFeedbackDetail.bind(this);
    }

   // 从本地存储获取意见反馈内容
  getFeedbackDetail() {
    var history = localStorage.getItem('feeddetail');
    if (history) {
      history = JSON.parse(history);
      let info = history.feedbackInfo;
      if(info.substr(info.length-1,1) ==',' || info.substr(info.length-1,1) =='，'){
        info = info.substring(0,info.length-1);
      }
      this.setState({
        feedDtail:history.feedbackContent,
        time:history.feedbackTime,
        feedInfo:info
      })
    } else {
      history = [];
    }
  }

  // 点击返回按钮，提交阅读状态
  submitReadState(){
    this.props.history.push('/b_feedback')
  }

  componentDidMount(){
      this.getFeedbackDetail();
      let params = {
        "feedbackId":this.props.match.params.id
    };

      Request('default/feedback/changeStatus',params,(res) => {
        if(res.result){
        } else {
            message.error(res.message);
        }
    })
  }
    render(){

        let state = this.state;
        let time = Number(state.time);
        return (
            <div className='xq-fbdetail-con'>
                <div className='xq-fbdetail-head'>
                    <div className='xq-fbdetail-t'>意见反馈</div>
                    <div className='xq-fbdetail-time'>提交时间:{format(new Date(time), 'yyyy-MM-dd')}</div>
                    <div className='xq-fbdetail-goback' onClick={this.submitReadState.bind(this)}>
                        <Link to='/b_feedback' className='lxx-s-wathet'>返回</Link>
                    </div>
                </div>
                <div className='xq-fbdetail-display' dangerouslySetInnerHTML={{__html:`${this.state.feedDtail}`}}></div>
                <div className='xq-fbdetail-tel'>
                    联系方式：{state.feedInfo}
                </div>
            </div>
        )
    }
}
export default withRouter(FeedbackDetailPage);