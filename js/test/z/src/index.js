import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Loadable from "react-loadable";
import registerServiceWorker from './registerServiceWorker';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Modal } from 'antd';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import _x from './utils/_x/index';
import config from './config/config';
import './css/index.css';
import LoadingComponent from './components/public_components/loding/loading';
import Loading from './views/loading';
// import './utils/mock'
// import Overview from './views/overview';
// import AbsentSupervise from './views/absent_supervise/absent_supervise';
// import ViolationSupervise from './views/violation_supervise/violation_supervise';

// 获取url中的token和examid
let url = window.location.href
let pathname = window.location.pathname
let arr = []
if (url.indexOf('token') !== -1 && url.indexOf('exid') !== -1) {
  let token = url.split('?')[1].split('&')
  token.map((item) => {
    arr.push(item.split('=')[1])
  })
  sessionStorage.examId = arr[1]
  sessionStorage.token = arr[0]
}

let origin = window.location.origin+'/muti_dispose/'


// 设置请求参数
_x.request.setConfig(origin, (e) => { 
  Modal.error({
    title: '通讯失败，请检查网络连接。',
    content: e.message,
    onOk() {
      window.location.href = window.location.origin
    },
  })
 }, false, config.orgCode, { token: arr[0] });

// 按需加载页面代码
const Overview = Loadable({
  loader: () => import('./views/overview'),
  loading: LoadingComponent,
  delay: 800
})

const AbsentSupervise = Loadable({
  loader: () => import('./views/absent_supervise/absent_supervise'),
  loading: LoadingComponent,
  delay: 800,
})

const ViolationSupervise = Loadable({
  loader: () => import('./views/violation_supervise/violation_supervise'),
  loading: LoadingComponent,
  delay: 800
})

const SignManageIndex = Loadable({
  loader: () => import('./views/sign_manage/sign_manage_index'),
  loading: LoadingComponent,
  delay: 800
})


class Farme extends Component {
  render() {
    return <LocaleProvider locale={zh_CN}>
      <Switch>
        {/* 加载中 */}
        <Route path="/loading" component={Loading}></Route>
        {/* 总览 */}
        <Route path="/overview" component={Overview}></Route>
        {/* 综合缺考管理 */}
        <Route path="/absent_supervise" component={AbsentSupervise}></Route>
        {/* 综合违规管理 */}
        <Route path="/violation_supervise" component={ViolationSupervise}></Route>
        {/* 综合违规管理 */}
        <Route path="/sign_manage_index" component={SignManageIndex}></Route>
        <Redirect to="/loading" />
      </Switch>
    </LocaleProvider>
  }
}

ReactDOM.render(
  <Router basename={`${pathname}#`}>
    <Farme />
  </Router>
  ,
  document.getElementById('root'));
registerServiceWorker();
