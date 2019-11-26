/*
 * @Author: lxx 
 * @Date: 2018-01-08 16:33:07 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-21 16:45:03
 */

import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { SVG } from './../../components/base';
import _x from '../../js/_x/index';
import { G } from './../../js/g';
import { StuLeft, StuMien, StuRight } from './../../components/student/index';
import './../../css/frameStudent.css';

const { Header, Content } = Layout;
export class FrameStudent extends Component {
  constructor() {
    super();
    this.state = {
      cntHei: 0,
      classId: "",
      className: "",
      userId:null
    }
  }
  componentWillMount() {
    let classId = sessionStorage.getItem('classId'),
      className = sessionStorage.getItem('className');
    this.setState({
      classId: classId,
      className: className
    })
  }
  componentDidMount() {
    // 组件加载完成后计算内容模块高度
    let userId = sessionStorage.getItem('userId');
    let getContentHeight = () => {
      let bodyHei = document.body.clientHeight;
      let cntHei = bodyHei - 80;
      this.setState({
        cntHei: cntHei,
        userId
      })
    }
    getContentHeight();
    let doAwayScrollbar = () => {
    }
    doAwayScrollbar();
    window.addEventListener('onbeforeunload', this.close());
    //关闭弹窗事件
  }
  close() {
    localStorage.clear();
  }
  render() {
    const rightTop = [
      { type: 1, title: '班级通知', pub: '发布通知' },
      { type: 2, title: '班级活动', pub: '发布活动' },
    ];
    const rightBottom = [
      { type: 3, title: '失物招领', pub: '发布失物招领' },
      { type: 4, title: '寻物启事', pub: '发布寻物启事' },
    ];
    return (
      <Layout className="lxx-g-student">
        <img className="lxx-stu-u-bgImg" src={require('./../../img/stuBg.png')} />
        <Header></Header>
        <Row>
          <Col span={19} style={{ fontSize: "30px", fontWeight: "bold" }}>信息发布系统</Col>
          <Col span={5}>
            <SVG type="man" />
            {
              !this.state.userId
                ?
                <span></span>
                :
                <span>{this.state.userId}</span>
            }
          </Col>
        </Row>
        <Content className="scrollbar" style={{ width: '100%', height: this.state.cntHei }}>
          <Row>
            <Col span={24} className="lxx-stu-g-name">{this.state.className}</Col>
          </Row>
          <Row className="lxx-stu-g-cnt">
            <div className="lxx-stu-g-left">
              <StuLeft classId={this.state.classId} />
            </div>
            <div className="lxx-stu-g-center">
              <StuMien classId={this.state.classId} />
            </div>
            <div className="lxx-stu-g-right">
              <StuRight titleData={rightTop} classId={this.state.classId} />
              <StuRight titleData={rightBottom} classId={this.state.classId} />
            </div>
          </Row>
        </Content>
      </Layout>
    )
  }
}
