/*
 * @Author: junjie.lean
 * @Date: 2018-07-16 15:42:17
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:24:32
 */

import request from '../js/_x/util/request';
import date from '../js/_x/util/date';
import G from '../js/g';
import { message } from 'antd';

const ajax = request.request;
const formatTime = date.format;
const init = {}

//loading页的获取用户类型的reducer
export const loadingGetUserReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-getUserInfo":
            {
                return {
                    ...state,
                    userInfo: action.data
                }
            }
        default:
            {
                return {
                    ...state
                }
            }
    }
}

//loading页获取全局配置的action 
export const loadingGetGloabl_action = (data) => {
    return dispatch => {
        dispatch({
            type: "lean-loading-setGloable",
            data: {
                configInfo: data
            }
        })
    }
}

//loading页的获取用户类型的action，根据token和orgcode取用户角色
export const getUserType_action = (data) => {
    return dispatch => {
        dispatch({ type: "lean-getUserInfo", data: data })
    }
}

//loading页获取全局配置的reducer
export const loadingGatGloablReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-loading-setGloable": {
            return {
                ...state,
                configInfo: {
                    ...action.data.configInfo
                }
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//最热课堂的reducer
export const hotClassReducer = (state = init, action) => {
    // console.log('action', action)
    switch (action.type) {
        case "lean-setHotTeacher":
            {
                return {
                    ...state,
                    hotTeacher: {
                        data: action.data.hotTeacher
                    }
                }
            }
        case "lean-setHotPubClass":
            {
                return {
                    ...state,
                    myHotPubClass: {
                        data: action.data.myHotPubClass
                    }
                }
            }
        case "lean-setHotPriClass":
            {
                return {
                    ...state,
                    myHotPriClass: {
                        data: action.data.myHotPriClass
                    }
                }
            }
        default:
            {
                return {
                    ...state
                }
            }
    }
}

//获取当前角色最热课堂的action
export const getHotPubClass_action = () => {
    let _methodName = 'public/index/getHotPubCurs';
    let myHotPubClass = [];
    return dispatch => {
        ajax(_methodName, {}, (res) => {
            if (res.result && res.message === 'OK') {
                let data = res.data.pubCurList;
                for (let i = 0; i < data.length; i++) {
                    myHotPubClass.push({
                        classId: data[i].curResourceId,
                        view: data[i].pubWatchNum,
                        name: data[i].curName
                    })
                }
                dispatch({
                    type: "lean-setHotPubClass",
                    data: {
                        myHotPubClass
                    }
                })
            } else {
                message.error(res.message)
            }
        })
    }
}

//获取当前角色最热私有课堂的action
export const getHotPriClass_action = () => {
    let _methodName = 'private/index/getHotPriCurs';
    let myHotPriClass = [];
    return dispatch => {
        ajax(_methodName, {}, (res) => {
            if (res.result && res.message === 'OK') {
                let data = res.data.privCurList;
                for (let i = 0; i < data.length; i++) {
                    myHotPriClass.push({
                        classId: data[i].curResourceId,
                        view: data[i].privWatchNum,
                        name: data[i].curName
                    })
                }
                dispatch({
                    type: "lean-setHotPriClass",
                    data: {
                        myHotPriClass
                    }
                })
            } else {
                message.error(res.message)
            }

        })
    }
}

//获取当前最热教师的action
export const getHotTeacher_action = () => {
    let _methodName = 'default/index/getTeaHotInfo';
    let hotTeacher = [];
    return dispatch => {
        ajax(_methodName, {}, (res) => {
            if (res.result && res.message === "OK") {
                let data = res.data.teacherList;
                // console.log('data', data)
                for (let i = 0; i < data.length; i++) {
                    hotTeacher.push({
                        name: data[i].teacherName,
                        tid: data[i].teacherId,
                        subject: data[i].subName,
                        classNum: data[i].teaCurNum,
                        view: data[i].pubBrowseSum,
                        sex: data[i].sex,
                        faceImgCloudId: data[i].faceImgCloudId
                    })
                }
                dispatch({
                    type: "lean-setHotTeacher",
                    data: {
                        hotTeacher
                    }
                })
            } else {
                message.error(res.message)
            }
        })
    }
}



//教师云盘获取列表数据的reducer
export const netDeskReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-reflush":
            {
                return {
                    ...state,
                    data: action.data
                }
            }
        default:
            {
                return {
                    ...state
                }
            }
    }
}

//教师云盘的刷新操作的action
export const netDesk_flush_aciton = (outData, fatherFolderId = G.userInfo.user.userId, resFormatId = 0) => {
    return dispatch => {
        let data,
            _fatherFolderId = fatherFolderId,
            _resFormatId = resFormatId,
            _methodName = 'default/cloudDiskManage/getTotalFolderAndFileList';
        if (outData) {
            data = outData;
            //缓存数据
            dispatch({ type: "lean-netdesk-reflush", data })
        } else {
            //实时数据
            // console.log('现在要重新请求拿数据了，请求参数是', _fatherFolderId, _resFormatId);
            ajax(_methodName, {
                folderId: _fatherFolderId,
                resFormatId: _resFormatId
            }, (res) => {
                if (res.result && res.message.toUpperCase() === 'OK') {
                    let folderList = [],
                        fileList = [];
                    for (let o of res.data.fetchFolderList) {
                        let tmp = {
                            folderId: o.folderId,
                            fatherId: o.fatherId,
                            folderName: o.folderName,
                            checked: false,
                            changeState: false
                        }
                        folderList.push(tmp)
                    }

                    for (let o of res.data.fetchFileList) {
                        let tmp = {
                            fileId: o.resourceId,
                            /**需要改成o.fileId */
                            fileName: o.resName,
                            resFormat: o.resFormat,
                            updateTime: "",
                            fileType: "",
                            fileSize: "",
                            checked: false,
                            changeState: false
                        }
                        {
                            if (o.resFormat === 'jpeg' || o.resFormat === 'jpg' || o.resFormat === 'bmp' || o.resFormat === 'png' || o.resFormat === 'gif') {
                                tmp.fileType = 'pic'
                            } else if (o.resFormat === 'avi' || o.resFormat === '3gp' || o.resFormat === 'mkv' || o.resFormat === 'mov' || o.resFormat === 'mpeg' || o.resFormat === 'mp4' || o.resFormat === 'rmvb' || o.resFormat === 'rm' || o.resFormat === 'dat' || o.resFormat === 'ts' || o.resFormat === 'wmv' || o.resFormat === 'flv') {
                                tmp.fileType = 'video'
                            } else if (o.resFormat === 'swf') {
                                tmp.fileType = 'swf'
                            } else if (o.resFormat === 'mp3' || o.resFormat === 'wma' || o.resFormat === 'wav') {
                                tmp.fileType = 'audio'
                            } else if (o.resFormat === 'txt') {
                                tmp.fileType = 'txt'
                            } else if (o.resFormat === 'doc' || o.resFormat === 'docx') {
                                tmp.fileType = 'word'
                            } else if (o.resFormat === 'xls' || o.resFormat === 'xlsx') {
                                tmp.fileType = 'excel'
                            } else if (o.resFormat === 'pdf') {
                                tmp.fileType = 'pdf'
                            } else if (o.resFormat === 'ppt' || o.resFormat === 'pptx') {
                                tmp.fileType = 'ppt'
                            } else {
                                tmp.fileType = 'other'
                            }
                            tmp.fileSize = o.resSize.formatSize();
                            tmp.updateTime = formatTime((new Date(o.uplaodTime)));
                        }
                        fileList.push(tmp)
                    }
                    data = {
                        folderList,
                        fileList
                    };
                    // console.log(data);
                    dispatch({ type: "lean-netdesk-reflush", data })
                } else {
                    message.error(res.message)
                }
            })

        }
    }
}

//教师云盘的遮罩操作
export const screenMaskReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-openmask":
            {
                return {
                    ...state,
                    isShow: true
                }
            }
        case "lean-netdesk-closemask":
            {
                return {
                    ...state,
                    isShow: false
                }
            }
        default:
            {
                return {
                    ...state
                }
            }
    }
}

//教师云盘打开遮罩的action
export const screenMaskOpen_action = () => {
    return dispatch => {
        dispatch({ type: "lean-netdesk-openmask" })
    }
}

//教师云盘关闭遮罩的action
export const screenMaskClose_action = () => {
    return dispatch => {
        dispatch({ type: "lean-netdesk-closemask" })
    }
}

//教师云盘的抽屉reducer
export const screenDrawerReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-drawer-set": {
            return {
                ...state,
                data: action.data
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘的抽屉的action ture为开 fasle为关
// export const screenDrawer_action = (ac = false) => {
//     return dispatch => {
//         dispatch({
//             type: "lean-drawer-set",
//             data: ac
//         })
//     }
// }

//教师云盘正在上传中的资源 用于抽屉的展示
export const screenDrawerDataReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-uploadFileSet": {
            return {
                ...state,
                data: [
                    ...action.data
                ]
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘上传文件的操作action
export const screenDrawerData_action = (data = []) => {
    return dispatch => {
        dispatch({
            type: "lean-uploadFileSet",
            data: [
                ...data
            ]
        })
    }
}

//教师云盘上传文件组件的操作
export const uploadComReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-openUpload":
            {
                return {
                    ...state,
                    isShow: true
                }
            }
        case "lean-netdesk-closeUpload":
            {
                return {
                    ...state,
                    isShow: false
                }
            }
        default:
            {
                return {
                    ...state
                }
            }
    }

}

//教师云盘打开上传组件的action
export const uploadOpen_action = () => {
    return dispatch => {
        dispatch({ type: "lean-netdesk-openUpload" })
    }
}

//教师云盘关闭上传组件的action
export const uploadClose_action = () => {
    return dispatch => {
        dispatch({ type: "lean-netdesk-closeUpload" })
    }
}


//教师云盘上传文件过程的组件控制reducer
export const uploadTimelineReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-uploadtimeline": {
            return {
                ...state,
                isShow: action.data.isShow
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘上传文件的过程ac
export const uploadTimeline_action = (state) => {
    return dispatch => {
        dispatch({
            type: "lean-uploadtimeline",
            data: {
                isShow: state
            }
        })
    }
}


//教师云盘容量的获取结果
export const cloudDiskDataReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-getStore": {
            return {
                ...state,
                data: action.data
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘容量的获取操作
export const cloudDiskData_action = () => {
    let _methodName = 'default/cloudDiskManage/getCloudDiskData';
    return dispatch => {
        ajax(_methodName, {}, (res) => {
            let data = {}
            if (res.result && res.message === 'OK') {
                data = {
                    ...res.data
                }
                dispatch({ type: "lean-netdesk-getStore", data })
            } else {
                data = {
                    cloudCapacity: 0,
                    resourceSize: 0
                }
                dispatch({ type: "lean-netdesk-getStore", data })
            }
        })
    }
}

//教师云盘-文件夹的文件的删除状态reducer
export const cloudDiskRemoveStateReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-removeState": {
            return {
                ...state,
                lastRemoveState: action.data
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘-文件夹和文件的删除操作
export const cloudDiskRemoveFolder_action = (pr, fcb, scb) => {
    let _methodName = 'default/cloudDiskManage/removeFoldersAndFiles';
    return dispatch => {
        /** -1 不能删除  0 部分删除   1  删除成功  */
        ajax(_methodName, pr, (res) => {
            if (res.result && res.message == 'OK') {
                if (res.data.status == 1) {
                    scb();
                } else if (res.data.status == -1) {
                    fcb(-1);
                } else if (res.data.status == 0) {
                    fcb(0)
                } else {
                    return false
                }
                dispatch({
                    type: "lean-netdesk-removeState",
                    data: res.data.status
                })
            } else {
                message.error(res.message)
            }
        })

    }
}

//教师云盘文件夹的进出Reducer
export const netDeskFolderEnterReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netdesk-enterFolder": {
            return {
                ...state,
                folderPath: [...action.folderPath]
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//教师云盘文件夹 面包屑导航点击事件对目录数据的进出操作 
export const netDeskBreadcrumbPathChange_action = (folderPath) => {
    return dispatch => {
        dispatch({
            type: "lean-netdesk-enterFolder",
            folderPath
        })
    }
}

//教师云盘文件夹的进出操作
export const netDeskFolderPathChange_action = (action = false, pathList = [], enterFolder) => {
    let folderPath;
    if (action) {
        if (enterFolder) {
            //folder enter
            pathList.push(enterFolder)
        } else {
            //folder path unchange

        }
    } else {
        //back
        if (pathList.length <= 1) {
            pathList = [{ folderName: '/', folderId: G.userInfo.user.userId }];
        } else {
            pathList.pop();
        }
    }
    folderPath = [...pathList];
    return dispatch => {
        dispatch({
            type: "lean-netdesk-enterFolder",
            folderPath
        })
    }
}

//教师云盘的左边过滤条件的保存
export const netDeskFliterStateReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-netDesk-FliterChange": {
            return {
                ...state,
                curType: action.curType
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}
//教师云盘的左边过滤条件变更操作action
export const netDeskFliterState_action = (curType) => {
    return dispatch => {
        dispatch({
            type: 'lean-netDesk-FliterChange',
            curType
        })
    }
}

//教师云盘的新建文件夹的提交操作action
export const netDeskCreateFolder_action = (o, cb) => {
    let _methodName = 'default/cloudDiskManage/addFolder';

    return dispatch => {
        ajax(_methodName, o, (res) => {
            if (res.result && res.message === 'OK') {
                // netDesk_flush_aciton(null, o.folderId = 0, o.formatId = 0);
            
                cb();
            } else {
                message.error(res.message)
            }
        })
    }

}

//教师云盘修改文件夹名的操作action
export const netDeskChangeFolderName_action = (o, fcb, scb = () => { }) => {
    let _methodName = 'default/cloudDiskManage/folderRename';
    return dispatch => {
        ajax(_methodName, o, (res) => {
            console.log(res);
            if (res.result && res.message === 'OK') {
                scb()
            } else {
                fcb()
            }
        })
    }
}


//教师云盘修改文件名的操作action
export const netDeskChangeFileName_action = (o, fcb, scb = () => { }) => {
    let _methodName = 'default/cloudDiskManage/fileRename';
    return dispatch => {
        ajax(_methodName, o, (res) => {
            if (res.result && res.message === 'OK') {
                scb()
            } else {
                fcb()
            }
        })
    }
}

//管理员平台配置的Reducer
export const systeamConfigReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-setSysteamConfig": {
            G.configInfo = action.data;
            sessionStorage.setItem('configInfo', JSON.stringify(action.data));
            return {
                ...state,
                data: action.data
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//管理员平台配置的设置action 
export const setSysteamConfig_action = (pr, scb = () => { return false }, fcb = () => { return false }) => {
    let _methodName = 'default/systemConfig/modifyConfigParam';
    return dispatch => {
        ajax(_methodName, pr, (res) => {
            if (res.result && res.message === 'OK') {
                let a = { ...G.configInfo, ...pr };
                sessionStorage.setItem('configInfo', JSON.stringify(a));
                G.configInfo = { ...a };
                // console.log(G.configInfo);
                dispatch({
                    type: "lean-setSysteamConfig",
                    data: a
                })
                scb();
            } else {
                //设置失败，需要重新拉取模块配置
                fcb(res.message);
            }
        })
    }
}

//管理员全局云盘容量
export const systeamCloudDiskDataReducer = (state = init, action) => {
    switch (action.type) {
        case "lean-getSysteamCloudData": {
            return {
                ...state,
                data: action.data
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}

//管理员获取全局云盘容量的操作
export const getSysteamCloudDiskData = () => {
    let _methodName = 'default/systemConfig/getTotalCloudDiskData';
    return dispatch => {
        ajax(_methodName, {}, (res) => {
            if (res.result && res.message == 'OK') {
                dispatch({
                    type: "lean-getSysteamCloudData",
                    data: res.data
                })
            } else {
                message.error(res.message)
            }
        })
    }
}