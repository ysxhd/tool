/*
 * @Author: 甘维添 
 * @Date: 2018-04-19 10:07:26 
 * @Last Modified by: 甘维添
 * @Last Modified time: 2018-04-19 11:28:09
 * 按需加载 Loading
 */

import React, { Component } from 'react';
import { Spin } from 'antd';
import './loading.css';

class LoadingComponent extends Component {
  render() {
    const props = this.props
    return (
      <div className="gwt-loading-page">
        <div>
          {
            props.pastDelay
              ? <Spin
                tip={"加载中，请稍后..."}
                />
              : null
          }

        </div>
      </div>
    );
  }
}

export default LoadingComponent;
