import React, { Component } from 'react'
import './../../css/admin/myWebsite.css';
import {Panel,SVG,IMG} from './../../components/base';
import { Modal, Button ,Input ,Spin } from 'antd';
import { error ,confirmDia , success} from './index.js';
import _x from '../../js/_x/index';
import { G } from '../../js/g';


export class MyWebsite extends Component {
    constructor(){
        super();
        this.state = {
            disabled:false,  //btn请求不可见
            dataList:[],  //存储内容列表的数据,
            visible:false, //添加网站模态框
            visible2:false, //修改网站模态框
            webUrl:'',//input输入的网址
            urlTitle:'',//input输入的标题
            contId:'',//存储当前选中的id
            showEdit:[] //存储多个iframe
           
        }
    }

 //组件挂载前获取数据 
  componentDidMount() {
    this.getAjax2();
  }

    //ajax请求初始数据
    getAjax2(){
        var that = this;
        let req = {
          action: 'api/web/manager_school_web/show_listweb',
          data:{
            pageSize:20,
            pageIndex:1
          }
        }
        _x.util.request.formRequest(req, function (ret) {
          that.setState({dataList : ret.data });
        });
      }


  //ajax请求初始数据
  getAjax(){
    var that = this;
    let req = {
      action: 'api/web/manager_school_web/show_listweb',
      data:{
        pageSize:20,
        pageIndex:1
      }
    }
      //出现loading
      document.getElementsByClassName('ant-spin')[0].style.display = 'block';
      document.getElementsByClassName('zn-screenModal')[0].style.display = 'block';
    _x.util.request.formRequest(req, function (ret) {
        //消失loading
        document.getElementsByClassName('ant-spin')[0].style.display = 'none';
        document.getElementsByClassName('zn-screenModal')[0].style.display = 'none';
      that.setState({dataList : ret.data });
    });
  }
    //添加网站弹窗弹出
    addIframe(){
        this.setState({
            visible:true
        })
    }

    //弹窗点击确定
    handleOk = (e) => {
        if(this.state.webUrl == ""){
            error('请输入正确的网址',1000);
            return;
        }else if(this.state.urlTitle == ""){
            error('请输入正确的标题！',1000);
            return;
        }else if(this.state.urlTitle.length > 50){
            error('请输入的标题不能超过50字！',1000);
            return;
        }else{
         //判断网址是否合法   
        var reg=/(http|ftp|https):\/\/[\w\-_]+([\w\-_]+)+([\w\-,@?^=%&:/~#]*[\w\-?^=%&/~#])?/;
        if(reg.test(this.state.webUrl)){
            var that = this;
            let req = {
                action: 'api/web/manager_school_web/add_web',
                data: {
                    'title': this.state.urlTitle,
                    'address': this.state.webUrl
                }
            }
            this.setState({disabled:true});
            //出现loading
            document.getElementsByClassName('ant-spin')[0].style.display = 'block';
            document.getElementsByClassName('zn-screenModal')[0].style.display = 'block';
            _x.util.request.formRequest(req, function (ret) {
                if(ret.result){
                    //消失loading
                    document.getElementsByClassName('ant-spin')[0].style.display = 'none';
                    document.getElementsByClassName('zn-screenModal')[0].style.display = 'none';
                    that.setState({
                        visible:false,
                        disabled:false
                    })
                    that.getAjax();
                }
            });
           
        }else{
            error('您输入的网址不合法，请重新输入',1000);
            return;
        }

        }
    }

    //弹窗点击取消
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    //展示编辑页面
    showEdit = (e) =>{
        let thisSpan,
        thisNode = e.target;
        //阻止跳转
       e.preventDefault();
      var thisElement = e.target.nodeName.toLowerCase();
       if(thisElement == 'span'){
        thisSpan = thisNode.nextSibling;
      }else if (thisElement == "svg") {
        thisSpan = thisNode.parentNode.nextSibling;
      } else if (thisElement == "use") {
        thisSpan =thisNode.parentNode.parentNode.nextSibling;
      } else {
        return false;
      }
       thisSpan.style.display="block";
    }

    //鼠标移除编辑消失
    hide = (index) => {
        document.getElementsByClassName('zn-myweb-editCon')[index].style.display = 'none';
    }
    //鼠标移除编辑消失
    hideEdit = (index) => {
        document.getElementsByClassName('zn-myweb-editCon')[index].style.display = 'none';
    }

    //编辑网站模态框弹出
    changeNow = (e) =>{
        e.preventDefault();
       var title = e.target.dataset.title,
           id = e.target.dataset.id,
           address = e.target.dataset.address;
       this.setState({
           visible2:true,
           webUrl:address,
           urlTitle:title,
           contId:id
       });

    }
    //编辑网站发送请求
    handleOk2 = () =>{
        var that = this;
        if(this.state.webUrl == ""){
            error('请输入正确的网址',1000);
            return;
        }else if(this.state.urlTitle == "" && this.state.urlTitle.length > 50){
            error('请输入正确的标题！',1000);
            return;
        }else{
         //判断网址是否合法   
        var reg=/(http|ftp|https):\/\/[\w\-_]+([\w\-_]+)+([\w\-,@?^=%&:/~#]*[\w\-?^=%&/~#])?/;
        if(reg.test(this.state.webUrl)){
            let req = {
                action: 'api/web/manager_school_web/update_web',
                data: {
                    'title': this.state.urlTitle,
                    'address': this.state.webUrl,
                    'uid':this.state.contId
                }
            }
            this.setState({disabled:true});
            //出现loading
            document.getElementsByClassName('ant-spin')[0].style.display = 'block';
            document.getElementsByClassName('zn-screenModal')[0].style.display = 'block';
            _x.util.request.formRequest(req, function (ret) {
                if(ret.result){
                    //消失loading
                    document.getElementsByClassName('ant-spin')[0].style.display = 'none';
                    document.getElementsByClassName('zn-screenModal')[0].style.display = 'none';
                    // 重新渲染数据
                    that.getAjax();
                    that.setState({
                        disabled:false,
                        visible2: false,
                        urlTitle:'',
                        webUrl:''
                    })

                }
            });
            

        }else{
            error('您输入的网址不合法，请重新输入',1000);
            return;
        }

        }
    }

    //编辑网站模态框隐藏
    handleCancel2 = () =>{
        this.setState({
            visible2:false
        })
    }

    //删除网站
    delete = (e) =>{
        var that = this,
         id = [e.target.dataset.id];
        e.preventDefault();
        confirmDia({
            title:"信息提示",
            content:"确定要删除么？",
            className:1,
            okText:"删除",
            fnOK:function(){
                let req = {
                    action: 'api/web/manager_school_web/delete_web',
                    data: {
                        'uids':id
                    }
                }
                //出现loading
                document.getElementsByClassName('ant-spin')[0].style.display = 'block';
                document.getElementsByClassName('zn-screenModal')[0].style.display = 'block';
                _x.util.request.formRequest(req, function (ret) {

                    if(ret.result){
                        //loading消失
                        document.getElementsByClassName('ant-spin')[0].style.display = 'none';
                        document.getElementsByClassName('zn-screenModal')[0].style.display = 'none';
                        // 重新渲染数据
                        that.getAjax();
                        success("删除成功",1000);
                    }
                });
            },
            cancelText:"取消"
        })
    }


    //获取多个input中输入的值
    handleInputChange(e) {
        const target = e.target;
        const value =  target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    
      
      
    render () {
        let data = this.state.dataList;

        return (
            <Panel>
                <div className = 'hj-myweb-content'>
                {/* 全屏的模态框 */}
                <div className="zn-screenModal"></div>
                <Spin size="large"/>
                    <Modal
                        className='zn-normal-modal'
                        title="添加网站"
                        okText="发布"
                        maskClosable={false}
                        footer={null}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                       
                        <div className='zn-myweb-mb10'>
                            <span>网址：</span><Input value={this.state.webUrl} placeholder='合法网址示例: http://www.baidu.com' name='webUrl' onChange={this.handleInputChange.bind(this)} />
                        </div>
                        <div className='zn-myweb-mb10'>
                            <span>标题：</span><Input value={this.state.urlTitle} name='urlTitle' onChange={this.handleInputChange.bind(this)} />
                        </div>
                        <div className="ant-modal-footer">
                            <button onClick={this.handleOk.bind(this)} type="button" className={!this.state.disabled ? "ant-btn zn-btn-sure" : "ant-btn zn-btn-sure zn-disable-btn"}>
                                <span>发布</span>
                            </button>
                            <button onClick={this.handleCancel.bind(this)} type="button" className="ant-btn cjy-btn">
                                <span>取 消</span>
                            </button>
                        </div>
                    </Modal>
                    <Modal
                        className='zn-normal-modal'
                        title="修改网站"
                        okText="确定"
                        maskClosable={false}
                        footer={null}
                        visible={this.state.visible2}
                        onOk={this.handleOk2}
                        onCancel={this.handleCancel2}
                    >
                        <div className='zn-myweb-mb10'>
                            <span>网址：</span><Input value={this.state.webUrl} name='webUrl' onChange={this.handleInputChange.bind(this)} />
                        </div>
                        <div className='zn-myweb-mb10'>
                            <span>标题：</span><Input value={this.state.urlTitle} name='urlTitle' onChange={this.handleInputChange.bind(this)} />
                        </div>
                        
                        <div className="ant-modal-footer">
                            <button onClick={this.handleOk2.bind(this)} type="button" className={!this.state.disabled ? "ant-btn zn-btn-sure" : "ant-btn zn-btn-sure zn-disable-btn"}>
                                <span>确定</span>
                            </button>
                            <button onClick={this.handleCancel2.bind(this)} type="button" className="ant-btn cjy-btn">
                                <span>取 消</span>
                            </button>
                        </div>
                    </Modal>

                    <div className='hj-myweb-head'>
                        <p>网站设置</p>
                    </div>
                    <div className = 'zn-myweb-webListBox'>
                        
                         <div>
                            <div className='addIframe'>
                                <svg className="icon" aria-hidden="true" onClick={this.addIframe.bind(this, true)}>
                                    <use xlinkHref={"#icon-add-o" }></use>
                                </svg>
                                <p>添加网站</p>
                            </div>
                        </div>
                        {
                            data?
                            data.map((item,index) =>{
                                let imgUrl = G.serverUrl + item.snap_address
                                return <div key={index} onMouseLeave={this.hideEdit.bind(this,index)} className="zn-myweb-li">
                                           <a href={item.address} target="_blank">
                                           {item.snap_address ? <img src={imgUrl}/>:<div className="zn-myweb-nopic">
                                                   <SVG type="earth"/>
                                                   <p>该网站不存在</p>
                                               </div>  }
                                               <p title={item.title}>{item.title}</p>
                                               <span className="zn-myweb-edit" onClick={this.showEdit.bind(this)}>
                                                 <SVG type="down"/>
                                               </span>
                                               <div className="zn-myweb-editCon" onMouseLeave={this.hide.bind(this,index)}>
                                                   <p data-id={item.uid} data-title={item.title} data-address={item.address} onClick={this.changeNow.bind(this)}>编辑信息</p>
                                                   <p data-id={item.uid} onClick={this.delete.bind(this)}>删除</p>
                                               </div>
                                           </a>  
                                       </div>
                            })
                           :
                           ""
                        }
                    </div>

                </div>
            </Panel>
        )
    }
}

