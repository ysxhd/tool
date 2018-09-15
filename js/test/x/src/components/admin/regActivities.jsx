/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:01:13 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 17:27:46
 * 投票和报名信息展示组件
 */
import '../../css/admin/regActivities.css';
import React, { Component } from 'react';
import { Input, Button, Checkbox, Select, Modal, Pagination} from "antd";
import { SVG,IMG } from "../base";
import RegPubEdit from './regPubEdit';
import { confirmDia, RegCount, AdminNew} from './index.js';
import _x from '../../js/_x/index';
const Option = Select.Option;

export class RegActivities extends Component {

  constructor(){
    super();
    this.state = {
      data: [],              // 数据集
      idsSingUp: [],         // 报名id 单选用
      id:[],                 // 趋势图 id
      regIdAll: [],           // 全选 id
      pageSize: 10,          // 默认每页10条数据
      rgmodal: false,        // 报名 趋势图modal 
      regModalView:false,    // 发布报名modal
      pageIndex:1,           // 默认分页第一页开始
      total:0,             // 总条数
      regTdata:[],    // 统计图的数据
    }

    this.onCheckAllSignUp = this.onCheckAllSignUp.bind(this);       // 报名全选

    this.regListenChange = this.regListenChange.bind(this);               // 监听单选

    this.releaseSignUp = this.releaseSignUp.bind(this);             // 发布报名

    this.regBatchDelAc = this.regBatchDelAc.bind(this);             // 报名批量删除按钮

    this.trend = this.trend.bind(this);                             // 趋势图 AdminNews props传递

    this.selectChange = this.selectChange.bind(this);               // 下拉选择框

    this.onChangePagination = this.onChangePagination.bind(this);   // 分页

    this.getAjaxData = this.getAjaxData.bind(this);               // ajax 拿数据列表 

    this.regHideModal = this.regHideModal.bind(this);             //报名发布modal

    this.getRegTrend = this.getRegTrend.bind(this);
  }

  componentDidMount() {
    this.getAjaxData(null,null,null)
  }

  // ajax 拿数据
  getAjaxData(ac, ps, pi) {
    let _this = this,
        data = [],
        regIdAll  = [],
        action    = ac || 'api/web/manager_school_activity/find_activities',
        pageSize  = ps || this.state.pageSize,
        pageIndex = pi || this.state.pageIndex;
    let req = {
      action: action,
      data: {
        "type": "2",
        "pageIndex": pageIndex,
        "pageSize": pageSize,
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      let total = rep.total;
      if (rep.result){
        for (let i = 0; i < rep.data.length; i++) {
          regIdAll.push(rep.data[i].id)
        }
        _this.setState({
          // 清空单选的ids
          idsSingUp: [],
          data: rep.data,
          regIdAll: regIdAll,
          total: total,
          pageIndex: pageIndex,
        })
      }
    })
  }

  // ajax 拿 统计图数据
  getRegTrend(id){
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/sign/sign_statistics',
      data: {
        "id": id
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.setState({
          regTdata: rep.data,
        })
      }
    })
  }

  // 批量删除
  regDel(){
    let _this = this;
    let ids = this.state.idsSingUp;
    let req={
      action:'api/web/manager_school_activity/delete_activities',
      data:{
        "id": ids,
        "type":2
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.setState({
          idsSingUp: [],
          regIdAll: [],
        }, _this.getAjaxData(null, null, 1))
      }
    })
  }

  // 报名全选
  onCheckAllSignUp(e) {
    if (e.target.checked) {
      this.setState({
        idsSingUp: [...this.state.regIdAll],
        regModalView: false, // 点击全选会出现发布modal  未知原因 
      })
    } else {
      this.setState({
        idsSingUp: [],
        regModalView:false, // 点击全选会出现发布modal  未知原因
      })
    }
  }

  // 单选
  regListenChange(id, boolean) {
    if (boolean) {
      this.setState({
        idsSingUp: [...this.state.idsSingUp, id],
        regModalView: false, // 点击全选会出现发布modal  未知原因
      })
    } else {
      let newsIds = this.state.idsSingUp;
      let index = newsIds.indexOf(id);
      newsIds.splice(index, 1);//在原有的列表中删除自身
      this.setState({
        idsSingUp: newsIds,
        regModalView: false, // 点击全选会出现发布modal  未知原因
      })
    }
  }

  // 报名批量删除
  regBatchDelAc = () => {
    confirmDia({
      title: '信息提示',
      content: '确认要删除文件吗？',
      className: 0,
      okText: "删除",
      fnOK: function () {
        this.regDel();
      }.bind(this),
      fnCancel: function () {
      }.bind(this)
    })
  }

  //发布报名
  releaseSignUp(){
    this.setState({
      regModalView:true
    })
  }

  // 报名趋势图
  trend(id){
    // 报名趋势图modal 显示
    this.setState({
      rgmodal:true
    },this.getRegTrend(id))
  }

  // 下拉框选择每页条数
  selectChange(value) {
    if (value) {
      this.setState({
        pageSize: value,
        pageIndex: 1,
      });
      this.getAjaxData(null,value,1);
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
    // 重写mock数据
    let data = [];
    let idAll = [];
    let pageSizeLength = this.state.pageSize;
    this.getAjaxData(null, pageSize, page)
  }

  regHideModal = () =>{
    this.setState({
      regModalView:false,
    })
  }
  render(){
    return (
      <div className="ljc-ra-container" >
        <div className="ljc-ra-t" >
          {/* 应该 = 当前页的所有新闻条数 */}
          <Checkbox onChange={this.onCheckAllSignUp} checked={this.state.data.length ?this.state.idsSingUp.length === this.state.data.length ? true : false:false} >全选</Checkbox>
          <Button onClick={this.releaseSignUp} >发布报名</Button>
          <Button disabled={this.state.idsSingUp.length ? false : true} onClick={this.regBatchDelAc} >批量删除</Button>
        </div>
        {
          this.state.data.length
          ?
            <div>
              {
                this.state.data.map(data => (
                  <AdminNew 
                    data={data} 
                    key={data.id} 
                    ids={this.state.idsSingUp} 
                    reg="reg" 
                    regListenChange={this.regListenChange} 
                    regTrend={this.trend} 
                    getRegDataBack={this.getRegDataBack} 
                    regRender={this.getAjaxData}
                  >
                    </AdminNew>
                ))
              }
              {
                <div className="ljc-ra-bt" >
                  <div className="ljc-ra-btL" >
                    <span>共{this.state.total}条数据，每页&nbsp;
                  <Select defaultValue={this.state.pageSize} onChange={this.selectChange}>
                        <Option value={10}>10</Option>
                        <Option value={20}>20</Option>
                        <Option value={50}>50</Option>
                      </Select>&nbsp;
                  条</span>
                  </div>
                  <div className="ljc-ra-btR" >
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
            </div>
          :
            <div className="ljc-ra-noData">
              <div>
                <IMG src={require('../../img/noData.png')} width="180px" height="180px" />
                <div className="ljc-ra-txt">暂无相关内容</div>
              </div>
            </div>
        }
        
        {/* 报名发布 */}
        <Modal 
          className="ljc-rpe-modal" 
          title="发布报名" footer={null} 
          destroyOnClose="true"
          visible={this.state.regModalView}  
          onCancel={() => this.setState({ regModalView: false, choiceAdrVis: false })}  >

          <RegPubEdit regHideModal={this.regHideModal} renderLoad={this.getAjaxData}  />
        </Modal>
        {/* 报名趋势图 */}
        <Modal 
          className="ljc-ra-tm" 
          visible={this.state.rgmodal} 
          footer={null} title="报名统计" 
          onCancel={() => this.setState({ rgmodal:false})} >
          <RegCount data={this.state.regTdata}  />
        </Modal>
      </div>
    );
  }
}