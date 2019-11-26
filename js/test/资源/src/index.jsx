import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './redux/index.reducers';
import thunkMiddleware from 'redux-thunk';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom'
import G from './js/g';
import './view/common.css';
import './css/basics.css';
import request from './js/_x/util/request';
import url from './js/_x/util/url';
import svgContent from "./svg/symbol-defs.svg";
import RouterRelation from './view/routerRelation';

{
  /**
   * 正式环境反调试去console.log
   */
  if (process.env.NODE_ENV !== 'development') {
    if (window.console) {
      for (let item in window.console) {
        window['console'][item] = () => {
          return
        }
      }
    }
  }
}

const getQueryString = url.getQueryString;
//reducers合并，并创建store和router:
const store = createStore(allReducers, compose(applyMiddleware(thunkMiddleware), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f));

document
  .querySelector('body')
  .innerHTML += svgContent;
let token,
  orgcode,
  redirect,
  params;
let localUrl = window.location;
if (localUrl.href.indexOf('token') > -1 && localUrl.href.indexOf('orgcode') > -1) {
  console.log('找到了token和Orgcode')
  token = getQueryString('token'),
    orgcode = getQueryString('orgcode'),
    redirect = getQueryString('page'),
    params = getQueryString('argument');
  let paramsInfo = {
    token,
    orgcode,
    redirect,
    params
  };
  G.paramsInfo = paramsInfo;
  sessionStorage.setItem("paramsInfo", JSON.stringify(paramsInfo));
  request.setConfig(G.dataServices, token, orgcode);
} else {
  console.log('没找到token和orgcode')
  if (sessionStorage.paramsInfo) {
    token = JSON
      .parse(sessionStorage.paramsInfo)
      .token;
    orgcode = JSON
      .parse(sessionStorage.paramsInfo)
      .orgcode;
  } else if (G.paramsInfo) {
    token = G.paramsInfo.token;
    orgcode = G.paramsInfo.orgcode;
  } else {
    token = undefined;
    orgcode = undefined;
  }

}
console.log(token, orgcode);
if (token && orgcode) {
  console.log('right')
  request.setConfig(G.dataServices, token, orgcode);
} else {
  let origin = window.location.origin;
  let baseUrl = origin += "/iser-web/#/error/?token=&orgcode=";
  console.log(baseUrl)
  window.location.href = baseUrl;
}

console.log('before enter class')

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {}
    console.log('constructor')
  }
  componentDidMount() {
    console.log('did mount');
  }
  render() {
    return (
      <Provider store={store}>
        <Router basename='/iser-web/#'>
          {/* <LocaleProvider locale={zh_CN}> */}
          <RouterRelation />
          {/* </LocaleProvider> */}
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(
  <App />, document.getElementById('root'));