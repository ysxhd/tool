/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:26:22 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-23 16:06:20
 * 教室管理
 */
import React from 'react';
import Container from '../index'
import ClassRoom from '../components/classRoom_ctrl/classRoom'
import { request as ajax } from '../js/clientRequest';
import { setConfig } from '../js/clientRequest';
import { G as server_config } from '../js/global';
import Router from 'next/router'
// import { connect } from 'react-redux'

if (!!process.browser && window) {
  //数据服务初始化及相关逻辑 前端请求中间层
  const dataServices = `${server_config.middlewarePath}:${server_config.nextServicePort}/`;
//   //从sso截取token
//   const search = decodeURI(window.location.search.replace('?', ''));
//    let strs = search.split("&"),orgcode,token;
//    try {
//     orgcode = strs[0].split("=")[1];
//     token = strs[1].split("=")[1];
//  } catch (error) {
//     orgcode="";
//     token="";
//  }   

//   server_config.token = token
//   server_config.orgcode = orgcode
//    setConfig(dataServices, orgcode, token);

}

export default class ClassRoomCtrl extends React.Component {
  // 加载首屏数据
  static async getInitialProps({ err, req, res, pathname, query, asPath }) {
    let isServer;

    var placeData = []
    var classFirstInfo = []
    if (!process.browser) {
      isServer = true;
    } else {
      isServer = false;
      // 请求场所
      // var {data} = await ajax('classroom/find_teaching_building', {}, (res) => {    })
      // console.log("placeData:", data);
      
      // // 请求教室数据
      // await ajax('classroom/reset_findAll_class', {
      //   // buildingid: placeData[0].buildingid,
      //   buildingid: "51043BB7C24C4967ADBBB9F1D08402E4",
      //   // floors: placeData[0].floors,
      //   floors: 6,
      //   type: 0
      // }, (res) => {
      //   console.log("placeData:", data[0]);
      //   if (res.status === 200) {
      //     if (res.data.result && res.data.data && res.data.data.length) {
      //       classFirstInfo = res.data.data
      //     } else {
      //       classFirstInfo = []
      //     }
      //   } else if (res.status === 404 || res.status === 500) {
      //     classFirstInfo = []
      //   }
      // })
    }
    return {
      isServer,
      classFirstInfo
    }
  }

  constructor(props) {
    super(props); 
    this.state = {
      ...props
    }
  }

  render() {
    return (
      <Container>
        <ClassRoom/>
     </Container>
    )
  }
}
