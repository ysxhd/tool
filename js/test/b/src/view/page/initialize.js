/*
 * @Author: zhengqi 
 * @Date: 2018-08-31 09:25:26 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-10 17:11:06
 */
/*初始化页面*/
import React, { Component } from 'react';
import { Radio, Input, Button, Modal, message } from 'antd';
import { connect } from 'react-redux';
import InitializeCompnent from './../components/base/initializeCompnent';
import { onChangeRange } from './../../redux/zq-initComp-reducer';
import { SVG } from './../common';
import { _x } from "./../../js/index";
import { SpinLoad } from './../common';
import './../../css/Initialize.css';
const RadioGroup = Radio.Group;

const Request = _x.util.request.request;

@connect(
  state => state.initReducer,
  {
    onChangeRange
  }
)
class Initialize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isInitialize: 1,
      pass: '',//初始化验证密码
      isSpin: false,
    }
  }

  /**
   * 修改是否初始化
   */
  onChangeInit = (e) => {
    this.setState({
      isInitialize: e.target.value,
    });
  }

  /**
 * 初始化密码
 */
  handlePass = (e) => {
    this.setState({ pass: e.target.value })
  }

  /**
   * 确认初始化
   */
  handleOk = () => {
    Request('api/web/initialize_page/check_password', { password: this.state.pass }, (res) => {
      if (res.result) {
        this.setState({ isSpin: true, visible: false });
        let params = this.props.functions;
        params.isInitialize = this.state.isInitialize;
        Request('api/web/initialize_page/initialization', params, (res) => {
          if (res.result) {
            message.success('初始化成功');
            // G.configInfo = params;
            // sessionStorage.configInfo = JSON.stringify(params);
            // this.props.history.push('/');
          } else {
            message.error('初始化失败');
          }
          this.setState({ isSpin: false });
        })
      } else {
        message.error(res.message);
      }
    })
  }

  /**
   * 取消初始化
   */
  handleCancel = () => {
    this.setState({ visible: false })
  }



  render() {
    let configInfo = JSON.parse(sessionStorage.configInfo);
    let props = this.props;
    return (
      <div className='zq-init-box'>
        <h2>{configInfo.projectName}</h2>
        <p>系统初始化，需填写一下信息</p>
        <div className='zq-init-container'>
          <div className='zq-init-row'>
            <p>适用范围：</p>
            <RadioGroup onChange={props.onChangeRange} value={props.functions.schoolType}>
              <Radio value={0}>普教</Radio>
              <Radio value={1}>高教</Radio>
            </RadioGroup>
          </div>
          {/* <div className='zq-init-row'>
            <p style={{ lineHeight: "40px" }}>平台名称：</p>
            <Input value='1212' onChange={this.handleName} />
          </div> */}
          <InitializeCompnent type={1} />
          <div className='zq-init-row'>
            <p>数据初始化：</p>
            <RadioGroup onChange={this.onChangeInit} value={this.state.isInitialize}>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
            <span>*数据初始化会重置数据库，请谨慎选择</span>
          </div>
          {/* <div className='zq-init-row'> */}
          <Button onClick={() => this.setState({ visible: true })} type="primary">开始初始化</Button>
          {/* </div> */}
        </div>

        <Modal
          title=""
          visible={this.state.visible}
          closable={false}
          className='zq-init-modal'
          footer={false}
          width={400}
        >
          <span><SVG type='init' /></span>
          <p>确认开始初始化？</p>
          <p>操作密码：</p>
          <Input value={this.state.pass} onChange={this.handlePass} />
          <div className='zq-init-modalBtn'>
            <Button onClick={this.handleOk} type="primary">确定</Button>
            <Button onClick={this.handleCancel} type="primary">取消</Button>
          </div>
        </Modal>
        {
          this.state.isSpin ?
            <SpinLoad text='数据初始化中...' /> : null
        }

      </div >
    );
  }
}

export default Initialize;