/*
 * @Author: zhangning 
 * @Date: 2018-07-03 13:13:41 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-11 17:49:03
 */
import { request as ajax } from '../../js/clientRequest';
import { ModalSuccess } from '../../components/public/modal';
  const initSate = {
    loading_advise_e:false,  //echart loading
    loading_advise_t:false,  //table loading
    loading_detail:false,  //图片列表详情
    viewModalShow: false,   //详情页模态框展示
    pagination: {
        pageSize: 10,
        total: 0,
        currentPage: 1,
    },
    singleData:{},//选中的弹窗数据
    // date:          
    echartsContent: [], // 内容
    tableContent: [], // 内容
    imgList:[],  //详情的图片列表
    type:"1", //异常类型
    typeList:[],//异常的下拉列表
    imgSort:0,//默认图片排序
    timeSort:1,//默认时间排序表示点击向上排序
    isError: false, // 请求失败标记
    errMes: "", // 请求失败的错误信息
  }
  const ADVISE_TABLE_INIT = "ADVISE_TABLE_INIT";  //初始化页面数据
  const ADVISE_CHANGE_TYPE = "ADVISE_CHANGE_TYPE";  //切换类型初始化页面数据
  const ADVISE_DETAIL = "ADVISE_DETAIL"; //查看详情
  const ADVISE_CLOSE = "ADVISE_CLOSE"; //关闭详情
  const ADVISE_LOADINGT = "ADVISE_LOADINGT";  //table loading
  const ADVISE_ERROR = "ADVISE_ERROR";  //报错了
  const ADVISE_IMGLIST = "ADVISE_IMGLIST";  //图片列表
  
  export const TableAdvise_reducer = (state = initSate, action) => {
    switch (action.type) {
      case ADVISE_TABLE_INIT:
        let allData = action.content;
        return {
          ...state,
          echartsContent: allData.feedback_count,
          tableContent:allData.feekback_data,
          typeList:allData.name_type,
          pagination:{...state.pagination,total:allData.advise_table_dataTotal}
        }
      case ADVISE_DETAIL:
        let a = {...state.tableContent[action.payload]};
        return {...state,viewModalShow:true,singleData:a,loading_detail:true} 

      case ADVISE_IMGLIST:
        return {...state, imgList:action.payload,loading_detail:false} 
      
      case ADVISE_CLOSE:
        return {...state, viewModalShow:false} 

      case ADVISE_LOADINGT:
        return {...state, loading_advise_t:action.payload} 
      
      case ADVISE_CHANGE_TYPE:
      return {
         ...state,
         tableContent:action.payload,
         type:action.typeId,
         imgSort:action.imgSort,
         timeSort:action.timeSort,
         loading_advise_t:false,
         pagination:{...state.pagination,currentPage:action.pgIndex,total:action.total}
        } 

      case ADVISE_ERROR:
        return {
          ...state,
          isError: action.isError,
          errMes: action.errMes,
          loading_advise_t:false,
          loading_advise_e:false
        }
  
      default:
        return {
          ...state
        }
        break;
    }
  }
  
  
  // action
  // 初始化表格 
  export const store_advise_action = (data) => {
    return dispatch => {
      dispatch({
          type:ADVISE_TABLE_INIT,
          content:data
      })
  
    }
  }
  
  // 查看详情
  export const showDetail_action = (index,id)=>{

    return dispatch =>{
      dispatch({
        type:ADVISE_DETAIL,
        payload:index,
        loading:true
      })
      ajax("analysis/get_feekback_detail", {
        "id": id,
      }, (res) => {
        if (res.data.result) {
          dispatch({
            type: ADVISE_IMGLIST,
            isError: false,
            payload: res.data.data,
          });
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })

    }
  }

  //关闭详情modal
  export const closeModal_action = () => {
    return dispatch =>{
      dispatch({
        type:ADVISE_CLOSE
      })
    }
  }

  //类型切换
  export const changeType1_action = (typeId,imgSort,timeSort,pgIndex) =>{
    return dispatch =>{
      dispatch({
        type: ADVISE_LOADINGT,
        payload: true
      })
        ajax("analysis/get_feekback_data", {
        "pageSize": 10,
        "pageIndex":pgIndex,
        "type":typeId,
        "orderType":imgSort,
        "order":timeSort
      }, (res) => {
        if (res.data.result) {
          dispatch({
            type: ADVISE_CHANGE_TYPE,
            isError: false,
            payload: res.data.data,
            typeId,
            imgSort,
            timeSort,
            pgIndex,
            total:res.data.total
          });
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })
    }
  }
