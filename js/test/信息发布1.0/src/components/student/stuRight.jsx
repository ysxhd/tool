/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-27 13:00:49
 * 页面右列组件
 */
import React, { Component } from 'react';
import { Tabs, Timeline } from 'antd';
import { SVG } from './../../components/base';
import _x from './../../js/_x/index';
import { error, success, confirmDia } from './index.js';
import { StuRightListCon, StuRightPub, StuPubSearch, StuRightMore, StuPubVoting } from './index';
import './../../css/student/stuRight.css';

const TabPane = Tabs.TabPane;

export class StuRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabTitle: this.props.titleData,      //tab切换标题
      classId: '',           //父组件props的classId
      tabCon1: [],       //tab内容1
      tabCon2: [],       //tab内容2
      infoModal: false,      //发布通知modal
      lostModal: false,      //发布失物招领modal
      votingModal: false,      //发布投票modal
      moreModal: false,        //更多modal
      moreTitle: '',             //更多的标题
      pubTitle: '',            //发布的标题
      type:null                //是否切换type
    }
    this.requestListData = this.requestListData.bind(this);
    this.pubMein = this.pubMein.bind(this);
    this.pubTrans = this.pubTrans.bind(this);
    this.moreCli = this.moreCli.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.deleCli = this.deleCli.bind(this);
  }
  componentWillMount() {
    // const tabTitle = this.state.tabTitle;
    // this.setState({
    //   classId: this.props.classId
    // })
    // console.log(2);
    // this.requestListData(this.props.classId, tabTitle[0].type, 1, 3);
  }
  componentWillReceiveProps(nextProps) {
    var classId = this.state.classId;
    var type = this.state.type;
    // console.log(classId);
    // console.log(nextProps);
    if (classId !== nextProps.classId) {
      const tabTitle = this.state.tabTitle;
      this.setState({
        classId: nextProps.classId
      })
      // console.log(3);
      if(type){
        this.requestListData(nextProps.classId, type, 1, 3);
      }else{
        this.requestListData(nextProps.classId, tabTitle[0].type, 1, 3);
      }
    }
  }

  /**
   * 获取列表数据
   */
  requestListData(classId, type, pageIndex, pageSize) {
    // console.log('主页面列表');
    if(!classId){
      return; //如果没有班级id则不请求数据
    }

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
        const data = ret.data;
        for (var i = 0, len = data.length; i < len; i++) {
          var pubTime = data[i].createTime;
          pubTime = _x.util.date.format(new Date(pubTime), 'yyyy-MM-dd HH:mm');
          data[i].createTime = pubTime;
        }
        // console.log(data);
        // console.log(type);
        type === 1 || type === 3
          ?
          this.setState({
            tabCon1: data
          })
          :
          this.setState({
            tabCon2: data
          })
      }
    })
  }
  /**
   * 数据删除
   */
  requestDele(classId, type, ids) {
    // console.log('主页面删除');
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
        this.requestListData(this.state.classId, type, 1, 3);
      } else {
        error('删除失败', 1000);
      }
    })
  }


  //tabs切换
  tabChange(key) {
    // console.log(parseInt(key));
    this.setState({
      type:parseInt(key)
    })
    this.requestListData(this.state.classId, parseInt(key), 1, 3);
  }
  //点击发布通知
  pubMein(type, title) {
    // console.log(title);
    switch (type) {
      case 1:
        this.setState({
          infoModal: true,
          pubTitle: title
        })
        break;
      case 2:
        this.setState({
          votingModal: true,
          pubTitle: title
        })
        break;
      case 3:
        this.setState({
          lostModal: true,
          pubTitle: title
        })
        break;
      case 4:
        this.setState({
          lostModal: true,
          pubTitle: title
        })
        break;
    }
  }
  // 查看更多
  moreCli(title) {
    // console.log(title);
    this.setState({
      moreModal: true,
      moreTitle: title
    });
  }
  //发布通知modal函数
  pubTrans(ifPage, val) {
    // console.log(ifPage)
    var type = 1;
    switch (ifPage) {
      case '通知':
        this.setState({
          infoModal: val
        });
        type = 1;
        break;
      case '失物招领':
        this.setState({
          lostModal: val
        });
        type = 3;
        break;
      case '寻物启事':
        this.setState({
          lostModal: val
        });
        type = 4;
        break;
      case '活动':
        this.setState({
          votingModal: val
        });
        type = 2;
        break;
      case 'more班级通知':
        this.setState({
          moreModal: val
        });
        type = 1;
        break;
      case 'more班级活动':
        this.setState({
          moreModal: val
        });
        type = 2;
        break;
      case 'more失物招领':
        this.setState({
          moreModal: val
        });
        type = 3;
        break;
      case 'more寻物启事':
        this.setState({
          moreModal: val
        });
        type = 4;
        break;
      case '--班级通知':
        type = 1;
        break;
      case '--班级活动':
        type = 2;
        break;
      case '--失物招领':
        type = 3;
        break;
      case '--寻物启事':
        type = 4;
        break;
    }
    // console.log(1);
    this.requestListData(this.state.classId, type, 1, 3);
  }
  //删除点击
  deleCli(ids, type) {
    confirmDia({
      title: '删除提示',
      content: '确认删除？',
      className: 1,
      okText: '删除',
      fnOK: function () {
        this.requestDele(this.state.classId, type, [ids]);
      }.bind(this)
    })
  }

  render() {
    // console.log(this.state.tabCon1);
    // console.log(this.state.classId);
    const titleData = this.state.tabTitle;
    return (
      <div className='mj-sr-tabCon'>
        <Tabs defaultActiveKey={titleData[0].type.toString()} onChange={this.tabChange}>
          <TabPane tab={titleData ? titleData[0].title : ''} key={titleData[0].type.toString()}>
            {
              this.state.tabCon1.length
                ?
                <div className='mj-sr-listLeft'>
                  <div className='mj-sr-leftBtn' onClick={() => this.pubMein(titleData[0].type, titleData[0].pub)}>
                    <SVG type='plane2'></SVG>
                    {titleData[0].pub}
                  </div>
                  <Timeline
                    className={'mj-sr-leftData'}>
                    {
                      this.state.tabCon1.map((item, index) => (
                        <Timeline.Item key={index}>
                          <StuRightListCon
                            classId={this.state.classId}
                            data={item}
                            dele={this.deleCli}
                            pubTrans={this.pubTrans}
                            type={titleData[0].type}></StuRightListCon>
                        </Timeline.Item>
                      ))
                    }
                  </Timeline>
                  <div className='mj-sr-checkMore' onClick={() => this.moreCli(titleData[0].title)}>查看更多</div>
                </div>
                :
                <div className='mj-sr-pubMein' onClick={() => this.pubMein(titleData[0].type, titleData[0].pub)}>
                  <SVG type='pubMein'></SVG>
                  <p>{titleData[0].pub}</p>
                </div>
            }
          </TabPane>

          <TabPane tab={titleData ? titleData[1].title : ''} key={titleData[1].type.toString()}>
            {
              this.state.tabCon2.length
                ?
                <div className='mj-sr-listLeft'>
                  <div className='mj-sr-leftBtn' onClick={() => this.pubMein(titleData[1].type, titleData[1].pub)}>
                    <SVG type='plane2'></SVG>
                    {titleData[1].pub}
                  </div>
                  <Timeline
                    className={
                      titleData[0].type === 1 || titleData[0].type === 2
                        ?
                        (
                          this.state.tabCon2.map((item) => (
                            item.status === 2
                              ?
                              'mj-sr-leftDataOut'
                              :
                              'mj-sr-leftData'
                          ))
                        )
                        :
                        (
                          this.state.tabCon2.map((item) => (
                            item.status === 1
                              ?
                              'mj-sr-leftDataOut'
                              :
                              'mj-sr-leftData'
                          ))
                        )
                    }>
                    {
                      this.state.tabCon2.map((item, index) => (
                        <Timeline.Item key={index}>
                          <StuRightListCon
                            classId={this.state.classId}
                            data={item}
                            dele={this.deleCli}
                            pubTrans={this.pubTrans}
                            type={titleData[1].type}></StuRightListCon>
                        </Timeline.Item>
                      ))
                    }
                  </Timeline>
                  <div className='mj-sr-checkMore' onClick={() => this.moreCli(titleData[1].title)}>查看更多</div>
                </div>
                :
                <div className='mj-sr-pubMein' onClick={() => this.pubMein(titleData[1].type, titleData[1].pub)}>
                  <SVG type='pubMein'></SVG>
                  <p>{titleData[1].pub}</p>
                </div>
            }
          </TabPane>
        </Tabs>
        <StuRightPub
          pubId=''
          classId={this.state.classId}
          pubTitle={this.state.pubTitle}
          visible={this.state.infoModal}
          pubTrans={this.pubTrans}></StuRightPub>       {/* 发布通知 */}
        <StuPubVoting
          pubId=''
          classId={this.state.classId}
          pubTitle={this.state.pubTitle}
          visible={this.state.votingModal}
          pubTrans={this.pubTrans}></StuPubVoting>     {/* 发布活动 */}
        <StuPubSearch
          pubId=''
          classId={this.state.classId}
          pubTitle={this.state.pubTitle}
          title={this.state.moreTitle}
          visible={this.state.lostModal}
          pubTrans={this.pubTrans}></StuPubSearch>     {/* 发布寻物启事\失物招领 */}
        <StuRightMore
          classId={this.state.classId}
          pubTitle={this.state.pubTitle}
          title={this.state.moreTitle}
          visible={this.state.moreModal}
          pubTrans={this.pubTrans}></StuRightMore>      {/* 更多 */}
      </div>
    );
  }
}