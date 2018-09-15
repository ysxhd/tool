/*
 * @Author: hf 
 * @Date: 2018-08-16 14:32:37 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 15:01:54
 */
// 弹框二次确认提示

import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;

const CANCELCUROFTEA = "CANCELCUROFTEA";
const PUBLIC_PUB = "PUBLIC_PUB";
const PRAVITE_PUB = "PRAVITE_PUB";
const BROADCAST_PUBORCANCEL = "BROADCAST_PUBORCANCEL";

const init = {
  cancelcur: {},
  public_data: {},
  pravite_data: {},
  broadcast: {},
}

export function cancelOrPubCurModalReducer(state = init, action) {
  switch (action.type) {
    case CANCELCUROFTEA:
      return { ...state, cancelcur: action.data }
    case PUBLIC_PUB:
      return { ...state, public_data: action.data }
    case PRAVITE_PUB:
      return { ...state, pravite_data: action.data }
    case BROADCAST_PUBORCANCEL:
      return { ...state, broadcast: action.data }
    default:
      return state
  }
}



/**
 * 老师课堂取消发布
**/
export function cancelCurOfTea_ac(obj) {
  // obj={"curId":"3","reason":null}
  return dispatch => {
    Request('default/teaconfig/cancelCurOfTea', obj, (res) => {
      dispatch({
        type: CANCELCUROFTEA,
        data: res
      })
    })
  }
}

/**
 * 老师公用课堂发布
 */
export function pubPubCurOfTea_ac(obj) {
  // obj={"curId":"3","reason":null}
  return dispatch => {
    Request('public/teaconfig/pubPubCurOfTea', obj, (res) => {
      dispatch({
        type: PUBLIC_PUB,
        data: res
      })
    })
  }
}

/**
 * 老师私有课堂的发布 
**/
export function pubPriCurOfTea_ac(obj) {
  // obj={"curId":"3","status":"A","reason":null}
  return dispatch => {
    Request('private/teaconfig/pubPriCurOfTea', obj, (res) => {
      dispatch({
        type: PRAVITE_PUB,
        data: res
      })
    })
  }
}

/**
 * 老师直播课堂的发布和取消 
**/
export function pubOrCancelOnCurOfTea_ac(obj) {
  // obj={"curId":"3","status":"A","reason":null}
  return dispatch => {
    Request('live/teaconfig/pubOrCancelOnCurOfTea', obj, (res) => {
      dispatch({
        type: BROADCAST_PUBORCANCEL,
        data: res
      })
    })
  }
}


/**
 * 管理员课堂取消发布
**/
export function cancelPubCurList_ac(obj) {
  return dispatch => {
    Request('default/sysconfig/cancelPubCurList', obj, (res) => {
      dispatch({
        type: CANCELCUROFTEA,
        data: res
      })
    })
  }
}

/**
 * 管理员公用课堂发布
 */
export function addPubCurList_ac(obj) {
  return dispatch => {
    Request('public/sysconfig/addPubCurList', obj, (res) => {
      dispatch({
        type: PUBLIC_PUB,
        data: res
      })
    })
  }
}

/**
 * 管理员私有课堂的发布 
**/
export function addPriCurList_ac(obj) {
  return dispatch => {
    Request('private/sysconfig/addPriCurList', obj, (res) => {
      dispatch({
        type: PRAVITE_PUB,
        data: res
      })
    })
  }
}

/**
 * 管理员直播课堂的发布和取消 
**/
export function addOrCancelCurList_ac(obj) {
  return dispatch => {
    Request('live/sysconfig/addOrCancelCurList', obj, (res) => {
      dispatch({
        type: BROADCAST_PUBORCANCEL,
        data: res
      })
    })
  }
}
