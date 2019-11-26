/*
 * @Author: JC.Liu 
 * @Date: 2018-08-03 18:06:17 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-17 14:52:57
 * 关于视频的数据管理
 */

const initState = {
  // 视频描述
  videoDesc: {},
  // 录播资源中的 查看私有评论切换 , 默认值为2 公有
  priStype: 2,

}

const LIVE_VIDEO_DESC = "LIVE_VIDEO_DESC";
const PRI_ARGUMENT = "PRI_ARGUMENT";
const DEFAULT_ECHECK_INFO = "DEFAULT_ECHECK_INFO";
export const VideoReducer = (state = initState, action) => {
  switch (action.type) {
    case LIVE_VIDEO_DESC:
      return {
        ...state,
        ...action
      }
    case PRI_ARGUMENT:
      return {
        ...state,
        ...action
      }
    default:
      return {
        ...state
      }
  }
}


// action
// 直播视频的描述 (无用)
export const LiveVideo_desc_ac = () => {
  return dispatch => {
    dispatch({
      type: LIVE_VIDEO_DESC,
      videoDesc: data,
    })
  }
}


// 点击查看私有评论  评分展示使用的是私有评分  默认值 2  为公有  1为私有
export const listen_pri_argument_ac = (value) => {
  return dispatch => {
    dispatch({
      type: PRI_ARGUMENT,
      priStype: value
    })
  }
}


