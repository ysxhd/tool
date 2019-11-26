import React, { Component } from 'react';
import { UpgradeClaVersion, UpgradeClaTab, UpgradeClaList, UpgradeClaLogList } from '../../../../components/admin/index';

export class UpgradeClass extends Component {
  constructor() {
    super();
    this.state = {
      ifDia: false,      //是否显示日志页
      ifFresh: false,        //是否需要刷新版本列表
      seleList: [],          //选中的场所
      seleVersion: 0,          //选中的版本
      initVersion: null,          //初始化版本
    }
    this.diaChan = this.diaChan.bind(this);
    this.seleList = this.seleList.bind(this);
    this.initVersion = this.initVersion.bind(this);
  }
  //是否是更新日志页面
  diaChan(valDia, valFre) {
    this.setState({
      ifDia: valDia,
      ifFresh: valFre
    });
  }
  //选择了的场所及升级版本
  seleList(seleList, version) {
    this.setState({
      seleList: seleList,
      seleVersion: version
    })
  }
  initVersion(version) {
    this.setState({
      initVersion: version
    })
  }

  render() {
    return (
      (
        this.state.ifDia
          ?
          <div className='cjy-clearfix'>
            <UpgradeClaLogList diaChan={this.diaChan}></UpgradeClaLogList>
          </div>
          :
          <div className='cjy-clearfix'>
            <UpgradeClaVersion diaChan={this.diaChan}></UpgradeClaVersion>
            <UpgradeClaList
              selectedPlace={this.seleList}
              ifFresh={this.state.ifFresh}
              initVersion={this.state.initVersion}></UpgradeClaList>
            <UpgradeClaTab
              seleList={this.state.seleList}
              seleVersion={this.state.seleVersion}
              initVersion={this.initVersion}></UpgradeClaTab>
          </div>
      )
    );
  }
}