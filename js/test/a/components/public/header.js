/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:08:38 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-07 14:38:51
 * 头部导航
 */
import "../../css/index.css";
import "./header.css";
import React, { Component } from "react";
import Place from "../place/place";
import Router from "next/router";
import { G as server_config } from "../../js/global";
import { connect } from "react-redux";

export class Header extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // console.log(this.props)
  }
  render() {
    return (
      <div className="hf-header-main">
        <Nav />
        <Place />
        <Avatar />
      </div>
    );
  }
}

// 页面导航
class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeNav: "",
      data: [
        { value: "0", href: "/classRoom", name: "教室管理" },
        { value: "1", href: "/notic", name: "通知管理" },
        { value: "2", href: "/statistics", name: "统计分析" }
      ]
    };
  }

  changeNav(ind, href) {
    Router.push(href);
  }
  componentDidMount() {
    if (process.browser) {
      let pathname = window.location.pathname,
        activeNav;
      switch (pathname) {
        case "/classRoom": {
          activeNav = 0;
          break;
        }
        case "/notic": {
          activeNav = 1;
          break;
        }
        case "/statistics": {
          activeNav = 2;
          break;
        }
        default: {
          activeNav = "";
        }
      }
      this.setState({
        ...this.state,
        activeNav
      });
    }
  }
  render() {
    //hf-header-active
    var dataList = this.state.data;
    return (
      <div className="JC-header-nav">
        <span className="JC-header-tit">一起去上课-管理平台</span>
        {/* 目录导航通过权限管理来动态生成 */}

        {dataList.map((item, index) => (
          <a
            className={
              this.state.activeNav == index
                ? "JC-header-link hf-header-active"
                : "JC-header-link"
            }
            onClick={this.changeNav.bind(this, index, item.href)}
            key={item.value}
          >
            <i className="iconfont icon-classroomMan hf-header-icon" />
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    );
  }
}

// 头像
@connect(state => state.ClassRoomReducer)
class Avatar extends Component {
  constructor() {
    super();
    this.state = {
      name: ""
    };
  }

  componentDidMount() {
    let data = JSON.parse(sessionStorage.getItem("user"));
    if (data) {
      this.setState({
        name: data.name
      });
    }
  }

  render() {
    return (
      <div className="hf-at-main">
        {!this.props.imgCloudId ? (
          <span className="hf-at-img" />
        ) : (
          <img 
            className="ZOE-at-avatar-img"
            src={`${G.middlewarePath}:${nextServicePort}${
              this.props.imgCloudId
            }`}
          />
        )}
        {/* <img src="" alt="avater1" /> */}
        <span className="hf-at-name">
          {this.props.name ? this.props.name : this.state.name}
        </span>
      </div>
    );
  }
}
