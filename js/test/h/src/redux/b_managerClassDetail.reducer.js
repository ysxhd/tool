/*
 * @Author: hf 
 * @Date: 2018-08-15 10:45:32 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 17:56:04
 */

/**
 * 管理员管理课堂
 */

import request from './../js/_x/util/request';
const Request = request.request;
const fileAjax = request.formRequest;
const MM_DETAIL = "MM_DETAIL";
const MM_TOP_CURLIST = "MM_TOP_CURLIST"; //置顶列表
const SET_TOP = "SET_TOP";//设置置顶
const CANCEL_TOP = "CANCEL_TOP"; //取消置顶
const SELECT_RESULT = "SELECT_RESULT"; //保存已选择的课堂
const AUTO_PUB = "AUTO_PUB";//设置单个课堂自动发布

const init = {
  detail_data: null,
  condition: {
    "semId": "2017_2018_2",
    "weekNum": "1",
    "weekday": "1",
    "lessonOrder": "2",
    "grdGroupId": "all",
    "subjectId": "all",
    "teacherId": "all",
    "claId": "all"
  },
  top_data: [],
  setTop_data: {},
  cancelTop_data: {},
  select_data: [],
  autopub_data: {},
};

export function B_ManagerClassManDetaileReducer(state = init, action) {
  switch (action.type) {
    case MM_DETAIL:
      return { ...state, detail_data: action.data }
    case MM_TOP_CURLIST:
      return { ...state, top_data: action.data }
    case SET_TOP:
      return { ...state, setTop_data: action.data }
    case CANCEL_TOP:
      return { ...state, cancelTop_data: action.data }
    case SELECT_RESULT:
      return { ...state, select_data: action.data }
    case AUTO_PUB:
      return { ...state, autopub_data: action.data }
    default:
      return state
  }
}

/**
*单个节次查询课堂列表接口
 */
export function getOneLesCurList_ac(obj) {
  return dispatch => {
    Request('default/sysconfig/getOneLesCurList',
      obj,
      (res) => {
        if (res.result) {
          dispatch({
            type: MM_DETAIL,
            data: res.data
          })
        } else {
          dispatch({
            type: MM_DETAIL,
            data: []
          })
        }

      }
    )
  }
}

/**
 * 卸载组件
 */
export function mm_removeComponent_ac() {
  return dispatch => {
    dispatch({
      type: MM_DETAIL,
      data: null
    })
  }
}

/**
*获取置顶列表
 */
export function getTopRecommendCurList_ac() {
  return dispatch => {
    Request('default/sysconfig/getTopRecommendCurList',
      {},
      (res) => {
        if (res.result) {
          dispatch({
            type: MM_TOP_CURLIST,
            data: res.data.topRecommendCurList
          })
        } else {
          dispatch({
            type: MM_TOP_CURLIST,
            data: []
          })
        }
      }
    )
  }
}

/**
 * 设置置顶
 * setTopRecommendCur(传本地图片)
 */
export function setTopRecommendCur_ac(obj) {
  return dispatch => {
    fileAjax('default/sysconfig/setTopRecommendCur',
      obj,
      (res) => {
        dispatch({
          type: SET_TOP,
          data: res
        })
      }
    )
  }
}

/**
 * 设置置顶
 * setTopCurThumbImg（传默认图片）
 */
export function setTopCurThumbImg_ac(obj) {
  return dispatch => {
    Request('default/sysconfig/setTopCurThumbImg',
      obj,
      (res) => {
        dispatch({
          type: SET_TOP,
          data: res
        })
      }
    )
  }
}


/**
 * 取消置顶
 * id：curResourceId 资源id
 */
export function cancelTopRecommendCur_ac(id) {
  let obj = {
    curResourceId: id,
    reason: ''
  }
  return dispatch => {
    Request('default/sysconfig/cancelTopRecommendCur',
      obj,
      (res) => {
        dispatch({
          type: CANCEL_TOP,
          data: res
        })
      }
    )
  }
}

/**
 * 存储选择的课堂
 */
export function saveSelectResult_ac(obj) {
  return dispatch => {
    dispatch({
      type: SELECT_RESULT,
      data: obj
    })
  }
}

/**
 * 单个自动发布
 */
export function updateOneCurStatus_ac(obj) {
  return dispatch => {
    Request('default/sysconfig/updateOneCurStatus',
      obj,
      (res) => {
        dispatch({
          type: AUTO_PUB,
          data: res
        })
      }
    )
  }
}

