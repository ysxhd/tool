/*
 * @Author: lxx 
 * @Date: 2018-08-01 14:51:28 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-31 11:19:14
 * 前台-评论组件reducer
 */
import { _x } from './../js/index';

const Request = _x.util.request.request;

const LXX_COMMENTTOTAL = 'LXX_COMMENTTOTAL';   // 获取一级评论总数
const LXX_COMMENTINFO = 'LXX_COMMENTINFO';  // 评论列表数据

const init = {
    commentList: [],
    total: 0,
}

export function commentReducer(state = init, action) {
    // console.log('lxx',action);
    switch (action.type) {
        case 'LXX_COMMENTINFO':
            return { ...state, commentList: action.data };
        case 'LXX_COMMENTTOTAL':
            return { ...state, total: action.data };
        default:
            return state;
    }
}

/**
 * 获取一级评论列表
 */
export function getCommentData(param) {
    return dispatch => {
        Request('comment/resource/getFirstClassCommentList', param, (res) => {
            if (res.result && res.data) {
                // 获取一级评论列表总数
                let obj = {
                    "curId": param.curId,
                    "priType": param.priType
                }
                this.getCommentTotal(obj);
                dispatch({
                    type: 'LXX_COMMENTINFO',
                    data: res.data
                });
            } else {
                // 获取一级评论列表总数
                let obj = {
                    "curId": param.curId,
                    "priType": param.priType
                }
                this.getCommentTotal(obj);
                dispatch({
                    type: 'LXX_COMMENTINFO',
                    data: []
                });
            }
        })

    }
}

/**
 * 获取一级评论总数
 */
export function getCommentTotal(param) {
    return dispatch => {
        Request('comment/resource/getFirstClassCommentTotalNum', param, (res) => {
            if (res.result && res.data) {
                dispatch({
                    type: 'LXX_COMMENTTOTAL',
                    data: res.data.num
                })
            }
        })
    }
}


/**
 * 回复列表变化，更新一级评论数据
 * num 回复列表数量
 * list 更新的一级评论数据
 */
export function updateReplayNum(num, list) {
    let curId = list.curCommentId,
        commentList = this.commentReducer.commentList;
    return dispatch => {
        for(let i in commentList) {
            if(commentList[i].curCommentId === curId) {
                commentList[i].replyNum = num;
            }
        }
        dispatch({
            type: 'LXX_COMMENTINFO',
            data: commentList
        })
    }
}

