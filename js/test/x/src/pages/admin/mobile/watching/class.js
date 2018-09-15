import React, { Component } from 'react';
import { WatClaList, WatClaContent } from '../../../../components/admin/index';
import _x from '../../../../js/_x/index';


export class WatchingClass extends Component {
  constructor() {
    super();
    this.state = {
      onlineNumber: 0,     //在线人数
      onNumber: 0,     //在线人数
      offNumber: 0,     //离线人数
      offlineNumber: 0,     //离线人数
      total: 0,     //设备总数
      selectPla: '',   //选中的id
      // gradeId: '',     //选中的年级
      type: '',        //是教室还是场所
      state: '',     //场所类型
      keyword: '',  //搜索的关键词
      ifTab: false,   //是否是tab切换
    }
    this.requestOnlineNum = this.requestOnlineNum.bind(this);
    this.selectedPlace = this.selectedPlace.bind(this);
  }
  componentWillMount() {
    this.requestOnlineNum('', '', 0, '');
  }

  /**
   * 获取在线人数
   * @param {*} addressId 场所
   * @param {*} gradeId 年级
   *  @param {*} keyword 搜索关键词
   */
  requestOnlineNum(gradeId, addressId, state, keyword, keys, type, tabs) {
    var gId;
    if (gradeId.length) {
      gId = gradeId[0];
    } else {
      gId = ""
    }
    var req = {
      action: 'api/web/manager_manage_class_card/online_number',
      data: {
        gradeId: gId,
        addressId: addressId ? addressId : '',
        placeType: state,
        keyword: keyword
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret);
      if (ret.result && ret.data) {
        const data = ret.data;
        this.setState({
          onlineNumber: data.online,
          offlineNumber: data.offline,
          keyword: keyword,

          selectPla: keys,
          type: type,
          state: state,
          ifTab: tabs
        })
      } else {
        this.setState({
          selectPla: keys,
          type: type,
          state: state,
          ifTab: tabs
        })
      }
    })
  }

  selectedPlace(keys, type, state, tabs, keyword) {
    //选中的id   --年级还是场所   --选中的场所的级别 ---是否是tab切换   --关键字
    state = state == null || state == "" ? 0 : state;
    if (type === 'nj') {
      this.requestOnlineNum(keys, '', 0, keyword, keys, type, state);
    } else {
      this.requestOnlineNum('', keys, state, keyword, keys, type, state);
    }
  }

  render() {
    return (
      <div className='cjy-clearfix'>

        {/* 执行了2次 */}
        <WatClaList
          total={this.state.onlineNumber + this.state.offlineNumber}
          selectedPlace={this.selectedPlace}
          keyword={this.state.keyword}
        ></WatClaList>

        <WatClaContent
          onlineNumber={this.state.onlineNumber}
          offlineNumber={this.state.offlineNumber}
          selectPla={this.state.selectPla}      //选中的场所
          // seleGra={this.state.gradeId}      //选中的年级
          seleType={this.state.type}          ////是教室还是场所
          state={this.state.state}      //场所类型
          ifTab={this.state.ifTab}      ////是否是tab切换
          keyword={this.state.keyword}
          requestOnlineNum={this.requestOnlineNum}
        ></WatClaContent>
      </div>
    );
  }
}

