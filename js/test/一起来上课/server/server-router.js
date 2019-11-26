/*
 * @Author: junjie.lean
 * @Date: 2018-06-19 15:43:53
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-26 09:26:27
 */

//客户端API请求的相关逻辑

const fs = require("fs")

const express = require('express');
const router = express.Router();
const {
    parse
} = require('url');
const serverRequest = require('./../js/serverRequest');
const monitorRequest = require('./../js/monitorRequest');

const transAjax = serverRequest.request;
const moniAjax = monitorRequest.request;

const errorCatch = (err, req, res, next) => {
    if (err && req.xhr) {
        console.log(res)
        res
            .status(501)
            .json({
                result: false,
                message: "服务器异常"
            })
    } else {
        next(err);
    }
}
//大屏展示静态文件导入
//大屏展示的路由在此配置 “/tv”
router.use('/tv', express.static(__dirname + "/../largeScreen"));

// router.use((req, res, next) => {
//     let {
//         pathname,
//         query
//     } = parse(req.url, true);

//     if (pathname.indexOf('api') > -1) {
//         console.log(pathname, " : ", query)
//     } else {

//     }
//     next();
// })

router.post("*", (req, res, next) => {
    //处理跨域：
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');



    let {
        pathname
    } = parse(req.url, true);
    let query = req.body.data;

    transAjax(pathname, query, (_res) => {
        res.json(_res.data) 
        next();
    }, (err) => {
        res.json({
            result: false,
            message: "后端接口异常"
        })
        next(err);
    })

})

module.exports = {
    router,
    errorCatch
};