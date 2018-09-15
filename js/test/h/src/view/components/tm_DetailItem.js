/*
 * @Author: hf 
 * @Date: 2018-08-01 14:58:48 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 17:28:05
 */

/**
 * 教师的课堂管理页面 > 课堂详情 资源列表集
 */

import React from 'react';
import { Tooltip, Button, Input, message } from 'antd';
import { ResFormat, PubType, DownloadFile } from './../common';
import '../../js/_x/util/sundry';
import { modifyResDes_ac, modifyCurResInfo_ac, getCurDetailed_ac } from './../../redux/b_teacherClassDetail.reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { handleModalShow } from './../../redux/lxx.download.reducer';
import url from './../../js/_x/util/url';

const goWith = url.goWith;
const { TextArea } = Input;
@withRouter
@connect(
  state => state,
  { modifyResDes_ac, modifyCurResInfo_ac, getCurDetailed_ac, handleModalShow }
)
export default class TmDetailItem extends React.Component {
  constructor() {
    super()
    this.state = {
      editable: false,
      pubDesc: ''
    }
  }

  //修改课堂名
  handleEdit = () => {
    this.setState({
      editable: true
    })
  }

  /**
   * 编写简介
   */
  pubDescChange = (e) => {
    this.setState({
      pubDesc: e.target.value
    })
  }

  /**
   * 保存修改
   * id:资源id
   * pubType:发布类型
   */
  saveEdit = (id, pubType) => {
    if (this.state.pubDesc != '') {
      this.props.modifyResDes_ac({
        curResourceId: this.props.match.params.id,
        resourceId: id,
        pubType: pubType,
        pubDesc: this.state.pubDesc
      });
    }

    this.setState({
      editable: false
    })
  }

  /**
   * 取消修改
   */

  cancelEdit = () => {
    this.setState({
      editable: false
    })
  }

  /**
   * 取消关联
   * id:资源id
   * pubType:发布类型
   */
  cutRelation = (id, pubType) => {
    this.props.modifyCurResInfo_ac({
      curResourceId: this.props.match.params.id,
      resourceId: id,
      pubType: pubType
    })
  }
  /**
  * 下载资源
  */
  docDownload = (src) => {
    // 显示下载弹窗
    this.props.handleModalShow(true, src);
  }

  /**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
   * 跳转到播放页
   * id:文件id
   * sourceType:资源类型
   */

  jumpToVideo = (id, sourceType) => {

    let url = {
      to: 'q_replayVideo',
      with: ['teacher', id, '']
    },
      video, audio, pdf, pic;
    video = sourceType === 'avi' || sourceType === 'mov' || sourceType === 'mpeg' || sourceType === 'mp4' || sourceType === 'rmvb' || sourceType === 'rm' || sourceType === 'dat' || sourceType === 'ts' || sourceType === 'wmv' || sourceType === 'flv'
    audio = sourceType === 'mp3' || sourceType === 'wma' || sourceType === 'wav'
    pdf = sourceType === 'txt' || sourceType === 'pdf' || sourceType === 'doc' || sourceType === 'docx' || sourceType === 'xls' || sourceType === 'xlsx' || sourceType === 'ppt' || sourceType === 'pptx'
    pic = sourceType === 'jpeg' || sourceType === 'jpg' || sourceType === 'bmp' || sourceType === 'png' || sourceType === 'gif'

    if (video) {
      url.with[2] = 'video';
    } else if (audio) {
      url.with[2] = 'audio';
    } else if (sourceType == "other" || sourceType == "zip" || sourceType == "exe") {
      url.with[2] = 'unable';
    } else if (pic) {
      url.with[2] = 'pic';
    } else if (sourceType == "swf") {
      url.with[2] = 'swf';
    } else if (pdf) {
      url.with[2] = 'pdf';
    }
    goWith(url);

  }

  /**
   * 根据条件，判断改资源是否可修改简介和取消关联
   * curFinishStatus: 课堂完成状态，-1未开始，0进行中，1已完成(1)
   * vodPubStatus: 点播发布状态:-2空课堂，-1审核未通过，0未申请，1申请中，2审核通过(2.1)
   * videoSaveStatus:录播视频状态 -1抓取失败，0抓取中，1已抓取，2人工上传(3)
   */
  showOrHideByParam = () => {
    const { curFinishStatus, vodPubStatus, livePubStatus } = this.props.curStatus;
    let flag = true;
    if (curFinishStatus == 1) {
      if (vodPubStatus == -2 || vodPubStatus == 1 || vodPubStatus == 2) {
        flag = false
      }
    } else {
      if (livePubStatus == 1 || livePubStatus == 2) {
        flag = false
      }
    }
    return flag
  }

  render() {
    const data = this.props.data;
    const { curFinishStatus, vodPubStatus, livePubStatus } = this.props.curStatus;
    let flag = this.showOrHideByParam();
    const styleCss = {
      itemBox: {
        border: '1px solid #ccc',
        marginBottom: 20,
        padding: 20,
        display: 'flex',
      },
      flex1: {
        flex: 1
      },
      image: {
        width: 95,
        height: 114,
        marginRight: 20
      },
      flexDiv: {
        display: 'flex',
      },
      cName: {
        maxWidth: 400,
        fontSize: 18,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      },
      icon: {
        fontSize: 24,
        marginLeft: 20,
        color: '#b8b8b8'
      },
      textBox: {
        height: 40,
        margin: '15px 0',
        color: '#666666'
      },
      marginRight: {
        marginRight: 40
      },
      marginLeft: {
        marginLeft: 20,
      },
      edit: {
        fontSize: 14,
        color: '#3b98f0',
        marginRight: 388,
        cursor: 'pointer',
        marginLeft: 5,
      },
    };

    return (
      <div style={styleCss.itemBox}>
        <div style={styleCss.image} >
          <ResFormat resFormat={data.resFormat} fileType={data.resFileType} />
        </div>
        <div style={styleCss.flex1}>
          <div style={styleCss.flexDiv}>
            <PubType pubType={data.pubType} />
            <Tooltip placement="right" title={data.resName}>
              <div style={styleCss.cName} onClick={(id) => this.jumpToVideo(data.resourceId, data.resFormat)} > {data.resName}</div>
            </Tooltip>
            <div style={styleCss.flex1}></div>
            <div>
              {
                flag
                  ?
                  <Tooltip placement="bottom" title="取消关联">
                    <svg className="icon hf-hover-red" style={styleCss.icon} aria-hidden="true" onClick={(resourceId, pubType) => this.cutRelation(data.resourceId, data.pubType)}>
                      <use xlinkHref={"#icon-cancelRelevance"}></use>
                    </svg>
                  </Tooltip>
                  :
                  null
              }

              <Tooltip placement="bottom" title="下载资源">
                <svg className="icon hf-hover-blue"
                  style={styleCss.icon}
                  aria-hidden="true"
                  onClick={
                    () => this.docDownload(
                      {
                        resourceId: data.resourceId,
                        resName: data.resName,
                        resSize: data.resSize,
                        resFormat: data.resFormat,
                        definition: 'un',
                      }
                    )
                  }>
                  <use xlinkHref={"#icon-download"}></use>
                </svg>
              </Tooltip>
            </div>
          </div>
          <div style={styleCss.textBox}>
            {
              this.state.editable
                ?
                <TextArea defaultValue={data.pubDesc} maxLength={100} style={{ resize: 'none' }} rows={2} onChange={this.pubDescChange}></TextArea>
                :
                <span className="hf-text-wordBreak">{!data.pubDesc ? '无简介' : data.pubDesc}</span>
            }

            {
              flag
                ?
                <span style={this.state.editable ? { display: 'none', ...styleCss.edit } : { display: 'inline', ...styleCss.edit }} onClick={this.handleEdit}>修改</span>
                :
                null
            }

          </div>
          <div style={styleCss.flexDiv}>
            <div style={styleCss.marginRight}>贡献者：{data.username}</div>
            <div style={{ ...styleCss.marginRight, flex: 1 }}>发布时间：{Number(data.publishTime).formatTime()}</div>
            <div style={this.state.editable ? { display: 'block' } : { display: 'none' }}>
              <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(resourceId, pubType) => this.saveEdit(data.resourceId, data.pubType)}>保存</Button>
              <Button style={styleCss.marginLeft} onClick={this.cancelEdit}>取消</Button>
            </div>
          </div>
        </div>
        <DownloadFile
          isShow={this.props.downloadReducer.isShow}
          closeModal={() => { this.props.handleModalShow(false); }}
          params={this.props.downloadReducer.params} />
      </div>
    )
  }
}