/*
 * @Author: MinJ 
 * @Date: 2018-01-10 17:02:23
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:36:49
 * 删除提示组件
 */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { SVG } from '../../components/base';
import '../../css/admin/watClaDel.css';

export class WatClaDel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,      //模态框是否显示
      ifList: false        //是否是批量删除
    }
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.sureDel,
      ifList: nextProps.ifList
    })
  }

  okCli() {
    this.setState({
      visible: false
    });
    this.state.ifList
      ?
      this.props.batchDele('OK', false, true)
      :
      this.props.batchDele('OK', false, false)
  }
  backCli() {
    this.setState({
      visible: false
    });
    this.state.ifList
      ?
      this.props.batchDele('NO', false, true)
      :
      this.props.batchDele('NO', false, false)
  }

  render() {
    return (
      <Modal title="信息提示"
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-wcd-content'
        footer={[
          <Button className='mj-wcd-okBtn' key="submit" onClick={this.okCli}>确定</Button>,
          <Button className='mj-wcd-cancelBtn' key="back" onClick={this.backCli}>
            取消
          </Button>
        ]}
      >
        <SVG type={'info'}></SVG>
        <span className='mj-wcd-text'>删除后终端将回到初始状态，是否删除？</span>
      </Modal>
    );
  }
}