/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 18:47:57
 */

import React from 'react';

export default class SectionList extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    let styleCss = {
      container: {
        position: 'absolute',
        left: 0,
        top: 52,
        width: 53,
      },
      item: {
        width: 53,
        lineHeight: '53px',
        borderTop: '1px solid #e6e6e6',
        borderSizing: 'border-box',
        writingMode: 'tb-rl',
        textAlign: 'center',
      }
    };
    let data = this.props.data;

    return (
      <div style={styleCss.container}>
        {
          data.map((item, i) => (
            <div key={i} style={{ ...styleCss.item, height: this.props.height }}>{item}</div>
          ))
        }
      </div>
    )
  }
}