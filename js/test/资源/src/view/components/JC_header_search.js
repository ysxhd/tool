/*
 * @Author: JC.Liu 
 * @Date: 2018-07-26 09:23:50 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:25:54
 * 头部导航的 全局搜索栏
 */
import React, { Component } from 'react'
import { Button, Input, Layout, message } from 'antd';
import { SVG } from '../common';
import { connect } from 'react-redux';
import { headerKeyWorld_ac, header_search_kerWorld_ac } from '../../redux/JC.header.reducer';
import { Redirect, withRouter } from 'react-router-dom';
import { withClickOutside, ClickOutside } from 'react-clickoutside';
const Search = Input.Search;

@connect(state => state.HeaderReducer, { headerKeyWorld_ac, header_search_kerWorld_ac })
class SearchComponent extends Component {
  constructor() {
    super();
    this.state = {
      hotKeyWorldShow: false,
      isOpened: false
    }
  }
  componentDidMount() {
    var _this = this;
    _this.props.headerKeyWorld_ac();

  }


  // 最热关键字点击 跳转到搜索页
  hotKWclick = (keyWorld, pathname) => {
    if (!keyWorld) {
      message.warning("请输入关键字", 2)
    } else {
      // let obj = JSON.stringify({
      //   "collegeId": "all",  // 学院ID
      //   "subjectId": "all",  // 科目ID
      //   "sort": "2",  // 排序标识
      //   "teacherId": "all",  // 老师ID
      // });
      // let params = encodeURIComponent(obj);
      if (pathname === "/index") {
        this.props.header_search_kerWorld_ac("all", keyWorld, 1, 0);
      } else if (pathname === `/q_publicClass/all/all/all/2`) {
        this.props.header_search_kerWorld_ac("public", keyWorld, 1, 1);
      } else if (pathname === "/q_myClass") {
        this.props.header_search_kerWorld_ac("pri", keyWorld, 1, 2);
      } else {
        let pathArr = pathname.split('/');
        if (pathArr.indexOf("q_recordVideo") > -1 || pathArr.indexOf("q_liveVideo") > -1) {
          this.props.header_search_kerWorld_ac("all", keyWorld, 1, 0);
        }
      }
      // 跳转
      this.routerRedirect();
    }
  }

  /**
   * 路由跳转
   * @param {*} pathname   当前路由pathname
   */
  routerRedirect() {
    this.props.history.push("/q_searchResult");
  }

  render() {
    const pathname = this.props.history.location.pathname;
    // console.log("serach:", this.props.history);

    return (
      <div >
        <div className="JC-hd-inline JC-hd-search-inp" >
          <Search
            placeholder="搜索课堂"
            enterButton={<span><SVG type="search" /><span>搜索</span></span>}
            size="large"
            onSearch={value => {
              this.hotKWclick(value, pathname);

            }}
            onClick={(value) => {
              // this.hotKeyWorldShow(!this.state.hotKeyWorldShow)
              this.props.showKeyWorld();
            }}
          />
        </div>
        {/* <ClickOutside>
          {({ hasClickedOutside }) => (
            <div>
              {hasClickedOutside && */}
        {
          this.props.keyWorld.length ?
            <div className={this.props.hotKeyWorldShow ? "JC-hd-workcode" : "JC-hd-workcode-none"} style={{ width: `${this.props.keySelect - 85}px` }} >
              {
                this.props.keyWorld.map((item, index) => (
                  <div
                    key={index}
                    className="JC-hd-kwdiv"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.hotKWclick(item, pathname);
                      this.routerRedirect()
                    }}
                  >
                    <div className={`JC-hd-kw JC-hd-kw_${index + 1}`}>{index + 1}</div>
                    <div className="JC-hd-inline JC-hd-hotKeyWorld">{item}</div>
                  </div>
                ))
              }
            </div>
            :
            null
        }

        {/* }
            </div>
          )}
        </ClickOutside> */}
      </div >
    )
  }
}

export default withRouter(SearchComponent);

