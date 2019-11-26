/*
 * @Author: JC.Liu 
 * @Date: 2018-07-04 09:33:28 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-06 15:00:01
 * 场所reducer
 */
import {
  request as ajax
} from '../../js/clientRequest';
import {
  class_paixu_action
} from '../classRoom/classRoom.redux';
import {
  G
} from '../../js/global'

const initState = {
  // 楼层数据
  buildingData: [],
  // 当前楼栋 id
  nowBuilding: "",
  nowBuilding2: "",
  // 展示楼层的名字
  showPlaceBuiildingName: '',
  showPlaceBuiildingName2: "全部楼层",
  // 总共有几层楼
  floors: 0,
}
// place首屏数据
const PLACE_RENDER_DATA = "PLACE_RENDER_DATA"
// 楼层展示的名字
const PLACE_CHANGE_NAME = "PLACE_CHANGE_NAME"
// 选中楼层
const PLACE_SELECT_NAME = "PLACE_SELECT_NAME"
// push 全部楼层
const PLACE_PUSH_ENPTY = "PLACE_PUSH_ENPTY"
// 通知 统计页面 重新请求场所时 重新给予 building 名
const PLACE_NOTIC_AND_STIC_REQUEST = "PLACE_NOTIC_AND_STIC_REQUEST"
// 场所数据
const PLACE_CHANGE_DATA = "PLACE_CHANGE_DATA"


export const placeReducer = (state = initState, action) => {
  switch (action.type) {
    case PLACE_RENDER_DATA:
      return {
        ...state,
        ...action
      }
    case PLACE_CHANGE_NAME:
      return {
        ...state,
        ...action
      }
    case PLACE_SELECT_NAME:
      return {
        ...state,
        ...action
      }
    case PLACE_PUSH_ENPTY:
      return {
        ...state,
        buildingData: action.pushEnpty
      }
    case PLACE_NOTIC_AND_STIC_REQUEST:
      return {
        ...state,
        ...action
      }
    case PLACE_CHANGE_DATA:
      return {
        ...state,
        ...action
      }
    default:
      return {
        ...state,
      }
      break;
  }
}


// action
// 切换楼层重新获取教室数据
export const chancePlaceAction_action = (id, name, floors) => {
  return disaptch => {
    disaptch({
      type: PLACE_CHANGE_NAME,
      showPlaceBuiildingName: name,
      nowBuilding: id,
      floors,
    })
  }
}

// 首次获取楼层数据
export const getPlaceData_action = (id) => {
  var pathname = window.location.pathname;

  console.log("pathname:", pathname);

  return dispatch => {
    ajax('classroom/find_teaching_building', {}, (res) => {
      if (res.data.result && res.data.data && res.data.data.length) {
        let data = res.data.data;
        if (pathname === "/notic" || pathname === "/statistics") {
          // push 全部楼层
          data.unshift({ buildingif: "", name: "全部楼层", floor: 0 })
          dispatch(push_enptyFloor_action(data))
          if (!id) {
            dispatch(change_buildingname("", data[0].name))
          }
        } else {
          dispatch(render_placeData_action(data))
        }
      }
    })
  }
}

export const render_placeData_action = (data) => {
  console.log("场所：", data);

  return dispatch => {
    dispatch({
      type: PLACE_RENDER_DATA,
      buildingData: data,
      showPlaceBuiildingName: data[0].name,
      nowBuilding: data[0].buildingid,
      floors: data[0].floors
    })
  }
}

export const floor_placeData_action = (data, id) => {
  return dispatch => {
    dispatch({
      type: PLACE_SELECT_NAME,
      showPlaceBuiildingName2: data,
      nowBuilding2: id
    })
  }
}

// 通知 统计页面添加全部楼层
export const push_enptyFloor_action = (data) => {
  // var pushEnpty = data.unshift({ buildingid: "", name: "全部楼层", floor: 0 });
  return dispatch => {
    dispatch({
      type: PLACE_PUSH_ENPTY,
      pushEnpty: data,
    })
  }
}

const change_buildingname = (id, name) => {
  return {
    type: PLACE_NOTIC_AND_STIC_REQUEST,
    nowBuilding: id,
    showPlaceBuiildingName: name
  }
}

// 单纯值修改场所数据
export const change_page_place_empty = (data) => {
  console.log("单纯修改场所数据:", data);
  return dispatch => {
    dispatch({
      type: PLACE_CHANGE_DATA,
      buildingData: data,
    })
  }
}