/*
 * @Author: huangjing 
 * @Date: 2018-01-22 12:37:43 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-28 17:32:15
 * 我的资源弹出框
 */
import React, { Component } from 'react';
import './../../css/admin/myResource.css';
import {SVG,IMG} from './../../components/base';
import { Button,Tabs,Input,Select,Spin } from 'antd';
import NumberCtr from "../../js/_x/util/number.js";
import DateCtr from "../../js/_x/util/date.js";
import Session from "../../js/_x/util/session.js";
import _x from '../../js/_x/index';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;
const formatSize = NumberCtr.formatSize;
export class MyResource extends Component {
  constructor(){
    super();
    this.state={
      init:true,
      pathNameList: ['我的云盘'],
      pathIdList: ["0"],
      thisResType:'all',
      selectList:[],
      collectionList:true,
      cloudList:true,
      fileList:[],
      filelistCol:[]
    }
  }
  //读取数据列表
    readData = (folderId,resType) =>{
        let _this = this;
        let userId = sessionStorage.getItem('userId');
        _this.setState({
            init:true
        })
        let req = {
            action:'api/web/information/resources/get_folder_res',
            data:{
                folderId:folderId,
                resFormatId:resType,
                resName:'123',
                userId: userId
            }
        }
        _x.util.request.formRequest(req,function(res){
           
            if(res.code==200){
                let data = res.data,
                filelist = data.fetchFileList,
                folderlist = data.fetchFolderList,
                stateFilelist = [],
                stateFolderList = [];

                for(let o of filelist){
                    let time = new Date(o.lastUpdateTime),
                    timer = DateCtr.format(time),
                    tmp = {
                        isFolder: false,
                        fileName: o.resName,
                        downloadUrl:o.downloadUrl,
                        fileType: o.fileType.toUpperCase(),
                        fileUpdater: Session.getSession("uname") || "未知",
                        fileSize: o.resSize == 0 ? "0KB" : formatSize(o.resSize, "b"),
                        fileId: o.resId,
                        storageId: o.storageId,
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
                    downloadUrl:o.downloadUrl,
                    fileUpdater: Session.getSession("uname") || "未知",
                    fileSize: "---",
                    fileId: o.uid,
                    storageId: o.uid,
                    createTime: timer
                    };
                stateFolderList.push(tmp);
                }
                _this.setState({
                init: false,
                fileList: stateFolderList.concat(stateFilelist),
                filelistCol:stateFilelist,
                })
                setTimeout(()=>{
                    if(_this.state.fileList.length==0){
                        _this.setState({
                           cloudList:false
                        })
                     }else{
                       _this.setState({
                           cloudList:true
                        })
                     }
                     if(_this.state.filelistCol.length==0){
                        _this.setState({
                        collectionList:false
                        })
                     } else{
                       _this.setState({
                           collectionList:false
                        })
                     }  
                },50)
            }
        })
        

     
    }  
//初始化
  componentWillMount = () =>{
      let _this =this
    this.readData(this.state.pathIdList[this.state.pathIdList.length - 1],this.state.thisResType)
    let req ={
        action:'api/web/information/resources/get_res_format',
    }
    _x.util.request.formRequest(req,(res) =>{
        if(res.code == 200 && res.message == "操作成功"){
            let data = JSON.parse(res.data);
            _this.setState({selectList:data})
        }
    })
  }
 
  // 拿到文件格式下拉框的值
  handleChange = (value) => {
    this.readData(this.state.pathIdList[this.state.pathIdList.length - 1], value)

  }
  //面包削导航点击事件
  breadcrumbClick = (folderId) =>{
    let pathIdList = this.state.pathIdList,
      pathNameList = this.state.pathNameList;

        for(let i = pathIdList.length-1;i>pathIdList.indexOf(folderId);i--){
            pathIdList.pop();
            pathNameList.pop();
        }
        this.setState({
        loading: true,
        pathIdList: pathIdList,
        pathNameList: pathNameList
        }, () => {
        this.readData(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType)
        })
    }


//文件名点击事件
    enterNew(isForder, fileType, fileId, fileName, e) {
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
            this.readData(this.state.pathIdList[this.state.pathIdList.length - 1], this.state.thisResType);
        })

        } 

  }
//tab切换时执行的事件
  tabOnChange =() =>{
    this.readData(0,this.state.thisResType)
  }
  
  render() {
    let _this = this;
    return (
          <div className = 'hj-mr-quote'>
            <div className = 'hj-mr-popHead'>
                <p>资源引用</p>
                <span onClick = {_this.props.quoteClose}>
                    <SVG type = 'cross'></SVG>
                </span>
            </div>
            <div className="card-container">
              <Tabs type="card" onChange={this.tabOnChange.bind(_this)}>
                <TabPane tab="我的云盘" key="1">
                <div className="hj-mr-breadcrumb user-no-select">
                当前路径：
                    {
                        _this.state.pathNameList.map((item, index) => {
                            return <span key={index}>
                                <span onClick={_this.breadcrumbClick.bind(_this, _this.state.pathIdList[index])} className='hj-mr-breadcrumb-item' data-id={_this.state.pathIdList[index]}>{item}</span>
                                <i>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</i>
                            </span>
                        })
                    }
                </div>
                <div className = 'hj-mr-right'>
                    <Select className='hj-mr-slt' defaultValue="all" style={{ width: 120}} onChange={this.handleChange} >
                        <Option value="all">全部格式</Option>
                        {_this.state.selectList.map((item, index) => {
                            return (
                                <Option key={index} value={item.uid}>{item.formatName}</Option>
                            )
                        })}  
                    </Select>

                </div>
                
                <div className = 'hj-mr-contentBox'>
                    {
                        this.state.init
                        ?
                        /*网络延迟，加载数据动画*/
                        <div className="hj-mr-loading">
                            <Spin spinning={true} size="large" />
                        </div>
                        :
                            _this.state.cloudList?
                                <ul>
                                {
                                    _this.state.fileList.map((item, index) => {
                                    let fileType;
                                    if (item.isFolder) {
                                        fileType = "folder"
                                    } else {
                                        {
                                            let iftl = item.fileType.toLowerCase();
                                            if (iftl == "jpg" || iftl == "png" || iftl == "gif" || iftl == "jpeg") {
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
                                    return <li key={index} className="hj-mr-filelist" data-type={item.fileType}  data-name={item.fileName} data-link={item.sourseLink} data-id = {item.fileId}  >
                                        
                                        <span className="hj-mr-icon">
                                            <SVG type={fileType} width="40px" height="100%"></SVG>
                                        </span>
                                        <span className='hj-mr-title' onClick = {_this.enterNew.bind(_this,item.isFolder, item.fileType, item.fileId, item.fileName)}>{item.fileName} </span>
                                        <span className='hj-mr-formart'>格式 ：{item.fileType}</span>
                                        <span className='hj-mr-uploader'>上传者 ：{item.fileUpdater}</span>
                                        <span className='hj-mr-size'>大小 ：{item.fileSize}</span>
                                        <span className='hj-mr-date'>创建时间 ：{item.createTime}</span>
                                        <span className = 'hj-mr-myQuote'>
                                            <span className = 'hj-mr-quoteIcon' data-id = {item.fileId} data-filename = {item.fileName} data-type={item.fileType} data-download = {item.downloadUrl} onClick={_this.props.quoteIcon}>
                                                <SVG type='quote'></SVG>
                                            </span>
                                        </span>
                    
                                    </li>
                                    })
                                }
                                </ul>
                            :<div className='hj-mr-noData'>
                                <IMG src={require('../../img/noData.png')}  width="180px" height="180px"/>
                                <p>暂无相关数据</p>
                            </div>
                        }
                </div>
                    
                </TabPane>
                <TabPane tab="我的收藏" key="2" >
                {/* <div className="hj-mr-breadcrumb user-no-select">
                当前路径：
               
                     <span  className='hj-mr-breadcrumb-item' >我的收藏</span>
                               
                </div>
                <div className = 'hj-mr-right'>
                <Select className='hj-mr-slt' defaultValue="all" style={{ width: 120}} onChange={this.handleChange} >
                        <Option value="all">全部格式</Option>
                        {_this.state.selectList.map((item, index) => {
                            return (
                                <Option key={index} value={item.uid}>{item.formatName}</Option>
                            )
                        })}  
                    </Select>
                </div> */}
                <div className = 'hj-mr-contentBox'>
                {
                    this.state.init
                    ?
                    /*网络延迟，加载数据动画*/
                    <div className="hj-mr-loading">
                        <Spin spinning={true} size="large" />
                    </div>
                    : 
                        _this.state.collectionList?
                        <ul>
                            {
                                _this.state.filelistCol.map((item, index) => {
                                let fileType;
                                if (item.isFolder) {
                                    fileType = "folder"
                                } else {
                                    {
                                        let iftl = item.fileType.toLowerCase();
                                        if (iftl == "jpg" || iftl == "png" || iftl == "gif" || iftl == "jpeg") {
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
                                return <li key={index} className="hj-mr-filelist" data-type={item.sourceType} data-link={item.sourseLink}  >
                                    <span className="hj-mr-icon">
                                        <SVG type={fileType} width="40px" height="100%"></SVG>
                                    </span>
                                    <span className='hj-mr-title' onClick = {_this.enterNew.bind(_this,item.isFolder, item.fileType, item.fileId, item.fileName)}>{item.fileName} </span>
                                    <span className='hj-mr-formart'>格式 ：{item.fileType}</span>
                                    <span className='hj-mr-uploader'>上传者 ：{item.fileUpdater}</span>
                                    <span className='hj-mr-size'>大小 ：{item.fileSize}</span>
                                    <span className='hj-mr-date'>创建时间 ：{item.createTime}</span>
                                    <span className = 'hj-mr-quoteIcon' data-id = {item.fileId} data-filename = {item.fileName} data-type={item.fileType} data-download = {item.downloadUrl} onClick={_this.props.quoteIcon}>
                                        <SVG type='quote'></SVG>
                                    </span>
                
                                </li>
                                })
                            }
                        </ul>
                        :
                            <div className='hj-mr-noData'>
                                <IMG src={require('../../img/noData.png')}  width="180px" height="180px"/>
                                <p>暂无相关数据</p>
                            </div>
                }
                </div>
                </TabPane>
              </Tabs>
            </div>          
      </div>
    )
  }
};
