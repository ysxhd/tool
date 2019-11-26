/*
 * @Author: MinJ 
 * @Date: 2018-01-11 17:24:08
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:40:06
 * 状态监督——单个终端控制modal
 */
import React, { Component } from 'react';
import { Modal, Button, Slider } from 'antd';
import { SVG } from '../base';
import _x from './../../js/_x/index';
import { success, error } from './../../components/student/index';
import '../../css/admin/watClaTerminCtrl.css';

export class WatClaTerminCtrl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,       //modal是否显示
      status: 0,             //在线状态
      checkList: [],           //dataID
      voiceVal: 1,           //音量
      ifVoiceVal: 1,         //音量中间值
      voiceShow: false,        //音量控制条出现
      screenVal: true,          //屏幕是否开启
      powerVal: 0,               //电源控制
    }
    this.requestContrlMemory = this.requestContrlMemory.bind(this);
    this.voiceSure = this.voiceSure.bind(this);
    this.voiceBtn = this.voiceBtn.bind(this);
    this.sliderChan = this.sliderChan.bind(this);
    this.backCli = this.backCli.bind(this);
  }
  componentWillMount() {
    this.setState({
      visible: this.props.ifContral,
      checkList: this.props.dataId,
      status: this.props.status
    })
  }

  
  componentDidMount(){
    var that = this;
    var req = {
      action: 'api/web/manager_manage_class_card/devices_run_info',
      data: {
        ids: this.props.dataId,
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      var data = ret.data;
      if (ret.result) {
        that.setState({
          voiceVal:data.voice,
          screenVal:data.screen
        })
      } 
    })
  }


  /**
   * 远程控制数据存储
   * ids需要控制的设备id列表,   voice声音(小数),   screen屏幕是否开启,  power电源控制   
   */
  requestContrlMemory(ids, voice, screen, power) {
    var req = {
      action: 'api/web/manager_manage_class_card/control',
      data: {
        ids: ids,
        voice: voice,
        screen: screen,
        power: power,
        // ids: ['2']
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('操作成功', 1000);
      } else {
        error('操作失败', 1000);
      }
    })
  }

  //远程控制各选项
  voiceSure(ifRel) {
    switch (ifRel) {
      case 'voiceON':
        this.setState({
          voiceVal: 1,
          ifVoiceVal: 1
        });
        // this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, this.state.powerVal);
        this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, 0);
        break;
      case 'voiceOFF':
        this.setState({
          voiceVal: 0,
          ifVoiceVal: 0
        });
        // this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, this.state.powerVal);
        this.requestContrlMemory(this.state.checkList, 0, this.state.screenVal, 0);
        break;
      case 'OK':
        this.setState({
          voiceShow: false,
          voiceVal: this.state.ifVoiceVal
        });
        // this.requestContrlMemory(this.state.checkList, this.state.ifVoiceVal, this.state.screenVal, this.state.powerVal);
        this.requestContrlMemory(this.state.checkList, this.state.ifVoiceVal, this.state.screenVal, 0);
        break;
      case 'NO':
        this.setState({
          voiceShow: false,
          ifVoiceVal: this.state.voiceVal
        });
        // this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, this.state.powerVal);
        break;
      case 'screenON':
        this.setState({
          screenVal: true
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, true, 0);
        break;
      case 'screenOFF':
        this.setState({
          screenVal: false
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, false, 0);
        break;
      case 'powerON':
        this.setState({
          powerVal: 2
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, 2);
        break;
      case 'powerOFF':
        this.setState({
          powerVal: 1
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, 1);
        break;
    }
  }
  // 点击音量按钮
  voiceBtn() {
    this.setState({
      voiceShow: true
    });
  }
  //音量控制
  sliderChan(val) {
    this.setState({
      ifVoiceVal: val
    })
  }
  backCli() {
    this.setState({
      visible: false
    })
    this.props.terminalContrl(false);
  }

  render() {
    return (
      <Modal title="终端远程控制"
        visible={this.state.visible}
        onCancel={this.backCli}
        className={this.state.voiceShow ? 'mj-wctc-contentLarge mj-wctc-content' : 'mj-wctc-content'}
        footer={null}
      >
        {/* 声音 */}
        <div className='mj-wcc-voice'>
          <span>声音：</span>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn1'
            onClick={() => this.voiceSure('voiceON')}>
            <SVG type={'voice'}></SVG>
            <span>打开</span>
          </Button>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn2'
            onClick={() => this.voiceSure('voiceOFF')}>
            <SVG type={'mute'}></SVG>
            <span>关闭</span>
          </Button>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className={this.state.voiceShow ? 'mj-wcc-ifvoiceShow' : 'mj-wcc-btn mj-wcc-btn3'}
            onClick={this.voiceBtn}>
            <SVG type={'adjust'}></SVG>
            <span>音量</span>
          </Button>
          <div className={this.state.voiceShow ? 'mj-wcc-voiceContral cjy-clearfix' : 'mj-wcc-ifvoiceShow'}>
            <Slider
              max={1}
              step={0.1}
              defaultValue={this.state.voiceVal}
              value={this.state.ifVoiceVal}
              tipFormatter={() => { return `${this.state.ifVoiceVal * 100}%`; }}
              onChange={this.sliderChan} />
            <span className='mj-wcc-voiceShow'>{`${this.state.ifVoiceVal * 100}%`}</span>
            <Button className='mj-wcc-okBtn' onClick={() => this.voiceSure('OK')}>确定</Button>
            <Button className='mj-wcc-cancelBtn' onClick={() => this.voiceSure('NO')}>取消</Button>
          </div>
        </div>
        {/* 屏幕 */}
        <div className='mj-wcc-screen'>
          <span>屏幕：</span>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn1'
            onClick={() => this.voiceSure('screenON')}>
            <SVG type={'monitor'}></SVG>
            <span>打开</span>
          </Button>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn2'
            onClick={() => this.voiceSure('screenOFF')}>
            <SVG type={'monitor2'}></SVG>
            <span>关闭</span>
          </Button>
        </div>
        {/* 电源 */}
        <div className='mj-wcc-power'>
          <span>电源：</span>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn1'
            onClick={() => this.voiceSure('powerON')}>
            <SVG type={'reboot'}></SVG>
            <span>重启</span>
          </Button>
          <Button
            disabled={this.state.status === 2 ? true : false}
            className='mj-wcc-btn mj-wcc-btn2'
            onClick={() => this.voiceSure('powerOFF')}>
            <SVG type={'shutdown'}></SVG>
            <span>关机</span>
          </Button>
        </div>
      </Modal>
    );
  }
}