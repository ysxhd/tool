import React from 'react';
import { Tooltip, Button } from 'antd';
import { savePreCondition_ac } from './../../redux/b_managerClassDetail.reducer';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

@withRouter
@connect(
  state => state.Mm_timeTableReducer,
  { savePreCondition_ac }
)
export default class MmClassItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }
  /**
     * 跳转到详细页面
     */
  JumpToDetail = (param) => {
    let { weekday, lessonOrder } = param;
    let { acdYearId, claId, grdGroupId, grdId, semId, semStartDate, subjectId, teacherId, weekNum } = this.props.condition;
    let condition = {
      acdYearId,
      semId,
      weekNum,
      weekday,
      lessonOrder,
      grdGroupId,
      subjectId,
      teacherId,
      claId
    }

    condition = encodeURIComponent(JSON.stringify(condition))
    const path = this.props.match.path;
    // console.log(this.props.data)
    this.props.history.push(`${path}/detail/${condition}`)
  }

  /**
   * 判断本节课的状态：已完成(1)、进行中(0)、未开始(-1)
   * 返回该节课背景颜色
   */
  judgeClassState = (arg) => {
    let data = this.props.data;
    let items;
    const styleCss = {
      texts: {
        position: 'relative',
        width: '100%',
        borderRadius: 5,
        height: 130,
        color: '#fff',
        padding: '10px'
      },
      title: {
        textAlign: 'center'
      },
      text: {
        textAlign: 'center',
        width: 130,
        margin: '4px auto',
        background: 'rgba(201,201,201,0.3)',
        borderRadius: 10
      }
    };
    switch (arg) {
      case -1:
        items = <div style={{ ...styleCss.texts, background: '#9bb8cc' }}>
          <div style={{ ...styleCss.text, marginTop: 28 }}>已申请：{data.onLine || 0}</div>
          <div style={styleCss.text}>未申请：{data.outNum || 0}</div>
        </div>
        break;
      case 0:
        items = <div style={{ ...styleCss.texts, background: '#44aaf2' }}>
          <div style={{ ...styleCss.text, marginTop: 28 }}>正在直播：{data.onLine || 0}</div>
          <div style={styleCss.text}>未直播：{data.outNum || 0}</div>
        </div>
        break;
      case 1:
        items = <div style={{ ...styleCss.texts, background: '#3ec280' }}>
          <div style={styleCss.title}>已完成</div>
          <div style={styleCss.text}>私有：{data.priNum || 0}</div>
          <div style={styleCss.text}>公有：{data.pubNum || 0}</div>
          <div style={styleCss.text}>未发布：{data.outNum || 0}</div>
        </div>
        break;
    }
    return items
  }


  render() {
    let data = this.props.data;

    const styleCss = {
      item: {
        width: 178,
        height: 140,
        padding: 5,
        lineHeight: '24px',
        float: 'left',
        borderTop: '1px solid #e6e6e6',
        borderLeft: '1px solid #e6e6e6',
        borderSizing: 'border-box',
        cursor: 'pointer',
      }
    };
    let items = this.judgeClassState(data.curFinishStatus);
    return (
      <div style={styleCss.item} onClick={(id) => this.JumpToDetail(this.props.param)}>
        {items}
      </div>
    )
  }
}