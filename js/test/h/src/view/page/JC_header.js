/*
 * @Author: JC.Liu 
 * @Date: 2018-07-23 17:19:18 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-13 15:57:18
 * header  教师和学生    教师和管理员 header 统一
 */
import '../../css/JC_header.css';
import React, { Component } from 'react';
import { BrowserRouter, Router, Route, Redirect, Switch, browserHistory as history, NavLink, withRouter, HashRouter, Link } from 'react-router-dom';
import { Button, Input, Layout, message } from 'antd';
// import { Link, NavLink, Switch, Route, withRouter} from 'react-router';
import { SVG } from '../common';
import Loading from './loading';
// 学生
// 公共课堂
import Q_PubClass from './q_publicClass';
// 我的课堂
import Q_MyClass from './q_myClass';
// 首页
import Q_Index from './q_index';
// 管理员
// import B_Index from '../page/b_index';
// 审核管理
import B_CheckMan from './b_checkMan';
// 课堂管理
import B_ManagerClassMan from './b_managerClassMan';
// 反馈
import B_Feedback from './b_feedback';
// 平台配置
import B_SysteamCon from './b_systeamCon';

import FooterBar from '../components/JC_footer';
import SearchComponent from '../components/JC_header_search';
import { connect } from 'react-redux';
import { withClickOutside } from 'react-clickoutside';
import { _x } from './../../js/index';
const ajax = _x.util.request.request;
import G from '../../js/g';
const Search = Input.Search;
const { Header, Footer, Sider, Content } = Layout;

const HeaderSearch = withClickOutside({
  className: 'JC-hd-search'
})(SearchComponent)

// 学生或老师导航
class StudentNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      role: "",/** teacher、admin、student ???  */
      hotKeyWorldShow: false
    }
  }

  componentDidMount() {
    // 从G中拿到身份  在此做身份认证
    // 如果 accType ：0 超管  1 普管  2 管理者  3 老师  4 学生 5 家长
    const Info = G.userInfo;
    if (Info.accTypeId === 0 || Info.accTypeId === 1 || Info.accTypeId === 2) {
      this.setState({
        role: "admin"
      })
    } else if (Info.accTypeId === 3) {
      this.setState({
        role: "teacher"
      })
    } else if (Info.accTypeId === 4) {
      this.setState({
        role: "student"
      })
    } else if (Info.accTypeId === 5) {
      this.setState({
        role: "parent"
      })
    }
  }

  // 根据不同的身份进入不同的后台
  identityForCtrolPage = () => {
    // 从G中获取身份 老师的跳转到 /b_teaCherNetDisk 云盘管理 如果云盘页面无权限 则跳转到课堂管理, 管理员 /b_managerClassMan 课堂管理
    this.state.role === "teacher" ?
        this.props.history.push("/b_teaCherNetDisk")
      :
      this.state.role === "admin" ?
        this.props.history.push("/b_managerClassMan")
        : null
  }

  // HOC 组件点击
  onClickOutside = () => {
    this.hotKeyWorldShow(this.state.hotKeyWorldShow);
  }

  hotKeyWorldShow = () => {
    if (this.state.hotKeyWorldShow) {
      this.setState({
        hotKeyWorldShow: false
      })
    }
  }

  showKeyWorld = () => {
    this.setState({
      hotKeyWorldShow: true
    })
  }

  componentDidUpdate() {
    this.titleLengthForReset(G.configInfo.sysName)
  }

  // 根据标题的长度来设置控件的宽度
  titleLengthForReset = (tit) => {
    if (tit) {
      const titArr = tit.split("").length;
      const searchDOM = document.querySelector(".JC-hd-search");
      const ulDOM = document.querySelector(".JC-hd-ttit");
      const navDOM = document.querySelector(".JC-hd-nav-content")
      // 一个字的宽度24px
      const oneFontSize = 24;
      if (searchDOM && ulDOM) {
        if (titArr < 5) {
          const titleWidth = 5 * oneFontSize
          navDOM.style.width = `calc(1300px - 180px - 70px - ${titleWidth}px)`;
        } else {
          const titleWidth = titArr * oneFontSize
          navDOM.style.width = `calc(1300px - 180px - 70px - ${titleWidth}px)`;
        }
      }
      return tit
    } else {
      return G.title
    }
  }

  render() {
    const pathname = this.props.location.pathname;
    return (
      <div className="JC-hd-tnav">
        <div className="JC-hd-ttit JC-inline" ref={node => this.titleNode = node}>
          <NavLink to="/index">
            {
              G.configInfo.sysName ?
                this.titleLengthForReset(G.configInfo.sysName)
                : null
            }
          </NavLink>
        </div>
        <div className="JC-inline JC-hd-nav-content" ref={node => this.navNode = node}>
          <div className="JC-hd-ulList">
            <NavLink activeClassName="JC-hd-active" to="/index">首页</NavLink>
            {
              G.configInfo.pubCurType ?
                <NavLink activeClassName="JC-hd-active" to={`/q_publicClass/all/all/all/2`}>公共课堂</NavLink>
                : null
            }
            {
              this.state.role === "admin" ?
                null :
                <NavLink activeClassName="JC-hd-active" to="/q_myClass">我的课堂</NavLink>
            }
          </div>
          {
            pathname !== "/q_searchResult" ?
              <HeaderSearch
                ref={node => this.searchDiv = node}
                onClickOutside={this.onClickOutside}
                hotKeyWorldShow={this.state.hotKeyWorldShow}
                showKeyWorld={this.showKeyWorld}
                keySelect={this.width}
              />
              : null
          }
        </div>
        {/* 后台管理按钮 根据G中的身份来确定是否能进入后台 */}
        <div className="JC-inline JC-hd-ctrol">
          {
            this.state.role === "teacher" || this.state.role === "admin" ?
              <div className="JC-hd-inline JC-hd-ctrolBtn" >
                <Button className="lxx-s-darkgrey" onClick={this.identityForCtrolPage} >
                  <span className="JC-hd-CtrolSvg" >
                    <SVG type="backManagement" title="后台管理" width="18px" height="18px" /></span>
                  <span>后台管理</span>
                </Button>
              </div>
              : null
          }
          <Avatar />
        </div>
      </div>
    )
  }
}

// 管理员后台导航
class AdminNav extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="JC-headerNav-admin">
        <div className="JC-hd-anav" >
          <span className="JC-hd-ttit" >
            <NavLink to="/b_managerClassMan" >
              <span className="JC-hd-atit1">{G.configInfo.sysName ? G.configInfo.sysName : G.title}<span className="JC-hd-atit2">后台管理</span></span>
            </NavLink>
          </span>
          <ul className="JC-hd-inline" >
            <li><NavLink activeClassName="JC-hd-active2" to="/b_managerClassMan">课堂管理</NavLink></li>
            <li><NavLink activeClassName="JC-hd-active2" to="/b_checkman">审核管理</NavLink></li>
            <li><NavLink activeClassName="JC-hd-active2" to="/b_systeamCon">平台配置</NavLink></li>
            <li><NavLink activeClassName="JC-hd-active2" to="/b_feedback">意见反馈</NavLink></li>
          </ul>
          <div className="JC-inline JC-hd-ctrol">
            <div className="JC-hd-inline JC-hd-ctrolBtn" >
              <Button className="lxx-s-darkgrey" onClick={() => this.props.history.push("/index")}>
                <span className="JC-hd-CtrolSvg" >
                  <SVG type="goBefore" width="18px" height="18px" /></span>
                <span>回到前台</span>
              </Button>
            </div>
            <Avatar />
          </div>
        </div>
      </div>

    )
  }
}

// 老师后台导航 
class TeacherNav extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="JC-headerNav-admin">
        <div className="JC-hd-anav" >
          <span className="JC-hd-ttit" >
            <NavLink to="/b_teaCherNetDisk" >
              <span className="JC-hd-atit1">{G.configInfo.sysName ? G.configInfo.sysName : G.title}<span className="JC-hd-atit2">后台管理</span></span>
            </NavLink>
          </span>

          <ul className="JC-hd-inline" >
            <li><NavLink activeClassName="JC-hd-active2" to="/b_teaCherNetDisk">云盘管理</NavLink></li>
            <li><NavLink activeClassName="JC-hd-active2" to="/b_teacherClassMan">课堂管理</NavLink></li>
          </ul>
          <div className="JC-inline JC-hd-ctrol">
            <div className="JC-hd-inline JC-hd-ctrolBtn" >
              <Button className="lxx-s-darkgrey" onClick={() => this.props.history.push("/index")}>
                <span className="JC-hd-CtrolSvg" >
                  <SVG type="goBefore" width="18px" height="18px" /></span>
                <span>回到前台</span>
              </Button>
            </div>
            <Avatar />
          </div>
        </div>
      </div>
    )
  }
}

// 头像 
class Avatar extends Component {
  state = {
    role: ""
  }

  loginOut = () => {
    // 清空session
    ajax("default/login/outUser", {
      orgCode: G.paramsInfo.orgcode,
      token: G.paramsInfo.token,
    }, res => {
      if (res.result) {
        let href = window.location.href;
        window.open(href, "_self", "");
        window.close();
      } else {
        message.warning(res.message, 2)
        let href = window.location.href;
        window.open(href, "_self", "");
        window.close();
      }
    })
  }

  componentDidMount() {
    // 如果 accType ：0 超管  1 普管  2 管理者  3 老师  4 学生 5 家长
    const Info = G.userInfo;
    if (Info.accTypeId === 0 || Info.accTypeId === 1 || Info.accTypeId === 2) {
      this.setState({
        role: "admin"
      })
    } else if (Info.accTypeId === 3) {
      this.setState({
        role: "teacher"
      })
    } else if (Info.accTypeId === 4) {
      this.setState({
        role: "student"
      })
    } else if (Info.accTypeId === 5) {
      this.setState({
        role: "parent"
      })
    }
  }

  render() {
    const Info = G.userInfo;
    const role = this.state.role;
    return (
      <div className="JC-hd-inline JC-hd-avatar"
        title={
          role === "admin" ?
            `管理员 - ${Info.accName}`
            :
            role === "teacher" ?
              `老师 - ${Info.accName}`
              :
              role === "student" ?
                `学生 - ${Info.accName}`
                : null
        }
      >
        <div className="JC-hd-inline JC-hd-avatarSVG">
          {/* 根据身份 */}
          {/* {
            role === "admin" ?
              <SVG type="administrator" />
              :
              role === "teacher" ?
                <SVG type="woman" />
                :
                role === "student" ?
                  Info.user.sex ?
                    <SVG type="man" />
                    :
                    <SVG type="woman" />
                  : null
          } */}
          {/* 根据G 中的用户头像信息展示 */}
          {
            G.userInfo.imgCloudId ?
              <img src={`${G.dataServices}/${G.userInfo.imgCloudId}`} alt="" />
              :
              role === "admin" ?
                <SVG type="administrator" title={`管理员 - ${Info.accName}`} />
                :
                role === "teacher" ?
                  <SVG type="woman" title={`老师 - ${Info.accName}`} />
                  :
                  role === "student" ?
                    Info.user.sex ?
                      <SVG type="man" title={`学生 - ${Info.accName ? Info.accName : ""}`} />
                      :
                      <SVG type="woman" title={`学生 - ${Info.accName ? Info.accName : ""}`} />
                    : null
          }
        </div>
        <div className="JC-hd-inline JC-hd-more" >···</div>
        <div className="JC-hd-loginOut" >
          <div className="JC-av-triangle" ></div>
          <Button onClick={this.loginOut} >退出</Button>
        </div>
      </div>
    )
  }
}

// 展示导航组件
class HeaderNavBar extends Component {
  render() {
    const pamras = this.props.match.params;
    return (
      <div className={
        pamras.target ?
          pamras.target === "student" ?
            "lxx-g-header"
            :
            "lxx-g-header JC-headerNav-bg"
          :
          "lxx-g-header"
      }
      >
        <div className="JC-headerNav-stu" >
          <StudentNav />
        </div>
      </div>
    )
  }
}

StudentNav = withRouter(StudentNav);
AdminNav = withRouter(AdminNav);
TeacherNav = withRouter(TeacherNav);
const HeaderNav = withRouter(HeaderNavBar);
export { HeaderNav, TeacherNav, AdminNav };