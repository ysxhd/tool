/*
 * @Author: kangyl 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:37:06
 * 状态监督——日志列表组件
 */
import React, { Component} from 'react';
import { Pagination,Table,Icon, Divider,Select } from 'antd';
import WatClaTabParaInfo from './watClaTabParaInfo';
import '../../css/admin/watClaTabLog.css';
import _x from './../../js/_x/index';


export default class WatClaTabLog extends Component {
  constructor(props){
    super(props);
    this.state={
      currentPage: 1,
      perPage:10,
      date:[]   
    }
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.itemRender=this.itemRender.bind(this);
   
  }
  handleChangePage(page) {
    this.setState({
    currentPage: page,
    });
    let parm={
      id:this.props.id, 
      pageSize:this.state.perPage,
      pageIndex:page
    }
    this.request(parm)
  };
  handleChange(value){
    this.state.perPage=value;
    let parm={
      id:this.props.id, 
      pageSize:value,
      pageIndex:this.state.currentPage
    }
    this.request(parm)
  }
  componentWillMount(){ 
    // this.state.total=this.state.date.length;
    
  }
  componentDidMount(){
    let data={
      id:this.props.id,
      pageSize:this.state.perPage,
      pageIndex:this.state.currentPage
    }
    this.request(data);
  }
  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a className="kyl-wctl-wordStyle" >上一页</a>;
    } else if (type === 'next') {
      return <a className="kyl-wctl-wordStyle" >下一页</a>;
    }
    return originalElement;
  }
  request(parm){
    var req = {
      action: 'api/web/manager_manage_class_card/logs',
      data: parm
    }
    _x.util.request.formRequest(req, (res) => {
      if (res.data&&res.result) {
        let data=[];
        for(let i=0;i<res.data.length;i++){
          data.push(
            {
              onlineDate:res.data[i].onlineTime,
              offlineDate:res.data[i].offlineTime,
              key:i
            }
          )    
        }
        this.setState({
          date:{
            data:data,
            total:res.total
          }
        })
      } else {
        console.log("错误")
      }
    })
  }
  render(){
    const { Column, ColumnGroup } = Table;
    const total=this.state.date.total;
    const Option = Select.Option;
    const columns = [{
      title: '在线时间',
      dataIndex: "onlineDate",
      key:"onlineDate"
    }, {
      title: '离线时间',
      dataIndex: "offlineDate",
      key:"offlineDate"
    }]
    return (
      <div> 
        <div className="kyl-wctl-msgHeader">
          <Table className="kyl-wctl-table" columns={columns} dataSource={this.state.date.data}  
          pagination={{ simple:true, current: this.state.currentPage,pageSize:this.state.perPage,
             onChange: this.handleChangePage, total:this.state.date.total ,
            itemRender:this.itemRender}} />
        </div>
        <div className="kyl-wctl-footer">共{this.state.date.total}条数据，每页
          <Select defaultValue="10" className="kyl-wctl-select" onChange={this.handleChange}>
            <Option value={10} >10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
        条</div>
      </div>
    )
   }
}