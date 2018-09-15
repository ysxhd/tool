/*
 * @Author: Summer
 * @Date: 2017-08-01 17:16:07
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-27 11:08:27
 * 数据服务请求方法
 */
import axios from 'axios';
import _ from 'lodash';
import Session from './session';
import { G } from '../../g';
import{ tokenDia } from '../../../components/modal'
/**
 * 数据请求相关配置
 */


let axiosIns;
/**
 * 请求数据服务
 * @param {String} method 请求的方法
 * @param {JSON} params 提交参数
 */
const request = function (method, params, success, fail) {
   var opts = JSON.parse(Session.getSession("requestConfig"));
   var token = sessionStorage.getItem("token");
  // var opts = requestConfig;
  if (!opts.dataService) {
    throw new Error('需要设置数据服务地址，请执行_x.util.request.setConfig进行设置');
  }

  if (method) {
    var ajaxObj;
    if (params instanceof FormData) {
      params.append("version", opts.version);
      params.append("alias", opts.alias);
      params.append("orgcode", opts.orgcode);
      params.append("token", token);
      params.append("level", opts.level);
      ajaxObj = axiosIns.post(method, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      var postData = {
        'version': opts.version || "1.0",
        'data': JSON.stringify(params || {}),
        'alias': opts.alias,
        'orgcode': opts.orgcode,
        'token': requestConfig.token
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

  var token = sessionStorage.getItem("token");
  var opts = JSON.parse(Session.getSession("requestConfig"));
  var paramObj = params,
    action = params.action,
    ajaxObj,
    axiosIns = axios.create(JSON.parse(Session.getSession("axiosBaseInfo"))),
    formDataObj = new FormData();
  formDataObj.append("version", opts.version);
  formDataObj.append("alias", opts.alias);
  formDataObj.append("orgcode", opts.orgcode);
  // formDataObj.append("token", opts.token);
  
  formDataObj.append("token", token);

  formDataObj.append("level", opts.level); 
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
        let codeInfo = response.data.code;
        //用户是否权限异常：504为未登录，503为权限异常
        if(codeInfo == 503){
          tokenDia({
            title:'信息提示',
            content:'权限异常，请重新登陆~',
            className:0,
            okText:'确定',
            width:550,
            fnOK:() => {
              //跳转到登录页
              var url = window.location.href.split("#");
              var login =  url[0]+"#/Login";
              window.open(login);
              window.close();
               return;
            },
            fnCancel:() => {
              console.log('取消回调')
            }
          })
        }else if(codeInfo == 504){
          //token过期
          tokenDia({
            title:'信息提示',
            content:'登录超时，请重新登陆~',
            className:0,
            okText:'确定',
            width:550,
            fnOK:() => {
              //存储用户token过期时的当前页面
              sessionStorage.setItem('myUrl',window.location.href);
              var url = window.location.href.split("#");
              var login =  url[0]+"#/Login";
              window.open(login);
              window.close();
              return;
            },
            fnCancel:() => {
              console.log('取消回调')
            }
          })
        }

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
 * @param {String} type 判断不通用户的token
 */
const setConfig = function (dataService, globalFail, isDebug, orgcode, token,level) {
  dataService = dataService || "/";
  if (!_.endsWith(dataService, '/')) {
    dataService = dataService + '/';
  }
   var requestConfig = {};
  requestConfig.dataService = dataService;
  requestConfig.orgcode = orgcode;
  requestConfig.alias = "unSet";
  requestConfig.version = "1.0";
  requestConfig.token = token;
  requestConfig.globalFail = globalFail;
  axiosIns = axios.create({
    baseURL: dataService,
    withCredentials: isDebug
  });

  //第一次请求需要的配置项
  Session.setSession("requestConfig",requestConfig);
   

  let axiosBaseInfo ={ baseURL: dataService, withCredentials: isDebug };
  

  Session.setSession("axiosBaseInfo", axiosBaseInfo);

  if (typeof globalFail === 'function') {
    requestConfig.globalFail = globalFail;
  }

}

export default { request, requestMultiple, formRequest, setConfig }