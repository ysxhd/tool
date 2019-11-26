/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-20 13:18:21
 * 发布投票组件
 */
import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Modal, Button, Input, DatePicker, Radio } from 'antd';
import { SVG } from './../../components/base';
import _x from './../../js/_x/index';
import { success, error } from './../student/index';
import './../../css/student/stuPubVoting.css';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export class StuPubVoting extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,      //modal可见
      classId: '',         //从父组件获取
      dataId: '',          //回显id
      titleNum: 0,           //标题字数
      contentNum: 0,         //内容字数
      nodeArr: [],         //增加节点数组
      nodeTotal: 2,            //节点总数
      // typeValue: 0,          //投票类型
      title: '',           //投票标题
      startTime: null,       //投票开始时间
      endTime: null,         //投票结束时间
      content: '',         //投票内容
      voteType: 0,         //投票类型
      choice: [],           //投票选项
      status: 0,               //数据状态
    }
    this.requestOldData = this.requestOldData.bind(this);
    this.requestData = this.requestData.bind(this);
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.addNode = this.addNode.bind(this);
    this.titleNum = this.titleNum.bind(this);
    this.contentNum = this.contentNum.bind(this);
    this.deleNode = this.deleNode.bind(this);
    this.nodeChan = this.nodeChan.bind(this);
    this.optionChan = this.optionChan.bind(this);
    this.typeChan = this.typeChan.bind(this);
    this.dateChan = this.dateChan.bind(this);
  }
  componentWillMount() {
    // console.log(111);
    this.setState({
      classId: this.props.classId
    })
  }
  componentWillReceiveProps(nextProps) {
    //  console.log(nextProps);
    var classId = this.state.classId;
    if (classId !== nextProps.classId) {
      this.setState({
        classId: nextProps.classId
      })
    }
    var nodeData = [];
    for (var j = 0; j < 2; j++) {
      nodeData.push({ choiceOrder: j + 1, choiceName: '' })
    }
    var nodeArr = this.nodeChan(6, nodeData);
    this.setState({
      visible: nextProps.visible,
      nodeArr: nodeArr,
      dataId:nextProps.pubId
    })
    nextProps.visible && nextProps.pubId.length !== 0
      ?
      this.requestOldData(nextProps.pubId)
      :
      ''
  }

  /**
   * 投票数据回显
   * id 回显数据id
   */
  requestOldData(id) {
    // console.log('投票数据回显');
    // console.log(id);
    var req = {
      action: 'api/web/monitor_class_for_students/vote/find_class_vote',
      data: {
        id: id
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        const data = ret.data;
        var startTime = _x.util.date.format(new Date(data.startTime), 'yyyy-MM-dd HH:mm'),
          endTime = _x.util.date.format(new Date(data.endTime), 'yyyy-MM-dd HH:mm');
        this.setState({
          title: data.title,
          startTime: startTime,
          endTime: endTime,
          content: data.content,
          voteType: data.voteType,
          nodeArr: data.choice,
          titleNum: data.title.length,
          contentNum: data.content.length,
          status: data.status
        })
      }
    })
  }
  /**
   * 发布投票
   * id回显数据id,  classId从父组件获取,   title投票标题, content投票内容 
   * startTime投票开始时间,   endTime投票截止时间
   * voteType投票类型,  isPublic传1,     choice选择项,    workPlace即[classID]
   */
  requestData(id, classId, title, content, startTime, endTime, voteType, isPublic, choice, workPlace) {
    // console.log('发布投票：/' + id + '/' + classId + '/' + title + '/' + content + '/' + status + '/' +
    //   startTime + '/' + endTime + '/' + voteType + '/' + isPublic + '/' + choice + '/' + workPlace);
    startTime = Date.parse(new Date(startTime));
    endTime = Date.parse(new Date(endTime));
    var req = {
      action: 'api/web/monitor_class_for_students/vote/insert_and_update_class_vote',
      data: {
        id: id,
        classId: classId,
        title: title,
        content: content,
        startTime: startTime,
        endTime: endTime,
        voteType: voteType,
        isPublic: isPublic,
        choice: choice,
        // workPlace: workPlace
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('发布成功', 1000);
        this.props.pubTrans('活动', false);
        this.setState({
          // dataId: '',          //回显id
          titleNum: 0,           //标题字数
          contentNum: 0,         //内容字数
          nodeArr: [],         //增加节点数组
          nodeTotal: 2,            //节点总数
          title: '',           //投票标题
          startTime: null,       //投票开始时间
          endTime: null,         //投票结束时间
          content: '',         //投票内容
          voteType: 0,         //投票类型
          choice: [],           //投票选项
          status: 0,               //数据状态
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
  //时间
  dateChan(date) {
    // console.log(date[0]._d);
    // console.log(date[1]._d);
    this.setState({
      startTime: date[0]._d,
      endTime: date[1]._d
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
  //投票类型选择
  typeChan(e) {
    // console.log(e.target.value);
    this.setState({
      voteType: e.target.value
    })
  }
  //节点总数变为节点数组
  nodeChan(total, data) {
    for (var i = 0; i < total; i++) {
      for (var j = 0, len = data.length; j < len; j++) {
        data[j].choiceOrder = j + 1;
      }
    }
    return data;
  }
  //增加投票项
  addNode() {
    var nodeTotal = this.state.nodeTotal + 1;
    var nodeArr = this.state.nodeArr;
    for (var i = 0; i < nodeTotal; i++) {
      var len = nodeArr.length;
      if (i + 1 > len) {
        nodeArr.push({ choiceOrder: i + 1, choiceName: '' });
      }
    }
    this.setState({
      nodeTotal: nodeTotal,
      nodeArr: nodeArr
    })
  }
  //删除投票项
  deleNode(id) {
    var nodeTotal = this.state.nodeTotal - 1;

    var nodeArr = this.state.nodeArr;
    var evens = _.remove(nodeArr, function (n) {
      return n.choiceOrder === id;
    });
    var nodeNewArr = this.nodeChan(nodeTotal, nodeArr);
    this.setState({
      nodeArr: nodeArr,
      nodeTotal: nodeTotal
    })
  }
  //投票项内容改变
  optionChan(id, e) {
    // console.log(id);
    // console.log(e.target.value);
    var nodeArr = this.state.nodeArr;
    for (var i = 0, len = nodeArr.length; i < len; i++) {
      if (id === i + 1) {
        nodeArr[i].choiceName = e.target.value;
      }
    }
    this.setState({
      nodeArr: nodeArr
    })
    // console.log(nodeArr);
  }
  // 确定
  okCli() {
    // console.log(this.state.voteType);
    var voteList = this.state.nodeArr,
      voteNull = 0,
      startTime = this.state.startTime,
      endTime = this.state.endTime;
    for (var i = 0, len = voteList.length; i < len; i++) {
      !voteList[i].choiceName.length
        ?
        voteNull++
        :
        ''
        //判断是否有投票的重复项
        if(voteList[0].choiceName == voteList[i].choiceName){
          if(i != 0){
            error('活动选择项有重复，请进行修改', 1000);
            return;
          }
        }
    }
    console.log(voteList);
    if (!this.state.title.length) {
      error('请输入活动标题', 1000);
    } else if (!this.state.content) {
      error('请输入活动内容', 1000);
    } else if (this.state.nodeArr.length - 2 < voteNull) {
      error('请输入活动选择项', 1000);
    }else if (!this.state.startTime || !this.state.endTime) {
      error('请选择活动时间', 1000);
    } else {
      this.requestData(this.state.dataId, this.state.classId, this.state.title, this.state.content, this.state.startTime,
        this.state.endTime, this.state.voteType, 1, this.state.nodeArr, [this.state.classId]);
    }
  }
  // 取消
  backCli() {
    this.props.pubTrans('活动', false);
    this.setState({
      // dataId: '',          //回显id
      titleNum: 0,           //标题字数
      contentNum: 0,         //内容字数
      nodeArr: [],         //增加节点数组
      nodeTotal: 2,            //节点总数
      title: '',           //投票标题
      startTime: null,       //投票开始时间
      endTime: null,         //投票结束时间
      content: '',         //投票内容
      voteType: 0,         //投票类型
      choice: [],           //投票选项
      status: 0,               //数据状态
    })
  }

  render() {
    // console.log(this.state.nodeArr);
    const dateFormat = 'YYYY-MM-DD HH:mm';
    return (
      <Modal title={this.props.pubTitle}
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-spv-modal'
        footer={
          this.state.status === 2
            ?
            [<Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>取消</Button>]
            :
            [<Button className='mj-wcto-okBtn' key="submit" onClick={this.okCli}>发布</Button>,
            <Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>取消</Button>]
        }
      >
        <div className='mj-spv-titleCon'>
          <span>活动标题：</span>
          <Input
            disabled={this.state.status !== 0 ? true : false}
            maxLength='50'
            onChange={this.titleNum}
            value={this.state.title} />
        </div>
        <p className='mj-spv-titleNum'>{`${this.state.titleNum}/50`}</p>

        <div className='mj-spv-timeCon'>
          <span className='mj-spv-timeSpan'>活动时间：</span>
          <RangePicker
            disabled={this.state.status === 2 ? true : false}
            format={dateFormat}
            onChange={this.dateChan}
            value={
              this.state.startTime === null && this.state.endTime === null
                ?
                [null, null]
                :
                [moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]
            }
            placeholder={['开始时间', '结束时间']}
          />
        </div>

        <div className='mj-spv-contentCon'>
          <span>内容：</span>
          <TextArea
            disabled={this.state.status !== 0 ? true : false}
            maxLength='200'
            onChange={this.contentNum}
            value={this.state.content}></TextArea>
        </div>
        <p className='mj-spv-titleNum'>{`${this.state.contentNum}/200`}</p>

        <div className='mj-spv-typeCon'>
          <span className='mj-spv-typeSpan'>活动类型：</span>
          <RadioGroup
            disabled={this.state.status !== 0 ? true : false}
            onChange={this.typeChan}
            value={this.state.voteType}
          >
            <Radio value={0}>单选</Radio>
            <Radio value={1}>多选</Radio>
          </RadioGroup>
        </div>

        <div className='mj-spv-choiceCon cjy-clearfix'>
          <span className='mj-spv-choiceSpan'>选择项：</span>
          <div className='mj-spv-choices cjy-clearfix'>
            {
              this.state.nodeArr.map((item, index) => (
                <div key={index} className='mj-spv-choi'>
                  <Input
                    disabled={this.state.status !== 0 ? true : false}
                    addonBefore={item.choiceOrder}
                    maxLength='20'
                    value={item.choiceName}
                    onChange={this.optionChan.bind(this, item.choiceOrder)} />
                  {
                    this.state.nodeTotal > 2
                      ?
                      <span className='mj-spv-deleSpan' onClick={() => this.deleNode(item.choiceOrder)}>
                        <SVG type='fail'></SVG>
                      </span>
                      :
                      ''
                  }
                </div>
              ))
            }
            <div className='mj-spv-add' onClick={this.addNode}>
              <SVG type='plus'></SVG>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}