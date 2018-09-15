/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:12:28 
 * @Last Modified by: JudyC
 * @Last Modified time: 2018-03-20 14:29:04
 * 校园事迹外
 */
import React, { Component } from 'react';
import { SchoolStory, PubStoryStyle, EditStoryStyle, SetCover } from './index';
import { SVG } from '../base';
import { Pagination, Select, Modal } from 'antd';
import MaskLayer from '../shared/maskLayer';
import _x from '../../js/_x/index';
import {G} from '../../js/g.js';
import '../../css/admin/storyOut.css';

const Option = Select.Option;

export class StoryOut extends Component {
  constructor(){
    super();
    this.state = {
      data:[],          //校园大事记数据
      visible:false,    //modal
      // pageSize: 20,     //数据每页条数 注：此处由于有常驻，传后台时需减1
      pssVisible:false, //modal框是否可见
      editVisible:false,//事记编辑框是否可见
      setVisible:false, //封面设置框是否可见
      current:1,        //当前页数
      uid:'',           //当前事记id
    };
    this.total = 0;
    this.selectNumArr = [20,40,60,80,100];
    this.pageSize = 20; //数据每页条数 注：此处由于有常驻，传后台时需减1
  }

  componentDidMount(){
    this.getData(1);
  };

  /**
   * 获取事记数据
   */
  getData = (page) => {
    this.setState({
      current:page
    });
    let req = {
      action:'api/web/information/manager_deed/findAll',
      data:{
        pageIndex:page,
        pageSize:this.pageSize - 1,          //有一条常驻数据，请求为4n - 1
        type:1
      }
    };
    _x.util.request.formRequest(req,(ret)=>{
      if(ret.result){
        this.total = ret.data.totalElements;
        let data = [];
        ret.data.pageContent.map(dt=>{
          data.push({
            uid:dt.uid,
            title:dt.title,
            recordDate:_x.util.date.format(new Date(dt.recordDate), 'yyyy-MM-dd HH:mm'),
            description:dt.description,
            coverAddress:dt.coverAddress?G.serverUrl+dt.coverAddress:''
          });
        });
        this.setState({
          data: data
        });
      }
    });
    // let data = [];
    // for(let i=(page - 1)*pageSize;i<(page - 1)*pageSize+pageSize;i++){
    //   data.push({
    //     id:i,
    //     title:'大事记'+ i,
    //     recordDate:'2017-10-1 10:40',
    //     description:'大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介大事记简介' + i,
    //     coverAddress:''
    //   });
    // };
    // this.total = 50;
    // this.setState({
    //   data: data
    // });
  }

  /**
   * 每页多少条
   */
  sltChange = (value) => {
    this.setState({
      // pageSize: value,
      current:1
    });
    this.pageSize = value;
    this.getData(1);
  };

  /**
   * 页数改变
   */
  onChange = (page) => {
    this.getData(page);
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
  }

  /**
   * 编辑事记
   */
  editStory = () => {
    this.refs.myMask.show();
    this.setState({
      pssVisible:true
    });
  };

  /**
   * 隐藏发布弹框
   */
  hideModalPss = () => {
    this.refs.myMask.close();
    this.setState({
      pssVisible:false
    });
  }

  /**
   * 隐藏编辑弹框
   */
  hideModalEdit = () => {
    this.setState({
      editVisible:false
    });
  };

  /**
   * 显示编辑弹框
   */
  showModalEdit = (uid) => {
    this.setState({
      editVisible:true,
      uid
    });
  };

  /**
   * 显示设置封面弹框
   */
  showModalSet = (uid) => {
    this.setState({
      setVisible:true,
      uid
    });
  };

  /**
   * 隐藏设置封面弹框
   */
  hideModalSet = () => {
    this.setState({
      setVisible:false
    });
  };

  mouseLeave=()=>{
    this.setState({
      editVisible: false
    })
  }

  render(){
    return (
      <div className="cjy-so" > 
        <div className="cjy-so-pubBox">
          <div className="cjy-so-pubBoxIn" onClick={this.editStory}>
            <SVG type="add-o"/>
            <div>发布大事记</div>
          </div>
        </div>
        {
          this.state.data.map(dt => (
            <SchoolStory key={dt.uid} data={dt} showModalEdit={this.showModalEdit} showModalSet={this.showModalSet} getData={this.getData} />
          ))
        }
        <div className="cjy-so-bottom">
          <div className="cjy-so-selectPgsz">
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
            className="kyl-so-footer" 
            current={this.state.current} 
            // defaultPageSize={this.selectNumArr[0]} 
            pageSize={this.pageSize}
            total={this.total} 
            onChange={this.onChange} 
            itemRender={this.itemRender}>
          </Pagination>
        </div>
        <MaskLayer ref="myMask"/>
        {
          this.state.pssVisible
          ? <PubStoryStyle hideModalPss={this.hideModalPss} getData={this.getData} type="1"/>
          : ''
        }
        <Modal className="cjy-modal" destroyOnClose="true" title="编辑事记信息" footer={null} visible={this.state.editVisible} onCancel={this.hideModalEdit}>
          <EditStoryStyle hideModalEdit={this.hideModalEdit} type="1" uid={this.state.uid} getData={this.getData}/>
        </Modal>
         <Modal className="cjy-modal" destroyOnClose="true" title="设置封面" footer={null} visible={this.state.setVisible} onCancel={this.hideModalSet}>
          <SetCover getData={this.getData} hideModalSet={this.hideModalSet} uid={this.state.uid}/>
        </Modal>
      </div>
    );
  }
}