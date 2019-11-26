//get server data:
import request from "./_x/util/request";
import Session from './_x/util/session';
import url from './_x/util/url';
import _ from 'lodash';
import {
  MENUCONFIG, GetMenu,
} from './index';
import { message } from 'antd';
const debug = process.env.NODE_ENV === 'development';
const requestMultiple = request.requestMultiple;
const requestSingle = request.request;
const setServer = request.setConfig;
const getQueryString = url.getQueryString;

const G = {
  menus: GetMenu(),
  orgtypes: ['国家', '省', '市', '区县', '考点'],
  orgcode: '', //当前用户机构代码
  exam: {}, //当前选中考试计划编号
  exams: [],
  orgs: [],
  orgtree: {},
  orgcount: 0,
  uinfo: {},
  curOrgTree: {},
  service: service,
  initOrginfo: {},//初始化机构信息
  curExamTime: {},//当前选中场次
  examTimes: [],//所有场次
}

var service, utoken;
// uname  = 'superuser';
if (debug) {
  service = 'http://192.168.51.199:8080/authentication/';
  // service = 'http://192.168.51.162:8080/authentication/';
  // utoken = '67D970DB7E5F4556A88A52B0CAE89308';
  utoken = 'unknowToken';
  //设置服务地址全局配置
  let search = window.location.search,
    uname = search.indexOf('u=') != -1 ? search.slice(search.indexOf('u=') + 2, search.indexOf('&p')) : false || sessionStorage.getItem('_uname_') || G.uinfo.uname || "";

  setServer(service, utoken, null, false, debug, uname);
  //测试用户信息配置，正式上线时这里的数据要根据token去取
  G.uinfo = {
    "Org_name": "",
    "Real_name": "",
  };
  G.orgcode = '';
  // getBaseInfos();
} else {
  var href = window.location.pathname, search = window.location.search;
  let u = search.indexOf('u=') != -1 ? search.slice(search.indexOf('u=') + 2, search.indexOf('&p')) : false || sessionStorage.getItem('_uname_') || "";
  if (href.indexOf('index.html') >= 0) {
    href = href.substr(0, href.indexOf('index.html'));
  } else {
    if (!_.endsWith(href, '/')) {
      href = href + '/';
    }
  }
  service = href + '../';

  setServer(service, utoken, null, false, debug, u);

}
G.service = service;

console.log(G)
window.G = G;
export default {
  G
};