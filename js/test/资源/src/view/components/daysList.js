/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 16:29:45
 */

import React from 'react';

export default class DaysList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let styleCss = {
      container: {
        display: 'flex',
        marginLeft: 52,
      },
      item: {
        width: 178,
        height: 52,
        lineHeight: '52px',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
        textAlign: 'center'
      }
    };
    let data = this.props.data;

    return (
      <div style={styleCss.container}>
        {
          data.map((item, i) => (
            <div key={i} style={styleCss.item}>{item}</div>
          ))
        }
      </div>
    )
  }
}