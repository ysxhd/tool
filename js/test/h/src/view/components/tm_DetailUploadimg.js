/*
 * @Author: hf 
 * @Date: 2018-08-02 11:16:20 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-03 16:10:24
 */

/**
 * 教师的课堂管理页面 > 课堂详情  上传录播资源封面
 */

import React from 'react';
import { Button, Radio } from 'antd';
import default1 from './../../icon/default_1.png';
import default2 from './../../icon/default_2.png';
import default3 from './../../icon/default_3.png';
import default4 from './../../icon/default_4.png';
import default5 from './../../icon/default_5.png';
import default6 from './../../icon/default_6.png';
import default7 from './../../icon/default_7.png';
import default8 from './../../icon/default_8.png';
import './../../css/tm_DetailUploadimg.css'
const RadioGroup = Radio.Group;

import { addCurCoverThumbImagea_ac, addUploadCurVideoCoverImage_ac, getCurDetailed_ac } from './../../redux/b_teacherClassDetail.reducer';
import { connect } from 'react-redux';
import { message } from 'antd'
import { withRouter } from 'react-router-dom';
import { UploadSpinLoad } from './../common';
@withRouter
@connect(
  state => state.B_TacherClassManDetailReducer,
  { addCurCoverThumbImagea_ac, addUploadCurVideoCoverImage_ac, getCurDetailed_ac }
)
export default class TmDetailUploadimg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      srcData: '',
      preView: '',
      defaultImg: default1
    }
  }

  /**
   * 上传图片
   */
  handleUploadImg = (e) => {
    const target = e.target;
    const file = target.files[0];

    if (!file) {//没上传本地图片
      this.setState({
        srcData: '',
        preView: ''
      })
    } else {
      if (file) {
        if (file.type.indexOf('jpg') > -1 || file.type.indexOf('jpeg') > -1 || file.type.indexOf('png') > -1) {
          let preView = '';
          let reader = new FileReader();
          reader.readAsDataURL(file);
          let _this = this;
          reader.onload = function (e) {
            preView = e.target.result;
            _this.setState({
              srcData: file,
              preView: preView
            });
          }
        } else {
          message.warning('请上传正确格式的图片，如：.jpg,.jpeg,.png')
        }

      } else {
        message.warning('未选择任何文件')
      }
    }


  }

  /**
   * 确认上传
   */
  comfirClick = () => {
    let ID = this.props.ID;
    let srcData = this.state.srcData;

    if (!this.state.srcData) {//没上传本地图片，则默认上传默认图片
      var _this = this;
      convertImgToBase64(this.state.defaultImg, function (base64Img) {
        //转化后的base64
        _this.props.addCurCoverThumbImagea_ac(
          {
            curResourceId: ID,
            thumbnailBase64Str: base64Img
          }
        )
      });

      //实现将项目的图片转化成base64
      //注释：此为网上找的代码，功能实现，但需改进
      function convertImgToBase64(url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
          ctx = canvas.getContext('2d'),
          img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL(outputFormat || 'image/png');
          callback.call(this, dataURL);
          canvas = null;
        };
        img.src = url;
      }


    } else {
      if (srcData) {
        if (srcData.type.indexOf('jpg') > -1 || srcData.type.indexOf('jpeg') > -1 || srcData.type.indexOf('png') > -1) {
          this.props.addUploadCurVideoCoverImage_ac(
            {
              curResourceId: ID,
              file: this.state.srcData
            }
          )
        } else {
          message.warning('请上传正确格式的图片，如：.jpg,.jpeg,.png')
        }
      } else {
        message.warning('请上传图片')
      }
    }

    this.setState({ ModalShowOrHide: true })
  }

  //选择默认图片
  onChange = (e) => {
    let defaultImg;
    switch (e.target.value) {
      case 1:
        defaultImg = default1;
        break;
      case 2:
        defaultImg = default2;
        break;
      case 3:
        defaultImg = default3;
        break;
      case 4:
        defaultImg = default4;
        break;
      case 5:
        defaultImg = default5;
        break;
      case 6:
        defaultImg = default6;
        break;
      case 7:
        defaultImg = default7;
        break;
      case 8:
        defaultImg = default8;
        break;
    }
    this.setState({
      defaultImg: defaultImg,
      value: e.target.value
    });
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.uploadImg_data != nextprops.uploadImg_data) {
      if (nextprops.uploadImg_data.result) {
        message.success('上传成功');
        const curID = this.props.match.params.id;
        this.props.getCurDetailed_ac(curID);
        this.props.closeModal();
      } else {
        message.error(nextprops.uploadImg_data.message);
      }
      this.setState({ ModalShowOrHide: false })
    }
  }


  /**
   * 删除上传图片
   */

  deleteUploadImg = () => {
    this.setState({
      srcData: '',
      preView: ''
    });
  }

  render() {
    const styleCss = {
      container: {
        margin: '40px 40px 0',
      },
      uploadBtn: {
        display: 'block',
        width: 140,
        height: 80,
        textAlign: 'center',
        lineHeight: '80px',
        borderRadius: 5,
        cursor: 'pointer'
      },
      icon: {
        fontSize: 18,
        marginRight: 5
      },
      flexDiv: {
        display: 'flex',
        margin: '10px 0',
      },
      uploadImg: {
        width: 140,
        height: 80,
        borderRadius: 5,
        marginLeft: 20,
      },
      defaultImg: {
        width: 140,
        height: 80,
        borderRadius: 5,
        overflow: 'hidden',
        marginRight: 20,
      },
      img: {
        width: 140,
        height: 80,
      },
      preImg: {
        width: 140,
        height: 80,
        borderRadius: 5,
      },
      deleteImg: {
        position: 'absolute',
        right: -5,
        top: -8,
        color: '#fff',
        width: 20,
        height: 20,
        padding: 3,
        background: '#ff4c4c',
        borderRadius: '50%',
        cursor: 'pointer'
      }
    };
    return (
      <div className="hf-tmdui-container">
        <div style={styleCss.container}>
          <div style={styleCss.flexDiv}>
            <div>
              <label htmlFor="upload" style={styleCss.uploadBtn} className="lxx-s-orange">
                <svg className="icon" style={styleCss.icon} aria-hidden="true">
                  <use xlinkHref={"#icon-upload"}></use>
                </svg>
                本地上传
              </label>
              <input type="file" id="upload" style={{ display: 'none' }} onChange={this.handleUploadImg} />
            </div>
            {
              this.state.preView
                ?
                <div style={{ position: 'relative', marginLeft: 20 }}>
                  <svg className="icon" aria-hidden="true" style={styleCss.deleteImg} onClick={this.deleteUploadImg}>
                    <use xlinkHref={"#icon-close"}></use>
                  </svg>
                  <img style={styleCss.preImg} src={this.state.preView} />
                </div>
                :
                null
            }

          </div>
          <p>默认图片</p>
          <RadioGroup disabled={this.state.preView} onChange={this.onChange} value={this.state.value}>
            <div style={styleCss.flexDiv}>
              <div style={styleCss.defaultImg}>
                <Radio value={1}> <img src={default1} style={styleCss.img} /></Radio>
              </div>
              <div style={styleCss.defaultImg}>
                <Radio value={2}><img src={default2} style={styleCss.img} /></Radio>
              </div>
              <div style={styleCss.defaultImg}>
                <Radio value={3}><img src={default3} style={styleCss.img} /></Radio>
              </div>
              <div style={{ ...styleCss.defaultImg, marginRight: 0 }}>
                <Radio value={4}><img src={default4} style={styleCss.img} /></Radio>
              </div>
            </div>
            <div style={styleCss.flexDiv}>
              <div style={styleCss.defaultImg}>
                <Radio value={5}><img src={default5} style={styleCss.img} /></Radio>
              </div>
              <div style={styleCss.defaultImg}>
                <Radio value={6}><img src={default6} style={styleCss.img} /></Radio>
              </div>
              <div style={styleCss.defaultImg}>
                <Radio value={7}><img src={default7} style={styleCss.img} /></Radio>
              </div>
              <div style={{ ...styleCss.defaultImg, marginRight: 0 }}>
                <Radio value={8}><img src={default8} style={styleCss.img} /></Radio>
              </div>
            </div>
          </RadioGroup>
        </div>
        <div className="hf-m-buttons">
          <Button className="lxx-s-blue hf-m-button" onClick={this.comfirClick}>确定</Button>
          <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
        </div>

        <UploadSpinLoad ModalShowOrHide={this.state.ModalShowOrHide} />
      </div>
    )
  }
}