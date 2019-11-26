import React, { Component } from 'react';
import { Button, Checkbox, message } from 'antd';
import default1 from './../../icon/default_banner.png';
import { connect } from 'react-redux';
import { setTopRecommendCur_ac, getOneLesCurList_ac, getTopRecommendCurList_ac, setTopCurThumbImg_ac } from './../../redux/b_managerClassDetail.reducer';
import { withRouter } from 'react-router-dom';
import { UploadSpinLoad } from './../common';
@withRouter
@connect(
  state => state.B_ManagerClassManDetaileReducer,
  { setTopRecommendCur_ac, getOneLesCurList_ac, getTopRecommendCurList_ac, setTopCurThumbImg_ac }
)
export default class Mm_DetailSettopImg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      srcData: '',
      checkValue: true,
      preView: ''
    }
  }


  /**
   * 是否选择默认图片
   */
  checkChange = (e) => {
    if (e == 'div') {
      this.setState({
        checkValue: !this.state.checkValue
      })
    }
    else {
      this.setState({
        checkValue: e.target.checked
      })
    }
  }

  /**
   * 上传图片
   */
  handleUploadImg = (e) => {
    const target = e.target;
    const file = target.files[0];

    if (!file && this.state.checkValue) {
      this.setState({
        srcData: default1,
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
              checkValue: false,
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
   * 设置置顶
   */
  comfirClick = () => {
    let ID = this.props.ID;
    let srcData = this.state.srcData;

    if (this.state.checkValue) {
      var _this = this;
      convertImgToBase64(default1, function (base64Img) {
        //转化后的base64
        _this.props.setTopCurThumbImg_ac(
          {
            curResourceId: ID,
            reason: '',
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
          this.props.setTopRecommendCur_ac(
            {
              curResourceId: ID,
              reason: '',
              file: srcData
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


  /**
   * 删除上传图片
   */

  deleteUploadImg = () => {
    this.setState({
      srcData: default1,
      checkValue: true,
      preView: ''
    });
  }

  componentWillReceiveProps(nextprops) {
    let setTop = nextprops.setTop_data;
    if (this.props.setTop_data != setTop) {
      if (setTop.result) {
        message.success('置顶成功');
        this.props.closeModal();
        const curID = this.props.match.params.id;
        let obj = JSON.parse(decodeURIComponent(curID));
        this.props.getOneLesCurList_ac(obj);
        this.props.getTopRecommendCurList_ac();
      } else {
        message.error(setTop.message)
      }
      this.setState({ ModalShowOrHide: false })
    }
  }

  render() {
    const styleCss = {
      container: {
        margin: '20px 50px',
      },
      uploadBtn: {
        display: 'block',
        width: 140,
        height: 50,
        textAlign: 'center',
        lineHeight: '50px',
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
        marginLeft: 20,
        paddingTop: 5,
      },
      img: {
        width: '100%',
        height: 115,
        position: 'absolute',
        borderRadius: 15,
      },
      preImg: {
        width: '100%',
        height: 115,
        borderRadius: 15,
      },
      buttons: {
        textAlign: 'center',
        padding: '20px 0'
      },
      checkBtn: {
        margin: '10px 0 0 10px',
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
          <div style={styleCss.uploadImg}>
            <p>图片尺寸：1920 * 500px</p>
            <p>图片格式：.jpg 、.jpeg、.png</p>
          </div>
        </div>
        {
          this.state.preView
            ?
            <div style={{ position: 'relative' }}>
              <svg className="icon" aria-hidden="true" style={styleCss.deleteImg} onClick={this.deleteUploadImg}>
                <use xlinkHref={"#icon-close"}></use>
              </svg>
              <img style={styleCss.preImg} src={this.state.preView} />
            </div>
            :
            <div>
              <p>默认图片</p>
              <div style={{ ...styleCss.flexDiv, height: 115, position: 'relative' }}>
                <img src={default1} style={styleCss.img} onClick={() => this.checkChange('div')} />
                <Checkbox checked={this.state.checkValue} style={styleCss.checkBtn} onClick={this.checkChange}> </Checkbox>
              </div>
            </div>
        }



        <div style={styleCss.buttons}>
          <Button className="lxx-s-blue hf-m-button" onClick={this.comfirClick}>确定</Button>
          <Button className="lxx-s-wathet hf-m-button" onClick={this.props.closeModal}>取消</Button>
        </div>

        <UploadSpinLoad ModalShowOrHide={this.state.ModalShowOrHide} />
      </div>
    )
  }
}
