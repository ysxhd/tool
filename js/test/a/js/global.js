/*
 * @Author: junjie.lean 
 * @Date: 2018-06-19 15:35:06 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-06-22 09:53:16
 */

//前端全局部分配置

import { server_config as config } from '../server/server-conf';

const G = {
    serverTitle: config.serverTitle, //全局title配置
    middlewarePath: config.middlewarePath,//中间层地址 前端往此地址发送http请求
    nextServicePort: config.nextServerPort, //中间层端口 前端往此端口发送http请求
}

if (typeof window !== "undefined") {
    //client
    window.G = G;
}

export { G };