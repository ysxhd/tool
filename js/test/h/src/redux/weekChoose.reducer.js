/*
 * @Author: hf 
 * @Date: 2018-07-26 15:35:15 
 * @Last Modified by: hf
 * @Last Modified time: 2018-07-26 15:37:13
 */


const Q_MYCLASS = "Q_MYCLASS";

const init = {
  myClassCondition: [],
}

export function weekChooseReducer(state = init, action) {
  switch (action.type) {
    case Q_MYCLASS:
      return { ...state, myClassCondition: action.data }
    default:
      return state
  }
}

export function myClassCondition_ac() {

  return dispatch => {
    dispatch({
      type: Q_MYCLASS,
      data: data
    })
  }
}
