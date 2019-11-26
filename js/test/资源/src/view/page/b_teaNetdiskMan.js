/*
 * @Author: junjie.lean
 * @Date: 2018-07-23 15:07:14
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-10 12:54:16
 * 后台 - 老师的云盘管理
 */

import React from 'react';
import { TeacherNav } from './JC_header';
import { Tea_FooterBar as Footer } from '../components/JC_footer';
import './../../css/netdesk.css';
import _ from 'lodash';
import G from '../../js/g';
import { Button, Progress, Drawer, message, Checkbox, Tooltip, Modal } from "antd";
import { SVG } from './../common';
import { connect } from "react-redux";
import {
    netDesk_flush_aciton,
    screenMaskOpen_action,
    screenMaskClose_action,
    uploadOpen_action,
    netDeskFliterState_action,
    uploadClose_action,
    cloudDiskData_action,
    netDeskFolderPathChange_action,
    cloudDiskRemoveFolder_action,
    netDeskCreateFolder_action,
    netDeskChangeFileName_action,
    netDeskBreadcrumbPathChange_action,
    netDeskChangeFolderName_action,
    screenDrawer_action,
    uploadTimeline_action,
    screenDrawerData_action,
} from '../../redux/lean.reducers';

import { handleModalShow } from './../../redux/lxx.download.reducer';

import Folder from '../../icon/folder.png';
import Other from '../../icon/other_m.png';
import Word from '../../icon/word_m.png';
import Zip from '../../icon/zip_m.png';
import Txt from '../../icon/txt_m.png';
import Swf from '../../icon/swf_m.png';
import Ppt from '../../icon/ppt_m.png';
import Pdf from '../../icon/pdf_m.png';
import Video from '../../icon/mp4_m.png';
import Audio from '../../icon/mp3_m.png';
import Pic from '../../icon/jpg_m.png';
import Excel from '../../icon/excel_m.png';
import request from '../../js/_x/util/request';

import { DownloadFile } from './../../view/common';

import url from './../../js/_x/util/url';

const goWith = url.goWith;
const fileAjax = request.formRequest;
const confirm = Modal.confirm;
//页面内注入的action
const actions = {
    netDesk_flush_aciton,
    screenMaskOpen_action,
    screenMaskClose_action,
    uploadOpen_action,
    uploadClose_action,
    cloudDiskData_action,
    cloudDiskRemoveFolder_action,
    netDeskFolderPathChange_action,
    netDeskFliterState_action,
    netDeskCreateFolder_action,
    handleModalShow,
    netDeskChangeFileName_action,
    netDeskBreadcrumbPathChange_action,
    netDeskChangeFolderName_action,
    screenDrawer_action,
    uploadTimeline_action,
    screenDrawerData_action
};


//内部👆头按键组件
class Headnav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ...this.props.netDeskReducer.data
            },
        }
        this.props.cloudDiskData_action();
        // console.log(Pic);
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {
            data: {
                ...props.netDeskReducer.data,
            },
            ...props.cloudDiskDataReducer.data
        };
        return newState;
    }

    updateHandle() {
        if (G.configInfo.cloudType === 0) {
            message.warning('教师云盘功能限制，不能上传');
            return false;
        } else {
            this.props.screenMaskOpen_action();
            this.props.uploadOpen_action();
        }
    }

    createFolderHandle() {
        let folderList = this.state.data.folderList || [];
        let newFolder = {
            // ...folderList[0],
            changeState: true,
            checked: false,
            folderId: `newFolder_${new Date().getTime()}`,
            folderName: "",
            istmpFolder: true
        };
        if (folderList.length > 0 && folderList[0].istmpFolder) {
            return false
        }
        folderList.unshift(newFolder);
        this.props.screenMaskOpen_action();
        this.setState({
            data: {
                ...this.state.data,
                folderList
            }
        })
        this.stateToRedux();
    }

    //修改后的数据往redux提交
    stateToRedux() {
        let data = this.state.data;
        this.props.netDesk_flush_aciton(data);
    }

    //批量删除
    deleteHandle() {

        let { folderList, fileList } = this.state.data;
        let folderHasCheck = [], fileHasCheck = [];
        for (let o of folderList) {
            if (o.checked) {
                folderHasCheck.push(o.folderId)
            }
        }
        for (let o of fileList) {
            if (o.checked) {
                fileHasCheck.push(o.fileId)
            }
        }
        let pr = {
            folderList: [],
            resourceList: [],
            level: this.props.netDeskFolderEnterReducer.folderPath.length - 1 >= 0 ? this.props.netDeskFolderEnterReducer.folderPath.length - 1 : 0
        }
        for (let o of folderHasCheck) {
            pr.folderList.push({
                folderId: o
            })
        }
        for (let o of fileHasCheck) {
            pr.resourceList.push({
                resourceId: o
            })
        }
        let deleteErrorCallback = (s) => {
            if (s === -1) {
                message.warning('已关联文件不能删除!');
            } else if (s === 0) {
                message.success('部分已关联文件，未能删除已关联文件！')
                this.refreshHandle();
            } else {
                return false
            }
        }
        let deleteSuccessCallback = () => {
            message.success('删除成功！');
            this.refreshHandle();
        }
        if (pr.folderList.length == 0 && pr.resourceList.length == 0) {
            message.warning('至少选择一个文件！')
            return false;
        }
        let _this = this;
        confirm({
            title: '确认删除所选文件吗?',
            content: '请注意，此操作不可逆！',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.props.cloudDiskRemoveFolder_action(pr, deleteErrorCallback, deleteSuccessCallback);
            },
            onCancel() {
                return false;
            },
        })
        // this.props.cloudDiskRemoveFolder_action(pr, deleteErrorCallback, deleteSuccessCallback);
    }

    //查看上传状态
    checkUploadState() {
        this.props.uploadTimeline_action(true)
    }

    //刷新列表
    refreshHandle() {
        let forderId = this.props.netDeskFolderEnterReducer.folderPath[this.props.netDeskFolderEnterReducer.folderPath.length - 1].folderId, formatId = this.props.netDeskFliterStateReducer.curType;
        this.props.netDesk_flush_aciton(null, forderId, formatId);
    }

    render() {
        let percent, use, totle, canUse;
        if (this.state.cloudCapacity === undefined) {
            return false;
        } else {
            if (this.state.cloudCapacity < this.state.resourceSize) {
                percent = 0;
                // use = '0M';
                // totle = '0M';
                totle = (this.state.cloudCapacity - 0).formatSize();
                use = (this.state.resourceSize - 0).formatSize();
            } else {
                totle = (this.state.cloudCapacity - 0).formatSize();
                use = (this.state.resourceSize - 0).formatSize();
                percent = ((this.state.resourceSize - 0) / (this.state.cloudCapacity - 0)) < 2 ? 2 : ((this.state.resourceSize - 0) / (this.state.cloudCapacity - 0));
            }
            canUse = (this.state.cloudCapacity - this.state.resourceSize - 0).formatSize();
        }
        return (
            <div className="lean-netdesk-headnav lxx-g-flex">
                <div className="lxx-g-flex-center">
                    <h3 className="lean-netdesk-title">云盘管理</h3>
                    <Button
                        className="lxx-s-blue lean-netdesk-headBtn"
                        onClick={this
                            .updateHandle
                            .bind(this)}>
                        <SVG type="upload" />
                        &nbsp; 上传资源
          </Button>
                    <Button
                        className="lean-netdesk-headBtn"
                        onClick={this
                            .createFolderHandle
                            .bind(this)}>
                        <SVG type="newFolder" />
                        &nbsp; 新建文件夹
          </Button>
                    <Button
                        className="lean-netdesk-headBtn"
                        onClick={this
                            .deleteHandle
                            .bind(this)}>
                        <SVG type="delete" />
                        &nbsp; 删除
          </Button>
                    <Button
                        className="lean-netdesk-headBtn"
                        onClick={this
                            .refreshHandle
                            .bind(this)}>
                        <SVG type="refresh" />
                        &nbsp; 刷新
          </Button>
                    <Button
                        className="lean-netdesk-headBtn"
                        onClick={this
                            .checkUploadState
                            .bind(this)}>
                        <SVG type="nextWeek" />
                        &nbsp; 查看上传状态
          </Button>

                    <div className="lean-netdesk-headright">
                        <span>云盘容量：</span>
                        <div className="lean-netdesk-headprogress">
                            {
                                percent > 0 ?
                                    <Progress percent={percent} showInfo={false} status="active" />
                                    :
                                    <Progress percent={100} showInfo={false} status="exception" />

                            }
                        </div>
                        <span>{canUse}可用，共{totle}</span>
                    </div>
                </div>
            </div>
        )
    }
}

//全屏遮罩 通过redux进行控制
class ScreenMask extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShow: false/**默认应当是false，关闭状态 */
        }
    }
    componentDidMount() {
    }
    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            ...props.screenMaskReducer
        }
    }
    render() {
        let isShow = this.state.isShow;
        let [show,
            hide] = [
                {
                    zIndex: "99",
                    display: "block"
                }, {
                    zIndex: "-1",
                    display: "none"
                }
            ];
        return (
            <div
                className="lean-netdesk-ScreenMask"
                style={isShow
                    ? show
                    : hide}></div>
        )
    }
}

//上传文件组件
class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            thisFileName: "请选择文件"
        };

        // this.props.screenDrawerData_action([]);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            ...state,
            ...props.uploadComReducer
        }
    }
    componentDidMount() {
        let ele = document.querySelector('.lean-netdesk-fileBorder');
        if (ele) {
            ele.value = null;
        }
    }
    uploadBoxCloseHandle() {
        this.props.uploadClose_action();
        this.props.screenMaskClose_action();
        document.querySelector('.lean-netdesk-fileBorder').value = null;
    }
    selectFileHandle() {
        // document.querySelector('.lean-netdesk-fileBorder').value = null;
        // let fileObject = document.querySelector('.lean-netdesk-fileBorder').files[0];
        // console.log(fileObject);
        let fileName = document.querySelector('.lean-netdesk-fileBorder').value;
        this.setState({
            thisFileName: fileName
        })

        // console.log(document.querySelector('.lean-netdesk-fileBorder').files[0]);
    }

    setFileNameNull(name = "请选择文件") {
        this.setState({
            thisFileName: name
        })
    }

    beginUploadHandle() {
        let { fileList } = this.props.netDeskReducer.data;
        if (!document.querySelector('.lean-netdesk-fileBorder').files[0]) {
            message.error('请选择文件');
            this.setFileNameNull();
            return false;
        }
        let fname = document.querySelector('.lean-netdesk-fileBorder').files[0].name;
        // console.log(document.querySelector('.lean-netdesk-fileBorder').files[0]);
        let isTooBig = document.querySelector('.lean-netdesk-fileBorder').files[0].size / 1024 / 1024 / 1024 >= 1;
        // let isTooBig = document.querySelector('.lean-netdesk-fileBorder').files[0].size / 1024 / 1024 / 1024 >= 100;
        //上传文件名正则判断条件
        //逻辑修改
        let reg = new RegExp("[`~^=':;'\\[\\]/~@#￥……&*|{}‘；：”“'。、]");
        let isRegCheck = reg.test(fname);
        let isNoSelectFile = fname === "";
        let isConcatSpaces = fname.indexOf(' ') != -1;
        let isUnallowFileReg = /^(.*)\.(class|exe|bat|vbs|cmd|log|reg|lng|ini|ico|inf|js|sh|sql)$/ig;
        let isUnallowFile = isUnallowFileReg.test(fname);
        let isSameFileName = false;
        for (let o of fileList) {
            if (fname.indexOf(o.fileName) != -1) {
                isSameFileName = true;
                break;
            }
        }
        if (isNoSelectFile) {
            message.error('请选择文件');
            this.setFileNameNull();
            return false
        } else if (isSameFileName) {
            //此处bug
            message.error('已存在同名文件');
            // document.querySelector('.lean-netdesk-fileBorder').value = null;
            return false
        } else if (isConcatSpaces) {
            message.error('文件名不能包含空格');
            document.querySelector('.lean-netdesk-fileBorder').value = null;
            return false
        } else if (isUnallowFile) {
            message.error(`不能上传后缀名为“${fname.slice(fname.lastIndexOf('.'))}”的文件`);
            return false;
        }
        else if (isRegCheck) {
            message.error('文件名不能包含特殊符号');
            // document.querySelector('.lean-netdesk-fileBorder').value = null;
            return false
        } else if (isTooBig) {
            message.error('文件大小超过1G，不能上传');
            // document.querySelector('.lean-netdesk-fileBorder').value = null;
            return false
        } else {
            this.setFileNameNull();
            let { folderPath } = this.props.netDeskFolderEnterReducer;
            let folderId = folderPath[folderPath.length - 1].folderId;
            let pr = {
                file: document.querySelector('.lean-netdesk-fileBorder').files[0],
                folderId
            }
            this.props.uploadClose_action();
            this.props.screenMaskClose_action();
            this.props.uploadTimeline_action(true);
            let sourceData = this.props.screenDrawerDataReducer.data;
            /**上传过程的抽屉逻辑处理 */
            /**上传状态  -1 正在上传     0 上传完成     1 上传异常 */
            let currentFile = { name: pr.file.name, type: pr.file.type, size: pr.file.size, state: -1 };
            sourceData.push(currentFile);
            this.props.screenDrawerData_action(sourceData);
            fileAjax(
                'cloud/cloudDiskManage/uploadResource',
                pr,
                (res) => {
                    if (res.result && res.message == 'OK') {
                        this.refreshHandle();
                        let tmpList = this.props.screenDrawerDataReducer.data;
                        let i = _.findLastIndex(tmpList, { name: pr.file.name });
                        if (i > -1) {
                            /**上传成功  将文件状态设置为0 */
                            tmpList[i].state = 0;
                            this.props.screenDrawerData_action(tmpList);
                        }

                    } else {
                        let tmpList = this.props.screenDrawerDataReducer.data;
                        let i = _.findLastIndex(tmpList, { name: pr.file.name });
                        if (i > -1) {
                            /**上传失败 将文件状态设置为1 */
                            tmpList[i].state = 1;
                            this.props.screenDrawerData_action(tmpList);
                        }
                        message.warning(res.message);
                    }
                    document.querySelector('.lean-netdesk-fileBorder').value = null;
                    // this.props.screenMaskClose_action();
                }, () => {
                    document.querySelector('.lean-netdesk-fileBorder').value = null;
                },
                (v) => {
                    let tmpList = this.props.screenDrawerDataReducer.data;
                    let i = _.findLastIndex(tmpList, { name: pr.file.name });
                    if (i > -1) {
                        /**上传成功  将文件状态设置为0 */
                        tmpList[i].progress = v;
                        this.props.screenDrawerData_action(tmpList);
                    }
                }
            )
        }
        // console.log(this.refs); 
    }
    refreshHandle() {
        let forderId = this.props.netDeskFolderEnterReducer.folderPath[this.props.netDeskFolderEnterReducer.folderPath.length - 1].folderId, formatId = this.props.netDeskFliterStateReducer.curType;
        this.props.netDesk_flush_aciton(null, forderId, formatId);
    }
    render() {
        if (!this.props.netDeskFolderEnterReducer.folderPath) {
            return false
        }
        let isShow = this.state.isShow;
        let [show,
            hide] = [
                {
                    zIndex: "100",
                    display: "block"
                }, {
                    zIndex: "-2",
                    display: "none"
                }
            ];

        let path = '我的云盘 /';
        let arrayPath = this.props.netDeskFolderEnterReducer.folderPath;
        for (let i = 0; i < arrayPath.length; i++) {
            if (arrayPath.length === 1) {
                break;
            } else if (arrayPath.length <= 4) {
                if (i === 0) {
                    continue;
                } else {
                    path += arrayPath[i].folderName + ' / '
                }
            } else {
                if (i === 0) {
                    continue;
                }
                path += arrayPath[i].folderName + ' / '
                if (i === 4) {
                    path += '  ...'
                    break;
                }
            }
        }
        return (
            <div
                className="lean-netdesk-uploadContainer"
                style={isShow
                    ? show
                    : hide}>
                <p className="lean-netdesk-uploadTitle">
                    <span>上传资源</span>
                    <i className="lean-netdesk-uploadClose"
                        onClick={this.uploadBoxCloseHandle.bind(this)} >
                        <SVG type="close" />
                    </i>
                </p>
                <div className="lean-netdesk-uploadFileContainer">
                    <span>{this.state.thisFileName}</span>
                    <button>选择文件</button>
                    <input
                        ref="leanFileBorder"
                        type="file"
                        className="lean-netdesk-fileBorder"
                        onChange={this.selectFileHandle.bind(this)} />
                </div>
                <div className="lean-netdesk-uploadBtnZone">
                    <button className="lxx-s-blue" onClick={this.beginUploadHandle.bind(this)}>开始上传</button>
                    <span>上传路径:{path}</span>
                </div>
            </div>
        )
    }
}

//左边👈过滤条件组件
class Fliter extends React.Component {
    constructor(props) {
        super(props);
        let wordsList = [], idList = [], picList = [];
        for (let o of G.resourceFormatList) {
            wordsList.push(o.formatName);
            idList.push(o.resFormatId);
            let pic = o.resFormatId == 0
                ? 'all' :
                o.resFormatId == 1
                    ? 'picture' :
                    o.resFormatId == 2
                        ? 'document' :
                        o.resFormatId == 3
                            ? 'video' :
                            o.resFormatId == 4
                                ? 'mp3' :
                                o.resFormatId == 5
                                    ? 'other' : 'unknow';
            picList.push(pic);
        }
        this.state = {
            current: 'all',
            currentId: '0',
            wordsList,
            idList,
            picList
        }
        this.props.netDeskFolderPathChange_action(false);
        this.props.netDeskFliterState_action(0)/**初始化置为all：0 */
    }

    changeCondition(type) {
        if (this.state.current == type) {
            return false
        }
        let resourceFormatId = this.state.idList[(_.indexOf(this.state.picList, type))] - 0;
        this.setState({
            ...this.state,
            current: type,
            currentId: resourceFormatId
        })
        let folderId = this.props.netDeskFolderEnterReducer.folderPath[this.props.netDeskFolderEnterReducer.folderPath.length - 1].folderId;
        this.props.netDesk_flush_aciton(null, folderId, resourceFormatId);
        this.props.netDeskFliterState_action(resourceFormatId);
    }

    render() {
        return (
            <div className="lean-netdesk-fliter">
                <ul>
                    {this
                        .state
                        .wordsList
                        .map((item, index) => {
                            return (
                                <li key={index}>
                                    <span
                                        className={this.state.current == this.state.picList[index]
                                            ? "lean-netdesk-fliter-active"
                                            : ""}
                                        onClick={this
                                            .changeCondition
                                            .bind(this, this.state.picList[index])}>
                                        <SVG type={this.state.picList[index]} />
                                        &nbsp;{item}
                                    </span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}

//右边👉内容展示组件
class Content extends React.Component {
    constructor(props) {
        super(props);
        let { folderList, fileList } = this.props.data;
        // for (let i = 0; i < folderList.length; i++) {
        //     folderList[i].checked = false;
        //     folderList[i].changeState = false;
        // }
        // for (let i = 0; i < fileList.length; i++) {
        //     fileList[i].checked = false;
        //     fileList[i].changeState = false;
        // }

        let { folderPath } = this.props.netDeskFolderEnterReducer;
        this.state = {
            checkAll: false,
            checkCount: 0,
            data: {
                folderList,
                fileList,
                folderPath
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        let data = props.netDeskReducer.data,
            folderPath = state.data.folderPath;
        let checkAll = true, checkCount = 0;
        let { folderList, fileList } = data;
        for (let o of folderList) {
            if (!o.checked) {
                checkAll = false;
            } else {
                checkCount += 1;
            }
        }
        for (let o of fileList) {
            if (!o.checked) {
                checkAll = false;
            } else {
                checkCount += 1;
            }
        }

        if (fileList.length == 0 && folderList.length == 0) {
            checkAll = false;
        }
        return {
            ...state,
            data: {
                ...data,
                folderPath
            },
            checkAll,
            checkCount
        }

    }

    //进入下级目录
    enterFolderHandle(_id, _name) {
        let { folderPath } = this.props.netDeskFolderEnterReducer;
        if (_.findIndex(folderPath, { folderId: _id }) != -1) {
            return false;
        }
        this.props.netDeskFolderPathChange_action(true, folderPath, { folderName: _name, folderId: _id })
        this.flushDataInCurFolder();
    }

    //打开文件 跳转预览
    openFileHandle(sourceType, id) {
        let url = {
            to: 'q_replayVideo',
            with: ['teacher', id]
        }
        if (sourceType == 'video' || sourceType == "audio") {
            url.with.push(sourceType);
        } else if (sourceType == "other" || sourceType == "zip" || sourceType == "exe") {
            url.with.push('unable');
        } else if (sourceType == "pic") {
            url.with.push('pic');
        } else if (sourceType == "swf") {
            url.with.push('swf');
        } else {
            url.with.push('pdf');
        }

        goWith(url)
    }

    //全选按钮change
    onCheckAllChange(e) {
        let { folderList, fileList } = this.state.data;
        let checkAll = e.target.checked, checkCount;
        for (let y = 0; y < folderList.length; y++) {
            folderList[y].checked = checkAll;
        }
        for (let y = 0; y < fileList.length; y++) {
            fileList[y].checked = checkAll;
        }

        if (checkAll) {
            checkCount = folderList.length + fileList.length;
        } else {
            checkCount = 0;
        }
        this.setState({
            checkAll,
            checkCount,
            data: {
                folderList,
                fileList
            }
        })

        this.stateToRedux();

    }

    //单个的复选框change
    singleCheck(isfolder, id, e) {
        let { folderList, fileList } = this.state.data;
        let checkAll, checkCount;

        if (isfolder == 'folder') {
            let a = _.findIndex(this.state.data.folderList, { folderId: id });
            folderList[a].checked = e.target.checked;
        } else {
            let a = _.findIndex(this.state.data.fileList, { fileId: id });
            fileList[a].checked = e.target.checked;
        }

        //单条取消 则将全局checkAll置否
        if (!e.target.checked) {
            checkAll = false;
            checkCount = this.state.checkCount - 1;
        } else {
            checkAll = true;
            checkCount = this.state.checkCount + 1;
            let folderFalse = _.findIndex(this.state.data.folderList, { checked: false });
            let fileFalse = _.findIndex(this.state.data.fileList, { checked: false });
            if (folderFalse != -1 || fileFalse != -1) {
                checkAll = false
            }
        }
        this.setState({
            checkAll,
            checkCount,
            data: {
                folderList,
                fileList
            }
        })
        this.stateToRedux();

    }

    //单文件编辑
    singleEdit(type, id) {
        this.props.screenMaskOpen_action();
        let { fileList, folderList } = this.state.data;
        let eleName;
        if (type === "folder") {
            let i = _.findIndex(folderList, { folderId: id });
            if (i >= 0) {
                folderList[i].changeState = true;
                eleName = folderList[i].folderName;
                // ele = document.querySelectorAll('.lean-netdesk-datalist>ul>li')[i].querySelector('.lean-netdesk-chnameDOM>input');
                // ele.value = folderList[i].folderName;
                // console.log(ele)
            } else {
                return false;
            }
        } else if (type === "file") {
            let i = _.findIndex(fileList, { fileId: id });
            if (i >= 0) {
                fileList[i].changeState = true;
                eleName = fileList[i].fileName;
                // let _i = folderList.length + i;
                // ele = document.querySelectorAll('.lean-netdesk-datalist>ul>li')[_i].querySelector('.lean-netdesk-chnameDOM>input');
            } else {
                //id不存在？
                return false
            }
        } else {
            return false
        }
        this.setState({
            data: {
                folderList,
                fileList
            }
        }, () => {
            //体验优化 点击编辑按钮  input即选中
            let targetEle;
            if (type === "folder") {
                targetEle = document.
                    querySelectorAll('.lean-netdesk-datalist>ul>li')[_.findIndex(folderList, { folderId: id })].
                    querySelector('.lean-netdesk-chnameDOM>input');

            } else {
                targetEle = document.
                    querySelectorAll('.lean-netdesk-datalist>ul>li')[(folderList.length + _.findIndex(fileList, { fileId: id }))].
                    querySelector('.lean-netdesk-chnameDOM>input');
            }
            targetEle.focus();
            targetEle.value = eleName;
        })
    }

    //单文件编辑提交
    singleEditCommit(type, id) {
        let maxFileNameLength = 128;
        let reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        let { fileList, folderList } = this.state.data;
        let errorCallback = () => {
            message.warning('编辑失败！')
        }
        if (type === 'folder') {
            let i = _.findIndex(folderList, { folderId: id });
            if (i >= 0) {
                let ele = document.querySelectorAll('.lean-netdesk-datalist>ul>li')[i].querySelector('.lean-netdesk-chnameDOM>input');
                if (ele.value != '') {
                    if (reg.test(ele.value)) {
                        message.warning('无效的文件名！');
                        ele.focus();
                    } else if (ele.value.indexOf(' ') != -1) {
                        message.warning('不能包含空格！');
                        ele.focus();
                    } else if (ele.value.length >= maxFileNameLength) {
                        message.warning('文件名超长！');
                        ele.focus();
                    } else {
                        //文件名合法的后续操作
                        folderList[i].changeState = false;
                        folderList[i].folderName = ele.value;
                        if (folderList[i].istmpFolder) {
                            //新建文件夹的提交操作
                            let { folderPath } = this.props.netDeskFolderEnterReducer;
                            let folderId = folderPath[folderPath.length - 1].folderId,
                                folderName = folderList[i].folderName,
                                level = (folderPath.length - 1) >= 0 ? folderPath.length - 1 : 0,
                                formatId = this.props.netDeskFliterStateReducer.curType;
                            this.props.netDeskCreateFolder_action({ folderId, folderName, level, formatId }, this.flushDataInCurFolder.bind(this));
                            // this.flushDataInCurFolder();
                        } else {
                            //修改文件夹
                            let pr = {
                                folderId: id,
                                folderName: ele.value
                            }
                            this.props.netDeskChangeFolderName_action(pr, errorCallback)
                        }
                        this.props.screenMaskClose_action();
                    }
                } else {
                    message.warning('请输入文件夹名')
                    ele.focus();
                }
            } else {
                //id不存在?
            }
        } else if (type === 'file') {
            let i = _.findIndex(fileList, { fileId: id });
            if (i >= 0) {
                let _i = i + folderList.length;
                let ele = document.querySelectorAll('.lean-netdesk-datalist>ul>li')[_i].querySelector('.lean-netdesk-chnameDOM>input');
                if (ele.value != '') {
                    if (reg.test(ele.value)) {
                        message.warning('无效的文件名！');
                        ele.focus();
                    } else if (ele.value.indexOf(' ') != -1) {
                        message.warning('不能包含空格！');
                        ele.focus();
                    } else if (ele.value.length >= maxFileNameLength) {
                        message.warning('文件名超长！');
                        ele.focus();
                    } else {
                        //文件名合法的后续操作
                        fileList[i].changeState = false;
                        fileList[i].fileName = ele.value;
                        this.props.screenMaskClose_action();
                        this.props.netDeskChangeFileName_action({
                            resourceId: id,
                            resName: ele.value
                        }, () => {
                            message.warning('修改文件名失败')
                        }, () => {
                            this.flushDataInCurFolder()
                        })
                    }
                } else {
                    message.warning('请输入文件名')
                    ele.focus();
                }
            } else {
                //id不存在?
            }
        } else {
            return false
        }
        this.setState({
            checkAll: false
        })
        this.stateToRedux();
    }

    //单文件编辑取消
    singleEditCancle(type, id) {
        let { fileList, folderList } = this.state.data;
        if (type === 'folder') {
            let i = _.findIndex(folderList, { folderId: id });
            if (i >= 0) {
                if (folderList[0].istmpFolder) {
                    //第一项有可能是新建文件夹的取消操作
                    folderList.shift();
                } else {
                    folderList[i].changeState = false;
                }
            } else {
                //id不存在?
            }
        } else if (type === 'file') {
            let i = _.findIndex(fileList, { fileId: id });
            if (i >= 0) {
                fileList[i].changeState = false;
            } else {
                //id不存在?
            }
        }

        this.setState({
            data: {
                fileList,
                folderList
            }
        })

        this.props.screenMaskClose_action();
        this.stateToRedux();
    }

    //单文件下载
    singleFileDownload(item) {
        // console.log(item);
        let params = {
            resourceId: item.fileId,
            resName: item.fileName,
            resSize: item.fileSize,
            resFormat: item.resFormat,
            definition: 'un',
        };
        this.props.handleModalShow(true, params);
    }

    //单文件夹的下载
    singleFolderDownload() {
        message.warning('不支持文件夹的下载');
        return false;
    }

    //单文件删除
    singleDelete(type, id) {
        let deleteErrorCallback = (s) => {
            if (s === -1) {
                message.warning('本文件已被关联，不能删除!')
            } else if (s === 0) {
                message.success('有部分文件被关联，未能删除已关联文件！')
                this.flushDataInCurFolder();
            } else {
                message.warning('已关联文件不能被删除！')
            }
        }
        let deleteSuccessCallback = () => {
            message.success('删除成功！');
            this.flushDataInCurFolder();
        }
        let pr, level = this.props.netDeskFolderEnterReducer.folderPath.length - 1;
        if (type == 'folder') {
            pr = {
                folderList: [
                    {
                        folderId: id
                    }
                ],
                resourceList: [],
                level
            }
        } else {
            pr = {
                folderList: [],
                resourceList: [
                    {
                        resourceId: id
                    }
                ],
                level
            }
        }
        let _this = this;
        confirm({
            title: `您确认删除此${type == 'folder' ? "文件夹" : "文件"}吗?`,
            content: '请注意，此操作不可逆！',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.props.cloudDiskRemoveFolder_action(pr, deleteErrorCallback, deleteSuccessCallback);
            },
            onCancel() {
                return false;
            }
        })
    }

    //修改后的数据往redux提交  数据非最新
    stateToRedux() {
        let data = this.state.data;
        this.props.netDesk_flush_aciton(data);
    }

    //文件夹层级回退
    pathBackHandle() {
        // console.log(this.props);
        let { folderPath } = this.props.netDeskFolderEnterReducer;
        if (folderPath.length === 1) {
            message.warning('无上一级文件夹');
        } else {
            this.props.netDeskFolderPathChange_action(false, folderPath);
            this.flushDataInCurFolder()
        }
    }

    //更新数据 取当前目录结构最新数据
    flushDataInCurFolder() {
        // console.log('执行刷新操作')
        let folderId = this.props.netDeskFolderEnterReducer.folderPath[(this.props.netDeskFolderEnterReducer.folderPath.length - 1)].folderId;
        let formatId = this.props.netDeskFliterStateReducer.curType;
        // console.log('点击后拿到的目录结构数组是：', this.props.netDeskFolderEnterReducer.folderPath);
        this.props.netDesk_flush_aciton(null, folderId, formatId);
    }


    //面包屑导航点击事件
    BreadcrumbClickHandle(target) {
        let newFolderPath = [];
        if (target.folderId == 0) {
            newFolderPath = [target]
        } else {
            let { folderPath } = this.props.netDeskFolderEnterReducer;
            let index = _.findIndex(folderPath, { folderId: target.folderId });
            for (let i = 0; i <= index; i++) {
                newFolderPath.push(folderPath[i])
            }
        }
        this.props.netDeskBreadcrumbPathChange_action(newFolderPath);
        let formatId = this.props.netDeskFliterStateReducer.curType;
        this.props.netDesk_flush_aciton(null, target.folderId, formatId);
    }

    render() {
        let data = [this.state.data.folderList, this.state.data.fileList];
        if (!!!data) {
            return false;
        }
        let _this = this;
        let folderPath = this.props.netDeskFolderEnterReducer.folderPath || [];
        let Breadcrumb = <span style={{ fontSize: `${folderPath.length >= 4 ? "13px" : ""}` }}>
            <span onClick={_this.BreadcrumbClickHandle.bind(_this, { folderName: '/', folderId: G.userInfo.user.userId })}>我的云盘 /</span>
            {
                folderPath.length <= 4
                    ?
                    <span>
                        {folderPath.map((item, index) => {
                            if (index == 0) {
                                return false
                            } else {
                                return (
                                    <span key={index} onClick={this.BreadcrumbClickHandle.bind(this, item)}>&nbsp;{item.folderName.sliceWords(8)} /</span>
                                )
                            }
                        })}
                    </span>
                    :
                    <span >
                        <span onClick={this.BreadcrumbClickHandle.bind(this, folderPath[1])}>
                            &nbsp;{folderPath[1].folderName.sliceWords(8)} /
                        </span>
                        <span>&nbsp;...&nbsp;/</span>
                        <span onClick={this.BreadcrumbClickHandle.bind(this, folderPath[folderPath.length - 2])}>
                            &nbsp;{folderPath[folderPath.length - 2].folderName.sliceWords(8)} /
                        </span>
                        <span onClick={this.BreadcrumbClickHandle.bind(this, folderPath[folderPath.length - 1])}>
                            &nbsp;{folderPath[folderPath.length - 1].folderName.sliceWords(8)} /
                        </span>
                    </span>
            }
        </span>

        return (
            <div className="lean-netdesk-content">
                <div className="lean-netdesk-innerHead">
                    <span onClick={this.pathBackHandle.bind(this)} className="lean-netdesk-backlast">返回上一级</span>
                    <span>|</span>
                    <span className="lean-netdesk-curlocal">当前位置：{Breadcrumb}</span>
                    <div>
                        {data[0].length}个文件夹，{data[1].length}个文件，已加载完毕
          </div>
                </div>
                <div className="lean-netdesk-innerTitle">
                    <Checkbox onChange={this.onCheckAllChange.bind(this)} checked={this.state.checkAll} />
                    <span className="lean-netdest-choosedClo">已选择{this.state.checkCount}个资源</span>
                    <span className="lean-netdesk-filesizeClo">大小</span>
                    <span className="lean-netdesk-updateTimeClo">上传日期&nbsp;↓</span>
                </div>
                <div className="lean-netdesk-datalist">
                    <ul>
                        {/**文件夹的渲染 */
                            data[0].map((item, index) => {
                                let _props = {
                                    className: "lean-netdesk-innerDatalist",
                                    key: index,
                                    type: "folder",
                                    sourcename: item.folderName,
                                    sourceid: item.folderId
                                }
                                return (
                                    <li {..._props}>
                                        <Checkbox onChange={this.singleCheck.bind(this, 'folder', item.folderId)} checked={item.checked} />
                                        <span className="lean-netdesk-datalistLeft">
                                            <img src={Folder} />
                                            <span title={item.folderName}
                                                onClick={this
                                                    .enterFolderHandle
                                                    .bind(this, item.folderId, item.folderName)}>
                                                {item.folderName.sliceWords(16)}
                                            </span>
                                            <span className="lean-netdesk-datalistLeft-btnCon">
                                                <Tooltip title="重命名" placement="bottom">
                                                    <span>
                                                        <SVG type="edit" onClick={this.singleEdit.bind(this, 'folder', item.folderId)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="下载" placement="bottom">
                                                    <span>
                                                        <SVG type="download" onClick={this.singleFolderDownload.bind(this)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="删除" placement="bottom">
                                                    <span>
                                                        <SVG type="delete" onClick={this.singleDelete.bind(this, 'folder', item.folderId)} />
                                                    </span>
                                                </Tooltip>
                                            </span>
                                            {
                                                item.changeState
                                                    ?
                                                    <div className="lean-netdesk-chnameDOM">
                                                        <input type='text' placeholder="请输入文件名" maxLength='128' />
                                                        <span>
                                                            <SVG type="ok" onClick={this.singleEditCommit.bind(this, 'folder', item.folderId)} />
                                                        </span>
                                                        <span>
                                                            <SVG type="cancel" onClick={this.singleEditCancle.bind(this, 'folder', item.folderId)} />
                                                        </span>
                                                    </div>
                                                    :
                                                    ""
                                            }
                                        </span>
                                        <span className="lean-netdesk-datalistSize">
                                            --
                                        </span>
                                        <span className="lean-netdesk-datalistUptime">
                                            {/* {new Date(item.updateTime).toLocaleString()} */}
                                        </span>
                                    </li>
                                )
                            })
                        }
                        {/**文件的渲染 */
                            data[1].map((item, index) => {
                                let _props = {
                                    className: "lean-netdesk-innerDatalist",
                                    key: index,
                                    type: "file",
                                    sourcename: item.fileName,
                                    sourceid: item.fileId
                                },
                                    filePic;
                                item.fileType = item
                                    .fileType
                                    .toLowerCase();
                                switch (item.fileType) {
                                    case "other":
                                        {
                                            filePic = Other;
                                            break;
                                        }
                                    case "word":
                                        {
                                            filePic = Word;
                                            break;
                                        }
                                    case "zip":
                                        {
                                            filePic = Zip;
                                            break;
                                        }
                                    case "txt":
                                        {
                                            filePic = Txt;
                                            break;
                                        }
                                    case "swf":
                                        {
                                            filePic = Swf;
                                            break;
                                        }
                                    case "ppt":
                                        {
                                            filePic = Ppt;
                                            break;
                                        }
                                    case "pdf":
                                        {
                                            filePic = Pdf;
                                            break;
                                        }
                                    case "video":
                                        {
                                            filePic = Video;
                                            break;
                                        }
                                    case "audio":
                                        {
                                            filePic = Audio;
                                            break;
                                        }
                                    case "pic":
                                        {
                                            filePic = Pic;
                                            break;
                                        }
                                    case "exlce":
                                        {
                                            filePic = Excel;
                                            break;
                                        }
                                    default:
                                        {
                                            filePic = Other;
                                        }
                                }
                                return (
                                    <li {..._props}>
                                        <Checkbox onChange={this.singleCheck.bind(this, 'file', item.fileId)} checked={item.checked} />
                                        <span className="lean-netdesk-datalistLeft">
                                            <img src={filePic} />
                                            <span title={item.fileName}
                                                onClick={this
                                                    .openFileHandle
                                                    .bind(this, item.fileType, item.fileId)}>
                                                {
                                                    item.fileName.sliceWords(20)
                                                }
                                            </span>
                                            <span className="lean-netdesk-datalistLeft-btnCon">
                                                <Tooltip title="重命名" placement="bottom">
                                                    <span>
                                                        <SVG type="edit" onClick={this.singleEdit.bind(this, 'file', item.fileId)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="下载" placement="bottom">
                                                    <span>
                                                        <SVG type="download" onClick={this.singleFileDownload.bind(this, item)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="删除" placement="bottom">
                                                    <span>
                                                        <SVG type="delete" onClick={this.singleDelete.bind(this, 'file', item.fileId)} />
                                                    </span>
                                                </Tooltip>
                                            </span>
                                            {
                                                item.changeState
                                                    ?
                                                    <div className="lean-netdesk-chnameDOM">
                                                        <input type='text' placeholder="请输入文件名" />
                                                        <span>
                                                            <SVG type="ok" onClick={this.singleEditCommit.bind(this, 'file', item.fileId)} />
                                                        </span>
                                                        <span>
                                                            <SVG type="cancel" onClick={this.singleEditCancle.bind(this, 'file', item.fileId)} />
                                                        </span>
                                                    </div>
                                                    :
                                                    ""
                                            }
                                        </span>
                                        <span className="lean-netdesk-datalistSize">
                                            {item.fileSize}
                                        </span>
                                        <span className="lean-netdesk-datalistUptime">
                                            {item.updateTime}
                                        </span>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

//右边👉隐藏抽屉组件
class Drawerline extends React.Component {
    constructor(props) {
        super(props)
        let currentUpload = this.props.screenDrawerDataReducer.data ? this.props.screenDrawerDataReducer.data : [];
        this.state = {
            isShow: false,
            currentUpload
        }
        // this.props.uploadTimeline_action(true);
        this.props.screenDrawerData_action(currentUpload);
        // console.log('初始化的时候，抽屉里是否有东西', currentUpload)
    }
    static getDerivedStateFromProps(props, state) {
        // console.log(props.screenDrawerDataReducer);
        if (props.uploadTimelineReducer && props.screenDrawerDataReducer.data) {
            return {
                ...state,
                isShow: props.uploadTimelineReducer.isShow,
                currentUpload: props.screenDrawerDataReducer.data,
            }
        } else {
            return false
        }
    }
    openHandle() {
        this.props.uploadTimeline_action(true)
    }
    closeHandle() {
        this.props.uploadTimeline_action(false)
    }
    render() {
        // console.log(this.state.currentUpload)
        return (
            <div id="lean-uploadDrawer">
                <Drawer
                    title="上传中文件"
                    placement="right"
                    closable={true}
                    width={450}
                    closable={false}
                    onClose={this.closeHandle.bind(this)}
                    visible={this.state.isShow}>
                    <ul className="lean-uploadDrawer-fileState">
                        {this.state.currentUpload.map((item, index) => {
                            let progress = item.progress;
                            let color = '#1ec880';
                            if (item.state === 1) {
                                color = "#ecbdbe"
                            }
                            let progressStyle = {
                                display: "inline-block",
                                width: `${progress}%`,
                                color: color,
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                height: '1px',
                                boxShadow: `0 0 6px 1px ${color}`
                            }
                            return <li key={index} className={`lean-uploadDrawer-fileStateList-${item.state}`}>
                                <span>
                                    {item.name.sliceWords(12)}
                                </span>
                                <span>
                                    {(item.size / 1024).formatSize()}
                                    {/* {item.size} */}
                                </span>
                                <SVG type={item.state == 0 ? "ok" : item.state == 1 ? "cancel" : ""} />
                                <span >
                                    {item.state == -1 ? "上传中" : item.state == 0 ? "已完成" : "上传异常"}
                                </span>
                                <span style={progressStyle}></span>
                            </li>
                        })}
                    </ul>
                </Drawer>
            </div>
        )
    }
}


@connect(state => state, { ...actions })
export default class B_TeaCherNetDisk extends React.Component {
    constructor(props) {
        super(props);
        props.netDesk_flush_aciton(null, G.userInfo.user.userId, 0);
        this.state = {}
    }
    static getDerivedStateFromProps(props, state) {
        if (props.netDeskReducer.data) {
            return {
                ...state,
                data: props.netDeskReducer.data
            }
        } else {
            return false;
        }
    }

    render() {
        let data;
        if (this.state.data === undefined) {
            return false
        } else {
            data = this.state.data
        }
        return (
            <div>
                <TeacherNav />
                <Headnav {...this.props} />
                <div className="lean-netdesk-contentContainer">
                    <Fliter {...this.props} />
                    <Content data={data} {...this.props} />

                </div>
                <Drawerline {...this.props} />
                <Footer /> {/*非实际组件*/}
                <ScreenMask {...this.props} />
                <Upload {...this.props} />
                <DownloadFile
                    isShow={this.props.downloadReducer.isShow}
                    closeModal={() => { this.props.handleModalShow(false); }}
                    params={this.props.downloadReducer.params} />
            </div>
        )
    }
}