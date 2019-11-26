/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:17:07 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-22 14:21:23
 * 事迹风采头部详细信息
 */
import React, { Component } from 'react';
import {IMG} from '../base';
import {Button, Modal} from 'antd';
import { withRouter } from 'react-router-dom';
import {EditStoryStyle,error} from './index';
import {MyResource} from '../shared/myResource';
import Mask from '../shared/maskLayer';
import _x from '../../js/_x/index';
import {G} from '../../js/g.js';
import _ from 'lodash';
import '../../css/admin/storyStyleInfo.css';

class Storystyleinfo extends Component {
  constructor(){
    super();
    this.state = {
      editVisible:false,          //编辑信息框是否可见
      visible:'',                 //我的资源是否显示
    }
    this.file = [];
    this.uid = '';                //事记id
    this.maxsize = 10*1024*1024;  //10M 
  }

  componentDidMount(){
    if(this.props.match.params.uid){
      this.uid = this.props.match.params.uid;
    }
  }

  /**
   * 返回按钮
   */
  rtn = () => {
    this.props.history.goBack();
  };

  /**
   * 上传图片
   */
  upload = (uid,e) => {
    if(this.judgeFile(e.target.files[0])){
      var file = e.target.files[0];
      let req = {
        action:'api/web/information/manager_deed/upload',
        file:[file],
        data:{
          uid
        }
      };
      _x.util.request.formRequest(req,(ret)=>{
        if(ret.result){
          this.props.getPicData(1);
        }
      });
    }
    this.fileCover.value = '';
  };

  /**
   * 隐藏编辑模态框
   */
  hideModalEdit = () => {
    this.setState({
      editVisible:false
    });
  };

  /**
   * 显示编辑模态框
   */
  showModalEdit = (uid) => {
    this.setState({
      editVisible:true,
      uid
    });
  };

  //从资源引用点击事件
  popShow = () =>{
    this.setState({
      visible:true
    });
    this.refs['hj-mcm-pop'].show();
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
      let req = {
        action:'api/web/information/manager_deed/save_remote_pic',
        data:{
          fileName:thisSpan.dataset.filename,
          downloadUrl:thisSpan.dataset.download,
          uid:this.uid
        }
      }
      _x.util.request.formRequest(req,(ret) => {
        if(ret.result){
          this.props.getPicData(1);
        }
      })
      this.setState({
        visible:false
      });
      this.refs['hj-mcm-pop'].close();
    }else{
      error('请选择图片类型文件',1500);
    }
  };

  /**
   * 判断文件类型和大小
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
    const type = this.props.type;
    const data = this.props.data||{};
    return (
      <div className="cjy-ssi"> 
        <div className="cjy-ssi-coverBox">
          <IMG src={data.coverAddress?data.coverAddress:require('../../img/baby.png')}/>
        </div>
        <div className="cjy-ssi-headBox">
          <div><span className="cjy-ssi-title">{data.title}</span><span className="cjy-ssi-picTotal">共{data.total}张</span></div>
          <div className="cjy-ellip cjy-ssi-des">{data.description}</div>
          <div className="cjy-ssi-btnLine">
            <Button className="cjy-ssi-btn cjy-ssi-sure">
              从本地上传照片
              <input className="cjy-ssi-upload" type="file" ref={el => this.fileCover=el} onChange={(e)=>this.upload(data.uid,e)}/>
            </Button>
            <Button className="cjy-ssi-btn cjy-ssi-sure" onClick={this.popShow}>从我的资源引用</Button>
            <Button className="cjy-ssi-btn cjy-ssi-sure" onClick={()=>this.showModalEdit(data.uid)}>编辑信息</Button>
            <Button className="cjy-ssi-btn cjy-ssi-rtn" onClick={this.rtn}>返回</Button>
          </div>
        </div>
        <Modal className="cjy-modal" destroyOnClose="true" title={`编辑${type==='1'?'事记信息':'风采'}`} footer={null} visible={this.state.editVisible} onCancel={this.hideModalEdit}>
          <EditStoryStyle hideModalEdit={this.hideModalEdit} type={type} uid={this.state.uid} getData={this.props.getData}/>
          {/* <EditStoryStyle hideModalEdit={this.hideModalEdit} type="1" uid={this.state.uid} getData={this.getData}/> */}
        </Modal>
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

export const StoryStyleInfo =  withRouter(Storystyleinfo);