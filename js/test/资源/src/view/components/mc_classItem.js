import React from 'react';
import { Tooltip } from 'antd';
import { withRouter } from 'react-router-dom';
import url from './../../js/_x/util/url';

const goWith = url.goWith;

@withRouter
export default class McClassItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  /**
   * 跳转
   */
  jumpToVideo = (id) => {
    let url = {
      to: 'q_recordVideo',
      with: ['reception', id, false]
    }
    goWith(url)
  }

  render() {
    var data = this.props.data;
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
      },
      marginLeft: {
        marginLeft: 5,
      },
      cName: {
        display: 'inline-block',
        verticalAlign: 'middle',
        height: 46,
        maxWidth: 147,
      },
    };

    return (
      <div style={styleCss.item} onClick={(id) => this.jumpToVideo(data.curResourceId)}>
        <div style={styleCss.texts}>
          <div style={styleCss.textbig}>{data.subName}</div>
          <div>
            <svg style={styleCss.icon} className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-sign"}></use>
            </svg>
            <span style={styleCss.score}>{data.privScoreAvg}分</span>
          </div>
          <Tooltip placement="right" title={data.curName}>
            <div className="hf-text-clamp2" style={styleCss.cName}>{data.curName}</div>
          </Tooltip>
        </div>
        <div style={styleCss.srcs}>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-resource"}></use>
            </svg>
            <span style={styleCss.marginLeft}>{data.daoxueNum + data.jiaoanNum + data.jiaocaiNum + data.sucaiNum + data.xitiNum + data.kejianNum + data.qitaNum}</span>
          </div>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-recordeVideo"}></use>
            </svg>
            <span style={styleCss.marginLeft}>{data.videoNum}</span>
          </div>
          <div style={styleCss.src}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-browseNum"}></use>
            </svg>
            <span style={styleCss.marginLeft}>{data.privWatchNum}</span>
          </div>
        </div>
      </div >
    )
  }
}