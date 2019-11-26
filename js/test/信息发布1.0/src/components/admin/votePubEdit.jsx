/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:02:00 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-26 14:07:22
 * 投票的发布和编辑组件
 */
import '../../css/admin/votePubEdit.css';
import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Form, DatePicker, Button, Input, Checkbox, Row, Col, Radio} from "antd";
import { Panel, IMG, SVG } from './../base';
import { ChoiceClass } from './shared/choiceClass';
import { success, error } from './index';
import _x from '../../js/_x/index';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const TextArea = Input.TextArea;
const RadioGroup = Radio.Group;

let index = 0;
class VotePubEdit extends Component{
  constructor(){
    super();
    this.state={
      titNum:0,//标题字数长度
      txtaNum:0,//文本域字数长度
      choiceAdrVis:false,//选择场所模块 可见
      // data:[], 
      chioceAdrIds: [],//场所Id
      voteType:0,//投票类型默认单选
      isPublic: true, //公开统计 默认选中
      order:[],  // 选项
      title: '', //标题
      startTime: '',//时间 用于提交用
      endTime: '',
      content: '',
      disabled:false, // 是否禁用
      votedisplay:false,
      id:[],        // 单条投票id
      status:'', // 状态 0未开始  1进行中  2已结束
      orderBackData:[],// 选项回显的data
      workPlace: [], // 场所data
      isReaped:false,    //投票选项是否重复  true为重复
    }
    this.uuid = 0;
    this.chioceLength = 0;
    this.defaultTwo =[1,2];
    this.editStartTime = '';// 开始时间  用于 进行中 比较 endtime 
    this.RadioChange = this.RadioChange.bind(this);//单选 多选
    this.handleSubmit = this.handleSubmit.bind(this);//提交
    this.handleCancel = this.handleCancel.bind(this);//取消
    this.titChange = this.titChange.bind(this);//活动标题字数限制
    this.txtaChange = this.txtaChange.bind(this);//文本域字数限制
    this.hideChoiceAdr = this.hideChoiceAdr.bind(this);//场所可见
    this.showChoiceAdr = this.showChoiceAdr.bind(this);//场所可见
    this.stiChecked = this.stiChecked.bind(this);//公布统计结果
    this.timeChange = this.timeChange.bind(this);//时间change
    this.add = this.add.bind(this);
    // this.index = this.index.bind(this);
    this.remove = this.remove.bind(this);
  }

  componentWillMount(){
    if (this.props.type){
      this.getVoteDataBack(this.props.voteId)
     
    }
    this.num();
  }

  // 投票回显
  getVoteDataBack(id){
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/vote/find_vote_activity_by_id',
      data: {
        "id": id
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.editStartTime = rep.data.startTime;
        let chioceAdrIds = [];
        rep.data.workPlace.map((dt)=>{
          chioceAdrIds.push(dt)
        })
        _this.setState({
          title: rep.data.title, //标题
          startTime: rep.data.startTime,//时间
          endTime: rep.data.endTime,
          content: rep.data.content,
          disabled: rep.data.status === 0 ? false : true,
          isPublic: rep.data.isPublic === 0 ? false : true,
          voteType: rep.data.voteType === 0 ?  0:1,
          status: rep.data.status,
          // 选项 choice  choiceName内容  choiceOrder 位置 
          orderBackData:rep.data.choice,
          workPlace: rep.data.workPlace,// 场所的data [id，id]
          chioceAdrIds: chioceAdrIds,
          id: rep.data.id,
        })
      }
    })
  }

  // 发布投票接口
  getVoteData(id,type,orderList){
    let _this = this;

    this.setState({
      votedisplay:true
    })

    let title = this.state.title,
        content = this.state.content,
        startTime = this.state.startTime,
        endTime = this.state.endTime,
        workPlace = this.state.chioceAdrIds,
        isPublic = this.state.isPublic ? 1 : 0,
        voteType = this.state.voteType;
        // choice = orderList;
    let req={
      action:'api/web/manager_school_activity/vote/insert_and_update_vote_activities',
      data:{
        "id":id,
        'title': title,
        'content': content,
        'startTime': startTime,
        'endTime': endTime,
        'isPublic': isPublic,
        "voteType": voteType,
        "choice": orderList,
        'workPlace': workPlace,
      }
    }
    _x.util.request.formRequest(req,function(rep){
      if(rep.result){
        // 重新渲染
        _this.setState({
          votedisplay: false
        })
        if(type === 1){
          // 执行到上上组件的renderLoad 重新渲染
          _this.props.voteRenderLoad();
          _this.props.voteHideModal();
          
        }else{
          _this.props.renderLoad(null, null, null)
          // 关闭modal
          _this.props.voteHideModal();
          _this.setState({
            title: "",
            content: '',
            startTime: '',
            endTime: '',
            chioceAdrIds: '',
            voteType: 0,
            order: [],
          })
        }
       success("发布成功",1500);
      }else{
        error("发布失败",1500);
        _this.setState({
          votedisplay: false
        })
      }
    })
  }

  // 场所
  hideChoiceAdr = (addressObjs,ssIds) => {
    // 年级
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
    }else{
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

  // 投票类型
  RadioChange = (e) => {
    this.setState({
      voteType: e.target.value,
    })
  }
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    let order = [];
    let orderList = [];
    let val=[];
    let option = document.getElementsByClassName("ljc-vpe-oinp");
    this.setState({
      isReaped:false},
      ()=>{
      for(let i=0;i<option.length;i++){
      if (!option[i].value === false){
        order.push(option[i].value);
      }  
    }
      for(var i=0;i<order.length;i++) {  
      if(val.indexOf(order[i])>-1) { 
        this.setState({
          isReaped:true
        })
      }else{
        val.push(order[i]);
      }
    }
    setTimeout(() => {
    if(!this.state.isReaped){
      val.map((item, index) => {
        orderList.push({
          choiceName:item,
          choiceOrder: index + 1
        })
      })
      this.setState({
        order: orderList,
      })
    }
    }, 1);
    setTimeout(() => {
      if(this.state.chioceAdrIds.length === 0  ){
      error("请选择发布范围",1500);
    }else if (this.state.title.trim() === "") {
      error("请输入标题", 1500)
    } else if (this.state.startTime === "") {
      error("请输入开始时间", 1500)
    } else if (this.state.endTime === "") {
      error("请输入结束时间", 1500)
    } else if (this.state.content.trim() === "") {
      error("请输入内容", 1500)
    } else if (!order  || !order[0]  || !order[1] ) {
      error("请至少输入两个选项")
    }else if (this.state.isReaped){
      error("投票不可有重复选项",1500)   
    }else if(this.props.type){
      // 编辑
      // 编辑信息时，结束时间不能小于开始时间,且开始时间不能修改
      // 编辑时：1.时间控件：开始时间先保存下来，用于再次发布
      if(this.state.status === 1){
        if(this.editStartTime !== this.state.startTime ){
          error("开始时间不能修改",3000);
        }else{
          this.setState({
            startTime:this.editStartTime
          }, this.getVoteData(this.state.id, 1, orderList));
        }
      }else{
        this.getVoteData(this.state.id, 1, orderList);
      }
      
    }else{
      // 点击发布投票下的发布
      this.getVoteData(null,null, orderList);
    }
    }, 1);
   });
     
    

    
  }

  // 每个选项：div中包裹一个序号span 和一个 input 
  add(){
    // 创建盒子
    let wrap = document.querySelector("#option");
    let div = document.createElement("div");
    // 序号盒子
    let odiv = document.createElement("div")
    // 输入框 
    let input = document.createElement("input");
    input.setAttribute("maxlength","20")
    // 移除按钮盒子
    let removeDiv = document.createElement("div");
    let rText = document.createElement("span");
    
    rText.innerText = "x";
    div.className = "ljc-vpe-olist";
    odiv.className = "ljc-vpe-ospan";
    input.className ="ljc-vpe-oinp";
    removeDiv.className = "ljc-vpe-rspan";
 
    removeDiv.appendChild(rText)
    div.appendChild(odiv);
    div.appendChild(input);
    div.appendChild(removeDiv);
    removeDiv.onclick = this.remove;
    wrap.insertBefore(div, document.getElementById("btn"));
 
    this.num();
  }
  
  remove(e){
    e.preventDefault();
    // 移除对应的选项,取要删除的div 前面的序号，作为该div在父元素下的index
    let ind;
    if (e.target.className==="ljc-vpe-rspan"){
     ind = e.target.parentNode.firstChild.innerText;
    }else{
      ind = e.target.parentNode.parentNode.firstChild.innerText;
    }
 
    let option = document.getElementById("option");
    option.removeChild(option.children[ind - 1]);
    this.num();
  }

  // 将选项序号排列
  num(){
    let len = document.getElementsByClassName("ljc-vpe-olist"); // 数组对象
    for (let i = 0; i < len.length; i++) {
      len[i].firstChild.innerText = i + 1;
    }
  }

  // 取消
  handleCancel = () => {
    this.props.voteHideModal();
  }

  // 标题 change
  titChange = (e) => {
    this.setState({
      titNum: e.target.value.length,
      title: e.target.value
    })
 
  }

  //文本域文字限制
  txtaChange = (e) => {
    if (e.target.value.length < 501) {
      this.setState({
        txtaNum: e.target.value.length,
      })
    }
    this.setState({
      content:e.target.value
    })
  }

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

  // 公开统计结果
  stiChecked = (e) => {
    this.setState({
      isPublic:e.target.checked  
    })
  }

  // 将字符串时间转时间戳
  timestamp(obj) {
    let data = obj.substring(0, 19);
    data = data.replace(/-/g, '/');
    let timesTamp = new Date(data).getTime();
    return timesTamp;
  }

  //时间change
  timeChange(date, dateString) {
    if(this.props.type){
      // 编辑的
      if(this.state.status === 0){
        let startDate = this.timestamp(dateString[0])
        let endDate = this.timestamp(dateString[1])
        this.setState({
          startTime: startDate,
          endTime: endDate
        })
      }else if(this.state.status === 1){
        // 进行中的  开始时间返回的就是时间戳 
        let startDate = this.timestamp(dateString[0])
        let endDate = this.timestamp(dateString[1])
        this.setState({
          startTime: startDate,
          endTime: endDate
        })
      }
    }else{
      // 发布的
      let startDate = this.timestamp(dateString[0])
      let endDate = this.timestamp(dateString[1])
      this.setState({
        startTime: startDate,
        endTime: endDate
      })
    }
  }


  eventsubm


  render(){
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        md: { span: 4 },
      },
      wrapperCol: {
        md: { span: 20 },
      },
    };

    return(
      <div>
        {/* <Modal className="ljc-vpe-modal" title="发布投票" footer={null} visible={this.state.visible} onOk={() => this.setState({ visible: false })} onCancel={() => this.setState({ visible: false, choiceAdrVis: false})} > */}
          <div className="ljc-vpe-rangLine" >
            <Row>
              <Col md={4}><span className="ljc-vpe-label" >范围</span></Col>
              <Col md={20}>
                <span className="ljc-vpe-range" onClick={this.showChoiceAdr} ><SVG type="plus" />发布范围</span>
                <span className="ljc-vpe-left10">已选择&nbsp; {this.props.type ? this.state.workPlace.length:this.chioceLength} &nbsp;个</span>
              </Col>
            </Row>
          </div>

          <div className="ljc-vpe-formwrap" >
            <Form>
              <div className="ljc-vpe-numtip" >
                <FormItem {...formItemLayout} label="活动标题：">
                  <Input 
                    maxLength="50" 
                    onChange={this.titChange} 
                    value={this.state.title}
                    disabled={this.state.disabled} 
                  />
                </FormItem>
              
              {
                this.props.type
                ?
                  <span className="ljc-vpe-numlm" >{this.state.title.length}/50</span>
                :
                  <span className="ljc-vpe-numlm" >{this.state.titNum}/50</span>
              } 
              </div>
              <div>
                <FormItem {...formItemLayout} label="活动时间：">
                  {
                    // this.props.type 存在 说明是 编辑回显操作  否则是发布
                    this.props.type
                    ?
                      this.state.status === 2?
                      //已结束的 不能编辑时间
                      <RangePicker
                        onChange={this.timeChange}
                        showTime
                        disabled={this.state.disabled}
                        format="YYYY-MM-DD HH:mm"
                        value={[moment(_x.util.date.format(new Date(this.state.startTime)), "YYYY-MM-DD HH:mm"), moment(_x.util.date.format(new Date(this.state.endTime)), "YYYY-MM-DD HH:mm")]}
                      />
                      :
                    // 未开始  和 进行中的
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

              <div className="ljc-vpe-txta" >
                <FormItem  {...formItemLayout} label="内容：">
                  <TextArea 
                    maxLength="500" 
                    onChange={this.txtaChange}
                    value = {this.state.content}
                    disabled={this.state.disabled} 
                  />
                  {
                    this.props.type
                    ?
                    <span className="ljc-vpe-tareallm" >{this.state.content.length}/500</span>
                    :
                    <span className="ljc-vpe-tareallm" >{this.state.txtaNum}/500</span>
                  }
                </FormItem>
              </div>

              <div className="ljc-vpe-voteType" >
                <FormItem {...formItemLayout} label="投票类型：" >
                <RadioGroup onChange={this.RadioChange} value={this.state.voteType} disabled={this.state.disabled}  >
                  <Radio value={0}>单选</Radio>
                  <Radio value={1}>多选</Radio>
                </RadioGroup >
                <Checkbox checked={this.state.isPublic} onChange={this.stiChecked} disabled={this.state.disabled} >公开票数</Checkbox>
                </FormItem>
              </div>
             


              <div className="ljc-vpe-option" >
                <Row>
                  <Col md={4}><span className="ljc-vpe-label" >选择项</span></Col>
                  <Col md={20} id="option" >
                    {
                      this.props.type
                      ?
                      // <div id="optionTest" >
                        this.state.orderBackData.map((dt,ind) => (
                          <div className="ljc-vpe-olist" key={ind}>
                            <div className="ljc-vpe-ospan">{ind+1}</div>
                            <Input className="ljc-vpe-oinp" defaultValue={dt.choiceName} disabled={this.state.disabled}  onChange={this.input} />
                          <div className="ljc-vpe-rspan" onClick={this.state.disabled ? null: this.remove}><span>x</span></div>
                          </div>
                        ))
                      // </div>
                        
                      :
                        
                        this.defaultTwo.map((dt,index) =>(
                          <div className="ljc-vpe-olist" key={index}>
                            <div className="ljc-vpe-ospan">{dt}</div>
                            <input className="ljc-vpe-oinp" onChange={this.input} maxlength={20} />
                          </div>
                        ))
                    }
                  <Button id="btn" onClick={this.add} disabled={this.state.disabled} style={{ width: '45px', height: '40px', textAlign: "center", lineHeight: "40px" }}>
                      <SVG type="plus" />
                  </Button>
                  </Col>
                </Row>
              </div>


              
              <div className="ljc-vpe-btn" >
                <FormItem>
                  {
                    // 已结束的投票 显示为保存 
                    this.state.status === 2
                    ?
                      <Button onClick={this.props.voteHideModal} >保存</Button>
                    :
                    <Button 
                      htmlType="submit" 
                      onClick={this.handleSubmit} 
                      disabled={this.state.votedisplay} 
                      className={this.state.votedisplay ? "zn-disable-btn":""} >发布</Button>
                  }

                  <Button onClick={this.handleCancel} >取消</Button>
                </FormItem>
              </div>    
            </Form>
          <ChoiceClass 
            choiceAdrVis={this.state.choiceAdrVis}  
            hideChoiceAdr={this.hideChoiceAdr} 
            // 回显的场所 / 年级
            addressIds={this.state.chioceAdrIds} />
          </div>
        {/* </Modal> */}
      </div>
    )
  }
}

export default Form.create()(VotePubEdit);