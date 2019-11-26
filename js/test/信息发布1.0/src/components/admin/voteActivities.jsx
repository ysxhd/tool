/*
 * @Author: JCheng.Liu 
 * @Date: 2018-01-12 16:16:24 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 17:22:13
 * 投票
 */
import "../../css/admin/voteActivities.css";
import React, { Component } from 'react';
import { SVG, IMG } from '../base';
import { Button, Checkbox, Pagination, Select, Tabs, Modal} from "antd";
import { confirmDia, AdminNew, VoteCount} from './index.js';
import VotePubEdit from './votePubEdit';
import _x from '../../js/_x/index';
const Option = Select.Option;

export class VoteActivities extends Component {
  constructor() {
    super();
    this.state = {
      data: [],              // 数据集
      idsVote: [],           // 投票id 单选用
      voteIdAll: [],         // 全选
      pageSize: 10,          // 默认每页10条数据
      vamodal:false,         // 投票趋势图 modal
      pageIndex:1,           // 默认在第一页
      total:0,               // 总条数
      vTrendData:[],         // 投票趋势图data
      voteModal:false,//发布投票 modal
    }
    this.onCheckAllVote = this.onCheckAllVote.bind(this);           //投票全选
    this.voteListenChange = this.voteListenChange.bind(this);       // 监听单选
    this.releaseVote = this.releaseVote.bind(this);                 // 发布投票
    this.voteBatchDelAc = this.voteBatchDelAc.bind(this);           //投票批量删除按钮
    this.trend = this.trend.bind(this);                             // 投票趋势图 props 传递
    this.selectChange = this.selectChange.bind(this);               // 下拉框选择每页条数
    this.onChangePagination = this.onChangePagination.bind(this);   // 分页
    this.getAjaxData = this.getAjaxData.bind(this);                 // 获取数据
    this.voteHideModal = this.voteHideModal.bind(this);   
    this.getAjaxTrend = this.getAjaxTrend.bind(this);
  }

  componentDidMount(){
    this.getAjaxData(null,null,null);
  }


  // ajax拿数据
  getAjaxData(ac,ps, pi){
    let _this = this;
    let data = [];
    let voteIdAll = [];
    let action    = ac || 'api/web/manager_school_activity/find_activities',
        pageSize  = ps || this.state.pageSize,
        pageIndex = pi || this.state.pageIndex;
    let req = {
      action: action,
      data: {
        "type": "1",
        "pageIndex": pageIndex,
        "pageSize": pageSize,
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.data){
        let total = rep.total;
        for (let i = 0; i < rep.data.length; i++) {
          voteIdAll.push(rep.data[i].id)
        }
        _this.setState({
          // 清空ids 单选的id
          idsVote: [],
          data: rep.data,
          voteIdAll: voteIdAll,
          total: total,
          pageIndex: pageIndex,
        })
      }
    })
  }

  // 投票批量删除
  getBatchDel(type){
    let _this = this;
    let ids = this.state.idsVote;
    let req = {
      action: 'api/web/manager_school_activity/delete_activities',
      data: {
        "id": ids,
        "type": type
      }
    }
    _x.util.request.formRequest(req,function(rep){
      if(rep.result){
        _this.setState({
          idsVote:[],
          voteIdAll:[],
        }, _this.getAjaxData(null, null, 1))
      }
    })
  }

  // 投票全选
  onCheckAllVote(e) {
    if (e.target.checked) {
      this.setState({
        idsVote: [...this.state.voteIdAll],
        voteModalView: false,
      })
    } else {
      this.setState({
        idsVote: [],
        voteModalView: false,
      })
    }
  }

  // 单选
  voteListenChange(id, boolean) {
    if (boolean) {
      this.setState({
        idsVote: [...this.state.idsVote, id],
        voteModalView: false,
      })
    } else {
      let newsIds = this.state.idsVote;
      let index = newsIds.indexOf(id);
      newsIds.splice(index, 1);//在原有的列表中删除自身
      this.setState({
        idsVote: newsIds,
        voteModalView: false,
      })
    }
  }

  // 发布投票
  releaseVote(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      voteModal: true,
    })
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

  // 投票批量删除
  voteBatchDelAc = () => {
    confirmDia({
      title: '信息提示',
      content: '确认要删除文件吗？',
      className: 0,
      okText: "删除",
      fnOK: function () {
        this.getBatchDel(1);
      }.bind(this),
      fnCancel: function () {
      }.bind(this)
    })
  }

  // 投票趋势图
  trend(id) {
    this.setState({
      vamodal: true
    },
    this.getAjaxTrend(id))
  }

  // 趋势图ajax
  getAjaxTrend(id){
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/vote/vote_statistics',
      data: {
        "id": id
      }
    };
    _x.util.request.formRequest(req, function (rep) {
      if(rep==null){
        
      }else{
        _this.setState({
          vTrendData: rep.data,
        })
      } 
    })
  }

  // 选择每页条数
  selectChange(value) {
    if (value) {
      this.setState({
        pageSize: value,
        pageIndex: 1,
      });
      this.getAjaxData(null,value,1);
    }
  }

  // 分页
  onChangePagination(page, pageSize) {
    this.getAjaxData(null, pageSize,page)
  }

  voteHideModal(){
    
    this.setState({
      voteModal:false
    })
    
  }

  render() {
    return (
      <div>
        <div className="ljc-va-container" >
          <div className="ljc-va-t" >
            <Checkbox onChange={this.onCheckAllVote} checked={this.state.data.length ?this.state.idsVote.length === this.state.data.length ? true : false:false} >全选</Checkbox>
            <Button onClick={this.releaseVote} >发布投票</Button>
            <Button disabled={this.state.idsVote.length ? false : true} onClick={this.voteBatchDelAc} >批量删除</Button>
          </div>
          {
            this.state.data.length
            ?
              <div>
                <div>
                  {
                    this.state.data.map(data => (
                      <AdminNew 
                        data={data} 
                        key={data.id}
                        ids={this.state.idsVote} 
                        vote="vote" 
                        voteListenChange={this.voteListenChange} 
                        voteTrend={this.trend} 
                        voteRender={this.getAjaxData} 
                      >
                      </AdminNew>
                    ))
                  }
                </div>
                <div className="ljc-va-bt" >
                  <div className="ljc-va-btL" >
                    <span>共{this.state.total}条数据，每页&nbsp;
                  <Select defaultValue={this.state.pageSize} onChange={this.selectChange} >
                        <Option value={10}>10</Option>
                        <Option value={20}>20</Option>
                        <Option value={50}>50</Option>
                      </Select>&nbsp;条
                </span>
                  </div>
                  <div className="ljc-va-btR" >
                    <Pagination
                      defaultCurrent={1}
                      pageSize={this.state.pageSize}
                      current={this.state.pageIndex}
                      total={this.state.total}
                      onChange={this.onChangePagination}
                      itemRender={this.itemRender} >
                    </Pagination>
                  </div>
                </div>
              </div>
            :
              <div className="ljc-va-noData">
                <div>
                  <IMG src={require('../../img/noData.png')} width="180px" height="180px" />
                  <div className="ljc-va-txt">暂无相关内容</div>
                </div>
              </div>
          }
        </div>
        <Modal 
          className="ljc-vpe-modal" 
          destroyOnClose="true"
          title="发布投票" footer={null} 
          visible={this.state.voteModal} 
          onCancel={() => this.setState({ voteModal: false, choiceAdrVis: false })}  >
          
          <VotePubEdit 
            voteHideModal={this.voteHideModal}
            renderLoad={this.getAjaxData} 
          />
        </Modal>
        {/* 投票趋势图modal */}
        <Modal 
          className="ljc-va-tm" 
          destroyOnClose="true"
          visible={this.state.vamodal} 
          footer={null} title="投票统计" 
          onCancel={() => this.setState({ vamodal: false })} >
          
          <VoteCount 
            data={this.state.vTrendData}
          />
        </Modal>
      </div>
    );
  }
}