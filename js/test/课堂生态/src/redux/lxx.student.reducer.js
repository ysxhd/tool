/*
 * @Author: lxx 
 * @Date: 2018-08-27 22:43:44 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-07 16:55:59
 * 学生出勤页面reducer
 */

import { _x } from './../js/index';

const Request = _x.util.request.request;

const LXX_COLREPORTPARAMS = 'LXX_COLREPORTPARAMS';  // 学院报表入参
const LXX_COLREPORTLIST = 'LXX_COLREPORTLIST';  // 学院报表内容
const LXX_DATAREPORTPARAMS = 'LXX_DATAREPORTPARAMS';  // 原始数据入参
const LXX_DATAREPORTLIST = 'LXX_DATAREPORTLIST';  // 原始数据报表内容
const LXX_CHANGESTATUS = 'LXX_CHANGESTATUS';  // 更新loading状态

const init = {
    colParam: {
        "startTime": '', //开始时间 ;
        "endTime": '', //结束时间;
        "trgName": "", //学院名称
        "trgId": 'all', // 学院id
        "courseOrder": 0, //1表示升序，-1表示降序
        "numberOrder": 0, //1表示升序，-1表示降序
        "pageSize": 20,//每页显示条数
        "pageIndex": 1 //当前页
    },
    colList: [],
    total: 0,
    dataParam: {
        "startTime": '', //开始时间
        "endTime": '', //结束时间
        "trgName": "", //学院名称
        "trgId": 'all', // 学院id
        "classId": "all", //班级id
        "orgId": "all", //机构名称 如果为所有传 "all "
        "type": "all", // 如果为所有传 "all "
        "teacherId": "all", //教教师id 如果为所有传 "all "
        "courseId": "all", //课程id 如果为所有传 " all"
        "pageSize": 20, //每页显示多少条
        "pageIndex": 1, //当前页
    },
    dataList: [],
    dataTotal: 0,
    loading: true
}

export function studentReducer(state = init, action) {
    switch (action.type) {
        case 'LXX_COLREPORTPARAMS':
            return { ...state, colParam: action.data };
        case 'LXX_COLREPORTLIST':
            return { ...state, colList: action.list, total: action.total };
        case 'LXX_DATAREPORTPARAMS':
            return { ...state, dataParam: action.data };
        case 'LXX_DATAREPORTLIST':
            return { ...state, dataList: action.list, dataTotal: action.total };
        case 'LXX_CHANGESTATUS':
            return { ...state, loading: action.data };
        default:
            return state;
    }
}

/**
 * 更新学院报表入参
 */
export function updateColParams(param) {
    return dispatch => {
        this.changeLoadingStatus(true);
        // 获取学院报表数据
        this.getColListData(param);
        dispatch({
            type: 'LXX_COLREPORTPARAMS',
            data: param
        });
    }
}

/**
 * 获取学院报表数据
 * @param {* 获取学院报表入参} param 
 */
export function getColListData(param) {

    return dispatch => {
        Request('api/web/stu_report/get_academy_report', param, (res) => {
            if (res.data && res.data.totalElements && res.data.pageContent) {
                this.changeLoadingStatus(false);
                dispatch({
                    type: 'LXX_COLREPORTLIST',
                    list: res.data.pageContent,
                    total: res.data.totalElements
                })
            } else {
                this.changeLoadingStatus(false);
                dispatch({
                    type: 'LXX_COLREPORTLIST',
                    list: [],
                    total: 0
                })
            }
        })
    }
}

/**
 * 更新原始数据报表入参
 */
export function updateDataParams(param) {
    return dispatch => {
        // 获取学院报表数据
        // this.getDataList(param);
        dispatch({
            type: 'LXX_DATAREPORTPARAMS',
            data: param
        });
    }
}

/**
 * 获取原始数据报表数据
 * @param {* 原始数据报表入参} param 
 */
export function getDataList(param) {
    return dispatch => {
        this.changeLoadingStatus(true);
        Request('api/web/stu_report/get_original_report', param, (res) => {
            if (res.data && res.data.totalElements && res.data.pageContent) {
                dispatch({
                    type: 'LXX_DATAREPORTLIST',
                    list: res.data.pageContent,
                    total: res.data.totalElements
                })
                this.changeLoadingStatus(false);
            } else {
                dispatch({
                    type: 'LXX_DATAREPORTLIST',
                    list: [],
                    total: 0
                })
                this.changeLoadingStatus(false);
            }
        })
    }
}

/**
 * 更新loading状态
 * @param {* loading入参} param 
 */
export function changeLoadingStatus(param) {
    return dispatch => {
        dispatch({
            type: 'LXX_CHANGESTATUS',
            data: param
        })
    }
}