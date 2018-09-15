/*
 * @Author: junjie.lean 
 * @Date: 2018-07-20 11:22:39 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 14:06:06
 * 学生 - index 入口
 */

import React from 'react';
import IndexTabBar from './../components/i_TabBar'
import { getHotPubClass_action, getHotPriClass_action, getHotTeacher_action } from '../../redux/lean.reducers';
import { header_search_kerWorld_ac } from '../../redux/JC.header.reducer';
import Myhotclass from './../components/myHotclass';
import { connect } from 'react-redux';
import { HeaderNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import HotTeacher from './../components/hotTeacher';
import IndexPubClass from './../components/indexPubClass';
import IndexLiveClass from './../components/indexLiveClass';
import G from './../../js/g';


@connect(state => state, { getHotPubClass_action, getHotPriClass_action, getHotTeacher_action, header_search_kerWorld_ac })
export default class Q_Index extends React.Component {
  constructor(props) {
    super(props);
    // console.log(this.props)
    let userInfo = G.userInfo;
    if (userInfo.accTypeId === 3) {
      this.props.getHotPubClass_action();
      this.props.getHotPriClass_action();
    }
    //最热教师数据调用
    this.props.getHotTeacher_action();
  }



  componentDidMount() {
    this.setFooterTop();

  }

  setFooterTop = () => {
    let _this = this;
    // 视口高度
    let clientHeight = document.documentElement.clientHeight;
    // header高度
    let headerHeight = 80;
    // footer 高度
    let footerHeight = 200;
    // 拿到中间内容的最小的高度 
    let distanceHeight = clientHeight - 80 - 200;
    // 当中间内容的高度 小于 最小高度 则给他赋值最小高度
    if (_this.contentNode.clientHeight < distanceHeight) {
      _this.contentNode.style.minHeight = distanceHeight + "px";
    }
  }

  render() {
    let userInfo = G.userInfo || {};
    // console.log(userInfo.accTypeId)
    return (
      <div>
        <HeaderNav />
        <div ref={node => this.contentNode = node} >
          <IndexTabBar />
          <IndexPubClass />
          <IndexLiveClass />
          {
            /**当前角色为教师时才渲染”我的最热“ */
            userInfo.accTypeId === 3
              ?
              <Myhotclass {...this.props} />
              :
              false
          }
          <HotTeacher {...this.props} />
        </div>
        <Q_FooterBar />
      </div>
    )
  }
}
