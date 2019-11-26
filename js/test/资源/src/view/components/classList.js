/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-07-26 15:33:36
 */

import React from 'react';
import { WSASYSCALLFAILURE } from 'constants';

export default class ClassList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [[]],
      data: []
    }
  }

  componentWillReceiveProps(nextprops) {
    this.setState({
      data: nextprops.data.data
    });
    if (nextprops.data.data) {
      this.createTable(nextprops.data.data, nextprops.data.sectionNum)
    }
  }


  createTable(data, sectionNum) {
    const styleCss = {
      item: {
        width: 178,
        height: 140,
        padding: 5,
        float: 'left',
        borderTop: '1px solid #e6e6e6',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
      }
    };

    let grid = [];
    for (let i = 0; i < 7; i++) {
      grid[i] = [];
      for (let j = 0; j < sectionNum; j++) {
        grid[i][j] = <div key={i.toString() + j.toString()} style={styleCss.item}></div>;
      }
    }

    this.dealTable(data, grid);
  }

  dealTable(data, grid) {
    const styleCss = {
      item: {
        width: 178,
        height: 140,
        padding: 5,
        float: 'left',
        borderTop: '1px solid #e6e6e6',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
        cursor: 'pointer',
      },
      texts: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#44aaf2',
        borderRadius: 5,
        height: 100,
        color: '#fff',
        padding: '20px 10px 10px 10px '
      },
      textbig: {
        fontWeight: 'bold'
      },
      icon: {
        position: 'absolute',
        top: '-5px',
        right: 0,
        fontSize: 40,
        color: '#f29d49'
      },
      score: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: '#fff',
        fontSize: 12
      },
      srcs: {
        display: 'flex',
        padding: '7px 2px'
      },
      src: {
        width: '33%',
        color: '#bfbfbf',
      }

    };

    for (let i = 0; i < data.length; i++) {
      const item = <div key={data[i].weekId + data[i].sectionId} style={styleCss.item} >
        <div style={styleCss.texts}>
          <div style={styleCss.textbig}>应用物理</div>
          <div>
            <svg style={styleCss.icon} className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-sign"}></use>
            </svg>
            <span style={styleCss.score}>4.2分</span>
          </div>
          <div>课堂名称</div>
        </div>
        <div style={styleCss.srcs}>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-resource"}></use>
            </svg>
            <span>6</span>
          </div>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-recordeVideo"}></use>
            </svg>
            <span>6</span>
          </div>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-browseNum"}></use>
            </svg>
            <span>6</span>
          </div>
        </div>
      </div>;
      grid[data[i].weekId][data[i].sectionId] = item;
    }
    this.setState({ grid });
  }

  render() {
    let styleCss = {
      container: {
        width: 1246,
        marginLeft: 52,
      }
    };
    let grid = this.state.grid;

    const items = grid.map((item, i) => (
      grid[i].map((items, j) => (
        items
      ))
    ))
    return (
      <div style={styleCss.container}>
        {items}
      </div>
    )
  }
}