/*
* @Author: JC.liu 
* @Date: 2018-06-15 10:34:09 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-10 16:49:40
* 教室管理 
*/
import "./classRoom.css";
import React, { Component } from "react";
import { Button, Progress, message, Switch, Modal } from "antd";
import Capacity from "../public/capacity";
import _ from "lodash";
import { setConfig, request as ajax } from "../../js/clientRequest";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from "react-redux";
import {
  classRoomData_action,
  switchChangeShow_action,
  class_paixu_action,
  request_class_action,
  class_again_action,
  userName_Data_action,
  avatar_url
} from "../../redux/classRoom/classRoom.redux";
import { getPlaceData_action } from "../../redux/place/place.redux";
import { ModalConfrim, ModalSuccess, ModalError } from "../public/modal";
import { G as server_config } from "../../js/../js/global";
import Router from "next/router";

@connect(
  state => state,
  {
    // 渲染数据 重构教室数据 为了拖拽
    classRoomData_action,
    // 展示
    switchChangeShow_action,
    // 排序
    class_paixu_action,
    // 首次请求教室数据，先请求场所在请求教室
    request_class_action,
    // 请求教室数据，其中只有一个教室数据请求，
    class_again_action,
    // 请求场所数据
    getPlaceData_action,
    //获取用户名字
    userName_Data_action,
    // 用户头像地址
    avatar_url
  }
)
export default class ClassRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props
    };
  }

  componentWillMount() {
    if (!!process.browser && window) {
      //数据服务初始化及相关逻辑 前端请求中间层
      const dataServices = `${server_config.middlewarePath}:${
        server_config.nextServicePort
        }/`;
      //从sso截取token
      const search = decodeURI(window.location.search.replace("?", ""));
      let strs = search.split("&"),
        orgcode,
        token;
      try {
        orgcode = strs[0].split("=")[1];
        token = strs[1].split("=")[1];
      } catch (error) {
        orgcode = "";
        token = "";
      }

      server_config.token = token;
      server_config.orgcode = orgcode;
      setConfig(dataServices, orgcode, token);
    }
  }

  componentDidMount() {
    var props = this.props.placeReducer;
    //是否从sso跳转
    if (!sessionStorage.getItem("token")) {
      ajax(
        "ssoLogin",
        {
          token: server_config.token,
          orgCode: 8650011800001
        },
        res => {
          if (res.status === 200 && res.data.code === "200") {
            if (!res.data.result || !res.data.data) {
              //  Router.push("/_error")
            } else {
              sessionStorage.setItem("user", JSON.stringify(res.data.data));
              sessionStorage.setItem("token", res.data.data.token);
              // 保存用户名字
              this.props.userName_Data_action(res.data.data.name);
              this.props.request_class_action(0);
              // 获取用户头像地址
              this.props.avatar_url(res.data.data.imgCloudId);
            }
          } else {
            ModalSuccess.show({ flag: false, data: res.data.message });
          }
        }
      );
    } else {
      // 将教室数据加到redux 如果buildingid不存在 则重新请求
      if (!props.nowBuilding) {
        this.props.request_class_action(0);
      } else {
        this.props.class_again_action(
          props.nowBuilding,
          props.floors,
          0,
          false,
          false,
          this.props.placeReducer.buildingData
        );
      }
    }
  }

  /**
   * 拖拽开始  修改原 来的数组 删除被拖拽的目标
   * @param {*} text  被拖拽的数据
   * @param {*} e
   */
  drag(text, e) {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    var isIE = this.isIE();
    // IE 支持以下H5语法
    console.log(isIE);
    if (!isIE) {
      e.dataTransfer.setData("dragTarget", text);
    } else {
      this.dragTargetArr = text;
    }
  }

  isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;
    else return false;
  }

  /**
   * 拖拽结束  寻找覆盖源
   * @param {*} e
   */
  drop(id, e) {
    e.preventDefault();
    e.stopPropagation();
    // 所有数据
    var oldData = this.props.ClassRoomReducer.classInfo;
    var data = this.props.ClassRoomReducer.classInfo;
    // 被拖拽目标所在的左边  X-Y
    var isIE = this.isIE();
    var dragTargetArr;
    if (!isIE) {
      dragTargetArr = e.dataTransfer.getData("dragTarget").split("-");
    } else {
      // IE 浏览器不支持e.dataTransfer 直接用 e.target.id
      dragTargetArr = this.dragTargetArr.split("-");
    }

    // 拖拽目标的楼层
    var dragBuiding = dragTargetArr[0];
    // 拖动源 index
    var dragIndex = dragTargetArr[1];

    // 返回 字符串 2-2  覆盖源楼层 覆盖源该条数据在楼层数据中的index
    var dropTargetArr = this.findDOMBuidingId(e.target).split("-");
    // console.log("dragTargetArr:", dragTargetArr);
    // console.log("dropTargetArr:", dropTargetArr);

    var dropBuiding = dropTargetArr[0];
    // 覆盖源的 index
    var dropIndex = dropTargetArr[1];

    // 如果两个不相等则 提示，
    if (dragBuiding !== dropBuiding) {
      message.warning("教室不能跨楼层拖动！", 2);
    } else {
      // 是同一楼层  则将拖拽的目标添加到 覆盖源 上
      // 覆盖源的楼层数据
      let buiding = _.find(data, { id: parseInt(dragBuiding) });
      // 在楼层数据中的 第几条
      let buidingIndex = data.indexOf(buiding);

      // 拿到 拖动的楼层 在 data 中的index  因为是在同楼层拖拽 所以拖动源和覆盖源 的index 是一样的
      // 拿到 被拖拽的目标位置
      let drgTarget = buiding.classes[parseInt(dragIndex)];

      // 拿到 覆盖源的目标位置
      let dropTarget = buiding.classes[parseInt(dropIndex)];

      // 如果 dropIndex 存在说明是覆盖源在item 上，不存在则是覆盖源在 当前楼层内末尾
      if (dropIndex) {
        // dropIndex++
        // // 拖动时删除自身
        // buiding.classes.splice(dragIndex, 1)

        if (dragIndex > dropIndex && dragIndex - dropIndex !== 1) {
          // console.log("拖动源index1 > 覆盖源index2");
          // 拖动源index1 > 覆盖源 index2
          let classes = buiding.classes;
          let middleArr = [];
          var i = parseInt(dropIndex) + 1;
          // 查找 拖动源 和 覆盖源之间的数据
          for (i; i < dragIndex; i++) {
            middleArr.push(classes[i]);
          }

          // 中间的数据的位置 + 1
          for (var i = 0; i < middleArr.length; i++) {
            middleArr[i].defineorder++;
          }
          // 拖动源的位置 = 覆盖源的位置 +1
          var coverPos = classes[dropIndex].defineorder;
          classes[dragIndex].defineorder = coverPos + 1;
          // 封装入参
          this.request(classes);
        } else if (dragIndex < dropIndex && dropIndex - dragIndex !== 1) {
          // console.log("拖动源index1 < 覆盖源index2");
          // 拖动源index1 < 覆盖源 index2
          let classes = buiding.classes;
          let middleArr = [];
          var i = parseInt(dragIndex) + 1;
          var len = parseInt(dropIndex) + 1;
          // 查找 拖动源 和 覆盖源之间的数据
          for (i; i < len; i++) {
            middleArr.push(classes[i]);
          }

          // 拖动源自身的位置  = 覆盖源的位置 + 1
          var coverPos = classes[dropIndex].defineorder;
          classes[dragIndex].defineorder = coverPos;

          // 中间的数据位置  - 1
          for (var i = 0; i < middleArr.length; i++) {
            middleArr[i].defineorder--;
          }
          // 封装入参
          this.request(classes);
        } else if (dropIndex - dragIndex === 1 || dragIndex - dropIndex === 1) {
          // console.log("拖动源覆盖源相邻", dragIndex, dropIndex);
          // 将两个位置交换
          let classes = buiding.classes;

          let start = classes[dragIndex].defineorder;
          let end = classes[dropIndex].defineorder;
          classes[dropIndex].defineorder = start;
          classes[dragIndex].defineorder = end;

          this.request(classes);
        }
      } else {
        // 覆盖源在 当前楼层内末尾
        // buiding.classes.splice(dragIndex, 1)
        // buiding.classes.push(drgTarget)
        // 拖动源的位置  = length
        let classes = buiding.classes;
        classes[dragIndex].defineorder = classes.length;
        let middleArr = [];
        // 拖动源后面的数据 都 + 1
        for (var i = parseInt(dragIndex) + 1; i < classes.length; i++) {
          middleArr.push(classes[i]);
        }

        for (var i = 0; i < middleArr.length; i++) {
          middleArr[i].defineorder--;
        }

        this.request(classes);
      }
    }
  }

  /**
   * 向上查找元素的id值
   * @param {*} dom
   */
  findDOMBuidingId(dom) {
    var id = dom.id;
    if (!id) {
      return this.findDOMBuidingId(dom.parentNode);
    } else {
      return id;
    }
  }

  /**
   * 将排序好的数据抽取出入参
   * @param classes  该自定义排序的 楼层的数据  且排序好了的
   */
  request = classes => {
    var request = classes.map((item, index) => {
      return {
        classId: item.classId,
        defineorder: `${item.defineorder}`
        // className: item.className
      };
    });
    var props = this.props.placeReducer;
    this.props.class_paixu_action(request, props.nowBuilding, props.floors, 0);
  };

  allowDrop(e) {
    e.preventDefault();
  }

  /**
   * 开关 点击操作
   * @param {*} building
   * @param {*} index
   * @param {*} checked
   */
  switchOnChange(classId, bl) {
    var props = this.props.placeReducer;
    // 传入当前楼栋 id 和 该楼栋都几层
    this.props.switchChangeShow_action(
      classId,
      bl,
      props.nowBuilding,
      props.floors
    );
    // 重新获取新的教室信息
    // this.props.class_paixu_action(t this.props.class_paixu_action(this.props.placeReducer.nowBuilding, this.props.placeReducer.floors, 1)
  }

  /**
   * 剩余时间转换
   */
  renderNextTime = time => {
    // 时间戳 是当天时间的最后一秒 - 减去当前时间的时分秒
    var nowHours = new Date().getHours(),
      nowMin = new Date().getMinutes();
    var lastHours = new Date(time).getHours(),
      lastMin = new Date(time).getMinutes();
    var restHours;
    if (lastHours > nowHours) {
      restHours = lastHours - nowHours;
    } else {
      restHours = nowHours - lastHours;
    }
    var restMin;
    if (lastMin > nowMin) {
      restMin = lastMin - nowMin;
    } else {
      restMin = nowMin - lastMin;
    }
    return `${restHours}h   ${restMin}m`;
  };

  percent(percent) {
    var num = parseFloat((percent * 100).toFixed(1));
    return num;
  }

  /**
   * render 数据
   * @param {*} data
   */
  renderCard(data) {
    return data.classes.map((item, ind) => {
      if (item.isonclass) {
        // 使用中的教室
        return (
          // item 被拖拽的目标
          <div
            // key 为了快速查找到覆盖源的数据所在data中的位置
            key={ind}
            className="JC-item"
            draggable="true"
            onDragStart={this.drag.bind(this, `${data.id + "-" + ind}`)}
            // id 为了快速查找到楼层
            id={`${data.id + "-" + ind}`}
          >
            {item.show ? null : <div className="JC-item-mask" />}
            <div className="JC-card-point">
              <Switch
                checked={item.show}
                onChange={this.switchOnChange.bind(
                  this,
                  item.classId,
                  item.show
                )}
              />
            </div>
            <div className="JC-card-body">
              <div className="JC-card-body-left">{item.className}</div>
              <div className="JC-card-body-right">
                <div className="JC-c-b-r-class">{item.courseName}</div>
                <div className="JC-c-b-r-tea">
                  (&nbsp;
                  {item.teacherName}
                  &nbsp;)
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // 空闲教室
        return (
          // item 被拖拽的目标
          <div
            key={ind}
            className="JC-item"
            draggable="true"
            onDragStart={this.drag.bind(this, `${data.id + "-" + ind}`)}
            id={`${data.id + "-" + ind}`}
          >
            {item.show ? null : <div className="JC-item-mask" />}
            <div className="JC-card-point">
              <Switch
                checked={item.show}
                onChange={this.switchOnChange.bind(
                  this,
                  item.classId,
                  item.show
                )}
              />
            </div>
            <div className="JC-card-body">
              <div className="JC-card-body-left-Progress">
                <Progress
                  type="circle"
                  strokeWidth={13}
                  percent={this.percent(item.usageRate)}
                  format={() => item.className}
                />
              </div>
              <div className="JC-card-body-right-info">
                <div className="">
                  使用率：
                  <span className="JC-card-body-info-use">
                    {this.percent(item.usageRate)}%
                  </span>
                </div>
                <div className="">
                  剩余空闲：
                  {this.renderNextTime(item.nextTime)}
                </div>
              </div>
            </div>
          </div>
        );
      }
    });
  }

  /**
   * 重置按钮
   */
  reSetBtn = () => {
    ModalConfrim.show({
      title: "重置",
      content: "确认重置数据？",
      okFn: () => {
        const props = this.props.placeReducer;
        this.props.class_again_action(
          props.nowBuilding,
          props.floors,
          1,
          false,
          false,
          this.props.placeReducer.buildingData
        );
      },
      cancleFn: () => { }
    });
  };

  /**
   * num 转 中文
   */
  floor = floor => {
    switch (floor) {
      case 1:
        return "一";
      case 2:
        return "二";
      case 3:
        return "三";
      case 4:
        return "四";
      case 5:
        return "五";
      case 6:
        return "六";
      case 7:
        return "七";
      case 8:
        return "八";
      case 9:
        return "九";
      case 10:
        return "十";
      case 11:
        return "十一";
      case 12:
        return "十二";
      case 13:
        return "十三";
      case 14:
        return "十四";
      case 15:
        return "十五";
      case 16:
        return "十六";
      case 17:
        return "十七";
      case 18:
        return "十八";
      case 19:
        return "十九";
      case 20:
        return "二十";
      default:
        break;
    }
  };

  render() {
    return (
      <div className="JC-classRoom">
        {/* 为了解决背景 放css 有问题 勿删 */}
        <style jsx>
          {`
            .JC-card-left {
              background-image: url("../../static/bg2.png");
            }
          `}
        </style>
        <div className="JC-reset">
          <Button className="JC-reser-btn" onClick={this.reSetBtn}>
            重置
          </Button>
        </div>
        <div className="JC-classRoom-body">
          <Capacity>
            <div className="JC-cr-capacity">
              {this.props.ClassRoomReducer.classInfo &&
                this.props.ClassRoomReducer.classInfo.length ? (
                  this.props.ClassRoomReducer.classInfo.map((item, index) => {
                    if (item.classes.length) {
                      return (
                        <div className="JC-card" key={index}>
                          <div className="JC-card-left">
                            {this.floor(item.floor)}楼
                        </div>
                          <div
                            className="JC-card-right"
                            id={item.id}
                            onDragOver={this.allowDrop.bind(this)}
                            onDrop={this.drop.bind(this, item.id)}
                          >
                            {this.renderCard(item)}
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <p style={{
                    fontSize: "16px !important ", padding: 0, margin: 0, textAlign: "center", backgroundColor: '#21253E',
                    borderBottomColor: '#21253E',
                    color: '#4f576b',
                    userSelect: 'none'
                  }}>暂无数据</p>
                )}
            </div>
          </Capacity>
        </div>
      </div>
    );
  }
}
