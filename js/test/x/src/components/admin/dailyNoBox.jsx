/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:22:34 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:05:01
 * 日常通知版块
 */
import React, { Component } from 'react';
import { Button, Checkbox, Input, Pagination, Select, Modal } from 'antd';
import { SVG, IMG } from '../base';
import { DailyUrgentNo, DPubEdit, confirmDia } from './index';
import _x from '../../js/_x/index';
import _ from 'lodash';
import '../../css/admin/dailyNoBox.css';

const Search = Input.Search;
const Option = Select.Option;

export class DailyNoBox extends Component {  
  constructor(){
    super();
    this.state={
      data: [],         //列表数据
      // pageSize: 10,     //数据每页条数
      disabled: true,   //批量删除按钮是否禁用
      ids: [],          //选中的日常通知id
      idAll:[],         //所有Id，用于全选
      visible:false,    //modal
      current:1,        //当前页数
      // title:'',         //查询字段
      chosedId:'',      //当前选中通知的id，传给modal用
    };
    this.pageSize = 10; //数据每页条数
    this.total = 0;
    this.title = '';    //查询标题
    this.selectNumArr = [10,20,50,100];
  }

  componentDidMount(){
    this.getDailyData(1);
  };

  /**
   * 获取日常通知数据
   */
  getDailyData = (pageIndex) => {
    let req = {
      action:'api/web/manager_campus_notice/get_daily_notification',
      data:{
        pageIndex,
        pageSize:this.pageSize,
        title:this.title
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let idAll = [];
        let data = [];
        ret.data.map(dt=>{
          idAll.push(dt.id);
          data.push({
            id:dt.id,
            title:dt.title,
            date:_x.util.date.format(new Date(dt.date),'yyyy-MM-dd HH:mm')
          })
        });
        this.total = ret.total;
        this.setState({
          data: data,
          ids: [],
          idAll: idAll 
        });
      }
    });
  }

  /**
   * 页数改变
   */
  onChange = (pageIndex) =>{
    this.setState({
      current:pageIndex
    });
    this.getDailyData(pageIndex);
  };

  /**
   * 上一页下一页样式
   */
  itemRender = (current, type, originalElement) => {
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  /**
   * 选中通知改变
   */
  listOnChange = (id,bl) => {
    if(bl){
      this.setState({
        ids:[...this.state.ids,id]
      });
    }else{
      let newIds = this.state.ids;
      let idx = newIds.indexOf(id);
      newIds.splice(idx,1);
      this.setState({
        ids: newIds
      });
    }
  }

  /**
   * 全选按钮
   */
  checkAll = (e) => {
    if(e.target.checked){
      this.setState({
        ids: [...this.state.idAll]
      });
    }else{
      this.setState({
        ids: []
      });
    }
  };

  /**
   * 每页条数改变
   */
  sltChange = (value) => {
    if(value){
      this.setState({
        // pageSize: value,
        current: 1
      });
      this.pageSize = value
      this.getDailyData(1);
    }
  };

  /**
   * 显示编辑弹框
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  /**
   * 隐藏编辑弹框
   */
  hideModal = () => {
    this.setState({
      visible: false,
      chosedId:''
    });
  };

  /**
   * 搜索
   */
  search = (value) => {
    // this.setState({
    //   title:value
    // });
    this.title = value;
    this.getDailyData(1);
  };

  /**
   * 删除日常通知
   */
  delDailyNo = (id) => {
    let req = {
      action:'api/web/manager_campus_notice/del_daily_notification',
      data:{
        ids:[id]
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.getDailyData(1);
      }
    })
  };

  /**
   * 批量删除按钮
   */
  delMore = () => {
    confirmDia({
      title:'信息提示',
      content:'确定要删除选中通知吗？',
      className:0,
      okText:'确定',
      fnOK:() => {
        this.delDailyNoMore(this.state.ids);
      },
      fnCancel:() => {
      }
    })
  }

  /**
   * 批量删除
   */
  delDailyNoMore = (ids) => {
    let req = {
      action:'api/web/manager_campus_notice/del_daily_notification',
      data:{
        ids:ids
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.getDailyData(1);
      }
    })
  };

  /**
   * 获取编辑信息
   */
  getEditInfo = (id) => {
    this.setState({
      chosedId:id,
      visible:true
    });
  };

  render(){
    return (
      <div className="cjy-dnb">
        <div className="cjy-dnb-lineBox">
          <div className="cjy-dnb-pic"><SVG type="notice"/></div>
          <div className="cjy-dnb-noticeTxt cjy-clearfix">
            <span className="cjy-dnb-notice">日常通知</span>
            <Button className="cjy-dnb-pubBtn" onClick={ this.showModal }>日常发布</Button>
          </div>
        </div>
        <div className="cjy-dnb-list">
          <Checkbox onChange={ this.checkAll } checked={ this.state.ids.length !== this.state.idAll.length||this.state.ids.length==0 ? false :true  }>全选</Checkbox>
          <Button className="cjy-dnb-del" disabled={this.state.ids.length===0?true:false} onClick={this.delMore}>批量删除</Button>
          <Search className="cjy-dnb-ipt" placeholder="标题" onSearch={this.search} enterButton="搜索" />
        </div>
        {
          this.state.data.length
          ? <div>
            <div className="cjy-dnb-listBox">
              {
                this.state.data.map(dt => (
                  <div key={dt.id} className="cjy-dnb-dunBox" onClick={()=>this.getEditInfo(dt.id)}>
                    <DailyUrgentNo data={dt} listOnChange={this.listOnChange} ids={this.state.ids} delDailyNo={this.delDailyNo} type="0"></DailyUrgentNo>
                  </div>
                ))
              }
            </div>
            <div className="cjy-dnb-pageBox">
              <div className="cjy-dnb-selectPgsz">
                <span>共{this.total}条数据，每页</span>
                <Select defaultValue={this.selectNumArr[0]} style={{width: 80}} onChange={ this.sltChange }>
                  {
                    this.selectNumArr.map(slt => (
                      <Option key={slt} value={slt}>{slt}</Option>
                    ))
                  }
                </Select>
                <span>条</span>
              </div>
              <Pagination 
                simple 
                  defaultCurrent={1}
                current={this.state.current} 
                // defaultPageSize={this.selectNumArr[0]} 
                pageSize={this.pageSize} 
                total={this.total} 
                onChange={this.onChange} 
                itemRender={this.itemRender}>
              </Pagination>
            </div>
          </div>
          : <div className="cjy-dnb-noData">
            <div>
              <IMG src={require('../../img/noData.png')} width="180px" height="180px"/>
              <div className="cjy-dnb-txt">暂无相关内容</div>
            </div>
          </div>
        }
        <Modal className="cjy-modal" destroyOnClose="true" title="编辑通知" footer={null} visible={this.state.visible} onCancel={this.hideModal}>
          <DPubEdit hideModal={this.hideModal} chosedId={this.state.chosedId} pub={this.pub} getDailyData={this.getDailyData}/>
        </Modal>
      </div>
    );
  }
}