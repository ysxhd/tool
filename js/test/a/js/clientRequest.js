/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-08-27 17:24:47
 * 数据服务请求方法
 */
const ModalConfrim = require('../components/public/modal');
const axios = require('axios');
const _ = require('lodash');

/**
 * 数据请求相关配置
 */
let requestConfig = {
  'dataService': '', //数据服务入口
  'version': '1.0',
  'alias': 'exedc',
  'token': '',
  'testmode': false,
  globalFail: null
},
  axiosInsClient;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = function (method, params, success, fail) {
  let opts = JSON.parse(sessionStorage.getItem("requestConfig"));
   let token =JSON.parse(sessionStorage.getItem("user"));
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
  }
 //第一次sso过来没有token
  if(!token){
    token=""
  }else{
    token = token.token;
  }
  
  if (method) {
    if (opts.testmode) {
      success({
        'IsSuccess': true,
        'ErrMsg': '',
        'Data': testData[method]
      });
    } else {
      let postData = {
        'version': opts.version,
        'data': params || {},
        'certification': {
          'tokenID': token,
        },
        'alias': opts.alias,

      };

      let ajaxObj = axiosInsClient.post(`isgct/api/back/${method}`, "data=" + JSON.stringify(postData));

      if (typeof success === 'function') {
        ajaxObj.then(function (response) {
          if (typeof success === 'function') {
            if(response.data.code === "503"){
              ModalConfrim.ModalConfrim.show({
                title: "权限异常",
                content: "权限异常，请重新登陆~",
                okFn: () => {
                  window.location.href = document.referrer;
                },
                cancleFn: () => {
                }
              })
                return;
            }

            if(response.data.code === "504"){
              ModalConfrim.ModalConfrim.show({
                title: "权限异常",
                content: "登录超时，请重新登陆~",
                okFn: () => {
                  window.location.href = document.referrer;
                },
                cancleFn: () => {
                }
              })
              return;
            }
            success(response);
          }
        });
      }

      if ((typeof fail) === 'function') {
        ajaxObj.catch(fail);
      }
      return ajaxObj;
    }
  } else {
    throw new Error('请求数据需要指定方法，参数method不能为空');
  }

};



/**
 * @description 同时进行多个请求，全部完成时执行回调
 * @param {Array} requestList 请求列表[{method:'',params:{}}...]
 */
const requestMultiple = function (requestList, success, fail) {
  let reqlist, axiosobj;
  requestList = requestList || [];
  if (requestList.length === 0) {
    throw new Error('arguments 不能为空');
  }
  reqlist = requestList.map((item) => {
    return request(item.method, item.params, item.success, item.fail);
  });
  axiosobj = axios.all(reqlist);
  if (typeof success === 'function') {
    axiosobj.then(axios.spread(function () {
      let rets = [];
      for (let i = 0; i < arguments.length; i++) {
        rets.push(arguments[i]);
      }
      success(...rets);
    }));
  }

  if (typeof fail === 'function') {
    axiosobj.catch(fail);
  }
}

/**
 * @description 设置数据服务配置
 * @author Summer
 * @param {String} dataService 数据服务地址
 */
const setConfig = function (dataService, orgcode, token, globalFail = null, testmode = false, debug = false) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
  requestConfig.dataService = dataService;
  axiosInsClient = axios.create({
    baseURL: dataService,
    headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    //withCredentials: debug
  });

  if (typeof globalFail === 'function') {
    requestConfig.globalFail = globalFail;
  }
  requestConfig.orgcode = orgcode;
  requestConfig.token = token;
  requestConfig.testmode = testmode;
  //第一次请求需要的配置项
  sessionStorage.setItem("requestConfig",JSON.stringify(requestConfig));
}



module.exports = { request, requestMultiple, setConfig }