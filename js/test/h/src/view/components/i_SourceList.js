/*
 * @Author: hf 
 * @Date: 2018-07-23 15:04:15 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-07 10:51:20
 */

/**
 * 资源统计
 */

import React from 'react';
import './../../css/i_SourceList.css'
import request from './../../js/_x/util/request';
const Request = request.request;
export default class IndexSourceList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    this.getData();
  }

  getData() {
    Request('default/index/sourceTongji',
      {},
      (res) => {
        if (res.result) {
          this.setState({
            data: res.data
          })
        }
      }
    )
  }

  render() {
    var data = this.state.data;
    return (
      <div className="hf-isl-container">
        <div className="hf-isl-flexDiv">
          <svg className="icon hf-isl-icon hf-isl-public" aria-hidden="true">
            <use xlinkHref={"#icon-inResource"}></use>
          </svg>
          <div>
            <h3 className="hf-isl-h3">公有资源</h3>
            <h1>{data.pubSourceNum}</h1>
          </div>
        </div>
        <div className="hf-isl-flexDiv">
          <svg className="icon hf-isl-icon hf-isl-public" aria-hidden="true">
            <use xlinkHref={"#icon-inUpdate"}></use>
          </svg>
          <div>
            <h3 className="hf-isl-h3">公有资源更新</h3>
            <h1>{data.pubSourceUpdateNum}</h1>
          </div>
        </div>
        <div className="hf-isl-flexDiv">
          <svg className="icon hf-isl-icon hf-isl-private" aria-hidden="true">
            <use xlinkHref={"#icon-inResource"}></use>
          </svg>
          <div>
            <h3 className="hf-isl-h3">私有资源</h3>
            <h1>{data.priSourceNum}</h1>
          </div>
        </div>
        <div className="hf-isl-flexDiv">
          <svg className="icon hf-isl-icon hf-isl-private" aria-hidden="true">
            <use xlinkHref={"#icon-inUpdate"}></use>
          </svg>
          <div>
            <h3 className="hf-isl-h3">私有资源更新</h3>
            <h1>{data.priSourceUpdateNum}</h1>
          </div>
        </div>
      </div>
    )
  }

}
