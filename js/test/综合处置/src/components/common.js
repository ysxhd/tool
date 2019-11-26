import React, { Component } from 'react';

export class SVG extends Component {
  render() {

    var style = {};
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;
    if (this.props.color) style.color = this.props.color;

    return (
      <svg title="" className="icon" aria-hidden="true" style={style}>
        <use xlinkHref={"#icon-" + this.props.type}></use>
      </svg>
    );
  }
}