/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: MinJ
 * @Last Modified time: 2018-03-22 13:15:33
 * 右列发布组件
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Input, DatePicker } from 'antd';
import { success, error } from './../student/index';
import _x from './../../js/_x/index';
import './../../css/student/stuRightPub.css';

const { TextArea } = Input;
// function disabledDate(startValue) {
//   if (!startValue) {
//     return false;
//   }
//   // console.log(startValue);
//   // console.log(new Date());
//   return startValue.valueOf() + 1000 < new Date().valueOf();
//   // return current && current < moment().endOf('day');
// }

export class StuRightPub extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,     //modal可见
      titleNum: 0,         //活动标题字数
      contentNum: 0,       //活动内容字数
      dataId: '',          //数据id
      title: '',         //标题
      endTime: null,       //活动截止时间
      content: '',       //活动内容
      classId: '',       //从父组件来
      status: 0,           //回显状态
    }
    this.requestOldData = this.requestOldData.bind(this);
    this.requestData = this.requestData.bind(this);
    this.titleNum = this.titleNum.bind(this);
    this.contentNum = this.contentNum.bind(this);
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.dateChan = this.dateChan.bind(this);
  }
  componentWillMount() {
    // console.log('发布通知');
    this.setState({
      classId: this.props.classId
    })
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    var classId = this.state.classId;
    if (classId !== nextProps.classId) {
      this.setState({
        classId: nextProps.classId
      })
    }
    this.setState({
      visible: nextProps.visible,
      dataId: nextProps.pubId
    })
    nextProps.visible && nextProps.pubId.length !== 0
      ?
      this.requestOldData(nextProps.pubId)
      :
      ''
  }

  /**
   * 信息回显
   * id选择的数据
   */
  requestOldData(id) {
    console.log('班级通知信息回显');
    var req = {
      action: 'api/web/monitor_class_for_students/notice/find_notice',
      data: {
        id: id
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        const data = ret.data;
        var endTime = _x.util.date.format(new Date(data.endTime), 'yyyy-MM-dd HH:mm');
        this.setState({
          title: data.title,
          content: data.content,
          endTime: endTime,
          status: data.status
        })
      }
    })
  }
  /**
   * 发布通知
   * classId从父组件来,  id信息回显id,  title通知标题,   endTime通知截止时间,   content通知内容
   */
  requestData(classId, id, title, endTime, content) {
    // endTime = Date.parse(new Date(endTime));
    //设置过期时间永不过期
    endTime = new Date("2099-12-20");
    endTime = endTime.getTime();
    // console.log('发布通知：\\' + classId + ':\\' + id + ':\\' + title + ':\\' + endTime + ':\\' + content);
    var req = {
      action: 'api/web/monitor_class_for_students/notice/update_notice',
      data: {
        classId: classId,
        notice: {
          id: id,
          title: title,
          endTime: endTime,
          content: content
        }
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('发布成功', 1000);
        this.props.pubTrans('通知', false);
        this.setState({
          titleNum: 0,         //活动标题字数
          contentNum: 0,       //活动内容字数
          // dataId: '',          //数据id
          title: '',         //标题
          endTime: null,       //活动截止时间
          content: '',       //活动内容
          status: 0,           //回显状态
        })
      } else {
        error('发布失败', 1000);
      }
    })
  }

  //标题字数统计
  titleNum(e) {
    var len = e.target.value.length;
    this.setState({
      titleNum: len,
      title: e.target.value
    })
  }
  //内容字数统计
  contentNum(e) {
    var len = e.target.value.length;
    this.setState({
      contentNum: len,
      content: e.target.value
    })
  }
  //截止时间
  dateChan(date) {
    // console.log(date._d);
    this.setState({
      endTime: date._d
    })
  }
  // 确定
  okCli() {
    // console.log(this.state.endTime);
    // var timeNow = new Date(),
    //   seleTime = this.state.endTime;
    // console.log(timeNow < seleTime);
    if (!this.state.title.length) {
      error('请输入通知标题', 1000);
    } else if (!this.state.content.length) {
      error('请输入通知内容', 1000);
    } 
    // else if (timeNow > seleTime) {
    //   error('请选择正确时间', 1000);
    // } 
    else {
      this.requestData(this.state.classId, this.state.dataId, this.state.title, this.state.endTime, this.state.content);
    }
  }
  // 取消
  backCli() {
    this.props.pubTrans('通知', false);
    this.setState({
      titleNum: 0,         //活动标题字数
      contentNum: 0,       //活动内容字数
      // dataId: '',          //数据id
      title: '',         //标题
      endTime: null,       //活动截止时间
      content: '',       //活动内容
      status: 0,           //回显状态
    })
  }

  render() {
    const dateFormat = 'YYYY-MM-DD hh:mm:ss';
    // console.log(this.state.endTime);
    return (
      <Modal title={this.props.pubTitle}
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-srp-modal'
        footer={
          this.state.status === 2
            ?
            [<Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>取消</Button>]
            :
            [<Button className='mj-wcto-okBtn' key="submit" onClick={this.okCli}>发布</Button>,
            <Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>取消</Button>]
        }
      >
        <div className='mj-srp-div1'>
          <span>通知标题：</span>
          <Input maxLength='50' onChange={this.titleNum} value={this.state.title} />
          <p>{`${this.state.titleNum}/50`}</p>
        </div>
        {/* <div className='mj-srp-div2'>
          <span className='mj-srp-timeSpan'>截止时间：</span>
          <DatePicker
            format={dateFormat}
            // disabledDate={disabledDate}
            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
            onChange={this.dateChan}
            value={this.state.endTime ? moment(this.state.endTime) : null}
            placeholder={'请选择日期'}
          />
        </div> */}
        <div className='mj-srp-div1'>
          <span className='mj-srp-conSpan'>内容：</span>
          <TextArea maxLength='200' onChange={this.contentNum} value={this.state.content}></TextArea>
          <p>{`${this.state.contentNum}/200`}</p>
        </div>
      </Modal>
    );
  }
}