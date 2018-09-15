/*
 * @Author: kyl 
 * @Date: 2018-08-29 10:24:01 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-13 12:42:30
 */


import React from 'react';
import { Select, Checkbox, DatePicker, Table, Pagination, Input, message } from 'antd';
import moment from 'moment';
import { SVG } from '../../common';
import '../../../css/college_table.css';
import KtzxWjsjTable from './ktzxWjsj_table';
import KtzlTeaTable from './ktzlTea_table';
import _x from '../../../js/_x/index';
import G from '../../../js/g';

const Option = Select.Option;
const Format = _x.util.date.format;
class WjsjTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked1: true,             //课堂秩序checked--学校
      isChecked2: false,             //课堂秩序checked--学院
      isChecked3: true,             //课堂质量checked--学校
      isChecked4: false,             //课堂质量checked--学院
      selObj: 0,                     //选择的对象
      disNum: 0,                     //String类型违纪次数排序 0表示降序 1表示升序,默认降序
      selDate: Format(new Date(), 'yyyy/MM/dd'),          //选择秩序的开始日期
      selDate1: Format(new Date(), 'yyyy/MM/dd'),          //选择秩序的结束日期
      selDate2: Format(new Date(), 'yyyy/MM/dd'),           //选择质量的开始日期
      selDate3: Format(new Date(), 'yyyy/MM/dd'),          //选择质量的结束日期
      jigouSel: [],                      //质量机构data
      jigouSelVal: "",                  //课堂质量机构筛选val
      teacher: [],                       //质量老师data
      teacherVal: "",                    //质量老师val
      page: 1,                           //秩序当前页码
      page1: 1,                          //质量当前页码
      pageSize: 20,                      //秩序每页的条目
      pageSize1: 20,                     //质量每页的条目
      zxTableData: {},                   //秩序表格数据
      zlTableData: { data: {} },                    //质量表格数据
      data: [],
      data1: [],
      countOrder: 0,                     //课程数 1升序 0降序
      scoreOrder: 0,                     //评分   1升序 0降序
      inputValue: '',
      inputValue1: '',
      loading: true
    }
  }

  componentDidMount() {
    console.log(G);
    let jigouSel = [], college = [];
    this.setState({
      jigouSel: G.trgList,
      // college: G.trgList
      selDate: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate1: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
      selDate2: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate3: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
    }, () => {
      this.setState({ jigouSelVal: this.state.jigouSel[0] ? this.state.jigouSel[0].trgId : '' }, () => {
        if (this.props.comp !== "课堂秩序违纪事件报表") {
          this.teaDataReq({ "trgId": this.state.jigouSelVal });
        } else {
          let params = {
            "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
            "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          }
          this.disReq(params);
        }
      })
      // this.setState({ collegeVal: this.state.college[0] ? this.state.college[0].trgId : '' })
    })
  }
  /**
   * 违纪事件table请求
   */
  disReq = (params) => {
    this.setState({
      loading: true,
    })
    _x.util.request.request('api/web/classroom_order_report/get_dis_report', params, (res) => {
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
  /**
   * 教师Table请求
   */
  teaReq = (params) => {
    this.setState({
      loading: true,
    })
    _x.util.request.request('api/web/class_score/teacher_report', params, (res) => {
      if (res.result && res.data) {
        console.log(res.data);
        this.setState({
          zlTableData: res.data.pageContent,
        }, () => {
          let data1 = this.state.zlTableData;
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
          data1: [],
          loading: false
        })
      }
    })
  }

  /**
   * 老师下拉列表请求
   */
  teaDataReq = (params) => {
    console.log(params);
    _x.util.request.request('api/web/common/college_tea_dropdown', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          teacher: res.data
        }, () => {
          this.setState({
            teacherVal: this.state.teacher[0] ? this.state.teacher[0].teacherId : ''
          }, () => {
            let params = {
              "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
              "teacherId": this.state.teacherVal, //默认all
              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
              "timeType": 0, // 0：自定义
              "startDate": this.state.selDate2,
              "endDate": this.state.selDate3,  //
              "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
              "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
              "pageIndex": this.state.page1,//页数
              "pageSize": this.state.pageSize1//每页条数
            }
            this.teaReq(params);
          })
        })
      }
    })
  }

  /**
   * 课堂秩序
   * 选择开始时间
   */
  onPanelChange = (value, mode) => {
    console.log(value, mode);
    let selDate = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate
    }, () => {
      let params = {
        "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.disReq(params);

    })
  }
  /**
   * 课堂秩序
   * 选择结束时间
   */
  onPanelChange1 = (value, mode) => {
    console.log(value, mode);
    let selDate1 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate1
    }, () => {
      let params = {
        "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.disReq(params);
    })
  }
  /**
   * 课堂秩序
   * 违纪对象
   */
  clickJG = (e) => {
    this.setState({
      selObj: e,
    }, () => {
      let params = {
        "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
        "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      }
      this.disReq(params);
    })
  }
  /**
   * 课堂质量
   * 选择机构
   */
  clickJG1 = (e) => {
    console.log(e);
    this.setState({
      jigouSelVal: e
    }, () => {
      this.teaDataReq({ "trgId": this.state.jigouSelVal });
    })
  }
  /**
   * 课堂质量
   * 违纪对象
   */
  clickJG2 = (e) => {
    console.log(e);
    this.setState({
      teacherVal: e
    }, () => {
      let params = {
        "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
        "teacherId": this.state.teacherVal, //默认all
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
        "timeType": 0, // 0：自定义
        "startDate": this.state.selDate2,
        "endDate": this.state.selDate3,  //
        "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
        "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      }
      this.teaReq(params);
    })
  }
  /**
   * 课堂质量
   * 选择开始时间
   */
  onPanelChange2 = (value, mode) => {
    console.log(value, mode);
    let date = new Date(value._d);
    let selDate2 = date.getTime();
    this.setState({
      selDate2
    }, () => {
      let params = {
        "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
        "teacherId": this.state.teacherVal, //默认all
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
        "timeType": 0, // 0：自定义
        "startDate": this.state.selDate2,
        "endDate": this.state.selDate3,  //
        "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
        "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      }
      this.teaReq(params);
    })
  }
  /**
   * 课堂质量
   * 选择结束时间
   */
  onPanelChange3 = (value, mode) => {
    console.log(value, mode);
    let date = new Date(value._d);
    let selDate3 = date.getTime();
    this.setState({
      selDate3
    }, () => {
      let params = {
        "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
        "teacherId": this.state.teacherVal, //默认all
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
        "timeType": 0, // 0：自定义
        "startDate": this.state.selDate2,
        "endDate": this.state.selDate3,  //
        "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
        "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      }
      this.teaReq(params);
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
    if (this.props.comp === "课堂秩序违纪事件报表") {
      if (sorter.columnKey === 'number') {
        this.setState({
          disNum: orKey
        }, () => {
          let params = {
            "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
            "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          }
          this.disReq(params);
        })
      }
    } else {
      if (sorter.columnKey === 'researchCount') {
        this.setState({
          countOrder: orKey
        }, () => {
          let params = {
            "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
            "teacherId": this.state.teacherVal, //默认all
            "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
            "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
            "timeType": 0, // 0：自定义
            "startDate": this.state.selDate2,
            "endDate": this.state.selDate3,  //
            "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
            "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
            "pageIndex": this.state.page1,//页数
            "pageSize": this.state.pageSize1//每页条数
          }
          this.teaReq(params);
        })
      } else {
        this.setState({
          scoreOrder: orKey
        }, () => {
          let params = {
            "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
            "teacherId": this.state.teacherVal, //默认all
            "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
            "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
            "timeType": 0, // 0：自定义
            "startDate": this.state.selDate2,
            "endDate": this.state.selDate3,  //
            "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
            "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
            "pageIndex": this.state.page1,//页数
            "pageSize": this.state.pageSize1//每页条数
          }
          this.teaReq(params);
        })
      }
    }

  }

  /**
   * 秩序分页
   */
  jumpPage = (pageNumber) => {
    if (this.props.comp === "课堂秩序违纪事件报表") {
      this.setState({
        page: pageNumber
      }, () => {
        let params = {
          "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
          "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.disReq(params);
      })
    } else {
      this.setState({
        page1: pageNumber
      }, () => {
        let params = {
          "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
          "teacherId": this.state.teacherVal, //默认all
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
          "timeType": 0, // 0：自定义
          "startDate": this.state.selDate2,
          "endDate": this.state.selDate3,  //
          "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
          "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        }
        this.teaReq(params);

      })
    }
  }
  /**
     * 输入框值
     */
  changeInput = (e) => {
    if (this.props.comp === "课堂秩序违纪事件报表") {
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
    if (this.props.comp === "课堂秩序违纪事件报表") {
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
          "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
          "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.disReq(params);
      })
    } else {
      let p = this.state.inputValue1;
      if (p > Math.ceil(this.state.zlTableData.total / this.state.pageSize1)) {
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
          "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
          "teacherId": this.state.teacherVal, //默认all
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
          "timeType": 0, // 0：自定义
          "startDate": this.state.selDate2,
          "endDate": this.state.selDate3,  //
          "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
          "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        }
        this.teaReq(params);
      })
    }
  }

  /**
   * 课堂秩序
   */
  dcTable = () => {
    let params = {
      "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
      "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
      "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
      "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
      "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
      "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
    }
    _x.util.request.request('api/web/classroom_order_report/export_dis_report', params, (res) => {
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
   * 课堂质量
   */
  dcTable1 = () => {
    let params = {
      "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
      "teacherId": this.state.teacherVal, //默认all
      "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
      "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
      "timeType": 0, // 0：自定义
      "startDate": this.state.selDate2,
      "endDate": this.state.selDate3,  //
      "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
      "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
    }
    _x.util.request.request('api/web/class_score/export_score_teacher', params, (res) => {
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
      title: '违纪事件',
      dataIndex: 'eventName',
      width: 140,
      align: 'left',
    }, {
      title: '次数',
      dataIndex: 'number',
      width: 200,
      align: 'left',
      sorter: true,
    }];

    const columns1 = G.isVer === "0" ? [{
      title: '教师',
      dataIndex: 'teacher',
      width: 200,
      align: 'left',
    }, {
      title: '课程数',
      dataIndex: 'researchCount',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '评分',
      dataIndex: 'researchScore',
      width: 200,
      align: 'left',
      sorter: true,
    }] : [{
      title: '学院',
      dataIndex: 'college',
      width: 140,
      align: 'left',
    }, {
      title: '教师',
      dataIndex: 'teacher',
      width: 200,
      align: 'left',
    }, {
      title: '课程数',
      dataIndex: 'researchCount',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '评分',
      dataIndex: 'researchScore',
      width: 200,
      align: 'left',
      sorter: true,
    }];
    return (
      // <div className="kyl-crc-allBox">
      //   <table></table>
      <div className="kyl-crc-tableBox" >
        {/* 头部内容 */}
        {
          this.props.comp === "课堂秩序违纪事件报表" ?
            <div className="kyl-crc-header">
              <div className="kyl-crc-HContent">
                {
                  G.isVer === "0"
                    ?
                    ""
                    :
                    <div style={{ display: "inline-block" }}>
                      <span className="kyl-crc-xkdw" style={{ marginLeft: 0 }}>巡课单位&nbsp;:&nbsp;</span>
                      <Checkbox checked={this.state.isChecked1} onChange={() => {
                        this.setState({
                          isChecked1: !this.state.isChecked1
                        }, () => {
                          let params = {
                            "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
                            "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
                            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          }
                          this.disReq(params)
                        })
                      }}>学校</Checkbox>
                      <Checkbox checked={this.state.isChecked2} onChange={() => {
                        this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                          let params = {
                            "startTime": this.state.selDate, //开始时间 ，如果type！= 4 则 为0;//
                            "endTime": this.state.selDate1, //结束时间，如果type！= 4 则 为0;//
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "roleType": this.state.selObj,//Integer类型，1表示学生，2表示老师，0表示全部//
                            "disNum": this.state.disNum,//String类型违纪次数排序 0表示降序 1表示升序,没点击为空//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          }
                          this.disReq(params)
                        })
                      }}>学院</Checkbox>
                    </div>
                }
                <span>违纪对象&nbsp;:&nbsp;</span>
                <Select
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  defaultValue="0"
                  showSearch={true}
                  style={{ width: 200 }}
                  getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                  onChange={this.clickJG}>
                  <Option title="全部对象" value="0">全部对象</Option>
                  <Option title="老师" value="2">老师</Option>
                  <Option title="学生" value="1">学生</Option>
                </Select>
                <span className="kyl-crc-sj">时间&nbsp;:&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="开始时间"
                  defaultValue={moment(this.state.selDate, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange} />
                <span>&nbsp;--&nbsp;</span>
                <DatePicker
                  allowClear={false}
                  placeholder="结束时间"
                  defaultValue={moment(this.state.selDate1, dateFormat)}
                  format={dateFormat}
                  className="kyl-crc-selectSj"
                  style={{ width: "140px" }}
                  onChange={this.onPanelChange1} />
                <span className="kyl-crc-dcbb" onClick={this.dcTable}>
                  <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                  导出报表</span>
              </div>
            </div>
            :
            <div className="kyl-crc-header" style={{ height: "115px" }} ref={(ref) => this.hdbox = ref}>
              <div className="kyl-crc-HContent">
                <span>{G.isVer === "0" ? "教师" : "机构"}&nbsp;:&nbsp;</span>
                {
                  G.isVer === "0"
                    ?
                    ""
                    :
                    <Select
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={this.state.jigouSelVal}
                      showSearch={true}
                      style={{ minWidth: "11%" }}
                      getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                      onChange={this.clickJG1}>
                      {/* 学院 */}
                      {
                        this.state.jigouSel.map((item, index) => (
                          <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                        ))
                      }
                    </Select>
                }
                {/* 老师 */}
                <Select
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  value={this.state.teacherVal}
                  showSearch={true}
                  style={{ minWidth: "11%", marginLeft: '15px' }}
                  getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                  onChange={this.clickJG2}>
                  {
                    this.state.teacher.map((item, index) => (
                      <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                    ))
                  }
                </Select>
                <span className="kyl-crc-dcbb" onClick={this.dcTable1}>
                  <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                  导出报表</span>
                <div style={{ marginTop: "15px" }}>
                  {
                    G.isVer === "0"
                      ?
                      ""
                      :
                      <div style={{ display: "inline-block" }}>
                        <span>听课安排&nbsp;:&nbsp;</span>
                        <Checkbox checked={this.state.isChecked3} onChange={() => {
                          this.setState({
                            isChecked3: !this.state.isChecked3
                          }, () => {
                            let params = {
                              "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
                              "teacherId": this.state.teacherVal, //默认all
                              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
                              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
                              "timeType": 0, // 0：自定义
                              "startDate": this.state.selDate2,
                              "endDate": this.state.selDate3,  //
                              "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
                              "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
                              "pageIndex": this.state.page1,//页数
                              "pageSize": this.state.pageSize1//每页条数
                            }
                            this.teaReq(params);
                          })
                        }}>学校</Checkbox>
                        <Checkbox checked={this.state.isChecked4} onChange={() => {
                          this.setState({
                            isChecked4: !this.state.isChecked4
                          }, () => {
                            let params = {
                              "trgId": this.state.jigouSelVal,//默认传all，代表全部选中
                              "teacherId": this.state.teacherVal, //默认all
                              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
                              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院（school和college中必定选中一个）
                              "timeType": 0, // 0：自定义
                              "startDate": this.state.selDate2,
                              "endDate": this.state.selDate3,  //
                              "countOrder": this.state.countOrder,//1正序 0反序 -1 不选择
                              "scoreOrder": this.state.scoreOrder, // 1正序 0反序  -1 不选择
                              "pageIndex": this.state.page1,//页数
                              "pageSize": this.state.pageSize1//每页条数
                            }
                            this.teaReq(params);
                          })
                        }}>学院</Checkbox>
                      </div>
                  }
                  <span className="kyl-crc-sj" style={{ marginLeft: G.isVer === "0" ? "0px" : "15px" }}>时间&nbsp;:&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="开始时间"
                    defaultValue={moment(this.state.selDate1, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px", marginLeft: "15px" }}
                    onChange={this.onPanelChange2} />
                  <span>&nbsp;--&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="开始时间"
                    defaultValue={moment(this.state.selDate1, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px" }}
                    onChange={this.onPanelChange3} />
                </div>
              </div>
            </div>
        }
        {/* 表格内容 */}
        <div className="kyl-crc-body">
          {
            this.props.comp === "课堂秩序违纪事件报表" ?
              <div className="kyl-kt-clear" >
                <Table
                  key="table"
                  className="zn-report-table"
                  columns={columns}
                  pagination={false}
                  loading={this.state.loading}
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
                      <span className="kyl-kt-pageInfo">每页20条数据，共{this.state.zlTableData.total}条</span>
                      <Input
                        className="kyl-kt-jumpZdPage"
                        onChange={this.changeInput}
                        onPressEnter={this.handleChangePage} />
                      <Pagination className="kyl-kt-fy"
                        showQuickJumper
                        defaultCurrent={1}
                        current={this.state.page1}
                        total={this.state.zlTableData.total}
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

export default WjsjTable;