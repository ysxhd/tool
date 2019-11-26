/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-24 10:14:31
 * 数据服务请求方法
 */

const axios = require('axios');
const _ = require('lodash');
const { server_config } = require('../server/server-conf');

/**
 * 数据请求相关配置
 */
let requestConfig = {
  dataService: '', //数据服务入口
},
  axiosInsServer;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = async function (method, params, success = () => { return true }, fail = () => { return false }) {
  //lean : 函数重构
  let opts = requestConfig;
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
  }
  if (method) {
     let token,paramsObj = JSON.parse(params);
     token = paramsObj.certification.tokenID;

    let axiosConfig = {
      headers: { 
        'Content-Type': "application/json",
        'token':token
     }
    },
      url = `${server_config.tureServicePath}:${server_config.tureServicePort}${method}`;
    //  console.log(url);

    let _resData = await axios.post(url, params, axiosConfig)
      .then((_res) => { success(_res) })
      .catch((err) => { console.log("middleware request error", err) });
    // success(_resData.data);
    // return _resData.data;
  } else {
    throw new Error('请求数据需要指定方法，参数method不能为空');
  }
};

/**
 * 包含上传文件和普通请求的表单方式
 * @author:Jcheng.Liu
 * @param {Object} params 请求具体参数
 */
const formRequest = function (params, successCallback, failCallback) {
  let paramObj = params,
    ajaxObjServer,
    formDataObj = new FormData();

  let postData = {
    ...(JSON.parse(params))
  };

  formDataObj.append("data", JSON.stringify(postData));
  if (paramObj.data.file) {
    formDataObj.append("file", paramObj.data.file);
    ajaxObjServer = axiosInsServer.post(`${method}`, formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  if (typeof successCallback === 'function') {
    ajaxObjServer.then(function (response) {
      if (typeof successCallback === 'function') {
        successCallback(response);
      }
    });
  }
  if (typeof failCallback === 'function') {
    ajaxObjServer.catch(failCallback);
  }
  return ajaxObjServer;
}

const setConfig = function (dataService) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
  requestConfig.dataService = dataService;
}



module.exports = { request, setConfig, formRequest }