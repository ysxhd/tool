/*
 * @Author: hf 
 * @Date: 2018-07-30 15:16:17 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-16 16:11:09
 */


import React from 'react';
import WeekChoose from './weekChoose';
import DaysList from './daysList';
import SectionList from './sectionList';
import MmClassList from './mm_classList';
import { Mm_getCurTableOfAdmin_ac } from './../../redux/mm_Table.reducer';
import { connect } from 'react-redux';
import { SpinLoad } from './../common';

@connect(
  state => state.Mm_timeTableReducer,
  { Mm_getCurTableOfAdmin_ac }
)
export default class MmTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      daysList: [],
      sectionList: [],
      classList: null
    }
  }

  componentWillReceiveProps(nextprops) {

    if (nextprops.timeTable && this.props.timeTable != nextprops.timeTable) {
      let { dates, sectionList, curNumList } = nextprops.timeTable;
      this.setState({
        daysList: dates,
        sectionList: sectionList,
        classList: curNumList
      })
    }
  }

  render() {
    let styleCss = {
      container: {
        margin: '25px auto ',
      },
      toScreen: {
        background: '#f2f2f2',
        marginBottom: 25,
      },
      title: {
        display: 'flex',
        height: 50,
        width: 1300,
        margin: '0 auto ',
        alignItems: 'center'
      },
      text: {
        flex: 1,
        display: 'flex',
      },
      div: {
        display: 'flex',
        marginRight: 50
      },
      span: {
        display: 'block',
        width: 20,
        height: 20,
        borderRadius: 5,
        marginRight: 10
      },
      table: {
        position: 'relative',
        width: 1300,
        margin: '0 auto ',
        height: this.state.sectionList.length * 140 + 52,
        border: '1px solid #e6e6e6',
        borderSizing: 'border-box',
      }
    }
    let { daysList, sectionList, classList } = this.state;
    if (!classList) {
      return (
        <div style={{ textAlign: 'center', margin: 30, height: 300 }}>
          <SpinLoad />
        </div>
      )
    }

    return (
      <div style={styleCss.container}>
        <div style={styleCss.toScreen}>
          <div style={styleCss.title}>
            <div style={styleCss.text}>
              <div style={styleCss.div}>
                <span style={{ ...styleCss.span, background: '#3ec280' }}></span>已完成
            </div>
              <div style={styleCss.div}>
                <span style={{ ...styleCss.span, background: '#44aaf2' }}></span>进行中
           </div>
              <div style={styleCss.div}>
                <span style={{ ...styleCss.span, background: '#9bb8cc' }}></span>未开始
          </div>
            </div>
            <WeekChoose Role="manager" />
          </div>
        </div>
        <div style={styleCss.table}>
          <DaysList data={daysList} />
          <SectionList data={sectionList} height={140} />
          <MmClassList data={{ data: classList, sectionNum: sectionList.length }} />
        </div>
      </div>
    )
  }
}