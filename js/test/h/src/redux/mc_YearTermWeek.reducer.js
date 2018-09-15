/*
 * @Author: hf 
 * @Date: 2018-07-26 09:18:21 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 16:39:57
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;

const MC_YEARTERMWEEK = "MC_YEARTERMWEEK";
const MC_CURRENT_YEARTERMWEEK = "MC_CURRENT_YEARTERMWEEK";
const MC_CHANGE_CURRENT_WEEK = "MC_CHANGE_CURRENT_WEEK";

const init = {
  yeartermweek: [],
  currentData: {
    "semTypeId": '',
    "semId": "",
    "weekNum": 0,
    "acdYearId": ""
  },
  tm_currentData: {}
}

export function YearTermWeekReducer(state = init, action) {
  switch (action.type) {
    case MC_YEARTERMWEEK:
      return { ...state, yeartermweek: action.data }
    case MC_CURRENT_YEARTERMWEEK:
      return { ...state, currentData: action.data }
    case MC_CHANGE_CURRENT_WEEK:
      return { ...state, currentData: action.data }
    default:
      return state
  }
}

export function getYearSemWeekInfo_ac() {
  let data = [
    {
      "acdYearId": "",
      "academicYearName": "--",
      "semList": [
        {
          "semId": "",
          "semTypeName": "--",
          "totalWeeks": 0
        }
      ]
    }
  ];

  return dispatch => {
    Request('default/MyClass/getYearSemWeekInfo', {}, (res) => {
      if (res.result) {
        dispatch({
          type: MC_YEARTERMWEEK,
          data: dealData(res.data.AcadYearList)
        })
      } else {
        dispatch({
          type: MC_YEARTERMWEEK,
          data: dealData(data)
        })
      }
    })
  }
}

function dealData(data) {
  data.map((item) => (
    item.semList.map((items) => {
      var weeks = [];
      if (items.totalWeeks == 0) {
        weeks.push({
          "weekTypeId": '',
          "weekTypeName": '--'
        })
      } else {
        for (let z = 0; z < items.totalWeeks; z++) {
          weeks.push({
            "weekTypeId": (z + 1).toString(),
            "weekTypeName": '第' + number.toChinese(z + 1) + '周'
          })
        }
      }
      items.weeks = weeks;
    })
  ))

  return data
}

export function getCurrentYSW_ac(flag) {
  let data = {
    "semTypeId": '',
    "semId": "",
    "weekNum": 0,
    "acdYearId": ""
  };
  if (flag) {
    return dispatch => {
      dispatch({
        type: MC_CURRENT_YEARTERMWEEK,
        data: data
      })
    }
  }
  return dispatch => {
    Request('default/MyClass/getCurrentInfo', {}, (res) => {
      if (res.result) {
        dispatch({
          type: MC_CURRENT_YEARTERMWEEK,
          data: res.data
        })
      } else {
        dispatch({
          type: MC_CURRENT_YEARTERMWEEK,
          data: data
        })
      }
    })
  }
}
/**
 * 每周切换 
 */
export function changeCurrentWeek_ac(data) {
  return dispatch => {
    dispatch({
      type: MC_CHANGE_CURRENT_WEEK,
      data: data
    })
  }
}




