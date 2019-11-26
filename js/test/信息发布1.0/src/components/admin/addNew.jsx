/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:00:40 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-22 14:19:05
 * 添加新闻组件
 */
import React, { Component } from 'react';
import {RichEditor,success, error} from './index';
import { SVG, IMG } from '../base';
import { Button, Input, Checkbox, Upload } from "antd";
import _x from '../../js/_x/index';
import Session from "../../js/_x/util/session";
import {G} from '../../js/g.js';
import '../../css/admin/addNew.css';

export class AddNew extends Component {
  constructor(){
    super();
    this.state={
      title:'',         //文章标题
      rec:false,        //是否设为推荐
      coverSrc:'',          //封面src
      uid:'',           //新闻id
      disabPub:false,   //确定按钮禁用
    };
    this.file = [];     //封面文件
    this.key = '';      //草稿保存定时器
    // this.uid = '';      //新闻id
    this.maxsize = 10*1024*1024;//10M 
  }

  componentDidMount(){
    if(this.props.addOrEdit===0){
      this.key = _x.util.animation.add(30,false,this.addNews,true);
    }

    if(this.props.chosedId){
      // this.uid = this.props.chosedId;
      this.setState({
        uid:this.props.chosedId
      });
      this.getEditData(this.props.chosedId);
    }else{
      this.getDraftData();
    }
  }

  componentWillUnmount(){
    if(this.props.addOrEdit===0){
      _x.util.animation.remove(this.key);
    }
  }

  /**
   * 获取编辑数据
   */
  getEditData = (uid) => {
    let req = {
      action:'api/web/manager_school_news/detailnews',
      data:{
        uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.setState({
          title:ret.data.title,
          coverSrc:ret.data.cover_pic?G.serverUrl + ret.data.cover_pic:'',
          // content:ret.data.content,
          rec:ret.data.recommend===1?true:false
        });
        this.refs.richEditor.setEditorValue(ret.data.content);
      }
    })
  };

  /**
   * 获取草稿
   */
  getDraftData = () => {
    let opts = JSON.parse(Session.getSession("requestConfig"));
    let req = {
      action:'api/web/manager_school_news/content_cancel',
      data:{
        // token:opts.token,          //实际字段
        user_id:'usedsds'            //开发字段
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        // this.uid = ret.data.uid;
        if(ret.data.type===1){
          this.setState({
            title:ret.data.title,
            coverSrc:ret.data.cover_pic?G.serverUrl + ret.data.cover_pic:'',
            // content:ret.data.content,
            rec:ret.data.recommend===1?true:false,
            uid:ret.data.uid
          });
          this.refs.richEditor.setEditorValue(ret.data.content);
        }else{
          this.setState({
            uid:ret.data.uid
          })
        }
      }
    })
  }

  /**
   * 发布按钮
   */
  // pub = () => {
  //   const conTxt = this.refs.richEditor.getText();
  //   if(this.state.title.trim()===''){
  //     error('请填写新闻标题',1500);
  //   }else if(conTxt.trim()===''){
  //     error('请填写新闻内容',1500);
  //   }else{
  //     this.addNews(1);
  //   }
  // }

  /**
   * 图片改变
   */
  changeImg = (e) => {
    var file = e.target.files[0];
    if(this.judgeFile(e.target.files[0])){
      this.file = [file];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      var _that = this;
      reader.onload = function (e) {
        _that.setState({
          coverSrc: this.result
        });
      }
    }
    this.fileCover.value = '';
  }

  /**
   * 标题框
   */
  changeTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  /**
   * 设为推荐
   */
  changeRec = (e) => {
    this.setState({
      rec:e.target.checked
    });
  }

  /**
   * 删除封面
   */
  delCover = () => {
    this.file = [];
    this.setState({
      coverSrc: ''
    });
  }

  /**
   * 发布新闻1或草稿0
   */
  addNews = (state) => {
    this.setState({
      disabPub:true
    });
    const conHtml = this.refs.richEditor.getHtml();
    let req = {
      action:'api/web/manager_school_news/add_news',
      file:this.file,
      data:{
        uid:this.state.uid,
        title:this.state.title,
        content:conHtml,
        recommend:this.state.rec?1:0,
        state:state===1?1:0
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        if(state===1){
          this.props.getAjaxData(null,null,null,null);
          this.props.hideModal();
        }
      }
      this.setState({
        disabPub:false
      });
    })
  };

  /**
   * 确定按钮
   */
  pub = () => {
    const conTxt = this.refs.richEditor.getText();
    if (this.state.title && this.state.title.trim()===''){
      error('请填写新闻标题',1500);
    }else if(conTxt.trim()===''){
      error('请填写新闻内容',1500);
    }else{
      if(this.props.addOrEdit===0){
        this.addNews(1);
      }else{
        this.updateNews();
      }
    }
  }

  /**
   * 保存编辑新闻
   */
  updateNews = () => {
    this.setState({
      disabPub:true
    });
    const conHtml = this.refs.richEditor.getHtml();
    let req = {
      action:'api/web/manager_school_news/update_news',
      file:this.file,
      data:{
        uid:this.state.uid,
        title:this.state.title,
        recommend:this.state.rec?1:0,
        content:conHtml
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.props.getAjaxData(null,null,null,null);
        this.props.hideModal();
      }
      this.setState({
        disabPub:true
      });
    })
  };

  /**
   * 判断选择文件类型和大小
   */
  judgeFile = (file) => {
    //再对文件名进行截取，以取得后缀名
    var three = file.name.split(".");
    //获取截取的最后一个字符串，即为后缀名
    var last = three[three.length - 1];
    //添加需要判断的后缀名类型
    var tp = "jpg,jpeg,png,bmp";
    //返回符合条件的后缀名在字符串中的位置
    var rs = tp.indexOf(last.toLowerCase());
    //如果返回的结果大于或等于0，说明包含允许上传的文件类型
    if (rs >= 0) {
      if(file.size <= this.maxsize){
        return true;
      }else{
        error('图片过大',1500);
        return false;
      }
    } else {
      error('请选择图片文件',1500);
      return false;
    }
  }

  render(){
    return (
      <div>
        <div className="cjy-an-titleLine">
          <span className="cjy-label">标题：</span>
          <Input value={this.state.title} onChange={ this.changeTitle } maxLength="50"/>
          <span className="cjy-an-recmd">
            <Checkbox onChange={this.changeRec} checked={this.state.rec}>设为推荐</Checkbox>
          </span>
          <div className="cjy-an-titleLen">{this.state.title?this.state.title.length:0}/50</div>
        </div>
        <div className="cjy-an-top20">
          <span className="cjy-label">封面：</span>
          <span className="cjy-an-cover">
            <SVG type="plus"/>
            <span>添加封面</span>
            <input className="cjy-an-upFile" ref={el => this.fileCover=el} type="file" onChange={ this.changeImg }/>
          </span>
          {
            this.state.coverSrc
            ? <span className="cjy-an-coverImg">
              <IMG src={this.state.coverSrc}/>
              <span className="cjy-an-delCover" onClick={this.delCover}><SVG type="delete"/></span>
            </span>
            : ''
          }
          <div className="cjy-an-sgst">建议尺寸：290 * 170</div>
        </div>
        <div className="cjy-an-editorLine">
          <span className="cjy-label">内容：</span>
          <div className="cjy-an-editorBox">
            <RichEditor className="cjy-an-editor" ref="richEditor" chosedId={this.state.uid}></RichEditor>
          </div>
        </div>
        <div className="ant-modal-footer">
          <Button className="cjy-btn cjy-orange-sure" disabled={this.state.disabPub} onClick={this.pub}>确定</Button>
          <Button className="cjy-btn" onClick={this.props.hideModal}>取消</Button>
        </div>
      </div>
    );
  }
}