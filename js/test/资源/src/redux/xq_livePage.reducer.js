/*
 * @Author: xq 
 * @Date: 2018-08-02 14:29:32 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:24:45
 * 直播课堂 页
 */
import request from '../js/_x/util/request';
import _ from 'lodash';
const Request = request.request;

const initstate = {
    getListParams:{},       // 请求列表的入参
    // liveAdviceList:[]// 接口返回数据-全部列表
   dataList:[],
   liveListR:[],
   isFirstData:true,
   previewListBoxR:[]
}

// 关键字
const GET_LIVE_LIST = "GET_LIVE_LIST";

// reducer
export function LivePageReducer (state = initstate,action){
    switch(action.type){
        case GET_LIVE_LIST:
            return {
                ...state,
                liveListR:action.liveList,
                previewListBoxR:action.previewListBox,
                isFirstData:action.isFirstData
            }
        default:
            return {
                ...state
            }
            break;
    }
    
}

// action
export const getLiveList_ac = (params) => {
    return dispatch => {
        Request('live/liveAdvice/getLiveAdviceList',params,(res) => {
            if(res.result){
               let data =  sortList(res.data.liveAdviceList);
                dispatch({
                    type: GET_LIVE_LIST,
                    liveList:data[0].live[0].liveList,
                    previewListBox:data[1].advice ,
                    isFirstData:false
                })
            }
        })
    }
}

// 直播页面列表数据排序和分组
function sortList(data){
    let allData = data;
    // 直播数据
    let liveListBox=[];
    allData.map( (item,index) => {
        if(item.liveList){
            liveListBox.push(item)
        }
    })

    // 预告列表数据
    let previewListBox=[];  // 排序前
    let previewListNew=[];  // 排序后
    allData.map( (it,index) => {
        if(it.time){
            previewListBox.push(it)
        }
    })
    // reverse(previewListBox);
    // console.log(previewListBox);
    // previewListNew = _.sortBy(previewListBox, function(item) {
    //     return -new Date(item.time).getTime();
    // });
    // console.log('排序',previewListNew)
    let liveAdviceList=[
        {'live':liveListBox},
        {'advice':previewListBox}
       
    ];
    return liveAdviceList;
    
}
