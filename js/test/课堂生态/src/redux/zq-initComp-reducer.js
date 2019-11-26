/*
 * @Author: zhengqi 
 * @Date: 2018-09-03 16:30:32 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-10 17:11:34
 */
/*初始化功能菜单配置*/
import { message } from 'antd';
import { _x } from './../js/index';
import G from "./../js/g";

const ZQ_FUNCTIONS = 'ZQ_FUNCTIONS';
const ZQ_CHANGESWITCH = 'ZQ_CHANGESWITCH';
const ZQ_OPENCHILD = 'ZQ_OPENCHILD';

const init = {
  functions: {
    schoolType: 0, //应用范围
    projectName: '',
    function: [],
  },//菜单功能项
  selectIndex: null,//当前选中展开的一级菜单序号
};

export function initReducer(state = init, action) {
  switch (action.type) {
    case 'ZQ_FUNCTIONS':
      return { ...state, functions: action.data };
    case 'ZQ_CHANGESWITCH':
      return { ...state, ...action.data };
    case 'ZQ_OPENCHILD':
      return { ...state, selectIndex: action.data };
    // case 'ZQ_CHANGECHILD':
    //   return { ...state, functions: action.data };
    default:
      return state;
  }
};

/**
 * 获取功能菜单数据
 * @param {*} type 
 */
export function getFunctionsData(type) {
  return dispatch => {
    let src = type === 1 ? "api/web/initialize_page/get_functions" : "api/web/user_setting/get_functions";
    _x.util.request.request(src, {}, ret => {
      if (ret.result) {
        // G.configInfo = ret.data;
        // sessionStorage.configInfo = JSON.stringify(ret.data);
        dispatch({
          type: 'ZQ_FUNCTIONS',
          data: type === 1 ? ret.data : {
            projectName: ret.data.projectName,
            function: ret.data.function
          }
        })
      }
    })
  }
}

//一级菜单开关
export let chageSwitch = (i, checked) => {
  return (dispatch, getState) => {
    let functions = getState().initReducer.functions;
    let selectIndex = getState().initReducer.selectIndex;
    functions.function[i].status = checked ? 1 : 0;
    // this.setState({ functions });
    if (!checked && i === selectIndex) {
      selectIndex = null
    };
    dispatch({
      type: 'ZQ_CHANGESWITCH',
      data: {
        functions: { ...functions, function: functions.function },
        selectIndex: selectIndex
      }
    })

  }
}

//开启二级菜单
export let openChild = (selectIndex) => {
  return dispatch => {
    dispatch({
      type: 'ZQ_OPENCHILD',
      data: selectIndex
    })
  }
}

// //二级菜单勾选
export let onChangeSelet = (checkedValues) => {
  return (dispatch, getState) => {
    let functions = getState().initReducer.functions;
    let childList = functions.function[getState().initReducer.selectIndex].childList;
    childList.map((item, i) => {
      let index = checkedValues.indexOf(item.functionId);
      if (index !== -1) {
        childList[i].status = 1;
      } else {
        childList[i].status = 0;
      }
    });
    dispatch({
      type: 'ZQ_FUNCTIONS',
      data: { ...functions, function: functions.function },
    })

  }
}

/**
 * 修改平台名
 */
export let handleName = (e) => {
  return (dispatch, getState) => {
    let functions = getState().initReducer.functions;
    if (e.target.value.length <= 10) {
      dispatch({
        type: 'ZQ_FUNCTIONS',
        data: { ...functions, projectName: e.target.value },
      });
    } else {
      message.warning('名称最多输入10个字');
    }
  }
};

/**
 * 修改应用范围
 */
export let onChangeRange = (e) => {
  return (dispatch, getState) => {
    let functions = getState().initReducer.functions;
    dispatch({
      type: 'ZQ_FUNCTIONS',
      data: { ...functions, schoolType: e.target.value },
    });
  };
}