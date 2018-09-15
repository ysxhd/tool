/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:53:49 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-23 11:16:46
 * 紧急通知版块
 */
import React, { Component } from 'react';
import { Button, Checkbox, Input, Pagination, Select, Modal  } from 'antd';
import { SVG, IMG } from '../base';
import { DailyUrgentNo, DisplayMode, UPubEdit, confirmDia } from './index';
import _x from '../../js/_x/index';
import '../../css/admin/urgentNoBox.css';

const Search = Input.Search;
const Option = Select.Option;

export class UrgentNoBox extends Component {
  constructor(){
    super();
    this.state={
      curData: [],          //当前数据
      hisData: [],          //历史数据
      // pageSize: 10,         //数据每页条数
      disabled: true,       //批量删除按钮是否禁用
      isPre: true,          //是显示还是历史记录版块
      ids: [],              //选中的日常通知id
      idAll:[],             //所有Id，用于全选
      visible:false,        //modal
      current:1,            //当前页数
      // content:'',           //内容
      chosedId:'',          //当前选中历史通知的id，传给modal用
      // status:'',            //当前选中历史通知的状态，C过期
    };
    this.total = 0;
    this.content = '';      //搜索内容
    this.selectNumArr = [10,20,50,100];
    this.pageSize = 10;     //数据每页条数
    this.getCurData = this.getCurData.bind(this);
    this.getHisData = this.getHisData.bind(this);
    this.turn = this.turn.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.listOnChange = this.listOnChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.sltChange = this.sltChange.bind(this);
  };

  componentDidMount(){
    this.getCurData();
    this.getHisData(1,10);
  }

  /**
   * 获取紧急通知
   */
  getCurData(){
    let req = {
      action:'api/web/manager_campus_notice/get_urgent_notice',
      data:{
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let data = [];
        ret.data.map(dt => {
          data.push({
            id:dt.id,
            type:dt.type,
            createDate:_x.util.date.format(new Date(dt.createDate),'yyyy-MM-dd HH:mm'),
            endTime:_x.util.date.format(new Date(dt.endTime),'yyyy-MM-dd HH:mm'),
            content:dt.content
          })
        });
        this.setState({
          curData: data
        });
      }
    });
  };

  /**
   * 获取历史数据
   * @param {*} page 
   */
  getHisData(page){
    let req = {
      action:'api/web/manager_campus_notice/get_urgent_notice_record',
      data:{
        pageIndex:page,
        pageSize:this.pageSize,
        content:this.content
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let data = [];
        let idAll = [];
        ret.data.map(dt => {
          data.push({
            id:dt.id,
            status:dt.status,
            createDate:_x.util.date.format(new Date(dt.createDate),'yyyy-MM-dd HH:mm'),
            endTime:_x.util.date.format(new Date(dt.endTime),'yyyy-MM-dd HH:mm'),
            content:dt.content
          });
          if(dt.status==='B'||dt.status==='C'){
            idAll.push(dt.id);
          }
        });
        this.total = ret.total;
        this.setState({
          hisData: data,
          ids: [],
          idAll: idAll 
        });
      }
    })
  }

  /**
   * 发布记录按钮
   */
  turn(){
    this.setState({
      isPre: !this.state.isPre
    },()=>{
      if(!this.state.isPre){
        this.getHisData(1,10);
      }
    })
  };

  /**
   * 全选按钮
   * @param {*} e 
   */
  checkAll(e){
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
   * 单个勾选
   * @param {*} id 
   * @param {*} bl 
   */
  listOnChange(id,bl) {
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
  };

  /**
   * 页码改变
   * @param {*} page 
   */
  onChange(page){
    this.setState({
      current:page
    });
    this.getHisData(page);
  };

  /**
   * 改变每页显示条数
   * @param {*} value 
   */
  sltChange(value){
    this.setState({
      // pageSize: value,
      current:1
    });
    this.pageSize = value;
    this.getHisData(1);
  };

  /**
   * 渲染页码组件
   * @param {*} current 
   * @param {*} type 
   * @param {*} originalElement 
   */
  itemRender(current, type, originalElement){
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  };
  
  /**
   * 显示编辑modal
   */
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  
  /**
   * 隐藏编辑modal
   */
  hideModal = () => {
    this.setState({
      visible: false,
      chosedId:''
    });
  };

  /**
   * 编辑通知
   */
  getEditInfo = (id) => {
    this.setState({
      chosedId:id,
      visible:true
    });
  };

  /**
   * 搜索框
   */
  search = (value) => {
    this.content = value;
    this.getHisData(1);
  };

  /**
   * 删除紧急通知
   */
  delUrgentNo = (id) => {
    let req = {
      action:'api/web/manager_campus_notice/del_urgent_notice',
      data:{
        ids:[id]
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.getHisData(1,10)
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
        this.delUrgentNoMore(this.state.ids);
      },
      fnCancel:() => {
      }
    })
  }

  /**
   * 批量删除
   */
  delUrgentNoMore = (ids) => {
    let req = {
      action:'api/web/manager_campus_notice/del_urgent_notice',
      data:{
        ids:ids
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.getHisData(1,10);
      }
    })
  };

  /**
   * 撤销通知
   */
  cancel = (id) => {
    let req = {
      action:'api/web/manager_campus_notice/undo_urgent_notice',
      data:{
        id
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.getCurData();
        this.getHisData(1,10);
      }
    })
  }

  render(){
    return (
      <div className="cjy-unb"> 
        <div className="cjy-unb-lineBox">
          <div className="cjy-unb-pic"><SVG type="emergency"/></div>
          <div className="cjy-unb-noticeTxt">
            <span className="cjy-unb-notice">紧急通知</span>
          </div>
          <div className="cjy-unb-noticeBtn cjy-clearfix">
            <Button className="cjy-unb-pubBtn" onClick={this.showModal}>紧急发布</Button>
            {
              this.state.isPre
              ? <Button className="cjy-unb-pubHis" onClick={ this.turn }>发布记录</Button>
              : <Button className="cjy-unb-pubHis" onClick={ this.turn }>返回</Button>
            }
          </div>
        </div>
        {
          this.state.isPre
          ? this.state.curData.length
            ? <div className="cjy-unb-curBox">
              {
                this.state.curData.map(dt => (
                  <DisplayMode data={dt} key={dt.id} getEditInfo={this.getEditInfo} cancel={this.cancel}/>
                ))
              }
            </div>
            : <div className="cjy-unb-noData">
              <div>
                <IMG src={require('../../img/noData.png')} width="180px" height="180px"/>
                <div className="cjy-unb-txt">暂无相关内容</div>
              </div>
            </div>
          : this.state.hisData.length
            ? <div>
              <div className="cjy-unb-list">
                <Checkbox onChange={ this.checkAll } checked={ this.state.ids.length === this.state.idAll.length ? true : false }>全选</Checkbox>
                <Button className="cjy-unb-del" disabled={this.state.ids.length===0?true:false} onClick={this.delMore}>批量删除</Button>
                <Search className="cjy-unb-ipt" placeholder="内容" onSearch={this.search} enterButton="搜索" />
              </div>
              <div className="cjy-unb-listBox">
                {
                  this.state.hisData.map(dt => (
                    <div className="cjy-dnb-dunBox" key={dt.id} onClick={()=>this.getEditInfo(dt.id,dt.status)}>
                      <DailyUrgentNo data={dt} listOnChange={this.listOnChange} ids={this.state.ids} delUrgentNo={this.delUrgentNo} type="1"></DailyUrgentNo>
                    </div>
                  ))
                }
              </div>
              <div className="cjy-unb-pageBox">
                <div className="cjy-unb-selectPgsz">
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
                  current={this.state.current} 
                  // defaultPageSize={this.selectNumArr[0]} 
                  pageSize={this.pageSize}
                  total={this.total} 
                  onChange={this.onChange} 
                  itemRender={this.itemRender}></Pagination>
              </div>
            </div>
            : <div className="cjy-unb-noData">
              <div>
                <IMG src={require('../../img/noData.png')} width="180px" height="180px"/>
                <div className="cjy-unb-txt">暂无相关内容</div>
              </div>
            </div>
        }
        <Modal className="cjy-modal" destroyOnClose="true" title="编辑通知" footer={null} visible={this.state.visible} onCancel={this.hideModal}>
          <UPubEdit hideModal={this.hideModal} chosedId={this.state.chosedId} getCurData={this.getCurData} status={this.state.status}/>
        </Modal>
      </div>
    );
  }
}