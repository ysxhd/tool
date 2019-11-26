/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-07-03 17:51:10
 * 数据服务请求方法
 */

const axios = require('axios');
const _ = require('lodash');

/**
 * 数据请求相关配置
 */
let requestConfig = {
  'dataService': '', //数据服务入口
},
  axiosInsMoni;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = function (method, params, success, fail = () => { return false }) {
  let opts = requestConfig;
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
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
        ...params
      };
      let _data = "data=" + JSON.stringify(postData);
      // console.log("before send : ", _data)
      let ajaxObjMoni = axiosInsMoni.post(`${method}`, _data);
      // let ajaxObjMoni = axiosInsMoni.post(`authentication/api/${method}`, `${postData}`, { headers: { 'Content-Type': "application/json" } });

      if (typeof success === 'function') {
        ajaxObjMoni.then(function (response) {
          if (typeof success === 'function') {
            success(response.data);
          }
        });
      }

      if ((typeof fail) === 'function') {
        ajaxObjMoni.catch(fail);
      }
      else if (opts.globalFail) {
        ajaxObjMoni.catch(opts.globalFail);
      }

      return ajaxObjMoni;
    }
  } else {
    throw new Error('请求数据需要指定方法，参数method不能为空');
  }
  return ajaxObjMoni.data;
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
const setConfig = function (dataService) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
  requestConfig.dataService = dataService;
  axiosInsMoni = axios.create({
    baseURL: dataService,
    headers: { 'Content-Type': "application/x-www-form-urlencoded" }
  });
}



module.exports = { request, requestMultiple, setConfig }