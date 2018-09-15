/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:50:43
 * 右列更多组件
 */
import React, { Component } from 'react';
import { Modal, Button, Checkbox, Select, Pagination } from 'antd';
import { SVG } from './../../components/base';
import _x from './../../js/_x/index';
import { error, success, confirmDia } from './index.js';
import { VoteCount } from './../admin/index';
import { StuRightPub, StuPubSearch, StuPubVoting } from './../../components/student/index';
import './../../css/student/stuRightMore.css';

const Option = Select.Option;

export class StuRightMore extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,     //modal可见
      classId: '',          //从父组件获取
      dataId: '',          //选择数据id
      type: 0,           //页面性质
      dataList: [],        //列表信息
      total: 0,              //数据总数
      ifCheckAll: false,     //选中全部
      checkList: [],         //选中列表
      // check0: false,         //选中的单项
      editModal: false,        //通知modal
      votingModal: false,        //投票modal
      searchModal: false,      //失物招领modal
      voteModal: false,        //投票modal
      voteData: [],           //投票数据
      pageIndex: 1,          //页码
      pageSize: 20,          //每页数目
    }
    this.requestData = this.requestData.bind(this);
    this.requestDele = this.requestDele.bind(this);
    this.requestVoteData = this.requestVoteData.bind(this);
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.checkList = this.checkList.bind(this);
    this.votingCount = this.votingCount.bind(this);
    this.editData = this.editData.bind(this);
    this.deleData = this.deleData.bind(this);
    this.pubTrans = this.pubTrans.bind(this);
    this.pageSizeChan = this.pageSizeChan.bind(this);
    this.pageChan = this.pageChan.bind(this);
    this.deleList = this.deleList.bind(this);
  }
  componentWillMount() {
    this.setState({
      classId: this.props.classId
    })
  }
  componentWillReceiveProps(nextProps) {
    var classId = this.state.classId;
    if (classId !== nextProps.classId) {
      this.setState({
        classId: nextProps.classId
      })
    }

    var type = nextProps.title;
    switch (type) {
      case '班级通知':
        type = 1
        break;
      case '班级活动':
        type = 2;
        break;
      case '寻物启事':
        type = 4;
        break;
      case '失物招领':
        type = 3;
        break;
    }
    this.setState({
      visible: nextProps.visible,
      type: type
    })
    nextProps.visible
      ?
      this.requestData(this.state.classId, type, this.state.pageIndex, this.state.pageSize)
      :
      ''
  }

  /**
   * 获取列表数据
   */
  requestData(classId, type, pageIndex, pageSize) {
    var req = {
      action: 'api/web/monitor_class_for_students/find_list',
      data: {
        classId: classId,
        type: type,
        pageIndex: pageIndex,
        pageSize: pageSize
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        var data = ret.data;
        for (var i = 0, len = data.length; i < len; i++) {
          var pubTime = data[i].createTime;
          pubTime = _x.util.date.format(new Date(pubTime), 'yyyy-MM-dd HH:mm');
          data[i].createTime = pubTime;
        }
        this.setState({
          dataList: data,
          total: ret.total
        })
      }
    })
  }
  /**
   * 删除数据
   * 
   */
  requestDele(classId, type, ids) {
    var req = {
      action: 'api/web/monitor_class_for_students/delete_by_ids',
      data: {
        classId: classId,
        type: type,
        ids: ids
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('删除成功', 1000);
        this.setState({
          ifCheckAll: false,
          checkList: []
        })
        this.requestData(this.state.classId, this.state.type, 1, this.state.pageSize);
      } else {
        error('删除失败', 1000);
      }
    })
  }
  /**
   * 获取投票统计
   */
  requestVoteData(id) {
    var req = {
      action: 'api/web/monitor_class_for_students/vote/vote_statistics',
      data: {
        id: id
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

  //每页条数改变
  pageSizeChan(value) {
    this.setState({
      pageSize: value,
      pageIndex: 1
    })
    this.requestData(this.state.classId, this.state.type, 1, value);
  }
  //页码改变
  pageChan(page) {
    this.setState({
      pageIndex: page
    })
    this.requestData(this.state.classId, this.state.type, page, this.state.pageSize);
  }
  //全选按钮
  checkAll(e) {
    this.setState({
      ifCheckAll: e.target.checked,
    })
    var data = this.state.dataList;
    if (e.target.checked) {
      var arr = [];
      for (var i in data) {
        arr.push(data[i].id);
        this.setState({
          ['check' + data[i].id]: true
        })
      }
      this.setState({
        checkList: arr
      })
    } else {
      for (let i in data) {
        this.setState({
          ["check" + data[i].id]: false
        })
      }
      this.setState({
        checkList: []
      })
    }
  }
  //单项选中
  checkList(e) {
    var checkList = this.state.checkList,
      data = this.state.dataList;
    this.setState({
      ['check' + e.target.value]: e.target.checked
    })
    if (e.target.checked) {
      checkList.push(e.target.value);
      if (checkList.length === data.length) {
        this.setState({
          ifCheckAll: true
        })
      }
    } else {
      for (var n in checkList) {
        if (e.target.value === checkList[n]) {
          checkList.splice(n, 1);
        }
      }
      if (checkList.length !== data.length) {
        this.setState({
          ifCheckAll: false
        })
      }
    }
    this.setState({
      checkList: checkList
    })
  }
  //投票结果跳转
  votingCount(id) {
    this.setState({
      voteModal: true,
      dataId: id
    })
    this.requestVoteData(id);
  }
  //编辑
  editData(id) {
    const type = this.state.type;
    switch (type) {
      case 1:
        this.setState({
          editModal: true,
          dataId: id
        })
        break;
      case 2:
        this.setState({
          votingModal: true,
          dataId: id
        })
        break;
      case 3:
        this.setState({
          searchModal: true,
          dataId: id
        })
        break;
      case 4:
        this.setState({
          searchModal: true,
          dataId: id
        })
        break;
    }
  }
  pubTrans(ifPage, val) {
    switch (ifPage) {
      case '通知':
        this.setState({
          editModal: val
        })
        break;
      case '活动':
        this.setState({
          votingModal: val
        })
        break;
      default:
        this.setState({
          searchModal: val
        })
        break;
    }
    this.requestData(this.state.classId, this.state.type, 1, this.state.pageSize);
  }
  //删除单项
  deleData(id) {
    confirmDia({
      title: '删除提示',
      content: '确认删除？',
      className: 1,
      okText: '删除',
      fnOK: function () {
        this.requestDele(this.state.classId, this.state.type, [id]);
      }.bind(this)
    })
  }
  //批量删除
  deleList() {
    var ids = this.state.checkList;
    confirmDia({
      title: '删除提示',
      content: '确认删除？',
      className: 1,
      okText: '删除',
      fnOK: function () {
        this.requestDele(this.state.classId, this.state.type, ids);
      }.bind(this)
    })
  }
  // 确定
  okCli() {
    this.props.pubTrans('more' + this.props.title, false);
  }
  // 取消
  backCli() {
    this.props.pubTrans('more' + this.props.title, false);
  }

  render() {
    function itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <a>上一页</a>;
      } else if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
    return (
      <Modal title={this.props.title}
        visible={this.state.visible}
        onCancel={this.backCli}
        className='mj-srm-modal'
        footer={[]}
      >
        <div className='mj-srm-checkCon'>
          <Checkbox
            checked={this.state.ifCheckAll}
            onChange={this.checkAll}>全部</Checkbox>
          <Button
            disabled={this.state.checkList.length ? false : true}
            onClick={this.deleList}
            className='mj-srm-deleBtn'>批量删除</Button>
        </div>

        <div className='mj-srm-listContent'>
          {
            this.state.dataList.map((item, index) => (
              <div className='mj-srm-listCon' key={index}>
                <div className='mj-srm-listCheck'>
                  <Checkbox
                    value={item.id}
                    checked={this.state["check" + item.id]}
                    onChange={this.checkList}></Checkbox>
                </div>
                <div className='mj-srm-listText'>
                  <div>
                    <p className='cjy-ellip' title={item.title}>{item.title}</p>
                    {
                      item.auditStatus === 0 ?
                        <div className='mj-srm-blue cjy-clearfix'>
                          <span>待审核</span>
                          <div></div>
                        </div> :
                        (
                          item.auditStatus === 2 ?
                            <div className='mj-srm-red cjy-clearfix'>
                              <span>未通过</span>
                              <div></div>
                            </div> :
                            (
                              this.props.title === '班级通知' ?
                                <div></div> :
                                (
                                  this.props.title === '班级活动' && item.status === 0 ?
                                    <div className='mj-srm-black cjy-clearfix'>
                                      <span>未开始</span>
                                      <div></div>
                                    </div> :
                                    (
                                      this.props.title === '班级活动' && item.status === 1 ?
                                        <div className='mj-srm-listStatus cjy-clearfix'>
                                          <span>进行中</span>
                                          <div></div>
                                        </div> :
                                        (
                                          this.props.title === '班级活动' && item.status === 2 ?
                                            < div className='mj-srm-gray cjy-clearfix'>
                                              <span>已过期</span>
                                              <div></div>
                                            </div> :
                                            (
                                              this.props.title === '失物招领' && item.status === 1 ?
                                                <div className='mj-srm-gray cjy-clearfix'>
                                                  <span>已领取</span>
                                                  <div></div>
                                                </div> :
                                                (
                                                  this.props.title === '寻物启事' && item.status === 1 ?
                                                    <div className='mj-srm-gray cjy-clearfix'>
                                                      <span>已找回</span>
                                                      <div></div>
                                                    </div>
                                                    :
                                                    <div className='mj-srm-listStatus cjy-clearfix'>
                                                      <span>通知中</span>
                                                      <div></div>
                                                    </div>
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    }
                  </div>
                  <span>{`发布时间：${item.createTime}`}</span>
                </div>
                <p className='mj-srm-listIcon'>
                  {
                    this.state.type === 2
                      ?
                      <span onClick={() => this.votingCount(item.id)}>
                        <SVG type='trend'></SVG>
                      </span>
                      :
                      ''
                  }
                  <span onClick={() => this.editData(item.id)}>
                    <SVG type='pen'></SVG>
                  </span>
                  <span onClick={() => this.deleData(item.id)}>
                    <SVG type='cross'></SVG>
                  </span>
                </p>
              </div>
            ))
          }
        </div>

        <div className='mj-srm-listBottom cjy-clearfix'>
          <div className='mj-srm-listTotal'>
            <span>{`共${this.state.total}条数据，每页`}</span>
            <Select defaultValue={20} onChange={this.pageSizeChan}>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            条
          </div>
          <Pagination
            className='mj-srm-listPage'
            simple
            defaultCurrent={1}
            total={this.state.total}
            onChange={this.pageChan}
            pageSize={this.state.pageSize}
            current={this.state.pageIndex}
            itemRender={itemRender}></Pagination>
        </div>

        <Modal
          className="ljc-va-tm"
          visible={this.state.voteModal}
          footer={null}
          title="投票统计"
          onCancel={() => this.setState({ voteModal: false })} >
          <VoteCount data={this.state.voteData} />
        </Modal>
        <StuRightPub
          pubId={this.state.dataId}
          classId={this.state.classId}
          title=''
          pubTitle={'编辑通知'}
          visible={this.state.editModal}
          pubTrans={this.pubTrans}></StuRightPub>       {/* 编辑通知 */}
        <StuPubVoting
          pubId={this.state.dataId}
          classId={this.state.classId}
          title=''
          pubTitle={'编辑活动'}
          visible={this.state.votingModal}
          pubTrans={this.pubTrans}></StuPubVoting>     {/* 编辑投票 */}
        <StuPubSearch
          pubId={this.state.dataId}
          classId={this.state.classId}
          title=''
          pubTitle={this.state.type === 3 ? '编辑寻物启事' : '编辑失物招领'}
          visible={this.state.searchModal}
          pubTrans={this.pubTrans}></StuPubSearch>     {/* 编辑寻物启事\失物招领 */}
      </Modal>
    );
  }
}