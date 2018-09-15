/*
 * @Author: lxx 
 * @Date: 2018-07-27 09:59:51 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-08 17:41:03
 * 前台-公共课堂
 */
import { _x } from './../js/index';

const Request = _x.util.request.request;

const LXX_MENUINFO = "LXX_MENUINFO";  //公共课堂菜单
const LXX_PUBLICPARAMS = 'LXX_PUBLICPARAMS ';  // 获取公共课堂列表入参
const LXX_PUBLICLIST = 'LXX_PUBLICLIST';  // 获取公共课堂列表
const LXX_PUBLICTOTAL = 'LXX_PUBLICTOTAL';  // 获取公共课堂总数
const LXX_PUBLICGET = 'LXX_PUBLICGET';  // 获取公共课堂总数
const LXX_PUBLICGETMENU = 'LXX_PUBLICGETMENU';  // 获取公共课堂总数

const init = {
    treeInfo: {
        treeInfos: []
    }, // 学院-科目-老师对应关系列表
    params: {
        "grdId": "all",  // 学院ID
        "subjectId": "all",  // 科目ID
        "sort": "2",  // 排序标识
        "currentPage": 1,  // 当前页
        "teacherId": "all",  // 老师ID
        "pageSize": 20 // 每页条数
    },
    classData: [],  // 公共课堂数据
    totalNum: 0,  // 公共课堂总数
    isGetTotal: true,
    isGetMenu: false
}

export function publicClass(state = init, action) {
    // console.log('lxx',action);
    switch (action.type) {
        case 'LXX_MENUINFO':
            return { ...state, treeInfos: action.data, isGetMenu: true };
        case 'LXX_PUBLICPARAMS':
            return { ...state, params: action.data };
        case 'LXX_PUBLICLIST':
            return { ...state, classData: action.data }
        case 'LXX_PUBLICTOTAL':
            return { ...state, totalNum: action.data }
        case 'LXX_PUBLICGET':
            return { ...state, isGetTotal: action.data }
        case 'LXX_PUBLICGET':
            return { ...state, isGetMenu: false }
        default:
            return state;
    }
}

/**
 * 获取学院-科目-老师对应关系列表
 */
export function getTreeInfos() {
    let treeInfo = { treeInfos: [] };
    return dispatch => {
        Request('default/index/getColSubTeaInfo', {}, (res) => {
            if (res.data) {
                dispatch({
                    type: 'LXX_MENUINFO',
                    data: res.data
                });
            } else {
                dispatch({
                    type: 'LXX_MENUINFO',
                    data: treeInfo
                });
            }
        }, () => {
            dispatch({
                type: 'LXX_MENUINFO',
                data: treeInfo
            });
        })

    }
}

/**
 * 更新入参并获取课堂数据
 */
export function handleUpdateParams(obj) {
    if (obj) {
        return dispatch => {
            dispatch({
                type: 'LXX_PUBLICPARAMS',
                data: obj
            });
        }
    }
}

// 获取公共课堂列表
export function getPublicData(param) {
    // console.log(param);
    this.updateGetStatus(true);

    return dispatch => {
        Request('public/publicClass/getPubClassList', param, (res) => {
            // console.log(res);
            if (res.result && res.data) {
                let Data = res.data;
                if (Data && Data.pubClassList) {
                    let params = {
                        "grdId": param.grdId,
                        "subjectId": param.subjectId,
                        "teacherId": param.teacherId
                    }
                    this.getPublicTotal(params);
                    dispatch({
                        type: 'LXX_PUBLICLIST',
                        data: Data.pubClassList
                    });
                } else {
                    dispatch({
                        type: 'LXX_PUBLICLIST',
                        data: []
                    });
                }
            }
        }, () => {

        });
    }
}

/**
 * 获取公共课堂总数
 */
export function getPublicTotal(params) {
    // console.log(params);
    return dispatch => {
        Request('public/publicClass/getPubClassCount', params, (res) => {
            // console.log(res);
            if (res.result && res.data) {
                this.updateGetStatus(false);
                dispatch({
                    type: 'LXX_PUBLICTOTAL',
                    data: res.data.totalCurNum
                });
            }
        });
    }
}

/**
 * 更新isGet状态
 */
export function updateGetStatus(sta) {
    return dispatch => {
        dispatch({
            type: 'LXX_PUBLICGET',
            data: sta
        });
    }
}
