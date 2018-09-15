/*
 * @Author: lxx 
 * @Date: 2018-08-27 22:14:20 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-13 11:36:26
 */
import Cookies from 'js-cookie';
import { _x } from './index';
import _ from 'lodash';

const RequestList = _x.util.request.requestMultiple;

/**
 * 全局变量
 */

let other;

const G = {
    title: "课堂生态",
    dataServices: "",
    rootPath: '',
    /**
     * 用户信息
     */
    baseinfo: {

    },
    isdebug: false,
    loaded: false,
    isVer: '0',
    other,
}

const debug = process.env.NODE_ENV === 'development';
// if (debug) {
//     G.dataServices = 'http://10.10.1.5:8080/cloud';
// } else {
//     let ori = window.location.origin;
//     if (ori.indexOf('localhost') != -1) {
//         G.dataServices = 'http://10.10.1.204:8080/cloud';
//     } else {
//         G.dataServices = ori + "/cloud"
//     }
// }

/**
 * 获取基础数据
 */
export function getBaseinfo() {
    //解析出根地址
    G.rootpath = window.location.href.substring(0, window.location.href.indexOf('/dsj'));
    var uinfos = Cookies.get('tpk_cookies');

    if (debug) {
        uinfos = '{"teacherId":"123456789","rm":"系统管理员","userId":"411101500001_SUPERUSER","key":"QWERT","nm":"超级管理员","roleLevel":1}';
        G.isdebug = true;
    }
    if (uinfos) {
        uinfos = JSON.parse(uinfos);
        G.baseinfo = {
            uname: uinfos.nm,
            userid: uinfos.userId,
            utype: uinfos.rm,
            ukey: uinfos.key,
            teacherid: uinfos.teacherId,
            systemname: '课堂生态',
            role: uinfos.roleLevel,
            serviceroot: G.isdebug ? 'http://10.10.1.5:8080/cloud' : G.rootpath
            // serviceroot: G.isdebug ? 'http://10.10.1.227:8080/cloud' : G.rootpath
        };
        G.dataServices = G.baseinfo.serviceroot;
    } else {
        window.location.href = G.rootpath;
    }
}

/**
 * 获取全局数据
 */
export function loadGlobal() {
    getPublicData();
}

/**
 * 获取全局
 */
function getPublicData() {
    let reList = [
        {
            method: 'api/web/user_setting/get_functions',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.configInfo = res.data;
                    sessionStorage.configInfo = JSON.stringify(res.data);
                    let serverTitle = res.data.projectName;
                    document.querySelector('title').innerHTML = serverTitle || G.title;
                }
            }
        },
        // {
        //     method: 'getBigDataFunction',
        //     params: { key: G.baseinfo.ukey },
        //     success: (res) => {
        //         if (res.result && res.data.length) {
        //             sessionStorage.configInfo = JSON.stringify(res.data);
        //             G.configInfo = res.data;
        //             let serverTitle = res.data[0].functionName;
        //             document.querySelector('title').innerHTML = serverTitle || G.title;

        //             res.data[0].childrenList.map(item => {
        //                 if (item.functionName === '生态大数据') {
        //                     this.setState({ childMenu: item.childrenList });
        //                     let i = _.find(tem.childrenList, { functionName: '报表中心' }).functionEnableFlag;
        //                     if (i) {
        //                         sessionStorage.isShowdetail = JSON.stringify(true);
        //                     } else {
        //                         sessionStorage.isShowdetail = JSON.stringify(false);
        //                     }
        //                     return;
        //                 }
        //             });
        //         }
        //     }
        // },
        {
            method: 'api/web/common/college_dropdown',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.trgList = res.data;
                    sessionStorage.trgList = JSON.stringify(res.data);
                }
            }
        },
        {
            method: 'api/web/common/grade_dropdown',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.grdList = res.data;
                    sessionStorage.grdList = JSON.stringify(res.data);
                }
            }
        },
        {
            method: 'api/web/common/open_org',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.openTrgList = res.data;
                    sessionStorage.openTrgList = JSON.stringify(res.data);
                }
            }
        },
        {
            method: 'api/web/public/get_course_type',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.typeList = res.data;
                    sessionStorage.typeList = JSON.stringify(res.data);
                }
            }
        },
        {
            method: 'api/web/common/get_tea_eventType',
            params: {},
            success: (res) => {
                if (res.result && res.data) {
                    G.eventList = res.data;
                    sessionStorage.eventList = JSON.stringify(res.data);
                }
            }
        },
        // {
        //     method: 'getVersion',
        //     params: {},
        //     success: (res) => {
        //         if (res.result && res.data) {
        //             G.isVer = res.data;
        //             if (res.data === '1') {
        //                 G.reportMenu[0].children[0].name = '学院报表';
        //                 G.reportMenu[2].children[0].name = '学院报表';
        //                 G.reportMenu[1].children.splice(0, 0, { name: '学院报表', key: 'ktzlbb_xybb', reqPath: '/bd/r_qrc' });
        //                 G.reportMenu[3].children.splice(0, 0, { name: '学院报表', key: 'jskqbb_xybb', reqPath: '/bd/r_trc' });
        //                 console.log(G.reportMenu);
        //             }
        //             sessionStorage.isVer = JSON.stringify(res.data);
        //         }
        //     }
        // }
    ];
    RequestList(reList, () => {
        G.loaded = true;
        _x.env.dispatch(document, _x.env.loaded, G);
    })
}

// if (sessionStorage.userInfo && sessionStorage.userInfo !== 'undefined') {
//     G.userInfo = JSON.parse(sessionStorage.userInfo);
// }
// if (sessionStorage.paramsInfo && sessionStorage.paramsInfo !== 'undefined') {
//     G.paramsInfo = JSON.parse(sessionStorage.paramsInfo)
// }
if (sessionStorage.configInfo && sessionStorage.configInfo !== 'undefined') {
    G.configInfo = JSON.parse(sessionStorage.configInfo)
}
if (sessionStorage.trgList && sessionStorage.trgList !== 'undefined') {
    G.trgList = JSON.parse(sessionStorage.trgList)
}
if (sessionStorage.grdList && sessionStorage.grdList !== 'undefined') {
    G.grdList = JSON.parse(sessionStorage.grdList)
}
if (sessionStorage.openTrgList && sessionStorage.openTrgList !== 'undefined') {
    G.openTrgList = JSON.parse(sessionStorage.openTrgList)
}
if (sessionStorage.typeList && sessionStorage.typeList !== 'undefined') {
    G.typeList = JSON.parse(sessionStorage.typeList)
}
if (sessionStorage.eventList && sessionStorage.eventList !== 'undefined') {
    G.eventList = JSON.parse(sessionStorage.eventList)
}
if (sessionStorage.isVer && sessionStorage.isVer !== 'undefined') {
    G.isVer = JSON.parse(sessionStorage.isVer)
}


if (window) {
    window.G = G;
}
export default G;