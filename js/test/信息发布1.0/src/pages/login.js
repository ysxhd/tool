import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import './../css/login.css';
import { G } from '../js/g';
import _x from '../js/_x/index';
import {error} from '../components/modal.jsx';

const FormItem = Form.Item;

const isDebug = process.env.NODE_ENV === "development";
const ajaxReq = _x.util.request;
const session = _x.util.session;


export default class Login extends React.Component {
   constructor(){
       super();
       this.state={
           user:"",
           pass:"",
           token:""
       }

       this.handleChange = this.handleChange.bind(this);  //获取input的内容
       
   }
  //提交input
    handleSubmit = (e) => {
      e.preventDefault();
      let {tea , stu} =this.state;

     let { pass ,user } = this.state;
      this.getAjax(pass,user);
    }
    //相g中存储orgcode、token等
    componentWillMount(){
        let uinfo = {
            orgcode: "",
            token: "",
            level: "",
            version:"",
            alias:""
        }
        G.uinfo = uinfo;
        // session.setSession("orgcode",G.uinfo.orgcode);
        ajaxReq.setConfig(G.serverUrl, null, isDebug, G.uinfo.orgcode, "","");
    }


     //获取input的内容
    handleChange(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
      }


    //提交请求后台接口
    getAjax(pass,user) {
        var that = this;
        
        let req = {
            action: 'api/web/class_card_personal/loginUser',
            data: {
                acc_name: user,
                acc_pwd: pass
            }
        }
        _x.util.request.formRequest(req, function (ret) {
            //请求数据
            if (ret.result  && ret.code == 200) {
                let uinfo = {
                    orgcode: "",
                    token: ret.data.token,
                    level: ret.data.level,
                    user:that.state.user,
                    pass:that.state.pass,
                }
                G.uinfo = uinfo;
                sessionStorage.setItem("token",ret.data.token);
                sessionStorage.setItem("userId", ret.data.userId);
                // ajaxReq.setConfig(G.serverUrl, null, isDebug, G.uinfo.orgcode, G.uinfo.token,G.uinfo.level);
                sessionStorage.setItem("type",JSON.stringify(ret.data.level));

                if(ret.data.level === 1) {
                    // 班长
                    sessionStorage.setItem('classId', ret.data.classId[0]);
                    sessionStorage.setItem('className', ret.data.cla_funame[0]);
                   
                }
                if(ret.data.level == 0){
                    error("您无权登陆，请换一个高权限账号",1000);
                    return;
                }
                
                that.props.history.push('/loading?&isSSo=true');
               // window.location.href="www.baidu.com";
            }else{
                error(ret.message);
            }
        });
    } 
    
    render() {
      return (

       <div className="zn-login-box">
        <Form onSubmit={this.handleSubmit} className="login-form zn-t-login">
           <FormItem
        >
            <Input value={this.state.user} name="user" onChange={this.handleChange} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
        </FormItem>

        <FormItem
        >
            <Input  value={this.state.pass}  name="pass" onChange={this.handleChange} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
          >
           登陆
          </Button>
        </FormItem>
        </Form>
        </div>
      );
    }
  }
  
