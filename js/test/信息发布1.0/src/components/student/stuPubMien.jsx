/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-23 15:22:16
 * 发布风采组件
 */
import React, { Component } from 'react';
import { Upload, Button, Icon, Input, Spin } from 'antd';
import { error} from './index.js';
import { SVG } from './../base.js';
import { G } from '../../js/g.js';
import _x from '../../js/_x/index.js';
import '../../css/student/stuPubMien.css';

const { TextArea } = Input;
var stut = true;

export class StuPubMien extends Component {
  constructor(props){
    super(props);
    this.state = {
      textNum: 0,
      titleNum: 0,
      mienData: {
        "id": "",
        "classId": "",
        "title": "", 
        "content": "",
        "cover": "",
        "createTime": "",
        "images": []
      },
      fileList: [],
      // saveFileData: [],
      title: '',
      content: '',
    }
  }
  componentWillMount(){
    this.setState({
      mienData: this.props.data
    })
    // 接收父组件的值并判断存入对应state
    this.getUploadMienData(this.props.data);
  }

  // 接收父组件的值并判断存入对应state
  getUploadMienData(data){
    // 将照片地址存入state
    if(data.images){
      this.setState({
        fileList: data.images
      })
    } else {
      this.setState({
        fileList: []
      })
    }
    // 将标题存入state
    if(data.title){
      this.setState({
        title: data.title,
        titleNum: data.title.length
      })
    } else {
      this.setState({
        title: '',
        titleNum: 0
      })
    }
    // 将内容存入state
    if(data.content){
      this.setState({
        content: data.content,
        textNum: data.content.length
      })
    } else {
      this.setState({
        content: '',
        textNum: 0
      })
    }
  }


  // 上传图片
  uploadMeinImg(e){
    let files = e.target.files;
    // console.log(files);
    if(!files.length) {
      return
    } else {
      let saveFileData = [];
      for(let i = 0; i < files.length; i++) {
        saveFileData.push(files[i]);
      }
      this.setState({
        saveFileData: saveFileData
      },() => {
        for(let j in saveFileData) {
          this.fileSize(saveFileData[j]);
          if(!stut){
            stut = true;
            this.setState({
              saveFileData: []
            })
            return
          } else {
            if(parseInt(j) + 1 === saveFileData.length){
              this.uploadImgFile(saveFileData);
            }
          }
        }
      })
    }
  }

  // 判断上传文件大小
  fileSize(file){
    let size = file.size;
    // 1MB
    let MB = 1024 * 1024;
    if(size/MB > 10){
      error('单照照片不能超过10M，请确认后重新上传');
      stut = false
    } else {
      // 判断文件格式
      this.fileFormat(file);
    }
  }

  // 判断上传文件格式
  fileFormat(file){
    let type = file.type;
    if(type.indexOf('/') > -1){
      let spstr = type.split("/");
      let fm = spstr[1];
      if(fm !== "mbp" && fm !== "jpeg" && fm !== "jpg" && fm !== "png"){
        error('请输入格式为mbp/jpeg/jpg/png的照片');
        stut = false
      }
    }
  }

  // 上传所选照片
  uploadImgFile(fileList){
    document.getElementById('lxx-upImg').value = '';
    this.setState({
      saveFileData: []
    })
    // ajax上传照片
    let pr = {
      action: 'api/web/monitor_class_for_students/class_style/upload_images',
      data: {
        "id": this.state.mienData.id,
      },
      file: fileList
    }
    _x.util.request.formRequest(pr, (res) => {
      if(res.result) {
        let data = res.data.images;
        let fileList = this.state.fileList;
        if(data){
          if(!fileList.length){
            // 传值封面
            this.props.getMienDataChange({
              cover: data[0]
            });
            var obj = {cover: data[0], images: data};
            var t = this.state.mienData;
            for (var k in obj) {
              t[k] = obj[k];
            }
            this.setState({
              mienData: t
            })
          }
          for (let i in data) {
            fileList.push(data[i]);
          }
          this.setState({
            fileList: fileList,
          }, () => {
            // 传值照片
            this.props.getMienDataChange({id: res.data.id,images: fileList});
          })
        }
      } else {
        error(res.message)
      }
    })
  }

  // 监控内容输入框
  changePublishCnt(e) {
    let textCnt = e.target.value;
    this.setState({
      textNum: textCnt.length,
      content: textCnt
    })
    // 传值风采内容
    this.props.getMienDataChange({content: textCnt});
  }

  // 监控标题输入框
  changePublishTil(e) {
    let textCnt = e.target.value;
    this.setState({
      title: textCnt,
      titleNum: textCnt.length
    })
    // 传值风采标题
    this.props.getMienDataChange({title: textCnt});
  }
  
  // 设置封面
  handleSetCover(url) {
    // 传值封面
    this.props.getMienDataChange({
      cover: url
    },()=>{
      var obj = {cover: url};
      var t = this.state.mienData;
      for (var k in obj) {
          t[k] = obj[k];
      }
      this.setState({
        mienData: t
      })
    })
  }

  // 删除风采中的某张照片
  handleDeletImg(url, i) {
    let fileList = this.state.fileList;
    if(fileList[i] === url) {
      fileList.splice(i, 1);
    }
    this.setState({
      fileList: fileList,
    })
    // 判断删除的是否是封面
    let cover = this.state.mienData.cover;
    var obj = {};
    if(cover === url) {
      if(!fileList.length) {
        obj = {cover: "", images: fileList};
      } else {
        obj = {cover: fileList[0], images: fileList};
      }
    } else {
      obj = {images: fileList}
    }
    var t = this.state.mienData;
    for (var k in obj) {
        t[k] = obj[k];
    }
    this.setState({
      mienData: t
    }, () => {
      // 传值给父组件
      this.props.getMienDataChange(this.state.mienData);
    })
  }

  componentDidUpdate(){
    // 更新单个班级风采
    if(this.state.mienData !== this.props.data){
      console.log(this.props.data);
      this.setState({
        mienData: this.props.data,
      })
      
      // 接收父组件的值并判断存入对应state
      this.getUploadMienData(this.props.data);

    }
  }


  render(){
    let data = this.state.mienData,
      fileList = this.state.fileList;

    return (
      <div>
        <p>
          <span>标题：</span>
          <Input 
            value={this.state.title}
            maxLength="50" 
            placeholder="请输入标题"
            onChange={this.changePublishTil.bind(this)} />
          <label className="lxx-me-u-textNum"><span>{this.state.titleNum}</span>/50</label>
        </p>
        <p>
          <span>内容：</span>
          <TextArea
          rows={8} 
          maxLength="300" 
          placeholder="请输入发布内容"
          value={this.state.content}
          onChange={this.changePublishCnt.bind(this)}
           />
           <label className="lxx-me-u-textNum"><span>{this.state.textNum}</span>/300</label>
        </p>
        <div>
          <div id="lxx-upload">
            <input
              id="lxx-upImg"
              type="file"
              multiple="multiple"
              name="files"
              onChange={this.uploadMeinImg.bind(this)} />
            <button>
              <svg className="icon" aria-hidden="true">
                  <use xlinkHref={"#icon-upload" }></use>
              </svg>
              上传照片
            </button>
          </div>
          <span>单张照片最大10M 格式为png/jpg/jpeg/mbp</span>
        </div>
        <div className="lxx-me-g-imgShow">
          <p>照片</p>
          <div>
            {
              fileList.length > 0 
              ?
              fileList.map((item, index) =>{
                return(
                  <div key={index} className="lxx-me-m-img">
                    <div className="lxx-ea-g-edit">
                      <SVG type="down"></SVG>
                      <div>
                        <p onClick={this.handleSetCover.bind(this, item)}>设为封面</p>
                        <p onClick={this.handleDeletImg.bind(this, item, index)}>删除</p>
                      </div>
                    </div>
                    <div className={data.cover === item ? 'show' : 'hidden'}>
                      <span className="lxx-me-u-imgCover"></span>
                      <span className="lxx-me-u-coverName">封面</span>
                    </div>
                    <img src={G.serverUrl + item} />
                  </div>
                )
              })
              :
              <div className="lxx-g-noData">
                <img src={require('../../img/noData.png')} />
                <span>暂无照片</span>
              </div>
            }
            <div className="lxx-me-m-uploading" style={{display: "none"}}>
              <Spin/>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}