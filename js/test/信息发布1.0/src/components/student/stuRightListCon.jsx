/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:54:50
 * 右列单个组件
 */
import React, { Component } from 'react';
import { SVG } from './../../components/base';
import { Modal } from 'antd';
import _x from './../../js/_x/index';
import { StuRightPub, StuPubVoting, StuPubSearch } from './../../components/student/index';
// import { VoteCount } from './../../components/shared/voteCount';
import { VoteCount } from './../admin/index';
import './../../css/student/stuRightListCon.css';

export class StuRightListCon extends Component {
  constructor() {
    super();
    this.state = {
      editModal: false,      //编辑modal
      votingModal: false,      //投票modal
      searchModal: false,      //寻物启事modal
      type: 1,             //页面
      editTitle: '',            //编辑标题
      countModal: false,       //统计modal
      classId: '',             //从父组件获取F
      voteData: [],        //投票数据
    }
    this.requestVoteData = this.requestVoteData.bind(this);
    this.editCli = this.editCli.bind(this);
    this.editTrans = this.editTrans.bind(this);
    this.countCli = this.countCli.bind(this);
    this.deleCli = this.deleCli.bind(this);
  }
  componentWillMount() {
    this.setState({
      classId: this.props.classId,
      type: this.props.type
    })
  }
  componentWillReceiveProps(nextProps) {
    var classId = this.state.classId;
    if (classId !== nextProps.classId) {
      this.setState({
        classId: nextProps.classId
      })
    }
  }
  /**
   * 获取投票统计
   */
  requestVoteData() {
    var req = {
      action: 'api/web/monitor_class_for_students/vote/vote_statistics',
      data: {
        id: this.props.data.id
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        this.setState({
          voteData: ret.data
        })
      }
    })
  }

  //统计
  countCli() {
    this.requestVoteData();
    this.setState({
      countModal: true
    })
  }
  //编辑
  editCli() {
    const type = this.state.type;
    switch (type) {
      case 1:
        this.setState({
          editTitle: '编辑通知',
          editModal: true
        })
        break;
      case 2:
        this.setState({
          editTitle: '编辑活动',
          votingModal: true
        })
        break;
      case 3:
        this.setState({
          editTitle: '编辑失物招领',
          searchModal: true
        })
        break;
      case 4:
        this.setState({
          editTitle: '编辑寻物启事',
          searchModal: true
        })
        break;
    }
  }
  editTrans(ifPage, val) {
    switch (ifPage) {
      case '通知':
        this.setState({
          editModal: val
        });
        this.props.pubTrans('--班级通知', 0);
        break;
      case '活动':
        this.setState({
          votingModal: val
        });
        this.props.pubTrans('--班级活动', 0);
        break;
      case '失物招领':
        this.setState({
          searchModal: val
        });
        this.props.pubTrans('--失物招领', 0);
        break;
      case '寻物启事':
        this.setState({
          searchModal: val
        });
        this.props.pubTrans('--寻物启事', 0);
        break;
    }
  }
  //删除
  deleCli(id) {
    this.props.dele(id, this.state.type);
  }

  render() {
    const data = this.props.data;
    const type = this.props.type;
    return (
      <div className='mj-srlc-dataCon'>
        <div
          className={
            data.auditStatus === 0 ? 'mj-srlc-blue cjy-ellip' :
              data.auditStatus === 2 ? 'mj-srlc-red cjy-ellip' :
                type === 1 ? 'mj-srlc-red cjy-ellip' :    //通知
                  type === 2 && data.status === 0 ? 'mj-srlc-black cjy-ellip' :   //活动
                    type === 2 && data.status === 1 ? 'mj-srlc-yellow cjy-ellip' :
                      type === 2 && data.status === 2 ? 'mj-srlc-gray cjy-ellip' :
                        type === 3 && data.status === 1 ? 'mj-srlc-gray cjy-ellip' :     //失物   寻物
                          type === 4 && data.status === 1 ? 'mj-srlc-gray cjy-ellip' : 'mj-srlc-yellow cjy-ellip'
          }>
          {
            data.auditStatus === 0 ? <span>待审核</span> :
              data.auditStatus === 2 ? <span>未通过</span> :
                type === 1 ? '' :    //通知
                  type === 2 && data.status === 0 ? <span>未开始</span> :   //活动
                    type === 2 && data.status === 1 ? <span>进行中</span> :
                      type === 2 && data.status === 2 ? <span>已过期</span> :
                        type === 3 && data.status === 1 ? <span>已领取</span> :     //失物   寻物
                          type === 4 && data.status === 1 ? <span>已找回</span> : <span>通知中</span>
          }
          <p title={data.title}>{data.title}</p>
        </div>
        <div className='cjy-clearfix mj-srlc-content'>
          <span className='mj-srlc-time'>{data.createTime ? data.createTime : ` `}</span>
          <div className='mj-srlc-iconList'>
            {
              type === 2
                ?
                <span onClick={this.countCli}>
                  <SVG type='trend'></SVG>
                </span>
                :
                ''
            }
            <span onClick={this.editCli}>
              <SVG type='pen'></SVG>
            </span>
            <span onClick={() => this.deleCli(data.id)}>
              <SVG type='cross'></SVG>
            </span>
          </div>
        </div>
        {/* <VoteCount></VoteCount> */}
        <Modal
          className="ljc-va-tm"
          visible={this.state.countModal}
          footer={null}
          title="投票统计"
          onCancel={() => this.setState({ countModal: false })} >
          <VoteCount data={this.state.voteData} />
        </Modal>
        <StuRightPub
          pubId={data.id}
          classId={this.state.classId}
          pubTitle={this.state.editTitle}
          visible={this.state.editModal}
          pubTrans={this.editTrans}></StuRightPub>       {/* 编辑通知 */}
        <StuPubVoting
          pubId={data.id}
          classId={this.state.classId}
          pubTitle={this.state.editTitle}
          visible={this.state.votingModal}
          pubTrans={this.editTrans}></StuPubVoting>     {/* 编辑投票 */}
        <StuPubSearch
          pubId={data.id}
          classId={this.state.classId}
          pubTitle={this.state.editTitle}
          title={this.state.moreTitle}
          visible={this.state.searchModal}
          pubTrans={this.editTrans}></StuPubSearch>     {/* 编辑寻物启事\失物招领 */}
      </div>
    );
  }
}