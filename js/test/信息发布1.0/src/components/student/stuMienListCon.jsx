/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 18:12:47
 * 班级风采单个组件
 */
import React, { Component } from 'react';
import { SVG, IMG } from './../base.js';
import { G } from '../../js/g.js';
import _x from '../../js/_x/index.js';
import '../../css/student/stuMienListCon.css';

export class StuMienListCon extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render(){
    let data = this.props.item;

    return (
      <div className="lxx-mien-g-each">
        <div>
          <label className={data.auditStatus === 0 ? 'lxx-u-status audit' : 'hidden'}>待审核</label>
          <label className={data.auditStatus === 2 ? 'lxx-u-status refuse' : 'hidden'}>未通过</label> 
        </div>
        <div className="lxx-ea-g-edit">
          <SVG type="down"></SVG>
          <div>
            <p onClick={this.props.showPubMeinDia.bind(this, {status: true, id: data.id})}>编辑风采</p>
            <p onClick={this.props.handleSetCoverDia.bind(this, {status: true, id: data.id, cover: data.cover})}>设置封面</p>
            <p onClick={this.props.handleDetelSingleMien.bind(this, data.id)}>删除</p>
          </div>
        </div>
        <div className="lxx-ea-g-img">
          {
            data.cover 
            ?
            <img src={G.serverUrl + data.cover}/>
            :
            <SVG type="image"></SVG>
          }
        </div>
        <div className="lxx-ea-g-til">
          <p title={data.title}>{data.title}</p>
          <p>{_x.util.date.format(new Date(data.createTime), 'yyyy-MM-dd')}</p>
        </div>
      </div>
    );
  }
}