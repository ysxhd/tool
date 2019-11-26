/*
 * @Author: hf 
 * @Date: 2018-07-24 09:59:11 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 13:54:06
 */

import React from 'react';
import TmYearTermWeek from './tm_YearTermWeek';
import TmSubClass from './tm_SubClass';
import MmSubClass from './mm_SubClass';


export default class TmChooseBar extends React.Component {
  render() {
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto',
        height: 30,
        display: 'flex'
      },
    }
    const role = this.props.role;

    return (
      role == 'teacher'
        ?
        <div style={styleCss.container}>
          <TmYearTermWeek width={150} role={role} />
          <TmSubClass width={150} />
        </div>
        :
        <div style={styleCss.container}>
          <TmYearTermWeek width={120} role={role} />
          <MmSubClass width={120} />
        </div>
    )
  }
}