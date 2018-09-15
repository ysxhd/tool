/*
 * @Author: junjie.lean
 * @Date: 2018-06-19 15:06:59
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-23 16:12:13
 */

const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const { parse } = require('url');
const cluster = require('cluster');
const os = require('os');
const { server_config } = require('./server-conf');
const { router, errorCatch } = require('./server-router');
const monitor = require('./server-monitor');

const server_request = require('./../js/serverRequest');
const monitor_request = require('./../js/monitorRequest');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

//数据请求相关配置 前端请求node中间层的请求实例化 鉴于用户token等信息，此实例在前端初始化 node中间层请求后端数据层的请求实例化：
const dataServices = `${server_config.tureServicePath}:${server_config.tureServicePort}`;
server_request.setConfig(dataServices);
const serverAjax = server_request.request;

//node中间层请求监控平台的请求实例化
const moniterServices = `${server_config.moniterServerPath}:${server_config.moniterServerPort}`;
monitor_request.setConfig(moniterServices);
const moniAjax = monitor_request.request;

//next服务相关配置
const port = server_config.nextServerPort;
const multithread_modal = server_config.useMultithread;

//next主程序：
let master_process = async () => {
  //next server
  await app
    .prepare()
    .then(() => {
      const server = express();
      server.use(bodyParser.json());
      server.use(bodyParser.urlencoded({ extended: true }));
      // server.use('/tv', express.static('./../largeScreen'));
      //前端接口请求转发逻辑：
      server.use(router);
      // server.use(errorCatch);
      server.get('*', (req, res, next) => {
        let URL = parse(req.url, true);
        let { pathname, query } = URL;
        //路由重定向逻辑
        let redirect;
        switch (pathname) {
          case "/":
            {
              redirect = '/classRoom';
              app.render(req, res, redirect, query);
              break;
            }
          case "/test":
            {
              redirect = '/index';
              app.render(req, res, redirect, query);
              break;
            }
          default:
            {
              handle(req, res, URL);
            }
        }
      })
      //服务启动逻辑：
      server.listen(port, (err) => {
        if (err) {
          console.log("some error happen, can't start up server");
          return false
        }
        console.log(`Worker(pid: ${process.pid}) is start up.`);
        console.log('Event Environment is ' + (dev
          ? "Development"
          : "Production") + '.');

      })

    })
    .catch((error) => {
      console.log(error.stack);
      process.exit(1);
    })
}

//多线程next的实现 如果基于此模式启next服务，可以增加并发，但是不能再使用文件记录的方式统计API
if (multithread_modal) {
  if (cluster.isMaster) {
    console.log(`Master process(pid:${process.pid}) is running.`);
    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} is died,exit id :${code}.signal : ${signal}`);
    })
  } else {
    master_process();
  }
} else {
  master_process();
}

//服务器监控实现
if (server_config.useServerMonitor) {
  let doMonitor = new monitor.SysInfoFun();
  doMonitor.action();
  setInterval(() => {
    let dataList = doMonitor.sysinfo.info;
    moniAjax('/moni/sysinfo', {
      data: dataList
    }, doMonitor.destroy);
  }, server_config.moniDataOutInterval)
}

//接口统计实现 用户状态维护 页面模块可配置