/*
 * @Author: lxx 
 * @Date: 2018-06-21 16:16:05 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-11 17:52:21
 * 使用情况统计
 */

import React, { Component } from 'react';
import { Radio, Table, Input, Icon, Spin, Pagination, InputNumber } from 'antd';
import LinChart from './linChart';
import './use.css';
import { connect } from 'react-redux';
import { changeType_action, searchValue, store_use_action, changeUseTable_action } from '../../redux/analysis/use.redux';
import { ModalSuccess } from '../../components/public/modal';
import { format } from '../../js/_x/util/date';
import { setConfig, request as ajax } from '../../js/clientRequest';
import { G as server_config } from '../../js/../js/global'



const data = [{
  uid: '0',
  account: '账号',
  name: '姓名',
  stuId: 123456,
  phoneNum: 15146784692,
  date: '2018-01-25',
  time: 51
}, {
  uid: '1',
  account: '账号',
  name: '姓名',
  stuId: 123456,
  phoneNum: 15146784692,
  date: '2018-01-25',
  time: 51
}, {
  uid: '2',
  account: '账号',
  name: '姓名',
  stuId: 123456,
  phoneNum: 15146784692,
  date: '2018-01-25',
  time: 51
}, {
  uid: '3',
  account: '账号',
  name: '姓名',
  stuId: 123456,
  phoneNum: 15146784692,
  date: '2018-01-25',
  time: 51
}, {
  uid: '4',
  account: '账号',
  name: '姓名',
  stuId: 123456,
  phoneNum: 15146784692,
  date: '2018-01-25',
  time: 51
},];

let data2 = [];
data.map((val, index) => {
  val = { ...val, key: index };
  data2.push(val);
})

@connect(
  state => state.UseMatter_reducer,
  { changeType_action, searchValue, store_use_action, changeUseTable_action }
)
export default class Use extends Component {
  constructor(props) {
    super(props);
  
    this.data={};
  }

  handleChange = (pagination, filters, sorter) => {
    let data = this.props;
    // 最近登陆
    if (sorter.columnKey === "date") {
      //小三角向下
      if (sorter.order === "descend") {
        this.props.changeUseTable_action(this.props.search, 1, 2 ,data.pagination.currentPage);
      } else {
        this.props.changeUseTable_action(this.props.search, 1, 1,data.pagination.currentPage);
      }
    }

    // 在线时长
    if (sorter.columnKey === "time") {
      //小三角向下
      if (sorter.order === "descend") {
        this.props.changeUseTable_action(this.props.search, 2, 2,data.pagination.currentPage);
      } else {
        this.props.changeUseTable_action(this.props.search, 2, 1,data.pagination.currentPage);
      }
    }
  }

  componentWillMount() {
    if (!!process.browser && window) {
      //数据服务初始化及相关逻辑 前端请求中间层
      const dataServices = `${server_config.middlewarePath}:${server_config.nextServicePort}/`;
      //从sso截取token
      const search = decodeURI(window.location.search.replace('?', ''));
      let strs = search.split("&"), orgcode, token;
      try {
        orgcode = strs[0].split("=")[1];
        token = strs[1].split("=")[1];
      } catch (error) {
        orgcode = "";
        token = "";
      }

      server_config.token = token
      server_config.orgcode = orgcode
      setConfig(dataServices, orgcode, token);
    }
  }


  //redux中存储数据
  componentDidMount = async () => {
    //使用情况-------------------
 //访问统计
 let access_count = await ajax('analysis/get_access_count', {}, (res) => { });
     access_count = access_count.data.data
 
 //时长统计
 let duration_data = await ajax('analysis/get_duration_data', {"type":1}, (res) => { });
     duration_data = duration_data.data.data;
 
 //历史数据统计
 let history_data1 = await ajax('analysis/get_history_data', {"type":1,"indication":1}, (res) => { });
     history_data1 = history_data1.data.data;  

 //使用情况tabel
 let use_table_data = await ajax('analysis/get_usage_data', {"pageSize":10,"pageIndex":1,"like":"","orderType":0,"order":1}, (res) => { }); 
 let use_table_dataTotal = use_table_data.data.total;
 use_table_data = use_table_data.data.data;   

  this.data = { access_count , duration_data , history_data1,use_table_data,use_table_dataTotal};
  this.props.store_use_action(this.data)
}

// 组件销毁恢复状态
componentWillUnmount(){
  this.props.changeType_action("1", "1", true);
  
}

  //切换最近天数 
  onChange = (e) => {
    this.props.changeType_action(this.props.humanTime, e.target.value, true);
  }

  //切换人数、时长
  onChange2 = (e) => {
    this.props.changeType_action(e.target.value, this.props.recentDay, false);
  }

  //搜索发送请求
  search = () => {
    this.props.changeUseTable_action(this.props.search, this.props.orderType, this.props.order,this.props.pagination.currentPage);
  }
  
  //翻页请求
  pageChangeHandle = (page) => {

    this.props.changeUseTable_action(this.props.search, this.props.orderType, this.props.order,page);  
  }

  // 输入分页，回车跳转
  pageTurn = (event) => {
    let data = this.props;
    let newNumber = event.target.value,
       isNum = /^[0-9]+$/.test(newNumber);
       if(isNum || event.keyCode == 8){
            let last = data.pagination.total; //总条数
            let total = Math.ceil(last / data.pagination.pageSize);
            
            if (event.keyCode === 13) {
              console.log(total)
            //输入页码大于总页数
            if(event.target.value > total){
              ModalSuccess.show({data:"输入的页码不能大于总页数"});
              return;
            }
            //输入页码小于1
            if(event.target.value < 1){
              ModalSuccess.show({data:"输入页码必须大于0"});
              return;
            }
                this.props.changeUseTable_action(this.props.search, data.orderType, data.order ,Number(event.target.value));
          }
      }else{
        ModalSuccess.show({ data: "只能为纯数字" });
      }
  }


  // 跳到尾页
  turnLast = () => {
    let data = this.props;
    let last = data.pagination.total; //总条数
    let page = Math.ceil(last / data.pagination.pageSize);
    // 进行判断，当前页数是不是最后一页
    if (data.pagination.currentPage == page) {
      return false;
  }
    this.props.changeUseTable_action(this.props.search, data.orderType, data.order ,page);
  }

  // 跳到第一页
  turnFirst = () => {
    let data = this.props;
    if (data.pagination.currentPage == 1) {
        return false;
    }
    this.props.changeUseTable_action(this.props.search, data.orderType, data.order ,1);
  }

  render() {
    let UseMatter_reducer = this.props,
        tableData = [],
        pagination = UseMatter_reducer.pagination,
        allPage=null;
       allPage = Math.ceil(pagination.total / pagination.pageSize);
       !allPage ? allPage = 0:allPage;
    const columns = [{
      title: '账号',
      dataIndex: 'account',
      key: 'account'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '学号',
      dataIndex: 'stuId',
      key: 'stuId'
    }, {
      title: '手机号',
      dataIndex: 'phoneNum',
      key: 'phoneNum'
    }, {
      title: '最近登录',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      sortOrder: false,
    }, {
      title: '在线时长',
      dataIndex: 'time',
      key: 'time',
      sorter: true,
      sortOrder: false,
    }];

    if (UseMatter_reducer.use_table_content.length) {
      UseMatter_reducer.use_table_content.map((val, i) => {
        //转换日期格式
        var change = new Date(val.date);
        change = format(change, "yyyy-MM-dd");
        var day = Math.floor(val.time / 86400);
        var t = val.time % 86400;
        var hour = Math.floor(t / 3600);
        t = t % 3600;
        var minute = Math.floor((t / 60));
        var stime = `${day}天${hour}小时${minute}分`;
        val = { ...val, key: i, date: change, time: stime };
        tableData.push(val);
      })
    }

    const itemRender = (current, type, originalElement) => {
      if (type === 'prev') {
        return <a>上一页</a>;
      } if (type === 'next') {
        return <a>下一页</a>;
      }
      return originalElement;
    }
    let noDate = {emptyText:'暂无数据'};
    //时长统计
    var date = UseMatter_reducer.timeLong.date ? new Date(UseMatter_reducer.timeLong.date) : new Date(),//单日最高使用时长
      averageTime = UseMatter_reducer.timeLong.averageTime  ? new Date(UseMatter_reducer.timeLong.averageTime) : 0,  //人均每日使用时长 
      longestTime = UseMatter_reducer.timeLong.longestTime  ? new Date(UseMatter_reducer.timeLong.longestTime) : 0;  //单日最高使用时长
    date = date ? format(date, 'yyyy-MM-dd') : "";
    averageTime = averageTime ? `${averageTime.getHours()}h${averageTime.getMinutes()}m`:0;
    longestTime = longestTime ? `${longestTime.getHours()}h${longestTime.getMinutes()}m`:0;

    return (
      <div className="zn-bg-pd">
        <div className="lxx-g-useSum">
          <div className="lxx-g-modal lxx-md-small">
            <div className="lxx-md-m-title" onClick={this.confirm}>
              <span>访问统计</span>
            </div>
            <div className="zn-lxx-cont">
              <div>活跃用户数 ：<span>{UseMatter_reducer.interView.activeCount}</span></div>
              <div>使用过用户数：<span>{UseMatter_reducer.interView.userdCount}</span></div>
            </div>
          </div>
          <div className="lxx-g-modal lxx-md-small">
            <div className="lxx-md-m-title zn-flex-spbt">
              <span>时长统计</span>
              <span>于{date ? date : ""}</span>
            </div>
            <div className="zn-lxx-cont">
              <div>人均每日使用时长 ：<span>{averageTime}</span></div>
              <div>单日最高使用时长 : <span>{longestTime}</span></div>
            </div>
          </div>
        </div>
        <div className="lxx-g-modal lxx-md-big">
          <div className="lxx-md-m-title">
            <span>历史数据统计</span>
            <Radio.Group onChange={this.onChange} className="lxx-til-m-tab" value={this.props.recentDay}>
              <Radio.Button value="1">最近7天</Radio.Button>
              <Radio.Button value="2">最近30天</Radio.Button>
            </Radio.Group>
          </div>
          <div className="lxx-md-m-body">
            <div className="lxx-mdb-m-til">
              <span>指标</span>
              <Radio.Group onChange={this.onChange2} className="lxx-m-tab" value={this.props.humanTime}>
                <Radio.Button value="1">人数</Radio.Button>
                <Radio.Button value="2">时长</Radio.Button>
              </Radio.Group>
            </div>
            <Spin size="large" spinning={UseMatter_reducer.loadingE}>
              <LinChart size="large" />
            </Spin>
          </div>
        </div>
        <div className="lxx-g-modal lxx-md-big">
          <div className="lxx-md-m-title">
            <span>使用情况列表</span>
          </div>
          <div className="lxx-serch-box">
            <div> <Input value={this.props.search} onChange={(e) => { this.props.searchValue(e.target.value) }} className="lxx-nb-ipt" placeholder="账号/姓名/学号/手机号" />
              <Icon type="search" onClick={this.search} className="lxx-nb-icon" /></div>
          </div>
          <div className="lxx-md-m-table">
            <Table
              locale = {noDate}
              loading={this.props.loadingT}
              columns={columns}
              dataSource={tableData}
              pagination={false}
              onChange={this.handleChange.bind(this)}
            />
            {
              UseMatter_reducer.pagination.total ?
              <div>
            <div className='zn-page-box'>
              <span className='zn-page-first' onClick={this.turnFirst}>首页</span>
              <Pagination
                pageSize={UseMatter_reducer.pagination.pageSize}
                current={UseMatter_reducer.pagination.currentPage}
                total={UseMatter_reducer.pagination.total}
                onChange={this.pageChangeHandle}
                itemRender={itemRender}
              />
              <span className='zn-page-last' onClick={this.turnLast}>尾页</span>
            </div>
            <div className="zn-nc-total">
              共{UseMatter_reducer.pagination.total}条记录，页面
              <InputNumber
                max={allPage}
                step={'1'}
                min={1}
                className="zn-notic-key-up"
                onKeyUp={this.pageTurn}
              />
              /{allPage}页
          </div>
          </div>:""
            }

          </div>
        </div>
      </div>
    )
  }
}