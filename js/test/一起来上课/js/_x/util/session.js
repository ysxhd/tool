/*
 * @Author: SummerSKW 
 * @Date: 2017-12-29 13:25:44 
 * @Last Modified by:   SummerSKW 
 * @Last Modified time: 2017-12-29 13:25:44 
 * 标签页之间Session共享处理
 */
import { on } from './../env/env';

if (!sessionStorage.length) {
  // 设置localStorage触发事件，进行共享数据
  localStorage.setItem('getSessionStorage', Date.now());
}

on(window, 'storage', function(event){
  if (event.key === 'getSessionStorage') {
    //其他标签页收到获取session的请求
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
    localStorage.removeItem('sessionStorage');
  }else if(event.key === 'sessionStorage'){
    if(event.newValue){
      //本标签页收到已有的session内容
      var data = JSON.parse(event.newValue);
  
      for (var key in data) {
        sessionStorage.setItem(key, data[key]);
      }
    }
  }
});

const getSession = function(key){
  return sessionStorage.getItem(key);
};

const setSession = function(key, value){
  sessionStorage.setItem(key, value);
  var newSession = {};
  newSession[key] = value;
  localStorage.setItem('sessionStorage', JSON.stringify(newSession));
  localStorage.removeItem('sessionStorage');
};

export default { getSession, setSession }