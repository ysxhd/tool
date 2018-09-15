/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 16:53:12
 */

import React from 'react';
import { Table, Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzxXyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boxHei: 0
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps(props){
  
  }
  jumpPage = (pageNumber) => {
    console.log(pageNumber);
  }
  handleChange = (pagination,sorter) => {
    console.log(pagination);
    console.log(sorter);
  }
  render() {
    console.log(this.props.zxTableData);
    const comp = this.props.comp;
    const columns = [{
      title: '学院',
      dataIndex: 'name',
      width: 140,
      align: 'left'
    }, {
      title: '违纪次数',
      dataIndex: 'age',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }, {
      title: '违纪扣分',
      dataIndex: 'address',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }];
    let data = this.props.zxTableData.data?this.props.zxTableData.data:[];
    console.log(data);
    console.log(this.props.zxTableData.data?this.props.zxTableData.data:[])
    return (
      <div>
        <div className="kyl-kt-clear" >
          <Table
            key="table"
            className="zn-report-table"
            columns={columns}
            pagination={false}
            rowKey="id"
            // scroll={{ y: this.props.boxHei }}
            onChange={this.handleChange}
            dataSource={data} />
          <span className="kyl-kt-pageInfo">每页14条数据，共1000条</span>
          <input className="kyl-kt-jumpZdPage"></input>
          <Pagination className="kyl-kt-fy" showQuickJumper defaultCurrent={2} total={500} onChange={this.jumpPage} />
        </div>
      </div>
    );
  }
}

export default KtzxXyTable;