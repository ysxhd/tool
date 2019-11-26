/*
 * @Author: junjie.lean 
 * @Date: 2018-07-19 14:41:44 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-13 15:49:04
 */

/**
 * 全局变量
 */



let other;

let G = {
  title: "教育资源云平台_v2.1",
  dataServices: "",
  other,
}
const debug = process.env.NODE_ENV === 'development';
if (debug) {
  // G.dataServices = 'http://10.10.1.181:8989/iser-server';
  // G.dataServices = 'http://10.20.5.143:8989/iser-server';
  G.dataServices = 'http://10.4.2.143:7077/iser-server';
  // dataServices: "http://10.10.1.161:8080",
} else {
  let ori = window.location.origin;
  if (ori.indexOf('localhost') != -1) {
    G.dataServices = 'http://10.10.1.181:8989/iser-server';
  } else {
    G.dataServices = ori + "/iser-server"
  }
}

if (sessionStorage.userInfo && sessionStorage.userInfo !== 'undefined') {
  G.userInfo = JSON.parse(sessionStorage.userInfo);
}
if (sessionStorage.modules && sessionStorage.modules !== 'undefined') {
  G.modules = JSON.parse(sessionStorage.modules)
}
if (sessionStorage.colSubTeaInfo && sessionStorage.colSubTeaInfo !== 'undefined') {
  G.colSubTeaInfo = JSON.parse(sessionStorage.colSubTeaInfo)
}
if (sessionStorage.resourceFormatList && sessionStorage.resourceFormatList !== 'undefined') {
  G.resourceFormatList = JSON.parse(sessionStorage.resourceFormatList)
}
if (sessionStorage.paramsInfo && sessionStorage.paramsInfo !== 'undefined') {
  G.paramsInfo = JSON.parse(sessionStorage.paramsInfo)
}
if (sessionStorage.configInfo && sessionStorage.configInfo !== 'undefined') {
  G.configInfo = JSON.parse(sessionStorage.configInfo)
}
if (sessionStorage.yearTermWeek) {
  G.yearTermWeek = JSON.parse(sessionStorage.yearTermWeek)
}

if (window) {
  window.G = G;
}
export default G;