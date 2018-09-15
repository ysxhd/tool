/*
 * @Author: hf 
 * @Date: 2018-07-25 09:49:18 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-08 18:54:22
 */

import React from 'react';
import WeekChoose from './weekChoose';
import DaysList from './daysList';
import SectionList from './sectionList';
import McClassList from './mc_classList';
import { connect } from 'react-redux';
import noData from './../../icon/null_b.png';
import { SpinLoad } from './../common';
import { message } from 'antd';

@connect(
  state => state.timeTableReducer,
)
export default class McTabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daysList: [],
      sectionList: [],
      classList: null,
      semcurnum: 0,
      serverErr: ''
    }
  }

  componentWillReceiveProps(nextprops) {
    if (this.props.timeTable != nextprops.timeTable && nextprops.timeTable.dates) {
      let { dates, sectionList, curList } = nextprops.timeTable;
      this.setState({
        daysList: dates,
        sectionList: sectionList,
        classList: curList,
      })
    }
    this.setState({
      semcurnum: nextprops.semcurnum
    })
  }

  render() {
    let { daysList, sectionList, classList, semcurnum } = this.state;

    if (!classList) {
      return (
        <div style={{ textAlign: 'center', margin: 30, height: 300 }}>
          <SpinLoad />
        </div>
      )
    }

    let styleCss = {
      container: {
        width: 1300,
        margin: '25px auto ',
      },
      title: {
        display: 'flex',
        marginBottom: 25
      },
      text: {
        flex: 1
      },
      table: {
        position: 'relative',
        height: sectionList.length * 140 + 52,
        border: '1px solid #e6e6e6',
        borderSizing: 'border-box',
      }
    }
    return (
      <div style={styleCss.container}>
        <div style={styleCss.title}>
          <div style={styleCss.text}>
            本学期共{semcurnum}堂课，当前周共{classList.length}堂课
          </div>
          <WeekChoose Role="reception" />
        </div>
        <div style={styleCss.table}>
          <DaysList data={daysList} />
          <SectionList data={sectionList} height={140} />
          <McClassList data={{ data: classList, sectionNum: sectionList.length }} />
        </div>
      </div>
    )
  }
}