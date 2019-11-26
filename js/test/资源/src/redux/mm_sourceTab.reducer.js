/*
 * @Author: hf 
 * @Date: 2018-08-07 15:40:26 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 13:09:19
 */

import request from './../js/_x/util/request';
const Request = request.request;
const MM_HADCURNUM = "MM_HADCURNUM";
const MM_PUBCURNUM = "MM_PUBCURNUM";
const MM_PRICURNUM = "MM_PRICURNUM";

const init = {
  condition:
    {
      "grdId": "all",
      "subjectId": "all",
      "teacherId": "all",
      "claId": "all",
      "semId": "",
      "weekNum": ""
    }
  ,
  had_data: {},
  public_data: {},
  pravite_data: {},
}

export function Mm_sourceTabReducer(state = init, action) {
  switch (action.type) {
    case MM_HADCURNUM:
      return { ...state, had_data: action.data }
    case MM_PUBCURNUM:
      return { ...state, public_data: action.data }
    case MM_PRICURNUM:
      return { ...state, pravite_data: action.data }
    default:
      return state
  }
}

/**
 * 已完成的课堂数
 */
export function Mm_getCurTotalNum_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }
  return dispatch => {
    Request('default/sysconfig/getCurTotalNum', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MM_HADCURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: MM_HADCURNUM,
          data: {
            "semCurPublicNum": 0,
            "weeksCurPublicNum": 0
          }
        })
      }
    })
  }
}


/**
 * 公有课堂数
 */
export function Mm_getPublicCurNum_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('public/sysconfig/getPublicCurNum', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MM_PUBCURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: MM_PUBCURNUM,
          data: {
            "semCurPublicNum": 0,
            "weeksCurPublicNum": 0
          }
        })
      }
    })
  }
}

/**
 * 私有课堂数
 */
export function Mm_getPrivateCurNum_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('private/sysconfig/getPrivateCurNum', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MM_PRICURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: MM_PRICURNUM,
          data: {
            "semCurPrivateNum": 0,
            "weeksCurPrivateNum": 0
          }
        })
      }
    })
  }
}