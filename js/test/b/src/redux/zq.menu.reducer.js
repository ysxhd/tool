/*
 * @Author: zhengqi 
 * @Date: 2018-08-30 14:17:21 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-04 15:47:51
 */
/*菜单栏*/
const ZQ_MENU = 'ZQ_MENU';

const init = {
  curVisMenu: '课堂秩序'
}

export function menuReducer(state = init, action) {
  switch (action.type) {
    case 'ZQ_MENU':
      return { ...state, curVisMenu: action.data };
    default:
      return state;
  }
}

export function getVisMenuData(val) {
  console.log(val);
  return dispatch => {
    dispatch({
      type: 'ZQ_MENU',
      data: val
    })
  }
}