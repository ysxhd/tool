/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:23:22
 */

import React from 'react';
import { Table, Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzlInitDataTable extends React.Component {
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
      width: 200,
      align: 'left',
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '班级',
      dataIndex: 'class',
      width: 200,
      align: 'left',
    }, {
      title: '授课老师',
      dataIndex: 'teacher',
      width: 140,
      align: 'left',
    }, {
      title: '科目',
      dataIndex: 'subject',
      width: 200,
      align: 'left',
    }, {
      title: '评分老师',
      dataIndex: 'pfTea',
      width: 140,
      align: 'left',
    }, {
      title: '评分',
      dataIndex: 'pf',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'time',
      width: 200,
      align: 'left',
    }];
    const data = [{
      id: '1',
      name: "文学与传媒学院",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      pfTea: "敢为天",
      pf: 100,
      time: "2020-12-15",
    }, {
      id: '2',
      name: "文学与传媒学院",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      pfTea: "敢为天",
      pf: 100,
      time: "2020-12-15",
    }, {
      id: '3',
      name: "文学与传媒学院",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      pfTea: "敢为天",
      pf: 100,
      time: "2020-12-15",
    }, {
      id: '4',
      name: "文学与传媒学院",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      pfTea: "敢为天",
      pf: 100,
      time: "2020-12-15",
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

export default KtzlInitDataTable;