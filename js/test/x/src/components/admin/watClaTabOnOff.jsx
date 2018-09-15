/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:38:01
 * 状态监督——开关机设置组件
 */
import React, { Component } from 'react';
import _ from 'lodash';
import { Checkbox, Modal, Radio, DatePicker, TimePicker, Button } from 'antd';
import _x from './../../js/_x/index';
import moment from 'moment';
import { error } from './../student/index';
import 'moment/locale/zh-cn';
import '../../css/admin/watClaTabOnOff.css';

moment.locale('zh-cn');
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

export class WatClaTabOnOff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,   //modal是否显示
      type: 1,        //按周或自定义
      weekList: [],      //选择的周几列表
      startTime: null,   //关机时间
      endTime: null,       //开机时间
      picherStart: null,       //任务开始时间
      picherEnd: null,       //任务结束时间
      // picherTime: '',     //周期范围
    }
    this.powerContral = this.powerContral.bind(this);
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.weekdayChange = this.weekdayChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.startChan = this.startChan.bind(this);
    this.endChan = this.endChan.bind(this);
    this.requestCtrlData = this.requestCtrlData.bind(this);
    this.dateChan = this.dateChan.bind(this);
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    nextProps.status
      ?
      this.requestCtrlData(this.props.checkList)
      :
      ''
    this.setState({
      visible: nextProps.status
    })
  }

  /**
   * 定时开关机数据存储
   * ids需要控制的设备,   type按周或自定义,     picherStart任务开始时间,   picherEnd任务结束时间, 
   * weekList周几列表,    startTime关机时间,   endTime开机时间
   */
  powerContral(ids, type, picherStart, picherEnd, weekList, startTime, endTime) {
    picherStart = picherStart ? this.formatDate(new Date(picherStart), false) : '';
    picherEnd = picherEnd ? this.formatDate(new Date(picherEnd), false) : '';

    //判断回显后的数据如果格式正确，那么就直接传递出去
    if(typeof startTime == 'object'){
      startTime = this.formatDate(new Date(startTime), true);
    }

    if(typeof endTime == 'object'){
      endTime = this.formatDate(new Date(endTime), true);
    }
    //传递周的时候，自定义的时间传空，//传递自定义的时候，周的传空
    if(type == 1){
      picherStart = null;
      picherEnd = null;
    }else{
      weekList = [];
    }

    var req = {
      action: 'api/web/manager_manage_class_card/power_control',
      data: {
        ids: ids,
        type: type,
        taskStartDate: picherStart,
        taskEndDate: picherEnd,
        dayOfWeek: weekList,
        shutDownTime: endTime,
        startUpTime: startTime
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        const data = ret.data;
      }
    })
  }


  //日期格式转换
  formatDate(date, ok) {
    if (date) {
      var h, minute, time;
      var y = date ? date.getFullYear() : '';
      var m = date ? date.getMonth() + 1 : '';
      m = m < 10 ? ('0' + m) : m;
      var d = date ? date.getDate() : '';
      d = d < 10 ? ('0' + d) : d;
      h = date ? date.getHours() : '';
      h = h < 10 ? ('0' + h) : h;
      minute = date ? date.getMinutes() : '';
      minute = minute < 10 ? ('0' + minute) : minute;
      ok ?
        time = h + ':' + minute + ':00' :
        time = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':00'
      return time;
    } else {
      return ''
    }
  };

  /**
   * 数据回显   定时开关机
   * ids需要控制的设备
   */
  requestCtrlData(ids) {
    var req = {
      action: 'api/web/manager_manage_class_card/devices_run_info',
      data: {
        ids: ids,
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        const data = ret.data;
        var reg = /\d\d:\d\d:\d\d/g;
        var endTime = null, startTime = null, picherStart = null, picherEnd = null;
       // reg.test(data.startUpTime) ? startTime = data.startUpTime.substring(0, 5) : startTime = null;
        reg.lastIndex = 0;      //重置正则的开始匹配位置，详情看正则test执行顺序
       // reg.test(data.shutDownTime) ? endTime = data.shutDownTime.substring(0, 5) : endTime = null;
        data.taskStartDate ? picherStart = this.formatDate(new Date(data.taskStartDate), false) : picherStart = null;
        data.taskEndDate ? picherEnd = this.formatDate(new Date(data.taskEndDate), false) : picherEnd = null;
        data.type === 0
          ?
          this.setState({
            type: 1,        //按周或自定义
            weekList: [],      //选择的周几列表
            startTime: null,   //关机时间
            endTime: null,       //开机时间
            picherStart: null,       //任务开始时间
            picherEnd: null,       //任务结束时间
          })
          :
          this.setState({
            // type: 2,        //按周或自定义
            type: data.type,        //按周或自定义
            weekList: data.dayOfWeek,      //选择的周几列表
            startTime: data.startUpTime,   //关机时间
            endTime: data.shutDownTime,       //开机时间
            picherStart: picherStart,       //任务开始时间
            picherEnd: picherEnd,       //任务结束时间
          })
      }
    })
  }

  //选择按周或自定义
  typeChange(e) {
    if (e.target.value === 1) {
      this.setState({
        type: e.target.value
      });
    } else {
      this.setState({
        type: 2
      });
    }
  }
  //按周——选择
  weekdayChange(val) {
    this.setState({
      weekList: val
    })
  }
  //开机时间
  startChan(time) {
    this.setState({
      startTime: time._d
    })
  }
  endChan(time) {
    this.setState({
      endTime: time._d
    })
  }
  okCli() {
    if (!this.state.startTime || !this.state.endTime) {
      error('请选择开关机时间', 1000);
    }  else if (this.state.type === 1 && !this.state.weekList.length) {
      error('请选择天', 1000);
    } else if (this.state.type === 2 && (!this.state.picherStart || !this.state.picherEnd)) {
      error('请选择周期范围', 1000);
    } else {
      this.powerContral(this.props.checkList, this.state.type, this.state.picherStart,
        this.state.picherEnd, this.state.weekList, this.state.startTime, this.state.endTime);
      this.setState({
        visible: false,
      });
      this.props.statusChan(false);
    }
  }
  backCli() {
    this.setState({
      visible: false,
    });
    this.props.statusChan(false);
  }
  //开始   结束时间
  dateChan(data) {
    this.setState({
      picherStart: data[0]._d,
      picherEnd: data[1]._d
    })
  }

  render() {
    const format = 'HH:mm';
    const dateFormat = 'YYYY-MM-DD';
    const options = [
      { label: '周一', value: 1 },
      { label: '周二', value: 2 },
      { label: '周三', value: 3 },
      { label: '周四', value: 4 },
      { label: '周五', value: 5 },
      { label: '周六', value: 6 },
      { label: '周日', value: 7 },
    ];
    return (
      <Modal title="定时开关机"
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-wcto-content'
        footer={[
          <Button className='mj-wcto-okBtn' key="submit" onClick={this.okCli}>保存</Button>,
          <Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>
            取消
          </Button>,
        ]}
      >
        <div className='mj-wcto-type'>
          <span>周期策略：</span>
          <RadioGroup onChange={this.typeChange} value={this.state.type}>
            <Radio value={1}>按周</Radio>
            <Radio value={2}>自定义</Radio>
          </RadioGroup>
        </div>
        <div className={this.state.type === 1 ? 'mj-wcto-weekCheck' : 'mj-wcto-none'}>
          <CheckboxGroup
            value={this.state.weekList}
            options={options}
            onChange={this.weekdayChange} />
        </div>
        <div className={this.state.type === 2 ? 'mj-wcto-timeCheck' : 'mj-wcto-none'}>
          <span>周期范围：</span>
          <RangePicker
            // disabled={this.state.status === 2 ? true : false}
            format={dateFormat}
            onChange={this.dateChan}
            value={
              this.state.picherStart === null && this.state.picherEnd === null || !this.state.picherStart || !this.state.picherEnd
                ?
                [null, null]
                :
                [moment(this.state.picherStart, dateFormat), moment(this.state.picherEnd, dateFormat)]
            }
            placeholder={['开始时间', '结束时间']}
          />
        </div>
        <div className='mj-wcto-onOff'>
          <div className='mj-wcto-on'>
            <span>开机时间：</span>
            <TimePicker
              format={format}
              onChange={this.startChan}
              value={this.state.startTime ? moment(this.state.startTime, format) : null}

              placeholder={'开机时间'}
            />
          </div>
          <div className='mj-wcto-off'>
            <span>关机时间：</span>
            <TimePicker
              format={format}
              value={this.state.endTime ? moment(this.state.endTime, format) : null}
              onChange={this.endChan}
              placeholder={'关机时间'} />
          </div>
        </div>
      </Modal>
    );
  }
}