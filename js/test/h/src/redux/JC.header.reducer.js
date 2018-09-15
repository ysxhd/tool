/*
 * @Author: JC.Liu 
 * @Date: 2018-07-25 10:42:21 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:24:29
 * header 组件中的reducer 控制 1.平台名字 2.动态导航  3.搜索框的展示  4.背景色  5.后台管理按钮的显隐  6.关键字下拉组件
 */
import React from 'react';
import request from '../js/_x/util/request';
import {
  message
} from 'antd';
const ajax = request.request;

const initeState = {
  // 最热关键字数据       
  keyWorld: [],
  // 搜索结果
  searchData: [],
  // 路由跳转
  redirectTo: "",
  // 搜索的关键字
  world: "",
  // 搜索页面
  searchLi: 0,
  // 搜索的数量
  searchNum: 0,
  // loading
  loading: false
}

// 关键字
const HEADER_KEYWORLD = "HEADER_KEYWORLD"
// 搜索的关键字结果
const SEARCH_RESULT = "SEARCH_RESULT"
// loading
const SEARCH_LOADING = "SEARCH_LOADING"

export const HeaderReducer = (state = initeState, action) => {
  switch (action.type) {
    case HEADER_KEYWORLD:
      return {
        ...state,
        ...action
      }
    case SEARCH_RESULT:
      return {
        ...state,
        ...action
      }
    case SEARCH_LOADING:
      return {
        ...state,
        ...action
      }
    default:
      return {
        ...state
      }
  }
}

// loading
const loading_ac = (bl) => {
  return dispatch => {
    dispatch({
      type: SEARCH_LOADING,
      loading: bl,
      searchNum: 0
    })
  }
}

// 关键字
export const headerKeyWorld_ac = (data) => {
  return dispatch => {
    ajax("default/search/getHotWords", {}, res => {
      if (res.result && res.data.keywords && res.data.keywords.length) {
        dispatch({
          type: HEADER_KEYWORLD,
          keyWorld: res.data.keywords
        })
      }
    })
  }
}

/**
 * 点击关键字 进行搜索 并跳转至搜索页面
 * @param {*} status      区分是搜索全局 公有 还是私有  
 * @param {*} world       关键字
 * @param {*} currenPage  当前页
 * @param {*} searchLi    tab二级导航  0 全部课堂  1公共课堂 2 私有课堂
 */
export const header_search_kerWorld_ac = (status, world, currentPage, searchLi, callback) => {
  let requestAddress = "";
  let requestQureyNum = "";
  // console.log("搜索:", status, world, currentPage, searchLi);

  switch (status) {
    case "all":
      requestAddress = "default/search/keywordsSearchAll";
      requestQureyNum = "default/search/keywordsSearchAllNum";
      break;
    case "public":
      requestAddress = "public/search/keywordsSearchPub";
      requestQureyNum = "public/search/keywordsSearchPubNum";
      break;
    case "pri":
      requestAddress = "private/search/keywordsSearchPri";
      requestQureyNum = "private/search/keywordsSearchPriNum";
      break;
    default:
      break;
  }


  return dispatch => {
    dispatch(loading_ac(true))

    // 先进行查询数量 有数量才会有数据
    ajax(requestQureyNum, {
      "keyword": world
    }, _res => {
      if (_res.result && _res.data) {
        ajax(requestAddress, {
          "keyword": world,
          currentPage,
          "pageSize": 20
        }, res => {
          dispatch(loading_ac(false))
          if (res.result && res.data) {
            dispatch({
              type: SEARCH_RESULT,
              searchData: res.data.curList,
              world: world,
              searchLi,
              searchNum: _res.data.curCount
            })
          } else {
            message.warning(res.message)
            dispatch({
              type: SEARCH_RESULT,
              searchData: [],
              world: world,
              searchLi,
              searchNum: _res.data.curCount
            })
          }
        })
      } else {
        message.warning(_res.message)
        dispatch({
          type: SEARCH_RESULT,
          world: world,
          searchLi,
          searchNum: 0
        })
      }
    }, res => {
      dispatch(loading_ac(false))
      message.error("请求失败", 2)
    })

    dispatch({
      type: SEARCH_RESULT,
      world: world,
    })

    if (typeof callback == "function") {
      callback();
    }
  }
}

// 二级导航切换
export const changeSearchBar_ac = (searchLi) => {
  return dispatch => {
    dispatch({
      type: SEARCH_RESULT,
      searchLi,
    })
  }
}