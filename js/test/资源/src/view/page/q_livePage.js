/*
 * @Author: JC.Liu 
 * @Date: 2018-07-25 18:35:31 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:06:28
 * 从首页的 直播模块 点击进来 的直播首页  并不是带有直播播放器的页面
 */
import React from 'react';
import '../../css/livePage.css';
import {HeaderNav} from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import LivePageNav from '../components/livePageNav';
import LivePageAllClass from '../components/livePageAllClass';

export default class Q_LivePage extends React.Component {
  
  render() {
      const ShowThisPage = true;
      if (!ShowThisPage) {
          return false
      } 
      return (
        <div>
          <HeaderNav />
            <div className='xq-live-head-box'>
              <div className='xq-live-head'>直播课堂</div>
            </div>
            <LivePageNav />
            <LivePageAllClass />
          <Q_FooterBar />
        </div>
          
          
      )
  }
}
