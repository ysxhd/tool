import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { FrameAdmin } from './pages/admin/index';
import { FrameTeaRouter } from './pages/teacher/index';
import { FrameStudent } from './pages/student/index';
import Loading from './pages/loading';
import Login from './pages/login';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { G } from './js/g';
import _x from './js/_x/index';
// import registerServiceWorker from './registerServiceWorker';
import svgContent from "./i/symbol-defs.svg";
import './css/index.css';
import Auto from './components/auto'
//注入图标集合SVG

//全局启动定时器控制
_x.util.animation.start();
//设置请求基础配置

export default class Index extends React.Component {
  constructor() {
    super();
  }


  render() {
    return (
      <div>
        <Router>
          <div>
            <Route exact path="/" component={Loading}></Route>
            <Route path="/loading" component={Loading}></Route>
            <Route path="/teacher" component={FrameTeaRouter}></Route>
            <Route path="/admin" component={FrameAdmin}></Route>
            <Route path="/student" component={FrameStudent}></Route>
            <Route path="/Login" component={Login}></Route>
          </div>
        </Router>
      </div>
    )
  }
}

document.querySelector('body').innerHTML += svgContent;
ReactDOM.render(<LocaleProvider locale={zh_CN}><Index /></LocaleProvider>, document.getElementById('root'));
// registerServiceWorker();