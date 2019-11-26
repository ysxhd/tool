/*
 * @Author: lxx 
 * @Date: 2018-08-28 09:37:10 
 * @Last Modified by: xiangting
 * @Last Modified time: 2018-09-06 14:03:32
 * 项目公共组件
 */

import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { Spin } from 'antd';
import './common.css';

/**
 * 字体图标
 */
export class SVG extends Component {

  render() {
    let style = {};
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;
    if (this.props.color) style.color = this.props.color;

    let _className;
    if (this.props.className) {
      _className = `icon ${this.props.className}`;
    } else {
      _className = 'icon';
    }


    /**增加点击事件 */
    let clickHandle = () => {
      if (this.props.onClick) {
        return this.props.onClick;
      } else {
        return () => { }
      }
    }

    return (
      <svg title="" className={_className} aria-hidden="true" style={style} onClick={clickHandle()}>
        <use xlinkHref={"#icon-" + this.props.type}><title>{this.props.title || this.props.type}</title></use>
      </svg>
    );
  }
}

/**
 * 虚拟容器，直接返回内容
 * @param {*} props 
 */
export const Container = function (props) {
  return props.children;
}

/**
 * 板块容器
 * @param {*} props 
 */
export class Panel extends Component {
  state = {
    content: this.props.children
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.loading) {
      this.setState({
        content: this.props.children
      });
    } else {
      this.setState({
        content: null
      });
    }
  }

  render() {
    var props = this.props,
      size = props.size || 'small',
      loading = props.loading || false,
      bodystyle,
      bodycontent,
      addclass = props.className || '';

    if (props.bodyheight) {
      bodystyle = {
        height: props.bodyheight,
        overflowY: 'hidden'
      };
    }

    if (loading) {
      bodycontent = this.state.children;
    } else {
      bodycontent = props.children;
    }
    if (bodystyle) {
      bodycontent = <div style={bodystyle}>
        {bodycontent}
      </div>;
    }

    return (
      <div style={this.props.style} className={`xt-panel xt-${size} ${addclass}`}>
          {
            props.title ?
              (<div className="xt-title">{props.title}
                {/* <div className="xt-right">{props.more}</div> */}
              </div>) : null
          }
          <Spin spinning={loading}>
            <div className="xt-body">
              {bodycontent}
            </div>
          </Spin>
      </div>)
  }
}

/**
 * loading
 */
export class SpinLoad extends Component {
  render() {
    return (<div className="lxx-g-loadfix">
      <div className="lxx-g-loading">
        <ReactLoading type="bars" color="#3498DB" />
        <span>{this.props.text ? this.props.text : '数据加载中'}...</span>
      </div>
    </div>
    )
  }
}