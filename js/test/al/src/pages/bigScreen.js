/*
 * @Author: JC.Liu 
 * @Date: 2018-07-11 13:34:16 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-20 17:15:41
 */
import React, { Component } from 'react'
import { HeaderComponent, FooterComponent, BodyComponent } from '../component/index'

export default class BigScreen extends Component {
  state = {
    msg: ""
  }

  message = (msg) => {
    this.setState({
      // msg: msg.slice(msg.indexOf("-") + 1)
      msg:""
    })
  }

  render() {
    return (
      <div className="JC-big-screen" >
        {/* header */}
        <HeaderComponent Message={this.message} />
        {/* body */}
        <BodyComponent message={this.state.msg} />
        {/* footer */}
        <FooterComponent />
      </div>
    )
  }
}


