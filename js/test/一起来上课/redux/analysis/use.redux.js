/*
 * @Author: zhangning 
 * @Date: 2018-07-03 13:13:41 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-11 17:52:07
 */
import { request as ajax } from '../../js/clientRequest';
import { ModalSuccess } from '../../components/public/modal';  

  const initSate = {
    loadingT:false,//table的loading
    loadingE:false,//Echarts的loading
    pagination: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
    },
    // date:          
    use_table_content: [], // table内容
    humanTime:"1",//人数时长类型 1表示人数，2表示时长
    recentDay:"1",//最近天数 1表示选择的是最近7天，2表示最近30天
    interView:{},//访问统计
    timeLong:{},//时长统计
    history_data:[],//历史数据统计
    orderType:0,// 默认最近登陆状态
    order:1,// 默认在线时长状态
    search:"",//搜索内容
    isError: false, // 请求失败标记
    errMes: "", // 请求失败的错误信息
  }
  const USE_INIT = "USE_INIT";  //初始化页面数据
  const USE_ECHATS_CHANGE = "USE_ECHATS_CHANGE";  //echarts数据切换图表的数据
  const USE_HISTORY_CHANGE = "USE_HISTORY_CHANGE";  //时长统计切换
  const USE_TABLE_CHANGE = "USE_TABLE_CHANGE";  //table数据变换
  const USE_SEARCH_VALUE = "USE_SEARCH_VALUE"; //查看详情
  const USE_LOADING_ECHART = "USE_LOADING_ECHART"; //loading echarts的
  const USE_LOADING_TABLE = "USE_LOADING_TABLE"; //loading echarts的
  const USE_TIMELONG_CHANGE = "USE_TIMELONG_CHANGE"; //时长统计切换
  const USE_ERROR = "USE_ERROR";//出错提醒

  
  export const UseMatter_reducer = (state = initSate, action) => {
    switch (action.type) {
      case USE_INIT:
        let  allData = action.content;
        return {
          ...state,
          interView:allData.access_count,
          timeLong:allData.duration_data,
          history_data:allData.history_data1,
          use_table_content:allData.use_table_data,
          pagination:{...state.pagination,total:allData.use_table_dataTotal}
        }
     case USE_ECHATS_CHANGE:
       
        return {
          ...state,humanTime:action.humanTime,recentDay:action.recentDay,history_data:action.payload,loadingE:false
        }
    case USE_TIMELONG_CHANGE:
        return {
          ...state,timeLong:action.payload,
        } 
   case USE_TABLE_CHANGE:
        return {
          ...state,
          use_table_content:action.payload,
          loadingT:false,search:"",
          orderType:action.orderType,
          order:action.order,
          pagination:{...state.pagination,currentPage:action.pgIndex,total:action.total}
        }    
    case USE_LOADING_ECHART:
        return {
          ...state,loadingE:action.payload
        }
    case USE_LOADING_TABLE:
        return {
          ...state,loadingT:action.payload
        }
    case USE_ERROR:
        return {
          ...state,loadingE:false,loadingT:false,errMes:action.errMes,isError:true
        }                  
    case USE_HISTORY_CHANGE:
        return {
          ...state,recentDay:action.recentDay,recentDay:action.recentDay
        } 
    case USE_SEARCH_VALUE:
        return {
          ...state,search:action.payload
        }     
    //   case USE_ERROR:
    //     return {
    //       ...state,
    //       isError: action.isError,
    //       errMes: action.errMes
    //     }
  
      default:
        return {
          ...state
        }
        break;
    }
  }
  
  
  // action
  // 初始化页面 
  export const store_use_action = (data) => {
    return dispatch => {
      dispatch({
          type:USE_INIT,
          content:data
      })
  
    }
  }
  
//时长统计类型切换
  export const changeType_action = (humanTime,recentDay,flag) =>{
    return dispatch =>{
        //显示loading
        dispatch({
          type: USE_LOADING_ECHART,
          payload:true
        })
        ajax("analysis/get_history_data", {
        "type": Number(recentDay),
        "indication":Number(humanTime),
      }, (res) => {
        
        if (res.data.result) {
          dispatch({
            type: USE_ECHATS_CHANGE,
            isError: false,
            humanTime,
            recentDay,
            payload: res.data.data,
          })
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })

      if(flag){
        ajax("analysis/get_duration_data", {
          "type": Number(recentDay)
        }, (res) => {
          if (res.data.result) {
            dispatch({
              type: USE_TIMELONG_CHANGE,
              isError: false,
              payload: res.data.data,
              recentDay
            })
          } else {
            ModalSuccess.show({ data: res.data.message });
          }
        })
      }
    }
  }


  
  //table相关
  export const changeUseTable_action = (like,orderType,order,pgIndex) =>{
    return dispatch =>{
      dispatch({
        type: USE_LOADING_TABLE,
        isError: false,
        payload: true
      })
        ajax("analysis/get_usage_data", {
        "pageSize": 10,
        "pageIndex":pgIndex,
        "like":like,
        "orderType":orderType,
        "order":order
      }, (res) => {
        if (res.data.result) {
          dispatch({
            type: USE_TABLE_CHANGE,
            isError: false,
            payload: res.data.data,
            total:res.data.total,
            orderType,
            order,
            pgIndex
          })
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })
    }
  }

  
  //input输入框值
  export const searchValue = (v) =>{
    return dispatch =>{
      dispatch({
        type:USE_SEARCH_VALUE,
        payload:v
      })
    }

 }