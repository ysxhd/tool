/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-30 14:27:56
 * 班级风采组件
 */
import React, { Component } from 'react';
import { Menu, Dropdown, Button, Icon, message, Pagination, Select, Input, Modal, Spin} from 'antd';
import { StuMienListCon, StuPubMien, error, success, confirmDia } from './index.js';
import _x from '../../js/_x/index.js';
import { G } from '../../js/g.js';

import './../../css/student/stuMien.css';

export class StuMien extends Component {
  constructor(props){
    super(props);
    this.state = {
      classId: '',
      showPubDia: false,
      thisPage: 1,
      totalPage: 1,
      totalNum: 0,
      pageSize: 30,
      yearArr: [],
      year: '',
      condition: {
        "classId": this.props.classId,
        "pageIndex": 1,
        "pageSize": 20,
        "year": ''
      },
      mienData: [],
      singleMienData: {
        "id": "",
        "title": "", 
        "content": "",
        "cover": "",
        "createTime": "",
        "images": []
      },
      showSetCover: false,
      singleMienImages: {},
      loadShow: false
    }
  }

  componentWillMount() {

  }

  // 请求学生风采学年信息
  getStuMienYear(){
    let pr = {
      action: 'api/web/monitor_class_for_students/class_style/year'
    }
    _x.util.request.formRequest(pr,(res) =>{
      let yearArr = []
      if(!res.data.length) {
        yearArr = []
      } else {
        yearArr = res.data
      }
      let arr = [];
      for(let i in yearArr){
        // 将学年中的_替换成-
        if(yearArr[i].indexOf("_") > -1 ){
          let y = yearArr[i].replace("_", "-");
          arr.push(y);
        }
      }
      this.setState({
        yearArr: arr,
        year: arr[0]      
      },()=>{
        let year = arr[0];
        if(!year){
          // 传参
          this.getConditionChange({year: ""});
        } else {
          // 传参
          this.getConditionChange({year: yearArr[0]});
        }
      })
    })
  }

  // 显示、关闭发布风采信息弹窗
  showPubMeinDia(obj){
    let status = obj.status;
    if(status){

      if(obj.id){
        // ajax请求单个班级风采
        this.getSingleMienData(obj.id);
        this.setState({
          showPubDia: true
        })
      } else {
        this.setState({
          singleMienData: {
            "id":"",
            "title":"", //班级风采标题
            "content":"",
            "cover":"",
            "createTime":"",
            "images":[]
          }
        }, () =>{
          this.setState({
            showPubDia: true
          })
        })
      }
    } else {
      this.setState({
        showPubDia: false
      })
    }
  }

  // 获取单个风采数据
  getSingleMienData(id){
    let pr = {
      action: 'api/web/monitor_class_for_students/class_style/find_class_style',
      data: {
        "id": id
      }
    }
    _x.util.request.formRequest(pr, (res) => {
      let data = res.data;
      this.setState({
        singleMienData: data
      })
    })
  }
  
  // 获取当前学年该班的班级风采
  getThisYearMienData(obj) {
    // 初始化
    
    this.initState();
    // 显示加载中
    this.setState({
      loadShow: true
    }, () => {
      let pr = {
        action: 'api/web/monitor_class_for_students/class_style/limit_page',
        data: obj
      }
      _x.util.request.formRequest(pr, (res) => {
        this.setState({
          loadShow: false
        },() =>{
          
          this.setState({
            mienData: res.data,
            totalNum: parseInt(res.total)
          })
        })
      })
    })

  }

  // 学年切换
  clickChooseYear(index, e){
    let wid = e.target.clientWidth;
    let year = this.state.yearArr;
    this.setState({
      year: year[index]
    },() =>{
      // 将学年中的-替换成_
      let y = '';
      if(year[index].indexOf("-") > -1 ){
        y = year[index].replace("-", "_");
      }
      this.getConditionChange({year: y});
    })
    let sel = document.querySelector('.lxx-g-mienTab>.lxx-u-select');
    if(!index){
      sel.style.left = '20px';
    } else {
      sel.style.left = (wid + 30) * index + 20 + 'px';
    }
    sel.style.transition = '.3s all';
  }

  // 接收参数更新刷新班级风采列表
  getConditionChange(obj) {
    var t = this.state.condition;
    for (var k in obj) {
        t[k] = obj[k];
    }
    t.classId = this.state.classId;
    this.setState({
      condition: t
    }, () => {
      // 请求当前学年数据
      this.getThisYearMienData(this.state.condition);
    })
  }

  // 初始化班级风采数据
  initState(){
    this.setState({
      mienData: [],
      totalNum: 0
    })
  }

  // 接收风采各项传值并更新入
  getMienDataChange(obj) {
    var t = this.state.singleMienData;
    for (var k in obj) {
        t[k] = obj[k];
    }
    this.setState({
      singleMienData: t
    })
  }

  // 发布、修改班级风采
  publishClassMien(){
    let slmData = this.state.singleMienData;
    if(!slmData.content || !slmData.title){
      error('标题或描述不能为空');
    } else if (!slmData.images.length) {
      error('风采照片不能为空，请至少上传一张照片');
    } else {
      // ajax请求发布
      let pr = {
        action: 'api/web/monitor_class_for_students/class_style/add_or_edit',
        data: {
          "classId": this.props.classId,
          "style": slmData
        }
      }
      _x.util.request.formRequest(pr, (res) => {
        if(res.result){
          this.setState({
            showPubDia: false
          })
          success(res.message);
          // 发布成功后重新请求刷新数数据
          this.getThisYearMienData(this.state.condition);
        } else {
          error('发布失败，请稍后重试');
        }
      })
    }
  }

  // 打开、关闭封面设置弹窗
  handleSetCoverDia(obj){
    let status = obj.status;
    if(status) {
      let pr = {
        action: 'api/web/monitor_class_for_students/class_style/resend_style_images',
        data: {
          "classId": this.props.classId,
          "id": obj.id
        }
      }
      _x.util.request.formRequest(pr, (res) => {
        if(!res.data) {
          this.setState({
            singleMienImages: []
          })
        } else {
          this.setState({
            singleMienImages: res.data
          })
        }
        this.setState({
          showSetCover: true
        })
      })
      
    } else {
      this.setState({
        showSetCover: false
      })
    }
  }

  // 点击设置封面
  handleSetCover(obj) {
    // ajax请求设置封面
    let pr = {
      action: 'api/web/monitor_class_for_students/class_style/set_cover',
      data: obj
    }
    _x.util.request.formRequest(pr, (res) =>{
      let result = res.result;
      if(result) {
        // 重新请求当前页数据
        this.getThisYearMienData(this.state.condition);
      } else {
        error('修改封面失败，请稍后重试');
      }
      this.setState({
        showSetCover: false
      })
    })
    
  }

  // 删除单个班级风采
  handleDetelSingleMien(id){
    confirmDia({
      title: '删除提示',
      content:'确定删除该风采吗？',
      className: 1,
      okText: '删除',
      fnOK: function(){
        let pr = {
          action: 'api/web/monitor_class_for_students/class_style/delete',
          data: {
            "id": id,
            "classId":this.props.classId
          }
        }
        _x.util.request.formRequest(pr, (res) =>{
        
          if(res.result){
            success('删除成功！')
            // 重新请求当前页数据
            this.getThisYearMienData(this.state.condition);
          } else {
            error('删除风采失败，请稍后重试', 2000);
          }
        }, (fail) =>{
          error(fail.message);
        })
      }.bind(this)
    })
  }

  componentDidMount() {
  
  }

  componentDidUpdate() {
    if(this.state.classId !== this.props.classId) {
      this.setState({
        classId: this.props.classId
      },()=>{
        this.getStuMienYear();
      })
    }
  }

  render(){
    let yData = this.state.yearArr;
    let mienData = this.state.mienData;
    let imgArr = this.state.singleMienImages;

    // 页码自定义
    function itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }

    // 每页条数改变
    var setPageSize = function ({ key }) {
      this.setState({
        pageSize: parseInt(key),
        thisPage: 1
      })
      this.getConditionChange({
        pageSize: key,
        pageIndex: 1
      })
    };

    // 页码改变
    var pageChange = function(p) {
      this.setState({
          thisPage: p
      })
      this.getConditionChange({ 
          pageIndex: p 
      });
    }

    var menu = (
        <Menu onClick={setPageSize.bind(this)}>
            <Menu.Item key="10">10</Menu.Item>
            <Menu.Item key="30">30</Menu.Item>
            <Menu.Item key="50">50</Menu.Item>
            <Menu.Item key="100">100</Menu.Item>
        </Menu>
    );

    // 生成班级风采列表
    const element = mienData.length > 0 ?
      mienData.map((item, index) => {
        return(
          <StuMienListCon 
            key={index} 
            item={item}
            showPubMeinDia={this.showPubMeinDia.bind(this,{status: true, id: item.id})}
            handleSetCoverDia={this.handleSetCoverDia.bind(this)}
            handleDetelSingleMien={this.handleDetelSingleMien.bind(this)}></StuMienListCon>
        )
      })
    :
    ''

    return (
      <div> 
        <div className="lxx-g-pubMien">
          <div className="lxx-g-winTop">
            <span className="lxx-u-select">班级风采</span>
          </div>
          <div className="lxx-mien-g-pub">
            <div onClick={this.showPubMeinDia.bind(this, {status: true})}>
              <svg className="icon" aria-hidden="true">
                  <use xlinkHref={"#icon-pubMein" }></use>
              </svg>
              <span>发布班级风采</span>
            </div>
            {/* 发布、修改班风班训弹窗 */}
            <Modal
              title="发布风采"
              visible={this.state.showPubDia}
              width={620}
              maskClosable={false}
              destroyOnClose={true}
              className="lxx-g-dialog left lxx-me-g-pub"
              okText="发布"
              onOk={this.publishClassMien.bind(this)}
              cancelText="取消"
              onCancel={this.showPubMeinDia.bind(this, {status: false})}
            >
             <StuPubMien 
              data={this.state.singleMienData}
              getMienDataChange={this.getMienDataChange.bind(this)}></StuPubMien>
            </Modal>
          </div>
        </div>
        <div className="lxx-g-showMeList">
          {
            yData.length > 0 ?
            <div className="lxx-g-winTop lxx-g-mienTab">
              <p className="lxx-u-select"></p>
              {
                yData.map((item, index) => {
                  return(
                    <span 
                      key={index} 
                      onClick={this.clickChooseYear.bind(this, index)}>{item}学年</span>
                  )
                })
              }
            </div>
            :
            <div className="lxx-g-winTop lxx-g-mienTab" style={{display: 'none'}}></div>
          }
          {
            this.state.loadShow ?
            <div className="lxx-g-mienList">
              <div className="lxx-g-loading">
                <Spin size='large' />
              </div>
            </div>
            :
            mienData.length > 0 ?
            <div className="lxx-g-mienList">
              <div className="lxx-g-mienDetail">
                {element}
              </div>
              {/* 页码 */}
              <div className="lxx-ea-g-page lxx-g-flex-center">
                <div>共<span>{this.state.totalNum}</span>条数据,每页
                  <Dropdown overlay={menu}>
                    <Button style={{ margin: '0 5px', borderRadius: "16px" }}>
                      {this.state.pageSize} <Icon type="down" />
                    </Button>
                  </Dropdown>条
                </div>
                <div className="lxx-m-flex"></div>
                <div className="lxx-ea-m-page">
                  <Pagination 
                    total={this.state.totalNum} 
                    pageSize={this.state.pageSize} 
                    current={this.state.thisPage}
                    onChange={pageChange.bind(this)}
                    defaultCurrent={1}
                    itemRender={itemRender} />
                </div>
              </div>
            </div>
            :
            <div className="lxx-g-mienList">
              <div className="lxx-g-noData">
                <img src={require('../../img/noData.png')} />
                <span>暂无班级风采数据</span>
              </div>
            </div>
          }

          {/* 设置封面 */}
          <Modal
            title="点击设置封面"
            visible={this.state.showSetCover}
            width={600}
            maskClosable={false}
            className="lxx-g-dialog"
            footer={false}
            destroyOnClose={true}
            onCancel={this.handleSetCoverDia.bind(this, {status: false})}
          >
            <div className="lxx-g-cover cjy-clearfix"> 
              { 
                imgArr.images
                ?
                imgArr.images.map((img, index) =>{
                  return(
                    <div key={index} className="lxx-cv-g-each" onClick={this.handleSetCover.bind(this, {id: imgArr.id, cover: img})}>
                      <img src={G.serverUrl + img} />
                    </div>
                  )
                })
                :
                <div>
                  <div className="lxx-g-noData">
                    <img src={require('../../img/noData.png')} />
                    <span>暂无风采图片，请编辑添加</span>
                  </div>
                </div>
              }
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}