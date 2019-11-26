/*
 * @Author: JC.Liu 
 * @Date: 2018-07-03 17:17:16 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-04 08:58:17
 * header reducer
 */


const initState = {

}

const PLACE_CHANGE = "PLACE_CHANGE"


export const HeaderReducer = (state = initState, action) => {
  switch (action.type) {
    case PLACE_CHANGE:
      return {
        ...state,
      }
    default:
      return {
        ...state
      }
      break;
  }
}


// 场所切换
export const placeChange = (buildingId) => {
  return dispatch => {
    
  }
}