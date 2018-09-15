/*
 * @Author: hf 
 * @Date: 2018-08-06 15:27:11 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-06 16:24:30
 */
/**
 * 课堂自动发布设置
 */
import React from 'react';
import { Checkbox, Button, Radio } from 'antd';
import './../../css/mm_autoPublic_item.css';
import { _x } from './../../js/index';

const RadioGroup = Radio.Group;
const Request = _x.util.request.request;

export default class MmAutoPublicItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCheck: false,
    }
  }

  /**
   * 改变checkbox的状态
   */
  handleCheck = () => {
    this.setState({
      isCheck: !this.state.isCheck
    })
  }

  render() {
    let state = this.state;

    return (
      <div className="hf-mmapi-flexDiv">
        <div className="hf-mmapi-adcName">学院名称</div>
        <div>
          <Checkbox checked={state.isCheck} onClick={this.handleCheck}>全部自动发布</Checkbox>
        </div>
        <div>
          {
            !state.isCheck
              ? <Button className="lxx-s-blue" onClick={this.props.partAutoPublic}>部分自动发布</Button>
              : <Button className="lxx-s-blueUnable">部分自动发布</Button>
          }

        </div>
      </div>
    )
  }
}
