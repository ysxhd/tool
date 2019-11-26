/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:11:53 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-19 10:03:39
 * 投票统计组件 
 */
import '../../css/admin/voteCount.css';
import React, { Component } from 'react';
import { Progress } from 'antd';
import { SVG } from "../base";
import index from 'antd/lib/icon';
import _x from '../../js/_x/index';

export  class VoteCount extends Component {
  constructor(){
    super();
    this.state = {
      data:[],
      count:0,
    }
  }

  componentWillReceiveProps(newsProps){
    if (newsProps){
      this.setState({
        data:newsProps.data
      })
    }
  }

  render(){
    return (
      <div className="ljc-vc-container" >
        <div className="ljc-vc-top" >
          <div className="ljc-vc-title">{this.state.data ? this.state.data.title : "no"}</div>
          <span className="ljc-vc-num"><SVG type="users" color="#b3b3b3" />&nbsp;
            {
              this.state.data ? <span>{this.state.data.count}人</span> : ""
            }
          </span>
        </div>        
        <div className="ljc-vc-bottom">
          <div className="ljc-vc-opct" >
            {
              this.state.data.choice ? 
                this.state.data.choice.map(dt => (
                  <div className="ljc-vc-option" key={dt.choiceId}>
                    <div className="ljc-vc-pos" >{dt.choiceName}</div>
                    <Progress 
                      strokeWidth={13} 
                      percent={dt.choiceNum?
                        (Math.round((dt.choiceNum / this.state.data.count)*10000) / 100)
                        :
                        0
                      } 
                    />
                    <span className="ljc-vc-opnum" >({dt.choiceNum}人)</span>
                  </div>
                ))
              : ""
            }
          </div>
        </div>
      </div>
    );
  }
}