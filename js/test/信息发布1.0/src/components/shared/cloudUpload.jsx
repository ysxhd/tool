/*
 * @Author: lean 
 * @Date: 2018-01-15 16:42:51 
 * @Last Modified by: huangjing
 * @Last Modified time: 2018-03-23 10:18:27
 */
import React from 'react';
import { message } from 'antd';
import { SVG } from '../base';
import Session from '../../js/_x/util/session.js';
import Request from '../../js/_x/util/request.js';
import '../../css/admin/cloudUpload.css';
import '../../css/index.css';
import {success,error,confirmDia} from './../admin/index';
import {Prompt} from 'react-router-dom';

const _ajax = Request.formRequest;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      frameNameList:/*iframe hash name,readonly*/["e2204211973040118229b55f0", "e84df8ea", "37650712", "f22e87a1", "239d3c53","ad7a32ed","63d6ccb4", "af778a77", "c2f2ae73", "b5991e2f", "6f8f86d1", "12bbd6db"],
      frameWorkStateIdle: /*iframe idle state*/[0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],
      frameWorkUploadQueue:/*iframe upload queue; isUnderWay:-1:before upload; 0:underway; 1:after upload;*/[],
      //frameWorkUploadedQueue: [],
      haveFileUpload: /*iframe upload transient state*/ true,
      fileSrc: "http://192.168.20.133:8079/bemsc/video/getFileUpPage",
      videoSrc: "http://192.168.20.133:8079/bemsc/video/getVideoFileUpPage",
      curFolderId: this.props.curFolderId,
    }
  }
  componentWillReceiveProps(nextProps) {
    let a = nextProps.curFolderId;
    this.setState({
      curFolderId: a
    })
  }
  fileSelect(sourceType = "isFile") {
    var toBusy = false;
    let uploadContent = document.querySelector('.lean-upload-controlbar'),
      toggleBtn = document.querySelector('.lean-upload-progress>p>span');
    if (toggleBtn.className != "open") {
      //上传进度框hide状态
      toggleBtn.className = "open";
      uploadContent.style.cssText = "bottom:5px";
    }

    if (sourceType == "isFile") {
      //默认为普通文件上传
      for (let i = 0; i < 6; i++) {
        if (this.state.frameWorkStateIdle[i] === 0) {
          //找到空闲的iframe，
          let this_frame_hash = this.state.frameNameList[i];
          let this_frame = document.querySelector(`#lean-${this_frame_hash}`);
          this_frame.contentWindow.postMessage({ action: "fileselect" }, "*");
          this.setState({
            haveFileUpload: true
          })
          break;
        } else if (i == 5 && this.state.frameWorkStateIdle[i] !== 0) {
          toBusy = true;
          message.warn("上传队列已满，请先处理一些",5);
        }
      }
    } else {
      //视频流上传
      for (let i = 6; i < 12; i++) {
        if (this.state.frameWorkStateIdle[i] === 0) {
          //找到空闲的iframe，
          let this_frame_hash = this.state.frameNameList[i];
          let this_frame = document.querySelector(`#lean-${this_frame_hash}`);
          this_frame.contentWindow.postMessage({ action: "fileselect" }, "*");
          this.setState({
            haveFileUpload: true
          })
          break;
        } else if (i == 11 && this.state.frameWorkStateIdle[i] !== 0) {
          toBusy = true;
          message.error("上传队列已满，请先处理一些文件！", 4);
        }
      }
    }
    return toBusy;
  }
  beginUpload(frameId) {
    let this_frame = document.querySelector(`#lean-${frameId}`),
      hashList = this.state.frameNameList,
      tmpQueue = this.state.frameWorkUploadQueue;

    this_frame.contentWindow.postMessage({ action: 'upload' }, "*");

    for (let i = 0; i < hashList.length; i++) {
      if (tmpQueue[i].inWhichFrame === frameId) {
        tmpQueue[i].isUnderWay = 0;
        this.setState({
          frameWorkUploadQueue: tmpQueue,
        })
        break;
      }
    }
  }
  toggleUploadContent(e) {
    let uploadContent = document.querySelector('.lean-upload-controlbar');
    if (e.target.className == 'open') {
      uploadContent.style.cssText = "bottom:-245px;";
      e.target.className = " ";
    } else {
      uploadContent.style.cssText = "bottom:5px;";
      e.target.className = 'open';
    }
  }
  componentWillUnmount(){
    window.removeEventListener('message', this.changeThis, false)
    
  }
   
  changeThis = (e) =>{
    let _this = this;
    if (e.data.action === "filechanged" && typeof e.data.data === "object") {
      let fileData = e.data.data;
      let tmpQueue = this.state.frameWorkUploadQueue;
      let beforeUploadState = {
        fileName: fileData.name,
        fileSize: fileData.size,
        fileType: fileData.type,
        fileModifyTime: fileData.lastModifyed,
        isUnderWay:/* -1:before upload; 0:underway; 1:after upload;*/ -1,
        inWhichFrame: e.data.frameId,
        fileId: ""
      };
      //更改状态：
      let tmpState = this.state.frameWorkStateIdle,
        tmpHashList = this.state.frameNameList;
      for (let i = 0; i < tmpState.length; i++) {
        if (e.data.frameId === tmpHashList[i]) {
          tmpState[i] = 1;
          break;
        }
      }
      tmpQueue.push(beforeUploadState);
      this.setState({
        frameWorkUploadQueue: tmpQueue,
        frameWorkStateIdle: tmpState
      })
    } else if (e.data.action === "uploadsuccess") {
      let fileData = e.data.data,
        tmpQueue = this.state.frameWorkUploadQueue,
        tmpState = this.state.frameWorkStateIdle,
        hashList = this.state.frameNameList;
      for (let i = 0; i < tmpQueue.length; i++) {
        if (tmpQueue[i].inWhichFrame === e.data.frameId) {
          
          tmpQueue[i].fileId = "";
          tmpQueue[i].inWhichFrame = "";
          tmpQueue[i].folderId = this.state.curFolderId,
            tmpQueue[i].Id = e.data.data;
          tmpQueue[i].pdfId = "";
          tmpQueue[i].fileModifyTime = new Date().getTime();
          tmpQueue[i].userId = sessionStorage.getItem('userId') || "220421197304011822";
          tmpQueue[i].resTypeId = 7;
          tmpQueue[i].resName = tmpQueue[i].fileName;
          tmpQueue[i].resSize = tmpQueue[i].fileSize;
          let data = {},
            sourceObj = tmpQueue[i];
          for (var item in sourceObj) {
            data[item] = sourceObj[item];
          }
          let pr = {
            data: data,
            action: "api/web/information/resources/upload_file"
          }
          _ajax(pr, (res) => {
            if (res.code == 200) {
              tmpQueue[i].isUnderWay = 1;
              _this.props.reRender(this.state.curFolderId, "all")
            } else {
              tmpQueue[i].isUnderWay = 2;
              error('请选择正确的格式文件',1500);
              _this.props.reRender(this.state.curFolderId, "all")
            }
          })
          break;
        }
      }
      for (let i = 0; i < hashList.length; i++) {
        if (hashList[i] === e.data.frameId) {
          tmpState[i] = 0;
          break;
        }
      }
      this.setState({
        frameWorkUploadQueue: tmpQueue,
        frameWorkStateIdle: tmpState
      })
      document.querySelector(`#lean-${e.data.frameId}`).contentWindow.postMessage({ action: "clearfile" }, "*")
    }
  }
  componentDidMount() {
    window.addEventListener('message', this.changeThis, false);
  
  }

  componentDidUpdate(){
    window.onbeforeunload = function () {
      var uploading = document.querySelector(".lean-upload-btn-uploading");
      if(uploading){
        window.event.returnValue  = "有任务正在上传中，确认要离开么吗？";
      }else{
         return ;
      }
    }
  }

  render() {
    let _this = this;
    return (
      <div className={"lean-upload-controlbar"} >
        <div style={{ display: "none" }} id="lean-uploadkms-container">
          {/*初始化创建10个iframe，前五个为普通文件上传iframe,后五个为视频录播资源上传iframe*/}
          {this.state.frameNameList.map((item, index) => {
            return <iframe name={"lean-" + item}
              id={"lean-" + item}
              key={item}
              src={index < this.state.frameNameList.length / 2 ? this.state.fileSrc + "?frameId=" + item : this.state.videoSrc + "?frameId=" + item}>
            </iframe>
          })}
        </div>
        <div className={this.state.haveFileUpload == true ? "lean-upload-progress" : "hidden"}>
          <p>上传文件<span className="" onClick={this.toggleUploadContent.bind(this)}></span></p>
          <ul className="lean-upload-queueView">
            {
              this.state.frameWorkUploadQueue.map((item, index) => {
                return <li key={index}>
                  <span className = 'hj-upload-name'>{item.fileName}</span>
                  {
                    item.isUnderWay == -1
                      ?
                      <span onClick={_this.beginUpload.bind(_this, item.inWhichFrame)}
                        className="lean-upload-btn-beforeUpload">
                        开始上传
                      </span>
                      :
                      item.isUnderWay == 0
                        ?
                        <span className="lean-upload-btn-uploading">
                          上传中...
                        </span>
                        :
                          item.isUnderWay == 2
                          ?
                          <span className="lean-upload-btn-error">
                            失败
                          </span>
                          :
                          <span className="lean-upload-btn-afterUpload">
                            <SVG type="choice" color="#3cc17c"></SVG> 成功
                          </span>

                  }
                </li>
              })
            }
          </ul>
          <Prompt when={true}  message={locaton =>{
              var uploading = document.querySelector(".lean-upload-btn-uploading");
              if (uploading) {
                return `还有文件正在上传，确定离开么？`
              }else{
                return
              }
            }
          } />
        </div>
      </div>
    )
  }
}
