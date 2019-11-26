/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:49:43
 * 发布寻物组件
 */
import React, { Component } from 'react';
import { Modal, Button, Input } from 'antd';
import { SVG } from './../../components/base';
import _x from './../../js/_x/index';
import { success, error } from './../student/index';
import './../../css/student/stuPubSearch.css';

const { TextArea } = Input;

export class StuPubSearch extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,     //modal可见
      type: 4,               //页面类型：3失物招领 4寻物启事
      dataId: '',          //数据回显id
      classId: '',         //从父组件获取
      titleNum: 0,         //活动标题字数
      contentNum: 0,       //活动内容字数
      title: '',           //标题
      content: '',         //内容
      status: 0,           //失物、寻物状态,0未领取或未找回，1已领取或已找回
      ifOk: false,      //点击已找回
    }
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.contentNum = this.contentNum.bind(this);
    this.titleNum = this.titleNum.bind(this);
  }
  componentWillMount() {
    this.setState({
      classId: this.props.classId,
      dataId: this.props.dataId
    })
  }
  componentWillReceiveProps(nextProps) {
    var type = 3;
    if (nextProps.pubTitle === '编辑寻物启事' || nextProps.pubTitle === '发布寻物启事') {
      type = 4;
    } else {
      type = 3;
    }

    var classId = this.state.classId;
    if (classId !== nextProps.classId) {
      this.setState({
        classId: nextProps.classId
      })
    }

    this.setState({
      visible: nextProps.visible,
      type: type,
      dataId: nextProps.pubId
    })
    nextProps.visible && nextProps.pubId.length !== 0
      ?
      this.requestOldData(nextProps.pubId, type)
      :
      ''
  }

  /**
   * 回显
   * id回显id， type：3失物招领 4寻物启事
   */
  requestOldData(id, type) {
    var req = {
      action: 'api/web/monitor_class_for_students/loss_and_found/find_loss_and_found',
      data: {
        id: id,
        type: type
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        var data = ret.data;
        var conLen = data.content.length,
          titleLen = data.title.length;
        this.setState({
          title: data.title,
          content: data.content,
          status: data.status,
          contentNum: conLen,
          titleNum: titleLen
        })
      }
    })
  }
  /**
   * 发布
   * classId从父组件获取,   type：3失物招领 4寻物启事,   id回显id, 
   * title标题, content内容, status：0未找回、未领取
   */
  requestData(classId, type, id, title, content, status) {
    var req = {
      action: 'api/web/monitor_class_for_students/loss_and_found/publish_loss_and_found',
      data: {
        classId: classId,
        loseFound: {
          type: type,
          id: id,
          title: title,
          content: content,
          status: status
        }
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('发布成功', 1000);
        this.props.pubTitle === '编辑寻物启事' || this.props.pubTitle === '发布寻物启事'
          ?
          this.props.pubTrans('寻物启事', false)
          :
          this.props.pubTrans('失物招领', false)
        this.setState({
          titleNum: 0,         //活动标题字数
          contentNum: 0,       //活动内容字数
          title: '',           //标题
          content: '',         //内容
          status: 0,           //失物、寻物状态,0未领取或未找回，1已领取或已找回
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
  //字数统计
  contentNum(e) {
    var len = e.target.value.length;
    this.setState({
      contentNum: len,
      content: e.target.value
    })
  }
  // 确定
  okCli() {
    // console.log(this.state.type);
    var status = this.state.ifOk ? 1 : 0;
    // this.props.pubTitle === '编辑寻物启事' || this.props.pubTitle === '发布寻物启事'
    //   ?
    //   this.props.pubTrans('寻物启事', false)
    //   :
    //   this.props.pubTrans('失物招领', false)
    this.requestData(this.state.classId, this.state.type, this.state.dataId, this.state.title,
      this.state.content, status);
  }
  // 取消
  backCli() {
    this.props.pubTitle === '编辑寻物启事' || this.props.pubTitle === '发布寻物启事'
      ?
      this.props.pubTrans('寻物启事', false)
      :
      this.props.pubTrans('失物招领', false)
    this.setState({
      titleNum: 0,         //活动标题字数
      contentNum: 0,       //活动内容字数
      title: '',           //标题
      content: '',         //内容
      status: 0,           //失物、寻物状态,0未领取或未找回，1已领取或已找回
    })
  }
  render() {
    const title = this.props.pubTitle;
    // console.log(title);
    return (
      <Modal title={this.props.pubTitle}
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-sps-modal'
        footer={[
          <Button className='mj-wcto-okBtn' key="submit" onClick={this.okCli}>发布</Button>,
          <Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>取消</Button>,
        ]}
      >
        <div className='mj-sps-div1'>
          <span>标题：</span>
          <Input
            disabled={this.state.status === 1 ? true : false}
            maxLength='50'
            onChange={this.titleNum}
            value={this.state.title} />
          <p className='mj-spv-titleNum'>{`${this.state.titleNum}/50`}</p>
        </div>
        <div className='mj-sps-div1'>
          <span className='mj-sps-contentSpan'>内容：</span>
          <TextArea
            disabled={this.state.status === 1 ? true : false}
            maxLength='200'
            onChange={this.contentNum}
            value={this.state.content}></TextArea>
          <p>{`${this.state.contentNum}/200`}</p>
        </div>
        {
          title === '编辑寻物启事' && this.state.status === 0 ?
            <div className='mj-sps-div3'>
              <span>结果确认：</span>
              <span
                className={!this.state.ifOk ? 'mj-sps-noneColor' : 'mj-sps-yellow'}
                onClick={() => this.setState({ ifOk: true })}>√ 已找回</span>
            </div> :
            (
              title === '编辑失物招领' && this.state.status === 0 ?
                <div className='mj-sps-div3'>
                  <span>结果确认：</span>
                  <span
                    className={!this.state.ifOk ? 'mj-sps-noneColor' : 'mj-sps-yellow'}
                    onClick={() => this.setState({ ifOk: true })}>√ 已领取</span>
                </div> :
                ''
            )
        }
      </Modal>
    );
  }
}