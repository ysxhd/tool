/*
 * @Author: MinJ 
 * @Date: 2018-01-05 09:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-04-25 16:41:28
 * 状态监督——分组树组件
 */
import React, { Component } from 'react';
import { Tabs, Tree } from 'antd';
import { G } from './../../js/g';
import _x from './../../js/_x/index';

import '../../css/admin/watClaList.css';
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

export class WatClaList extends Component {
  constructor() {
    super();
    this.state = {
      keyword: '',       //关键字
      treeClassList: {},    //教室树列表
      treePlaceList: {},    //场所树列表
      seleVal: [],       //选中的场所或年级   树展示
      seleVal1: [],       //选中的场所或年级   树展示 
      schoolId: 'A',            //按年级   学校节点id
      schoolId1: '',            //按场所   学校节点id
      treeGraFir: [],        //年级树展开列
      treePlaFir: [],        //场所树展开列
    }
    this.requestClaList = this.requestClaList.bind(this);
    this.requestPlaList = this.requestPlaList.bind(this);
    this.selePla = this.selePla.bind(this);
    this.seleCla = this.seleCla.bind(this);
    this.expandNode = this.expandNode.bind(this);
    this.dataHandle = this.dataHandle.bind(this);

    this.num = 0;
  }
  componentWillMount() {
    // console.log(G);
    this.requestClaList(0);
    this.requestPlaList(0);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      keyword: nextProps.keyword
    })
  }

  /**
   * 获取年级树列表(无入参)
   */
  requestClaList(status) {
    var req = {
      action: 'api/web/manager_manage_class_card/get_grade_group_devices',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret);     
      const data = ret.data;
      // console.log(data.length)
      if (data == null) {
        return;
      }

      var listTotal = 0;
      var treeClass = {
        name: '萱花中学',
        id: 'A',
        value: 0,
        childList: []
      };

      for (var i = 0; i < data.length; i++) {
        listTotal = listTotal + data[i].value;
        treeClass.value = listTotal;
        treeClass.childList.push(data[i]);
      }
      this.setState({
        treeClassList: [treeClass],
        treeGraFir: [treeClass.id],
        seleVal: ['A']
      })
    })
  }
  /**
   * 获取场所树列表(无入参)
   */
  requestPlaList(status) {
    var req = {
      action: 'api/web/manager_manage_class_card/find_place_info_tree',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      const data = ret.data;
      if (data == null) {
        return;
      }

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
        treePlaFir: [data.id],
        seleVal1: [data.id],
        schoolId1: data.id
      });
    })
  }

  // 递归获取树节点的value、
  getNum(data) {
    //   console.log(data.value)
    //   console.log(data.childList)
    //   if(data.childList){
    //     data.childList.map((item)=>{
    //       console.log(item.value)
    //       return this.getNum(item)
    //     })
    //   }

  }

  /**
   * 树节点操作
   */
  seleCla(selectedKeys, info) {
    // console.log(info);
    var keys = [];
    keys.push(info.node.props.dataRef.id);
    // console.log(keys);
    var seleVal = this.state.seleVal;
    if (keys[0] === this.state.schoolId) {
      //选中学校
      this.props.selectedPlace('', 'nj', 0, false, this.state.keyword);
      this.setState({
        seleVal: [this.state.schoolId]
      })
    } else if (keys[0] === seleVal[0]) {
      //点击相同节点
      this.setState({
        seleVal: seleVal
      })
      this.props.selectedPlace(seleVal, 'nj', 0, false, this.state.keyword);
    } else {
      //点击不同且非学校节点
      this.setState({
        seleVal: keys
      })
      this.props.selectedPlace(keys, 'nj', 0, false, this.state.keyword);
    }
  }
  selePla(selectedKeys, info) {
    var keys = [];
    keys.push(info.node.props.dataRef.id);
    // console.log(keys);
    var seleVal1 = this.state.seleVal1;
    const type = info.node.props.dataRef.type;
    if (keys[0] === seleVal1[0]) {
      //点击相同节点
      this.setState({
        seleVal1: seleVal1
      })
      var data = this.dataHandle(seleVal1, info);
      this.props.selectedPlace(data, 'cs', type, false, this.state.keyword);
    } else {
      //点击不同且非学校节点
      this.setState({
        seleVal1: keys
      })
      var data1 = this.dataHandle(keys, info);
      this.props.selectedPlace(data1, 'cs', type, false, this.state.keyword);
    }
  }

  // Tabs切换使树节点root被选中，重新发送请求场所和年纪树班牌
  beSelected = (sele) => {
    // console.log(sele);
    this.requestClaList(0);
    this.requestPlaList(0);
    sele === '1' ?
      this.props.selectedPlace('', 'nj', 0, true, this.state.keyword) :
      this.props.selectedPlace('', 'cs', 0, true, this.state.keyword);
  }

  //递归处理数据
  dataHandle(seleKey, data) {
    var arr = '',
      dataList = data.node.props.dataRef;
    if (dataList.type === 2 || dataList.type === 3 || dataList.type === 1) {
      return dataList.id;
    } else {
      dataList.childList.map(item => {
        if (item.type === 0) {
          item.childList.map(dt => {
            arr = arr + ',' + dt.id;
          })
        } else {
          arr = arr + ',' + item.id;
        }
      })
      return arr;
    }
  }
  //展开收起节点
  expandNode(expandedKeys, info) {
    // console.log(expandedKeys);
    // console.log(info);
    this.setState({
      treePlaFir: expandedKeys
    })
  }

  renderTreeNodes = (data) => {
    // console.log(data);
    if (data.length) {
      return data.map((item) => {
        // console.log(item.id)
        if (item.childList) {
          return (
            <TreeNode title={`${item.name} (${item.value})`} key={item.id} dataRef={item}>
              {this.renderTreeNodes(item.childList)}
            </TreeNode>
          );
        }
        return <TreeNode title={`${item.name} (${item.value})`} key={item.id} dataRef={item} />;
      });
    }
  }

  render() {
    // console.log(this.state.treePlaceList);
    return (
      <div className='mj-wcl-content'>
        <div className='mj-wcl-contentTop'>
          <p>班牌建设</p>
          <div>
            <span>{this.props.total}</span>
          </div>
        </div>
        <div className="mj-wcl-cardContrl">
          <Tabs type="card" onClick={this.tabsChange} onChange={this.beSelected.bind(this)}>
            <TabPane tab="按年级" key="1" forceRender={true} id="t1" >
              <Tree
                expandedKeys={this.state.treeGraFir}
                selectedKeys={this.state.seleVal}
                onSelect={this.seleCla}
                onExpand={this.expandNode}
              // defaultExpandedKeys={this.state.expandedKeys}
              >
                {this.renderTreeNodes(this.state.treeClassList)}
              </Tree>
            </TabPane>

            <TabPane tab="按场所" key="2" forceRender={true} id="t2" >
              <Tree
                expandedKeys={this.state.treePlaFir}
                onSelect={this.selePla}
                onExpand={this.expandNode}
                selectedKeys={this.state.seleVal1}
              // defaultExpandedKeys={this.state.expandedKeys}
              >
                {this.renderTreeNodes(this.state.treePlaceList)}
              </Tree>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}