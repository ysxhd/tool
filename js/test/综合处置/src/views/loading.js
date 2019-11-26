/*
 * @Author: 甘维添 
 * @Date: 2018-04-19 10:07:26 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-04-23 13:49:17
 * 按需加载 Loading
 */

import React, { Component } from 'react';
import { Spin, Modal } from 'antd';
import _x from './../utils/_x/index';
import './../css/loading.css';

class Loading extends Component {
  constructor() {
    super();
    this.examId = JSON.parse(sessionStorage.getItem("examId"));
  }

  login() {
    _x.request('login/checkToken', {
      "examId": this.examId
    }, (res) => {
      if (res.result) {
        let data = res.data;

        data = JSON.stringify(data);
        sessionStorage.loginData = data;

        // 跳转
        this.props.history.push('/overview')
      } else {
        Modal.error({
          title: '登陆失败',
          content: res.message,
          onOk() {
            window.location.href = window.location.origin
          },
        })
      }
    })
  }

  componentWillMount() {
    this.login()
  }

  render() {
    return (
      <div className="gwt-loading-page">
        <div>
          <Spin
            tip={"加载中，请稍后..."}
            delay={2000}
          />
        </div>
      </div>
    );
  }
}

export default Loading;
