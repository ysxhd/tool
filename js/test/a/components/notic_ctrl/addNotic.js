import React, { Component } from 'react';
import { Input, Checkbox, Select, Row, Col } from 'antd';
import { connect } from 'react-redux'
import { add_notic_modal_action , allNoticBtn_action, eidtNotice_close_action } from '../../redux/notic/tableOperat.redux'
import './addNotic.css';
import { request as ajax } from '../../js/clientRequest';
import { ModalSuccess } from '../public/modal';

const { TextArea } = Input;
const Option = Select.Option

@connect(state => state, { add_notic_modal_action , allNoticBtn_action, eidtNotice_close_action })
export default class AddNotic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeAll: [],
      indeterminate: true,
      checkAll: false,
      checkedList: [],
      // 年份选择范围
      yearRound: [],
      // 月份选择范围
      monthRound: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      // 日期选择范围
      dayRound: [],

      // 默认年份
      deafultYear: "",
      // 默认月份
      defaultMonth: "",
      // 默认日
      defaultDay: "",
      content: "",//正文内容
      title: "",
      noticeTime: "",
      buildingid: [],
      isEdit: false  //是否是编辑通知
    }
    this.clickNow = false;  //是否点击发布
  }

  componentDidMount() {
    // 去当前年份及上一年
    let yearRound = []
    let year = new Date().getFullYear();
    let prevYear = year - 1
    yearRound.push(year)
    yearRound.push(prevYear)
    yearRound.sort()

    let defaultMonth = new Date().getMonth() + 1;

    let defaultDay = new Date().getDate();

    this.setState({
      yearRound,
      // dayRound,
      defaultDay,
      defaultMonth,
      deafultYear: year,
      isEdit: false
    });
    this.getFloor();
  }
  
  // 获取教学楼
  getFloor() {
    //清除全部楼层的选项
    let data = this.props.placeReducer.buildingData;
          if (data.length) {
            let name = [];
            //深度克隆
           let newData = JSON.parse(JSON.stringify(data));
           newData.shift();
           newData.map((val) => {
              name.push(val.buildingid);
            })
            this.setState({ placeData: name, placeAll: newData })
          }
  }

  componentDidUpdate() {
    let data = this.props.TableOperatReducer, time, stime, year, month, day;
    if (data.isEdit) {
      //取消编辑状态
      this.props.eidtNotice_close_action();
      //转换日期
      time = data.singleData.noticeTime;
      stime = new Date(time);
      year = new Date(stime).getFullYear();
      month = new Date(stime).getMonth() + 1;
      day = new Date(stime).getDate();
      this.setState({
        deafultYear: year,
        defaultMonth: month,
        defaultDay: day,
        title: data.singleData.title,
        content: data.singleData.content,
        checkedList: data.singleData.buildingId,
        isEdit: true
      })
    }
  }

  //单选
  onChange = (checkedList) => {
    const { placeData } = this.state;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < placeData.length),
      checkAll: checkedList.length === placeData.length,
    });

  }

  //全选
  onCheckAllChange = (e) => {
    const placeData = this.state.placeData;
    this.setState({
      checkedList: e.target.checked ? placeData : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  // 年份 月份 日 选择
  onYearChange(key, value, type) {
    this.setState({
      [key]: value
    })
  }

  // 日期天数生成
  dayMap(year, month) {
    //  根据年份 月份 判断当前有多少天
    const day1 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const day2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    let dayArr = []

    if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) {
      dayArr = day2
    } else {
      dayArr = day1
    }

    const monthDay = dayArr[month - 1]
    let dayRound = []

    for (var i = 0; i < monthDay; i++) {
      dayRound.push(i + 1)
    }

    return dayRound.map((item, index) => {
      return <Option key={index} value={item} >{item}</Option>
    })
  }

  //文本框
  textAreaContent = (e) => {
    if (e.target.value.length > 500) {
      ModalSuccess.show({ data: "已超过最大字符限制" })
    } else {
      this.setState({ content: e.target.value });
    }
  }

  //点击发布
  publish = () => {
    let state = this.state;
    let stime = `${this.state.deafultYear}-${this.state.defaultMonth < 10 ? ("0" + this.state.defaultMonth) : this.state.defaultMonth}-${this.state.defaultDay < 10 ? ("0" + this.state.defaultDay) : this.state.defaultDay}`;
    let stime2 = `${this.state.deafultYear}-${this.state.defaultMonth}-${this.state.defaultDay}`; 
    let time = new Date(stime).getTime(); //选中的时间

    let now = new Date().getTime();//当天的时间戳
    let exatDay = new Date(now).getFullYear()+"-"+(new Date(now).getMonth()+1)+"-"+new Date(now).getDate();//当前天不带秒天数

    // console.log(new Date(now).getHours()+"-"+new Date(now).getMinutes());
   
    if (time > now) {
      ModalSuccess.show({ data: "时间有误，请重新选择" });
      return;
    }
    // 判断标题教学楼正文是否为空
    if (!state.title.length) {
      ModalSuccess.show({ data: "请输入标题" });
      return;
    }

    if (!state.content.length) {
      ModalSuccess.show({ data: "请输入正文" });
      return;
    }

    if (!state.checkedList.length) {
      ModalSuccess.show({ data: "请选择教学楼" });
      return;
    }


    //是否是第一次点击
    if(this.clickNow){
      return;
    }

    
    //编辑通知的请求
    if (state.isEdit) {
      console.log(stime2 === exatDay)
      ajax("message/edit_message", {
        "title": state.title, //标题//
        "noticeTime":stime2 === exatDay ? now : time, //播放时间//
        "content": state.content,//通知内容//
        "buildingid": state.checkedList, //通知哪些楼//
        "noticeid":this.props.TableOperatReducer.singleData.noticeid //哪条数据的Id
      }, res => {
        console.log(new Date(time));
        if (res.data.result) {
          this.props.add_notic_modal_action(false);
          ModalSuccess.show({ flag: true ,data:"修改成功"});
          this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, "", 1);
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })
    } else {
      //新增通知的请求
      ajax("message/insert_notice", {
        "title": state.title, //标题//
        "noticeTime": stime2 === exatDay ? now : time , //播放时间//
        "content": state.content,//通知内容//
        "buildingid": state.checkedList ,//通知哪些楼//
      }, res => {
        if (res.data.result) {
          this.props.add_notic_modal_action(false);
          ModalSuccess.show({ flag: true });
          this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, "", 1);
        } else {
          ModalSuccess.show({ data: res.data.message });
        }
      })
    }
    //第一次点击过后
    this.clickNow = true;
  }


  render() {

    return <div className="hf-an-main">
      <div className="hf-an-bar">
        <span className="hf-an-title">添加通知</span>
        <i className="iconfont icon-close hf-an-iClose" onClick={() => this.props.add_notic_modal_action(false)}></i>
      </div>
      <div className="hf-an-cont">
        <div className="hf-an-left">
          <div className="hf-an-item">
            <label className="hf-an-lable">标题：</label>
            <Input className="hf-an-ipt" maxLength={"25"} value={this.state.title} onChange={(e) => { this.setState({ title: e.target.value }) }} />
          </div>

          <div className="hf-an-item xq-an-item" >
            <label className="hf-an-lable xq-an-lable">日期：</label>
            <Select key="1" value={this.state.deafultYear} onChange={(value) => this.onYearChange("deafultYear", value)} showArrow={false} >
              {
                this.state.yearRound.length ?
                  this.state.yearRound.map((item, index) => (
                    <Option key={index} value={item} >{item}</Option>
                  ))
                  : null
              }
            </Select>
            年
            <Select key="2" value={this.state.defaultMonth} onChange={(value) => this.onYearChange("defaultMonth", value)} showArrow={false} >
              {
                this.state.monthRound.length ?
                  this.state.monthRound.map((item, index) => (
                    <Option key={index} value={item} >{item}</Option>
                  ))
                  : null
              }
            </Select>
            月
            <Select key="3" value={this.state.defaultDay} onChange={value => this.onYearChange("defaultDay", value)} showArrow={false} >
              {
                this.dayMap(this.state.deafultYear, this.state.defaultMonth)
              }
            </Select>
            日
          </div>

          <div className="hf-an-item zn-position-btm">
            <label className="hf-an-lable">正文：</label>
            <TextArea className="hf-an-ipt hf-an-area xq-area-style"
              onChange={this.textAreaContent}
              row={4}
              value={this.state.content}
            />
            <div className="zn-position-btm-bottom">{this.state.content.length}/500</div>
          </div>
        </div>
        <div className="hf-an-right xq-right-scroll">
          <div className="hf-an-checkAll">
            <Checkbox
              indeterminate={this.state.indeterminate}
              onChange={this.onCheckAllChange}
              checked={this.state.checkAll}
            >
              教学楼
          </Checkbox>
          </div>
          <Checkbox.Group onChange={this.onChange} value={this.state.checkedList}>
            <Row>
              {
                this.state.placeAll.map((val, i) => { 
                  return <Col key={i} span={24}><Checkbox value={val.buildingid}>{val.name}</Checkbox></Col>
                })
              }

            </Row>
          </Checkbox.Group>
        </div>
        <div className='xq-edit-btns'>
          <div className='xq-edit-btn xq-edit-submiut'   onClick={this.publish}>
            <span>发布</span>
          </div>
          <div className='xq-edit-btn xq-edit-cancle' onClick={() => this.props.add_notic_modal_action(false)} >
            <span>取消</span>
          </div>
        </div>
      </div>
    </div>
  }
}