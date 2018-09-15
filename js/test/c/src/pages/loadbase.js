import React, { Component } from 'react';
import { Progress } from 'antd';
import QueueAnim from 'rc-queue-anim'; //动画
import { Frame } from './index';
import { G, _x } from './../js/index';
import _ from 'lodash';
import { notification } from 'antd';
import { Container } from './../components/common';
const ajax = _x.util.request.request;

const RequestMultiple = _x.util.request.requestMultiple;

export class LoadBase extends React.Component {
  state = {
    percent: 0,
  }

  openNotification(des) {
    notification[des.type]({
      message: des.title,
      description: des.info
    })
  }

  componentDidMount() {
    let _this = this;
    let search = window.location.search, uname, upwd;
    uname = search.indexOf('u=') != -1 ? search.slice(search.indexOf('u=') + 2, search.indexOf('&p')) : false || sessionStorage.getItem('_uname_') || "";
    upwd = search.indexOf('p=') != -1 ? search.slice(search.indexOf('p=') + 2) : false || sessionStorage.getItem('_upwd_') || "";
    sessionStorage.setItem('_uname_', uname);
    sessionStorage.setItem('_upwd_', upwd);


    /*  let timeBreaker = window.setInterval(() => {
 
       if (_this.state.percent == 4) {
         {
           //用户登录验证接口
           ajax(
             'login',
             {
               username: uname,
               password: upwd
             },
             (res) => {
               if (res.result && res.code == "200") {
                 G.initOrginfo = res.data;
                 G.uinfo.Org_name = res.data.org_name;
                 G.uinfo.Real_name = res.data.user_type;
                 G.orgcode = res.data.org_code;
                 console.log("包含了当前登录机构的全局变量：", G);
               } else {
                 window.clearInterval(timeBreaker);
                 _this.openNotification({
                   type: "warning",
                   title: "登录失败",
                   info: "请关闭页面后重试",
                   duration: null,
                   onClose: () => {
                     console.log('callback when close notification')
                   }
                 })
               }
             },
             () => {
               window.clearInterval(timeBreaker);
               _this.openNotification({
                 type: "warning",
                 title: "登录失败",
                 info: "请关闭页面后重试",
                 duration: null,
                 onClose: () => {
                   console.log('callback when close notification')
                 }
               })
             }
           )
         }
       }
       if (_this.state.percent == 24) {
         {
           //获取考试计划接口
           ajax(
             'examPlan/find',
             {},
             (res) => {
               if (res.result && res.code == "200") {
                 G.exams = res.data;
               } else {
                 window.clearInterval(timeBreaker);
                 _this.openNotification({
                   type: "warning",
                   title: "登录失败",
                   info: "请关闭页面后重试",
                   duration: null,
                   onClose: () => {
                     console.log('callback when close notification')
                   }
                 })
               }
             },
             () => {
               window.clearInterval(timeBreaker);
               _this.openNotification({
                 type: "warning",
                 title: "登录失败",
                 info: "请关闭页面后重试",
                 duration: null,
                 onClose: () => {
                   console.log('callback when close notification')
                 }
               })
             }
           )
         }
       }
       if (_this.state.percent >= 100) {
         window.clearInterval(timeBreaker);
       }
       _this.setState({
         percent: (_this.state.percent + 1)
       })
     }, 1000 / 60) */


    const ajaxQueue = async function () {
      _this.setState({
        percent: 24
      })
      await ajax(
        'login',
        {
          username: uname,
          password: upwd
        },
        (res) => {
          if (res.result && res.code == "200") {
            G.initOrginfo = res.data;
            G.uinfo.Org_name = res.data.org_name;
            G.uinfo.Real_name = res.data.user_type;
            G.orgcode = res.data.org_code;
            _this.setState({
              percent: 45
            })
          } else {
            // window.clearInterval(timeBreaker);
            _this.openNotification({
              type: "warning",
              title: "登录失败",
              info: "请关闭页面后重试",
              duration: null,
              onClose: () => {
                console.log('callback when close notification')
              }
            })
            return false;
          }
        },
        () => {
          // window.clearInterval(timeBreaker);
          _this.openNotification({
            type: "warning",
            title: "登录失败",
            info: "请关闭页面后重试",
            duration: null,
            onClose: () => {
              console.log('callback when close notification')
            }
          })
          return false;
        }
      )
      await _this.setState({
        percent: 64
      })
      await ajax(
        'examPlan/find',
        {},
        (res) => {
          if (res.result && res.code == "200") {
            G.exams = res.data;
          } else {
            // window.clearInterval(timeBreaker);
            _this.openNotification({
              type: "warning",
              title: "登录失败",
              info: "请关闭页面后重试",
              duration: null,
              onClose: () => {
                console.log('callback when close notification')
              }
            })
            _this.setState({
              percent: 84
            })
            return false;
          }
        },
        () => {
          // window.clearInterval(timeBreaker);
          _this.openNotification({
            type: "warning",
            title: "登录失败",
            info: "请关闭页面后重试",
            duration: null,
            onClose: () => {
              console.log('callback when close notification')
            }
          })
          return false;
        }
      )
      await _this.setState({
        percent: 90
      })
      await _this.setState({
        percent: 100
      })
    }

    ajaxQueue();


  }


  render() {

    return (
      <Container>
        {
          this.state.percent < 100
            ?
            <div key="loadbase" className="xt-loadbase">
              <div className="xt-loadbase-text">
                正在加载数据...
              <Progress percent={this.state.percent} status="active" showInfo={false} />
              </div>
            </div>
            :
            <QueueAnim>
              <Frame key="1" />;
            </QueueAnim>
        }

      </Container>
    );

  }

}