/*
 * @Author: junjie.lean 
 * @Date: 2018-07-19 16:46:34 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-03 17:02:01
 */
/**
 * 公共组件库
 */

import React, { Component } from 'react';
import ReactLoading from "react-loading";
import _ from 'lodash';
import { Spin, Icon, Modal, Button, Row, Col } from 'antd';
import G from './../js/g';
import { _x } from './../js/index';
import './../view/common.css';
import './../css/public.css';
import Bexcel from './../icon/excel_b.png';
import Bmp3 from './../icon/mp3_b.png';
import Bmp4 from './../icon/mp4_b.png';
import Bjpg from './../icon/jpg_b.png';
import Bpdf from './../icon/pdf_b.png';
import Bppt from './../icon/ppt_b.png';
import Bswf from './../icon/swf_b.png';
import Btxt from './../icon/txt_b.png';
import Bword from './../icon/word_b.png';
import Bzip from './../icon/zip_b.png';
import Bother from './../icon/other_b.png';

import Sexcel from './../icon/excel_s.png';
import Smp3 from './../icon/mp3_s.png';
import Smp4 from './../icon/mp4_s.png';
import Sjpg from './../icon/jpg_s.png';
import Spdf from './../icon/pdf_s.png';
import Sppt from './../icon/ppt_s.png';
import Sswf from './../icon/swf_s.png';
import Stxt from './../icon/txt_s.png';
import Sword from './../icon/word_s.png';
import Szip from './../icon/zip_s.png';
import Sother from './../icon/other_s.png';
import Sfolder from './../icon/folder.png';



/**
 * 字体图标
 */
export class SVG extends Component {
  render() {
    let style = {};
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;
    if (this.props.color) style.color = this.props.color;

    let _className;
    if (this.props.className) {
      _className = `icon ${this.props.className}`;
    } else {
      _className = 'icon';
    }


    /**增加点击事件 */
    let clickHandle = () => {
      if (this.props.onClick) {
        return this.props.onClick;
      } else {
        return () => { }
      }
    }

    return (
      <svg title="" className={_className} aria-hidden="true" style={style} onClick={clickHandle()}>
        <use xlinkHref={"#icon-" + this.props.type}>
          <title>{this.props.title || this.props.type}</title>
        </use>
      </svg>
    );
  }
}

/**
 * 虚拟容器，直接返回内容
 * @param {*} props 
 */
export const Container = function (props) {
  return props.children;
}

/**
 * loading
 */
export class SpinLoad extends Component {
  render() {
    return (<div className="lxx-g-loading">
      <ReactLoading type="bars" color="#3C96EF" />
      <span>数据加载中...</span>
    </div>
    )
  }
}

/**
 *统一样式弹出框
 */
export class HfModal extends Component {
  render() {
    let { ModalShowOrHide = false, width = 10, title = 'xx', closeModal = () => { }, contents } = this.props;
    return (
      <Modal
        className="lxx-g-layout"
        title={null}
        visible={this.props.ModalShowOrHide}
        footer={null}
        closable={false}
        width={width}
        destroyOnClose={true}
      >
        <div className="hf-m-titleBar">
          <div className="hf-m-title">
            {title}
          </div>
          <div className="hf-m-close" onClick={this.props.closeModal}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-close"}></use>
            </svg>
          </div>
        </div>
        <div>
          {contents}
        </div>
      </Modal>
    )
  }
}

/**
 * 信息提示
 */

/**
 * 资源发布类型
 * 0录播，1导学，2教案，3教材,4素材，5习题，6课件，7其他
 */
export class PubType extends Component {
  render() {
    let color, text;
    switch (this.props.pubType) {
      case 0:
        color = '#6478fb';
        text = '录播';
        break;
      case 1:
        color = '#4eadff';
        text = '导学';
        break;
      case 2:
        color = '#f79534';
        text = '教案';
        break;
      case 3:
        color = '#44d58d';
        text = '教材';
        break;
      case 4:
        color = '#f55642';
        text = '素材';
        break;
      case 5:
        color = '#72cb00';
        text = '习题';
        break;
      case 6:
        color = '#44d58d';
        text = '课件';
        break;
      default:
        color = '#9d62ff';
        text = '其他';
        break;
    };
    const styleCss = {
      type: {
        width: 36,
        height: 22,
        textAlign: 'center',
        lineHeight: '22px',
        background: color,
        color: '#fff',
        borderRadius: 5,
        marginRight: 10
      }
    }
    return (
      <div style={styleCss.type}>{text}</div>
    )
  }
}

/**
 * 资源类型图片
 */
export class ResFormat extends Component {
  render() {
    let Img;
    let { size = 'big', fileType, resFormat = '' } = this.props;
    // console.log(size, fileType, resFormat)
    if (size == 'big') {
      switch (fileType) {
        case 1:  // 图片
          Img = <img src={Bjpg} />
          break;
        case 2:  // 文档
          if (resFormat == 'pdf') {
            Img = <img src={Bpdf} />
          } else if (resFormat == "xls" || resFormat == "xlsx") {
            Img = <img src={Bexcel} />
          } else if (resFormat == "txt") {
            Img = <img src={Btxt} />
          } else if (resFormat == "doc" || resFormat == "docx") {
            Img = <img src={Bword} />
          } else if (resFormat == "ppt") {
            Img = <img src={Bppt} />
          } else if (resFormat == "zip") {
            Img = <img src={Bzip} />
          } else {
            Img = <img src={Bother} />
          }
          break;
        case 3:  // 视频
          if (resFormat == "swf") {
            Img = <img src={Bswf} />
          } else {
            Img = <img src={Bmp4} />
          }
          break;
        case 4:  // 音频
          Img = <img src={Bmp3} />
          break;
        case 5:  // 其他
          Img = <img src={Bother} />
          break;
        default:
          Img = <img src={Bother} />
          break;
      }
    } else if (size == 'small') {
      switch (fileType) {
        case 1:  // 图片
          Img = <img src={Sjpg} />
          break;
        case 2:  // 文档
          if (resFormat == 'pdf') {
            Img = <img src={Spdf} />
          } else if (resFormat == "xls" || resFormat == "xlsx") {
            Img = <img src={Sexcel} />
          } else if (resFormat == "txt") {
            Img = <img src={Stxt} />
          } else if (resFormat == "doc" || resFormat == "docx") {
            Img = <img src={Sword} />
          } else if (resFormat == "ppt" || resFormat == "pptx") {
            Img = <img src={Sppt} />
          } else if (resFormat == "zip") {
            Img = <img src={Szip} />
          } else {
            Img = <img src={Sother} />
          }
          break;
        case 3:  // 视频
          if (resFormat == "swf") {
            Img = <img src={Sswf} />
          } else {
            Img = <img src={Smp4} />
          }
          break;
        case 4:  // 音频
          Img = <img src={Smp3} />
          break;
        case 5:  // 其他
          Img = <img src={Sother} />
          break;
        default:
          Img = <img src={Sother} />
          break;
      }
    }

    return (
      <div>{Img}</div>
    )
  }
}

//通用下载组件
export class DownloadFile extends Component {
  /**
   * 下载标识
   * definition 标清 ld ; 高清 hd ; 课堂录播未知格式 undfine ; 云盘及关联资源 un
   */

  /**
   * 下载
   */

  constructor(props) {
    super(props);
  }

  handleDownloadRes() {
    let params = this.props.params;
    let downUrl = G.dataServices + '/default/downResource/';
    downUrl += G.paramsInfo.orgcode + '/' + params.resourceId + '/' + params.definition;
    window.open(downUrl);
    this.props.closeModal();
  }

  render() {
    if (!this.props.params) {
      return false
    }
    let params = this.props.params,
      resSize = params.resSize;
    let size;
    if (typeof resSize === 'number') {
      size = resSize.formatSize()
    } else if (typeof resSize === 'string') {
      if (resSize.indexOf('B') > -1) {
        size = resSize
      } else {
        size = 0
      }
    } else {
      size = 0
    }
    // let size = resSize ? toString(resSize).indexOf('B') > -1 ? resSize : resSize.formatSize() : 0;

    return (
      <HfModal
        ModalShowOrHide={this.props.isShow}
        closeModal={this.props.closeModal}
        width={380}
        title="下载文件"
        contents={<div className="lxx-g-download">
          <Row type="flex" align="middle">
            <Col span={4}>
              <SVG type="hint"></SVG>
            </Col>
            <Col span={20}>
              <div className="lxx-dl-g-cnt lxx-m-flex">
                <p>您确定要下载文件【{params.resName}】?</p>
                <p>{resSize ? <span>大小：{size}，</span> : ''} 格式：{params.resFormat}</p>
              </div>
            </Col>
          </Row>
          <div className="lxx-dl-g-btn">
            <Button className="lxx-s-blue" onClick={this.handleDownloadRes.bind(this)}>下载</Button>
            <Button className="lxx-s-wathet" onClick={this.props.closeModal}>取消</Button>
          </div>
        </div>} />
    )
  }
}


/**
 * 上传进度条 
 */
export class UploadSpinLoad extends Component {
  render() {
    let { ModalShowOrHide = false, closeModal = () => { } } = this.props;
    return (
      <Modal
        className="lxx-g-layout"
        title={null}
        visible={this.props.ModalShowOrHide}
        footer={null}
        closable={false}
        width={300}
        destroyOnClose={true}
      >
        <div className="hf-m-titleBar">
          <div className="hf-m-title">
            正在上传中
          </div>
        </div>
        <div style={{ background: '#fff', width: '100%', height: 200 }}>
          <div className="lxx-g-loading">
            <ReactLoading type="bars" color="#3C96EF" />
            <span>正在上传...</span>
          </div>
        </div>
      </Modal>
    )
  }
}