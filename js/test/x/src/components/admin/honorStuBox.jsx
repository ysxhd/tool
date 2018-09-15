/*
 * @Author: JudyC 
 * @Date: 2018-01-05 10:33:14 
 * @Last Modified by: JCheng.L
 * @Last Modified time: 2018-03-23 13:47:04
 * 荣誉学生版块
 */
import '../../css/admin/honorStuBox.css';
import React, { Component } from 'react';
import { SVG, IMG } from "../base";
import HonorInfo from "./honorInfo";
import {PubHonor} from './index';
import { Button, Checkbox, Pagination, Select, Tabs, Card, Modal } from "antd";
import _x from '../../js/_x/index';
const Option = Select.Option;

let dateYear = new Date().getFullYear(); //2018
export default class HonorStuBox extends Component {
  constructor() {
    super();
    this.state = {
      data: [],//荣誉列表数据
      toolDownShow: "none",//荣誉操作栏
      visible: false,//modal框
      total: 0,
      yearData:[],
      pageIndex: 1,
      pageSize: 20,
      belongType: 3,//1班级2教师3学生
      yearDefValue: '',// 学年信息的默认值 默认最近学年
      pubState:0,//0发布1编辑
      uid:'',//事记id
    }
    this.acdId= [], 
    this.yearChange = this.yearChange.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.getStuHnData = this.getStuHnData.bind(this);
    this.getAcdYear = this.getAcdYear.bind(this);
  }

  componentWillMount() {
    this.getStuYearData();
  }

  // 获取学年数据
  getStuYearData() {
    let _this = this;
    let req = {
      action: "api/web/information/academic_year/find_semester",
      data: {}
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.acdId = [];
        _this.getAcdYear(rep.data)
        _this.setState({
          yearData: rep.data,
        })
      }
    })
  }

  // 设置默认近学年的年份
  getAcdYear(data) {
    let acdYear = dateYear - 1 + '_' + dateYear;
    for (let i = 0; i < data.length; i++) {
      this.acdId.push(data[i].acd_id);
    }
    if (this.acdId.indexOf(acdYear) > -1) {
      this.setState({
        yearDefValue: acdYear
      })
      this.getStuHnData(null, null, acdYear)
    } else {
      dateYear--;
      this.getAcdYear(data);
    }
  }

  // 下拉框 选取学年信息
  // 拿到value  遍历出yearData中的acd_id 在进行匹配，取到index，对应yearData中index的 uid
  yearChange(value) {
    this.setState({
      yearDefValue:value
    })
    this.getStuHnData(null, null, value)
  }

  // 荣誉数据
  getStuHnData(pi, ps, y) {
    let _this = this,
      pI = pi || _this.state.pageIndex,
      pS = ps || _this.state.pageSize,
      aY = y || _this.state.yearDefValue,
      bT = _this.state.belongType;
    let req = {
      action: '/api/web/information/manager_honor/find_all',
      data: {
        'pageIndex': pI,
        'pageSize': pS - 1,
        'academicYear': aY,
        'belongType': bT,
      }
    }
    _x.util.request.formRequest(req, function (rep) {
      if (rep.result) {
        _this.setState({
          data: rep.data.pageContent,
          total: rep.total,
          pageIndex: pI,
        })
      }
    })
  }


  showModal = (pubState,uid) => {
    this.setState({
      visible: true,
      pubState,
      uid
    });
  };

  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  // 下拉框选择每页条数
  selectChange(value) {
    if (value) {
      this.setState({
        pageSize: value,
        pageIndex: 1,
      });
      this.getAjaxData(1,value,this.state.yearDefValue);
    }
  }

  // 分页按钮
  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    } else if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  // 分页
  onChangePagination(page, pageSize) {
    this.getAjaxData(page, pageSize,this.state.yearDefValue )
  }


  render() {

    const toolListDown = {
      display: this.state.toolDownShow,
    }

    return (
      <div className="ljc-shn-hnctn" >
        <div className="ljc-chn-sel" >
          <Select value={this.state.yearDefValue} onChange={this.yearChange} >
            {
              this.state.yearData.map(dt => (
                <Option value={dt.acd_id} id={dt.uid} key={dt.uid} > {dt.acd_id} </Option>
              ))
            }
          </Select>
        </div>
        <div className="ljc-shn-addhn" onClick={()=>this.showModal(0)}>
          <Card >
            <SVG type="add-o" width="50px" height="50px" />
            <div className="ljc-shn-addtxt" >发布荣誉</div>
          </Card>
        </div>
        {
          this.state.data.map(data => (
            <HonorInfo 
              data={data} 
              key={data.uid} 
              belongType={this.state.belongType} 
              showModal={this.showModal}
              stuRengder={this.getStuHnData}
            ></HonorInfo>
          ))
        }

        {
          <div className="ljc-chn-bt" >
            <div className="ljc-chn-btL" >
              <span>共{this.state.total}条数据，每页&nbsp;
                <Select defaultValue={this.state.pageSize} onChange={this.selectChange}>
                  <Option value={20}>20</Option>
                  <Option value={40}>40</Option>
                  <Option value={80}>80</Option>
                  <Option value={100}>100</Option>
                </Select>&nbsp;
                  条</span>
            </div>
            <div className="ljc-chn-btR" >
              <Pagination
                pageSize={this.state.pageSize}
                current={this.state.pageIndex}
                total={this.state.total}
                onChange={this.onChangePagination}
                itemRender={this.itemRender} >
              </Pagination>
            </div>
          </div>
        }

        <Modal className="cjy-modal cjy-hn-modal" destroyOnClose="true" title={`${this.state.pubState===0?'发布':'编辑'}荣誉学生`} footer={null} visible={this.state.visible} onCancel={this.hideModal}>
          <PubHonor 
            hideModal={this.hideModal} 
            uid={this.state.uid} 
            academicYear={this.state.yearDefValue}
            belongType={this.state.belongType} 
            getClaHnData={this.getStuHnData} 
            pubState={this.state.pubState}/>
        </Modal>
      </div>
    );
  }
}