/*
 * @Author: hf 
 * @Date: 2018-08-03 09:30:12 
 * @Last Modified by:   hf 
 * @Last Modified time: 2018-08-03 09:30:12 
 */
/**
 * 老师 课堂管理 详细信息
 */
import number from './../js/_x/util/number';
import request from './../js/_x/util/request';
const Request = request.request;
const fileAjax = request.formRequest;

const B_TC_DETAIL = "B_TC_DETAIL";
const B_TC_OPERATE = "B_TC_OPERATE";
const B_TC_PUBDESC = "B_TC_PUBDESC";
const B_TC_CANCEL_CUR_RES = "B_TC_CANCEL_CUR_RES";
const B_TC_EDIT_CURNAME = "B_TC_EDIT_CURNAME";//修改课堂名
const REL_MYUPLOAD = "REL_MYUPLOAD";//关联我的上传
const UPLOAD_IMG = "UPLOAD_IMG";//上传封面
const UPLOAD_VIDEO = "UPLOAD_VIDEO";//上传视频


const init = {
  detailData: null,
  operateRecord: [],
  pubDesc_data: {},
  cutRel_data: {},
  curName_data: {},
  relMyupload_data: {},
  uploadImg_data: {},
  uploadVideo_data: {}
};

export function B_TacherClassManDetailReducer(state = init, action) {
  switch (action.type) {
    case B_TC_DETAIL:
      return { ...state, detailData: action.data }
    case B_TC_OPERATE:
      return { ...state, operateRecord: action.data }
    case B_TC_PUBDESC:
      return { ...state, pubDesc_data: action.data }
    case B_TC_CANCEL_CUR_RES:
      return { ...state, cutRel_data: action.data }
    case B_TC_EDIT_CURNAME:
      return { ...state, curName_data: action.data }
    case B_TC_EDIT_CURNAME:
      return { ...state, curName_data: action.data }
    case REL_MYUPLOAD:
      return { ...state, relMyupload_data: action.data }
    case UPLOAD_IMG:
      return { ...state, uploadImg_data: action.data }
    case UPLOAD_VIDEO:
      return { ...state, uploadVideo_data: action.data }
    default:
      return state
  }
}

/**
 * 获取课堂详细数据
 * id：课堂资源id
 */
export function getCurDetailed_ac(id) {
  return dispatch => {
    Request('private/teaconfig/getCurDetailed',
      {
        "curResourceId": id
      },
      (res) => {
        dispatch({
          type: B_TC_DETAIL,
          data: res.data
        })
      }
    )
  }
}

/**
 * 卸载组件
 */
export function removeComponent_ac(id) {
  return dispatch => {
    dispatch({
      type: B_TC_DETAIL,
      data: null
    })
  }
}

/**
 * 获取课堂操作记录列表
 * id：课堂资源id
 */

export function getCurRecord_ac(id) {
  return dispatch => {
    Request('private/teaconfig/getCurRecord',
      {
        "curResourceId": id
      },
      (res) => {
        dispatch({
          type: B_TC_OPERATE,
          data: res.data
        })
      }
    )
  }
}

/**
 * 修改简介
 */

export function modifyResDes_ac(obj) {
  return dispatch => {
    Request('default/teaconfig/modifyResDes',
      {
        "curResourceId": obj.curResourceId,
        "resourceList": [
          {
            "resourceId": obj.resourceId,
            "pubType": obj.pubType,
            "pubDesc": obj.pubDesc
          }
        ]
      },
      (res) => {
        dispatch({
          type: B_TC_PUBDESC,
          data: res
        })
      }
    )
  }
}

/**
 * 取消课堂资源关联接口
 */
export function modifyCurResInfo_ac(obj) {
  return dispatch => {
    Request('private/teaconfig/modifyCurResInfo',
      {
        "curResourceId": obj.curResourceId,
        "resourceList": [
          {
            "resourceId": obj.resourceId,
            "pubType": obj.pubType
          }
        ]
      },
      (res) => {
        dispatch({
          type: B_TC_CANCEL_CUR_RES,
          data: res
        })
      }
    )
  }
}


/**
 * 修改课堂名
 */

export function modifyCurName_ac(obj) {
  return dispatch => {
    Request('private/teaconfig/modifyCurName',
      {
        "curResourceId": obj.curResourceId,
        "curName": obj.curName
      },
      (res) => {
        dispatch({
          type: B_TC_EDIT_CURNAME,
          data: res
        })
      }
    )
  }
}

/**
 * 关联我的上传
 */
export function addCurResInfo_ac(obj) {
  return dispatch => {
    Request('private/teaconfig/addCurResInfo', obj, (res) => {
      dispatch({
        type: REL_MYUPLOAD,
        data: res
      })
    })
  }
}


/**
 * 录播资源上传封面
 */
export function addUploadCurVideoCoverImage_ac(obj) {
  return dispatch => {
    fileAjax('default/teaconfig/addUploadCurVideoCoverImage', obj, (res) => {
      dispatch({
        type: UPLOAD_IMG,
        data: res
      })
    })
  }
}

/**
 * 录播资源封面默认缩略图
 */
export function addCurCoverThumbImagea_ac(obj) {
  return dispatch => {
    Request('default/teaconfig/addCurCoverThumbImage', obj, (res) => {
      dispatch({
        type: UPLOAD_IMG,
        data: res
      })
    })
  }
}


/**
 * 上传视频
 */

export function addUploadCurriculumVideo_ac(obj) {
  return dispatch => {
    fileAjax('default/teaconfig/addUploadCurriculumVideo', obj, (res) => {
      dispatch({
        type: UPLOAD_VIDEO,
        data: res
      })
    })
  }
}



