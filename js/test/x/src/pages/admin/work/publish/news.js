/*
 * @Author: JCheng.Liu 
 * @Date: 2018-01-17 17:37:29 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 17:29:08
 */
import "../../../../css/admin/news.css";
import React, { Component } from 'react';
import { Panel, IMG } from './../../index';
import { Input, Button, Checkbox, Pagination, Select, Modal  } from "antd";
import { SVG } from "../../../../components/base";
import { AddNew, confirmDia, AdminNew} from "../../../../components/admin/index";
import _x from '../../../../js/_x/index';

const Option = Select.Option;
const Search = Input.Search;

export class News extends Component {
  constructor() {
    super();
    this.state = {
      data: [],//新闻列表
      recommendDefaultColor:'#626a73',//推荐icon 的默认颜色
      recommend:0,          //推荐标记  1为推荐
      recommendClick:false, // 点击只看推荐
      idAll:[],             //全选 所有的新闻 id
      ids:[],               //选中新闻id
      visible:false,       //modal框是否显示
      pageSize: 10,        //默认每页数据条数
      pageIndex:1,         //分页从第一页开始
      total:0,            //总条数
      findBytitle:"",      //查询条件
      addOrEdit:0,          //0添加，1编辑
      chosedId:'',          //当前选中编辑ID
    };

    this.onCheckAll = this.onCheckAll.bind(this);//全选
    this.batchDelNew = this.batchDelNew.bind(this);
    this.handleRecommend = this.handleRecommend.bind(this);//只看推荐
    this.onChangePagination = this.onChangePagination.bind(this);//分页
    this.selectChange = this.selectChange.bind(this);//每页条数选择
    this.NewsListenChange = this.NewsListenChange.bind(this);//单选监听
    this.hideModal = this.hideModal.bind(this);//富文本
    this.getAjaxData = this.getAjaxData.bind(this);//获取新闻列表数据

    this.search = this.search.bind(this);
  }

  componentWillMount(){
    this.getAjaxData(null,null,null,null);
  }

  // 获取新闻列表数据
  getAjaxData(f,r,ps,pi) {
    let _this = this;
    let idAll = [];
    let findBytitle = f || "",
        recommend   = r || this.state.recommend,
        pageSize    = ps|| this.state.pageSize,
        pageIndex   = pi|| this.state.pageIndex;
    let req = {
      action: 'api/web/manager_school_news/show_listnews',
      data: {
        "findBytitle": findBytitle,
        "recommend": recommend ,
        "pageSize": pageSize ,
        'pageIndex': pageIndex ,
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.data){
        let total = rep.total;
        for (let i = 0; i < rep.data.length; i++) {
          idAll.push(rep.data[i].uid)
        }
        _this.setState({
          ids: [],
          data: rep.data,
          idAll: idAll,
          total: total,
          pageIndex: pageIndex,
        })
      }
    })
  }

  // 批量删除新闻
  getDelNews(ids){
    let _this = this;
    let req ={
      action:'api/web/school_web/manager_delete_news',
      data:{
        'uids':ids,
      }
    }
    _x.util.request.formRequest(req,function(rep){
       if(rep.result){
         _this.getAjaxData(null,null,null,1)
      }
    })
  }

  // 搜索
  search(value){
    this.getAjaxData(value,null,null,null);
  }

  //全选
  onCheckAll(e) {
    if (e.target.checked){
      this.setState({
        ids:[...this.state.idAll]
      })
    }else{
      this.setState({
        ids:[]
      })
    }
  }

  // 监听单选
  NewsListenChange(uid,boolean, tab){
    if(boolean){
      this.setState({
        ids:[...this.state.ids,uid]
      })
    }else{
      let newsIds = this.state.ids
      let index = newsIds.indexOf(uid);
      newsIds.splice(index,1);
      this.setState({
        ids: newsIds,
      })
    }
  }

  // 添加新闻
  addNews = () => { 
    this.setState({
      visible: true,
      addOrEdit:0
    });
  }

  hideModal() {
    this.setState({
      visible:false,
      chosedId:''
    })
  }

  // 批量删除
  batchDelNew() {
    confirmDia({
      title: '信息提示',
      content: '确认要删除文件吗？',
      className: 0,
      okText: "删除",
      fnOK: function () {
        this.getDelNews(this.state.ids);
      }.bind(this),
      fnCancel: function () {
      }.bind(this)
    })
  }
  
  // 只看推荐
  handleRecommend(){
    // recommendClick false 不推荐  true 推荐
    // 只看到当前页的推荐？？？
    // 请求中的pi 是当前页的 要回到第一页
    let _this = this;
    if (!_this.state.recommendClick){
      _this.setState({
        recommendDefaultColor:'#ff9934',
        // recommend:1,
        recommendClick:true
      })
      _this.getAjaxData(null, 1, null, 1);
    }else{
      // 取消不看推荐
      _this.setState({
        recommendDefaultColor: '#626a73',
        // recommend:0,
        recommendClick:false
      })
      _this.getAjaxData(null, 0, null, 1);
    }
  }

  // 分页按钮
  itemRender(current, type, originalElement){
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  // 若是10时，选10 value是没值的
  // 下拉框 每次选择有值 则重新拉数据
  selectChange(value){
    if (value) {
      this.setState({
        pageSize:value,
        pageIndex:1,
      });
      this.getAjaxData(null,null,value,null);
    }
  }
 
  /**
   * 分页 
   * @param {*} page      分页当前页码
   * @param {*} pageSize  默认每页多少条数据 也就是this.state.pageSize的值,
   */
  onChangePagination(page,pageSize){
    this.getAjaxData(null, null, pageSize, page)
  };

  /**
   * 获取编辑数据
   */
  getEditInfo = (id) => {
    this.setState({
      chosedId:id,
      visible:true,
      addOrEdit:1
    });
  }

  render() {
    return (
      <Panel>
        <div className="ljc-newcontainer">
          <div className="ljc-news-top">
            <div className="ljc-news-topL">
              <Checkbox onChange={this.onCheckAll} checked={this.state.data.length?this.state.ids.length === this.state.data.length ? true : false:false} >全选</Checkbox>
              <Button onClick={this.addNews}>添加新闻</Button>
              <Button disabled={this.state.ids.length ? false : true} onClick={this.batchDelNew}>批量删除</Button>
            </div>
            <div className="ljc-news-topR" >
              <div className="ljc-news-recommendBox" onClick={this.handleRecommend}>
                <SVG type="choice" width={20} height={20} color={this.state.recommendDefaultColor} />
                <span className="ljc-news-recommend" >只看推荐</span>
              </div>
              <div className="ljc-news-sBox">
                <Search className="ljc-news-tSearch" placeholder="输入搜索条件" onSearch={this.search} enterButton="搜索" />
              </div>
            </div>
          </div>
          {
            this.state.data.length
            ?
              <div className="ljc-news-nListb" >
                {
                  this.state.data.map(data => (
                    <AdminNew 
                      key={data.uid} 
                      data={data} 
                      ids={this.state.ids} 
                      news="news" 
                      NewsListenChange={this.NewsListenChange} 
                      getChildData={this.ChildRecChange} 
                      getEditInfo={this.getEditInfo}
                      newsRender={this.getAjaxData}
                    ></AdminNew>
                  ))
                }
                {
                  <div className="ljc-news-bt" >
                    <div className="ljc-news-btL" >
                      <span>共{this.state.total}条数据，每页&nbsp;
                    <Select defaultValue={this.state.pageSize} onChange={this.selectChange}>
                          <Option value={10}>10</Option>
                          <Option value={20}>20</Option>
                          <Option value={50}>50</Option>
                        </Select>&nbsp;
                    条
                  </span>
                    </div>
                    <div className="ljc-news-btR" >
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
                }
              </div>
            :
              <div className="ljc-news-noData">
                <div>
                  <IMG src={require('../../../../img/noData.png')} width="180px" height="180px" />
                  <div className="ljc-news-txt">暂无相关内容</div>
                </div>
              </div>
          }
        </div>
        <Modal className="cjy-modal cjy-news-modal" destroyOnClose="true" title="编辑新闻" footer={null} visible={this.state.visible} onCancel={this.hideModal}>
            <AddNew chosedId={this.state.chosedId} hideModal={this.hideModal} getAjaxData={this.getAjaxData} addOrEdit={this.state.addOrEdit}/>
        </Modal>
      </Panel>
    );
  }
}
