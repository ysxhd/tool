/*
 * @Author: hf 
 * @Date: 2018-08-14 09:26:17 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 13:37:43
 */
//管理员的课堂选项
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
import G from './../js/g'
const Request = request.request;

const MM_SUBCLASS = "MM_SUBCLASS";
const IF_CHANGE_WHEN_SELECT = "IF_CHANGE_WHEN_SELECT";
const MM_CLASS = "MM_CLASS";//班级

const init = {
  subClass: [],
  condition: {
    "acdYearId": "",
    "semId": "init"
  },
  ifquery: true,
  class_data: []
}

export function MmSubClassReducer(state = init, action) {
  switch (action.type) {
    case MM_SUBCLASS:
      return { ...state, subClass: action.data }
    case IF_CHANGE_WHEN_SELECT:
      return { ...state, ifquery: action.data }
    case MM_CLASS:
      return { ...state, class_data: action.data }
    default:
      return state
  }
}

/**
 * 获取科目、老师、学院
 */
export function getColSubTeaClaTree_ac(condition) {

  //保存condition
  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  let res = G.colSubTeaInfo;
  return dispatch => {
    dispatch({
      type: MM_SUBCLASS,
      data: res.treeInfos
    })
  }

}

/**
 * 获取班级
 */
export function getCol_ac(param) {

  return dispatch => {
    Request('default/sysconfig/getCol', param, (res) => {
      if (res.result) {
        dispatch({
          type: MM_CLASS,
          data: res.data
        })
      } else {
        dispatch({
          type: MM_CLASS,
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
export function mm_ifChangeWhenSelect_ac(data) {
  return dispatch => {
    dispatch({
      type: IF_CHANGE_WHEN_SELECT,
      data: data
    })
  }
}
