/*
 * @Author: JudyC 
 * @Date: 2018-01-09 11:17:57 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:42:28
 */
import React, { Component } from 'react';
import WangEditor from '../../RichEditor/wangEditor';
import {G} from '../../js/g.js';
import Session from "../../js/_x/util/session";
import '../../RichEditor/wangEditor.css';

export class RichEditor extends Component {
  constructor(){
    super();
    this.state = {};
    this.chosedId = '';
  }
  editorId="editor-"+Math.random().toString().slice(2);

  componentWillReceiveProps(nextProps){
    let editor = new WangEditor(`#${this.editorId}`);
    this.chosedId = nextProps.chosedId;
    let opts = JSON.parse(Session.getSession("requestConfig"));
    editor.customConfig.uploadImgServer=G.serverUrl + "/api/web/manager_school_news/add_contentPicture";
    editor.customConfig.uploadFileName = 'files';
    editor.customConfig.uploadImgParams={
     data:JSON.stringify({ uid:this.chosedId}),
     token:opts.token,
     orgCode:opts.orgcode
    }
  }

  // componentWillReceiveProps(nextProps){
  //   let editor = new WangEditor(`#${this.editorId}`);
  //   let onChange =this.props.onChange;

  //   // 配置服务器端地址
  //   // editor.customConfig.uploadImgServer = '/upload'

  //   editor.customConfig.onchange=(html)=>{
  //     onChange && onChange(html);
  //   }
  //   let opts = JSON.parse(Session.getSession("requestConfig"));
  //   editor.customConfig.uploadImgServer=G.serverUrl + "/api/web/manager_school_news/add_contentPicture";
  //   editor.customConfig.uploadFileName = 'files';
  //   editor.customConfig.uploadImgParams={
  //    data:JSON.stringify({ uid:nextProps.chosedId}),
  //    token:opts.token,
  //    orgCode:opts.orgcode
  //   }

  //   // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
  //   editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
  //   // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器

  //   // 隐藏“网络图片”tab
  //   editor.customConfig.showLinkImg = false

  //   // 自定义菜单配置
  //   editor.customConfig.menus = [
  //     'head',  // 标题
  //     'bold',  // 粗体
  //     'italic',  // 斜体
  //     'underline',  // 下划线
  //     'strikeThrough',  // 删除线
  //     'foreColor',  // 文字颜色
  //     'backColor',  // 背景颜色
  //     // 'link',  // 插入链接
  //     // 'list',  // 列表
  //     'justify',  // 对齐方式
  //     // 'quote',  // 引用
  //     // 'emoticon',  // 表情
  //     'image',  // 插入图片
  //     // 'table',  // 表格
  //     // 'video',  // 插入视频
  //     // 'code',  // 插入代码
  //     'undo',  // 撤销
  //     'redo'  // 重复
  //   ];

  //   /**
  //    * 限制 10M
  //    * @type {number}
  //    */
  //   editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
  //   editor.customConfig.uploadImgHooks={
  //     customInsert:function(insertImg, result, editor){
  //       // if(result.code =='0'){
  //       if(result.result){
  //         // let img=decodeURIComponent(result.data[0].full_url);
  //         let img=decodeURIComponent(G.serverUrl+result.data.picturePath);
  //         insertImg(img);
  //       }else{
  //         alert(result.msg)
  //       }
  //     }
  //   }
    
  //   editor.create();
  //   editor.txt.html(nextProps.value||"");
  //   this.editor=editor;
  // }

  componentDidMount(){
    let editor = new WangEditor(`#${this.editorId}`);
    let onChange =this.props.onChange;

    // 配置服务器端地址
    // editor.customConfig.uploadImgServer = '/upload'

    editor.customConfig.onchange=(html)=>{
      onChange && onChange(html);
    }
    // let opts = JSON.parse(Session.getSession("requestConfig"));
    // editor.customConfig.uploadImgServer=G.serverUrl + "/api/web/manager_school_news/add_contentPicture";
    // editor.customConfig.uploadFileName = 'files';
    // editor.customConfig.uploadImgParams={
    //  data:JSON.stringify({ uid:this.chosedId}),
    //  token:opts.token,
    //  orgCode:opts.orgcode
    // }

    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    // editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器

    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false

    // 自定义菜单配置
    editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      // 'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      // 'video',  // 插入视频
      // 'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];

    /**
     * 限制 10M
     * @type {number}
     */
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
    editor.customConfig.uploadImgHooks={
      customInsert:function(insertImg, result, editor){
        // if(result.code =='0'){
        if(result.result){
          // let img=decodeURIComponent(result.data[0].full_url);
          let img=decodeURIComponent(G.serverUrl+result.data.picturePath);
          insertImg(img);
        }else{
          alert(result.msg)
        }
      }
    }
    editor.customConfig.fontNames = [
        '宋体',
        '仿宋',
        '微软雅黑',
        '黑体',
        '楷体',
        'Arial',
        'Tahoma',
        'Verdana'
    ]
    
    editor.create();
    editor.txt.html(this.props.value||"");
    this.editor=editor;
  }

  // componentWillReceiveProps(nextProps){
  //   let editor = new WangEditor(`#${this.editorId}`);
  //   // 配置服务器端地址
  //   // editor.customConfig.uploadImgServer = '/upload'

  //   editor.customConfig.onchange=(html)=>{
  //     onChange && onChange(html);
  //   }
  //   let opts = JSON.parse(Session.getSession("requestConfig"));
  //   editor.customConfig.uploadImgServer=G.serverUrl + "/api/web/manager_school_news/add_contentPicture";
  //   editor.customConfig.uploadFileName = 'files';
  //   editor.customConfig.uploadImgParams={
  //    data:JSON.stringify({ uid:nextProps.chosedId}),
  //    token:opts.token,
  //    orgCode:opts.orgcode
  //   }

  // }
    
  // componentWillReceiveProps(nextProps){
    // if(nextProps.value ===void 0){ // invoke form.resetFields
    //   this.editor.txt.clear();
    // }
  // }
  
  // 仅在需要的时候才使用此函数，避免双向绑定带来的各种问题
  setEditorValue(value){
    this.editor.txt.html(value);
  }

  getHtml = () => {
    return this.editor.txt.html();
  }

  getText = () => {
    return this.editor.txt.text();
  }
  
  render() {
    return (<div id={this.editorId}/>)
  }
}