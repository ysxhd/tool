/*
 * @Author: JC.Liu 
 * @Date: 2018-07-23 18:37:19 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-26 12:53:41
 * 管理- 审核管理
 */
import React, { Component } from 'react';
import { AdminNav } from './JC_header';
import { Admin_FooterBar } from '../components/JC_footer';
import CheckManContent from '../components/JC_b_checkMan';

class B_CheckMan extends Component {

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
    return (
      <div>
        <AdminNav />
        <div ref={node => this.contentNode = node} >
          <CheckManContent />
        </div>
        <Admin_FooterBar />
      </div>
    )
  }
}



export default B_CheckMan;