/*
 * @Author: 甘维添 
 * @Date: 2018-02-06 15:10:40 
 * @Last Modified by: 甘维添
 * @Last Modified time: 2018-02-06 15:38:08
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Svg extends Component {
  render() {
    const click = () => { this.props.onClick && this.props.onClick() }
    return (
      <svg
        onClick={click}
        className="icon"
        aria-hidden="true"
        style={this.props.style}
      >
        <use xlinkHref={`#icon-${this.props.type}`}></use>
      </svg>
    );
  }
}

Svg.propTypes = {
  type: PropTypes.string.isRequired,
  onClick:PropTypes.func,
  style:PropTypes.object
};

export default Svg;