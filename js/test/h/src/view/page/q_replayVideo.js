/*
 * @Author: JC.Liu 
 * @Date: 2018-08-03 19:38:47 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-03 16:02:16
 * 录播页面
 */
import React, { Component } from 'react';
import { message } from 'antd';
import { connect } from 'react-redux';
import { DownloadFile, SpinLoad } from './../common';
import { HeaderNav, TeacherNav, AdminNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import RepVideo from './../components/JC_replayVideo';
import DocumentPlay from './../components/q_documentPlay';
import SwfPlayer from './../components/p_swfPlayer';
import './../../css/p_player.css';
import { _x } from './../../js/index';
import G from './../../js/g';
import { handleModalShow } from './../../redux/lxx.download.reducer';

const Request = _x.util.request.request;

@connect(
  state => state,
  { handleModalShow }
)
class ReplayVideo extends Component {
  constructor(params) {
    super(params);
    this.state = {
      type: '',
      resId: '',
      picUrl: '',
      resName: '',
      resSize: 0,
      resFormat: '',
      isLoading: true,
      fileId: '',
    }

    this.live = "";
    this.message = "";
  }

  componentDidMount() {
    let params = this.props.match.params;
    let type = params.type,
      id = params.id;
    this.setState({
      type: type,
      resId: id
    })
    let param = { "resourceId": id };
    this.getResData(param);
  }

  /**
   * 获取资源详细数据
   */
  getResData(param) {
    Request('default/resource/getResourceInfo', param, (res) => {
      if (res.result && res.data) {
        if (res.data.transcodeFileId) {
          this.setState({
            fileId: res.data.transcodeFileId
          })
        } else {
          this.setState({
            fileId: res.data.fileId || ''
          })
        }

        this.live = true;
        this.setState({
          resName: res.data.resName || '-',
          resSize: res.data.resSize || 0,
          resFormat: res.data.resFormat || '',
          isLoading: false,
          resId: res.data.resourceId
        })
      } else {
        this.live = false;
        this.message = res.message
      }
    }, () => {
      message.warning('请求失败');
      this.setState({
        isLoading: false
      })
    })
  }

  /**
   * 下载资源
   */
  handleDownload() {
    let params = {
      resourceId: this.state.resId,
      resName: this.state.resName,
      resSize: this.state.resSize,
      resFormat: this.state.resFormat,
      definition: 'un',
    };
    // 显示下载弹窗
    this.props.handleModalShow(true, params);
  }

  render() {
    let paramsTarget = this.props.match.params.target;
    let state = this.state;
    let ele = '';

    if (state.type === 'swf') {
      let url = G.dataServices + '/default/resource/getOnlineResource/';
      url += G.paramsInfo.orgcode + '/' + state.fileId + '/' + state.resFormat;

      ele = <div className="lxx-g-play">
        {
          state.isLoading
            ? <SpinLoad />
            : ''
        }
        <div className="lxx-pla-g-name lxx-g-flex-center">
          <p className="lxx-m-flex">{state.resName}</p>
          <svg className="icon lxx-u-download" aria-hidden="true" onClick={this.handleDownload.bind(this)}>
            <use xlinkHref="#icon-download"><title>下载</title></use>
          </svg>
        </div>
        <div className="lxx-pla-g-cnt">
          <SwfPlayer resUrl={url} />
        </div>
      </div>
    } else if (state.type === 'video' || state.type === 'audio') {
      // url file resFormat
      let url = G.dataServices + '/default/resource/getOnlineResource/';
      url += G.paramsInfo.orgcode + '/' + state.fileId + '/' + state.resFormat;
      let curData = {
        type: state.type,
        resName: state.resName,
        url: url,
        file: state.fileId,
        resFormat: state.resFormat,
        resourceId: state.resId,
        resSize: state.resSize,
        live: this.live,
        message: this.message
      }
      ele = <RepVideo liveVideo={3} videoType="replay" curData={curData} />
    } else if (state.type === 'pdf') {
      let url = G.dataServices + '/default/resource/getOnlineResource/';
      url += G.paramsInfo.orgcode + '/' + state.fileId + '/' + state.resFormat;
      ele = <div className="lxx-g-play">
        {
          state.isLoading
            ? <SpinLoad />
            : ''
        }
        <div className="lxx-pla-g-name lxx-g-flex-center">
          <p className="lxx-m-flex">{state.resName}</p>
          <svg className="icon lxx-u-download" aria-hidden="true" onClick={this.handleDownload.bind(this)}>
            <use xlinkHref="#icon-download"><title>下载</title></use>
          </svg>
        </div>
        <div className="lxx-pla-g-cnt">
          {
            !state.resId && !state.resFormat
              ?
              ''
              :
              <DocumentPlay resUrl={url} file={state.resId} resFormat={state.resFormat} />
          }
        </div>
      </div>
    } else if (state.type === 'pic') {
      let url = G.dataServices + '/default/resource/getOnlineResource/';
      url += G.paramsInfo.orgcode + '/' + state.fileId + '/' + state.resFormat;

      ele = <div className="lxx-g-play">
        {
          state.isLoading
            ? <SpinLoad />
            : ''
        }
        <div className="lxx-pla-g-name lxx-g-flex-center">
          <p className="lxx-m-flex">{state.resName}</p>
          <svg className="icon lxx-u-download" aria-hidden="true" onClick={this.handleDownload.bind(this)}>
            <use xlinkHref="#icon-download"><title>下载</title></use>
          </svg>
        </div>
        <div className="lxx-pla-g-cnt">
          <img src={url} alt="" />
        </div>
      </div>
    } else if (state.type === 'unable') {
      ele = <div className="lxx-g-play">
        {
          state.isLoading
            ? <SpinLoad />
            : ''
        }
        <div className="lxx-pla-g-name lxx-g-flex-center">
          <p className="lxx-m-flex">{state.resName}</p>
          <svg className="icon lxx-u-download" aria-hidden="true" onClick={this.handleDownload.bind(this)}>
            <use xlinkHref="#icon-download"></use>
          </svg>
        </div>
        <div className="lxx-pla-g-cnt">
          <p>暂不支持该格式文件在线浏览，请下载到本地查看!</p>
        </div>
      </div>
    }

    return (
      <div>
        {
          paramsTarget === "reception" ?
            <HeaderNav />
            : paramsTarget === "teacher" ?
              <TeacherNav />
              :
              <AdminNav />
        }
        {ele}
        <DownloadFile
          isShow={this.props.downloadReducer.isShow}
          closeModal={() => { this.props.handleModalShow(false); }}
          params={this.props.downloadReducer.params} />
        <Q_FooterBar />
      </div>
    )
  }
}

export default ReplayVideo;