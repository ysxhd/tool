/*
 * @Author: hf 
 * @Date: 2018-08-06 17:14:07 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:27:08
 */


/**
 * 管理员的课堂管理页面 > 课堂详情 资源列表集
 */

import React from 'react';
import { Tooltip, Button, Checkbox, Radio, message } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { HfModal } from './../common';
import CancelOrPubCurModal from './cancelorPubCurModal';
import { cancelTopRecommendCur_ac, saveSelectResult_ac, updateOneCurStatus_ac } from './../../redux/b_managerClassDetail.reducer';
import Mm_DetailSettopImg from './mm_DetailSettopImg';
import G from './../../js/g';
import url from './../../js/_x/util/url';

const goWith = url.goWith;
const RadioGroup = Radio.Group;

@withRouter
@connect(
  state => state.B_ManagerClassManDetaileReducer,
  { cancelTopRecommendCur_ac, saveSelectResult_ac, updateOneCurStatus_ac }
)
export default class MmDetailList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: true, //false 为全选
      checkedList: [],//存储与后端交互数据
      trgIdCheckedList: {},//存储判断前端每组的check 是否选完的数据
      ModalShowOrHide: false,
      ModalType: '',
      id: '',
      ifMessage: true,
      settopID: ''
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.autopub_data != nextprops.autopub_data) {
      if (nextprops.autopub_data.result) {
        message.success('设置成功');
      } else {
        message.error(nextprops.autopub_data.message)
      }
    }
    if (this.props.detail_data != nextprops.detail_data) {
      this.setState({
        trgIdCheckedList: {}
      })
    }
  }

  /**
   * 全选年级
   * 资源列表
   * curResources
   * trgId:年级id
   */
  onCheckAllChange = (e, trgId, arr) => {
    var checkedLists = [];
    var trgIdCheckedList = this.state.trgIdCheckedList;

    if (e.target.checked) {
      arr.map((item) => {
        let btns = this.operateBtnShowOrHide(
          {
            vodPubStatus: item.vodPubStatus,
            vodPubType: item.vodPubType,
            livePubStatus: item.livePubStatus,
            curFinishStatus: item.curFinishStatus,
            videoNum: item.videoNum,
            curResourceId: item.curResourceId,
            recommendType: item.recommendType,
            autoPubType: item.autoPubType
          }
        );
        if (btns) {
          item.check = e.target.checked;
          checkedLists.push({
            curResourceId: item.curResourceId,
          })
        }
        trgIdCheckedList[trgId] = checkedLists
      });
    } else {
      arr.map((item) => {
        item.check = e.target.checked;
      });

      delete trgIdCheckedList[trgId]
    }

    var data = this.props.detail_data;
    let j = _.findIndex(data, function (o) { return o.trgId == trgId });
    data[j].curResources = arr;

    let checkedList = [];
    for (let i in trgIdCheckedList) {
      checkedList = checkedList.concat(trgIdCheckedList[i])
    }

    this.setState({
      checkedList,
      trgIdCheckedList,
      data,
      indeterminate: false,
      ['checkAll' + trgId]: e.target.checked,
    });
    this.props.saveSelectResult_ac(checkedList)
  }


  /**
   * 单选班级
   * 属于哪个年级，trgId:年级id
   * 班级id
   * arr:该年级的所有班级
   */
  HandleSingleChange = (e, trgId, id, arr) => {

    var data = this.props.detail_data;
    let i = _.findIndex(arr, function (o) { return o.curResourceId == id });
    let j = _.findIndex(data, function (o) { return o.trgId == trgId });
    arr[i].check = e.target.checked;
    data[j].curResources = arr;

    var trgIdCheckedList = this.state.trgIdCheckedList;
    var checkedLists = trgIdCheckedList[trgId] || [];
    if (e.target.checked) {
      checkedLists.push({
        curResourceId: id,
      })
    } else {
      let i = _.findIndex(trgIdCheckedList[trgId], function (o) { return o.curResourceId == id })
      checkedLists.splice(i, 1);
    }

    trgIdCheckedList[trgId] = checkedLists;

    if (trgIdCheckedList[trgId].length == 0) {
      delete trgIdCheckedList[trgId]
    }

    let checkedList = [];
    for (let i in trgIdCheckedList) {
      checkedList = checkedList.concat(trgIdCheckedList[i])
    }

    this.setState({
      checkedList,
      trgIdCheckedList,
      data,
      indeterminate: !trgIdCheckedList[trgId] ? false : (trgIdCheckedList[trgId].length < arr.length),
      ['checkAll' + trgId]: !trgIdCheckedList[trgId] ? false : trgIdCheckedList[trgId].length === arr.length,
    });
    // console.log(checkedList)
    this.props.saveSelectResult_ac(checkedList)
  }

  /**
    * 课堂的操作按钮显示
    * (课堂只涉及12)
    * vodPubStatus: 点播发布状态:-2空课堂，-1审核未通过，0未申请，1申请中，2审核通过(2.1)
    * autoPubType: 自动发布状态 -1不自动发布，0未设置，1自动发布到私有，2自动发布到公有(3)
    * vodPubType: 点播发布类型，0默认值（未发布），1私有，2公有(2.1.1)
    * videoSaveStatus:录播视频状态 -1抓取失败，0抓取中，1已抓取，2人工上传(3)
    * livePubStatus: 直播发布状态 -2终止直播:-1审核未通过，0未申请，1申请中，2审核通过(2.2)
    * curFinishStatus: 课堂完成状态，-1未开始，0进行中，1已完成(1)
    * videoNum:录播数量
    * curResourceId:课堂资源ID
    * recommendType:0不推荐，1推荐
    */
  operateBtnShowOrHide = (obj) => {
    const styleCss = {
      flexDiv: {
        display: 'flex',
        width: 500,
      },
      flex1: {
        flex: 1,
        width: 100
      },
      marginLeft: {
        marginLeft: 20,
      },
      marginRight40: {
        display: 'inline-block',
        width: 200,
        marginRight: 40,
        textAlign: 'center',
      },
      marginRight160: {
        display: 'inline-block',
        width: 200,
        marginRight: 160,
        textAlign: 'center'
      }
    };
    let { curFinishStatus, vodPubStatus, videoNum, vodPubType, livePubStatus, curResourceId, recommendType, autoPubType } = obj;
    // console.log(videoNum, vodPubStatus, autoPubType)
    let btns;
    if (curFinishStatus == 1) {
      switch (vodPubStatus) {
        case -2:
          if (autoPubType == 1) {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>私有发布中</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pri' }, curResourceId)}>取消发布</Button>
            </div>
          } else if (autoPubType == 2) {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>公有发布中</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' }, curResourceId)}>取消发布</Button>
              {
                recommendType == 0
                  ?
                  <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                  :
                  <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
              }
            </div>
          }
          return btns;
        case -1:
          if (videoNum > 0) {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>审核未通过</div>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' }, curResourceId)}>发布到公有</Button>
                  :
                  null
              }
              <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' }, curResourceId)}>发布到私有</Button>
            </div>
          } else {
            if (autoPubType == 1) {
              btns = <div style={styleCss.flexDiv}>
                <div style={styleCss.flex1}>私有发布中</div>
                <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pri' }, curResourceId)}>取消发布</Button>
              </div>
            } else if (autoPubType == 2) {
              btns = <div style={styleCss.flexDiv}>
                <div style={styleCss.flex1}>公有发布中</div>
                <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' }, curResourceId)}>取消发布</Button>
                {
                  recommendType == 0
                    ?
                    <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                    :
                    <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
                }
              </div>
            }
          }
          return btns
        case 0:
          if (videoNum > 0) {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>未发布</div>
              {
                G.configInfo.pubCurType == 1
                  ?
                  <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub' }, curResourceId)}>发布到公有</Button>
                  :
                  null
              }
              <Button className="lxx-s-blue" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri' }, curResourceId)}>发布到私有</Button>
            </div>
          } else {
            //自动发布的就没有录播资源
            // //autoPubType: 自动发布状态 -1不自动发布，0未设置，1自动发布到私有，2自动发布到公有(3)
            if (autoPubType == 1) {
              btns = <div style={styleCss.flexDiv}>
                <div style={styleCss.flex1}>私有发布中</div>
                <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pri' }, curResourceId)}>取消发布</Button>
              </div>
            } else if (autoPubType == 2) {
              btns = <div style={styleCss.flexDiv}>
                <div style={styleCss.flex1}>公有发布中</div>
                <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' }, curResourceId)}>取消发布</Button>
                {
                  recommendType == 0
                    ?
                    <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                    :
                    <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
                }
              </div>
            }
          }
          return btns
        case 1:
          if (vodPubType == 2) {//公有
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>公有审核中</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' }, curResourceId)}>取消发布</Button>
            </div>
          } else {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>私有审核中</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pri' }, curResourceId)}>取消发布</Button>
            </div>
          }
          return btns;
        case 2:
          if (vodPubType == 2) {//公有
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>已发布为公有</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pub' }, curResourceId)}>取消发布</Button>
              {
                recommendType == 0
                  ?
                  <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                  :
                  <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
              }
            </div>
          } else {
            btns = <div style={styleCss.flexDiv}>
              <div style={styleCss.flex1}>已发布为私有</div>
              <Button className="lxx-s-orange" style={styleCss.marginLeft} onClick={(obj) => this.openModal({ puborcancel: 'cancel', puborpri: 'pri' }, curResourceId)}>取消发布</Button>
            </div>
          }
          return btns;
        default:
          return btns;
      }
    }
    else if (curFinishStatus == 0 && G.configInfo.liveCurType == 1) {
      switch (livePubStatus) {
        case -2:
          btns = <div>
            <Button className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' }, curResourceId)}>开启直播</Button>
          </div>
          return btns
        case -1:
          btns = <div>
            <Button className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' }, curResourceId)}>开启直播</Button>
          </div>
          return btns
        case 0:
          btns = <div>
            <Button className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' }, curResourceId)}>开启直播</Button>
          </div>
          return btns
        case 1:
          btns = <div>
            <Button className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' }, curResourceId)}>终止直播</Button>
          </div>
          return btns;
        case 2:
          btns = <div>
            <Button className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' }, curResourceId)}>终止直播</Button>
            {
              recommendType == 0
                ?
                <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                :
                <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
            }
          </div>
          return btns;
        default:
          return btns;
      }
    }
    else if (curFinishStatus == -1 && G.configInfo.liveCurType == 1) {
      switch (livePubStatus) {
        case -1:
          btns = <div>
            <Button className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' }, curResourceId)}>开启直播</Button>
          </div>
          return btns
        case 0:
          btns = <div>
            <Button className="lxx-s-blue" onClick={(obj) => this.openModal({ puborcancel: 'livePub' }, curResourceId)}>开启直播</Button>
          </div>
          return btns
        case 1:
          btns = <div>
            <Button className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' }, curResourceId)}>取消直播</Button>
          </div>
          return btns;
        case 2:
          btns = <div>
            <Button className="lxx-s-orange" onClick={(obj) => this.openModal({ puborcancel: 'liveCancel' }, curResourceId)}>取消直播</Button>
            {
              recommendType == 0
                ?
                <Button className="lxx-s-wathet" style={styleCss.marginLeft} onClick={() => this.setTopRecommendCur(curResourceId)}>设为置顶</Button>
                :
                <Button className="lxx-s-lightOrg" style={styleCss.marginLeft} onClick={() => this.cancelTopRecommendCur(curResourceId)}>取消置顶</Button>
            }
          </div>
          return btns;
        default:
          return btns;
      }
    }
  }


  /**
  * 打开弹窗
  * obj:{
  * puborcancel: pub:发布、cancel:取消
  * puborpri:pri:私有、pub:公有
  * }
  * obj：false : 关联上传弹框，true ：操作提示框
  * id:资源id
  */
  openModal = (obj, id) => {
    this.setState({
      ModalShowOrHide: true,
      ModalType: obj,
      ifMessage: true,
      id: [{ curResourceId: id }]
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
   * 资源数目决定显示隐藏，0 就隐藏
   */
  snumDecideShowOrHide = (data) => {
    const styleCss = {
      flexDiv: {
        display: 'flex',
        alignItems: 'center',
        height: 40,
      },
      marginRight: {
        marginRight: 40
      },
    }
    let sourceDiv;
    sourceDiv = <div style={styleCss.flexDiv}>
      {
        data.videoNum
          ?
          <div style={styleCss.marginRight}>录播：{data.videoNum}</div>
          :
          null
      }
      {
        data.daoxueNum
          ?
          <div style={styleCss.marginRight}>导学：{data.daoxueNum}</div>
          :
          null
      }
      {
        data.jiaoanNum
          ?
          <div style={styleCss.marginRight}>教案：{data.jiaoanNum}</div>
          :
          null
      }
      {
        data.kejianNum
          ?
          <div style={styleCss.marginRight}>课件：{data.kejianNum}</div>
          :
          null
      }
      {
        data.xitiNum
          ?
          <div style={styleCss.marginRight}>习题：{data.xitiNum}</div>
          :
          null
      }
      {
        data.sucaiNum
          ?
          <div style={styleCss.marginRight}>素材：{data.sucaiNum}</div>
          :
          null
      }
      {
        data.qitaNum
          ?
          <div style={styleCss.marginRight}>其他：{data.sucaiNum}</div>
          :
          null
      }

    </div>
    return sourceDiv
  }

  /**
   * 取消置顶
   */
  cancelTopRecommendCur = (id) => {
    this.props.cancelTopRecommendCur_ac(id)
  }

  /**
   * 设为置顶
   */
  setTopRecommendCur = (id) => {
    this.setState({
      ifMessage: false,
      ModalShowOrHide: true,
      settopID: id
    })
  }

  /**
   * 设置自动发布
   */
  handleRadioChange = (e, id) => {
    this.props.updateOneCurStatus_ac({
      "curResourceId": id,
      "autoPubType": e.target.value
    })
  }

  /**
   * 跳转
   * snum:辅助资源数量
   * videoNum:录播资源
   * livePubStatus: 直播发布状态 -2终止直播:-1审核未通过，0未申请，1申请中，2审核通过(2.2)
   */
  jumpToVideo = (id, curFinishStatus, vodPubType, videoNum, snum, livePubStatus) => {
    let url = {};
    switch (curFinishStatus) {
      case 1:
        if (videoNum == 0) {
          if (snum == 0) {
            message.warning('无录播资源且无相关辅助资源，无法查看课堂')
          }
          else {
            url = {
              to: 'q_liveTrail',
              with: ['admin', id, 'un']
            }
          }
        }
        else {
          if (vodPubType == 2) {
            url = {
              to: 'q_recordVideo',
              with: ['admin', id, true]
            }
          } else {
            url = {
              to: 'q_recordVideo',
              with: ['admin', id, false]
            }
          }
        }
        break;
      case 0:
        url = {
          to: 'q_liveVideo',
          with: ['admin', id]
        }
        break;
      case -1:
        if (livePubStatus > 0) {//发布直播
          url = {
            to: 'q_liveTrail',
            with: ['admin', id, 'un']
          }
        } else {
          if (snum == 0) {
            message.warning('该课堂未开始，且无关联资源，无法查看！')
          } else {
            url = {
              to: 'q_liveTrail',
              with: ['admin', id, 'un']
            }
          }
        }
        break;
    }
    if (url.to) {
      goWith(url);
    }

  }

  render() {
    const data = this.props.detail_data;
    const styleCss = {
      container: {
        width: 1300,
        minHeight: 500,
        margin: '20px auto 30px'
      },
      text: {
        marginBottom: 20,
        fontSize: 18,
        marginLeft: 20
      },
      itemBox: {
        border: '1px solid #ccc',
        marginBottom: 20,
        padding: '10px 20px 0'
      },
      flexDiv: {
        display: 'flex',
        alignItems: 'center',
        height: 40,
      },
      cName: {
        display: 'inline-block',
        maxWidth: 400,
        marginLeft: 10,
        fontSize: 18,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'bottom',
        cursor: 'pointer'
      },
      marginRight: {
        marginRight: 40
      },
      marginLeft: {
        marginLeft: 20,
      }
    }
    return (
      <div>
        {
          data.length > 0
            ?
            data.map((item, i) => (
              <div style={styleCss.container} key={i}>
                <div>
                  <Checkbox
                    style={styleCss.text}

                    onChange={(e, curResources, ind) => this.onCheckAllChange(e, item.trgId, item.curResources)}
                    checked={this.state['checkAll' + item.trgId]}>
                    {item.trgName}({item.curResources.length})
              </Checkbox>
                </div>
                {
                  item.curResources.length == 0
                    ?
                    null
                    :
                    (
                      item.curResources.map((items) => {
                        let btns = this.operateBtnShowOrHide(
                          {
                            vodPubStatus: items.vodPubStatus,
                            vodPubType: items.vodPubType,
                            livePubStatus: items.livePubStatus,
                            curFinishStatus: items.curFinishStatus,
                            videoNum: items.videoNum,
                            curResourceId: items.curResourceId,
                            recommendType: items.recommendType,
                            autoPubType: items.autoPubType
                          }
                        );//按钮的显示隐藏
                        let sourceNum = this.snumDecideShowOrHide(items);
                        let sourceNumber = items.daoxueNum + items.jiaoanNum + items.jiaocaiNum + items.sucaiNum + items.xitiNum + items.kejianNum + items.qitaNum;
                        return <div key={items.curResourceId}>
                          <div style={styleCss.itemBox}>
                            <div style={styleCss.flexDiv}>
                              <Checkbox disabled={btns ? false : true} checked={items.check} onChange={(e, trgId, id, arr) => this.HandleSingleChange(e, item.trgId, items.curResourceId, item.curResources)} ></Checkbox>
                              <Tooltip placement="right" title={items.curName}>
                                <div style={styleCss.cName} onClick={(id, type, snum) => this.jumpToVideo(items.curResourceId, items.curFinishStatus, items.vodPubType, items.videoNum, sourceNumber, items.livePubStatus)}>{items.curName}</div>
                              </Tooltip>
                            </div>
                            <div style={styleCss.flexDiv}>
                              <div style={styleCss.marginRight}>科目：{items.subName}</div>
                              <div style={{ ...styleCss.marginRight, flex: 1 }}>授课老师：{items.teacherName}</div>
                              {
                                items.curFinishStatus == 1
                                  ?
                                  null
                                  :
                                  <RadioGroup onChange={(e, id) => this.handleRadioChange(e, items.curResourceId)} defaultValue={items.autoPubType}>
                                    <Radio value={-1}>完成后暂不发布</Radio>
                                    <Radio value={1}>完成后发布到私有</Radio>
                                    {
                                      G.configInfo.pubCurType == 1
                                        ?
                                        <Radio value={2}>完成后发布到公有</Radio>
                                        :
                                        null
                                    }
                                  </RadioGroup>
                              }
                              {btns}

                            </div>
                            {sourceNum}
                          </div>
                        </div>
                      })
                    )
                }

              </div>
            ))
            :
            null
        }
        {
          this.state.ifMessage
            ?
            <HfModal
              title="消息提示"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={600}
              closeModal={this.closeModal}
              contents={<CancelOrPubCurModal closeModal={this.closeModal} ID={this.state.id} ModalType={this.state.ModalType} Role="manager" />}
            />
            :
            <HfModal
              title="上传置顶背景图"
              ModalShowOrHide={this.state.ModalShowOrHide}
              width={460}
              closeModal={this.closeModal}
              contents={<Mm_DetailSettopImg ID={this.state.settopID} closeModal={this.closeModal} />}
            />
        }

      </div>

    )
  }
}