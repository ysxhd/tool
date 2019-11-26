/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:22:26
 */

import React from 'react';
import { Table, Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzlTeaTable extends React.Component {
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
    }, {
      title: '教师',
      dataIndex: 'tea',
      width: 200,
      align: 'left',
    }, {
      title: '课程数',
      dataIndex: 'num',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }, {
      title: '评分',
      dataIndex: 'fen',
      width: 200,
      align: 'left',
      sorter: true,
      sortOrder: false,
    }];
    const data = [{
      id: '1',
      name: 'John Brown',
      tea: "向婷",
      num: 15,
      fen: 89,
    }, {
      id: '2',
      name: 'John Brown',
      tea: "向婷",
      num: 15,
      fen: 89,
    }, {
      id: '3',
      name: 'John Brown',
      tea: "向婷",
      num: 15,
      fen: 89,
    }, {
      id: '4',
      name: 'John Brown',
      tea: "向婷",
      num: 15,
      fen: 89,
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

export default KtzlTeaTable;