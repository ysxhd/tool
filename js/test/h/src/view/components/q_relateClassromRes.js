/*
 * @Author: lxx 
 * @Date: 2018-08-01 15:42:49 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-31 16:44:03
 * 前台-相关课堂资源组件
 */

import React, { Component } from 'react';
import { Container, SVG, PubType, ResFormat, DownloadFile } from './../common';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'react-redux';
import './../../css/q_resources.css';
import DocumentPlay from './../components/q_documentPlay';
import SwfPlayer from './../components/p_swfPlayer';
import RepVideo from './../components/JC_replayVideo';
import { _x } from './../../js/index';
import G from './../../js/g';
import { handleModalShow } from './../../redux/lxx.download.reducer';
import { getShowResList } from './../../redux/lxx.classroomRes.reducer';

const Request = _x.util.request.request;
const toChinese = _x.util.number.toChinese;
const formatDate = _x.util.date.format;

@connect(
    state => state,
    { getShowResList }
)
class ResourcesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // isShow: false,
            resId: ''
        }
    }

    /**
     * 资源播放显示控制
     */
    handleShowRes(key) {
        let resList = this.props.classroomResReducer.showList;
        resList[key] = !resList[key];
        for (let i in resList) {
            if (key !== Number(i)) {
                resList[i] = false;
            }
        }
        // 更新展开收缩状态
        this.props.getShowResList(resList);
        // this.setState({
        //     isShow: !this.state.isShow
        // })

    }

    /**
     * 下载资源
     */
    handleDownload(resId, resName, resSize, resFormat) {
        let params = {
            resourceId: resId,
            resName: resName,
            resSize: resSize,
            resFormat: resFormat,
            definition: 'un',
        };
        // 显示下载弹窗
        this.props.handleModalShow(true, params);
    }

    render() {
        let state = this.state;
        let list = this.props.list,
            fileType = list.resFileType,
            resFormat = list.resFormat,
            fileId = list.transcodeFileId ? list.transcodeFileId : list.fileId;
        let playEle = '';
        let url = G.dataServices + '/default/resource/getOnlineResource/';
        url += G.paramsInfo.orgcode + '/' + fileId + '/' + resFormat;
        // console.log(url)
        let curData = {}
        switch (fileType) {
            case 1: // 图片
                playEle = <img src={url} alt="" />;
                break;
            case 2: // 文档
                playEle = <DocumentPlay resUrl={url} file={fileId} resFormat={resFormat} isList={true} />;
                break;
            case 3: // 视频
                if (resFormat == 'swf') {
                    playEle = <SwfPlayer resUrl={url} />;
                } else {
                    let curData = {
                        type: 'video',
                        url: url,
                        resFormat: list.resFormat
                    };
                    playEle = <RepVideo liveVideo={false} videoType="record" resUrl={url} curData={curData} />;
                };
                break;
            case 4: // 音频
                let curData = {
                    type: 'audio',
                    url: url,
                    resFormat: list.resFormat
                };
                playEle = <RepVideo liveVideo={false} videoType="record" resUrl={url} curData={curData} />;
                break;
            case 5:
                playEle = <div className="lxx-pla-g-noCnt">
                    <p>暂不支持该格式文件在线浏览，请下载到本地查看!</p>
                </div>;
                break;
            default:
                playEle = <div className="lxx-pla-g-noCnt">
                    <p>暂不支持该格式文件在线浏览，请下载到本地查看!</p>
                </div>;
                break;
        }
        // console.log(list);
        let showList = this.props.classroomResReducer.showList,
            ind = this.props.ind;

        return (
            <div style={{ display: !list.pubType ? 'none' : '' }}>
                <div className="lxx-res-g-list lxx-g-flex">
                    <div className="lxx-res-g-img">
                        <ResFormat resFormat={resFormat} fileType={fileType} />
                    </div>
                    <div className="lxx-res-g-cnt lxx-m-flex">
                        <div className="lxx-res-g-name lxx-g-flex-center">
                            <PubType pubType={list.pubType} />
                            <p className="lxx-m-flex">
                                <Tooltip placement="right" title={list.resName} >
                                    <span onClick={this.handleShowRes.bind(this, this.props.ind)}>{list.resName}</span>
                                </Tooltip>
                            </p>

                            <SVG type="download" title="下载" onClick={this.handleDownload.bind(this, list.resourceId, list.resName, list.resSize, list.resFormat)} />
                        </div>
                        <div className="lxx-res-g-info">{list.pubDesc || '暂无简介'}</div>
                        <div className="lxx-res-g-other lxx-g-flex-center">
                            <span>贡献者：{list.username || '-'}</span>
                            <span className="lxx-m-flex">发布时间：{formatDate(new Date(list.uplaodTime), 'yyyy-MM-dd')}</span>
                            {
                                showList[ind]
                                    ? <span className="lxx-res-m-handle" onClick={this.handleShowRes.bind(this, this.props.ind)}>收缩<SVG type="pullUp" /></span>
                                    : <span className="lxx-res-m-handle" onClick={this.handleShowRes.bind(this, this.props.ind)}>展开<SVG type="pullDown" /></span>
                            }
                        </div>
                    </div>
                </div>
                <div className="lxx-res-g-pdf" style={{ display: showList[ind] ? '' : 'none' }}>
                    {
                        showList[ind]
                            ? playEle
                            : ''
                    }
                </div>

            </div>

        )
    }
}

@connect(
    state => state,
    { handleModalShow, getShowResList }
)
class ClassrommRes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resList: []
        };
    }
    componentDidMount() {
        let showList = [];
        let resList = this.props.resList;
        resList.map(li => {
            showList.push(false);
        })
        this.props.getShowResList(showList);
        this.setState({
            resList
        })
    }

    componentDidUpdate() {
        if (this.props.resList && this.props.resList !== this.state.resList) {
            let showList = [];
            let resList = this.props.resList;
            resList.map(li => {
                showList.push(false);
            })
            this.props.getShowResList(showList);
            this.setState({
                resList
            })
        }
    }

    render() {
        let resList = this.props.resList || [];
        // console.log(resList);

        return (
            <div className="lxx-g-resource">
                {
                    resList.map((item, index) => {
                        return (
                            <ResourcesList key={index} ind={index} list={item} handleModalShow={this.props.handleModalShow}></ResourcesList>
                        )
                    })
                }
                <DownloadFile
                    isShow={this.props.downloadReducer.isShow}
                    closeModal={() => { this.props.handleModalShow(false); }}
                    params={this.props.downloadReducer.params} />
            </div>
        );
    }
}

export default ClassrommRes;
