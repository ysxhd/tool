/*
 * @Author: hf 
 * @Date: 2018-07-26 14:47:37 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 15:02:28
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;
const TM_TABLE = "TM_TABLE";

const init = {
  timeTable: [],
  condition: {
    acdYearId: '',
    "semId": '',
    "weekNum": '',
    "subjectId": 'all',
    "claId": 'all',
    "semStartDate": ''
  }
}

export function Tm_timeTableReducer(state = init, action) {
  switch (action.type) {
    case TM_TABLE:
      return { ...state, timeTable: action.data }
    default:
      return state
  }
}

/**
 * 课表数据（按列表查看）
 * @param {*} condition 
 */
export function Tm_getScheduleList_ac(condition) {

  let initC = init.condition;
  for (var k in condition) {
    initC[k] = condition[k]
  }
  let data = {
    curList: [],
    sections: [],
    dates: []
  }
  return dispatch => {
    Request('private/teaconfig/getCurTableOfTeach', initC, (res) => {
      if (res.result) {
        dispatch({
          type: TM_TABLE,
          data: dealData(res.data)
        })
      } else {
        dispatch({
          type: TM_TABLE,
          data: data
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


