/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:02:35 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-20 15:28:47
 * 报名的发布和编辑组件
 */
import '../../css/admin/regPubEdit.css';
import React, { Component } from 'react';
import { Modal, Form, DatePicker, Button, Input, Checkbox, Row , Col} from "antd";
import { Panel, IMG, SVG } from './../base';
import { ChoiceClass } from './shared/choiceClass';
import { success, error } from './index';
import moment from 'moment';
import _x from '../../js/_x/index';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;

class RegPubEdit extends Component {
  constructor() {
    super();
    this.state = {
      titNum: 0,//标题字数限制
      txtaNum: 0,//文本域文字限制
      choiceAdrVis:false,//选择场所
      chioceAdrIds:[],//场所Id
      checked:true,
      title:'', //标题
      startTime:'',//时间
      endTime:'',
      maxNum:0,
      content:'',
      // defValue:0, // 默认限制人数
      data:[],
      regId:"",   //回显 用 id
      disabled:false, //是否禁用输入
      status:'',  // 0 未开始 1进行中 2已结束
      workPlace:[],// 场所data
      regdisplay:false,
    }
    this.chioceLength = 0;
    this.editStartTime = '';// 开始时间  用于比较 endtime
    this.titChange = this.titChange.bind(this);//活动标题字数限制
    this.cancel = this.cancel.bind(this);//取消发布按钮
    this.txtaChange = this.txtaChange.bind(this);//文本域字数限制
    this.handleSubmit = this.handleSubmit.bind(this);//表单提交
    this.hideChoiceAdr = this.hideChoiceAdr.bind(this);//场所可见
    this.showChoiceAdr = this.showChoiceAdr.bind(this);//场所可见
    this.maxNum = this.maxNum.bind(this); // 最大报名人数输入
    this.timeChange = this.timeChange.bind(this);// 日期 onChange
    this.isPublicCho = this.isPublicCho.bind(this); // 公开checkbox
  }

  componentDidMount(){
    if (this.props.regDBId){
      this.getRegDataBack(this.props.regDBId)
    }
  }

  // 报名编辑数据回显
  getRegDataBack(id) {
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/sign/find_sign_activity_by_id',
      data: {
        "id": id
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {

        _this.editStartTime = rep.data.startTime;
        let chioceAdrIds = [];
        rep.data.workPlace.map((dt) => {
          chioceAdrIds.push(dt)
        })

        _this.setState({
          title: rep.data.title, //标题
          startTime: rep.data.startTime,//时间
          endTime: rep.data.endTime,
          maxNum: rep.data.maxNum,
          content: rep.data.content,
          disabled: rep.data.status === 0? false:true,
          checked: rep.data.isPublic === 0? false:true,
          status: rep.data.status,
          
          workPlace: rep.data.workPlace,
          chioceAdrIds: chioceAdrIds,

          id: rep.data.id,
        })
      }
    })
  }

  // 发布ajax
  getAjaxSignUp(id,type){
    let title   = this.state.title,
      content   = this.state.content,
      startTime = this.state.startTime,
      endTime   = this.state.endTime,
      maxNum    = this.state.maxNum,
      workPlace = this.state.chioceAdrIds,
      isPublic  = this.state.checked ? 1 : 0;
    let req = {
      action: 'api/web/manager_school_activity/sign/insert_and_update_sign_activities',
      data: {
        "id": id,
        'title': title,
        'content': content,
        'startTime': startTime,
        'endTime': endTime,
        'maxNum': maxNum,
        'workPlace': workPlace,
        'isPublic': isPublic
      }
    } 
    let _this = this;
    _this.setState({
      regdisplay: true,
    })

    _x.util.request.formRequest(req, function (rep) {
      if(rep.code === "200"){
        if(type === 2){
          _this.props.regHideModal();
          _this.props.regRenderLoad();
          success('发布成功', 1500);
        }else{
          _this.props.renderLoad(null, null, null);
          _this.props.regHideModal();
          success('发布成功', 1500);
        }
        _this.setState({
          regdisplay: false,
        })
      }else{
        error("发布失败",1500)
        _this.setState({
          regdisplay:false,
        })
      }
    })
  }

  // 发布报名活动标题字数限制
  titChange = (e) => {
    if (e.target.value.length < 51) {
      this.setState({
        titNum: e.target.value.length,
      })
    }
    this.setState({
      title: e.target.value
    })
  }

  // 报名人数限制
  maxNum = (e) => {
    
    this.setState({
      maxNum:Number(e.target.value)
    })
  } 

  // 公开统计
  isPublicCho(e){
    this.setState({
      checked:e.target.checked 
    })
  }

  // 取消按钮
  cancel = () => {
    this.props.regHideModal();
  }

  //文本域文字限制
  txtaChange = (e) => {
    if (e.target.value.length < 501) {
      this.setState({
        txtaNum: e.target.value.length,
      })
    }
    this.setState({
      content: e.target.value
    })
  }

  // 将字符串时间转时间戳
  timestamp(obj){
    let data = obj.substring(0, 19);
    data = data.replace(/-/g, '/');
    let timesTamp = new Date(data).getTime();
    return timesTamp;
  }

  // 时间
  timeChange(date, dateString){
    let startDate = this.timestamp(dateString[0])
    let endDate = this.timestamp(dateString[1])
    this.setState({
      startTime: startDate,
      endTime: endDate
    })
  }

  //表单提交
  handleSubmit = (e) => {
    let reg = /^\+?[1-9][0-9]*$/;
    let bool = reg.test(this.state.maxNum);

    if (this.state.maxNum === 0 ){
      bool = true
    }

    if (this.state.chioceAdrIds.length === 0) {
      error("请选择发布范围", 1500);
    }else if (this.state.title.trim() === "") {
      error("请输入标题", 1500)
    }else if(this.state.startTime === ""){
      error("请输入开始时间", 1500)
    } else if (this.state.endTime === ""){
      error("请输入结束时间", 1500)
    } else if (this.state.maxNum === ""){
      error("请输入人数",1500)
    }else if (bool){
      if (Number(this.state.maxNum) <0){
          error('人数不能小于0', 1500)
      }else if (Number(this.state.maxNum) > 99999 ){
          error('人数不能大于99999', 1500);
      }else if (this.state.content.trim() === "") {
        error("请输入内容", 1500)
      }else if(this.props.type === 2){
        // 编辑
        if (this.editStartTime !== this.state.startTime){
          error("开始时间不能修改", 3000);
        }else{
          this.setState({
            startTime: this.editStartTime
          }, this.getAjaxSignUp(this.props.regDBId, 2));
        }
      }else{
        // 发布
        this.getAjaxSignUp(null, null)
      }
    }else{
      error("人数 输入格式不合法")
    }
  }

  hideChoiceAdr = (addressObjs, ssIds) => {
    if (addressObjs){
      if (addressObjs.length > 0) {
        let aId = [];
        addressObjs.map(dt => {
          aId.push(dt.classId)
        })
        this.chioceLength = aId.length;
        this.setState({
          chioceAdrIds: aId,
          choiceAdrVis: false
        })
      } else {
        this.chioceLength = 0;
        this.setState({
          choiceAdrVis: false
        })
      }
    } else {
      // 场所
      if (ssIds) {
        if (ssIds.length > 0) {
          let aId = [];
          ssIds.map(dt => {
            aId.push(dt)
          })

          this.chioceLength += aId.length;
          this.setState({
            chioceAdrIds: aId,
            choiceAdrVis: false
          })
        } else {
          this.setState({
            choiceAdrVis: false
          })
        }
      }
    }
  };


  showChoiceAdr = () => {
    if (this.props.type) {
      this.setState({
        choiceAdrVis: false
      });
    } else {
      this.setState({
        choiceAdrVis: true
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        md: { span: 4 },
      },
      wrapperCol: {
        md: { span: 20 },
      },
    };

    
    return (
      <div className="ljc-rpe-container" >
        <div className="ljc-rpe-rangLine" >
          <Row>
            <Col md={4}><span className="ljc-rpe-label" >范围</span></Col>
            <Col md={20}>
              <span className="ljc-rpe-range" onClick={this.showChoiceAdr}  ><SVG type="plus" />发布范围</span>
              <span className="ljc-rpe-left10">已选择&nbsp; {this.props.type ? this.state.workPlace.length : this.chioceLength} &nbsp;个</span>
            </Col>
          </Row>
        </div>

        <div className="ljc-rpe-formwrap" >
          <Form>
            <div className="ljc-rpe-numtip" >
              <FormItem {...formItemLayout} label="活动标题：">
                  <Input 
                    placeholder="" 
                    maxLength="50" 
                    onChange={this.titChange} 
                    value={
                      this.state.title
                    }  
                    disabled={
                      this.state.disabled
                     } 
                    />
              </FormItem>
              <span className="ljc-rpe-numlm" >{this.state.title.length}/50</span>
            </div>

            <div>
              <FormItem {...formItemLayout} label="活动时间：">
                {
                  this.props.type
                    ?
                    <RangePicker
                      onChange={this.timeChange}
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      value={[moment(_x.util.date.format(new Date(this.state.startTime)), "YYYY-MM-DD HH:mm"), moment(_x.util.date.format(new Date(this.state.endTime)), "YYYY-MM-DD HH:mm")]}
                    />
                    :
                    <RangePicker
                      onChange={this.timeChange}
                      showTime
                      format="YYYY-MM-DD HH:mm"
                    />
                }
              </FormItem>
            </div>
            <div className="ljc-rpe-lmtip" >
              <FormItem {...formItemLayout} label="名额上限：">
                <Input 
                  type="number" 
                  onChange={this.maxNum} 
                  // defaultValue={this.state.defValue} 
                  maxLength="5" 
                  value={this.state.maxNum} 
                  disabled={
                    this.state.disabled
                  } 
                />
              </FormItem>
              <span className="ljc-rpe-lmtxt" >0为不限制</span>
              <span className="ljc-rpe-result" >
                <Checkbox 
                  onChange={this.isPublicCho} 
                  checked={this.state.checked}
                  disabled={
                    this.state.disabled
                  } 
                />
                  公开人员
              </span>
            </div>

            <div className="ljc-rpe-txta" >
              <FormItem  {...formItemLayout} label="内容：">
                {
                  <TextArea 
                    placeholder="" 
                    maxLength="500"
                    onChange={this.txtaChange} 
                    value={this.state.content}
                    disabled={
                      this.state.disabled
                    } 
                  />
                }
                <span className="ljc-rpe-tareallm" >{this.state.content ? this.state.content.length:this.state.txtaNum}/500</span>
              </FormItem>
            </div>

            <div className="ljc-rpe-btn" >
              <FormItem>
                {
                  this.state.status === 2
                  ?
                    ""
                  :
                  <Button className={this.state.regdisplay ? "zn-disable-btn" : ""} onClick={this.handleSubmit} disabled={this.state.regdisplay} >发布</Button>
                }
                <Button onClick={this.cancel} >取消</Button>
              </FormItem>
            </div>
          </Form>
          <ChoiceClass choiceAdrVis={this.state.choiceAdrVis} hideChoiceAdr={this.hideChoiceAdr} addressIds={this.state.chioceAdrIds} />
        </div>
      </div >
    );
  }
}

export default Form.create()(RegPubEdit);