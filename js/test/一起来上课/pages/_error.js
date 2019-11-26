/*
 * @Author: junjie.lean 
 * @Date: 2018-06-20 16:28:13 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-08-27 17:24:47
 */

//自定义的错误页面

import React from 'react';
import '../css/index.css';

export default class Error extends React.Component {
    constructor(){
        super();
        this.state = {
            img:'',
            seconds:5
        },
        this.timer=null;
    }

    componentDidMount(){
        //动态加载图片
        const img = require('../static/fail2.png');
        //禁止回退
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', function () {
            history.pushState(null, null, document.URL);
        });
        this.setState({img});
        this.timer=setInterval(()=>{
            if(this.state.seconds === 1){
                clearInterval(this.timer);
                //跳转回sso
                window.location.href = document.referrer;
            }
         this.setState({
            seconds:this.state.seconds-1
         })
        },1000)
    }
    render() {
        return (
            <div style={styles.bg} className="zn-flex-center">
                <div style={styles.text}>
                   <img src={this.state.img}/>
                   <div>登录失败,{this.state.seconds}后返回首页</div>
                </div>
                
            </div>
        )
    }

}

const styles = {
    bg: {
      backgroundColor:"#fff"
    },
    text:{
        textAlign:"center",
        color:"#c8c8c8",
        fontSize:"24px",
        position: "fixed",
        top:"50%",
        left:"50%",
        transform: "translate(-50%, -50%)"
    }
  }