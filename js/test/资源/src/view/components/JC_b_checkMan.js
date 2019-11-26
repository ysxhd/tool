/*
 * @Author: JC.Liu 
 * @Date: 2018-07-30 17:30:57 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:25:35
 * 管理- 审核管理 中间内容 组件
 */
import '../../css/JC_b_check_man.css';
import React, { Component } from 'react';
import { Tabs, Checkbox, Radio, Select, Button, Pagination, Input } from 'antd';
import { SVG, HfModal } from '../common';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  CheckMan_searchResult_ac,
  request_YTW_ac, getCurrentYTW_ac,
  getAll_COT_ac,
  year_sem_SelectChange_ac,
  col_sub_Change_ac,
  teacher_Change_ac,
  weekSelectChange_ac,
  auto_check,
  pass_or_refues_ac,
  get_Default_Check_Info_ac,
  chioce_one_ac
} from '../../redux/JC_b_checkMan.reducer';
import number from '../../js/_x/util/number';
import noData from '../../icon/null_b.png';
import { format } from '../../js/_x/util/date';
import { SpinLoad } from '../common';
import _x from '../../js/_x';
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const goWith = _x.util.url.goWith;

@connect(state => state.CheckMan_Reducer, {
  // 查询按钮
  CheckMan_searchResult_ac,
  // 获取年份 学期 周次关系
  request_YTW_ac,
  // 获取当前年份 学期 周次关系
  getCurrentYTW_ac,
  // 获取全部学院 科目 获取
  getAll_COT_ac,
  // 年份下拉change
  year_sem_SelectChange_ac,
  // 选择学院 科目
  col_sub_Change_ac,
  // 选择老师
  teacher_Change_ac,
  // 周选择
  weekSelectChange_ac,
  // 自动审核 公有 私有 直播
  auto_check,
  // 获取审核信息
  get_Default_Check_Info_ac,
})
class CheckManContent extends Component {
  constructor() {
    super();
    this.state = {
      // 用type 来区分 0 课堂发布 1 直播审核
      type: 0,
      static: {
        allNum: 500,
        pass: 235,
        refuse: 123,
        wait: 213
      },
      // 区分是发布到公有还是私有  0 公有   1 私有
      radioDefaultValue: 0
    }
    this.searchReq = {};
    this.searchReq = {};
  }

  componentDidMount() {
    // 获取所有年 学期 周次
    this.props.request_YTW_ac();
    // 获取当前年 学期 周
    this.props.getCurrentYTW_ac(this.state.radioDefaultValue, parseInt(this.state.type));
    // 获取所有 学院 科目 老师
    this.props.getAll_COT_ac();
    // 获取自动审核信息 （公有 私有  直播）
    this.props.get_Default_Check_Info_ac();

  }

  // tab 标签页的切换
  TabChange = (v) => {
    this.setState({
      type: parseInt(v)
    })
    // this.componentDidMount();
    // 获取所有年 学期 周次
    this.props.request_YTW_ac();
    // 获取当前年 学期 周
    this.props.getCurrentYTW_ac(this.state.radioDefaultValue, parseInt(v));
    // 获取所有 学院 科目 老师
    this.props.getAll_COT_ac();
  }

  // 发布到公有/私有的申请
  radioChange = (e) => {
    this.setState({
      radioDefaultValue: e.target.value
    })
    // 切换公有私有请求一次查询接口
    if (e.target.value === 0) {
      // 公有查询
      this.props.CheckMan_searchResult_ac(this.searchReq, this.staticReq, "public")
    } else {
      // 私有查询
      this.props.CheckMan_searchResult_ac(this.searchReq, this.staticReq, "pri")
    }
  }

  // 学期信息 根据学年来查找对应的学期信息 
  semInfo = () => {
    let currentYaer = this.props.currentY;
    let data = this.props.YearSemWeekInfo;
    let YearTarget = _.find(data, { acdYearId: currentYaer });
    if (YearTarget) {
      return YearTarget.semList.map((item, index) => {
        return <Option key={index} value={item.semTypeId} >{item.semTypeId === 1 ? "上学期" : "下学期"}</Option>
      })
    }
  }

  // 周次信息
  weekInfo = () => {
    // 获取当前学年  当前学期 进行查找
    let data = this.props.YearSemWeekInfo;
    let currentYaer = this.props.currentY;
    let YearTarget = _.find(data, { acdYearId: currentYaer });
    if (YearTarget) {
      // 查询条件 是当前的学期
      let semList = YearTarget.semList;
      let SemTarget = _.find(semList, { semTypeId: this.props.currentSType })
      let weekNum = SemTarget.totalWeeks;
      let arr = [];
      for (var i = 0; i < weekNum; i++) {
        arr.push(i + 1)
      }
      return arr.map((item, index) => {
        return <Option key={index} value={index + 1}>第{number.toChinese(item + 0)}周</Option>
      })
    }
  }

  // 查询按钮
  handleSearch() {
    // 点击查询  清空下边数据中的ids

    if (this.state.type === 0) {
      if (this.state.radioDefaultValue === 0) {
        // 公有查询
        this.props.CheckMan_searchResult_ac(this.searchReq, this.staticReq, "public")
      } else {
        // 私有查询
        this.props.CheckMan_searchResult_ac(this.searchReq, this.staticReq, "pri")
      }
    } else {
      // 查询直播
      this.props.CheckMan_searchResult_ac(this.searchReq, this.staticReq, "live")
    }
  }

  // render 统计
  staticTotalList = () => {
    const total = this.props.staticTotal;
    let staticList = [];
    for (var k in total) {
      staticList = [
        { name: "申请总数", num: total['applyTotalCount'], svg: "applyTotal" },
        { name: "已通过", num: total['passCount'], svg: "pass" },
        { name: "已拒绝", num: total['denyCount'], svg: "refuse" },
        { name: "待审核", num: total['approveCount'], svg: "waitCheck" }
      ]
    }
    return staticList;
  }

  render() {
    const props = this.props;
    const staticList = this.staticTotalList();
    this.searchReq = {
      acdYearId: props.currentY,
      semTypeId: props.currentSType,
      weekNum: props.currentW,
      grdGroupId: props.currrentCollege,
      subjectId: props.currentSubject,
      teacherId: props.currentTeacher,
      currentPage: 1,
      pageSize: 20,
    }
    this.staticReq = {
      acdYearId: props.currentY,
      semTypeId: props.currentSType,
      weekNum: props.currentW,
      grdGroupId: props.currrentCollege,
      subjectId: props.currentSubject,
      teacherId: props.currentTeacher,
    }
    return (
      <div className="JC-cm-wrap">
        <div className="JC-cm-top">
          <div className="JC-cm-top-rol1">
            <span className="JC-cm-name" >审核管理</span>
            <Tabs onChange={this.TabChange} defaultActiveKey="0">
              <TabPane tab="课堂发布" key="0"></TabPane>
              <TabPane tab="直播审核" key="1"></TabPane>
            </Tabs>
            {
              this.state.type === 0 ?
                <div className="JC-inline  JC-bm-checkbox">

                  <Checkbox value="public"
                    checked={props.defaultCheckInfo.publicStatus === 1 ? true : false}
                    onClick={(e) => props.auto_check(e, "publicStatus")}>自动审核公有申请
                  </Checkbox>
                  <Checkbox value="pri"
                    checked={props.defaultCheckInfo.privateStatus === 1 ? true : false}
                    onClick={(e) => props.auto_check(e, "privateStatus")}>自动审核私有申请
                  </Checkbox>
                </div>
                : ""
            }
            <div className="JC-inline JC-bm-radio">
              {
                this.state.type === 0 ?
                  <RadioGroup onChange={this.radioChange} defaultValue={this.state.radioDefaultValue}>
                    <Radio value={0}>发布到公有的申请</Radio>
                    <Radio value={1}>发布到私有的申请</Radio>
                  </RadioGroup>
                  :
                  <Checkbox value="live" checked={props.defaultCheckInfo.liveStatus === 1 ? true : false}
                    onClick={(e) => props.auto_check(e, "liveStatus")}
                  >自动审核</Checkbox>
              }
            </div>
          </div>
          <div className="JC-cm-top-rol2">
            {/* 学年 */}
            <Select value={props.currentY} onChange={(value) => props.year_sem_SelectChange_ac("currentY", value, props.currentSType)}>
              {
                props.YearSemWeekInfo.map((item, index) => (
                  <Option key={index} value={item.acdYearId} >{item.acdYearId} 学年</Option>
                ))
              }
            </Select>
            {/* 学期 */}
            <Select value={props.currentSType} onChange={(value) => props.year_sem_SelectChange_ac("currentSType", value)} >
              {this.semInfo()}
            </Select>
            {/* 周次 */}
            <Select value={props.currentW} onChange={(value) => props.weekSelectChange_ac(value)} >
              {this.weekInfo()}
            </Select>
            {/* 学院 */}
            <Select value={props.currrentCollege} onChange={(value) => props.col_sub_Change_ac(value, props.all_AOT, "college")} >
              <Option value="all" >全部学院</Option>
              {
                props.all_AOT.map((item, index) => (
                  <Option key={index} value={item.trgId}>{item.trgName}</Option>
                ))
              }
            </Select>
            {/* 科目 */}
            <Select value={props.currentSubject} onChange={(value) => props.col_sub_Change_ac(value, props.subject, "subject")} >
              <Option value="all" >全部科目</Option>
              {
                this.props.subject.length ?
                  this.props.subject.map((item, index) => (
                    <Option key={index} value={item.subjectId}>{item.subName}</Option>
                  ))
                  : null
              }
            </Select>
            {/* 老师 */}
            <Select value={props.currentTeacher} onChange={(value) => props.teacher_Change_ac(value)} >
              <Option value="all" >全部老师</Option>
              {
                props.teacher.length ?
                  props.teacher.map((item, index) => (
                    <Option key={index} value={item.userId}>{item.username}</Option>
                  ))
                  : null
              }
            </Select>
            <Button className="JC-cm-tol2-btn lxx-s-blue" onClick={() => this.handleSearch()}>查询</Button>
          </div>
        </div>
        <div className="lxx-g-boxShadow"></div>
        {/* 下边数据 */}
        <CheckManInfo
          staticList={staticList}
          radioDefaultValue={this.state.radioDefaultValue}
          tabType={this.state.type}
          searchReq={this.searchReq}
          staticReq={this.staticReq}
        // onClickSearh={this.state.onClickSearh}
        />
      </div>
    )
  }
}

@connect(state => state.CheckMan_Reducer, {
  CheckMan_searchResult_ac,
  // 拒绝 或 通过  
  pass_or_refues_ac,

})
class CheckManInfo extends Component {
  constructor() {
    super();
    this.state = {
      chioceNum: 0,
      currentPage: 1,
      ids: [],
      radioDefaultValue: "",
      tabType: "",
      visible: false,
      curResourceId: "",
      textarea: ""
    }
    this.ids = [],
      this.someRefuse = ""
  }

  componentDidMount() {
    this.setState({
      tabType: this.props.tabType,
      radioDefaultValue: this.props.radioDefaultValue
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log("adc");

    if (prevState.tabType !== nextProps.tabType || prevState.radioDefaultValue !== nextProps.radioDefaultValue) {
      return {
        ids: [],
        chioceNum: 0,
        currentPage: 1,
        tabType: nextProps.tabType,
        radioDefaultValue: nextProps.radioDefaultValue
      }
    }
    return false
  }

  // 翻页
  paginationChange = (page, pageSize) => {
    this.setState({
      currentPage: page,
      chioceNum: 0,
      ids: []
    })
    this.props.CheckMan_searchResult_ac(
      { ...this.props.searchReq, currentPage: page }, { ...this.props.staticReq, currentPage: page },
      this.props.tabType === 0 ?
        this.props.radioDefaultValue === 0 ?
          "public" : "pri"
        : "live"
    )
  }

  // 批量通过
  somePass = () => {
    this.props.pass_or_refues_ac(
      this.state.ids,
      "pass",
      true,
      this.props.radioDefaultValue,
      this.props.tabType,
      this.props.searchReq,
      this.props.staticReq
    )

    this.setState({
      ids: [],
      chioceNum: 0,
    })
  }

  // 批量拒绝
  someRefuseFun = () => {
    this.props.pass_or_refues_ac(
      this.state.ids,
      "refuse",
      true,
      this.props.radioDefaultValue,
      this.props.tabType,
      this.props.searchReq,
      this.props.staticReq,
      this.state.textarea
    )
    this.setState({
      ids: [],
      chioceNum: 0,
      visible: false,
    })
  }

  // 全选
  allChioce = (e) => {
    let ids = this.props.allIds;
    if (e.target.checked) {
      this.setState({
        ids
      })
    } else {
      this.setState({
        ids: []
      })
    }
  }

  // 勾选
  checkedOne = (e, id) => {
    let ids = this.state.ids
    if (e.target.checked) {
      if (ids.indexOf(id) < 0) {
        ids.push(id)
      }
    } else {
      if (ids.indexOf(id) > -1) {
        let index = ids.indexOf(id)
        // console.log("index:", index);
        ids.splice(index, 1)
      }
    }

    if (ids.length) {
      // console.log("ids:", ids);
    } else {
      // console.log("没有ids");
    }

    this.setState({
      ids
    })
  }

  /**
   * 单个通过或拒绝 
   * @param {any} id         id
   * @param {string} status  pass 通过  refuse 拒绝   
   * @param {any} boolean    区分单个 还是 批量  （由于批量和单个的action共用）
   * @param {any} pubNum     区分公有私有   0公有 1私有
   * @param {any} tabType    区分课堂发布 直播  0 课堂  1直播
   * @param {any} reason     原因
   */
  onePassOrRefus = (id, status, boolean, pubNum, tabType, reason) => {
    // 后两个参数：第一个是学年到老师的入参 ，另一个：统计接口的入参
    this.props.pass_or_refues_ac(id, status, boolean, pubNum, tabType, this.props.searchReq, this.props.staticReq, reason)
  }

  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      return <a>上一页</a>;
    } if (type === 'next') {
      return <a>下一页</a>;
    }
    return originalElement;
  }

  weekDay = (day) => {
    if (day === 1) {
      return "一"
    } else if (day === 2) {
      return "二"
    } else if (day === 3) {
      return "三"
    } else if (day === 4) {
      return "四"
    } else if (day === 5) {
      return "五"
    } else if (day === 6) {
      return "六"
    } else if (day === 7) {
      return "七"
    }
  }

  render() {
    const props = this.props;
    // console.log("ids:", this.state.ids);

    return (
      <div className="JC-cm-content-info" >
        <div className="JC-cm-static">
          <ul>
            {
              this.props.staticList.map((item, index) => (
                <li key={index} >
                  <div className="JC-inline JC-cm-list-svg"><SVG type={item.svg} width="50px" height="50px" /></div>
                  <div className="JC-inline JC-cm-list-desc" >
                    <div className="JC-cm-list-name" >{item.name}</div>
                    <div className="JC-cm-list-num" >{item.num}</div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="JC-cm-searchInfo">
          <div className="JC-cm-sI-top" >
            <Checkbox checked={this.props.allIds.length ? this.props.allIds.length === this.state.ids.length ? true : false : false}
              onClick={(e) => this.allChioce(e)}
            >
              已选择 {this.state.ids.length} 个课堂
            </Checkbox>
            <div className="JC-inline JC-cm-sI-btn ">
              <Button
                className={this.state.ids.length === 0 ? "lxx-s-blueUnable" : "lxx-s-blue"}
                disabled={this.state.ids.length === 0 ? true : false}
                onClick={this.somePass}>
                批量通过
                  </Button>
              <Button
                className={this.state.ids.length === 0 ? "lxx-s-orgUnable" : "lxx-s-orange"}
                disabled={this.state.ids.length === 0 ? true : false}
                onClick={() => {
                  this.someRefuse = true
                  this.setState({
                    visible: true,
                  })
                }}
              >
                批量拒绝
                  </Button>
            </div>
          </div>

          {/* list */}
          <div className="JC-cm-sI-list" >
            {
              this.props.loading ?
                <SpinLoad />
                :
                this.props.searchData.length ?
                  this.props.searchData.map((t, i) => (
                    <div className="JC-cm-sI-item" key={i} >
                      <div className="JC-cm-item-left JC-inline" >
                        <div className="JC-cm-item-tit" >
                          {
                            t.pass === 2 ?
                              <div className="JC-inline">
                                <Checkbox checked={this.state.ids.indexOf(t.curResourceId) === -1 ? false : true} onClick={(e) => this.checkedOne(e, t.curResourceId)}>&nbsp;&nbsp;
                                </Checkbox>
                                <p className="JC-inline" style={{ cursor: "pointer" }} onClick={() => {
                                  goWith({
                                    to: "q_recordVideo",
                                    with: [
                                      "admin",
                                      t.curResourceId,
                                      true
                                    ]
                                  })
                                }}>{t.curName}</p>
                              </div>
                              :
                              <div className="JC-inline" style={{ cursor: "pointer" }} onClick={() => {
                                goWith({
                                  to: "q_recordVideo",
                                  with: [
                                    "admin",
                                    t.curResourceId,
                                    true
                                  ]
                                })
                              }}>{t.curName}</div>
                          }
                        </div>
                        <div className="JC-cm-item-height" >
                          <span>科目：{t.subName}</span>
                          <span>授课时间：{format(new Date(t.actureStartTime), "yyyy-MM-dd")} &nbsp;&nbsp;(周{this.weekDay(t.weekday)})&nbsp;&nbsp;第{t.lessonOrder ? t.lessonOrder : "-"}节</span>
                          <span>授课老师：{t.teacherName}</span>
                          <span>授课场所：{t.classroomName}</span>
                        </div>
                        <div className="JC-cm-item-height">
                          <span>录播：{t.videoNum}</span>
                          <span>教案：{t.jiaoanNum}</span>
                          <span>导学：{t.daoxueNum}</span>
                          <span>习题：{t.xitiNum}</span>
                        </div>
                      </div>
                      {
                        // 审核的展示按钮
                        t.pass === 2 ?
                          <div className="JC-cm-item-right JC-inline" >
                            <Button className="lxx-s-blue"
                              onClick={() => this.onePassOrRefus(t.curResourceId, "pass", false, this.props.radioDefaultValue, this.props.tabType)}
                            >通过</Button>
                            <Button className="lxx-s-orange"
                              onClick={() => {
                                // this.onePassOrRefus(t.curResourceId, "refuse", false, this.props.radioDefaultValue, this.props.tabType)
                                this.setState({ visible: true, curResourceId: t.curResourceId })
                                this.someRefuse = false
                              }}
                            >拒绝</Button>
                          </div>
                          :
                          // 通过的展示已通过
                          t.pass === 1 ?
                            <div className="JC-cm-item-right JC-inline" style={{ textAlign: "center" }}>
                              <span>已通过</span>
                            </div>
                            :
                            // 已拒绝
                            <div className="JC-cm-item-right JC-inline" style={{ textAlign: "center" }} >
                              <span style={{ color: "red" }} >已拒绝</span>
                            </div>
                      }
                    </div>
                  ))
                  :
                  <div className="lxx-g-noData">
                    <img src={noData} />
                    <p>无数据</p>
                  </div>
            }
          </div>
          {/* 分页器 */}
          {
            !this.props.loading ?
              this.props.searchData.length ?
                <div className="JC-sh-pagination" >
                  <div className="JC-sh-showPageNum" >
                    共 {this.props.searchDataTotal} 条数据，每页显示 20 条
                </div>
                  <Pagination
                    total={this.props.searchDataTotal}
                    itemRender={this.itemRender}
                    onChange={this.paginationChange}
                    current={this.state.currentPage}
                    pageSize={20}
                  />
                </div>
                : null
              : null
          }
        </div>

        <HfModal
          title="操作提示"
          ModalShowOrHide={this.state.visible}
          width={600}
          closeModal={() => this.setState({ visible: false })}
          contents={
            <div className="JC-bm-cont">
              <p>发布审核不通过</p>
              <TextArea
                className="JC-bm-textarea"
                autosize={false}
                placeholder="请输入拒绝审核原因"
                onChange={(e) => this.setState({ textarea: e.target.value })}
              >
              </TextArea>
              <div className="hf-m-buttons">
                <Button
                  className="lxx-s-blue hf-m-button"
                  onClick={() => {
                    if (this.someRefuse) {
                      this.someRefuseFun()
                    } else {
                      this.onePassOrRefus(this.state.curResourceId, "refuse", false, this.props.radioDefaultValue, this.props.tabType, this.state.textarea)
                    }
                    this.setState({ visible: false, ids: [], chioceNum: 0, textarea: "" })
                  }} >确认</Button>
                <Button
                  className="lxx-s-wathet hf-m-button"
                  onClick={() => this.setState({ visible: false })}>取消</Button>
              </div>
            </div>
          }
        />

      </div>
    )
  }
}

export default CheckManContent;