/*
 * @Author: lxx 
 * @Date: 2018-08-29 14:19:16 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-29 15:09:39
 * 相关课堂资源
 */
const LXX_RESSHOWLIST = 'LXX_RESSHOWLIST';   // 相关课堂资源列表展开状态、

const init = {
    showList: [],
}

export function classroomResReducer(state = init, action) {
    // console.log('lxx',action);
    switch (action.type) {
        case 'LXX_RESSHOWLIST':
            return { ...state, showList: action.data };
        default:
            return state;
    }
}

/**
 * 获取相关课堂资源展开收缩状态
 */
export function getShowResList(list) {
    return dispatch => {
        dispatch({
            type: 'LXX_RESSHOWLIST',
            data: list
        });
    }
}