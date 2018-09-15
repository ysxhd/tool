/*
 * @Author: hf 
 * @Date: 2018-08-01 09:32:13 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-01 09:47:25
 */

const RECORD_CONDITION = "RECORD_CONDITION";//跳转时记录筛选条件

const init = {
  record_data: {},
};

export function B_ManagerClassManReducer(state = init, action) {
  switch (action.type) {
    case RECORD_CONDITION:
      return { ...state, record_data: action.data }
    default:
      return state
  }
}

/*
 *跳转时记录跳转条件
 */
export function recordWhenJump_ac(obj) {
  return dispatch => {
    dispatch({
      type: RECORD_CONDITION,
      data: obj
    })
  }
}

