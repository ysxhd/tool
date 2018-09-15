/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:22:48
 */

import React from 'react';
import { Table, Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzxTaskTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  jumpPage = (pageNumber) => {
    console.log(pageNumber);
  }
  render() {
    const comp = this.props.comp;
    const columns = [{
      title: '学院',
      dataIndex: 'name',
      width: 140,
      align: 'left',
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '巡课人',
      dataIndex: 'age',
      width: 200,
      align: 'left',
      // sorter: true,
      // sortOrder: false,
    }, {
      title: '任务数',
      dataIndex: 'num',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }, {
      title: '完成数',
      dataIndex: 'finNum',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }, {
      title: '完成率',
      dataIndex: 'finLv',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }];
    const data = [{
      id: '1',
      name: 'John Brown',
      age: 32,
      num: 100,
      finNum: 60,
      finLv: "60%"
    }, {
      id: '2',
      name: 'Jim Green',
      age: 42,
      num: 100,
      finNum: 60,
      finLv: "60%"
    }, {
      id: '3',
      name: 'Joe Black',
      age: 32,
      num: 100,
      finNum: 60,
      finLv: "60%"
    }, {
      id: '4',
      name: 'Disabled User',
      age: 99,
      num: 100,
      finNum: 60,
      finLv: "60%"
    }];
    return (
      <div>
        <div className="kyl-kt-clear">
          <Table
            key="table"
            className="zn-report-table"
            columns={columns}
            pagination={false}
            rowKey="id"
            // scroll={{ y: this.props.boxHei }} 
            dataSource={data} />
          <span className="kyl-kt-pageInfo">每页14条数据，共1000条</span>
          <input className="kyl-kt-jumpZdPage"></input>
          <Pagination className="kyl-kt-fy" showQuickJumper defaultCurrent={2} total={500} onChange={this.jumpPage} />
        </div>
      </div>
    );
  }
}

export default KtzxTaskTable;