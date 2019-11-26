/*
 * @Author: zhangning 
 * @Date: 2018-08-28 13:40:32 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-13 13:16:38
 */
import {
    message
} from 'antd';
import {
    _x
} from '../js/index'
const ZN_showAddModal = 'ZN_showAddModal'; //新增报告modal
const ZN_changeOutside = 'ZN_changeOutside'; //修改初始化表格的属性

const ZN_changeValue2 = 'ZN_changeValue2'; //新增报告的input value修改
const ZN_GET_CUSTOME_TABLE = 'ZN_GET_CUSTOME_TABLE'; //自定义报告的表格数据

const ZN_MAKE_REPORT = 'ZN_MAKE_REPORT'; //是否再下载自定义报告
const ZN_CHANGESTATUS = 'ZN_CHANGESTATUS'; //自定义报告loading
const ZN_OPTIONS = 'ZN_OPTIONS'; //新增报告的check
const ZN_ADD_START = 'ZN_ADD_START'; //新增报告的check
const ZN_ADD_END = 'ZN_ADD_END'; //新增报告的check
const ZN_ADD_STATUS = 'ZN_ADD_STATUS'; //新增报告的只允许点击一次,同时也控制添加modal的loading

const Request = _x.util.request.request; //请求

const init = {
    isdownload: false, //是否再下载自定义报告
    addShow: false, //新增报告模态框
    custome_list: [], //自定义报告的表格数据
    loading_cust: false, //自定义报告loading
    colParam: {
        "startDate": '', //开始时间 ;
        "endDate": '', //结束时间;
        "seacherContent": "", //报告名称
        "pageSize": 20, //每页显示条数
        "pageIndex": 1 //当前页
    },
    btnStatus:false, ///新增报告的只允许点击一次
    totalPage: 0, //自定义
    totalElements:0,//总条数
    addStartTime: "", //新增报告的开始时间
    addEndTime: "", //新增报告的结束时间
    addInputValue: "", //新增报告的输入框
    //addcheck: {"score":0,"order":0,"student":0,"teacher":0}, //报告包含内容
    addcheck: [],
    options: [{
            label: '课堂秩序',
            value: 'score'
        },
        {
            label: '课堂质量',
            value: 'order'
        },
        {
            label: '学生出勤',
            value: 'student'
        },
        {
            label: '教师考勤',
            value: 'teacher'
        }
    ]
}

export function znSystemReducer(state = init, action) {
    switch (action.type) {
        case ZN_GET_CUSTOME_TABLE:
            return { ...state,
                custome_list: action.data,
                totalPage: action.totalPage,
                totalElements:action.totalElements
            };
        case ZN_changeOutside:
            return { ...state,
                colParam: action.payload
            };
        case ZN_CHANGESTATUS:
            return { ...state,
                loading_cust: action.data
            };
        case ZN_OPTIONS:
            return { ...state,
                addcheck: action.data
            };
        case ZN_showAddModal:
            return { ...state,
                addShow: action.payload
            };
        case ZN_ADD_START:
            return { ...state,
                addStartTime: action.data
            };
        case ZN_ADD_END:
            return { ...state,
                addEndTime: action.data
            };
        case ZN_changeValue2:
            return { ...state,
                addInputValue: action.payload
            };
        case ZN_ADD_STATUS:
            return { ...state,
                btnStatus: action.payload
            };

        case ZN_MAKE_REPORT:
            return { ...state,
                isdownload: action.payload
            };
        default:
            return state;
    }
}


/**
 * 更新loading状态
 * @param {* loading入参} flag 
 */
export function zn_change_prop(params) {
    return dispatch => {
        this.zn_change_jsProp(params);
        this.initCustomeTable(params, true);
    }
}

//初始化表格

/**
 * 
 * @param {*} ,请求参数 
 * @param {* boolean} flag  true 改变参数，false默认参数
 */
export function initCustomeTable(params, flag) {
    return dispatch => {
        let data
        dispatch({
            type: ZN_CHANGESTATUS,
            data: true
        })
        dispatch({
            type: ZN_changeOutside,
            payload: params
        });
        if (flag) {
            data = {
                "seacherContent": params.seacherContent ? params.seacherContent : -1,
                "endDate": params.endDate,
                "startDate": params.startDate,
                "pageSize": 20,
                "pageIndex": params.pageIndex
            }
        } else {
            
            data = {
                "seacherContent": -1,
                "endDate": new Date().setHours(23, 59, 59, 59),
                "startDate": new Date().setHours(0, 0, 0, 0),
                "pageSize": 20,
                "pageIndex": 1
            }

            dispatch({
                type: ZN_changeOutside,
                payload: {
                    "seacherContent": "",
                    "endDate": new Date().setHours(23, 59, 59, 59),
                    "startDate": new Date().setHours(0, 0, 0, 0),
                    "pageSize": 20,
                    "pageIndex": 1
                }
            });
        }

        

        Request('api/web/report_center/custom_report', data, (res) => {
            dispatch({
                type: ZN_CHANGESTATUS,
                data: false
            })
            if (res.result) {
                if (res.data && res.data.pageContent) {
                    dispatch({
                        type: ZN_GET_CUSTOME_TABLE,
                        data: res.data.pageContent,
                        totalElements: res.data.totalElements,
                        totalPage:res.data.totalPage
                    })
                } else {
                    dispatch({
                        type: ZN_GET_CUSTOME_TABLE,
                        data: [],
                        totalPage: 0,
                        totalElements:0
                    })
                }
            } else {
                message.error(res.message)
            }
        })

    }
}


export function zn_change_jsProp(params) {
    return dispatch => {
        dispatch({
            type: ZN_changeOutside,
            payload: params
        });
    }
}

/**
 * 更新loading状态
 * @param {* loading入参} flag 
 */
export function changeLoadCustomer(flag) {
    return dispatch => {
        dispatch({
            type: ZN_CHANGESTATUS,
            data: flag
        })
    }
}

// 新增报告模态框
/**
 * 
 * @param {*boolean} flag 
 */
export function showAddModal1(flag) {
    return dispatch => {
        dispatch({
            type: ZN_showAddModal,
            payload: flag
        })
        //button 可以点击
        dispatch({
            type: ZN_ADD_STATUS,
            payload: false
        })

    }
}



export function zn_change_input(params) {
    return dispatch => {
        dispatch({
            type: ZN_changeOutside,
            payload: params
        });
    }
}


/**
 * 修改新增报告的起止时间
 * @param {} time 时间戳
 * @param {*} flag 0代表开始时间，1结束时间
 */
export let changeInside = (time, flag) => {
    return dispatch => {
        if (flag === 1) {
            dispatch({
                type: ZN_ADD_END,
                data: time
            })
        } else {
            dispatch({
                type: ZN_ADD_START,
                data: time
            })
        }

    }
}
/**
 * 
 * @param {*String} v input value  新增报告的searchvalue
 */
export let addChangeValue2 = (v) => {
    return dispatch => {
        dispatch({
            type: ZN_changeValue2,
            payload: v
        })
    }
}




//多选的checkbox
export let znCheck_report = (v) => {
    return dispatch => {
        dispatch({
            type: ZN_OPTIONS,
            data: v
        })
    }
}


/**
 * 
 * @param  {Array} data addInputValue、addStartTime、addEndTime、addcheck
 */
export let addReportMsg = (name, startDate, endDate, json) => {
    return dispatch => {
        if (!name) {
            message.warning('报告名不能为空');
        } else if (!startDate) {
            message.warning('开始时间不能为空');
        } else if (!endDate) {
            message.warning('结束时间不能为空');
        } else if (!Object.getOwnPropertyNames(json).length) {
            message.warning('报告包含内容不能为空');
        } else if (endDate < startDate) {
            message.warning('时间选择不合理，请重新选择');
        } else {
            let params = {
                name,
                endDate,
                startDate,
                "score": json.score ? 1 : 0,
                "order": json.order ? 1 : 0,
                "student": json.student ? 1 : 0,
                "teacher": json.teacher ? 1 : 0
            };
            // 确定按钮不可点击
            dispatch({
                type: ZN_ADD_STATUS,
                payload: true
            })
            dispatch(zn_add_ajax(params))
        }
    }
}


// 新增报告请求
export let zn_add_ajax = (params) => {
    return dispatch => {

        Request('api/web/report_center/add_custom_report', params, (res) => {
       
            if (res.code == "200" && res.result) {
                //modal消失
                dispatch({
                    type: ZN_showAddModal,
                    payload: false
                })
                //成功提示
                message.success("生成成功");
                //button 可以点击
                dispatch({
                    type: ZN_ADD_STATUS,
                    payload: false
                })
                //重新请求数据
                dispatch(initCustomeTable("", false))
            } else {
                    //modal消失
                 dispatch({
                     type: ZN_showAddModal,
                     payload: false
                })
                message.error(res.message)
            }
            //modal消失

        })
    }
}