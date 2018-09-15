/*
 * @Author: MinJ 
 * @Date: 2018-01-05 09:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-04-25 16:41:21
 * 在线升级——分组树组件
 */
import React, { Component } from 'react';
import { Tabs, Tree, Select, Button } from 'antd';
import { SVG, IMG } from './../base';
import _x from './../../js/_x/index';
import _ from 'lodash';

import '../../css/admin/upgradeClaList.css';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

export class UpgradeClaList extends Component {
  constructor() {
    super();
    this.state = {
      unitInfo: {},          //登录学校信息
      versionList: [],       //版本列表****
      versionValue: '',         //当前版本
      treeClassList: {},    //年级树列表****
      treePlaceList: {},    //场所树列表****

      treeGraFir: [],         //年级树展开列
      treePlaFir: [],        //场所树展开列
      seleVal: [],       //选中的场所或年级下的 设备id

      classCheckedObjs: [],      //选中的班级对象，用于过滤后上传数据
      placeCheckedObjs: [],      //选中的场所对象，用于过滤后上传数据
      selectedKeys: [],         //（受控）设置选中的树节点,仅用于展示
      checkedNodes1: [],         //选中的左边的树
      checkedNodes2: []         //选中的右边的树
    }
    this.requestClaList = this.requestClaList.bind(this);
    this.requestPlaList = this.requestPlaList.bind(this);
    this.selePla = this.selePla.bind(this);
    this.seleCla = this.seleCla.bind(this);
    this.requestVersion = this.requestVersion.bind(this);
    this.versiovChan = this.versiovChan.bind(this);
    this.upBtnCli = this.upBtnCli.bind(this);
    this.requestUpNow = this.requestUpNow.bind(this);
  }
  componentWillMount() {
    this.requestClaList(0);
    this.requestPlaList(0);
    this.requestVersion();
    // this.requestUpNow();
    this.setState({
      unitInfo: JSON.parse(sessionStorage.uinfo)
    })
  }
  componentWillReceiveProps(nextProps) {
    var version = nextProps.initVersion;
    nextProps.ifFresh
      ?
      this.requestVersion()
      :
      null
    this.setState({
      versionValue: version
    })
  }

  /**
   * 获取年级树列表
   */
  requestClaList(status) {
    var req = {
      action: 'api/web/manager_manage_class_card/get_grade_group_devices',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result && ret.data) {
        const data = ret.data;
        var listTotal = 0,
          unit = this.state.unitInfo,
          valAll = 0;
        var treeClass = {
          name: unit.schoolName,
          id: unit.accountId,
          value: 0,
          childList: []
        };
        data.map(gdt => {
          let classData = [];
          gdt.childerList.map(cdt => {
            classData.push({
              name: cdt.name + '班',
              id: cdt.id,
              parentsId: cdt.parentsId,
              ssid: cdt.ssids,
              value: cdt.value
            });
          });
          treeClass.childList.push({
            name: gdt.name,
            id: gdt.id,
            value: gdt.value,
            childList: classData
          });
          valAll = valAll + gdt.value;
        });
        treeClass.value = valAll;
        treeClass.name = "萱花中学";
        this.setState({
          treeClassList: [treeClass],
          treeGraFir: [treeClass.id]
        })
      }
    })
  }
  /**
   * 获取场所树列表
   */
  requestPlaList(status) {
    var req = {
      action: 'api/web/manager_manage_class_card/find_place_info_tree',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      const data = ret.data;
      //获取一共有多少设备
      var listTotal = 0;
      data.childList.map((item) => {
        var itemTotal = 0;
        item.childList.map((sub) => {
          listTotal = sub.value + listTotal;
          itemTotal = sub.value + itemTotal
        })
        item.value = itemTotal;
      })

      data.value = listTotal;
      this.setState({
        treePlaceList: [data],
        treePlaFir: [data.id]
      });
    })

    // if (status === 0)
    //   this.props.selectedPlace(treePlaceList[0].childrenList[0].id, 'cs');
  }
  /**
   * 获取版本列表
   */
  requestVersion() {
    var req = {
      action: 'api/web/manager_manage_class_card/software_version',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result && ret.data) {
        const data = ret.data;
        var versionData = [];
        // versionData.push({ name: `全部版本`, id: 'all' });
        for (var i = 0, len = data.length; i < len; i++) {
          versionData.push(data[i]);
        }
        this.setState({
          versionList: versionData
        })

        var val = '';
        versionData.length
          ?
          val = versionData[0].id
          :
          val = '请上传版本'
        this.props.initVersion
          ?
          ''
          :
          this.setState({
            versionValue: val
          })
      }
    })
  }
  /**
   * 当前升级 终端列表（初始化---无入参）
   */
  requestUpNow() {
    var req = {
      action: 'api/web/manager_device_software/get_device_list',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result && ret.data) {
        const data = ret.data;
        this.setState({
          seleVal: data
        })
      }
    })
  }

  //版本选择
  versiovChan(val) {
    this.setState({
      versionValue: val
    })
  }
  //开始升级 点击
  upBtnCli() {
    this.props.selectedPlace(this.state.seleVal, this.state.versionValue);
  }
  /**
   * 树节点操作
   */
  seleCla(selectedKeys, info) {
    var checkedNodes = info.checkedNodes;
    var seleVal = [];
    for (var i = 0, l = checkedNodes.length; i < l; i++) {
      var ssid = checkedNodes[i].props.dataRef.ssid;
      if (ssid) {
        var seleSsids = ssid.split(',');
        for (var n in seleSsids) {
          var inde = _.indexOf(seleVal, seleSsids[n]);
          if (inde === -1) {
            seleVal.push(seleSsids[n]);
          }
        }
      }
    }
    this.setState({
      checkedNodes1: checkedNodes,   //选中的左边的树
      seleVal: seleVal,       //设备id
      selectedKeys: selectedKeys
    })
  }
  selePla(selectedKeys, info) {
    var checkedNodes = info.checkedNodes;
    var seleVal = [];
    for (var i = 0, l = checkedNodes.length; i < l; i++) {
      var ssid = checkedNodes[i].props.dataRef.ssid;
      if (ssid) {
        var seleSsids = ssid.split(',');
        for (var n in seleSsids) {
          var inde = _.indexOf(seleVal, seleSsids[n]);
          if (inde === -1) {
            seleVal.push(seleSsids[n]);
          }
        }
      }
    }

    this.setState({
      checkedNodes2: checkedNodes,   //选中的左边的树
      seleVal: seleVal,
      selectedKeys: selectedKeys
    })
  }
  //树节点递归函数
  renderTreeNodes = (data) => {
    if (data.length) {
      return data.map((item) => {
        if (item.childList) {
          return (
            <TreeNode title={`${item.name}(${item.value})`} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.childList)}
            </TreeNode>
          );
        }
        return <TreeNode title={`${item.name} (${item.value})`} key={item.id} dataRef={item} />;
      });
    }
  }

  //tab切换左右两边选中的值同步
  // bothSlect(e) {
  //   var left = this.state.checkedNodes1,
  //     right = this.state.checkedNodes2,
  //     both = this.state.seleVal,//左右tab选中相同的
  //     selectedKeys = []; //存储被选中的idcheckbox高亮
  //   if (e == 1) {
  //     if (left.length) {
  //       for (var i = 0, l = left.length; i < l; i++) {
  //         var ssid = left[i].props.dataRef.ssids;
  //         if (ssid) {
  //           var seleSsids = ssid.split(',');
  //           for (let j = 0; j < both.length; j++) {
  //             if (seleSsids[0] == both[j]) {
  //               selectedKeys.push(left[i].props.dataRef.id)
  //             }
  //           }
  //         }
  //       }
  //       this.setState({
  //         selectedKeys: selectedKeys
  //       })
  //     }
  //   } else {
  //     if (right.length) {

  //     }
  //   }
  // }


  render() {
    return (
      <div className='mj-ucl-content'>
        <div className="mj-ucl-cardContrl">
          <Tabs onTabClick={this.bothSlect} type='card'>
            <TabPane tab="按年级" key="1">
              {
                this.state.treeClassList.length
                  ?
                  <div>
                    <div className='mj-ucl-top'>
                      <Select
                        placeholder='请上传版本'
                        value={this.state.versionValue}
                        onSelect={this.versiovChan}>
                      
                        {
                          this.state.versionList.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          ))
                        }
                      </Select>
                      <Button
                        disabled={this.state.versionList.length === 0 || this.state.seleVal.length === 0 ? true : false}
                        onClick={this.upBtnCli}>开始升级</Button>
                    </div>
                    <Tree onCheck={this.seleCla} checkable autoExpandParent={true} checkedKeys={this.state.selectedKeys}>
                      {this.renderTreeNodes(this.state.treeClassList)}
                    </Tree>
                  </div>
                  :
                  <div className='mj-ucl-noData cjy-clearfix'>
                    <div>
                      <IMG src={require('../../img/noData.png')} width="150px" height="150px" />
                      <div className="mj-ucv-txt">暂无相关内容</div>
                    </div>
                  </div>
              }
            </TabPane>

            <TabPane tab="按场所" key="2">
              {
                this.state.treePlaceList.length
                  ?
                  <div>
                    <div className='mj-ucl-top'>
                      <Select
                        placeholder='请上传版本'
                        value={this.state.versionValue}
                        onSelect={this.versiovChan}>
                        {
                          this.state.versionList.map(item => (
                            <Option value={item.id} key={item.id}>{item.name}</Option>
                          ))
                        }
                      </Select>
                      {/* <Button>开始升级</Button> */}
                      <Button
                        disabled={this.state.versionList.length === 0 || this.state.seleVal.length === 0 ? true : false}
                        onClick={this.upBtnCli}>开始升级</Button>
                    </div>
                    <Tree onCheck={this.selePla} checkable autoExpandParent={true} checkedKeys={this.state.selectedKeys}>
                      {this.renderTreeNodes(this.state.treePlaceList)}
                    </Tree>
                  </div>
                  :
                  <div className='mj-ucl-noData cjy-clearfix'>
                    <div>
                      <IMG src={require('../../img/noData.png')} width="150px" height="150px" />
                      <div className="mj-ucv-txt">暂无相关内容</div>
                    </div>
                  </div>
              }
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}