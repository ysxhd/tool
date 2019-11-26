import React from 'react';
import { Table, Pagination } from 'antd';
import { SVG } from '../../common'

export default class TeaReportAtt1 extends React.Component {

    jumpPage = (pageNumber) => {
        console.log(pageNumber);
      }

  render() {

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
      };
      let show = { color: "#3498db" };
  
      const columns = [{
        title: '报告名',
        dataIndex: 'name',
        render: text => <a href="javascript:;">{text}</a>,
      }, {
        title: '生成时间',
        dataIndex: 'age',
      }, {
        title: '',
        dataIndex: 'address',
        render: (text, record, index) => {
          let n = "onMouse" + index;
          return <div className="zn-report-sear"
            onMouseLeave={() => {
              console.log(n)
              this.setState({ [n]: false })
            }
            }
            onMouseOver={() => { this.setState({ [n]: true }) }}>
            <SVG color={n ? "#3498db" : "inherit"} type="search" />
            <span style={n ? show : { color: "inherit" }}>查看报告</span>
          </div>
        }
      }];
      const data = [{
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
      }, {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      }, {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      }, {
        key: '4',
        name: 'Disabled User',
        age: 99,
        address: 'Sidney No. 1 Lake Park',
      }];
  
    return (
        <div className="zn-bg">
        <Table
          align='right'
          className="zn-report-table"
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          dataSource={data} />
        <div className="kyl-kt-clear">
          <span className="kyl-kt-pageInfo">每页14条数据，共1000条</span>
          <input className="kyl-kt-jumpZdPage"></input>
          <Pagination className="kyl-kt-fy" showQuickJumper defaultCurrent={2} total={500} onChange={this.jumpPage} />
        </div>
      </div>
      
    );
  }
}
