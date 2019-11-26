/*
 * @Author: xq 
 * @Date: 2018-08-06 15:29:53 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:25:17
 */
import React, { Component } from 'react';
import { Link, Router,withRouter } from 'react-router-dom';
import { Input, message, Button } from 'antd';
import  '../../css/feedbackEdit.css';
import request from './../../js/_x/util/request';
import { setTimeout } from 'timers';

let timer;
const { TextArea } = Input;
const Request = request.request;
class FeekbackEdit extends React.Component {
    constructor(){
        super();
        this.state={
            fontLength:500,
            telValue:'',
            onceClick:true,
            areaValue:''
        }
        this.subFeedback= this.subFeedback.bind(this);
    }

    onChangeArea(e){
       
        let currValue = e.target.value;
        // console.log('onchange拿到得val: ',this.state.areaValue)
        if(e.target.value.length<501){
            this.setState({
                fontLength:500-e.target.value.length,
                areaValue:e.target.value
            })
        } else {
            this.setState({
                areaValue:currValue.slice(0,500)
            })
            e.returnValue = false;
        }
    }

    // // 输入框回车事件
    // onPressEnterFunc(e){
    //     let valueNow = this.state.areaValue;
    //     console.log('回车事件拿到的val: ',valueNow)
    //     this.setState({
    //         areaValue:valueNow+'<br />'
    //     })
    //     console.log('回车后处理的值val: ',valueNow+'<br />')
    // }
    

    onChangeInput(e){
        let currValue = e.target.value;
        // console.log(currValue.length)
        this.setState({
            telValue:currValue
        })
    }

    subFeedback(){
        let content = this.state.areaValue;
        let newcontent =content.replace(/\s/g, '<br/>');
        let params = {
            feedbackContent: newcontent,
            feedbackInfo: this.state.telValue     
        };
 
        if(this.state.areaValue.length>0){
            Request('default/feedback/opinionFeedback',params,(res)=>{
                if(res.result){
                    message.success('ok');
                    let _this = this;
                    timer = setTimeout(function(){
                        _this.props.history.goBack();
                    },1500);
                } else {
                    message.error(res.message);
                }
            })
        } else if(this.state.areaValue==''){
            // if(this.state.onceClick){
            //     message.warning('内容不能为空');
            // }
            // this.setState({onceClick:false})
            message.warning('内容不能为空');
        }
    }
    componentWillUnmount(){
        clearTimeout(timer);
    }

    render(){
        let role = G.userInfo.accTypeId;    // 0是超管，1是普管，2是管理者，3是教师，4是学生，5是家长
        let user = G.userInfo.user;
        // console.log('render拿到的输入框值',this.state.areaValue)
        return (
            <div className='xq-feedback-edit-con'>
                <div className='xq-feedback-edit-head'>
                    意见反馈
                </div>
                <div className='xq-feedback-edit-detail'>
                    <div className='xq-feedback-edit'>
                        <p>欢迎您的意见和建议</p>
                        <p>可输入{this.state.fontLength}字</p>
                    </div>
                    <div className='xq-feedback-areas'>
                        <TextArea 
                            className='xq-feedback-area'
                            placeholder='请描述您遇到的问题，您的意见及建议'
                            onChange={this.onChangeArea.bind(this)}
                            maxLength={500}
                        />
                    </div>
                    <div className='xq-feedback-lx'>
                        <div className='xq-feedback-tel'>
                            联系方式：
                            {
                                (role==4)
                                ?<Input defaultValue={user.classList[0].className?user.classList[0].className:''} disabled={true} />
                                :<Input defaultValue={ user.username && user.mobileNo 
                                                        ?`${user.username}${user.mobileNo}`
                                                        :user.username} onChange={this.onChangeInput.bind(this)} />
                            }
                            (方便我们及时告知您结果)
                        </div>
                        <div className='xq-feedback-button lxx-s-orange' onClick={this.subFeedback}>
                            提交反馈
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}
export default withRouter(FeekbackEdit); 
