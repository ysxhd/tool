/*
 * @Author: JC.Liu 
 * @Date: 2018-07-26 17:58:47 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-09-03 13:26:21
 * 搜索结果 
 */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import '../../css/JC_searchResult.css';
import { Button, Input, Layout, Pagination, Tabs, message } from 'antd';
import { SVG, SpinLoad } from '../common';
import { connect } from 'react-redux';
import '../../css/JC_searchResult.css';
import _x from '../../js/_x/util/index';
import G from '../../js/g';
import { header_search_kerWorld_ac, changeSearchBar_ac } from '../../redux/JC.header.reducer';

const Search = Input.Search;
const format = _x.date.format;
const ajax = _x.request.request;
const goWith = _x.url.goWith;
const TabPane = Tabs.TabPane;

@connect(state => state.HeaderReducer, {
  // 搜索
  header_search_kerWorld_ac,
  // 二级导航切换
  changeSearchBar_ac
})
class SearchResult extends Component {
  constructor() {
    super();
    this.state = {
      pagination: {
        pageSize: 20,
        currentPage: 1
      }
    }
  }

  // 翻页
  paginationChange = (page, pagesize) => {
    var status = this.props.searchLi === 0 ? "all" : this.props.searchLi === 1 ? "public" : "pri";
    this.props.header_search_kerWorld_ac(status, this.props.world, page, this.props.searchLi);
    this.setState({
      pagination: {
        currentPage: page,
        pageSize: pagesize
      }
    })
  }

  // 关键字高亮
  keyWorldLightHigh = (keyWorld, value) => {
    // 使用正则匹配 然后替换
    let re = new RegExp(keyWorld, "g");
    let resultValue = "";
    if (keyWorld) {
      if (value) {
        resultValue = value.replace(re, `<span class="JC-keyWorld-lightHeight" >${keyWorld}</span>`);
      } else {
        resultValue = ""
      }
    } else {
      resultValue = value;
    }
    return { __html: resultValue }
  }

  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    } if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  render() {
    const world = this.props.world;
    const searchLi = this.props.searchLi
    return (
      <div className="JC-hd-sh">
        <div className="lxx-g-boxShadow"></div>
        <div className="JC-hd-sh-contentWrap" >
          <div className="JC-hd-sh-wrap" >
            {/* 搜索框 */}
            <div className="JC-hd-sh-sh" >
              <Search
                placeholder="搜索课堂"
                enterButton={<span><SVG type="search" /><span>搜索</span></span>}
                size="large"
                defaultValue={world}
                onSearch={value => {
                  if (value) {
                    this.props.header_search_kerWorld_ac(searchLi === 0 ? "all" : searchLi === 1 ? "public" : "pri", value, 1, searchLi)
                  } else {
                    message.warning("请输入关键字进行搜索！", 3)
                  }
                }}
              />
            </div>

            {/* link */}
            <div className="JC-hd-sh-nav">
              <ul>
                <li className={searchLi === 0 ? "JC-hd-active3" : ""} onClick={() => this.props.header_search_kerWorld_ac("all", world, 1, 0)}>
                  全部课堂
                </li>
                {
                  G.configInfo.pubCurType ?
                    <li className={searchLi === 1 ? "JC-hd-active3" : ""}
                      onClick={() => {
                        if (world) {
                          this.props.header_search_kerWorld_ac("public", world, 1, 1)
                        } else {
                          message.warning("请输入关键字", 2)
                        }
                      }
                      }
                    >
                      公共课堂
                    </li>
                    : null
                }
                <li className={searchLi === 2 ? "JC-hd-active3" : ""}
                  onClick={() => {
                    if (world) {
                      this.props.header_search_kerWorld_ac("pri", world, 1, 2)
                    } else {
                      message.warning("请输入关键字", 2)
                    }
                  }
                  }
                >
                  私有课堂
                </li>
              </ul>
            </div>
          </div>
          <div className="lxx-g-boxShadow"></div>
          <div className="JC-hd-sh-shlen" >为您找到相关数据&nbsp;{this.props.searchNum}&nbsp;条</div>

          {
            this.props.loading ?
              <SpinLoad />
              :
              this.props.searchData && this.props.searchData.length ?
                <div className="JC-hd-sh-resultWrap">
                  {
                    this.props.searchData && this.props.searchData.length ?
                      this.props.searchData.map((item, index) => (
                        <div className="JC-sh-result-item" key={index}>
                          <div className="JC-sh-item-tit"
                            dangerouslySetInnerHTML={this.keyWorldLightHigh(world, item.curName)}
                            onClick={
                              () => goWith({ to: "q_recordVideo", with: ["reception", item.curResourceId, item.vodPubType === 1 ? false : true] })
                            }
                          ></div>
                          <div className="JC-sh-item-content" dangerouslySetInnerHTML={this.keyWorldLightHigh(world, item.curDesc)}></div>
                          <div className="JC-sh-item-bottom">
                            <div className="">授课时间：
                            <span dangerouslySetInnerHTML={this.keyWorldLightHigh(world, format(new Date(item.actureDate), 'yyyy-MM-dd'))}></span>
                              &nbsp;&nbsp;
                            (周{item.weekday})
                            &nbsp;&nbsp;
                            (第{item.lessonOrder}节)
                          </div>
                            <div>授课教师：<span dangerouslySetInnerHTML={this.keyWorldLightHigh(world, item.teacherName)}></span></div>
                            <div>来源：{item.vodPubType === 2 ? "公共课堂" : "私有课堂"}</div>
                            <div>公有浏览量：{item.pubWatchNum === 0 ? 0 : item.pubWatchNum ? item.pubWatchNum : "--"}</div>
                            <div>私有浏览量：{item.privWatchNum === 0 ? 0 : item.privWatchNum ? item.privWatchNum : "--"}</div>
                          </div>
                        </div>
                      ))
                      :
                      null
                  }
                  <div className="JC-sh-pagination" >
                    <div className="JC-sh-showPageNum" >
                      共{this.props.searchNum}条数据，每页显示 20条
                        </div>
                    <Pagination
                      onChange={this.paginationChange}
                      current={this.state.pagination.currentPage}
                      pageSize={this.state.pagination.pageSize}
                      total={this.props.searchNum}
                      itemRender={this.itemRender}
                    />
                  </div>
                </div>
                :
                <div className="lxx-g-noData">
                  <img src={require('./../../icon/null_b.png')} alt="" />
                  <p>暂无列表数据</p>
                </div>
          }
        </div>

      </div>
    )
  }
}
export default withRouter(SearchResult);