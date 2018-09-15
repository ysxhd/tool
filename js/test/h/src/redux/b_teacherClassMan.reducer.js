/*
 * @Author: hf 
 * @Date: 2018-08-01 09:32:13 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-01 09:47:25
 */

const TABLEORLIST = "TABLEORLIST";
const TM_RECORD_CONDITION = "RECORD_CONDITION";//跳转时记录筛选条件

const init = {
  tableOrList: 'table',
  record_data: {},
};

export function B_TacherClassManReducer(state = init, action) {
  switch (action.type) {
    case TABLEORLIST:
      return { ...state, tableOrList: action.data }
    case TM_RECORD_CONDITION:
      return { ...state, record_data: action.data }
    default:
      return state
  }
}

/**
 * @param { 课表的展示状态} obj 
 * table:按课表展示
 * list:按列表查看
 */
export function changeTabelOrList_ac(obj) {
  return dispatch => {
    dispatch({
      type: TABLEORLIST,
      data: obj
    })
  }
}

/*
 *跳转时记录跳转条件
 */
export function tm_recordWhenJump_ac(obj) {
  return dispatch => {
    dispatch({
      type: TM_RECORD_CONDITION,
      data: obj
    })
  }
}