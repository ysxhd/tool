/*
 * @Author: lean 
 * @Date: 2018-01-09 10:09:23 
 * @Last Modified time: 2018-03-28 15:52:54
 * @Last Modified by: zhangning
 */

import React from "react";
import { Checkbox, Select, Input, Spin, Modal, message } from 'antd';
import '../../css/admin/myCloud.css';
import Request from "../../js/_x/util/request.js";
import NumberCtr from "../../js/_x/util/number.js";
import DateCtr from "../../js/_x/util/date.js";
import Session from "../../js/_x/util/session.js";
import { SVG } from "../base";
import UploadKMS from "../shared/cloudUpload";
import Mask from '../shared/maskLayer';
import noData from '../../img/noData.png';
import {success,error,confirmDia} from './index.js';

const Option = Select.Option,
  Search = Input.Search,
  Confirm = Modal.confirm;

const _ajax = Request.formRequest,
  formatSize = NumberCtr.formatSize;


export default class extends React.Component {
  constructor(props) {
    super(props);
    let _this = this;
    //stateControl
    // let userid = session.getSession(asdadadad)
    {
      this.state = {
        // userid:userid,
        pathNameList: ['我的云盘'],
        pathIdList: ["0"],
        checkAll: false,
        fileList: [],
        selectList: [],
        thisResType: "all",
        loading: true,
        fetchFileListError: false,
        thisNum:0,
        selectStyle: {
          width: 140,
          height: 30,
          float: "right",
          marginRight: 20
        },
        searchBoxStyle: {
          width: 300,
          float: "right"
        },
        changeNameBoxTipsTxt: "请输入文件名"
      }
    }

  }

 
  isSwitch = (some) =>{
    
  }
  componentWillMount() {
      let _this = this;
    //select list data fetch
    {
      let pr = {
        action: "api/web/information/resources/get_res_format"
      };
      _ajax(pr, (res) => {
        if (res.code == 200 && res.message == "操作成功") {
          let data = JSON.parse(res.data);
          _this.setState({
            selectList: data
          })
        }
      })
    }
    //fetchFileList and render content
    {
      this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
    }
    //initial set breadpath id
    {
      Session.setSession('curFolderId', 0);
    }
  }
  fetchFileList(folderId, resType) {
    let userId = sessionStorage.getItem('userId');
    let _this = this;
    let data = {
      folderId: folderId,
      resFormatId: resType,
      userId: userId
    }
    let pr = {
      action: "api/web/information/resources/get_folder_res",
      data: data
    };
    _ajax(pr, (res) => {
      if (res.code == 200) {
     
        let data = res.data,
          filelist = data.fetchFileList,
          folderlist = data.fetchFolderList,
          stateFilelist = [],
          stateFolderList = [];

        for (let o of filelist) {
          let time = new Date(o.lastUpdateTime),
            timer = DateCtr.format(time),
            tmp = {
              isFolder: false,
              fileName: o.resName,
              fileType: o.fileType.toUpperCase(),
              fileUpdater: Session.getSession("uname") || "未知",
              fileSize: o.resSize == 0 ? "0KB" : formatSize(o.resSize, "b"),
              fileId: o.resId,
              storageId: o.storageId,
              downloadUrl: o.downloadUrl,
              createTime: timer
            };
          stateFilelist.push(tmp)
        }
        for (let o of folderlist) {
          let time = new Date(o.createtime),
            timer = DateCtr.format(time),
            tmp = {
              isFolder: true,
              fileName: o.folderName,
              fileType: "文件夹",
              fileUpdater: Session.getSession("uname") || "未知",
              fileSize: "---",
              fileId: o.uid,
              storageId: o.uid,
              downloadUrl: o.downloadUrl,
              createTime: timer
            };
          stateFolderList.push(tmp);
        }
        _this.setState({
          loading: false,
          fileList: stateFolderList.concat(stateFilelist),
        })
        
      } else {
        _this.setState({
          loading: false,
          fetchFileListError: true
        })
      }
    })
  }
  checkAllToggle() {
    //全选按钮切换事件
    this.setState({
      checkAll: !this.state.checkAll
    }, () => {
      let allCheckbox = document.querySelectorAll('.lean-myCloud-checkAllBox');
      if (this.state.checkAll) {
        for (let i = 0; i < allCheckbox.length; i++) {
          allCheckbox[i].className = "lean-myCloud-checkAllBox lean-myCloud-checkAllBox-true";
        }
      } else {
        for (let i = 0; i < allCheckbox.length; i++) {
          allCheckbox[i].className = "lean-myCloud-checkAllBox lean-myCloud-checkAllBox-false";
        }
      }
    })
  }
  singlecheckboxClick(index, e) {
    let et = e.target,
      thisSpan,
      etName = et.nodeName.toLowerCase();
    if (etName == "use") {
      thisSpan = et.parentNode.parentNode;
    } else if (etName == "svg") {
      thisSpan = et.parentNode
    } else if (etName == "span") {
      thisSpan = et;
    } else {
      return false;
    }
    if (thisSpan.className.indexOf('true') == -1) {
      thisSpan.className = 'lean-myCloud-checkAllBox lean-myCloud-checkAllBox-true';
    } else {
      thisSpan.className = 'lean-myCloud-checkAllBox lean-myCloud-checkAllBox-false';
    }
    let a = document.querySelectorAll('.lean-myCloud-fileList .lean-myCloud-checkAllBox').length,//全部checkbox
      b = document.querySelectorAll('.lean-myCloud-fileList .lean-myCloud-checkAllBox-true').length;//已选checkbox
    if (a > b) {
      this.setState({
        checkAll: false
      })
    } else {
      this.setState({
        checkAll: true
      })
    }

  }
  selectChange(value) {
    //下拉选项框事件
    this.setState({
      thisResType: value
    }, () => {
      this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
    })
  }
  searchBoxSearch(value) {
    //搜索框事件
  }
  breadcrumbClick(folderId) {
    //面包屑导航点击事件
    Session.setSession('curFolderId', folderId);
    let pathIdList = this.state.pathIdList,
      pathNameList = this.state.pathNameList;

    for (let i = pathIdList.length - 1; i > pathIdList.indexOf(folderId); i--) {
      pathIdList.pop();
      pathNameList.pop();
    }

    this.setState({
      loading: true,
      pathIdList: pathIdList,
      pathNameList: pathNameList
    }, () => {
      this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType)
    })

  }
  downBtnClick(index, url) {
    //单个下载按钮点击事件
    if (this.state.fileList[index].isFolder) {
      this.messageTips("不能直接下载文件夹，请下载文件！");
    }else{
      window.open(url);
    }
  }
  deleteBtnClick(index, e) {
    // e.stopPropagation();
    const E=e.target
    //单个删除按钮点击事件
  
    let fileName = this.state.fileList[index].fileName,
      isFolder = this.state.fileList[index].isFolder,
      fileId = this.state.fileList[index].fileId,
      _this = this,
      thisLi,
      thisSpan,
      thisElement = e.target.nodeName.toLowerCase();

    if (thisElement == "span") {
      thisSpan = E;
    } else if (thisElement == "svg") {
      thisSpan = E.parentNode;
    } else if (thisElement == "use") {
      thisSpan = E.parentNode.parentNode;
    } else {
      return false;
    }
    
    thisLi = thisSpan.parentNode.parentNode;

    confirmDia({
      title: `确定删除 "${fileName}" 吗?`,
      content: `点击确定后将会删除该文件！`,
      className: 0,
      okText: "删除",
      fnOK: function () {
        let userId = sessionStorage.getItem('userId');
        let pr = {
          action: "api/web/information/resources/delete",
          data: {
            folderIdList: [],
            fileIdList: [],
            userId: userId
          }
        };
        if (isFolder) {
          pr.data.folderIdList.push({ folderId: fileId });
        } else {
          pr.data.fileIdList.push({ fileId: fileId });
        }

        _ajax(pr, (res) => {
            
          if (res.code == 200) {
            
            let filelist = _this.state.fileList;
            // filelist.splice(index, 1);
            
            //单个删除之前先将checkbox置为空；
            thisLi.querySelector('.lean-myCloud-checkAllBox').className = 'lean-myCloud-checkAllBox lean-myCloud-checkAllBox-false';
            // window.location.reload();
            _this.setState({
              loading:true
            },()=>{
              _this.fetchFileList(_this.state.pathIdList[_this.state.pathIdList.length - 1], _this.state.thisResType); 
            })
            
         
          } else {
            window.setTimeout(() => {
              alert(`err:${res.code}:\n${res.message}`);
            }, 300);
          }
        })
      },
      fnCancel() {

      },
    })

  }
  batchDeleteBtnClick() {
    //批量删除按钮点击事件
    let choiceArr = [],
      _this = this,
      filelist = this.state.fileList,
      allCheckbox = document.querySelectorAll('.lean-myCloud-contentBox .lean-myCloud-checkAllBox'),
      fileList = document.querySelectorAll('.lean-myCloud-fileList'),
      allNoCheckbox=document.querySelectorAll('lean-myCloud-checkAllBox-false');
      
    if (allCheckbox.length == 0) {
      return false;
    }
    for (var i = 0; i < allCheckbox.length; i++) {
      if (allCheckbox[i].className.indexOf("false") > -1) {
        continue;
      } else {
        choiceArr.push(i);
      }
    }
    let userId = sessionStorage.getItem('userId');
    let pr = {
      action: "api/web/information/resources/delete",
      data: {
        folderIdList: [],
        fileIdList: [],
        userId:userId
      }
    }
    if(choiceArr.length == 0){
      error('请选择要删除的数据',1500);
    }else{
      Confirm({
        title: "确定删除这些项吗?",
        content: "点击确定按钮将进行删除！",
        onOk() {
          for (let j = 0; j < choiceArr.length; j++) {
            window.setTimeout(() => {
              fileList[choiceArr[j]].style.cssText = "left:4100px;height:0;opacity:0;border:0;margin-top:0px;";
            }, j * 120);
            let needDelete = filelist[choiceArr[j]];
            {
              needDelete.isFolder == true
                ?
                pr.data.folderIdList.push({ folderId: needDelete.fileId })
                :
                pr.data.fileIdList.push({ fileId: needDelete.fileId })
            }
          }
          _this.setState({
            loading: true,
            checkAll: false
          }, () => {
            _ajax(pr, (res) => {
              if (res.code == 200) {
                _this.fetchFileList(_this.state.pathIdList[_this.state.pathIdList.length - 1], _this.state.thisResType);
              } else {
                _this.fetchFileList(_this.state.pathIdList[_this.state.pathIdList.length - 1], _this.state.thisResType);
              }
            })
          })
        }
        ,
        onCancel() {
          return false;
        }
      })

  }
  }
  createFolderBtnClick(e) {
    
    //创建文件夹按钮点击事件
    let E = e,_this = this;

    let allLi = document.getElementsByClassName('lean-myCloud-fileList');
      for(var i = 0;i<allLi.length;i++){
        if(allLi[i].className.indexOf("del")==-1){
          _this.setState({
            thisNum:i
          })
          break;
        }
    }
    if (this.state.loading || this.state.fetchFileListError) {
      return false;
    } else {
      this.setState({
        loading: true
      }, () => {
        // this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
      })
    }

    let filelist = this.state.fileList,
      newFloder = {
        isFolder: true,
        isNewCreate: true,
        fileName: "newFolerDefaultName",
        fileType: "文件夹",
        fileUpdater: Session.getSession('username') || "未知",
        fileSize: "---",
        createTime: new Date().getTime()
      };
    filelist.unshift(newFloder);
      this.setState({
        fileList: filelist,
        loading: false
      }, () => {
   
        //调用修改文件名函数：
        // this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
        this.changeFileNameClick(0, E);
        // this.refs["lean-myCloud-mask"].show();
        // let aaaa = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox');
        // let inputBox = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox')[0];
        // inputBox.style.display = "inline-block";
        // inputBox.querySelector('input').focus();
        // inputBox.querySelector('input').value = "";
      });


    
  }
  changeFileNameClick(index, e) {
    e.stopPropagation();
    //更改文件名按钮点击事件
    this.refs["lean-myCloud-mask"].show();
    let inputBox = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox')[index];
    inputBox.style.display = "inline-block";
    inputBox.querySelector('input').focus();
    inputBox.querySelector('input').value = "";
  }
  changeFileNameCommitClick(index, e) {
   
    //修改文件名确定按钮
    //ajax提交数据
    let inputBox = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox')[index],
      fileNameValue = inputBox.querySelector('input').value,
      fileList = this.state.fileList,_this=this;
      var reg = /^[^\\/:*?"<>|]*$/; 
    if(!reg.test(fileNameValue)){
      error('文件夹不能包含下列任何字符: \\ / : * ? " < > |',1500)
    }else if(fileNameValue.length >= 125){
      error('输入的名称过长，请重新输入',1500);
    }else{
      
      let fileNameRegexCheck = false;//文件名正则判断
      if (fileNameValue.length == 0 || fileNameRegexCheck) {
        inputBox.querySelector('input').focus();
        // this.setState({
        //   changeNameBoxTipsTxt: "文件名错误，请重新输入!"
        // })
        error('文件名不能为空，请重新输入!',1500)
        return false;
      }else{
        fileList[index].fileName = fileNameValue;
        let changeNameBox = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox')[index];
        this.refs["lean-myCloud-mask"].close();
        changeNameBox.style.display = "none";
        this.setState({
          loading: true,
          changeNameBoxTipsTxt: "请输入文件名"
          // fileList: fileList
        }, () => {
          let userId = sessionStorage.getItem('userId');
          if ( fileList[0].isNewCreate) {
            //新建文件夹 
            let data = {
              folderParentId: this.state.pathIdList[this.state.pathIdList.length - 1],
              folderName: this.state.fileList[index].fileName,
              folderType: 1,
              userId: userId
            };
            let pr = {
              action: "api/web/information/resources/create_folder",
              data: data
            };
            _ajax(pr, (res) => {
              if (res.code == 200) {
                this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
            
              } else if (res.code == 500) {
                this.messageError(`操作失败,原因:${res.message}`);
                this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
              }
            })
          } else {
            let pr = {};
            if (this.state.fileList[index].isFolder) {
              //普通文件夹改名
              pr.action = "api/web/information/resources/edit_folder";
              pr.data = {
                folderId: this.state.fileList[index].fileId,
                folderName: this.state.fileList[index].fileName,
              }
            } else {
              pr.action = "api/web/information/resources/edit_file";
              pr.data = {
                userId: userId,
                modifyName: this.state.fileList[index].fileName,
                resourceId: this.state.fileList[index].fileId,
                folderId: this.state.pathIdList[this.state.pathIdList.length - 1]
              }
            }
            _ajax(pr, (res) => {
              if (res.code == 200) {
                this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
              } else if (res.code == 500) {
                this.messageError(`操作失败,原因:${res.message}`);
                this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
              } else {
                return false
              }
            })
        }
      })
      }

    }
    
  }
  changeFileNameCancleClick(index, e) {
    //修改文件名取消按钮
    let changeNameBox = document.querySelectorAll('.lean-myCloud-filelist-changeNameOutBox')[index];
    this.refs["lean-myCloud-mask"].close();
    changeNameBox.style.display = "none";

    let _fileList = this.state.fileList;

    if (_fileList[0].isNewCreate) {
      _fileList.shift();
    }
    this.setState({
      loading: false,
      fileList: _fileList
    }, () => {
    })
  }
  listClickControl(isForder, fileType, fileId, fileName, fileUrl, e) {
    e.stopPropagation();
    let _this = this;
    if (isForder) {
      let pathNameList = this.state.pathNameList,
        pathIdList = this.state.pathIdList;

      pathNameList.push(fileName);
      pathIdList.push(fileId);
      this.setState({
        loading: true,
        pathIdList: pathIdList,
        pathNameList: pathNameList
      }, () => {
        this.fetchFileList(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
      })

    } else {
      if (fileType.toLowerCase() != "jpg" && fileType.toLowerCase() != "png" && fileType.toLowerCase() != "gif" && fileType.toLowerCase() != "jpeg") {
        this.messageTips('此文件不支持在线浏览，请下载到本地浏览！');
      } else {
        //open picture
        this.refs["lean-myCloud-mask"].show();
        let div = document.createElement('div');
        div.id = "lean-file-imgshow";
        div.style.cssText = "position:fixed;max-height:50%;max-width:50%;top:50%;left:50%;transform:translate(-50%,-50%);z-index:999;";
        div.innerHTML = `
          <img alt= "打开图像失败" style="width:100%;height:100%;max-width:694px;max-height:504px;" src=${fileUrl} onerror="showPicErr.bind(this)"/>
          <span id="lean-file-imgclose-btn" style="display:block;z-index:1000;color:#fff;cursor:pointer;position:absolute;border-radius:50%;background:rgba(0,0,0,.4);width:30px;height:30px;font-size:40px;font-weight:100;line-height:26px;top:-15px;right:-15px;text-align:center;">&times;</span>
          `;
        document.body.appendChild(div);
        document.querySelector('#lean-file-imgclose-btn').addEventListener('click', () => {
          _this.refs["lean-myCloud-mask"].close();
          document.body.removeChild(document.querySelector('#lean-file-imgshow'));
        }, false);
      }
    }

  }
  messageError(text) {
    message.error(text, 3);
  }
  messageTips(text) {
    message.info(text, 3);
  }
  //file upload 
  updateFileBtnClick() {
    //上传文件按钮点击事件 
    this.sendChooseFileMsg();
  }
  sendChooseFileMsg() {
    // this.refs["uploadKMS"].createHashIframe("ad", true);
    // this.refs["uploadKMS"].fileSelect("ad");
    this.refs["uploadKMS"].fileSelect();
  }
  componentDidMount() {
    {
      //remove last &gt;
      let lastBreadcrumb = document.querySelector('.lean-myCloud-breadcrumb>span:last-child');
      // lastBreadcrumb.removeChild(lastBreadcrumb.querySelector('i'));
    }
    {
      //show picture error  
      let showPicErr = (img) => {
        img.src = noData;
        img.onerror = null;
      };
      window.showPicErr = showPicErr;

    }
  }
  render() {
    let _this = this;
    return (
      <div className="lean-myCloud-container">
        <div className="lean-myCloud-headTitle user-no-select">
          <span
            onClick={this.checkAllToggle.bind(this)}
            className={this.state.checkAll ? "lean-myCloud-checkAllBox-true" : "lean-myCloud-checkAllBox-false"}
            style={{ cursor: "pointer" }}>
            <SVG type="checked" ></SVG>
            &nbsp;&nbsp;全选
          </span>
          <button onClick={this.batchDeleteBtnClick.bind(this)}>批量删除</button>
          <button onClick={this.createFolderBtnClick.bind(this)}>新建文件夹</button>
          <button onClick={this.updateFileBtnClick.bind(this)}>上传资源</button>
          {/*<Search placeholder="资源名称" enterButton="搜索" onSearch={this.searchBoxSearch} style={this.state.searchBoxStyle} />*/}
          <Select style={this.state.selectStyle} defaultValue={"all"} onChange={this.selectChange.bind(this)}>
            <Option value="all">全部格式</Option>
            {this.state.selectList.map((item, index) => {
              return (
                <Option key={index} value={item.uid}>{item.formatName}</Option>
              )
            })}
          </Select>
        </div>
        <div className="lean-myCloud-breadcrumb user-no-select">
          当前路径：
            {
            _this.state.pathNameList.map((item, index) => {
              return <span key={index} className = 'hj-myCloud-item'>
                <span onClick={_this.breadcrumbClick.bind(_this, _this.state.pathIdList[index])} className='lean-myCloud-breadcrumb-item' data-id={_this.state.pathIdList[index]}>{item}</span>
                <i>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</i>
              </span>
            })
          }
        </div>
        <div className="lean-myCloud-contentBox" >
          {
            this.state.loading
              ?
              /*网络延迟，加载数据动画*/
              <div className="lean-myCloud-loadingWaiting-content">
                <Spin spinning={true} size="large" />
              </div>
              :
              this.state.fetchFileListError
                ?
                <div className="lean-myCloud-loadEnding-noData">
                  <img src={noData} />
                  <br />
                  <p>数据加载失败，请稍后再刷新试试...</p>
                </div>
                :
                <ul>
                  {
                    _this.state.fileList.length == 0
                      ?
                      <div className="lean-myCloud-loadEnding-noData">
                        <img src={noData} />
                        <br />
                        <p>暂无数据</p>
                      </div>
                      :
                      _this.state.fileList.map((item, index) => {
                        let fileType;
                        if (item.isFolder) {
                          fileType = "folder"
                        } else {
                          {
                            let iftl = item.fileType.toLowerCase();
                            if (iftl == "jpg" || iftl == "png" || iftl == "bmp" || iftl == "jpeg") {
                              fileType = "jpg";
                            } else if (iftl == "mp3" || iftl == "wav") {
                              fileType = "mp3";
                            } else if (iftl == "mp4" || iftl == "rmvb" || iftl == "avi") {
                              fileType = "mp4";
                            } else if (iftl == "xls" || iftl == "xlsx") {
                              fileType = "Excel";
                            } else if (iftl == "pdf") {
                              fileType = "pdf";
                            } else if (iftl == "swf") {
                              fileType = "swf";
                            } else if (iftl == "ppt" || iftl == "pptx") {
                              fileType = "ppt";
                            } else if (iftl == "rar" || iftl == "zip") {
                              fileType = "zip"
                            } else if (iftl == "doc" || iftl == "docx") {
                              fileType = "Word"
                            } else if (iftl == "txt") {
                              fileType = "txt"
                            } else {
                              fileType = "other"
                            }
                          }
                        }
                        return (
                          <li key={index}
                            className= "lean-myCloud-fileList user-no-select" 
                            data-fileid={item.resId || null}
                            data-storageid={item.storageId || null}
                            data-isfolder={item.isFolder}>
                            <span className="lean-myCloud-checkAllBox lean-myCloud-checkAllBox-false"
                              onClick={_this.singlecheckboxClick.bind(_this, index)}>
                              <SVG type="checked" ></SVG>
                            </span>
                            <span className="lean-myCloud-filelist-fileIcon"
                              onClick={_this.listClickControl.bind(_this, item.isFolder, item.fileType, item.fileId, item.fileName, item.downloadUrl)}
                            >
                              <SVG type={fileType} width="40px" height="100%"></SVG>
                            </span>
                            <span className="lean-myCloud-filelist-fileName"
                              onClick={_this.listClickControl.bind(_this, item.isFolder, item.fileType, item.fileId, item.fileName, item.downloadUrl)}
                            >
                              {item.fileName}
                              <span className="lean-myCloud-filelist-changeName" 
                                onClick={_this.changeFileNameClick.bind(_this, index)}>
                                <SVG type="pen" ></SVG>
                              </span>
                            </span>
                            <span className="lean-myCloud-filelist-changeNameOutBox"
                              style={{ display: "none" }}>
                              <input placeholder={this.state.changeNameBoxTipsTxt}
                                type="text"
                                className="lean-myCloud-filelist-changeNameInnerBox" />
                              <span className="lean-myCloud-filelist-changeName-commitBtn"
                                onClick={_this.changeFileNameCommitClick.bind(_this, index)}>
                                <SVG type="choice"></SVG>
                              </span>
                              <span className="lean-myCloud-filelist-changeName-cancleBtn"
                                onClick={_this.changeFileNameCancleClick.bind(_this, index)}>
                                <SVG type="delete"></SVG>
                              </span>
                            </span>
                            <span className="lean-myCloud-filelist-fileType">
                              文件类型：{item.fileType}
                            </span>
                            <span className="lean-myCloud-filelist-updater">
                              上传者：{item.fileUpdater}
                            </span>
                            <span className="lean-myCloud-filelist-fileSize">
                              文件大小：{item.fileSize}
                            </span>
                            <span className="lean-myCloud-filelist-createTime">
                              上传时间：{item.createTime}
                            </span>
                            <div className="lean-myCloud-filelist-controlbar">
                              <span className="lean-myCloud-filelist-topContrlbtn"
                                onClick={_this.downBtnClick.bind(_this, index, item.downloadUrl)}>
                                <SVG type="download" width="60%" height="65%" />
                              </span>
                              <span className="lean-myCloud-filelist-bottomContrlbtn"
                                onClick={_this.deleteBtnClick.bind(_this, index)}>
                                <SVG type="cross" width="60%" height="60%" />
                              </span>
                            </div>
                          </li>
                        )
                      })
                  }
                </ul>

          }
        </div>
        <Mask ref="lean-myCloud-mask" />
        {/*上传调用：*/}
        <UploadKMS ref="uploadKMS" isSwitch ={this.isSwitch.bind(this)} reRender={this.fetchFileList.bind(this)} curFolderId={this.state.pathIdList[this.state.pathIdList.length - 1]} />

        {/*<img src="http://192.168.51.22:8079/kms/services/rest/dataInfoService/downloadFile?id=d5949abdd9d04f61aebb8c3ff2052d99&token=840a6acbd8884511baaf1d2fbcbf6de7" />*/}
      </div>
    )
  }
}