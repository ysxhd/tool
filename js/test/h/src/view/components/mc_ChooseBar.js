/*
 * @Author: hf 
 * @Date: 2018-07-24 09:59:11 
 * @Last Modified by: hf
 * @Last Modified time: 2018-07-26 14:15:30
 */

import React from 'react';
import McYearTermWeek from './mc_YearTermWeek';
import McSubClass from './mc_SubClass';

export default class McChooseBar extends React.Component {
  render() {
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto'
      },
      title: {

      }
    }
    return (
      <div style={styleCss.container} >
        <McYearTermWeek />
        <McSubClass />
      </div>
    )
  }
}