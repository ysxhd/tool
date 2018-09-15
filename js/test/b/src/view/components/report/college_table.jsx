/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-13 15:37:40
 */

import React from 'react';
import { Select, Checkbox, DatePicker, Table, Pagination, Input, message } from 'antd';
import moment from 'moment';
import { SVG } from '../../common';
import '../../../css/college_table.css';
import KtzxXyTable from './ktzxXy_table';
import KtzlXyTable from './ktzlXy_table';
import _x from '../../../js/_x/index';
import G from '../../../js/g';

const Option = Select.Option;
const Format = _x.util.date.format;
class CollegeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked1: true,             //课堂秩序checked
      isChecked2: false,             //课堂秩序checked
      isChecked3: true,             //课堂质量checked
      isChecked4: false,             //课堂质量checked
      selDate1: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量开始时间
      selDate2: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量结束时间
      selDate3: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量结束时间
      selDate4: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量结束时间
      jigouSel: [],                   //机构筛选
      college: [],                    //学院
      jigouSelName: "",                //选择机构的名字
      jigouSelVal: "",                //课堂秩序机构筛选
      collegeVal: "",                 //学院选择
      selObj: 0,                      //选择的对象  默认为全部0  老师2  学生1
      disNum: 0,                      //数量的排序  
      disPoints: 0,                   //分数的排序  
      countOrder: 0,                 //1正序 0反序 -1 不选择
      scoreOrder: 0,                 // 1正序 0反序  -1 不选择
      page: 1,                        //秩序当前页数
      page1: 1,                        //质量当前页数
      pageSize: 20,                   //秩序每页显示的条目
      pageSize1: 20,                   //质量每页显示的条目
      startTime: '',                   //开始时间
      endTime: '',                     //结束时间
      zxTableData: {},                 //秩序表格数据
      zlTableData: {
        data: {}
      },                 //质量表格数据
      inputValue: '',                   //秩序分页框
      inputValue1: '',                   //质量分页框
      data: [],
      data1: [],
      loading: true,
    }
  }

  componentDidMount() {
    console.log(G.trgList);
    let jigouSel = [], college = [];
    this.setState({
      jigouSel: G.trgList,
      college: G.trgList,
      jigouSelName: G.trgList && G.trgList.length ? G.trgList[0].trgName : "",
      jigouSelVal: G.trgList && G.trgList.length ? G.trgList[0].trgId : "",
      collegeVal: G.trgList && G.trgList.length ? G.trgList[0].trgId : "",
      selDate1: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate2: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
      selDate3: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate4: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
    }, () => {
      this.setState({ jigouSelVal: this.state.jigouSel[0] ? this.state.jigouSel[0].trgId : '' })
      this.setState({ collegeVal: this.state.college[0] ? this.state.college[0].trgId : '' })
      let params = {
        "startTime": this.state.selDate1, //开始时间 
        "endTime": this.state.selDate2, //结束时间
        "gradeName": this.state.jigouSelName, //String类型，学院名字//
        "gradeId": this.state.jigouSelVal, //String类型，学院ID//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
        "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      let params1 = {
        "trgId": this.state.collegeVal,//学院id// 默认传all
        "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0,// 0：自定义
        "startDate": this.state.selDate3,//timestamp
        "endDate": this.state.selDate4,
        "countOrder": this.state.countOrder, //1正序 0反序
        "scoreOrder": this.state.scoreOrder, // 1正序 0反序
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      };
      console.log(params1);
      this.props.comp === "课堂秩序学院报表" ? this.reqTable(params) : this.reqQuaTable(params1);
    })

  }
  /**
   * 课堂秩序
   */
  reqTable = (params) => {
    this.setState({
      loading: true
    })
    _x.util.request.request('api/web/classroom_order_report/get_academy_report', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          zxTableData: res
        }, () => {
          let data = this.state.zxTableData.data;
          for (let i = 0; i < data.length; i++) {
            data[i].key = 'index' + i;
          }
          this.setState({
            data,
            loading: false
          })
        })
      } else {
        this.setState({
          data: [],
          loading: false
        })
      }
    })
  }

  reqQuaTable = (params) => {
    this.setState({
      loading: true
    })
    _x.util.request.request('api/web/class_score/college_view', params, (res) => {
      if (res.result && res.data) {
        console.log(res);
        this.setState({
          zlTableData: res
        }, () => {
          let data1 = this.state.zlTableData.data.pageContent;
          console.log(data1);
          for (let i = 0; i < data1.length; i++) {
            data1[i].key = 'index' + i;
          }
          this.setState({
            data1,
            loading: false
          })
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }

  /** 
   * 课堂秩序
   * 选择机构
   */
  clickJG = (e) => {
    console.log(e);
    this.setState({
      jigouSelVal: e
    }, () => {
      for (let i = 0; i < this.state.jigouSel.length; i++) {
        if (this.state.jigouSel[i].trgId === e) {
          this.setState({
            jigouSelName: this.state.jigouSel[i].trgName
          }, () => {
            let params = {
              "startTime": this.state.selDate1, //开始时间 
              "endTime": this.state.selDate2, //结束时间
              "gradeName": this.state.jigouSelName, //String类型，学院名字//
              "gradeId": this.state.jigouSelVal, //String类型，学院ID//
              "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
              "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
              "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
              "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
              "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
              "pageSize": this.state.pageSize,//每页显示条数//
              "pageIndex": this.state.page//当前页//
            }
            console.log(params);
            this.reqTable(params)
          })
        }
      }
    })
  }
  /** 
   * 课堂秩序
   * 选择事件
   */
  clickSJ = (e) => {
    console.log(e);
    this.setState({
      selObj: e
    }, () => {
      console.log(this.state.jigouSelVal);
      let params = {
        "startTime": this.state.selDate1, //开始时间 
        "endTime": this.state.selDate2, //结束时间
        "gradeName": this.state.jigouSelName, //String类型，学院名字//
        "gradeId": this.state.jigouSelVal, //String类型，学院ID//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
        "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.reqTable(params)
    })
  }
  /** 
   * 课堂质量
   * 选择机构
   */
  clickJG1 = (e) => {
    console.log(e);
    this.setState({
      collegeVal: e
    }, () => {
      let params = {
        "trgId": this.state.collegeVal,//学院id// 默认传all
        "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0,// 0：自定义
        "startDate": this.state.selDate3,//timestamp
        "endDate": this.state.selDate4,
        "countOrder": this.state.countOrder, //1正序 2反序
        "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      };
      this.reqQuaTable(params)
    })
  }
  /** 
   * 课堂质量
   * 选择事件
   */
  clickSJ1 = (e) => {
    console.log(e);

  }
  /**
   * 课堂秩序
   * 选择日期
   */
  onPanelChange = (value, mode) => {
    //开始时间
    console.log(new Date(value._d), mode);
    let selDate1 = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate1
    }, () => {
      let params = {
        "startTime": this.state.selDate1, //开始时间 
        "endTime": this.state.selDate2, //结束时间
        "gradeName": this.state.jigouSelName, //String类型，学院名字//
        "gradeId": this.state.jigouSelVal, //String类型，学院ID//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
        "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.reqTable(params)
    })
  }
  onPanelChange1 = (value, mode) => {
    //结束时间
    console.log(value._d, mode);
    let selDate2 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate2
    }, () => {
      let params = {
        "startTime": this.state.selDate1, //开始时间 
        "endTime": this.state.selDate2, //结束时间
        "gradeName": this.state.jigouSelName, //String类型，学院名字//
        "gradeId": this.state.jigouSelVal, //String类型，学院ID//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
        "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.reqTable(params)
    })
  }
  /**
   * 课堂质量
   * 选择日期
   */
  onPanelChange2 = (value, mode) => {
    //开始时间
    console.log(value, mode);
    let selDate3 = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate3
    }, () => {
      let params = {
        "trgId": this.state.collegeVal,//学院id// 默认传all
        "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0, //0：自定义
        "startDate": this.state.selDate3,//timestamp
        "endDate": this.state.selDate4,
        "countOrder": this.state.countOrder, //1正序 2反序
        "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      }
      this.reqQuaTable(params)
    })
  }
  onPanelChange3 = (value, mode) => {
    //结束时间
    console.log(value, mode);
    let selDate4 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate4
    }, () => {
      let params = {
        "trgId": this.state.collegeVal,//学院id// 默认传all
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0, //0：自定义
        "startDate": this.state.selDate3,//timestamp
        "endDate": this.state.selDate4,
        "countOrder": this.state.countOrder, //1正序 2反序
        "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      }
      this.reqQuaTable(params)
    })
  }

  /**
   * 秩序排序
   */
  handleTableChange = (pagination, filters, sorter) => {
    console.log(sorter.columnKey);
    console.log(sorter.order);
    let order = sorter.order, orKey;
    order === 'ascend' ? orKey = 1 : orKey = -1;
    if (this.props.comp === "课堂秩序学院报表") {
      if (sorter.columnKey === 'totalNumber') {
        this.setState({
          disNum: orKey
        }, () => {
          let params = {
            "startTime": this.state.selDate1, //开始时间 
            "endTime": this.state.selDate2, //结束时间
            "gradeName": this.state.jigouSelName, //String类型，学院名字//
            "gradeId": this.state.jigouSelVal, //String类型，学院ID//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
            "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          }
          this.reqTable(params);
        })
      } else {
        this.setState({
          disPoints: orKey
        }, () => {
          let params = {
            "startTime": this.state.selDate1, //开始时间 
            "endTime": this.state.selDate2, //结束时间
            "gradeName": this.state.jigouSelName, //String类型，学院名字//
            "gradeId": this.state.jigouSelVal, //String类型，学院ID//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
            "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          }
          this.reqTable(params);
        })
      }
    } else {
      if (sorter.columnKey === 'courseComplete') {
        this.setState({
          countOrder: orKey
        }, () => {
          let params = {
            "trgId": this.state.collegeVal,//学院id// 默认传all
            "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
            "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
            "timeType": 0, //0：自定义
            "startDate": this.state.selDate3,//timestamp
            "endDate": this.state.selDate4,
            "countOrder": this.state.countOrder, //1正序 2反序
            "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
            "pageIndex": this.state.page1,//页数
            "pageSize": this.state.pageSize1//每页条数
          }
          this.reqQuaTable(params)
        })
      } else {
        this.setState({
          scoreOrder: orKey
        }, () => {
          let params = {
            "trgId": this.state.collegeVal,//学院id// 默认传all
            "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
            "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
            "timeType": 0, //0：自定义
            "startDate": this.state.selDate3,//timestamp
            "endDate": this.state.selDate4,
            "countOrder": this.state.countOrder, //1正序 2反序
            "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
            "pageIndex": this.state.page1,//页数
            "pageSize": this.state.pageSize1//每页条数
          }
          this.reqQuaTable(params)
        })
      }
    }
  }
  /**
   * 秩序分页
   */
  jumpPage = (pageNumber) => {
    if (this.props.comp === "课堂秩序学院报表") {
      this.setState({
        page: pageNumber
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 
          "endTime": this.state.selDate2, //结束时间
          "gradeName": this.state.jigouSelName, //String类型，学院名字//
          "gradeId": this.state.jigouSelVal, //String类型，学院ID//
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
          "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
          "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.reqTable(params);
      })
    } else {
      this.setState({
        page1: pageNumber
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,//学院id// 默认传all
          "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0, //0：自定义
          "startDate": this.state.selDate3,//timestamp
          "endDate": this.state.selDate4,
          "countOrder": this.state.countOrder, //1正序 2反序
          "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        }
        this.reqQuaTable(params)
      })
    }

  }
  /**
     * 输入框值
     */
  changeInput = (e) => {
    if (this.props.comp === "课堂秩序学院报表") {
      let val = e.target.value,
        isNum = /^[0-9]+$/.test(val);
      if (isNum) {
        this.setState({
          inputValue: Number(val)
        });
      } else {
        message.warning('请输入纯数字！');
      }
    } else {
      let val = e.target.value,
        isNum = /^[0-9]+$/.test(val);
      if (isNum) {
        this.setState({
          inputValue1: Number(val)
        });
      } else {
        message.warning('请输入纯数字！');
      }
    }
  }
  /**
     * 输入框回车回调
     */
  handleChangePage = () => {
    if (this.props.comp === "课堂秩序学院报表") {
      let p = this.state.inputValue;
      if (p > Math.ceil(this.state.zxTableData.total / this.state.pageSize)) {
        message.warning('输入的页码不能大于当前总页数!');
        return;
      }
      if (p <= 0) {
        message.warning('输入的页码有误!');
        return;
      }
      this.setState({
        page: p,
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 
          "endTime": this.state.selDate2, //结束时间
          "gradeName": this.state.jigouSelName, //String类型，学院名字//
          "gradeId": this.state.jigouSelVal, //String类型，学院ID//
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
          "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
          "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.reqTable(params);
      })
    } else {
      let p = this.state.inputValue1;
      if (p > Math.ceil(this.state.zxTableData.total / this.state.pageSize1)) {
        message.warning('输入的页码不能大于当前总页数!');
        return;
      }
      if (p <= 0) {
        message.warning('输入的页码有误!');
        return;
      }
      this.setState({
        page1: p,
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,//学院id// 默认传all
          "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0, //0：自定义
          "startDate": this.state.selDate3,//timestamp
          "endDate": this.state.selDate4,
          "countOrder": this.state.countOrder, //1正序 2反序
          "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        }
        this.reqQuaTable(params)
      })
    }
  }
  /**
   * 导出课堂秩序报表
   */
  dcTable = () => {
    let params = {
      "startTime": this.state.selDate1, //开始时间 
      "endTime": this.state.selDate2, //结束时间
      "gradeName": this.state.jigouSelName, //String类型，学院名字//
      "gradeId": this.state.jigouSelVal, //String类型，学院ID//
      "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
      "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
      "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
      "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
      "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
    }
    _x.util.request.request('api/web/classroom_order_report/export_academy_report', params, (res) => {
      if (res.result && res.data) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "display: none");
        iframe.setAttribute("src", G.dataServices + res.data);
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(iframe);
      }
    })
  }

  /**
   * 到处课堂质量报表
   */
  dcTable1 = () => {
    let params = {
      "trgId": this.state.collegeVal,//学院id// 默认传all
      "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
      "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
      "timeType": 0, //0：自定义
      "startDate": this.state.selDate3,//timestamp
      "endDate": this.state.selDate4,
      "countOrder": this.state.countOrder, //1正序 2反序
      "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
    }
    _x.util.request.request('api/web/class_score/export_score_college', params, (res) => {
      if (res.result && res.data) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "display: none");
        iframe.setAttribute("src", G.dataServices + res.data);
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(iframe);
      }
    })
  }

  render() {
    const dateFormat = 'YYYY-MM-DD';
    const columns = [{
      title: G.isVer === "0" ? "班级" : '学院',
      dataIndex: 'collegeName',
      width: 140,
      align: 'left'
    }, {
      title: '违纪次数',
      dataIndex: 'totalNumber',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '违纪扣分',
      dataIndex: 'deductScore',
      width: 200,
      align: 'left',
      sorter: true,
    }];
    let data = this.state.zxTableData.data;
    const columns1 = [{
      title: '学院',
      dataIndex: 'college',
      width: 140,
      align: 'left',
    }, {
      title: '课程数',
      dataIndex: 'courseComplete',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '评分',
      dataIndex: 'courseScore',
      width: 200,
      align: 'left',
      sorter: true,
    }];
    let data1 = this.state.zlTableData.data.pageContent;
    return (
      // <div className="kyl-crc-allBox">
      //   <table></table>
      <div className="kyl-crc-tableBox" >
        {/* 头部内容 */}
        < div className="kyl-crc-header" >
          {
            this.props.comp === "课堂秩序学院报表"
              ?
              <div className="kyl-crc-HContent">
                <span>{G.isVer === "0" ? "班级" : "机构"}&nbsp;:&nbsp;</span>
                {
                  G.isVer === "0"
                    ?
                    /**普教 ----班级*/
                    <Select
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={this.state.jigouSelVal}
                      getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                      showSearch={true}
                      style={{ minWidth: "11%" }}
                      onChange={this.clickJG}>
                      {
                        this.state.jigouSel.map((item, index) => (
                          <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                        ))
                      }
                    </Select>
                    :
                    /**高教 */
                    <Select
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={this.state.jigouSelVal}
                      getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                      showSearch={true}
                      style={{ minWidth: "11%" }}
                      onChange={this.clickJG}>
                      {
                        this.state.jigouSel.map((item, index) => (
                          <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                        ))
                      }
                    </Select>
                }

                {
                  G.isVer === "0"
                    ?
                    /* 普教 */
                    ""
                    :
                    /* 高教 */
                    <div style={{ display: "inline-block" }}>
                      <span className="kyl-crc-xkdw">巡课单位&nbsp;:&nbsp;</span>
                      <Checkbox checked={this.state.isChecked1} onChange={() => {
                        this.setState({ isChecked1: !this.state.isChecked1 }, () => {
                          let params = {
                            // 课堂质量
                            "startTime": this.state.selDate1, //开始时间 
                            "endTime": this.state.selDate2, //结束时间
                            "gradeName": this.state.jigouSelName, //String类型，学院名字//
                            "gradeId": this.state.jigouSelVal, //String类型，学院ID//
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
                            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
                            "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          }
                          this.reqTable(params)
                        })
                      }}>学校</Checkbox>
                      <Checkbox checked={this.state.isChecked2} onChange={() => {
                        this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                          let params = {
                            // 课堂质量
                            "startTime": this.state.selDate1, //开始时间 
                            "endTime": this.state.selDate2, //结束时间
                            "gradeName": this.state.jigouSelName, //String类型，学院名字//
                            "gradeId": this.state.jigouSelVal, //String类型，学院ID//
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
                            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为-1//
                            "disPoints": this.state.disPoints,//String类型违纪扣分排序 0表示降序 1表示升序，没点击为-1//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          }
                          this.reqTable(params)
                        })
                      }}>学院</Checkbox>
                    </div>
                }
                <span className="kyl-crc-shij">事件&nbsp;:&nbsp;</span>
                <Select
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="0" showSearch={true} style={{ minWidth: "11%" }}
                  getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                  onChange={this.clickSJ}>
                  <Option title="全部对象" value="0">全部对象</Option>
                  <Option title="老师" value="2">老师</Option>
                  <Option title="学生" value="1">学生</Option>
                </Select>
                <span className="kyl-crc-sj">时间&nbsp;:&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="开始时间"
                  defaultValue={moment(this.state.selDate1, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange} />
                <span>&nbsp;--&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="结束时间"
                  defaultValue={moment(this.state.selDate2, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange1} />
                <span className="kyl-crc-dcbb" onClick={this.dcTable}>
                  <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                  导出报表
              </span>
              </div>
              :
              <div className="kyl-crc-HContent">
                <span>机构&nbsp;:&nbsp;</span>
                {/* 学院 */}
                <Select
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  value={this.state.collegeVal}
                  showSearch={true} style={{ minWidth: "11%" }}
                  getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                  onChange={this.clickJG1}>
                  {
                    this.state.college.map((item, index) => (
                      <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                    ))
                  }
                </Select>
                <span className="kyl-crc-xkdw">听课安排&nbsp;:&nbsp;</span>
                <Checkbox checked={this.state.isChecked3} onChange={() => {
                  this.setState({ isChecked3: !this.state.isChecked3 }, () => {
                    let params1 = {
                      //课堂秩序
                      "trgId": this.state.collegeVal,//学院id// 默认传all
                      "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
                      "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
                      "timeType": 0,// 0：自定义
                      "startDate": this.state.selDate3,//timestamp
                      "endDate": this.state.selDate4,
                      "countOrder": this.state.countOrder, //1正序 2反序
                      "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
                      "pageIndex": this.state.page1,//页数
                      "pageSize": this.state.pageSize1//每页条数
                    };
                    this.reqQuaTable(params1)
                  })
                }}>学校</Checkbox>
                <Checkbox checked={this.state.isChecked4} onChange={() => {
                  this.setState({ isChecked4: !this.state.isChecked4 }, () => {
                    let params1 = {
                      //课堂秩序
                      "trgId": this.state.collegeVal,//学院id// 默认传all
                      "school": this.state.isChecked3 ? 1 : 0, //0不选中 1选中 学校
                      "college": this.state.isChecked4 ? 1 : 0,//0不选中 1选中 学院
                      "timeType": 0,// 0：自定义
                      "startDate": this.state.selDate3,//timestamp
                      "endDate": this.state.selDate4,
                      "countOrder": this.state.countOrder, //1正序 2反序
                      "scoreOrder": this.state.scoreOrder, // 3正序 4反序  countorde和scoreOrder中只有一个有值，另一个为null
                      "pageIndex": this.state.page1,//页数
                      "pageSize": this.state.pageSize1//每页条数
                    };
                    this.reqQuaTable(params1)
                  })
                }}>学院</Checkbox>
                <span className="kyl-crc-sj">时间&nbsp;:&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="开始时间"
                  defaultValue={moment(this.state.selDate2, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange2} />
                <span>&nbsp;--&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="结束时间"
                  defaultValue={moment(this.state.selDate3, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange3} />
                <span className="kyl-crc-dcbb" onClick={this.dcTable1}>
                  <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                  导出报表
                </span>
              </div>
          }

        </div>
        {/* 表格内容 */}
        < div className="kyl-crc-body" >
          {
            this.props.comp === "课堂秩序学院报表" ?
              <div className="kyl-kt-clear" >
                <Table
                  key="table"
                  className="zn-report-table"
                  columns={columns}
                  pagination={false}
                  loading={this.state.loading}
                  // scroll={{ y: this.props.boxHei }}
                  onChange={this.handleTableChange}
                  dataSource={this.state.data} />
                {
                  this.state.data.length === 0 ? "" :
                    <div>
                      <span className="kyl-kt-pageInfo">每页20条数据，共{this.state.zxTableData.total}条</span>
                      <Input
                        className="kyl-kt-jumpZdPage"
                        onChange={this.changeInput}
                        onPressEnter={this.handleChangePage} />
                      <Pagination className="kyl-kt-fy"
                        showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page}
                        total={this.state.zxTableData.total}
                        onChange={this.jumpPage}
                        pageSize={20}
                      />
                    </div>
                }
              </div>
              :
              <div className="kyl-kt-clear">
                <Table
                  key="table"
                  className="zn-report-table"
                  columns={columns1}
                  pagination={false}
                  loading={this.state.loading}
                  // scroll={{ y: this.props.boxHei }}
                  onChange={this.handleTableChange}
                  dataSource={this.state.data1} />
                {
                  this.state.data1.length === 0 ? "" :
                    <div>
                      <span className="kyl-kt-pageInfo">每页20条数据，共{this.state.zxTableData.total}条</span>
                      <Input
                        className="kyl-kt-jumpZdPage"
                        onChange={this.changeInput}
                        onPressEnter={this.handleChangePage} />
                      <Pagination className="kyl-kt-fy"
                        showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page}
                        total={this.state.zxTableData.total}
                        onChange={this.jumpPage}
                        pageSize={20}
                      />
                    </div>
                }
              </div>
          }
        </div>
      </div>
      // </div >
    );
  }
}

export default CollegeTable;