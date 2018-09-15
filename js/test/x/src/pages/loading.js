/*
 * @Author: lxx 
 * @Date: 2018-01-08 10:44:02 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-27 12:19:47
 */
import React, { Component } from 'react';
import { Spin, Progress } from 'antd';
import '../css/loading.css';
import { G } from '../js/g';
import _x from '../js/_x/index';
import {error} from '../components/modal.jsx';

/*router-config */
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
const isDebug = process.env.NODE_ENV === "development";
const ajaxReq = _x.util.request;
const session = _x.util.session;
let type;

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        }
       
    }

    componentWillMount() {

        let progress = (n) => { 
            let pro = this.state.progress;
            pro = pro + n;
            this.setState({
                progress: pro
            })
        }
        
             let uinfo = {
                 orgcode: "",
                 token: "",
                 level: "",
                 version:"",
                 alias:""
             }
             G.uinfo = uinfo;
             ajaxReq.setConfig(G.serverUrl, null, isDebug, G.uinfo.orgcode, "","");
             //获取sso参数
             var url = decodeURI(window.location.href.replace('?', ''));
             var strs = url.split("&");
             var orgCode,token,userType;
             try {
                orgCode = strs[0].split("=")[1];
                token = strs[1].split("=")[1];
             } catch (error) {
                orgCode="";
                token="";
             }   
             
             var isLogin = strs[strs.length-1];

             //判断是否从登陆界面进入
             if(isLogin == 'isSSo=true'){
                type = strs[strs.length-1].split("=")[1];
                progress(60);
                type =JSON.parse(sessionStorage.getItem('type'));
             }else{
                //  还是从sso登陆
                (function(that) {
                    let pr = {
                        action: "/api/web/loginSso",
                        data: {
                            "orgCode": orgCode,
                            "token": token
                        }
                    }
                    ajaxReq.formRequest(pr,(res) =>{
                        let result = res.result,
                            data = res.data;
                        if(res.code == 200){
                            sessionStorage.setItem("token",data.token);
                            sessionStorage.setItem("userId",data.userId);
                            type = data.level;
                            //判断用户角色
                            if(data.level === 1) {
                                // 班长
                                sessionStorage.setItem('classId', data.classId[0]);
                                sessionStorage.setItem('className', data.cla_funame[0]);
                               
                            }
                        } else {
                            that.props.history.push('/Login');
                            if(orgCode && token){
                             error(res.message,1000);
                            }
                            return;
                        }
                        progress(60);
                    }, (fai) => {
                         error('请求失败',1000);
                        that.props.history.push('/Login');
                    })
                })(this)

             }
 
         //老师页面默认选择第一个班级
         sessionStorage.setItem("clsIndex",0);

        let ajaxQueue = (state) =>{
            return new Promise(function(resolve,reject){
                if (state) {
                    resolve()
                } else {
                    reject()
                }
            });
        };

        // 获取系统时间
        let getServerTime = () => {
            let pr = {
                action: 'api/android/class_card_device_manage/get_server_time'
            }
            ajaxReq.formRequest(pr, (res) => {
                _x.util.session.setSession('serverTime', res.data.date);
                progress(40);
            })
        }
        ajaxQueue(true).then(getServerTime());
      
    }

    componentDidUpdate() {
        let pro = Math.ceil(this.state.progress);
       //  let utype = parseInt(G.uinfo.level); //用户角色类型 1:班长 2:班主任 3:管理员 4:超级管理员
        if(pro >= 99) {
         //判断是否token过期的用户，如果是则跳转到过期时的那个页面
         var myUrl = sessionStorage.getItem('myUrl');
         if(myUrl){
            sessionStorage.removeItem('myUrl');
            window.location.href = myUrl;
            return;
        }
            switch (type) {
                case 1:
                    this.props.history.push('/student');
                    break;
                case 2:
                    this.props.history.push('/teacher');
                    break;
                case 3:
                    this.props.history.push('/admin');
                    break;
                case 4:
                    this.props.history.push('/admin');
                    break;
                default:
                console.log("comeing");
                    error('您暂无权限登录该系统');
                    break;
            }
        }
    }
    render() {
        return (
            <div>
                <div className='waiting'>
                    <Spin size='large' />
                    <p>Loading...</p>
                </div>
                <div className='progress'>
                    <Progress percent={this.state.progress} status="active" />
                </div>
            </div>
        )
    }

}