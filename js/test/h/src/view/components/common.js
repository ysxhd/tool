import React, { Component } from 'react';

/**
 * 字体图标
 */
export class SVG extends Component {
  render() {

    let [style, props] = [{}, this.props];
    style.width = props.width || "";
    style.height = props.height || "";
    style.color = props.color || "";

    return (
      <svg title="" className="icon" aria-hidden="true" style={style}>
        <use xlinkHref={"#icon-" + this.props.type}></use>
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