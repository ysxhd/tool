/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:29:56 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 17:07:17
 * 学生风采内
 */
import React, { Component } from 'react';
import { StoryStyleInfo, StoryStyleInPic, StoryEditPic, PreviewPic, confirmDia} from './index';
import {Checkbox, Button, Select, Pagination, Modal} from 'antd';
import MaskLayer from '../shared/maskLayer';
import _x from '../../js/_x/index';
import {G} from '../../js/g.js';
import '../../css/admin/storyIn.css';

const Option = Select.Option;

export class StuStyleIn extends Component {
  constructor(){
    super();
    this.state = {
      data:{},              //头部信息
      picData:[],           //图片数据
      // pageSize:20,          //数据每页条数
      editVisible:false,    //事记编辑框是否可见
      disabled: true,       //批量删除按钮是否禁用
      ids: [],              //选中的日常通知id
      idAll:[],             //所有Id，用于全选
      current:1,            //当前页数
      picSrc:'',            //图片预览url
      picSrcList:'',        //图片src列表
      uid:'',               //要编辑的图片id
    };
    this.uid = '';          //详细查询的id
    this.selectNumArr = [10,20,50,100];
    this.srcIndex = 0;      //当前展示src
    this.pageSize = 20;     //数据每页条数
  };
  
  componentDidMount(){
    if(this.props.match.params.uid){
      this.uid = this.props.match.params.uid;
    }
    this.getData();
    this.getPicData(1);
  };
  
  /**
   * 获取事记风采内页头部信息
   */
  getData = () => {
    let req = {
      action:'api/web/information/manager_deed/find',
      data:{
        uid:this.uid
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        let data = {
          uid:ret.data.uid,
          title:ret.data.title,
          recordDate:_x.util.date.format(new Date(ret.data.recordDate), 'yyyy-MM-dd HH:mm'),
          description:ret.data.description,
          coverAddress:ret.data.coverAddress?G.serverUrl+ret.data.coverAddress:'',
          total:ret.data.total
        };
        this.setState({
          data: data
        });
      }
    });
  };
  
  /**
   * 获取图片列表
   */
  getPicData = (page) => {
    let picData = [];
    let idAll = [];
    let picSrcList = [];
    let req = {
      action:'api/web/information/manager_deed/picture_page',
      data:{
        uid:this.uid,
        pageIndex:page,
        pageSize:this.pageSize
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.total = ret.data.totalElements;
        ret.data.pageContent.map(dt=>{
          let pictureAddress = dt.pictureAddress?G.serverUrl + dt.pictureAddress:'';
          picData.push({
            uid:dt.uid,
            title:dt.picTitle,
            pictureAddress,
            isCover:dt.isCover===1?true:false
          });
          picSrcList.push(pictureAddress);
          if(dt.isCover!==1){
            idAll.push(dt.uid);
          }
        });
        this.setState({
          picData,
          idAll,
          picSrcList
        });
      }
    });
  };
  
  /**
   * 每页多少条
   */
  sltChange = (value) => {
    this.setState({
      // pageSize: value,
      current:1
    });
    this.pageSize = value;
    this.getPicData(1);
  };
  
  /**
   * 页数改变
   */
  onChange = (page) => {
    this.setState({
      current:page
    });
    this.getPicData(page);
  };
  
  /**
   * 上一页下一页样式
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
   * 隐藏编辑框
   */
  hideModalEdit = () => {
    this.setState({
      editVisible:false
    });
  };
  
  /**
   * 显示编辑框
   */
  showModalEdit = (uid) => {
    this.setState({
      editVisible:true,
      uid
    });
  };

  /**
   * 全选
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
   * 选中列表改变
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
  };

  /**
   * 预览图片
   */
  preview = (index) => {
    this.refs.myMask.show();
    this.srcIndex = index;
    this.setState({
      preVis:true,
      picSrc:this.state.picSrcList[this.srcIndex]
    });
  };

  /**
   * 隐藏图片预览
   */
  hidePre = () => {
    this.refs.myMask.close();
    this.setState({
      preVis:false
    });
  };

  /**
   * 下一张
   */
  nextPic = () => {
    if(this.srcIndex===this.state.picSrcList.length - 1){
      this.srcIndex = 0;
    }else{
      this.srcIndex++;
    }
    this.setState({
      picSrc:this.state.picSrcList[this.srcIndex]
    });
  };

  /**
   * 上一张
   */
  lastPic = () => {
    if(this.srcIndex===0){
      this.srcIndex = this.state.picSrcList.length - 1;
    }else{
      this.srcIndex--;
    }
    this.setState({
      picSrc:this.state.picSrcList[this.srcIndex]
    });
  };

  /**
   * 批量删除按钮
   */
  delMore = () => {
    confirmDia({
      title:'信息提示',
      content:'确定要删除选中照片吗？',
      className:0,
      okText:'确定',
      fnOK:() => {
        let req = {
          action:'api/web/information/manager_deed/delete_picture',
          data:{
            ids:this.state.ids
          }
        };
        _x.util.request.formRequest(req,(ret)=>{
          if(ret.result){
            this.getPicData(1);
          }
        });
      },
      fnCancel:() => {
      }
    })
  }
  
  render(){
    return (
      <div className="cjy-si"> 
        <StoryStyleInfo getPicData={this.getPicData} data={this.state.data} getData={this.getData} type="3"/>
        <div className="cjy-si-picDiv">
          <div className="cjy-si-checkLine">
            <Checkbox onChange={ this.checkAll } checked={ this.state.ids.length === this.state.idAll.length ? true : false }>全选</Checkbox>
            <Button disabled={this.state.ids.length===0?true:false} onClick={this.delMore}>批量删除</Button>
          </div>
          <div>
            {
              this.state.picData.map((pd,index) => (
                <div className="cjy-si-picBox" key={pd.uid} onClick={()=>this.preview(index)}>
                  <StoryStyleInPic  getPicData ={this.getPicData} picData={pd} showModalEdit={this.showModalEdit} ids={this.state.ids} listOnChange={this.listOnChange} getPicData={this.getPicData} getData={this.getData}/>
                </div>
              ))
            }
          </div>
          <div className="cjy-si-pageBox">
            <div className="cjy-si-selectPgsz">
              <span>共{this.total}条数据，每页</span>
              <Select defaultValue={this.selectNumArr[1]} style={{width: 80}} onChange={ this.sltChange }>
                {
                  this.selectNumArr.map(slt => (
                    <Option key={slt} value={slt}>{slt}</Option>
                  ))
                }
              </Select>
              <span>条</span>
            </div>
            <Pagination 
              current={this.state.current} 
              // defaultPageSize={this.selectNumArr[1]} 
              pageSize={this.pageSize}
              total={this.total} 
              onChange={this.onChange} 
              itemRender={this.itemRender}></Pagination>
          </div>
        </div>
        <Modal className="cjy-modal" destroyOnClose="true" title="编辑照片信息" footer={null} visible={this.state.editVisible} onCancel={this.hideModalEdit}>
          <StoryEditPic hideModalEdit={this.hideModalEdit} getPicData={this.getPicData} uid={this.state.uid}/>
        </Modal>
        <MaskLayer ref="myMask"/>
        {
          this.state.preVis
          ? <PreviewPic src={this.state.picSrc} hidePre={this.hidePre} nextPic={this.nextPic} lastPic={this.lastPic}/>
          : ''
        }
      </div>
    );
  }
}