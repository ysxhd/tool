/*
 * @Author: JC.Liu 
 * @Date: 2018-07-31 14:15:41 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:23:48
 * 管理员 - 审核管理 页面的 reducer
 */
import request from '../js/_x/util/request';
import _ from 'lodash';
import { message } from 'antd';
const ajax = request.request;
const initState = {
  loading: false,
  // 搜索结果
  searchData: [],
  // 查询到的所有数据条数
  searchDataTotal: 0,
  // 年 学期 周次
  YearSemWeekInfo: [],
  // 当前 年 学期 周次
  currentYTW: {},
  // 默认学年
  currentY: "",
  // 默认学期 
  currentSId: "",
  // 默认学期的type值
  currentSType: 1,
  // 默认周次 
  currentW: 0,
  // 所有 学院 科目 老师
  all_AOT: [],
  // 当前页所有数据的id
  allIds: [],
  // 渲染 科目
  subject: [],
  // 渲染 老师
  teacher: [],
  // 当前选中学院
  currrentCollege: "all",
  // 当前选中的科目
  currentSubject: "all",
  // 当前选中的老师
  currentTeacher: "all",
  // 统计的结果
  staticTotal: {
    // 总的申请
    applyTotalCount: 0,
    // 待审核
    approveCount: 0,
    // 拒绝
    denyCount: 0,
    // 通过
    passCount: 0
  },
  // 审核信息
  defaultCheckInfo: {
    // 公有
    publicStatus: 0,
    // 私有
    privateStatus: 0,
    // 直播
    liveStatus: 0
  }
}
const LOADING = "LOADING";
// 搜索按钮点击事件
const SEARCH_DATA = "SEARCH_DATA";
// 年 学期 周次 
const Y_T_W = "Y_T_W";
// 当前的年 学期 周次
const CURRENT_Y_T_W = "CURRENT_Y_T_W";
// 全部 学院 科目 老师
const ALL_A_O_T = "ALL_A_O_T";
// 渲染科目 老师数组
const RENDER_OBJECT_TEACHER = "RENDER_OBJECT_TEACHER";
// 选择老师
const CHIOCE_TEACHER = "CHIOCE_TEACHER";
// 周 change
const WEEK_CHANGE = "WEEK_CHANGE";
// 统计结果
const STATIC_TOTAL = "STATIC_TOTAL";
// 审核信息
const DEFAULT_ECHECK_INFO = "DEFAULT_ECHECK_INFO";
// 清空所有id
const CLEAR_CHIOCE = "CLEAR_CHIOCE";


export const CheckMan_Reducer = (state = initState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SEARCH_DATA:
      return {
        ...state,
        searchData: action.payload,
        allIds: action.allIds,
      }
    case Y_T_W:
      return {
        ...state,
        YearSemWeekInfo: action.payload
      }
    case CURRENT_Y_T_W:
      return {
        ...state,
        ...action
      }
    case ALL_A_O_T:
      return {
        ...state,
        all_AOT: action.payload
      }
    case RENDER_OBJECT_TEACHER:
      return {
        ...state,
        ...action
      }
    case CHIOCE_TEACHER:
      return {
        ...state,
        currentTeacher: action.payload
      }
    case WEEK_CHANGE:
      return {
        ...state,
        ...action
      }
    case STATIC_TOTAL:
      return {
        ...state,
        staticTotal: action.payload,
        searchDataTotal: action.total
      }
    case DEFAULT_ECHECK_INFO:
      return {
        ...state,
        defaultCheckInfo: action.payload
      }
    case CLEAR_CHIOCE:
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

// action
/**
 * 自动审核私有申请  自动审核公有申请  自动审核直播
 * @param {any} e
 * @param {object} defaultCheckInfo   初始的审核信息
 */
export function auto_check(e, status) {
  return dispatch => {
    let value = e.target.value;
    let checked = e.target.checked;
    let req = {}
    if (value === "public") {
      if (checked) {
        req = { publicStatus: 1 }
      } else {
        req = { publicStatus: 0 }
      }
    } else if (value === "pri") {
      if (checked) {
        req = { privateStatus: 1 }
      } else {
        req = { privateStatus: 0 }
      }
    } else if (value === "live") {
      if (checked) {
        req = { liveStatus: 1 }
      } else {
        req = { liveStatus: 0 }
      }
    }

    ajax("default/adminPublishCurriculum/modifyAutoCheck", req, res => {
      if (res.result) {
        // dispatch({
        //   type: DEFAULT_ECHECK_INFO,
        //   payload: req,
        // })
        dispatch(get_Default_Check_Info_ac())
      } else {
        message.warning(res.message, 2)
      }
    }, () => {
      message.error("请求失败！", 2)
    })
  }
}

// loading
export const loading_ac = (value) => {
  return dispatch => {
    dispatch({
      type: LOADING,
      payload: value
    })
  }
}

/**
 * 点击查询按钮搜索数据
 * @param {object} obj          查询入参
 * @param {object} staticObj    统计接口的入参
 * @param {object} status       区分公有  私有   直播
 */
export const CheckMan_searchResult_ac = (obj, staticObj, status) => {
  return dispatch => {
    dispatch(loading_ac(true))

    let requestAddress;
    let requestStaticAddress;
    if (status === "pri") {
      requestAddress = "private/adminPublishCurriculum/getPrivateCurriculumVerifyList";
      requestStaticAddress = "private/adminPublishCurriculum/getPrivateCurriculumTotalData";
    } else if (status === "public") {
      requestAddress = "public/adminPublishCurriculum/getPublicCurriculumVerifyList";
      requestStaticAddress = "public/adminPublishCurriculum/getPubCurriculumTotalData";
    } else if (status === "live") {
      requestAddress = "live/adminPublishCurriculum/getLiveCurriculumVerifyList";
      requestStaticAddress = "live/adminPublishCurriculum/getLiveCurriculumTotalData";
    }

    // 请求统计接口
    ajax(requestStaticAddress, {
      ...staticObj
    }, res => {
      if (res.data && res.result) {
        dispatch({
          type: STATIC_TOTAL,
          payload: res.data,
          total: res.data.applyTotalCount
        })
      } else {
        message.warning(res.message)
      }
    })

    // 查询接口
    ajax(requestAddress, {
      ...obj
    }, _res => {
      if (_res.result && _res.data) {
        let data = _res.data;
        let searchData = [];
        if (data.approveList.length) {
          data.approveList.map((item) => {
            searchData.push({ ...item, pass: 2 })
          })
        }
        if (data.passList.length) {
          data.passList.map((item) => {
            searchData.push({ ...item, pass: 1 })
          })
        }
        if (data.denyList.length) {
          data.denyList.map((item) => {
            searchData.push({ ...item, pass: 0 })
          })
        }

        let allIds = []
        searchData.map((t) => {
          if (t.pass === 2) {
            allIds.push(t.curResourceId)
          }
        })

        dispatch(loading_ac(false))

        dispatch({
          type: SEARCH_DATA,
          payload: searchData,
          allIds: allIds
        })

      } else {
        message.warning(_res.message)
        dispatch(loading_ac(false))
      }
    }, err => {
      message.error("请求失败", 2)
      dispatch(loading_ac(false))
    })
  }
}

// 请求年份 学期
export const request_YTW_ac = () => {
  return dispatch => {
    ajax("default/MyClass/getYearSemWeekInfo", {}, res => {
      if (res.result && res.data && res.data.AcadYearList.length) {
        // 将年份 周数 提取出来，切换时 进行find 查找对应的数据进行改变周次数
        let data = res.data.AcadYearList;
        // 年份
        let yearArr = [];
        // 学期 带id 
        let semArr = [];
        // 周次数
        let weekArr = [];

        data.map((item) => {
          // 拿到学年
          yearArr.push(item.acdYearId)
          // 将学年信息赋值给学期 其中带有周次信息
          item.semList.map((i) => {
            i.acdYearId = item.acdYearId
          })
        })
        dispatch({
          type: Y_T_W,
          payload: data
        })
      }
    })
  }
}

/**
 * 请求当前年份 学期 周
 * @param {number} pubNum    区分公有私有  0 公有  1私有
 * @param {number} type     区分直播 录播  0 录播  1直播
 */
export const getCurrentYTW_ac = (pubNum, type) => {
  return dispatch => {
    ajax("default/MyClass/getCurrentInfo", {}, res => {
      if (res.result && res.data) {
        dispatch({
          type: CURRENT_Y_T_W,
          currentY: res.data.acdYearId,
          currentSId: res.data.semId,
          currentW: res.data.weekNum,
          currentSType: res.data.semTypeId,
        })

        if (type === 0) {
          // 请求一次查询  根据当前条件据当前条件  录播
          dispatch(CheckMan_searchResult_ac(
            {
              acdYearId: res.data.acdYearId,
              semTypeId: res.data.semTypeId,
              weekNum: res.data.weekNum,
              grdGroupId: "all",
              subjectId: "all",
              teacherId: "all",
              currentPage: 1,
              pageSize: 20,
            }, {
              acdYearId: res.data.acdYearId,
              semTypeId: res.data.semTypeId,
              weekNum: res.data.weekNum,
              grdGroupId: "all",
              subjectId: "all",
              teacherId: "all",
            }, pubNum === 0 ? "public" : "pri"))
        } else if (type === 1) {
          dispatch(CheckMan_searchResult_ac(
            {
              acdYearId: res.data.acdYearId,
              semTypeId: res.data.semTypeId,
              weekNum: res.data.weekNum,
              grdGroupId: "all",
              subjectId: "all",
              teacherId: "all",
              currentPage: 1,
              pageSize: 20,
            }, {
              acdYearId: res.data.acdYearId,
              semTypeId: res.data.semTypeId,
              weekNum: res.data.weekNum,
              grdGroupId: "all",
              subjectId: "all",
              teacherId: "all",
            }, "live"))
        }
      }
    })
  }
}

// 请求全部学院 科目 老师
export const getAll_COT_ac = () => {
  return dispatch => {
    ajax("default/index/getColSubTeaInfo", {}, res => {
      if (res.result && res.data) {
        dispatch({
          type: ALL_A_O_T,
          payload: res.data.treeInfos,
        })
      }
    })
  }
}

/**
 * 学年 学期 下拉  将value 替换当前学年
 * @param {string} key               区分学年 还是 学期 currentY 学年 currentSId
 * @param {*} value                  学年切换的值   与学期 1  2 拼接 成当前学年下的学期 值
 * @param {*} currentSType           学期  1 上学期  2下学期  
 */
export const year_sem_SelectChange_ac = (key, value, currentSType) => {
  // 切换学年时  将学期id 改为 对应的学年
  return dispatch => {
    let currentST = "";
    if (key === "currentY") {
      // 根据key 来知道是切换的学年 学期
      currentST = value + `_${currentSType}`;
      dispatch({
        type: CURRENT_Y_T_W,
        [key]: value,
        currentSId: currentST,
        currentW: 1
      })
    } else {
      dispatch({
        type: CURRENT_Y_T_W,
        [key]: value,
        currentW: 1
      })
    }
  }
}

// 选择周
export const weekSelectChange_ac = (value) => {
  return dispatch => {
    dispatch({
      type: WEEK_CHANGE,
      currentW: parseInt(value)
    })
  }
}

/**
 * 选择学院
 * @param {*} value          下拉选中的值 "all" 为所有 
 * @param {*} data           从所有数据中查找对应的学院  对应的学院下有对应的科目数据 选了学院后 对应能选的科目数据
 * @param {string} flag      区分学院 科目的切换
 */
export const col_sub_Change_ac = (value, data, flag) => {
  return dispatch => {
    switch (flag) {
      case "college":
        if (value !== "all") {
          let targetCollege = _.find(data, { trgId: value });
          // 给科目赋值
          dispatch(college_subject_change("subject", targetCollege.subjectList, value, "currrentCollege"))
        } else {
          // 学院选择所有 则科目全部清空，老师清空，默认选“all”
          dispatch(college_subject_change("subject", [], "all", "currrentCollege"));
          dispatch(college_subject_change("teacher", [], "all", "currentSubject"));
          // 修改teacher 的展示显示
          dispatch({
            type: CHIOCE_TEACHER,
            payload: "all"
          })
        }
        break;
      case "subject":
        if (value !== "all") {
          let targetSubject = _.find(data, { subjectId: value });
          dispatch(college_subject_change("teacher", targetSubject.userList, value, "currentSubject"));
        } else {
          dispatch(college_subject_change("teacher", [], "all", "currentSubject"));
        }
        break;
      default:
        break;
    }
  }
}

// 选择老师
export const teacher_Change_ac = (value) => {
  return dispatch => {
    if (value !== "all") {
      dispatch({
        type: CHIOCE_TEACHER,
        payload: value,
      })
    }
  }
}

/**
 * 学院 科目 切换共用一个赋值操作
 * @param {*} arrkey        渲染数组的key
 * @param {*} data          渲染数据的数据
 * @param {*} value         选中的当前值，用于查询入参
 * @param {*} currentKey    选中当前值得key 用于reducer 赋值
 */
const college_subject_change = (arrkey, data, value, currentKey) => {
  return {
    type: RENDER_OBJECT_TEACHER,
    [currentKey]: value,
    [arrkey]: data,
  }
}


/**
 * 拒绝或者通过  支持单个或批量操作
 * @param {*} id                 单个操作时是 string   批量操作时 是id数组
 * @param {string} status        区分通过 还是 拒绝     
 * @param {boolean} some         区分单个还是批量操作  
 * @param {number} pubNum        区分公有私有 0公有  1私有
 * @param {number} tabType       区分课堂管理  直播 ，0 课堂  1 直播
 * @param {object} searchReq     学年 等 查询入参
 * @param {object} staticReq     统计接口入参
 */
export const pass_or_refues_ac = (id, status, some, pubNum, tabType, searchReq, staticReq, reason) => {
  // console.log("原因：", reason);

  let requsetAddress = "";
  let requsetArr = [];
  if (status === "pass") {
    requsetAddress = "default/adminPublishCurriculum/batchPassPublishCurriculums";
  } else if (status === "refuse") {
    requsetAddress = "default/adminPublishCurriculum/batchRejectPublishCurriculums";
  }
  if (some) {
    // 批量
    id.map((item) => {
      requsetArr.push({ curResourceId: item })
    })
  } else {
    // 单个
    requsetArr.push({ curResourceId: id })
  }
  return dispatch => {

    let req
    if (status === "pass") {
      req = {
        applyCurList: requsetArr,
        curType: tabType === 0 ?
          pubNum === 0 ?
            2
            : 1
          : 3
      }
    } else {
      req = {
        applyCurList: requsetArr,
        curType: tabType === 0 ? pubNum === 0 ? 2 : 1 : 3,
        reason: reason
      }
    }

    ajax(requsetAddress, req, res => {
      if (res.result) {
        if (tabType === 1) {
          dispatch(CheckMan_searchResult_ac(
            searchReq, staticReq, "live"
          ))
          dispatch({
            type: CLEAR_CHIOCE,
          })

        } else {
          dispatch(CheckMan_searchResult_ac(
            searchReq, staticReq, pubNum === 0 ? "public" : "pri"
          ))
          dispatch({
            type: CLEAR_CHIOCE,
          })
        }
      } else {
        message.error(res.message)
        dispatch({
          type: CLEAR_CHIOCE,
        })
      }
    })
  }
}

// 获取审核信息
export const get_Default_Check_Info_ac = () => {
  return dispatch => {
    ajax("default/adminPublishCurriculum/getAutoCheckInfo", {}, res => {
      if (res.result && res.data) {
        dispatch({
          type: DEFAULT_ECHECK_INFO,
          payload: res.data,
        })
      } else {
        message.warning(res.message, 3)
      }
    }, res => {
      message.error(res.message, 3)
    })
  }
}
