// import 'babel-polyfill'; 
import React from 'react';
import ReactDOM from 'react-dom';
import svgContent from "./i/symbol-defs.svg";
import { LoadBase } from './pages/index';
import { BrowserRouter as Router } from 'react-router-dom';
import { _x, MENUCONFIG, G } from './js/index';
import _ from 'lodash';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import './css/index.css';

const { getQueryString } = _x.util.url;
document.querySelector('body').innerHTML += svgContent;
// _x.util.animation.start();


const Index = <Router basename='/authentication/build/index.html#/'>
  <LocaleProvider locale={zh_CN}>
    <LoadBase />
  </LocaleProvider>
</Router>

ReactDOM.render(Index, document.getElementById('root'));
