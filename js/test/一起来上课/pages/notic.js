/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:34:30 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-07 15:40:28
 * 通知管理
 */
import React from 'react'
import Container from '../index'
import Notic from '../components/notic_ctrl/notic';
import NoticBar from '../components/notic_ctrl/noticBar';
import { request as ajax } from '../js/clientRequest';
import { ModalConfrim, ModalSuccess } from '../components/public/modal';
import { message } from 'antd';
// import { Button } from 'antd';
// import InitialData from '../components/getDataInServer';

export default class NoticCtrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      data: {
        'pageIndex': 1,   //(当页)
        'pageSize': 10,      //(每页显示条数)
        'totalPage': 2,     // (总页数)
        'totalElements': 20, //(总条数)
        'pageContent': []

      },  // 通知列表的数据   
      searchNewValue: '',  //  noticBar传过来输入框的值
      arrData: [],
      deleteArrId: []
    }
  }


  /**
   * 点击搜索按钮时间
   * @param {*} n 
   */
  getSearch(n) {
    this.setState({
      searchNewValue: n
    })
    //  搜索请求
    // ajax("message/find_messages", {
    //   buildingid: "1", //那栋楼的id，若查询全部则传 " "//
    //   text: n,//通知标题//
    //   pageSize: 10,//每页显示多少条
    //   pageIndex: 1,//当前页
    // }, res => {
    //   console.log("搜索结果：", res.data);
    // })
  }

  // p删 2子级点批量删除，触发该方法，执行：
  // 1 遍历出id的集合   2 发送请求，删除选中通知
  getAllCheckId = () => {
    let arrNoticsId = [];
    let arrData = this.state.arrData;
    for (var i = 0; i < arrData.length; i++) {
      arrNoticsId.push(arrData[i].noticeid)
    }
    this.setState({ deleteArrId: arrNoticsId })
    // 显示操作确认模态框
    ModalConfrim.show({
      okFn: () => {
        console.log('点击确定')
        //请求删除接口
        // ajax('message/delete_notice_id',  {arrNoticsId} , (res) => {
        //     if(res.result){
        //       // 删除成功 根据返回的data重新渲染通知列表
        //       this.setState({data:res.data})   
        //     } else {
        //       // 删除失败,显示错误提示
        //       message.warning(res.message);
        //     }
        // })
        console.log("成功删除id:", this.state.deleteArrId)
      },
      cancleFn: () => {
        console.log('操作已取消')
      }
    })
  }

  // 点击所有通知
  lookAllNotics() {
    let paramAllLook = {
      "buildingid": "", //那栋楼的id，若查询全部则传 " "//
      "text": "",//通知标题//
      "pageSize": 10,//每页显示多少条
      "pageIndex": 1,//当前页
    }
    console.log('点击查看全部通知')
    // ajax('message/message/find_messages',  {paramAllLook} , (res) => {
    //     if(res.result){
    //       // 删除成功 根据返回的data重新渲染通知列表
    //       this.setState({data:res.data})   
    //     } else {
    //       // 删除失败,显示错误提示
    //       message.warning(res.message);
    //     }
    // })
  }

  // p删 0-1拿到子页面传来的列表集合
  getNoticData = (arrData) => {
    console.log("arrData", arrData)
    this.setState({
      arrData
    })
  }


  render() {
    return (
      <Container>
        <div className="hf-nt-main">
          <NoticBar
            // getSearch={n => this.getSearch(n)}
            // allNoticsId={this.getAllCheckId}
            // allNoticsLook={this.lookAllNotics}
          />
          <Notic
            // noticData={this.getNoticData}
          />
        </div>
      </Container>
    )
  }
}