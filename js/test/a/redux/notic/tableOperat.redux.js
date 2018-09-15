/*
 * @Author: JC.Liu 
 * @Date: 2018-07-03 09:50:53 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-07 13:46:10
 * 表格的操作项 
 */
import {
  request as ajax
} from '../../js/clientRequest';

const initSate = {
  // 控制查看通知的modal显示 隐藏
  viewNoticShow: false,
  // loading table
  loadingT: false,
  // 查看单条数据详情
  singleData: {},
  // 请求失败标记
  isError: false,
  // 请求失败的错误信息
  errMsg: "",
  // 新建通知modal 显示
  addNoticShow: false,
  //是否点击編輯
  isEdit: false,
  //所有的通知列表
  contentList: [],
  // 编辑通知 所选中的楼层
  edit_building: [],
  //全选checkbox所有的id
  allIds: [],
  //分页控制项
  pagination: {
    pageSize: 10,
    total: 0,
    currentPage: 1,
    totalPage: 0
  },
  //搜索的关键词
  searchText: "",
  //table选中的checkbox
  rowkeys: []
}
//初始化所有列表数据
const ALL_NOTIC = "ALL_NOTIC"
// 查看通知
const VIEW_NOTIC = "VIEW_NOTIC"
// 编辑通知
const EDIT_NOTIC = "EDIT_NOTIC"
// 删除通知
const DEL_NOTICE = "DEL_NOTICE"
// 请求失败
const REQUEST_ERROR = "REQUEST_ERROR"
// 隐藏查看通知 modal
const VIEW_MODAL_FALSE = "VIEW_MODAL_FALSE"
// 新建通知modal
const ADD_NOTIC_MODAL = "ADD_NOTIC_MODAL"
// 编辑通知modal 显示隐藏
// const EDIT_MODAL_VIEW = "EDIT_MODAL_VIEW"
// 编辑通知的modal 消失
const EDIT_CHANGE_VALUE = "EDIT_CHANGE_VALUE"
// loading table 显示
const LOADING_TABLE_NOTIC = "LOADING_TABLE_NOTIC"
//搜索关键词change
const NOTIC_SEARCH = "NOTIC_SEARCH"
//全选的id
const NOTIC_CHECK_ALL = "NOTIC_CHECK_ALL"
// 请求异常
const USE_ERROR_NOTIC = "USE_ERROR_NOTIC"

export const TableOperatReducer = (state = initSate, action) => {
  switch (action.type) {
    case ALL_NOTIC:
      return {
        ...state,
        contentList: action.payload,
        pagination: { ...state.pagination,
          total: action.total,
          currentPage: action.pgIndex,
          totalPage: action.totalPage
        },
        searchText: action.searchText,
        loadingT: false
      }
    case VIEW_NOTIC:
      return {
        ...state,
        singleData: action.payload,
        viewNoticShow: true
      }
    case VIEW_MODAL_FALSE:
      return {
        ...state,
        viewNoticShow: false
      }
    case LOADING_TABLE_NOTIC:
      return {
        ...state,
        loadingT: action.payload
      }
    case NOTIC_SEARCH:
      return {
        ...state,
        searchText: action.payload
      }
    case NOTIC_CHECK_ALL:
      return {
        ...state,
        allIds: action.payload,
        rowkeys: action.rowkeys
      }
    case ADD_NOTIC_MODAL:
      return {
        ...state,
        addNoticShow: action.show
      }
    case EDIT_NOTIC:
      return {
        ...state,
        addNoticShow: action.show,
        isEdit: action.payload,
        singleData: action.data
      }
    case EDIT_CHANGE_VALUE:
      return {
        ...state,
        isEdit: false
      }
    case USE_ERROR_NOTIC:
      return {
        ...state,
        isError: action.isError,
        errMsg: action.errMsg,
        loadingT: false,
        contentList: []
      }

    default:
      return {
        ...state
      }
      break;
  }
}


// action
// 查看通知
export const view_notice = (data) => {
  return dispatch => {
    dispatch({
      type: VIEW_NOTIC,
      payload: data
    })
  }
}

// 查看通知的 modal 隐藏
export const view_modal_false = () => {
  return dispatch => {
    dispatch({
      type: VIEW_MODAL_FALSE
    })
  }
}


// 新建通知 mdoal显示 / 隐藏
export const add_notic_modal_action = (bl) => {
  return dispatch => {
    dispatch({
      type: ADD_NOTIC_MODAL,
      show: bl
    })
  }
}

// 新建通知 确认按钮
export const add_notic_submit_action = (tit, time, content, building) => {
  return dispatch => {
    // ajax("message/insert_notice", {
    //   "title": "全民大会", //标题//
    //   "noticeTime": "1530674139", //播放时间//
    //   "content": "到上激……",//通知内容//
    //   "buildingid": ["1", "2"] //通知哪些楼//
    // }, res => {
    //   if(res.result){
    //   }else{
    //   }
    // })
    return {

    }
  }
}

// 全部通知
export const allNoticBtn_action = (buildingid, searchText, pgIndex) => {
  return dispatch => {
    dispatch({
      type: LOADING_TABLE_NOTIC,
      payload: true
    })

    ajax("message/find_messages", {
      "buildingid": buildingid, //那栋楼的id，若查询全部则传 " "//
      "text": searchText, //通知标题//
      "pageSize": 10, //每页显示多少条
      "pageIndex": Number(pgIndex)
    }, res => {
      if (res.data.result) {
        dispatch({
          type: LOADING_TABLE_NOTIC,
          payload: false
        })
        //判断搜索内容是否存在
        if (res.data.data && res.data.data.pageContent && res.data.data.pageContent.length) {
          dispatch({
            type: ALL_NOTIC,
            isError: false,
            payload: res.data.data.pageContent,
            total: res.data.data.totalElements,
            totalPage: res.data.data.totalPage,
            searchText,
            pgIndex
          })
        } else {
          dispatch({
            type: ALL_NOTIC,
            isError: false,
            payload: [],
            total: 0,
            totalPage: 0,
            searchText,
            pgIndex
          })
        }
      } else {
        dispatch({
          type: USE_ERROR_NOTIC,
          isError: true,
          errMsg: res.data.message
        })
      }
    })
  }
}

// 取消报错提示
export const error_notic = () => {
  return dispatch => {
    dispatch({
      type: USE_ERROR_NOTIC,
      isError: false,
      errMes: "",
    })
  }
}

// 搜索关键词内容
export const notice_search = (value) => {
  return dispatch => {
    dispatch({
      type: NOTIC_SEARCH,
      payload: value
    })
  }
}


// 点击编辑按钮
export const eidtNotice_action = (show, isEdit, data) => {
  return dispatch => {
    dispatch({
      type: EDIT_NOTIC,
      show: show,
      payload: isEdit,
      data
    })
  }
}

//取消是否编辑的状态
export const eidtNotice_close_action = () => {
  return dispatch => {
    dispatch({
      type: EDIT_CHANGE_VALUE,
    })
  }
}

// 修改编辑通知的title
export const notic_check_all = (value, rowkeys) => {
  return dispatch => {
    dispatch({
      type: NOTIC_CHECK_ALL,
      payload: value,
      rowkeys
    })

  }
}