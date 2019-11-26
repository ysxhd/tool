/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: 甘维添
 * @Last Modified time: 2018-04-13 14:23:33
 * 数据服务请求方法
 */
import axios from 'axios';
import _ from 'lodash';
import Session from './session';

/**
 * 数据请求相关配置
 */
let requestConfig = JSON.parse(Session.getSession("requestConfig")) || {};
let axiosIns;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = function (method, params, success, fail, cert) {
  var opts = requestConfig;
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
  }
  if (method) {
    var ajaxObj;
    if (params instanceof FormData) {
      // params.append("version", opts.version);
      // params.append("alias", opts.alias);
      // params.append("orgcode", opts.orgcode);
      params.append({ "token": opts.token });

      ajaxObj = axiosIns.post(method, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      console.log((opts.token||sessionStorage.token))
      var postData = {
        // 'version': opts.version || "1.0",
        'token': opts.token||sessionStorage.token,
        'data': JSON.stringify(params) || {},
        // 'alias': opts.alias
      };
      ajaxObj = axiosIns.post(method, postData);
    }
    if (typeof success === 'function') {
      ajaxObj.then(function (response) {
        if (typeof success === 'function') {
          success(response.data);

        }
      });
    }

    if ((typeof fail) === 'function') {
      ajaxObj.catch(fail);


    }
    else if (opts.globalFail) {
      ajaxObj.catch(opts.globalFail);
    }

    return ajaxObj;
  } else {
    throw new Error('请求数据需要指定方法，参数method不能为空');
  }

};

/**
 * 包含上传文件和普通请求的表单方式
 * @author:lean
 * @param {Object} params 请求具体参数
 */
const formRequest = function (params, successCallback, failCallback) {
  var paramObj = params,
    action = params.action,
    opts = JSON.parse(Session.getSession("requestConfig")),
    ajaxObj,
    axiosIns = axios.create(JSON.parse(Session.getSession("axiosBaseInfo"))),
    formDataObj = new FormData();
  formDataObj.append("version", opts.version);
  formDataObj.append("alias", opts.alias);
  // formDataObj.append("orgcode", opts.orgcode);
  formDataObj.append("certification", { TokenID: opts.token });
  formDataObj.append("data", JSON.stringify(paramObj.data || {}));
  if (paramObj.file && paramObj.file.length > 0) {
    for (var file of paramObj.file) {
      formDataObj.append("files", file);
    }
    ajaxObj = axiosIns.post(action, formDataObj, { headers: { 'Content-Type': 'multipart/form-data' } });
  } else {
    ajaxObj = axiosIns.post(action, formDataObj, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }
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
        rets.push(arguments[i].data);
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
 * @param {Function} globalFail 全局错误回调
 * @param {Boolean} isDebug 数据服务地址
 * @param {String} orgcode 机构代码
 * @param {String} token 用户token
 * @param {Object} cert 用户鉴权
 */
const setConfig = function (dataService, globalFail, isDebug, orgcode, token) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
  // var requestConfig = {};
  requestConfig.dataService = dataService;
  // requestConfig.orgcode = orgcode;
  requestConfig.token = token.token;
  requestConfig.alias = "ISCEM";
  requestConfig.version = "1.0";
  requestConfig.globalFail = globalFail;

  axiosIns = axios.create({
    baseURL: dataService,
    withCredentials: isDebug,
    timeout: 60000
  });

  Session.setSession("requestConfig", requestConfig);

  let axiosBaseInfo = { baseURL: dataService, withCredentials: isDebug };
  Session.setSession("axiosBaseInfo", axiosBaseInfo);

  if (typeof globalFail === 'function') {
    requestConfig.globalFail = globalFail;
  }
}

export default { request, requestMultiple, formRequest, setConfig }