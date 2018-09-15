import React, { Component } from 'react'
import './advise.css'
import './../notic_ctrl/addNotic.css'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { Select, Table, Modal, Spin, Pagination, InputNumber } from 'antd';
import CheckNotic from './checkNotic';
import { connect } from 'react-redux';
import { format } from '../../js/_x/util/date';
import { ModalSuccess } from '../../components/public/modal';
import { request as ajax } from '../../js/clientRequest';

import { store_advise_action, showDetail_action, closeModal_action, changeType1_action } from '../../redux/analysis/advise.redux';


const Option = Select.Option;
@connect(
  state => state.TableAdvise_reducer,
  { store_advise_action, showDetail_action, closeModal_action, changeType1_action }
)
export default class Advise extends Component {
  constructor() {
    super();
    this.data = {};
  }



  //redux中存储数据
  componentDidMount = async () => {
    //意见反馈的数据
    // echarts
    let feedback_count = await ajax('analysis/get_feedback_count', {}, (res) => { });
    feedback_count = feedback_count.data.data
    //获取下拉列表数据
    let name_type = await ajax('analysis/get_name_type', {}, (res) => { });
    name_type = name_type.data.data;

    //分页获取反馈列表数据
    let feekback_data = await ajax('analysis/get_feekback_data', { "pageSize": 10, "pageIndex": 1, "type": "1", "orderType": 0, "order": 1 }, (res) => { });
    let advise_table_dataTotal = feekback_data.data.total;
    feekback_data = feekback_data.data.data;

    console.log(name_type);
    //显示反馈详细数据图片
    this.data = { feedback_count, name_type, feekback_data, advise_table_dataTotal };
    this.props.store_advise_action(this.data);
  }

  componentWillReceiveProps(next) {
    // 基于准备好的dom，初始化echarts实例
    this.init(next);
  }

  init = (propsdata) => {
    //深度克隆
    let data = JSON.parse(JSON.stringify(propsdata.echartsContent)),
      xdata = [],
      ydata = [];
    data.map((val) => {
      xdata.push(val.xData);
      ydata.push(val.yData);
    })


    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('zn-main-echarts'));
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      xAxis: {
        splitLine: {
          lineStyle: {
            width: 0
          }
        },
        axisLine: {
          lineStyle: {
            color: "#097ed9",
            width: 2
          }
        },
        data: xdata,
        nameTextStyle: {
          fontSize: 40
        }
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            color: ['#20384e'],
            width: 2
          }
        },
        nameTextStyle: {
          fontSize: 40
        },
        axisLabel: {
          formatter: function (v, i) {
            var regex = /\./g;
            if (!regex.test(v)) {
              return v
            }
          }
        }
      },
      grid: {
        left: '50px',
        right: '50px',
        width: '100%'

      },
      series: [{
        type: 'bar',
        barWidth: 90,
        data: ydata,
      }],
      backgroundColor: '#21253e',
      itemStyle: {
        // 设置扇形的颜色
        color: '#097ed9',
        fontSize: "50px"
      },
      textStyle: {
        color: '#848889',
        fontSize: "50"
      }
    });
  }

  //切换select
  handleChange(value) {
    let data = this.props;
    this.props.changeType1_action(value, data.imgSort, data.timeSort, data.pagination.currentPage);
  }

  //小三角排序
  handleTableChange(pagination, filters, sorter) {
    let data = this.props;
    // 图片数量
    if (sorter.columnKey === "count") {
      //小三角向下
      if (sorter.order === "descend") {
        this.props.changeType1_action(data.type, 1, 2, data.pagination.currentPage);
      } else {
        this.props.changeType1_action(data.type, 1, 1, data.pagination.currentPage);
      }
    }

    // 反馈时间
    if (sorter.columnKey === "data") {
      //小三角向下
      if (sorter.order === "descend") {
        this.props.changeType1_action(data.type, 2, 2, data.pagination.currentPage);
      } else {
        this.props.changeType1_action(data.type, 2, 1, data.pagination.currentPage);
      }
    }
  }

  // 输入分页，回车跳转
  pageTurn = (event) => {
    let data = this.props,
        newNumber = event.target.value,
        isNum = /^[0-9]+$/.test(newNumber);
      if(isNum || event.keyCode == 8){
         let last = data.pagination.total; //总条数
          let total = Math.ceil(last / data.pagination.pageSize);
      if (event.keyCode === 13) {
      //输入页码大于总页数
        if (event.target.value > total) {
          ModalSuccess.show({ data: "输入的页码不能大于总页数" });
          return;
        }
        //输入页码小于1
        if (event.target.value < 1) {
          ModalSuccess.show({ data: "输入页码必须大于0" });
          return;
        }
        this.props.changeType1_action(data.type, data.imgSort, data.timeSort, Number(newNumber));
    }
  }else{
    ModalSuccess.show({ data: "只能为纯数字" });
  }
}

  //翻页请求
  pageChangeHandle = (page) => {
    let data = this.props;

    this.props.changeType1_action(data.type, data.imgSort, data.timeSort, Number(page));
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
    this.props.changeType1_action(data.type, data.imgSort, data.timeSort, Number(page));
  }

  // 跳到第一页
  turnFirst = () => {
    let data = this.props;
    if (data.pagination.currentPage == 1) {
      return false;
    }
    this.props.changeType1_action(data.type, data.imgSort, data.timeSort, 1);
  }


  render() {
    let reducer = this.props,
      tableData = [],
      pagination = reducer.pagination,
      allPage = null;
    allPage = Math.ceil(pagination.total / pagination.pageSize);
    !allPage ? allPage = 0 : allPage;
    const columns = [{
      title: '账号',
      dataIndex: 'account',
      key: 'account'
      // specify the condition of filtering result
      // here is that finding the name started with `value`
    }, {
      title: '反馈类型',
      dataIndex: 'feedType',
      key: 'feedType'
    }, {
      title: '反馈内容',
      dataIndex: 'content',
      key: 'content',
      render:(text)=>{
        return <div className="zn-overflow-ellipts" title={text}>
              {text}
      </div>
      }
    },
    {
      title: '图片数量',
      dataIndex: 'count',
      key: 'count',
      sorter: true,
      sortOrder: false,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
    },
    {
      key: 'data',
      title: '反馈时间',
      dataIndex: 'date',
      sorter: true,
      sortOrder: false,
      // specify the condition of filtering result
      // here is that finding the name started with `value`
    },
    {
      key: 'caculate',
      title: '操作',
      dataIndex: 'caculate',
      render: (text, record, index) => {
        return <div>
          <i onClick={this.props.showDetail_action.bind(this, index, record.id)} className="iconfont zn-icon-hover icon-check hf-nc-icon"></i>
        </div>
      }
    }
    ];
    //table数据需要唯一的key做标识
    if (reducer.tableContent.length) {
      reducer.tableContent.map((val, i) => {
        //转换日期格式
        var change = new Date(val.date);
        change = format(change, "yyyy-MM-dd");
        val = { ...val, key: i, date: change };
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

    let noDate = { emptyText: '暂无数据' };

    return (
      <div className="zn-bg-cont">
        <div className="zn-title-top">反馈类型统计</div>
        <Spin size="large" spinning={false}><div id="zn-main-echarts" style={{ width: "100%", height: 360 }}></div></Spin>
        <div className="zn-title-top zn-mt-top">反馈列表</div>
        <div className="zn-select-div" id="zn-select" >
          <Select value={reducer.type} style={{ width: 120 }} onChange={this.handleChange.bind(this)} getPopupContainer={() => document.getElementById("zn-select")} >
            {reducer.typeList && reducer.typeList.length ? reducer.typeList.map((val, i) => {
              return <Option key={val.id} value={val.id}>{val.type}</Option>
            }) : ""}
          </Select>
        </div>
        <div className="lxx-md-m-table">
          <Table
            locale={noDate}
            loading={reducer.loading_advise_t}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            onChange={this.handleTableChange.bind(this)}
          />
          <div className='zn-page-box'>
            <span className='zn-page-first' onClick={this.turnFirst}>首页</span>
            <Pagination
              pageSize={reducer.pagination.pageSize}
              current={reducer.pagination.currentPage}
              total={reducer.pagination.total}
              onChange={this.pageChangeHandle}
              itemRender={itemRender}
            />
            <span className='zn-page-last' onClick={this.turnLast}>尾页</span>
          </div>
          <div className="zn-nc-total">
            共{reducer.pagination.total}条记录，页面
              <InputNumber
              max={allPage}
              step={'1'}
              min={1}
              className="zn-notic-key-up"
              onKeyUp={this.pageTurn}
            />
            /{allPage}页
          </div>
        </div>
        <Modal
          visible={reducer.viewModalShow}
          width={'45%'}
          wrapClassName='hf-nb-wrap'
          footer={null}
          closable={false}
          onCancel={this.props.closeModal_action}
        >
          <CheckNotic />
        </Modal>
      </div>
    )
  }
}