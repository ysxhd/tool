/*
 * @Author: huangjing 
 * @Date: 2018-01-18 13:18:52 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:28:53
 * 校园介绍 
 */
import React, { Component } from 'react'
import './../../css/admin/myCollege.css';
import {Panel,SVG,IMG} from './../../components/base';
import { Button,Tabs,Input,Select,Spin } from 'antd';
import Mask from '../shared/maskLayer';
import {MyResource} from '../shared/myResource';
import _x from '../../js/_x/index';
import {success,error,confirmDia} from './index.js';
import {G} from './../../js/g';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const Option = Select.Option;
const serverUrl = G.serverUrl;

export class MyCollege extends Component {
    constructor(){
        super();
        this.file = [];
        this.logo = [];
        this.video = [];  
        let a = sessionStorage.getItem('xiaoxun');
        this.state = {
            loadingClose:false,
            videoVisible:false,
            videoUrl :'',
            logoUrl :'',
            titleValueL:0,
            visible:false,
            areaValueL : 0,
            thisId:1,
            isEdit:false, //校风校训是否是编辑页面
            schoolMottoN:'好好学习 天天向上',
            schoolDescriptionN:a,
            isHaveVideo:true,
            headLoading:false,
            picLoading:false,
            schoolCon:[
                {
                    schoolName:'',
                    schoolMotto:'',
                    schoolDescription:''
                }
            ],
            picData:[],
        }
        this.maxsize = 10*1024*1024;//10M 
        this.vMaxsize = 500*1024*1024;//500M

    }
    //是否编辑校风校训切换
    EditCon = () =>{
        
        this.setState({
            isEdit:!this.state.isEdit,
        })
    }

    //校风校训保存
    saveEdit = () =>{
        let _this = this;
         this.setState({
             isEdit:!this.state.isEdit,
        //     schoolCon:[{schoolMotto:this.state.schoolCon[0].schoolMotto,schoolName:this.state.schoolCon[0].schoolName,schoolDescription:this.state.schoolCon[0].schoolDescription}],
        //     schoolMottoN:this.state.schoolCon[0].schoolMotto,
        //     schoolDescriptionN:this.state.schoolCon[0].schoolDescription,
         })
        let req = {
            action:'api/web/information/manager_campus/update_info',
            data:{
                schoolMotto:this.state.schoolCon[0].schoolMotto,
                schoolDescription:this.state.schoolCon[0].schoolDescription
            }
        }
        _x.util.request.formRequest(req,function(res){
            _this.headInit();
        })

        setTimeout(this.headInit, 60);
        
    }

    //校风校训取消
    cancelEdit = () =>{ 
        this.headInit();
        this.setState({
            isEdit:!this.state.isEdit,
            // schoolCon:[{schoolMotto:this.state.schoolMottoN,schoolName:this.state.schoolCon[0].schoolName,schoolDescription:this.state.schoolDescriptionN}],   
        })
        
    }

    //校风校训编辑
    EditText = (e) =>{
         this.setState({schoolCon:[{schoolMotto:e.target.value,schoolName:this.state.schoolCon[0].schoolName,schoolDescription:this.state.schoolCon[0].schoolDescription}]})
        // 1:把session 中的值，替换为输入框里的值
        // 2:把新的session 中的值，保存到state中去 setState()；
   
    }

    //学校简介编辑
    EditArea = (e) =>{
        this.setState({
            schoolCon:[{schoolMotto:this.state.schoolCon[0].schoolMotto,schoolName:this.state.schoolCon[0].schoolName,schoolDescription:e.target.value}],
            
        })
        setTimeout(() => {
                if(this.state.areaValueL>=500){
                    this.setState({
                        areaValueL:500
                    }) 
                }else{
                    this.setState({
                        areaValueL:this.state.schoolCon[0].schoolDescription.length
                    })
                }
                   
        }, 80);
            
    }
      

    //从资源引用点击事件
    popShow = () =>{
        // var quotePop = document.getElementsByClassName('hj-mcm-quotePop')[0];
        // quotePop.style.display = 'block'
        this.setState({
            visible:true
        });
        this.refs['hj-mcm-pop'].show();
    }

    //关闭资源引用弹窗
    quoteClose = () =>{
        // var quotePop = document.getElementsByClassName('hj-mcm-quotePop')[0];
        // quotePop.style.display = 'none'
        this.setState({
            visible:false
        });
        this.refs['hj-mcm-pop'].close();
    }

    //鼠标移入校园图片事件
    picHandle = (index,e) =>{
        if(document.getElementsByClassName('hj-mcm-picHanBox')[index].style.display == 'block'){
            document.getElementsByClassName('hj-mcm-picHanBox')[index].style.display = 'none';
        }else{
            document.getElementsByClassName('hj-mcm-picHanBox')[index].style.display = 'block';
        }
        
    }

    //鼠标离开校园图片事件
    thisPicLeave = (index,e) =>{
        document.getElementsByClassName('hj-mcm-picHanBox')[index].style.display = 'none';
    }

    //校园图片名称编辑弹窗关闭
    editClose = () =>{
        let editTitlePop =  document.getElementsByClassName('hj-mcm-editTitlePop')[0]
        editTitlePop.style.display = 'none';
        this.refs['hj-mcm-pop'].close();
    }

    //校园图片名称编辑弹窗打开
    editTitle = (e) =>{
        let editTitlePop =  document.getElementsByClassName('hj-mcm-editTitlePop')[0]
        editTitlePop.style.display = 'block';
        this.refs['hj-mcm-pop'].show();
        let titleNameIn = document.getElementsByClassName('hj-mcm-titleNameIn')[0];
        titleNameIn.value = e.target.dataset.title;
        this.setState({
            thisId:e.target.dataset.id,
            titleValueL:e.target.dataset.title
        })
   
    }

    //保存图片名称
    titleSave = ()=>{
        let uid = this.state.thisId;
        let titleNameIn = document.getElementsByClassName('hj-mcm-titleNameIn')[0];
        let req = {
            action:'api/web/information/manager_campus/update_pic',
            data:{
                uid:uid,
                pictureName:titleNameIn.value
            }
        }
         _x.util.request.formRequest(req,function(res){       
        });
        let editTitlePop =  document.getElementsByClassName('hj-mcm-editTitlePop')[0]
        editTitlePop.style.display = 'none';
        this.refs['hj-mcm-pop'].close();
        setTimeout(this.picInit, 60);
    }

    /**
   * 判断文件类型和大小
   */
  judgeFile = (file) => {
    //再对文件名进行截取，以取得后缀名
    var three = file.name.split(".");
    //获取截取的最后一个字符串，即为后缀名
    var last = three[three.length - 1];
    //添加需要判断的后缀名类型
    var tp = "jpg,jpeg,gif,png,bmp,tiff,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,wmf";
    var tp2 = "jpg,jpeg,png,bmp";
    //返回符合条件的后缀名在字符串中的位置
    var rs = tp.indexOf(last.toLowerCase());
    var rs2 = tp2.indexOf(last.toLowerCase());
    //如果返回的结果大于或等于0，说明包含允许上传的文件类型
    if (rs >= 0) {
        if (rs2 >=0){
            if(file.size <= this.maxsize){
                return true;
            }else{
                error('图片过大',1500);
                return false;
            }
        }else{
            error("不支持当前图片类型",1500);
        }
    } else {
      error('请选择图片文件',1500);
      return false;
    }
  }

    //本地上传图片
    picChange = (e) => {
        let n,_this = this;
        // this.file.push(e.target.files[0]);
        for(let i = 0;i< [e.target.files][0].length;i++){
        var file =[e.target.files][0][i]
            //再对文件名进行截取，以取得后缀名
        var three = file.name.split(".");
        //获取截取的最后一个字符串，即为后缀名
        var last = three[three.length - 1];
        //添加需要判断的后缀名类型
        var tp = "jpg,jpeg,gif,png,bmp,tiff,pcx,tga,exif,fpx,svg,psd,cdr,pcd,dxf,ufo,eps,ai,raw,wmf";
        var tp2="jpg,jpeg,png,bmp";
        //返回符合条件的后缀名在字符串中的位置
        var rs = tp.indexOf(last.toLowerCase());
        var rs2 = tp2.indexOf(last.toLowerCase());
        //如果返回的结果大于或等于0，说明包含允许上传的文件类型
        if (rs >= 0) {
        if(file.size <= this.maxsize){
            if (rs2 >=0){
                n = true;
            }else{
            error("不支持当前图片类型",1500);
            n = false;
                break;
            }
        }else{
             error('图片过大',1500);
            n = false;
                break;
        }
        } else {
        error('请选择图片文件',1500);
        n =false;
            break;
        }
        }
        if(n){
            this.file = [e.target.files][0];
        this.getPic();
        e.target.value = '';
        }
        

    }

    //本地上传图片向后台进行请求
    getPic = () => {
        let _this = this;
        let req = {
            action:'api/web/information/manager_campus/upload_local_pic',
            file:this.file,
            }
            _x.util.request.formRequest(req,function(ret){
                if(ret){
                    _this.picInit()
                }
            
        });
    }
    
    //设置logo
    logoChange = (e) =>{
        if(this.judgeFile(e.target.files[0])){
            this.logo = [e.target.files[0]];
            this.getLogo();
            e.target.value = '';
        }
    }
    

    //设置logo向后台请求
    getLogo = () =>{
        let _this =this;
        let req = {
            action:'api/web/information/manager_campus/logo',
            file:this.logo,
           
            }
            _x.util.request.formRequest(req,function(ret){
                    _this.headInit();
                
            });
    }

    //上传视频
    videoChange = (e) =>{
        let n;
        if([e.target.files[0]][0].size <= this.vMaxsize){
            n = true;
        }else{
            n = false;
            error('视频过大',1500);
            
        }
        if(n){
            this.video = [e.target.files[0]];
            this.getVideo();
            e.target.value = '';
        }
        
    }

    //上传视频向后台进行请求
    getVideo = () =>{
        let _this = this;
        _this.setState({
            loadingClose:true
        })
        let req = {
        action:'api/web/information/campus/upload_local_video',
        file:this.video,

        }
        _x.util.request.formRequest(req,function(res){
            if(res){
                _this.setState({
                    videoUrl:res.data,
                    loadingClose:false,
                    isHaveVideo:true
                },()=>{
                    _this.headInit();
                })
            }else{
     
            }
        });
    }

    //从我的资源引用
    quoteIcon = (e) =>{
        let _this=this, 
        et = e.target,
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
        let type=thisSpan.dataset.type.toLowerCase();
        if(  type=="jpg" ||type=="png" ||type== "bmp" ||type== "jpeg"){
            let req = {
                action:'api/web/information/manager_campus/save_remote_pic',
                data:{
                    fileName:thisSpan.dataset.filename,
                    downloadUrl:thisSpan.dataset.download
                }
            }
            _x.util.request.formRequest(req,function(res){
                _this.picInit();
            })
        
            this.setState({
                visible:false
            });
            this.refs['hj-mcm-pop'].close();
        }else{
            alert('请选择图片格式')
        }

    }

    //删除图片
    picDel = (id) =>{
        let ids =[],_this = this;
        confirmDia({
            content:'确认要删除该文件吗？',
            className:0,
            okText:'确认',
            fnOK :function(){
                ids.push(id);
                let req = {
                    action:'api/web/information/file/del_pictures',
                    data:{
                        ids:ids
                    }            
                }
                    _x.util.request.formRequest(req,function(ret){
                        if(ret){
                            _this.picInit();
                        }
                    });
            },
            cancelText:'取消'

        })
    }

    titleNameIn = (e) =>{
        if(this.state.titleValueL.length<50){
            this.setState({titleValueL:e.target.value})
        }
    }

    //头部初始化
    headInit = () =>{
        let _this = this;
        let req = {
            action:'api/web/information/campus/find',
            }
            _x.util.request.formRequest(req,function(res){
                if(res){
                    
                if(!res.data.schoolMotto&&res.data.schoolDescription){
                    _this.setState({
                        schoolCon:[{schoolMotto:'请完善校训',schoolName:res.data.schoolName,schoolDescription:res.data.schoolDescription}],
                        logoUrl:res.data.schoolBadge,
                        videoUrl:res.data.schoolIntroduceVideo,
                        headLoading:true
                    })
                }else if(res.data.schoolMotto&&!res.data.schoolDescription){
                    _this.setState({
                        schoolCon:[{schoolMotto:res.data.schoolMotto,schoolName:res.data.schoolName,schoolDescription:'请完善校园介绍'}],
                        logoUrl:res.data.schoolBadge,
                        videoUrl:res.data.schoolIntroduceVideo,
                        headLoading:true
                    })
                }else if(!res.data.schoolMotto&&!res.data.schoolDescription){
                    _this.setState({
                        schoolCon:[{schoolMotto:'请完善校训',schoolName:res.data.schoolName,schoolDescription:'请完善校园介绍'}],
                        logoUrl:res.data.schoolBadge,
                        videoUrl:res.data.schoolIntroduceVideo,
                        headLoading:true
                    })
                }else{
                    _this.setState({
                        schoolCon:[{schoolMotto:res.data.schoolMotto,schoolName:res.data.schoolName,schoolDescription:res.data.schoolDescription}],
                        logoUrl:res.data.schoolBadge,
                        videoUrl:res.data.schoolIntroduceVideo,
                        headLoading:true
                    })
                }

                    
                }
            });

            setTimeout(()=>{
                if(this.state.videoUrl!=''){
                    _this.setState({
                        isHaveVideo:true
                    })
                }else{
                    _this.setState({
                        isHaveVideo:false
                    })
                }
            },50)
            
    }

    //图片初始化
    picInit = () =>{
        let _this = this;
        let reqPic = {
            action:'api/web/information/manager_campus/find_pictures',
            data:{
                pageIndex:1,
                pageSize:1000
            }
        }
        _x.util.request.formRequest(reqPic,function(res){
            if(res){
                _this.setState({
                    picData:res.data.pageContent,
                    picLoading:true
                })
            }
        });
    }

    //播放视频
    videoPlayer = () =>{
        var hasVideo = !!(document.createElement('video').canPlayType);
        if(!hasVideo){
            error('您的浏览器可能不支持视频播放，请安装谷歌浏览器');
        };
        this.setState({
            videoVisible:true,
            videoClose:true
        })
        this.refs['hj-mcm-pop'].show();  
    }



    //视频播放关闭
    videoClose =() =>{

        this.setState({
            videoVisible:false,
            videoClose:false
        })
        this.refs['hj-mcm-pop'].close();
    }

    //删除视频
    delVideo = () =>{
        let _this = this; 
        confirmDia({
            content:'确认要删除该文件吗？',
            className:0,
            okText:'确认',
            fnOK :function(){
                _this.setState({
                    isHaveVideo:false
                })
                let req = {
                    action:'api/web/information/campus/delete_local_video',
                    data:{
                        videoName:_this.state.videoUrl 
                    }            
                }
                    _x.util.request.formRequest(req,function(ret){
                        if(ret){
                            
                        }
                    });
            },
            cancelText:'取消'
        
        })
        
    }
    componentWillMount = () =>{

       this.headInit();
        this.picInit();
          
    }
    componentDidMount = () =>{
        let _this = this;
        this.setState({
            areaValueL:this.state.schoolCon[0].schoolDescription.length,
        })


    }

    render () {
        let _this = this; 
        let _tpic= this; 
        return (       
            <Panel>
                
                {
                     _this.state.headLoading&&_this.state.picLoading
                    ?
                    <div className = 'hj-mcm-all'>
                        <div className = 'hj-mcm-head'>
                            <div className = 'hj-mcm-logo'>
                                <img src={serverUrl+this.state.logoUrl} />
                                <p>设置logo
                                    <input name='file' accept="image/*" className='hj-mcm-logoFileIn'  onChange = {this.logoChange.bind(_this)} type = 'file'  />
                                </p>
                                
                            </div>
                            <div className = 'hj-mcm-SchoolCon'>
                                {this.state.isEdit?
                                    <div className = 'hj-mcm-yesEdit'>
                                        <p className = 'hj-mcm-schoolName'>{_this.state.schoolCon[0].schoolName}</p>
                                        <div className = 'hj-mcm-isEdit'>
                                            <Button className = 'hj-mcm-saveEdit' onClick = {_this.saveEdit.bind(_this)}>保存</Button>
                                            <Button className = 'hj-mcm-cancelEdit' onClick = {_this.cancelEdit.bind(_this)}>取消</Button>
                                        </div>
                                        <div className = 'hj-mcm-keyword'>
                                            <span>校风/校训 :</span>
                                            <input type = 'Text' value = {_this.state.schoolCon[0].schoolMotto} maxLength = '50' onChange = {_this.EditText.bind(_this)} />
                                        </div>
                                        <div className = 'hj-mcm-sintro'>
                                            <span>学校介绍 :</span>
                                            <textarea  value={_this.state.schoolCon[0].schoolDescription} rows='5'  maxLength ='500' onChange = {_this.EditArea.bind(_this)}></textarea>
                                            <div className = 'hj-mcm-scpPercent'>{_this.state.areaValueL}/500</div>
                                        </div>
                                    </div>
                                    :
                                    
                                    <div className = 'hj-mcm-noEdit'>
                                        <p className = 'hj-mcm-schoolName'>{_this.state.schoolCon[0].schoolName}</p>
                                        <Button className = 'hj-mcm-edit' onClick = {_this.EditCon.bind(_this)}>编辑信息</Button>
                                        <div className = 'hj-mcm-schoolMotto'>{_this.state.schoolCon[0].schoolMotto}<p className = 'hj-mcm-triangle'></p></div>
                                        <div className = 'hj-mcm-schoolDescription' title={this.state.schoolCon[0].schoolDescription}>{_this.state.schoolCon[0].schoolDescription}</div>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className = 'hj-mcm-colPic'>
                            <p className = 'hj-mcm-picTitle'>
                                校园照片
                            </p>
                            <ul>
                                <li>
                                    <div>
                                        <span className='hj-mcm-picUpload'>
                                            <SVG type = 'upload'></SVG>
                                            <p>本地上传</p>
                                            <input className='hj-mcm-picFileIn' accept="image/*" onChange = {this.picChange.bind(_this)} type = 'file' multiple />
                                        </span>
                                    </div>
                                    <div>
                                        <span className='hj-mcm-picQuote' onClick = {_this.popShow.bind(_this)}>
                                            <SVG type = 'quote'>从我的资源引用</SVG>
                                            <p>从我的资源引用</p>
                                        </span>
                                    </div>
                                </li>
                                {
                                    _this.state.picData.map((item,index) =>{
                                        return <li key = {index}  onMouseLeave = {_this.thisPicLeave.bind(_this,index)}>
                                                    <img className = 'hj-mcm-picName' src = {serverUrl+item.picAddress}  />
                                                    <p className='hj-mcm-picTtle'>{item.pictureName}</p>
                                                    <span onClick = {_this.picHandle.bind(_this,index)} data-id = {item.uid} className = 'hj-mcm-picHandle'>
                                                        <SVG type = 'down'></SVG>
                                                    </span>
                                                    <div className = 'hj-mcm-picHanBox' data-id = {item.id} >
                                                        <p onClick = {_this.editTitle.bind(_this)} data-id = {item.uid}  data-title = {item.pictureName}>编辑信息</p>
                                                        <p onClick  = {_this.picDel.bind(_this,item.uid)} >删除</p>
                                                    </div>
                                            </li>
                                    })
                                }
                                
                            </ul>
                        </div>

                        <div className = 'hj-mcm-colvideo'>
                            <p className = 'hj-mcm-picTitle'>
                                宣传视频
                            </p>
                            <ul>
                                <li className = 'hj-mcm-videoUpload'>
                                    <span>
                                        <SVG type = 'upload'></SVG>
                                        <p>本地上传</p>
                                        <input className='hj-mcm-videoFileIn' accept="video/mp4" onChange = {this.videoChange.bind(_this)} type = 'file' multiple />
                                    </span>
                                </li>
                                {_this.state.isHaveVideo
                                ?
                                    <li className = 'hj-mcm-video' >
                                        <span className = 'hj-mcm-delv' onClick = {_this.delVideo.bind(_this)}>
                                            <SVG type='delete'></SVG>
                                        </span>
                                        <span className = 'hj-mcm-video1' onClick = {_this.videoPlayer.bind(_this)}>
                                            <SVG type='video1'></SVG>
                                        </span>
                                        {_this.state.loadingClose
                                        ?<div className = 'hj-mcm-loading'>
                                        <Spin spinning={true} size="large" />
                                        </div>
                                        : ''}
                                    
                                    </li>
                                :''
                                }
                                    
                               
                                {_this.state.videoVisible
                                ?<div>
                                    <video src={serverUrl+_this.state.videoUrl} controls="controls" className='hj-mcm-myVideo'>
                                        您的浏览器不支持 video 标签。
                                        </video>
                                        <div className = 'hj-mcm-popClose' onClick={_this.videoClose.bind(_this)} >
                                            <SVG type = 'delete' width = '20px' height='20px' ></SVG>
                                        </div>
                                    </div> 
                                    :''
                                } 
                                
                            </ul>
                        </div>
                    </div>
                    :
                    /*网络延迟，加载数据动画*/
                    <div className="hj-mcm-loadingAll">
                    <Spin spinning={true} size="large" />
                    </div>
                }
                <Mask ref = 'hj-mcm-pop' />

                {
                    this.state.visible
                    ? <MyResource quoteClose = {_this.quoteClose}  quoteIcon = {_this.quoteIcon} />
                    : ''
                }
                        
                                
                <div className = 'hj-mcm-editTitlePop'>
                        <div className = 'hj-mcm-editHead'>
                            <p>照片信息</p>
                            <span onClick = {_this.editClose.bind(_this)}>
                                <SVG type = 'cross'></SVG>
                            </span>
                        </div>
                        <div className='hj-mcm-titleMess'>
                            <span className = 'hj-mcm-titleName'>照片名称 : </span>
                            <input type = 'text' maxLength='50'  className='hj-mcm-titleNameIn' onChange = {_this.titleNameIn.bind(_this)}/>
                        </div> 
                        <div className = 'hj-mcm-editYes'>
                                <span>{_this.state.titleValueL.length}/50</span>
                                <Button className = 'hj-mcm-titleSave' onClick = {_this.titleSave.bind(_this)} >保存</Button>
                        </div>   
                </div>

            </Panel>
        )
    }
}
