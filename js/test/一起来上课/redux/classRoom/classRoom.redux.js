/*
 * @Author: JC.liu 
 * @Date: 2018-06-19 14:06:37 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-07 14:48:52
 * 教室管理 
 */
import { request as ajax } from "../../js/clientRequest";
import {
  render_placeData_action,
  change_page_place_empty
} from "../place/place.redux";
import { ModalConfrim, ModalSuccess } from "../../components/public/modal";
import { chancePlaceAction_action } from "../place/place.redux";

import { G } from "../../js/global";
import { Avatar } from "antd";

const initState = {
  classInfo: [],
  errMsg: "",
  class_tip: false,
  name: "",
  avatarUrl: ""
};

const CLASS_INFO = "CLASS_INFO"; // 教室信息
const CLASS_REQUEST_ERROR = "CLASS_REQUEST_ERROR"; // 请求失败
const CLASS_SWITCH_CLASSrOOM = "CLASS_SWITCH_CLASSrOOM"; // 教室开关
const CLASS_USER_NAME = "CLASS_USER_NAME"; // 用户名字
const AVATAR_URL = "AVATAR_URL"; // 用户头像

// reducer
export const ClassRoomReducer = (state = initState, action) => {
  switch (action.type) {
    case CLASS_INFO:
      return {
        ...state,
        classInfo: action.payload
      };

    case CLASS_SWITCH_CLASSrOOM:
      return {
        ...state
      };

    case CLASS_REQUEST_ERROR:
      return {
        ...state
      };
    case CLASS_USER_NAME:
      return {
        ...state,
        name: action.payload
      };
    case AVATAR_URL:
      return { 
        ...state,
        ...action
      };
    default:
      return {
        ...state
      };
      break;
  }
};

// action
//  首屏渲染的时候接受的数据
export const classRoomData_action = data => {
  var data = data.map((item, index) => {
    return {
      ...item,
      id: index + 1
    };
  });
  return dispatch => {
    dispatch({
      type: CLASS_INFO,
      payload: [...data]
    });
  };
};

// action
//  首屏渲染的时候接受的数据用户名
export const userName_Data_action = data => {
  return dispatch => {
    dispatch({
      type: CLASS_USER_NAME,
      payload: data
    });
  };
};

// 首次请求教室数据
export const request_class_action = type => {
  return dispatch => {
    ajax("classroom/find_teaching_building", {}, res => {
      if (res.status === 200) {
        if (res.data.result && res.data.data && res.data.data.length) {
          // 拿到场所数据，将场所数据丢给渲染action
          var data = res.data.data;
          // 场所的渲染
          dispatch(render_placeData_action(data));
          ajax(
            "classroom/reset_findAll_class",
            {
              buildingid: res.data.data[0].buildingid,
              floors: res.data.data[0].floors,
              // buildingid:"51043BB7C24C4967ADBBB9F1D08402E4",
              // floors:6,
              type: type
            },
            _res => {
              if (_res.status === 200) {
                if (_res.data.result && _res.data.data) {
                  dispatch(classRoomData_action(_res.data.data));
                } else {
                  ModalSuccess.show({ data: _res.data.message });
                }
              }
            }
          );
        }
      }
    });
  };
};

// 在此重新请求请求教室数据
export const class_again_action = (
  building,
  floors,
  type,
  name,
  placeChange,
  buildingData
) => {
  // 在此判断场所数据中是否存在为空的building  有则删除 无则不做修改
  console.log("classRoom接受到的场所数据：", buildingData);
  let buildData = buildingData;
  if (buildData) {
    console.log("11111");
    let target = "";
    buildData.map(item => {
      console.log("222");
      if (!item.buildingid) {
        target = item;
      }
    });
    if (target) {
      console.log("333");
      let index = buildData.indexOf(target);
      buildData.splice(index, 1);
    }
  }
  return dispatch => {
    if (buildData) {
      dispatch(change_page_place_empty(buildData));
    }
    ajax(
      "classroom/reset_findAll_class",
      {
        buildingid: building,
        floors: floors,
        type: type
      },
      res => {
        if (res.status === 200) {
          if (res.data.result && res.data.data) {
            dispatch(classRoomData_action(res.data.data));
            if (placeChange) {
              dispatch(chancePlaceAction_action(building, name, floors));
            }
          } else {
            dispatch(classRoomData_action([]));
            ModalSuccess.show({ data: res.data.message });
          }
        }
      }
    );
  };
};

// 自定义排序  查询所有 教室数据
export const class_paixu_action = (calsses, id, floor, type) => {
  return dispatch => {
    ajax(
      "classroom/update_customize",
      {
        customize: calsses
      },
      res => {
        if (res.status === 200) {
          if (res.data.result) {
            //  请求教室数据
            dispatch(class_again_action(id, floor, type));
          } else {
            ModalSuccess.show({ data: res.data.message });
          }
        }
      }
    );
  };
};

//  是否展示
export const switchChangeShow_action = (classId, show, buildingid, floors) => {
  return dispatch => {
    ajax(
      "classroom/update_isShow",
      {
        classId: classId,
        isShow: !show
      },
      res => {
        if (res.status === 200) {
          if (res.data.result) {
            dispatch(class_again_action(buildingid, floors, 0));
          } else {
            ModalSuccess.show({ data: res.data.message });
            dispatch({
              type: CLASS_REQUEST_ERROR,
              errMsg: res.data.message
            });
          }
        }
      }
    );
  };
};

export const avatar_url = url => {
  return dispatch => {
    if (url) {
      dispatch({
        type: AVATAR_URL,
        avatarUrl: url,
      });
    }
  };
};
