/*
 * @Author: junjie.lean
 * @Date: 2018-06-25 08:58:03
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-07-02 13:36:15
 */

const conf = require('./server-conf').server_config;
const os = require('os');
const cp = require('child_process');
const path = require('path');
const spawn = cp.spawn;

class SysInfoFun {
    constructor() {
        this.sysinfo = {
            info: []
        }
    }

    action() {
        let that = this;
        setInterval(() => {
            let info = {};
            info.cpus = os.cpus();
            info.freemem = os.freemem();
            info.io = '';

            //磁盘IO获取 由于node os库未提供api，在考虑不同系统的兼容性
            if (os.type() === "Linux" || os.type() === "Darwin") {
                info.io = "-"
            } else {
                info.io = "-"
            }
            that.sysinfo.info.push({ _date: new Date().getTime(), info });
        }, conf.moniDataGetInterval)
    }
    destroy() {
        //内存控制
        let info = [];
        this.sysinfo = {
            info
        }
        // clearInterval(this.timer.cpuActionTimer)
        // clearInterval(this.timer.memActionTimer)
    }
}

module.exports = {
    SysInfoFun
}