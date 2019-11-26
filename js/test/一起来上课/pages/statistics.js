/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:34:35 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-07-17 14:41:58
 * 统计分析
 */
import React, { Component } from 'react'
import Container from '../index'
import Statistics from '../components/statistics_ctrl/statistics'
import { request as ajax } from '../js/clientRequest';

// @connect(
//   state=>state,
//   {Mydata}
// )
export default class Statistic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props
    }
  }


  componentDidMount() {
    //this.props.Mydata(data);
  }


  render() {
    return (
      <Container>
        <Statistics {...this.props} url={this.props.url} />
      </Container>
    )
  }
}