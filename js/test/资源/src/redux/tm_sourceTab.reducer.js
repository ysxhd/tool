/*
 * @Author: hf 
 * @Date: 2018-08-07 15:40:26 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 10:42:13
 */

import request from './../js/_x/util/request';
const Request = request.request;
const TM_HADCURNUM = "TM_HADCURNUM";
const TM_PUBCURNUM = "TM_PUBCURNUM";
const TM_PRICURNUM = "TM_PRICURNUM";

const init = {
  condition: {
    "semId": "2017_2018_2",
    "weekNum": "1",
    "subjectId": "all",
    "claId": "all"
  },
  had_data: {},
  public_data: {},
  pravite_data: {},
}

export function Tm_sourceTabReducer(state = init, action) {
  switch (action.type) {
    case TM_HADCURNUM:
      return { ...state, had_data: action.data }
    case TM_PUBCURNUM:
      return { ...state, public_data: action.data }
    case TM_PRICURNUM:
      return { ...state, pravite_data: action.data }
    default:
      return state
  }
}

/**
 * 已完成的课堂数
 */
export function Tm_getCurTotalNum_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }
  return dispatch => {
    Request('public/teaconfig/getCurTotalNumOfTea', initC, (res) => {
      if (res.result) {
        dispatch({
          type: TM_HADCURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: TM_HADCURNUM,
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
export function Tm_getPubCurNumOfTea_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('public/teaconfig/getPubCurNumOfTea', initC, (res) => {
      if (res.result) {
        dispatch({
          type: TM_PUBCURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: TM_PUBCURNUM,
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
export function Tm_getPriCurNumOfTea_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('private/teaconfig/getPriCurNumOfTea', initC, (res) => {
      if (res.result) {
        dispatch({
          type: TM_PRICURNUM,
          data: res.data
        })
      } else {
        dispatch({
          type: TM_PRICURNUM,
          data: {
            "semCurPrivateNum": 0,
            "weeksCurPrivateNum": 0
          }
        })
      }
    })
  }
}