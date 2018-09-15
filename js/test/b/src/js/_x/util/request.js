/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-04 16:31:24
 * 数据服务请求方法
 */
import axios from 'axios';
import _ from 'lodash';
// import { Modal, Button } from 'antd';


/**
 * 数据请求相关配置
 */
var requestConfig = {
  dataService: '', //数据服务入口
  version: '1.1',
  alias: 'clweb',
  token: '',
},
  axiosIns;
  var testData = {};
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = function (method, params, success, fail) {

  var opts = requestConfig;
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
  }

  if (method) {
    if (opts.testmode) {
      success({
        IsSuccess: true,
        ErrMsg: '',
        Data: testData[method]
      });
    } else {
      var postData = {
        version: opts.version,
        data: params || {},
        alias: opts.alias,
      };
      const config = { headers: { "Content-Type": "application/json" } };

      const ajaxObj = axiosIns.post(`/${method}`, `${JSON.stringify(postData)}`, config);
      ajaxObj.then(function (response) {
        // if (response.data.code == '-2') {
        //   Modal.error({
        //     title: sessionStorage.configInfo.sysName + '的异常：' || '异常',
        //     content: "当前登录用户已失效，请重新登录！",
        //     onOk: () => {
        //       let href = window.location.href;
        //       window.open(href, "_self", "");
        //       window.close();
        //     }
        //   })
        // }
        if (typeof success === 'function') {
          success(response.data);
        }
      }).catch(() => {

      })

      if ((typeof fail) === 'function') {
        ajaxObj.catch(fail);
      } else if (opts.globalFail) {
        ajaxObj.catch(opts.globalFail);
      }

      return ajaxObj;
    }
  } else {
    throw new Error('请求数据需要指定方法，参数method不能为空');
  }
};

/**
 * 包含上传文件和普通请求的表单方式
 * @author:Jcheng.Liu
 * @param {Object} params 请求具体参数
 */
const formRequest = function (method, params, successCallback, failCallback) {
  let opts = requestConfig;
  let formDataObj = new FormData();

  for (let o in params) {
    formDataObj.append(o, params[o])
  }

  // formDataObj.append('file', params.file);
  // formDataObj.append('folderId', params.folderId);

  formDataObj.append('token', opts.token);
  formDataObj.append('orgCode', opts.orgcode);

  let ajaxObj = axiosIns.post(`/${method}`, formDataObj, { headers: { "Content-Type": 'multipart/form-data' } });

  if (typeof successCallback === 'function') {
    ajaxObj.then(function (response) {
      if (typeof successCallback === 'function') {
        successCallback(response.data);
      }
    });
  }
  if (typeof failCallback === 'function') {
    ajaxObj.catch(failCallback);
  } else if (opts.globalFail) {
    ajaxObj.catch(opts.globalFail);
  }
  return ajaxObj;
}


/**
 * @description 同时进行多个请求，全部完成时执行回调
 * @param {Array} requestList 请求列表[{method:'',params:{}}...]
 */
const requestMultiple = function (requestList, success, fail) {
  var reqlist, axiosobj;
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
      var rets = [];
      for (var i = 0; i < arguments.length; i++) {
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
const setConfig = function (dataService, token, orgcode) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
  requestConfig.dataService = dataService;
  axiosIns = axios.create({
    baseURL: dataService,
  });

  requestConfig.token = token;
  requestConfig.orgcode = orgcode;
}

/**
 * @description 多余字符串截取
 * @author lean
 */

const sliceWords = (words = "", len) => {
  if (Object.prototype.toString.call(words).slice(8, -1).toLowerCase() !== "string") {
    throw new Error('lean:argument "' + words + '" type error');
  }
  if (Object.prototype.toString.call(len).slice(8, -1).toLowerCase() !== "number") {
    throw new Error('lean:argument "' + len + '" type error');
  }
  if (words.length <= len) {
    return words;
  }
  return words.slice(0, len) + '...'
}

export default { request, requestMultiple, setConfig, sliceWords, formRequest }