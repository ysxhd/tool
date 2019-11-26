/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 17:23:39
 */

import React from 'react';
import TmClassItem from './../components/tm_classItem';

export default class TmClassList extends React.Component {
  constructor(props) {
    super(props);
    this.grid = [[]];
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.data.data) {
      this.createTable(nextprops.data.data, nextprops.data.sectionNum)
    }
  }

  createTable(data, sectionNum) {
    const styleCss = {
      item: {
        width: 178,
        height: 280,
        padding: 5,
        float: 'left',
        borderTop: '1px solid #e6e6e6',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
      }
    };

    let grid = [];
    for (let i = 0; i < sectionNum; i++) {
      grid[i] = [];
      for (let j = 0; j < 7; j++) {
        grid[i][j] = <div key={i.toString() + j.toString()} style={styleCss.item}></div>;
      }
    }
    this.dealTable(data, grid);
  }

  dealTable(data, grid) {
    for (let i = 0; i < data.length; i++) {
      const item = <TmClassItem
        key={data[i].weekday + data[i].lessonOrder}
        data={data[i]}
        param={
          {
            weekday: data[i].weekday,
            lessonOrder: data[i].lessonOrder
          }
        }
        test={data[i]}
      />
      grid[data[i].lessonOrder - 1][data[i].weekday - 1] = item;
    }
    this.grid = grid;
  }

  render() {
    let styleCss = {
      container: {
        width: 1246,
        marginLeft: 52,
      }
    };

    let data = this.props.data;
    this.createTable(data.data, data.sectionNum)

    let grid = this.grid;
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