/*
 * @Author: hf 
 * @Date: 2018-08-01 14:58:48 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:49
 */

/**
 * 教师的课堂管理页面 > 课堂详情 录播资源item
 */

import React from 'react';
import { Button, Input, Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TmDetailItem from './../components/tm_DetailItem';
import TmDetailUploadimg from './../components/tm_DetailUploadimg';
import TmDetailUploadVideo from './../components/tm_DetailUploadVideo';
import { modifyResDes_ac, getCurDetailed_ac, modifyCurResInfo_ac } from './../../redux/b_teacherClassDetail.reducer';
import defaultImg from './../../icon/default_1.png';
import { handleModalShow } from './../../redux/lxx.download.reducer';
import { DownloadFile, HfModal } from './../common';
import G from './../../js/g';
import url from './../../js/_x/util/url';

const goWith = url.goWith;
const { TextArea } = Input;
@withRouter
@connect(
  state => state,
  { modifyResDes_ac, getCurDetailed_ac, handleModalShow, modifyCurResInfo_ac }
)
export default class TmDetailVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      ModalShowOrHide: false,
      pubDesc: '',
      openType: ''
    }
  }

  //修改课堂名
  handleEdit = () => {
    this.setState({
      editable: true
    })
  }

  /**
    * 保存修改
    * id:资源id
    * pubType:发布类型
    */
  saveEdit = (id, pubType) => {
    this.props.modifyResDes_ac({
      curResourceId: this.props.match.params.id,
      resourceId: id,
      pubType: pubType,
      pubDesc: this.state.pubDesc
    });
    this.setState({
      editable: false
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
   * 取消修改
   */

  cancelEdit = () => {
    this.setState({
      editable: false
    })
  }

  /**
   * 删除录播资源
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
   * 上传封面
   * type：
   * pic：封面
   * video：视频
   */
  openModal = (type) => {
    this.setState({
      ModalShowOrHide: true,
      openType: type
    })
  }

  /**
   * 关闭Modal
   */

  closeModal = () => {
    this.setState({
      ModalShowOrHide: false
    })
  }

  /**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
   * 跳转到播放页
   * id:课堂id
   * curFinishStatus:课堂完成状态，-1未开始，0进行中，1已完成(1)
   * vodPubType: 点播发布类型，0默认值（未发布），1私有，2公有(2.1.1)
   */

  jumpToVideo = (id, curFinishStatus, vodPubType) => {
    let url = {};
    switch (curFinishStatus) {
      case 1:
        if (vodPubType == 2) {
          url = {
            to: 'q_recordVideo',
            with: ['teacher', id, true]
          }
        } else {
          url = {
            to: 'q_recordVideo',
            with: ['teacher', id, false]
          }
        }
        break;
      case 0:
        url = {
          to: 'q_liveVideo',
          with: ['teacher', id]
        }
        break;
      case -1:
        url = {
          to: 'q_liveVideo',
          with: ['teacher', id, '000']
        }
        break;
    }
    goWith(url);
  }

  //sourceVideo:有录播资源
  //artificial：人工上传
  //emptyCur：空课堂
  renderItems = (itemtype) => {
    // console.log(itemtype)
    let items;
    const styleCss = {
      itemBox: {
        border: '1px solid #ccc',
        marginBottom: 20,
        padding: 20,
        display: 'flex',
        boxShadow: '0 3px 3px #ccc'
      },
      image: {
        width: 200,
        height: 114,
        marginRight: 20,
        borderRadius: 5,
      },
      flexDiv: {
        display: 'flex',
      },
      flex1: {
        flex: 1
      },
      type: {
        width: 36,
        height: 25,
        textAlign: 'center',
        lineHeight: '25px',
        background: "#6478fb",
        color: '#fff',
        borderRadius: 6,
        marginRight: 10
      },
      cName: {
        maxWidth: 595,
        fontSize: 18,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      },
      icon: {
        fontSize: 24,
        marginLeft: 20,
        cursor: 'pointer',
        color: "#b8b8b8"
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
      button: {
        width: 200,
        marginTop: 10
      },
      buttonSmall: {
        width: 90,
        marginTop: 10,
      }
    }
    const data = this.props.data;
    // console.log(data)
    const detailData = this.props.B_TacherClassManDetailReducer.detailData;
    let { curResourceId, curFinishStatus, vodPubType, vodPubStatus, videoSaveStatus } = detailData;
    // console.log(curFinishStatus == 1 && vodPubStatus > 0)
    if (itemtype == 'sourceVideo') {
      items = <div style={styleCss.itemBox}>
        <div >
          <div style={styleCss.image} onClick={(id, cur, vod) => this.jumpToVideo(curResourceId, curFinishStatus, vodPubType)}>
            {
              detailData.thumbnailId
                ?
                <img src={G.dataServices + '/default/resource/getOnlineResource/' + G.paramsInfo.orgcode + '/' + detailData.thumbnailId + '/jpg'} style={styleCss.image} />
                :
                <img src={defaultImg} style={styleCss.image} />
            }

          </div>

          {
            curFinishStatus == 1 && vodPubStatus > 0 //已完成且已发布
              ?
              null
              :
              <Button style={styleCss.button} onClick={() => this.openModal('pic')}>上传封面</Button>
          }

        </div>
        <div style={styleCss.flex1}>
          <div style={styleCss.flexDiv}>
            <div style={styleCss.type}>录播</div>
            <Tooltip placement="right" title={data.resName}>
              <div style={styleCss.cName} onClick={(id, cur, vod) => this.jumpToVideo(curResourceId, curFinishStatus, vodPubType)}>{data.resName}</div>
            </Tooltip>
            <div style={styleCss.flex1}></div>
            <div>

              {
                detailData.vodPubStatus > 0 || detailData.videoSaveStatus != 2//自己上传的资源才能删除 
                  ?
                  null
                  :
                  <Tooltip placement="bottom" title="删除资源" onClick>
                    <svg className="icon hf-hover-red" style={styleCss.icon} aria-hidden="true" onClick={(resourceId, pubType) => this.cutRelation(data.resourceId, data.pubType)}>
                      <use xlinkHref={"#icon-delete"}></use>
                    </svg>
                  </Tooltip>
              }

              <Tooltip placement="bottom" title="下载资源">
                <svg className="icon hf-hover-blue" style={styleCss.icon} aria-hidden="true"
                  onClick={
                    () => this.docDownload(
                      {
                        resourceId: data.resourceId,
                        resName: data.resName,
                        resSize: data.resSize,
                        resFormat: data.resFormat,
                        definition: 'undfine',
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
              detailData.curFinishStatus == 1 && detailData.vodPubStatus != 1 && detailData.vodPubStatus != 2 && detailData.vodPubStatus != -2
                ?
                <span style={this.state.editable ? { display: 'none', ...styleCss.edit } : { display: 'inline', ...styleCss.edit }} onClick={this.handleEdit}>修改</span>
                :
                null
            }

          </div>
          <div style={styleCss.flexDiv}>
            <div style={styleCss.marginRight}>公有浏览量：{detailData.pubWatchNum}</div>
            <div style={{ ...styleCss.marginRight, flex: 1 }}>私有有浏览量：{detailData.privWatchNum}</div>
            <div style={this.state.editable ? { display: 'block' } : { display: 'none' }}>
              <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(resourceId, pubType) => this.saveEdit(data.resourceId, data.pubType)}>保存</Button>
              <Button style={styleCss.marginLeft} onClick={this.cancelEdit}>取消</Button>
            </div>
          </div>
        </div>
      </div>
    } else if (itemtype == 'artificial') {
      items = <div style={styleCss.itemBox}>
        <div >
          <div style={styleCss.image} onClick={(id, cur, vod) => this.jumpToVideo(curResourceId, curFinishStatus, vodPubType)}>
            {
              detailData.thumbnailId
                ?
                <img src={G.dataServices + '/default/resource/getOnlineResource/' + G.paramsInfo.orgcode + '/' + detailData.thumbnailId + '/jpg'} style={styleCss.image} />
                :
                <img src={defaultImg} style={styleCss.image} />
            }

          </div>
          {
            curFinishStatus == 1 && vodPubStatus > 0 //已完成且已发布
              ?
              null
              :
              <div>
                <Button style={{ ...styleCss.buttonSmall, marginRight: 20 }} onClick={() => this.openModal('video')}>上传视频</Button>
                <Button style={styleCss.buttonSmall} onClick={() => this.openModal('pic')}>上传封面</Button>
              </div>
          }

        </div>
        {
          !data
            ?
            null
            :
            <div style={styleCss.flex1}>
              <div style={styleCss.flexDiv}>
                <div style={styleCss.type}>录播</div>
                <Tooltip placement="right" title={data.resName}>
                  <div style={styleCss.cName} onClick={(id, cur, vod) => this.jumpToVideo(curResourceId, curFinishStatus, vodPubType)}>{data.resName}</div>
                </Tooltip>
                <div style={styleCss.flex1}></div>
                <div>
                  {
                    curFinishStatus == 1 && vodPubStatus > 0 //已完成且已发布
                      ?
                      null
                      :
                      <Tooltip placement="bottom" title="删除资源" onClick>
                        <svg className="icon hf-hover-red" style={styleCss.icon} aria-hidden="true" onClick={(resourceId, pubType) => this.cutRelation(data.resourceId, data.pubType)}>
                          <use xlinkHref={"#icon-delete"}></use>
                        </svg>
                      </Tooltip>
                  }
                  <Tooltip placement="bottom" title="下载资源">
                    <svg className="icon hf-hover-blue" style={styleCss.icon} aria-hidden="true"
                      onClick={
                        () => this.docDownload(
                          {
                            resourceId: data.resourceId,
                            resName: data.resName,
                            resSize: data.resSize,
                            resFormat: data.resFormat,
                            definition: 'undfine',
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
                  !data
                    ?
                    null
                    :
                    this.state.editable
                      ?
                      <TextArea defaultValue={data.pubDesc} maxLength={100} style={{ resize: 'none' }} rows={2} onChange={this.pubDescChange}></TextArea>
                      :
                      <span className="hf-text-wordBreak">{!data.pubDesc ? '无简介' : data.pubDesc}</span>
                }
                {
                  curFinishStatus == 1 && vodPubStatus != 1 && vodPubStatus != 2 && vodPubStatus != -2 && data
                    ?
                    <span style={this.state.editable ? { display: 'none', ...styleCss.edit } : { display: 'inline', ...styleCss.edit }} onClick={this.handleEdit}>修改</span>
                    :
                    null
                }

              </div>

              <div style={styleCss.flexDiv}>
                <div style={styleCss.marginRight}>公有浏览量：{detailData.pubWatchNum}</div>
                <div style={{ ...styleCss.marginRight, flex: 1 }}>私有有浏览量：{detailData.privWatchNum}</div>
                <div style={this.state.editable ? { display: 'block' } : { display: 'none' }}>
                  <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(resourceId, pubType) => this.saveEdit(data.resourceId, data.pubType)}>保存</Button>
                  <Button style={styleCss.marginLeft} onClick={this.cancelEdit}>取消</Button>
                </div>
              </div>
            </div>
        }
      </div>

    } else if (itemtype == 'emptyCur') {
      items = <div style={styleCss.itemBox}>
        <div >
          <div style={styleCss.image}>
            <img src={defaultImg} style={styleCss.image} />
          </div>
          {
            detailData.videoSaveStatus == -1//抓取失败
              ?
              <div>
                <Button style={{ ...styleCss.buttonSmall, marginRight: 20 }} onClick={() => this.openModal('video')}>上传视频</Button>
                <Button style={styleCss.buttonSmall} onClick={() => this.openModal('pic')}>上传封面</Button>
              </div>
              :
              <Button style={styleCss.button} onClick={() => this.openModal('pic')}>上传封面</Button>
          }

        </div>
      </div>
    }

    return items
  }
  render() {
    const itemtype = this.props.type;
    const detailData = this.props.B_TacherClassManDetailReducer.detailData;
    let { curResourceId, curFinishStatus, vodPubType, vodPubStatus, videoSaveStatus } = detailData;
    let items = this.renderItems(itemtype);
    return (
      <div>
        {items}
        {
          this.state.openType == 'pic'
            ?
            <HfModal
              title="上传封面"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={700}
              closeModal={this.closeModal}
              contents={<TmDetailUploadimg closeModal={this.closeModal} ID={detailData.curResourceId} />}
            />
            :
            <HfModal
              title="上传视频"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={700}
              closeModal={this.closeModal}
              contents={<TmDetailUploadVideo closeModal={this.closeModal} ID={detailData.curResourceId} />}
            />
        }
        <DownloadFile
          isShow={this.props.downloadReducer.isShow}
          closeModal={() => { this.props.handleModalShow(false); }}
          params={this.props.downloadReducer.params} />
      </div>

    )
  }
}