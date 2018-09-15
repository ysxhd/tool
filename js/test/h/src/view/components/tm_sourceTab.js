/*
 * @Author: hf 
 * @Date: 2018-07-30 16:12:37 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 11:22:19
 */

import React from 'react';
import { connect } from 'react-redux';
import G from './../../js/g';

@connect(
  state => state.Tm_sourceTabReducer,
)

export default class TmSourceTab extends React.Component {

  constructor() {
    super()
    this.state = {
      had_data: {
        "semCurPublicNum": 0,
        "weeksCurPublicNum": 0
      },
      public_data: {
        "semCurPublicNum": 0,
        "weeksCurPublicNum": 0
      },
      pravite_data: {
        "semCurPrivateNum": 0,
        "weeksCurPrivateNum": 0
      }
    };
  }
  render() {
    let had_data = this.props.had_data,
      public_data = this.props.public_data,
      pravite_data = this.props.pravite_data;
    const styleCss = {
      container: {
        width: 1300,
        margin: '20px auto',
        display: 'flex',
      },
      box: {
        width: 380,
        height: 80,
        display: 'flex',
        border: '1px solid #ccc',
        borderRadius: 8,
        marginRight: 80
      },
      title: {
        width: 150,
        borderRight: '1px solid #ccc',
        textAlign: 'center',
        lineHeight: '80px'
      },
      item: {
        textAlign: 'center',
        lineHeight: '40px',
        width: 115,
      },
      bigText: {
        fontSize: 20
      }

    }
    return (
      <div style={styleCss.container} >
        <div style={styleCss.box}>
          <div style={styleCss.title}>已完成课堂数</div>
          <div style={styleCss.item}>
            <p>本学期</p>
            <p style={styleCss.bigText}>{had_data.semCurTotalNum}</p>
          </div>
          <div style={styleCss.item}>
            <p>本周</p>
            <p style={styleCss.bigText}>{had_data.weeksCurTotalNum}</p>
          </div>
        </div>
        {
          G.configInfo.pubCurType == 1
            ?
            <div style={styleCss.box}>
              <div style={styleCss.title}>公有课堂数</div>
              <div style={styleCss.item}>
                <p>本学期</p>
                <p style={styleCss.bigText}>{public_data.semCurPublicNum}</p>
              </div>
              <div style={styleCss.item}>
                <p>本周</p>
                <p style={styleCss.bigText}>{public_data.weeksCurPublicNum}</p>
              </div>
            </div>
            :
            null
        }

        <div style={{ ...styleCss.box, marginRight: 0 }}>
          <div style={styleCss.title}>私有课堂数</div>
          <div style={styleCss.item}>
            <p>本学期</p>
            <p style={styleCss.bigText}>{pravite_data.semCurPrivateNum}</p>
          </div>
          <div style={styleCss.item}>
            <p>本周</p>
            <p style={styleCss.bigText}>{pravite_data.weeksCurPrivateNum}</p>
          </div>
        </div>
      </div>
    )
  }
}