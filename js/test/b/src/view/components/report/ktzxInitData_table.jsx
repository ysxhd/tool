/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-05 09:23:09
 */

import React from 'react';
import { Table, Pagination } from 'antd';
import '../../../css/ktzx_table.css';

class KtzxInitDataTable extends React.Component {
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
      title: '上课班级',
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
      width: 140,
      align: 'left',
    }, {
      title: '课类型',
      dataIndex: 'classType',
      width: 140,
      align: 'left',
    }, {
      title: '违纪对象',
      dataIndex: 'wjObj',
      width: 140,
      align: 'left',
    }, {
      title: '违纪事件',
      dataIndex: 'wjThing',
      width: 200,
      align: 'left',
    }, {
      title: '扣分',
      dataIndex: 'kouf',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'time',
      width: 200,
      align: 'left',
    }, {
      title: '记录人',
      dataIndex: 'who',
      width: 140,
      align: 'left',
    }];
    const data = [{
      id: '1',
      name: "文学",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      classType: 60,
      wjObj: "60%",
      wjThing: "打群架",
      kouf: 15,
      time: "2020-12-15",
      who: "向婷",
    }, {
      id: '2',
      name: "文",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      classType: 60,
      wjObj: "60%",
      wjThing: "打群架",
      kouf: 15,
      time: "2020-12-15",
      who: "向婷",
    }, {
      id: '3',
      name: "文学与传",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      classType: 60,
      wjObj: "60%",
      wjThing: "打群架",
      kouf: 15,
      time: "2020-12-15",
      who: "向婷",
    }, {
      id: '4',
      name: "文学与",
      class: 'John Brown',
      teacher: 32,
      subject: 100,
      classType: 60,
      wjObj: "60%",
      wjThing: "打群架",
      kouf: 15,
      time: "2020-12-15",
      who: "向婷",
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

export default KtzxInitDataTable;