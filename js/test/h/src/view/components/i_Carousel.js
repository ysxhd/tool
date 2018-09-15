/*
 * @Author: hf 
 * @Date: 2018-07-23 15:08:55 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-07 10:49:56
 */

/**
 * 走马灯
 */

import React from 'react';
import { Carousel } from 'antd';
import './../../css/i_Carousel.css';
import defaultImg from './../../icon/default_banner.png'
import G from './../../js/g';
import { withRouter } from 'react-router-dom';
import request from './../../js/_x/util/request';
import url from './../../js/_x/util/url';

const goWith = url.goWith;
const Request = request.request;

let i_CarouselTimer;
@withRouter
export default class IndexCarousel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.getData();
    this.time_getData();

  }


  getData() {
    Request('default/index/getLunboInfo',
      {},
      (res) => {
        if (res.result) {
          this.setState({
            data: this.dealData(res.data.lunboInfos)
          })
        } else {
          this.setState({
            data: []
          })
        }
      }
    )
  }

  /**
   * 处理直播和公有课堂
   * livePubStatus:2直播
   * vodPubStatus:2点播
   * vodPubType:2 公有
   */

  dealData = (data) => {
    if (G.configInfo.pubCurType == 0) { //关闭公有
      var evens = _.remove(data, function (o) {
        return o.vodPubStatus == 2 && o.vodPubType == 2
      });
    }

    if (G.configInfo.liveCurType == 0) {//关闭直播
      var evens = _.remove(data, function (o) {
        return o.livePubStatus == 2
      });
    }
    return data
  }

  time_getData = () => {
    var _this = this;
    i_CarouselTimer = setInterval(_this.getData.bind(_this), 10 * 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(i_CarouselTimer);
  }

  /**
     * vodPubStatus: 点播发布状态:-2空课堂，-1审核未通过，0未申请，1申请中，2审核通过(2.1)
     * autoPubType: 自动发布状态 -1不自动发布，0未设置，1自动发布到私有，2自动发布到公有(3)
     * vodPubType: 点播发布类型，0默认值（未发布），1私有，2公有(2.1.1)
     * videoSaveStatus:录播视频状态 -1抓取失败，0抓取中，1已抓取，2人工上传(3)
     * livePubStatus: 直播发布状态 -1审核未通过，0未申请，1申请中，2审核通过(2.2)
     * curFinishStatus: 课堂完成状态，-1未开始，0进行中，1已完成(1)
     * videoNum:录播数量
     * curResourceId:课堂资源ID
     */
  jumbVideoDeal = (data) => {
    for (let i = 0; i < data.length; i++) {
      let nodes = this['items' + i].parentNode.parentNode;
      if (nodes.style.opacity == 1) {
        this.jumbVideo(data[i])
      }
    }
  }
  jumbVideo = (item) => {
    let { curResourceId, livePubStatus, vodPubStatus, curFinishStatus } = item;
    // console.log(livePubStatus, vodPubStatus, curFinishStatus)
    let url = {};
    switch (curFinishStatus) {
      case 1:
        if (vodPubStatus == 2) {
          url = {
            to: 'q_recordVideo',
            with: ['reception', curResourceId, true]
          }
        }
        break;
      case 0:
        if (livePubStatus == 2) {
          url = {
            to: 'q_liveVideo',
            with: ['reception', curResourceId]
          }
        }
        break;
      case -1:
        if (livePubStatus == 2) {
          url = {
            to: 'q_liveTrail',
            with: ['reception', curResourceId, 'un']
          }
        }
        break;
    }
    goWith(url);
  }
  render() {
    let data = this.state.data;

    return (
      data.length
        ?
        data.length == 1
          ?
          <div className="hf-ic-onlyBox">
            <span className="hf-ic-dot hf-ic-onlyOne">{data[0].curName}</span>
            <img className="hf-ic-img"
              src={G.dataServices + '/default/resource/getOnlineResource/' + G.paramsInfo.orgcode + '/' + data[0].recommendPicId + '/jpg'}
              onClick={(id) => this.jumbVideo(data[0])} />
          </div>
          :
          <Carousel
            effect="fade"
            autoplay
            autoplaySpeed="30"
            dotsClass="slick-dots hf-ic-dots"
            customPaging={(i) => {
              return <span className="hf-ic-dot">{data[i].curName}</span>
            }}
          >
            {
              data.map((item, index) => {
                let url = G.dataServices + '/default/resource/getOnlineResource/';
                url += G.paramsInfo.orgcode + '/' + item.recommendPicId + '/jpg';
                return (
                  <div
                    data-index={index}
                    ref={(ref) => this['items' + index] = ref}
                    key={index}
                    onClick={() => this.jumbVideoDeal(data)}
                  >
                    <img className="hf-ic-img" src={url} />
                  </div>
                )
              })
            }
          </Carousel >
        :
        <div>
          <img src={defaultImg} className="hf-ic-img" />
        </div>
    )
  }

}


