/*
 * @Author: hf 
 * @Date: 2018-07-23 15:04:15 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-07 10:28:42
 */

/**
 * 轮播+资源统计
 */

import React from 'react';
import IndexCarousel from './i_Carousel'
import IndexSourceList from './i_SourceList'

export default class IndexTabBar extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="hf-itb-container">
        <IndexCarousel />
        <IndexSourceList />
        <div className="lxx-g-boxShadow"></div>
      </div>
    )
  }

}
