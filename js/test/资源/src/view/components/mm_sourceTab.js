/*
 * @Author: hf 
 * @Date: 2018-08-14 11:22:56 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-14 13:15:15
 */

import React from 'react';
import { connect } from 'react-redux';
import G from './../../js/g';

@connect(
  state => state.Mm_sourceTabReducer,
)
export default class MmSourceTab extends React.Component {

  constructor() {
    super()
    this.state = {}
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
        lineHeight: '40px'
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
          <div style={styleCss.title}>
            <p>已完成课堂数</p>
            <p style={styleCss.bigText}>{had_data.allCurTotalNum}</p>
          </div>

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
              <div style={styleCss.title}>
                <p>公有课堂数</p>
                <p style={styleCss.bigText}>{public_data.totalCurPublicNum}</p>
              </div>

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
          <div style={styleCss.title}>
            <p>私有课堂数</p>
            <p style={styleCss.bigText}>{pravite_data.totalCurPrivateNum}</p>
          </div>
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