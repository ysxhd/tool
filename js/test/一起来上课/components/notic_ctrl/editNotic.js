/*
 * @Author: xq 
 * @Date: 2018-07-03 13:39:21 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-10 16:07:00
 */
import React, { Component } from 'react';
import { Input, Checkbox, Select, Modal } from 'antd';
import './addNotic.css';
import { request as ajax } from '../../js/clientRequest';
import { ModalConfrim, ModalSuccess } from '../public/modal';
import { connect } from 'react-redux'
import { edit_change_value_action } from '../../redux/notic/tableOperat.redux'
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const Option = Select.Option

@connect(state => state.TableOperatReducer, { edit_change_value_action })
class EditNotic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // placeData是可选的项
      placeData: ['教学楼1', '教学楼2', '教学楼3', '教学楼4', '教学楼5', '教学楼6', '教学楼7', '教学楼8', '教学楼9', '教学楼10', '教学楼11', '教学楼12', '教学楼13'],
      indeterminate: true,
      checkAll: false,
      checkedList: [],  // 选中的项存到这里
      initShow: false,
      
      tsSuccess: false,    // 是否显示  成功的提示框
      tsFail: false,       // 是否显示  失败的提示框
      dataTime: '',
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

    }
  }

  componentDidMount() {
    // 去当前年份及上一年
    let yearRound = []
    let year = new Date().getFullYear();
    let nextYear = year + 1
    let prevYear = year - 1
    yearRound.push(year)
    yearRound.push(nextYear)
    yearRound.push(prevYear)
    yearRound.sort()

    let defaultMonth = new Date().getMonth() + 1;

    let defaultDay = new Date().getDay() + 1

    this.setState({
      yearRound,
      // dayRound,
      defaultDay,
      defaultMonth,
      deafultYear: year
    })

    // 1 请求接口(查看通知的接口)，拿到该条通知的数据
    // ajax('message/find_message_id',  {'noticeid':this.props.nowNoticId} , (res) => {
    //     if(res.result){
    //         let resData = res.data;
    //         this.setState({
    //           dataTitle:resData.title,
    //           dataMain :resData.content,
    //           dataTime :resData.noticeTime
    //         })
    //       } else{
    //         // 如果请求失败，给一个信息提示，操作失败
    //       }     
    //   })

    // 2 拿到上面的数据进行渲染（对时间格式做处理）
  }

  // 多选
  onChange = (checkedList) => {
    const placeData = this.state.placeData;
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < placeData.length),
      checkAll: checkedList.length === placeData.length,
    });
  }

  // 全选
  onCheckAllChange = (e) => {
    const placeData = this.state.placeData;
    this.setState({
      checkedList: e.target.checked ? placeData : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  // 提交发布
  onSubmit() {
    // 入参，待定
    let editParam = {
      'title': this.state.dataTitle,
      'content': this.state.dataMain,
      'buildingid': this.state.checkedList,
      'noticeid': this.props.nowNoticId,
      'noticeTime': this.state.noticeTime
    }
    //  提交-请求编辑接口
    // ajax('message/edit_message',  editParam , (res) => {
    //     if(res.result){
    //       // 发布成功 
    //       // 调用父级的方法，通知父页面发布成功，可以进行下一步dataSource请求
    //       this.props.submitStatue();
    //       this.setState({tsSuccess:true})
    //       // 显示操作成功的提示框
    //       ModalSuccess.show({flag:true,data:"发布成功",time:1000})
    //     } else {
    //       // 发布失败 显示 操作失败的提示框
    //       ModalSuccess.show({flag:false,data:res.result,time:1000})
    //     }
    // })

    // 接口通后下面有测试的都删除
    // 测试用  调用父级的方法，通知父页面发布成功，可以进行下一步dataSource请求
    this.props.submitStatue();
    // 测试用  显示操作成功的提示框
    ModalSuccess.show({ flag: true, data: "发布成功", time: 1000 })

    this.props.cancleModal();
  }

  // 年份 select 切换
  onYearChange = (key, value, type) => {
    this.setState({
      [key]: value
    })
  }
  // 月份 select 切换
  onMonthChange = (value) => {
    this.setState({
      defaultMonth: value
    })
  }

  // 日期 select 切换
  dayMap = (year, month) => {
    console.log("_11111");
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

  render() {
    const placeData = this.state.placeData;
    return (
      <Modal
        visible={this.props.visible}
        width={'65%'}
        wrapClassName='hf-nb-wrap'
        footer={null}
        closable={false}
      >
        <div className="hf-an-main">
          <div className="hf-an-bar">
            <span className="hf-an-title">编辑通知</span>
            <i className="iconfont icon-close hf-an-iClose" onClick={this.props.cancleModal}></i>
          </div>
          <div className="hf-an-cont xq-radius">
            <div className="hf-an-left">
              <div className="hf-an-item">
                <label className="hf-an-lable">标题：</label>
                <Input
                  className="hf-an-ipt"
                  onChange={(e) => this.props.edit_change_value_action("edit_tit", e.target.value)}
                  value={this.props.edit_tit}
                />
              </div>
              <div className="hf-an-item xq-an-item" >
                <label className="hf-an-lable xq-an-lable">时间：</label>
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
            <Select key="2" value={this.state.defaultMonth} onChange={this.onMonthChange} showArrow={false} >
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
              <div className="hf-an-item">
                <label className="hf-an-lable">正文：</label>
                <TextArea
                  className="hf-an-ipt hf-an-area xq-area-style"
                  row={4}
                  value={this.props.edit_content}
                  onChange={(e) => this.props.edit_change_value_action("edit_content", e.target.value)}
                />
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
              <CheckboxGroup options={placeData} value={this.state.checkedList} onChange={this.onChange} />
            </div>
          </div>
          <div className='xq-edit-btns'>
            <div className='xq-edit-btn xq-edit-submiut' onClick={(e) => { this.onSubmit(e) }}>
              <span>发布</span>
            </div>
            <div className='xq-edit-btn xq-edit-cancle' onClick={()=>this.props.edit_change_value_action("edit_hide")}>
              <span>取消</span>
            </div>
          </div>

        </div>
      </Modal>

    )
  }
}
export { EditNotic }