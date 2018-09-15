/*
 * @Author: JC.liu 
 * @Date: 2018-06-15 10:34:30 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-11 16:58:52
 * 通知管理 下部分
 */
import React, { Component } from 'react';
import { Table, Modal, Pagination, InputNumber } from 'antd';
import { ViewNotic } from './viewNotic';
import { connect } from 'react-redux';
import { view_notice, eidtNotice_action, allNoticBtn_action, notic_check_all } from '../../redux/notic/tableOperat.redux';
import { ModalConfrim, ModalSuccess } from '../public/modal';
import { setConfig, request as ajax } from '../../js/clientRequest';
import './notic.css';
import { format } from '../../js/_x/util/date';
import { getPlaceData_action, push_enptyFloor_action } from '../../redux/place/place.redux';
import { G as server_config } from '../../js/../js/global'

@connect(state => state, { view_notice, eidtNotice_action, allNoticBtn_action, notic_check_all, getPlaceData_action, push_enptyFloor_action })
export default class Notic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: false
    };
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


  componentDidMount() {
    //判断是否存在buildingId 存在则用存在的id 请求  如果没有id  则重新请求场所
    if (this.props.placeReducer.nowBuilding) {
      // id 存在 请求场所 push 全部楼层
      this.props.getPlaceData_action(this.props.placeReducer.nowBuilding);
      // 请求通知
      this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding,this.props.TableOperatReducer.searchText, 1);
    } else {
      this.props.allNoticBtn_action("", this.props.TableOperatReducer.searchText, 1);
      this.props.getPlaceData_action("");
    }
  }

  componentWillReceiveProps() {
    if (this.props.TableOperatReducer.isError) {
      ModalSuccess.show({ data: this.props.TableOperatReducer.errMes });
    }
  }

  // 输入分页，回车跳转
  pageTurn = (event) => {
    let newNumber = event.target.value,
          isNum = /^[0-9]+$/.test(newNumber);
    // 拿到输入的文字
    if(isNum || event.keyCode == 8){
    if (event.keyCode == 13) {
      if(isNaN(Number(newNumber))){
        ModalSuccess.show({ data: "输入的页码不能输入特殊字符,只能为数字" });
        return;
      }
      //输入页码大于总页数
      if (newNumber > this.props.TableOperatReducer.pagination.totalPage) {
        ModalSuccess.show({ data: "输入的页码不能大于总页数" });
        return;
      }
      //输入页码小于1
      if (newNumber < 1) {
        ModalSuccess.show({ data: "输入页码必须大于0" });
        return;
      }
      // 对输入的页数进行判断，为数字类型并且存在
      this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding,this.props.TableOperatReducer.searchText, Number(newNumber));

      this.props.notic_check_all([], []);
    }
  }else{
    ModalSuccess.show({ data: "只能为纯数字" });
  }
  }

  // 跳到第一页
  turnFirst = () => {
    // 进行判断，当前页数是不是第一页，如果不是，就执行跳转
    if (this.props.TableOperatReducer.pagination.currentPage == 1) {
      return false;
    }
    this.props.notic_check_all([], []);
    this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, this.props.TableOperatReducer.searchText, 1);
  }

  // 分页点击 上一页/下一页/具体页码
  pageChangeHandle = (page) => {
    //去掉全选
    this.props.notic_check_all([], []);
    this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, this.props.TableOperatReducer.searchText, page);
  }

  // 跳到尾页
  turnLast = () => {
    // 进行判断，当前页数是不是最后一页，如果不是，就执行跳转
    if (this.props.TableOperatReducer.pagination.currentPage == this.props.TableOperatReducer.pagination.totalPage) {
      return false;
    }
    //去掉全选
    this.props.notic_check_all([], []);
    this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, this.props.TableOperatReducer.searchText, this.props.TableOperatReducer.pagination.totalPage);
  }


  /**
   * 查看通知管理的显示modal 
   */
  viewNoticShow = (record) => {
    // redux 管理查看通知
    this.props.view_notice(record)
  }

  // 点击删除按钮
  deleteNotic = (record) => {
    // 拿到点击删除那条的id,并显示操作提示框 
    ModalConfrim.show({
      okFn: () => {
        ajax("message/delete_notice_id", { "noticeid": [record.noticeid] },
          res => {
            if (res.data.result) {
              ModalSuccess.show({ data: "刪除成功", flag: true });
               //清空checkbox选中状态
              this.props.notic_check_all([],[]);
              this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, "", 1);
            } else {
              ModalSuccess.show({ data: res.data.message });
            }
          })
      }
    })
  }

  render() {
    // 数据数组，判断 首次渲染，用父级传来的数组，不是首次渲染，用接口返回的数组渲染
    let props = this.props.TableOperatReducer;
    let dataSource = props.contentList;
    let dataBox = [];
    dataSource.map((val, i) => {
      //转换日期格式
      var change = new Date(val.noticeTime);
      change = format(change, "yyyy-MM-dd HH:mm:ss");
      val = { ...val, key: i, noticeTime: change };
      dataBox.push(val);
    })
    // const pagination = this.state.pagination;
    // columns 表格列的配置描述
    const columns = [{
      title: '时间',
      dataIndex: 'noticeTime',
      key: 'noticeTime',
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '教学楼',
      dataIndex: 'buildingName',
      key: 'buildingName',
      render: (text, record, index) => (
        <div title={
          text.reduce((prev,next)=>{
            return prev + "/" + next;
          })
        } className="zn-table-limit">
          {
           text.reduce((prev,next)=>{
            return prev + "/" + next;
          })
          }
        </div>
      )
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      width: 200,
      align: 'center',
      render: (text, record, index) => (
        <div className="hf-nc-icons">
          <i className="iconfont icon-check hf-nc-icon" onClick={() => this.viewNoticShow(record)} ></i>
          <i className="iconfont icon-edit hf-nc-icon" onClick={() => this.props.eidtNotice_action(true, true, record)}></i>
          <i className="iconfont icon-delete hf-nc-icon" onClick={() => { this.deleteNotic(record) }}></i>
        </div>
      )
    }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        // 获取选中的所有id
        let arr = [];
        selectedRows.map((val) => {
          arr.push(val.noticeid);
        });
        //存入到reducer当中
        this.props.notic_check_all(arr, selectedRowKeys);
      },
      selectedRowKeys: props.rowkeys,
      getCheckboxProps: record => ({
        disabled: false,
      }),
    };
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
      <div className="hf-nc-main xq-nc-main">
        <Table
          locale={noDate}
          columns={columns}
          dataSource={dataBox}     // 数据数组
          loading={props.loadingT}
          rowKey="key"        // 表格行 key 的取值，可以是字符串或一个函数
          rowSelection={rowSelection}     // 列表项是否可选择  上面进行了配置
          pagination={{ pageSize: 10 }}
          onChange={this.tableChange}
        >
        </Table>
        {
          props.pagination.total ?
           <div>
              <div className='xq-page-box'>
              <span className='xq-page-first' onClick={this.turnFirst}>首页</span>
              <Pagination
                pageSize={props.pagination.pageSize}
                current={props.pagination.currentPage}
                total={props.pagination.total}
                onChange={this.pageChangeHandle}
                itemRender={itemRender}
              />
              <span className='xq-page-last' onClick={this.turnLast}>尾页</span>
            </div>
            <div className="hf-nc-total">
              共{props.pagination.total}条记录，页面
              <InputNumber
                max={props.pagination.totalPage}
                step={'1'}
                min={1}
                className="xq-notic-key-up"
                onKeyUp={this.pageTurn}
              />
              /{props.pagination.totalPage}页
            </div>
           </div>:""
        }


        {/* 查看通知modal */}
        <ViewNotic />
      </div>
    )
  }
}