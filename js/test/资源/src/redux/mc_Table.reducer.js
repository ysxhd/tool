/*
 * @Author: hf 
 * @Date: 2018-07-26 14:47:37 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 16:38:28
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;

const MC_TABLE = "MC_TABLE";
const MC_SEMCURNUM = "MC_SEMCURNUM";
const init = {
  timeTable: {
    dates: [],
    sectionList: [],
    curList: null
  },
  condition: {
    "acdYearId": "",
    "semId": "",
    "weekNum": "",
    "subjectId": "all",
    "claId": "all",
    "semStartDate": ""
  },
  conditions: {
    "acdYearId": "",
    "semId": ""
  },
  semcurnum: 0
}

export function timeTableReducer(state = init, action) {
  switch (action.type) {
    case MC_TABLE:
      return { ...state, timeTable: action.data }
    case MC_SEMCURNUM:
      return { ...state, semcurnum: action.data }
    default:
      return state
  }
}

/**
 * 获取课表数据
 * @param {*} condition 
 */
export function getScheduleList_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('private/MyClass/getScheduleList', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MC_TABLE,
          data: dealData(res.data)
        })
      } else {
        dispatch({
          type: MC_TABLE,
          data: {
            dates: [],
            sectionList: [],
            curList: null
          }
        })
      }
    })
  }
}

function dealData(data) {
  var sections = [];
  if (data.maxLesson > 0) {
    for (let z = 0; z < data.maxLesson; z++) {
      sections.push(
        '第' + number.toChinese(z + 1) + '节 '
      )
    }
  }
  data.sectionList = sections;
  return data
}


/**
 * 获取指定学期内课程数量
 */
export function getSemCurNum_ac(condition) {
  let initC = init.conditions;
  for (var k in condition) {
    initC[k] = condition[k]
  }
  return dispatch => {
    Request('private/MyClass/getSemCurNum', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MC_SEMCURNUM,
          data: res.data.semCurNum
        })
      } else {
        dispatch({
          type: MC_SEMCURNUM,
          data: 0
        })
      }
    })
  }
}
