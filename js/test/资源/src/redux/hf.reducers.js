const init = {

};

export function xxReducer(state = init, action) {
  switch (action.type) {
    case "xx":
      return { ...state, }
    default:
      return state
  }
}


export function yy_ac(obj) {
  return dispatch => {
    dispatch({
      type: 'xx',
      data: 'data'
    })
  }
}