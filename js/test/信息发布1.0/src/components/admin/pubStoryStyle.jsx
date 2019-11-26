/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:13:59 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-22 14:20:17
 * 发布事迹风采组件
 */
import React, { Component } from 'react';
import { Input, DatePicker, Button } from 'antd';
import { SVG, IMG } from '../base';
import {success, error} from './index';
import {MyResource} from '../shared/myResource';
import Mask from '../shared/maskLayer';
import moment from 'moment';
import _x from '../../js/_x/index';
import _ from 'lodash';
import '../../css/admin/pubStoryStyle.css';
import '../../css/admin/storyStyleInPic.css'

const { TextArea } = Input;

export class PubStoryStyle extends Component {
  constructor(){
    super();
    this.state = {
      title:'',         //标题
      intro:'',         //简介
      date:'',          //创建日期
      urlList:[],       //url列表,循环显示用
      sourList:[],      //资源图片url列表，提交数据用
      picList:[],       //本地上传的图片文件列表，提交数据用
      type:'1',          //1为校园2教师3学生
      visible:'',       //我的资源是否显示
      listVis:false,    //下拉框是否可见
      coverName:'',     //封面文件名
      F5:false,       //是否为初始化
      disabPub:false,   //发布按钮禁用
    };
    this.maxsize = 10*1024*1024;//10M 
  };

  componentDidMount(){
    this.setState({
      date:new Date(),
      type:this.props.type
    });
  };

  /**
   * 标题改变
   */
  changeTitle = (e) => {
    this.setState({
      title: e.target.value
    });
  };

  /**
   * 日期改变
   */
  changeDate = (date, dateString) => {
    this.setState({
      date:dateString
    });
  };

  /**
   * 内容改变
   */
  changeTxt = (e) => {
    this.setState({
      intro: e.target.value
    });
  };

  /**
   * 本地上传图片
   */
  upImg = (e) => {
    if(this.judgeFile(e.target.files[0])){
      var file = e.target.files[0];
      var reader = new FileReader();
      var picSrc = '';
      reader.readAsDataURL(file);
      let _that = this;
      reader.onload = function (e) {
        picSrc = this.result;
        let urlList = _that.state.urlList;
        let key=file.name;
        for (let i=0;i<urlList.length;i++){
          key=i;
        }
        urlList.unshift({
          key:key,
          fileName:file.name,
          url:picSrc,
          file:file
        })
        _that.setState({
          picList:[file,..._that.state.picList],
          urlList
        });
        
    }
  }
    this.fileCover.value = '';
  };

  /**
   * 发布按钮
   */
  pub = () => {
    if(this.state.title.trim()===''){
      error('请填写事记标题',1500);
    }else if(this.state.type==='1'&&this.state.date===''){
      error('请选择事记发布日期',1500);
    }else if(this.state.urlList.length===0){
      error('请至少上传一张图片',1500);
    }else{
      this.setState({
        disabPub:true
      });
      let req = {
        action:'api/web/information/manager_deed/save',
        file:this.state.picList,
        data:{
          uid:'',
          title:this.state.title,
          recordDate:this.state.date?Date.parse(this.state.date):'',
          description:this.state.intro,
          remotePictures:this.state.sourList,
          type:this.state.type,
          coverName:this.state.coverName?this.state.coverName:this.state.urlList[0].fileName
        }
      }
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          success('发布成功',1500);
          this.props.hideModalPss();
          this.props.getData(1);
        }
        this.setState({
          disabPub:false
        });
      });
    }
  };

  //从资源引用点击事件
  popShow = () =>{
    this.setState({
      visible:true
    });
    this.refs['hj-mcm-pop'].show();
  }

  /**
   * 操作栏是否可见
   */
  listVis = (e) => {
    e.stopPropagation();
    this.setState({
      listVis: !this.state.listVis
    })
  };

  /**
   * 设置封面
   */
  setCover = (fileName) => {
    this.setState({
      coverName:fileName,
      F5:true
    });
  };

  /**
   * 删除照片
   */
  del = (fileName) => {
   
    let urlList = this.state.urlList;
    let picList = this.state.picList;
    let sourList = this.state.sourList;
    let idx1 = _.findIndex(urlList,{fileName});
    //获取当前的序号，用splice删除当前的数组的图片
    urlList.splice(idx1,1);
    let idx2 = _.findIndex(picList,{name:fileName});
    picList.splice(idx2,1);
    let idx3 = _.findIndex(sourList,{fileName});
    sourList.splice(idx3,1);
    if(fileName===this.state.coverName){
      this.setState({
        coverName:'',
        urlList,
        picList,
        sourList
      });
    }else{
      this.setState({
        urlList,
        picList,
        sourList
      });
    }
  };

  //关闭资源引用弹窗
  quoteClose = () =>{
    this.setState({
        visible:false
    });
    this.refs['hj-mcm-pop'].close();
  }

  //从我的资源引用
  quoteIcon = (e) =>{
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
    let type=thisSpan.dataset.type.toLowerCase();
    if(  type=="jpg" ||type=="png" ||type== "bmp" ||type== "jpeg"){
      let idx = _.findIndex(this.state.urlList,{fileName:thisSpan.dataset.filename});
      if(idx===-1){
        let sourList = this.state.sourList;
        let urlList = this.state.urlList;
        sourList.unshift({
          url:thisSpan.dataset.download,
          fileName:thisSpan.dataset.filename
        });
        urlList.unshift({
          url:thisSpan.dataset.download,
          fileName:thisSpan.dataset.filename
        });
        this.setState({
          sourList,
          urlList,
          visible:false
        });
        this.refs['hj-mcm-pop'].close();
      }else{
        error('该照片已存在',1500);
      }
    }else{
      error('请选择图片文件',1500);
    }
  };

  /**
   * 判断文件是否已存在以及类型和大小
   */
  judgeFile = (file) => {
    let idx = _.findIndex(this.state.urlList,{fileName:file.name});
    if(idx===-1){
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
    }else{
      error('该照片已存在',1500);
    }
  }

  render(){
    return (
      <div className="cjy-pss">
        <div className="cjy-modal cjy-pss-leftModal">
          <div className="ant-modal-content">
            <button className="ant-modal-close">
              <span className="ant-modal-close-x" onClick={this.props.hideModalPss}></span>
            </button>
            <div className="ant-modal-header">
              <div className="ant-modal-title">发布{this.state.type==='1'?'校园大事记':'风采'}</div>
            </div>
            <div className="ant-modal-body">
              <div className="cjy-pss-titleLine">
                <span className="cjy-label">{this.state.type==='1'?'事记':'风采'}标题：</span>
                <Input maxLength="50" onChange={this.changeTitle}/>
                <div className="cjy-pss-titleLen">{this.state.title?this.state.title.length:0}/50</div>
              </div>
              {
                this.state.type==='1'
                ? <div className="cjy-pss-dateLine">
                  <span className="cjy-label">事记日期：</span>
                  <DatePicker onChange={this.changeDate} defaultValue={moment(new Date(), 'YYYY/MM/DD')}></DatePicker>
                </div>
                : ''
              }
              <div className="cjy-pss-top20 cjy-pss-introLine">
                <span className="cjy-label">{this.state.type==='1'?'事记':'风采'}简介：</span>
                <TextArea maxLength="500" onChange={this.changeTxt}/>
                <div className="cjy-pss-introLen">{this.state.intro?this.state.intro.length:0}/500</div>
              </div>
              <div className="cjy-pss-upPicLine">
                <div className="cjy-pss-upPicBox">
                  <div className="cjy-pss-upPic">
                    <SVG type="quote"/>
                    <div>上传照片</div>
                  </div>
                  <input className="cjy-pss-file" ref={el=>this.fileCover=el} type="file" onChange={this.upImg}/>
                </div>
                <div className="cjy-pss-referBox" onClick={this.popShow}>
                  <div className="cjy-pss-refer">
                    <SVG type="quote"/>
                    <div>引用资源</div>
                  </div>
                </div>
              </div>
              <div className="ant-modal-footer">
                <Button className="cjy-btn cjy-orange-sure" disabled={this.state.disabPub} onClick={this.pub}>发布</Button>
                <Button className="cjy-btn" onClick={this.props.hideModalPss}>取消</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="cjy-modal cjy-pss-rightModal">
          <div className="ant-modal-content">
            <div className="ant-modal-header">
              <div className="ant-modal-title">照片（{this.state.picList.length}）</div>
            </div>
            <div className={`cjy-pss-picBody ${this.state.type==='1'?'cjy-pss-lHeight':'cjy-pss-sHeight'}`}>
              {
                this.state.urlList.map(ul=> (
                  <div key={ul.fileName} className={`cjy-pss-imgBox ${ul.fileName===this.state.coverName?'cjy-pss-cover':''}`}>
                    <IMG src={ul.url}/>
                    {
                      ul.fileName===this.state.coverName
                      ? ''
                      : <div className="cjy-ssip-dropBox">
                        <ul className={`ant-dropdown-menu ${this.state.listVis?'cjy-ssip-block':'cjy-ssip-none'}`}>
                          <li className="ant-dropdown-menu-item" onClick={(e) => this.setCover(ul.fileName,e)}>
                            设为封面
                          </li>
                          <li className="ant-dropdown-menu-item" onClick={(e) => this.del(ul.fileName,e)}>
                            删除
                          </li>
                        </ul>
                        <span className="cjy-ssip-drop" onClick={this.listVis}><SVG type="down"/></span>
                      </div>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <Mask ref = 'hj-mcm-pop' />
        {
          this.state.visible
          ? <MyResource quoteClose = {this.quoteClose}  quoteIcon = {this.quoteIcon} />
          : ''
        }
      </div>
    );
  }
}