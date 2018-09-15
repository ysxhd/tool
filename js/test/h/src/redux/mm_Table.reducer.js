/*
 * @Author: hf 
 * @Date: 2018-08-14 09:23:29 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 16:36:28
 */
/**
 * 管理员的table
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;
const MM_TABLE = "TM_TABLE";

const init = {
  timeTable: [],
  condition: {
    "semId": "",
    "weekNum": "",
    "grdGroupId": "",
    "subjectId": "",
    "claId": "",
    "teacherId": "",
    "semStartDate": ""
  },
}

export function Mm_timeTableReducer(state = init, action) {
  switch (action.type) {
    case MM_TABLE:
      return { ...state, timeTable: action.data }
    default:
      return state
  }
}

/**
 * 课表数据（按列表查看）
 * @param {*} condition 
 */
export function Mm_getCurTableOfAdmin_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }

  return dispatch => {
    Request('default/sysconfig/getCurTableOfAdmin', initC, (res) => {
      if (res.result) {
        dispatch({
          type: MM_TABLE,
          data: dealData(res.data)
        })
      } else {
        dispatch({
          type: MM_TABLE,
          data: {
            curNumList: null,
            sectionList: [],
            dates: []
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




