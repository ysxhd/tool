/*
 * @Author: junjie.lean 
 * @Date: 2018-06-19 15:11:57 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-10 17:13:18
 */



const server_config = {
    // middlewarePath: "http://10.4.2.143",//String 中间层服务器地址,需输入服务器当前地址
   middlewarePath: "http://10.10.1.81",
    nextServerPort: 6190,  //Number 中间层服务端口号:如果需要80端口可能需要ngix或者是其他webserver做反向代理

   // tureServicePath: "http://10.10.1.182", //String 后端数据服务统一地址
    tureServicePath: "http://10.4.2.143", //String 服务器
    tureServicePort: 8089, //Number 后端数据服务端口号
    //Boolean 是否使用多线程模式
    useMultithread: false,
    //Boolean 是否启用服务器监控模式
    useServerMonitor: false,
    //String 监控平台地址
    // moniterServerPath: "http://192.168.30.20",
    moniterServerPath: "http://192.168.30.22",
    //Number 监控平台端口
    moniterServerPort: 4000,
    //Number (ms) 获取系统信息定时器时间间隔，当启用服务器监控模式时有效
    moniDataGetInterval: 1000 * 5,
    //Number（ ms ）将数据发送到监控平台定时器时间间隔，当启用服务器监控模式时有效
    moniDataOutInterval: 1000 * 30,
    //String 全局项目title
    serverTitle: "一起去上课--管理端",  
};




module.exports = {
    server_config,
}