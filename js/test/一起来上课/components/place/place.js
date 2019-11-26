/*
 * @Author: JC.liu 
 * @Date: 2018-06-19 13:47:14 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-07 13:46:09
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { chancePlaceAction_action, getPlaceData_action, floor_placeData_action, push_enptyFloor_action } from '../../redux/place/place.redux'
import { class_paixu_action, class_again_action } from '../../redux/classRoom/classRoom.redux'
import { allNoticBtn_action, notic_check_all } from '../../redux/notic/tableOperat.redux'
import { request as ajax } from '../../js/clientRequest';

@connect(state => state, {
  // 切换场所
  chancePlaceAction_action,
  // 重新获取教室数据
  class_paixu_action,
  // 获取场所数据
  getPlaceData_action,
  // 请求教室数据
  class_again_action,
  // 请求通知的信息
  allNoticBtn_action,
  //选中楼层名字
  floor_placeData_action,
  // push 全部楼层
  push_enptyFloor_action,
  //清除选中的check
  notic_check_all
})
export default class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      type: 1 //当前选中地址1教室管理，2通知管理、统计分析
    };
    this.sdata = [];//新加的所有数据
  }

  /**
   * 场所切换 
   * @param {*} id        切换的楼层ID
   * @param {*} name      切换的楼层名字 
   * @param {*} floors    所有楼层
   */
  changePlace(id, name, floors, index) {
    var pathname = window.location.pathname;
    //楼层名字
    //  if(this.state.type === 2){
    //   this.props.floor_placeData_action(this.sdata[index].name,this.sdata[index].buildingid);
    //  }
    if (id) {
      // console.log("id存在");
      this.props.chancePlaceAction_action(id, name, floors)
      switch (pathname) {
        case "/statistics":
          break;
        case "/notic":
          //清空checkbox选中状态
          this.props.notic_check_all([], []);
          // 请求通知的数据
          this.props.allNoticBtn_action(id, this.props.TableOperatReducer.searchText, 1)
          break;
        case "/classRoom":

          // 重新请求 教室的数据
          this.props.class_again_action(id, floors, 0, name, true)
          break;
        case "/":
          // 重新请求 教室的数据
          this.props.class_again_action(id, floors, 0, name, true)
          break;
        default:
          break;
      }
    } else {
      // console.log("id不存在 只请求通知");
      // 统计 场所切换的时候 切换场所名  id
      this.props.chancePlaceAction_action("", name, floors)
      // 请求通知的数据
      this.props.allNoticBtn_action("",this.props.TableOperatReducer.searchText, 1)
    }
  }

  componentDidMount() {
    var pathname = window.location.pathname;
    // if(pathname === "/" || pathname === "/classRoom"){
    //       this.setState({
    //         type:1
    //       })
    //  }else{
    //   this.setState({
    //     type:2
    //   })
    // }
    // if (pathname === "/notic" || pathname === "/statistics") {
    //   // 通知页面 和统计页面  push 全部楼层
    //   console.log("11111111111:", this.props.placeReducer.buildingData);
    //   // this.props.push_enptyFloor_action(this.props.placeReducer.buildingData)
    // }
  }





  render() {
    // this.sdata = JSON.parse(JSON.stringify(this.props.placeReducer.buildingData));
    // this.sdata.unshift({ buildingid: "", name: "全部楼层", floor: 0 });
    return (
      <div className="hf-pl-mian">
        <div className="hf-pl-box">
          <div className="hf-pl-ctrlP">
            {/* 场所展示 */}
            <span>
              {/* {this.state.type === 1 ? this.props.placeReducer.showPlaceBuiildingName:this.props.placeReducer.showPlaceBuiildingName2} */}
              {this.props.placeReducer.showPlaceBuiildingName}
            </span>
            <i className="iconfont icon-laxia-copy hf-pl-ctrl " ></i>
            <ul className="hf-pl-list">
              {
                // this.state.type === 1 ?
                this.props.placeReducer.buildingData.map((item, index) => (
                  <li key={index}
                    onClick={() => this.changePlace(item.buildingid, item.name, item.floors, index)}
                  >
                    {item.name}
                  </li>
                ))
                // :
                // this.sdata.map((item, index) => (
                //   <li key={item.buildingid}
                //     onClick={() => this.changePlace(item.buildingid, item.name, item.floors, index)}
                //   >
                //     {item.name}
                //   </li>
                // ))
              }
            </ul>
          </div>
        </div>
      </div >
    )
  }
}