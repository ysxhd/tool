/*
 * @Author: hf 
 * @Date: 2018-08-01 14:58:48 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 16:35:35
 */

/**
 * 教师的课堂管理页面 > 课堂详情 资源列表集
 */

import React from 'react';
import { Tooltip } from 'antd';
import TmDetailItem from './../components/tm_DetailItem';
import TmDetailVideo from './../components/tm_DetailVideo';
import noData from './../../icon/null_b.png'
import { connect } from 'react-redux';
@connect(
  state => state.B_TacherClassManDetailReducer,
)
export default class TmDetailList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: {
        videoSaveStatus: 0,
        curFinishStatus: 0,
        videoNum: 0,
        curResourceId: 0,
        resourceList: []
      }
    }
  }

  /**
   * 课堂的操作按钮显示
   * (课堂只涉及12)
   * videoSaveStatus:录播视频状态 -1抓取失败，0抓取中，1已抓取，2人工上传(3)
   * curFinishStatus: 课堂完成状态，-1未开始，0进行中，1已完成(1)
   * videoNum:录播数量
   * curResourceId:课堂资源ID
   */
  operateBtnShowOrHide = (obj) => {
    const styleCss = {
      button: {
        width: '100%',
        marginRight: 20,
      }
    }
    let { videoNum, curFinishStatus, videoSaveStatus, curResourceId } = obj;
    // console.log(curFinishStatus, videoSaveStatus, videoNum)
    let items;
    if (curFinishStatus == 1 && videoNum == 0) {
      //已完成的录播资源为0
      if (videoSaveStatus == -1) {
        //抓取失败的课堂允许上传录播视频
        items = <TmDetailVideo type="emptyCur" />
      } else if (videoSaveStatus == 2) {
        //人工上传
        items = <TmDetailVideo type="artificial" />
      }
    }
    return items
  }


  render() {
    const data = this.props.detailData;
    const resourceList = data.resourceList;
    //是否出现上传录播资源
    let items = this.operateBtnShowOrHide(
      {
        videoSaveStatus: data.videoSaveStatus,
        curFinishStatus: data.curFinishStatus,
        videoNum: data.videoNum,
        curResourceId: data.curResourceId
      }
    );
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto 30px'
      }
    };

    return (
      <div style={styleCss.container}>
        {items}
        {
          resourceList.length == 0
            ?
            <div className="lxx-g-noData">
              <img src={noData} />
              <p>无数据</p>
            </div>
            :
            (
              resourceList.map((item) => (
                item.pubType == 0
                  ?
                  (
                    data.videoSaveStatus == 2
                      ?
                      <TmDetailVideo key={item.resourceId} data={item} type="artificial" />
                      :
                      <TmDetailVideo key={item.resourceId} data={item} type="sourceVideo" />
                  )

                  :
                  <TmDetailItem
                    key={item.resourceId}
                    data={item}
                    curStatus={
                      {
                        vodPubStatus: data.vodPubStatus,
                        livePubStatus: data.livePubStatus,
                        curFinishStatus: data.curFinishStatus
                      }
                    } />
              ))
            )
        }
      </div>
    )
  }
}