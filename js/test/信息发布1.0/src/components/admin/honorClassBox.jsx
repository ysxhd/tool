/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:30:41 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 13:46:55
 * 荣誉班级版块
 */
import '../../css/admin/honorClassBox.css';
import React, { Component } from 'react';
import { SVG, IMG } from "../base";
import HonorInfo from "./honorInfo";
import { Card, Select, Modal, Pagination} from "antd";
import { PubHonor } from './index';
import _x from '../../js/_x/index';
const Option = Select.Option;

let dateYear = new Date().getFullYear(); //2018
// let dateYear = 2022;
export default class HonorClassBox extends Component {
  constructor(){
    super();
    this.state={
      data:[],//荣誉列表数据
      toolDownShow:"none",//荣誉操作栏
      visible: false,//modal框
      pubState:0,//0发布1编辑
      yearData:[],

      
      total:0,
      pageIndex:1, 
      pageSize:20,
      belongType: 1,//1班级2教师3学生
      uid:'',//事记id
      yearDefValue:'', // 默认学年
    }
    // this. =  '', // 学年信息的默认值 默认最近学年
    this.toolSlidDown = this.toolSlidDown.bind(this);
    this.yearChange = this.yearChange.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.getClaHnData = this.getClaHnData.bind(this);
    this.getClaYearData = this.getClaYearData.bind(this);
    this.getAcdYear = this.getAcdYear.bind(this);
  }
  componentWillMount() {
    // 获取学年信息 
    this.getClaYearData();
  }

  // 获取学年数据
  getClaYearData(){
    let _this = this;
    let req = {
      action:"api/web/information/academic_year/find_semester",
      data:{
      }
    }
    _x.util.request.formRequest(req,function(rep){
      if(rep.result){
        _this.getAcdYear(rep.data);
        _this.setState({
          yearData:rep.data,
        })
      }
    })
  }

  // 设置默认近学年的年份
  getAcdYear(data) {
    let acdYear = dateYear - 1 + '_' + dateYear;
    // 存学年名称，
    let acdId = [];
    for (let i = 0; i < data.length; i++) {
      acdId.push(data[i].acd_id);
    }
    if (acdId.indexOf(acdYear) > -1){
      // this.yearDefValue = acdYear;
      this.setState({
        yearDefValue: acdYear
      })
      this.getClaHnData(null, null, acdYear);
    }else{
      dateYear--;
      this.getAcdYear(data);
    }
  }

  // 荣誉数据
  getClaHnData(pi,ps,y){
    let _this = this,
      pI = pi || _this.state.pageIndex,
      pS = ps || _this.state.pageSize,
      aY = y  || _this.state.yearDefValue,
      bT = _this.state.belongType;
    let req = {
      action: '/api/web/information/manager_honor/find_all',
      data:{
        'pageIndex': pI,
        'pageSize': pS - 1 ,
        'academicYear': aY,
        'belongType': bT,
      }
    }
    _x.util.request.formRequest(req,function(rep){
      if(rep.result){
        _this.setState({
          data: rep.data.pageContent,
          total:rep.total,
          pageIndex: pI,
        })
      }
    })
  }

  toolSlidDown(){}

  showModal = (pubState,uid) => {
    this.setState({
      visible: true,
      pubState,
      uid
    });
  };

  yearChange(value){
    this.setState({
      yearDefValue:value
    })
    this.getClaHnData(null,null,value)
  }

 
  // 下拉框选择每页条数
  selectChange(value) {
    if (value) {
      this.setState({
        pageSize: value,
        pageIndex: 1,
      });
      this.getClaHnData(1,value,this.state.yearDefValue);
    }
  }

  // 分页按钮
  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  // 分页
  onChangePagination(page, pageSize) {
    this.getAjaxData(page,pageSize,this.state.yearDefValue)
  }


  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  render(){
    const toolListDown = {
      display:this.state.toolDownShow,
    }

    return (
      <div className="ljc-chn-hnctn" >
        <div className="ljc-chn-sel" >
          <Select value={this.state.yearDefValue} onChange={this.yearChange} >
            {
              this.state.yearData.map(dt => (
                <Option value={dt.acd_id} id={dt.uid} key={dt.uid} > {dt.acd_id} </Option>
              ))
            }
          </Select>
        </div>
        <div className="ljc-chn-addhn" onClick={()=>this.showModal(0)}>
          <Card style={{ cursor: "pointer" }} >
            <SVG type="add-o" width="50px" height="50px" />
            <div className="ljc-chn-addtxt">发布荣誉</div>
          </Card>
        </div>
        {
          this.state.data.map(data => (
            <HonorInfo 
              data={data} 
              key={data.uid}  
              belongType={this.state.belongType} 
              showModal={this.showModal} 
              claRender={this.getClaHnData}
            >
            </HonorInfo>
          ))
        }
        
        {
          <div className="ljc-chn-bt" >
            <div className="ljc-chn-btL" >
              <span>共{this.state.total}条数据，每页&nbsp;
                <Select defaultValue={this.state.pageSize} onChange={this.selectChange}>
                  <Option value={20}>20</Option>
                  <Option value={40}>40</Option>
                  <Option value={80}>80</Option>
                  <Option value={100}>100</Option>
                </Select>&nbsp;
                  条</span>
            </div>
            <div className="ljc-chn-btR" >
              <Pagination
                pageSize={this.state.pageSize}
                current={this.state.pageIndex}
                total={this.state.total}
                onChange={this.onChangePagination}
                itemRender={this.itemRender} >
              </Pagination>
            </div>
          </div>
        }

         <Modal 
          className="cjy-modal cjy-hn-modal" 
          destroyOnClose="true" 
          title={`${this.state.pubState===0?'发布':'编辑'}荣誉班级`} 
          footer= {null} visible={this.state.visible} 
          onCancel={this.hideModal}>
         
          <PubHonor 
            hideModal={this.hideModal} 
            uid={this.state.uid} 
            academicYear={this.state.yearDefValue}
            belongType={this.state.belongType} 
            getClaHnData={this.getClaHnData} 
            pubState={this.state.pubState}
          />
        </Modal>
      </div>
    );
  }
}


