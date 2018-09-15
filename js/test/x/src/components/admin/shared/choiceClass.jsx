/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:57:44 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-23 12:41:49
 * 树组件到班级无拼接
 * 父组件用法：
 *  <ChoiceClass choiceAdrVis={ this.state.choiceAdrVis } hideChoiceAdr={this.hideChoiceAdr} addressIds={this.state.addressIds} hideAddre={true}/>
 * choiceAdrVis:选择场所栏是否可见
 * hideChoiceAdr(addressObj,ssIds)
 * addressIds：数据回显时的ID
 * addressObj:往外传的场所对象
 * ssIds:往外传的设备id
 * hideAddre:禁用场所选择
 */
import React, { Component } from 'react';
import { Tabs, Button, Tree } from 'antd';
import _x from '../../../js/_x/index';
import '../../../css/admin/choiceClass.css';

const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

export class ChoiceClass extends Component {
  constructor(){
    super();
    this.state = {
      expandedKeys: [],         //（受控）展开指定的树节点
      autoExpandParent: true,   //是否自动展开父节点
      // classCheckedKeys:[],      //班级（受控）选中复选框的树节点
      // placeCheckedKeys:[],      //场所（受控）选中复选框的树节点
      // checkedObjs: [],          //选中的对象
      classCheckedObjs:[],      //选中的班级对象，用于过滤后上传数据
      placeCheckedObjs:[],      //选中的场所对象，用于过滤后上传数据
      selectedKeys: [],         //（受控）设置选中的树节点,仅用于展示
      gradeData:[],             //年级数据
      placeData:[],             //场所数据
    };
    // this.key = '1';               //当前面板，1班级2场所
  };

  componentWillReceiveProps(newProps){
    if (newProps.addressIds&&this.state.selectedKeys.length===0){
      this.setState({
        // classCheckedKeys:newProps.addressIds
        selectedKeys:newProps.addressIds
      })
    }
  }

  componentDidMount(){
    this.getGradeData();
    this.getPlaceData();
  }

  /**
   * 获取年级树数据
   */
  getGradeData = () => {
    let req = {
      action:'api/web/manager_daliy_published/get_class_tree_by_grade',
      data:{
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let gradeData = ret.data;
        let data = [];
        let dataTemp = {};
        dataTemp.title = gradeData.schoolName,
        dataTemp.key = gradeData.id,
        dataTemp.children = [];
        gradeData.grades.map(gdt => {
          let classData = [];
          gdt.classes.map(cdt => {
            classData.push({
              title:cdt.className,
              key:cdt.id,
              addressId:cdt.id,
              ssid:cdt.ssid,
              classId:cdt.classId
            });
          });
          dataTemp.children.push({
            title:gdt.gradeName,
            key:gdt.gradeId,
            children:classData
          });
        });
        data.push(dataTemp);
        this.setState({
          gradeData:data
        });
      }
    });
  };

  /**
   * 获取场所数据
   */
  getPlaceData = () => {
    let req = {
      action:'api/web/manager_daliy_published/get_class_tree_by_address',
      data:{
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let dataTemp = [ret.data];
        let data = this.analyData(dataTemp);
        this.setState({
          placeData:data
        });
      }
    })
  }

  /**
   * 场所树数据解析函数
   */
  analyData = (data) => {
    return data.map(dt => {
      if(dt.childList){
        return {
          title:dt.name,
          key:dt.id,
          addressId:dt.id,
          ssid:dt.ssid,
          type:dt.type,
          classId:dt.classId,
          children:this.analyData(dt.childList)
        }
      }else{
        return {
          title:dt.name,
          key:dt.id,
          addressId:dt.id,
          ssid:dt.ssid,
          type:dt.type,
          classId:dt.classId
        }
      }
    });
  }

  /**
   * 树组件生成
   */
  renderTreeNodes = (data) => {
    return data.map((item) => {

      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} addressId={item.addressId?item.addressId:''} classId={item.classId?item.classId:''} ssid={item.ssid?item.ssid:''} type={item.type?item.type:''} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
    return <TreeNode {...item} />;
    });
  };

  /**
   * 选择班级
   */
  checkClass = (checkedKeys,info) => {
    this.setState({
      classCheckedObjs:info.checkedNodes,
      placeCheckedObjs:[],
      // classCheckedKeys:checkedKeys,
      selectedKeys:checkedKeys,
      // selectedKeys:[...new Set([...checkedKeys,...this.state.selectedKeys])]
    });
  };

  /**
   * 选择场所
   */
  checkPlace = (checkedKeys,info) => {
    this.setState({
      placeCheckedObjs:info.checkedNodes,
      classCheckedObjs:[],
      // placeCheckedKeys:checkedKeys
      selectedKeys:checkedKeys,
      // selectedKeys:[...new Set([...checkedKeys,...this.state.selectedKeys])]
    });
  }

  /**
   * 确定按钮
   */
  choiceFin = () => {
    let addressObj = [];
    let ssIds = [];
    // if(this.key==='1'){
    //   this.state.checkedObjs.map(cks => {
    //     if(cks.props.addressId){
    //       addressIds.push(cks.props.addressId);
    //       ssIds.push(cks.props.ssid);
    //     }
    //   });
    // }else{
    //   this.state.checkedObjs.map(cks => {
    //     if(cks.props.type===1){
    //       addressIds.push(cks.props.addressId);
    //       ssIds.push(cks.props.ssid);
    //     }
    //   });
    // }
    if(this.state.classCheckedObjs.length){
      this.state.classCheckedObjs.map(cks => {
        if(cks.props.addressId){
          addressObj.push({
            addressName:cks.props.title,
            addressId:cks.props.addressId,
            classId:cks.props.classId
          });
          ssIds.push(cks.props.ssid);
        }
      });
    }else{
      this.state.placeCheckedObjs.map(cks => {
        if(cks.props.type===1){
          addressObj.push({
            addressName:cks.props.title,
            addressId:cks.props.addressId,
            classId:cks.props.classId
          });
          ssIds.push(cks.props.ssid);
        }
      });
    }
    // addressIds = [...new Set(addressIds)];
    // ssIds = [...new Set(ssIds)];
    this.props.hideChoiceAdr(addressObj,ssIds);
  };

  /**
   * tab切换
   */
  // changeTab = (key) => {
  //   this.key = key;
  //   if(key==='1'){
  //     this.setState({
  //       classCheckedObjs:this.state.placeCheckedObjs
  //     });
  //   }else{
  //     this.setState({
  //       placeCheckedObjs:this.state.classCheckedObjs,
  //     });
  //   }
  // };
  
  render(){
    const dis = this.props.hideAddre;
    return (
      <div className={`cjy-cc-container ${this.props.choiceAdrVis?'cjy-cc-block':'cjy-cc-none'}`}>
        <Tabs type="card" onChange={this.changeTab}>
          <TabPane tab="按年级" key="1">
            <Tree checkable autoExpandParent={true} onCheck={this.checkClass} checkedKeys={this.state.selectedKeys}>
              {this.renderTreeNodes(this.state.gradeData)}
            </Tree>
          </TabPane>
          <TabPane tab="按场所" disabled={dis} key="2">
            <Tree checkable autoExpandParent={true} onCheck={this.checkPlace} checkedKeys={this.state.selectedKeys}>
              {this.renderTreeNodes(this.state.placeData)}
            </Tree>
          </TabPane>
        </Tabs>
        <div className="cjy-cc-tabBtnBox">
          <Button className="cjy-cc-sure" onClick={this.choiceFin}>确定</Button>
          <Button className="cjy-cc-cancel" onClick={this.props.hideChoiceAdr}>取消</Button>
        </div>
      </div>
    );
  }
}