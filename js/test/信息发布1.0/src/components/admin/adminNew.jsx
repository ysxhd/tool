/*
 * @Author: JudyC 
 * @Date: 2018-01-05 09:58:44 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 17:24:00
 * 新闻组件
 */
import '../../css/admin/adminNew.css';
import React, { Component } from 'react';
import {Panel, IMG } from './../base';
import { Input, Button, Checkbox, Modal } from "antd";
import { SVG } from "../base";
import { confirmDia, RegCount, error, success} from './index.js'
import RegPubEdit from './regPubEdit';
import VotePubEdit from './votePubEdit';
import _x from '../../js/_x/index';
import { G } from '../../js/g';

export class AdminNew extends Component {

  constructor(props){
    super(props);
    this.state = {
      data:[],//接收数据 
      // toolTipView:'none', //工具栏 显示/隐藏
      newsChecked:false,  //新闻的单选是否选中
      voteChecked:false,  //投票的单选
      regChecked:false,   //报名的单选
      uid:"",             //新闻活动id
      rid:'',
      vid:'',
      recommend:0,
      voteVisible: false, //发布报名 modal
      regVisible:false,   //发布报名modal

      voteBackData:[],    // 投票编辑回显数据
      regBackData:[],     // 报名编辑回显数据
    }
    this.voteListenChange = this.voteListenChange.bind(this); //投票监听单选
    this.NewsListenChange = this.NewsListenChange.bind(this); //新闻监听单选
    this.regListenChange  = this.regListenChange.bind(this);   // 报名监听单选

    this.iDelList   = this.iDelList.bind(this);//删除 
    this.voteTrend  = this.voteTrend.bind(this);//投票趋势按钮
    this.regTrend   = this.regTrend.bind(this);//报名趋势按钮
    this.recommend  = this.recommend.bind(this);//操作栏 推荐
    this.getDelNews = this.getDelNews.bind(this); //删除新闻

    this.getDel = this.getDel.bind(this);//删除 投票 / 报名

    this.voteEdit = this.voteEdit.bind(this);
    this.regEdit = this.regEdit.bind(this); //报名编辑 数据回显

    this.voteHideModal = this.voteHideModal.bind(this);
    this.regHideModal = this.regHideModal.bind(this);

    this.voteRenderLoad = this.voteRenderLoad.bind(this);
    this.regRenderLoad = this.regRenderLoad.bind(this);
}    

  componentWillMount(){
    this.setState({
      //推荐新闻
      recommend: this.props.data.recommend,
    })
  }

  componentWillReceiveProps(newProps){
    // uid 不在 ids 的列表中的话，则单选不选中
    if (newProps.data.uid){
      if (newProps.ids.indexOf(newProps.data.uid) === -1) {
        this.setState({
          newsChecked: false,
        })
      } else {
        this.setState({
          newsChecked: true,
        })
      }
    } else if (newProps.data.id){
      if (newProps.ids.indexOf(newProps.data.id) === -1) {
        this.setState({
          voteChecked: false,
          regChecked:false,
        })
      } else {
        this.setState({
          voteChecked: true,
          regChecked:true
        })
      }
    }
  }
 
  // 删除新闻方法
  getDelNews(id) {
    let _this = this;
    let req = {
      action: 'api/web/school_web/manager_delete_news',
      data: {
        'uids': id,
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        // 重新渲染
        _this.props.newsRender('', '', '', 1)
      }
    })
  }

  // 删除投票/报名
  getDel(type, id) {
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/delete_activities',
      data: {
        "id": id,
        "type": type
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (type === 1) {
        if (rep.result) {
          _this.props.voteRender(null, null, 1);
        } else {
          error(null, 1500)
        }
      } else if (type === 2) {
        if (rep.result) {
          _this.props.regRender(null, null, 1);
        } else {
          error(null, 1500)
        }
      }
    })
  }

  // 投票编辑回显
  getVoteBack(id){
    let _this = this;
    let req = {
      action: 'api/web/manager_school_activity/vote/find_vote_activity_by_id',
      data: {
        "id": id
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.setState({
          // title: rep.data.title, //标题
          // startTime: rep.data.startTime,//时间
          // endTime: rep.data.endTime,
          // content: rep.data.content,
          // disabled: rep.data.status === 0 ? false : true,
          // isPublic: rep.data.isPublic === 0 ? false : true,
          // voteType: rep.data.voteType === 0 ? 0 : 1,
          // status: rep.data.status
          // 选项 choice  choiceName内容  choiceOrder 位置 
          voteBackData: rep.data
        })
        // _this.addLengthFun(rep.data.choice.length - 2)
      }
    })
  }

  // 重新渲染
  voteRenderLoad(){
    this.props.voteRender(null,null,null)
  }

  // 重新渲染
  regRenderLoad(){
    this.props.regRender(null,null,null)
  }

  // 投票监听单选
  voteListenChange(e){
    this.props.voteListenChange(this.props.data.id, e.target.checked)  
  }

  //新闻监听单选 
  NewsListenChange(e){
    this.props.NewsListenChange(this.props.data.uid, e.target.checked)  
  }

  regListenChange(e){
    this.props.regListenChange(this.props.data.id, e.target.checked)  
  }

  // 删除
  iDelList(){
    confirmDia({
      title: '信息提示',
      content: '确认要删除该文件吗？',
      className: 0,
      okText: "删除",
      fnOK: function () {
        let id = [];
        id.push(this.props.data.id)
        if (this.props.news){
          // 删除新闻
          let uid = [];
          uid.push(this.props.data.uid)
          this.getDelNews(uid)
        } else if (this.props.vote){
          // 删除投票
          this.getDel(1,id)
        }else if(this.props.reg){
          // 删除报名
          this.getDel(2,id)
        }
      }.bind(this),
      fnCancel: function () {
      }.bind(this)
    })
  }
  
  // 投票趋势图
  voteTrend = (e) => {
    this.props.voteTrend( this.props.data.id )
  }

  // 报名趋势图
  regTrend = (e) => {
    this.props.regTrend(this.props.data.id)
  }

  // 报名编辑，数据回显
  regEdit(){
    this.setState({
      regVisible:true,
    })
  }

  // 投票编辑，数据回显
  voteEdit(){
    this.setState({
      voteVisible:true
    },this.getVoteBack(this.props.data.id))
  }

  //操作栏 推荐 
  recommend = () => {
    // 拿到每条新闻的 uid 
    let _this = this;
    let req ;
    if (this.state.recommend === 0 ){
      req = {
        action: 'api/web/manager_school_web/recommend_news',
        data: {
          'uid': this.props.data.uid,
          'recommend': 1
        }
      }
      this.setState({
        recommend:1,
      })
    } else if (this.state.recommend === 1 ){
      req = {
        action: 'api/web/manager_school_web/recommend_news',
        data: {
          'uid': this.props.data.uid,
          'recommend': 0
        }
      }
      this.setState({
        recommend: 0,
      })
    }
    _x.util.request.formRequest(req,function(rep){
      
    })
  }

  
  regHideModal(){
    this.setState({
      regVisible:false
    })
  }

  voteHideModal(){
    this.setState({
      voteVisible: false
    })
  }

  render(){
    const toolTipShowHide = {
      display:this.state.toolTipView,
    }
    return (
      <div className="ljc-news-container" >
        
        <span className="ljc-news-choice">
        {
          // 三个状态  第一个 news  第二个vote   第三个reg
          this.props.data.uid
          ?
              <Checkbox checked={this.state.newsChecked} onClick={this.NewsListenChange}></Checkbox>
          :
          this.props.vote === "vote"
          ?
          <Checkbox checked={this.state.voteChecked} onClick={this.voteListenChange}></Checkbox>
          :
          <Checkbox checked={this.state.regChecked} onClick={this.regListenChange}></Checkbox>
        }
        </span>
      
        {
          this.props.data.cover_pic 
          ? 
          <div className="ljc-news-newsPic" >
            {/* <img className="ljc-news-coverpic" src={this.state.data.cover_pic} alt="" /> */}
              <img className="ljc-news-coverpic" src={`${G.serverUrl}`+ this.props.data.cover_pic} alt="" />
          </div> 
          : 
          <div className="ljc-news-noPicBor" ></div>
        }
        <div className="ljc-news-ctCtn" >
          <div className="ljc-news-ctCtnT" >
            <div>
              {
                this.state.recommend === 1 
                  ? 
                  <span className="ljc-news-recommendTag" style={{ background:"#ff5a5a"}} >推荐</span> 
                  : 
                  this.props.data.status ===  0
                  ? 
                  <span className="ljc-news-recommendTag" style={{ background: "#626a73" }} >未开始</span>
                  : 
                  this.props.data.status === 1 
                  ? 
                  <span className="ljc-news-recommendTag" style={{ background: "#3ca5f0" }} >进行中</span>
                  : 
                  this.props.data.status === 2 
                  ? 
                  <span className="ljc-news-recommendTag" style={{ background: "#d0d0d0" }} >已结束</span> 
                  :
                  ""
              }
            </div>
            <div className="ljc-news-title" >{this.props.data.title}</div>
          </div>
          {
            this.props.data.uid
            ?
              <div className="ljc-news-ctCtnB" >
                {this.props.data.description}
              </div>
            :
              <div className="ljc-news-ctCtnB" >
                {this.props.data.content}
              </div>
          }
          
          <div className="ljc-news-date" >
            {
              this.props.data.publish_time
                ? 
                  _x.util.date.format(new Date(this.props.data.publish_time), 'yyyy-MM-dd HH:mm')
                : 
                <div>
                  {_x.util.date.format(new Date(this.props.data.startTime), 'yyyy-MM-dd HH:mm')}
                  &nbsp;&nbsp;至&nbsp;&nbsp;
                  {_x.util.date.format(new Date(this.props.data.endTime), 'yyyy-MM-dd HH:mm')}
                </div>
            }
          </div>

          <div className="ljc-news-tTip" ref="newsTollTip" style={toolTipShowHide} >
            <ul>
              {
                this.props.data.uid
                ?
                <li onClick={this.recommend} ><SVG type="recommed" /></li> 
                :
                this.props.vote === "vote"
                ?
                  <li className="vote" onClick={this.voteTrend} ><SVG type="trend" /></li> 
                :
                  <li className="reg" onClick={this.regTrend} ><SVG type="trend" /></li> 
              }
              {
                this.props.data.uid
                ?
                <li onClick={() => this.props.getEditInfo(this.props.data.uid)}><SVG type='pen' /></li>
                :
                this.props.vote === "vote"
                ?
                  <li className="vote" onClick={this.voteEdit}><SVG type='pen'/></li>
                :
                  <li className="reg" onClick={this.regEdit}><SVG type='pen' /></li>
              }
              {
                this.props.data.uid
                ?
                  <li onClick={this.iDelList}><SVG type='cross' /></li>
                :
                  this.props.vote === "vote"
                ?
                  <li className="vote" onClick={this.iDelList}><SVG type='cross'  /></li>
                :
                  <li className="reg" onClick={this.iDelList}><SVG type='cross' /></li>
              }
            </ul>
          </div>
        </div>
        
        <Modal 
          className="ljc-vpe-modal"
          title="发布投票" 
          destroyOnClose="true"
          footer={null} 
          visible={this.state.voteVisible} 
          onCancel={() => { this.setState({ voteVisible: false }) }} >

          <VotePubEdit 
            voteId={this.props.data.id} 
            voteHideModal={this.voteHideModal} 
            type={1} 
            voteRenderLoad={this.voteRenderLoad}
            data={this.state.voteBackData} 
          />

        </Modal>

        <Modal 
          className="ljc-rpe-modal" 
          title="发布报名"
          destroyOnClose="true"
          footer={null} 
          visible={this.state.regVisible} 
          onCancel={() => { this.setState({ regVisible:false})}} >
          
          <RegPubEdit 
            regDBId={this.props.data.id} 
            regHideModal={this.regHideModal} 
            type={2} 
            regRenderLoad={this.regRenderLoad} />
        </Modal>
      </div>
    );
  }
}