/*
 * @Author: hf 
 * @Date: 2018-07-26 09:18:21 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:24:42
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;

const MC_SUBCLASS = "MC_SUBCLASS";
const IF_CHANGE_WHEN_SELECT = "IF_CHANGE_WHEN_SELECT";

const init = {
  subClass: [],
  condition: {
    "acdYearId": "init",
    "semId": "init"
  },
  ifquery: true,
}

export function SubClassReducer(state = init, action) {
  switch (action.type) {
    case MC_SUBCLASS:
      return { ...state, subClass: action.data }
    case IF_CHANGE_WHEN_SELECT:
      return { ...state, ifquery: action.data }
    default:
      return state
  }
}

/**
 * 获取班级和科目
 * @param {} condition 
 */
export function getSubCurInfo_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  // console.log(initC)

  return dispatch => {
    Request('default/MyClass/getSubCurInfo', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MC_SUBCLASS,
          data: res.data.subjects
        })
      } else {
        dispatch({
          type: MC_SUBCLASS,
          data: [],
        })
      }
    })

  }
}

/**
 * 切换时是否刷新
 * true：在初始化的时候是要刷新的
 * false:在切换时不刷新，点击查询按钮时刷新
 * @param {*} data 
 */
export function ifChangeWhenSelect_ac(data) {
  return dispatch => {
    dispatch({
      type: IF_CHANGE_WHEN_SELECT,
      data: data
    })
  }
}