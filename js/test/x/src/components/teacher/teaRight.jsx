import React, { Component } from 'react';
import './../../css/teacher/teaRight.css';
import { SVG } from './../base.js';
import { Slider, InputNumber, Row, Col , Button } from 'antd';
import _x from '../../js/_x/index';
import { success, error } from './../../components/student/index';
import { G } from '../../js/g';


export class TeaRight extends Component {
  state = {
    status:0,//设备状态 1为在线 0为离线
    machineData:"",//存储设备信息 
    checkList:[],//设备的ids传参用的
    isActive:false,//音量键是否显示
    screenVal: true, //屏幕是否开启
    powerVal: 0,  //电源控制 0不操作 1关机 2重启
    voiceVal: 1, //音量0到1为控制声音的百分比 1 为关闭声音 2 为开启声音
    ifVoiceVal: 0,         //音量中间值
    clsId:'',  //班级Id
    screenImg:"" //屏幕图片
  }

  // 如果班级切换那么重新请求数据
  componentDidUpdate() {
    if (this.state.clsId != this.props.clsId) {
      this.setState({
        clsId: this.props.clsId,//重设当前班级Id
        checkList:[this.props.machineId],
        status:0,
        isActive:false,
        screenVal:false,
        ifVoiceVal:0.75
      },()=>{
        this.getAjax();
      });
    }
  }


  //每5分钟请求一下屏幕照片
  componentDidMount() {
    var that = this;
    this.timerID = setInterval(
      () => that.getAjax(),
      300000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  //获取班级设备状态信息
  getAjax = () =>{
   var that = this;
  // var ids = ['0U03QU3NB9'] //有数据的
   var ids = [this.props.machineId];
    let req = {
      action: 'api/web/manager_manage_class_card/devices_run_info',
      data: {
        ids: ids
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      if (ret.result && ret.data) {
         that.setState({
          status:ret.data.status,
          machineData:ret.data,
          ifVoiceVal:ret.data.voice,
          screenVal:ret.data.screen
         });
      }
    });
  }

  onChange = (value) => {
    this.setState({
      ifVoiceVal: value,
    });
  }

  showAudio = (e) =>{
    e.preventDefault();
    this.setState({isActive:true});
  }

    /**
   * 远程控制 数据存储
   * ids需要控制的设备id列表,   voice声音(小数),   screen屏幕是否开启,  power电源控制   
   */
  requestContrlMemory(ids, voice, screen, power) {
    var req = {
      action: 'api/web/manager_manage_class_card/control',
      data: {
        ids: ids,
        voice: voice,
        screen: screen,
        power: power
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('操作成功', 1000);
        this.setState({
          isActive: false
        });
      } else {
        error('操作失败', 1000);
      }
    })
  }

 //远程控制各选项
 device(ifRel) {
  switch (ifRel) {
    case 'voiceON':
      this.setState({
        voiceVal: 1,
        ifVoiceVal: 1
      });
      this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, 0);
      break;
    case 'voiceOFF':
      this.setState({
        voiceVal: 0,
        ifVoiceVal: 0
      });
      this.requestContrlMemory(this.state.checkList, 0, this.state.screenVal, 0);
      break;
    case 'OK':
      this.setState({
        isActive: false,
        voiceVal: this.state.ifVoiceVal
      });
      this.requestContrlMemory(this.state.checkList, this.state.ifVoiceVal, this.state.screenVal, 0);
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
    case 'powerON':  //重启
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

  render(){
     var data = this.state.machineData;
     //屏幕截屏是否存在
     if(data.screenPath){
        var imgUrl = G.serverUrl + data.screenPath;
     }
     
    return (
      <div> 
        <div className="zn-r-box">
           {/* 如果设备掉线或没有设备区域按钮不可选 */}
             {!this.state.status?<div className="zn-r-noClick"></div>:""}  
           <div className="zn-r-boxLeft">
               <img src={ !this.state.status ? require('./../../img/machine.png') : imgUrl} />
           </div>
           <ul className={!this.state.status ? "zn-r-boxRight zn-r-dataNull":"zn-r-boxRight"} id="zn-r-boxRight">
          
               <li><h5>远程控制</h5></li>
               <li>
                   <h6>声音 ：</h6>
                   <p onClick={this.device.bind(this,'voiceON')}>
                     <SVG type="voice"/>
                     <span>打开</span>
                   </p>
                   <p onClick={this.device.bind(this,'voiceOFF')}>
                     <SVG type="mute"/>
                     <span>关闭</span>
                   </p>
                   <div className="mr0" onClick={this.showAudio}> 
                     <SVG type="adjust"/>
                     <span>音量</span>
                     {this.state.isActive ? 
                        <div className="zn-r-videoShadow">
                        <Row>
                            <Col span={16}>
                                <Slider min={0} max={1} onChange={this.onChange} value={this.state.ifVoiceVal} step={0.1} style={{ marginLeft: "20px" }}/>
                            </Col>
                            <Col span={2}>
                                {this.state.ifVoiceVal*100}%
                            </Col>
                            <Col span={4}>
                            <Button onClick={this.device.bind(this,'OK')}>确定</Button>
                            </Col>
                        </Row>
                        </div>
                     : ""}
                   </div>
               </li>
               <li>
                   <h6>屏幕 ：</h6>
                   <p onClick={this.device.bind(this,'screenON')}>
                     <SVG type="monitor2"/>
                     <span>打开</span>
                   </p>
                   <p onClick={this.device.bind(this,'screenOFF')}>
                     <SVG type="monitor"/>
                     <span>关闭</span>
                   </p>
               </li>
               <li>
                   <h6>电源 ：</h6>
                   <p onClick={this.device.bind(this,'powerON')}>
                     <SVG type="reboot"/>
                     <span>重启</span>
                   </p>
                   <p onClick={this.device.bind(this,'powerOFF')}>
                     <SVG type="shutdown"/>
                     <span>关机</span>
                   </p>
               </li>
           </ul>
        </div>
      </div>
    );
  }
}