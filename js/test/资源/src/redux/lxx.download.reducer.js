/*
 * @Author: lxx 
 * @Date: 2018-08-14 09:41:21 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-14 13:11:31
 * 下载
 */
const LXX_DOWNLOADSHOW = 'LXX_DOWNLOADSHOW';   // 弹窗是否显示

const init = {
    isShow: false,
    params: {
        resourceId: '',  // 资源id
        definition: '',  //hd高清，ld标清，un不知道清晰度
        resName: '',   // 文件名
        resSize: 0,   // 文件大小
        resFormat: '',  // 文件格式
    }
}

export function downloadReducer(state = init, action) {
    // console.log('lxx',action);
    switch (action.type) {
        case 'LXX_DOWNLOADSHOW':
            return {  ...state, isShow: action.isShow, params: action.params };
        default:
            return state;
    }
}

// 弹窗显示
export function handleModalShow(bol, params) {
    return dispatch => {
        if (bol === false) {
            dispatch({
                type: 'LXX_DOWNLOADSHOW',
                isShow: bol,
                params: init.params
            });
        } else {
            dispatch({
                type: 'LXX_DOWNLOADSHOW',
                isShow: bol,
                params: params
            });
        }


    }
}