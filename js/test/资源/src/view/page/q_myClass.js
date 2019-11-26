/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 14:25:29 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-20 17:06:44
 * 前台 -我的课堂主页
 */
import React from 'react';
import McChooseBar from './../components/mc_ChooseBar';
import McTable from './../components/mc_Table';
import img from './../../icon/myClass.png';
import { HeaderNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';

export default class Q_MyClass extends React.Component {
  render() {
    const ShowThisPage = true;
    if (!ShowThisPage) {
      return false
    }
    const styleCss = {
      title: {
        height: 60,
        lineHeight: '60px',
        background: 'url(' + img + ')',
        textAlign: 'center',
        color: '#fff',
        fontSize: 24,
        border: '1px solid #fff'
      }
    }
    return (
      <div>
        <HeaderNav />
        <div style={styleCss.title}>
          我的课堂
        </div>
        <McChooseBar />
        <div className="lxx-g-boxShadow"></div>
        <McTable />
        <Q_FooterBar />
      </div>
    )
  }
}