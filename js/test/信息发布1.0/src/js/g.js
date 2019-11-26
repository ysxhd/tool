import _x from './_x/index';
const { session, base } = _x.util;
const { getSession, setSession } = session;
const { setProperty } = base;

var g = {
  uinfo:{},
  //公司调试开发地址：192.168.51.38
 // serverUrl:'http://192.168.51.68:8087/', //罗涛
// serverUrl:'http://192.168.51.15:8085/information',  //罗云
   // serverUrl:'http://192.168.51.6:8087/',  //钟伟
  // serverUrl:'/information/',  //服务器
  //serverUrl:'localhost:8085'
 serverUrl:'http://192.168.20.67:8080/information',// 线上
  //缓存前缀
  // sessionPrefiex:'__'
};

setProperty(9, g, "uinfo", function(){
  var info = getSession("uinfo");
  try{
    if(info){
      return JSON.parse(info);
    }else{
      return {};
    }
  }catch(e){
    return {};
  }
}, function(newInfo){
  try{
    if(newInfo){
      setSession("uinfo", JSON.stringify(newInfo));
    }else{
      console.warn("设置SessionStorage传入的值不能为空！");
    }
  }catch(e){
    console.warn("设置SessionStorage传入的值必须是Json对象！");
  }
});

export const G = g;