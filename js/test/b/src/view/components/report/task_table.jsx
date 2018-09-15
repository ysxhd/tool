/*
 * @Author: kyl 
 * @Date: 2018-08-29 10:30:46 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-13 15:59:27
 */


import React from 'react';
import { Select, Checkbox, DatePicker, Table, Pagination, Input, message } from 'antd';
import moment from 'moment';
import { SVG } from '../../common';
import '../../../css/college_table.css';
import KtzxTaskTable from './ktzxTask_table';
import KtzlTaskTable from './ktzlTask_table';
import _x from '../../../js/_x/index';
import G from '../../../js/g';

const Option = Select.Option;
const Format = _x.util.date.format;
class TaskTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked1: true,
      isChecked2: false,
      college: [],             //全部学院data
      teacher: [],             //全部老师data
      collegeVal: '',           //学院筛选VAL
      teacherVal: '',           //老师筛选VAL
      collegeName: G.trgList[0].trgName,           //学院名字
      selDate1: Format(new Date(), 'yyyy/MM/dd'),            //课堂秩序开始时间
      selDate2: Format(new Date(), 'yyyy/MM/dd'),            //课堂秩序结束时间
      selDate3: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量开始时间
      selDate4: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量结束时间
      taskNum: 0,           //String类型,任务数排序 
      completeNum: 0,       //String类型,完成数排序 
      completion: 0,        //String类型,完成率排序 
      page: 1,              //秩序
      pageSize: 20,
      page1: 1,              //质量
      pageSize1: 20,
      zxTableData: {},              //秩序
      zlTableData: {
        data: {
          pageContent: []
        }
      },      //质量
      data: [],                     //秩序表格数据
      data1: [],                    //质量表格数据
      courseCountOrder: 0,    //课程数量排序
      courseCompleteOrder: 0, //完成数排序
      courseRatioOrder: 0,    //完成率排序
      inputValue: '',          //秩序分页框输入内容
      inputValue1: '',          //质量分页框输入内容
      loading: true,
    }
  }

  componentDidMount() {
    let college = [], teacher = [];
    this.setState({
      college: G.trgList,
      selDate1: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate2: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
    }, () => {
      this.setState({
        collegeVal: this.state.college[0] ? this.state.college[0].trgId : '',
        // teacherVal: this.state.teacher[0] ? this.state.teacher[0].jgId : '', 
      }, () => {
        this.reqTea({ "trgId": this.state.collegeVal });
      })
    })
  }

  /**
   * 秩序请求老师数据
   */
  reqTea = (params) => {
    _x.util.request.request('api/web/common/get_teacher_trgId', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          teacher: res.data,
        }, () => {
          this.setState({
            teacherVal: this.state.teacher[0] ? this.state.teacher[0].teacherId : '',
          }, () => {
            let params = {
              "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
              "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
              "gradeName": this.state.collegeName, //String类型，学院唯一标识//
              "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
              "teacherId": this.state.teacherVal,//String类型，老师Id// 
              "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
              "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
              "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
              "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
              "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
              "pageSize": this.state.pageSize,//每页显示条数//
              "pageIndex": this.state.page//当前页//
            };
            let params1 = {
              "trgId": this.state.collegeVal,
              "teacherId": this.state.teacherVal,
              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
              "timeType": 0,  // 0：自定义
              "startDate": this.state.selDate1,
              "endDate": this.state.selDate2,
              "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
              "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
              "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
              "pageIndex": this.state.page1,//页数
              "pageSize": this.state.pageSize1//每页条数
            };
            console.log(params)
            this.tableData(this.props.comp === "课堂秩序任务报表" ? params : params1);
          })
        })
      }
    })
  }

  /**
   * 秩序表格数据
   */
  tableData = (params) => {
    if (this.props.comp === "课堂秩序任务报表") {
      this.setState({
        loading: true
      })
      _x.util.request.request('api/web/classroom_order_report/get_task_report', params, (res) => {
        if (res.result && res.data) {
          console.log(res)
          this.setState({
            zxTableData: res,
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
    } else {
      this.setState({
        loading: true
      })
      _x.util.request.request('api/web/class_score/listen_research_job', params, (res) => {
        if (res.result && res.data) {
          this.setState({
            zlTableData: res
          }, () => {
            let data1 = this.state.zlTableData.data.pageContent;
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

  }
  onPanelChange = (value, mode) => {
    let selDate1 = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate1
    }, () => {
      let params = {
        "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
        "gradeName": this.state.collegeName, //String类型，学院唯一标识//
        "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
        "teacherId": this.state.teacherVal,//String类型，老师Id// 
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
        "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
        "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      };
      let params1 = {
        "trgId": this.state.collegeVal,
        "teacherId": this.state.teacherVal,
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0,  // 0：自定义
        "startDate": this.state.selDate1,
        "endDate": this.state.selDate2,
        "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
        "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
        "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      };
      this.tableData(this.props.comp === "课堂秩序任务报表" ? params : params1);
    })
  }
  onPanelChange1 = (value, mode) => {
    let selDate2 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate2
    }, () => {
      let params = {
        "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
        "gradeName": this.state.collegeName, //String类型，学院唯一标识//
        "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
        "teacherId": this.state.teacherVal,//String类型，老师Id// 
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
        "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
        "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      };
      let params1 = {
        "trgId": this.state.collegeVal,
        "teacherId": this.state.teacherVal,
        "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
        "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
        "timeType": 0,  // 0：自定义
        "startDate": this.state.selDate1,
        "endDate": this.state.selDate2,
        "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
        "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
        "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
        "pageIndex": this.state.page1,//页数
        "pageSize": this.state.pageSize1//每页条数
      };
      this.tableData(this.props.comp === "课堂秩序任务报表" ? params : params1);
    })
  }

  /**
   * 课堂秩序
   * 选择机构
   */
  clickJG = (e) => {
    this.setState({
      collegeVal: e
    }, () => {
      for (let i = 0; i < this.state.college.length; i++) {
        if (this.state.college[i].trgId === this.state.collegeVal) {
          this.setState({
            collegeName: this.state.college[i].trgName
          }, () => {
            this.reqTea({ "trgId": this.state.collegeVal })
          })
        }
      }
    })
  }
  /**
   * 课堂秩序
   * 选择老师
   */
  clickTEA = (e) => {
    this.setState({
      teacherVal: e
    }, () => {
      let params = {
        "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
        "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
        "gradeName": this.state.collegeName, //String类型，学院唯一标识//
        "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
        "teacherId": this.state.teacherVal,//String类型，老师Id// 
        "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
        "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
        "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
        "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
        "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
        "pageSize": this.state.pageSize,//每页显示条数//
        "pageIndex": this.state.page//当前页//
      };
      this.tableData(params);
    })
  }
  /**
   * 课堂秩序
   * 选择专业
   */
  clickProf = (e) => {
    console.log(e);
  }

  /**
   * 课堂质量
   * 选择机构
   */
  clickJG1 = (e) => {
    console.log(e);
  }
  /**
   * 课堂质量
   * 选择老师
   */
  clickTEA1 = (e) => {
    console.log(e);
  }
  /**
   * 课堂质量
   * 选择专业
   */
  clickProf1 = (e) => {
    console.log(e);
  }

  /**
 * 秩序排序
 */
  handleTableChange = (pagination, filters, sorter) => {
    let order = sorter.order, orKey;
    order === 'ascend' ? orKey = 1 : orKey = -1;
    if (sorter.columnKey === 'taskNumber') {
      this.setState({
        taskNum: orKey
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
          "gradeName": this.state.collegeName, //String类型，学院唯一标识//
          "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
          "teacherId": this.state.teacherVal,//String类型，老师Id// 
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
          "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
          "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        };
        this.tableData(params);
      })
    } else if (sorter.columnKey === 'overNumber') {
      this.setState({
        completeNum: orKey
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
          "gradeName": this.state.collegeName, //String类型，学院唯一标识//
          "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
          "teacherId": this.state.teacherVal,//String类型，老师Id// 
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
          "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
          "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        };
        this.tableData(params);
      })
    } else {
      this.setState({
        completion: orKey
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
          "gradeName": this.state.collegeName, //String类型，学院唯一标识//
          "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
          "teacherId": this.state.teacherVal,//String类型，老师Id// 
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
          "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
          "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        };
        this.tableData(params);
      })
    }
  }


  /**
* 质量排序
*/
  handleTableChange1 = (pagination, filters, sorter) => {
    let order = sorter.order, orKey;
    order === 'ascend' ? orKey = 1 : orKey = 0;
    if (sorter.columnKey === 'courseCount') {
      this.setState({
        courseCountOrder: orKey
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,
          "teacherId": this.state.teacherVal,
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0,  // 0：自定义
          "startDate": this.state.selDate1,
          "endDate": this.state.selDate2,
          "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
          "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
          "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        };
        this.tableData(params);
      })
    } else if (sorter.columnKey === 'courseComplete') {
      this.setState({
        courseCompleteOrder: orKey
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,
          "teacherId": this.state.teacherVal,
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0,  // 0：自定义
          "startDate": this.state.selDate1,
          "endDate": this.state.selDate2,
          "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
          "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
          "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        };
        this.tableData(params);
      })
    } else {
      this.setState({
        courseRatioOrder: orKey
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,
          "teacherId": this.state.teacherVal,
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0,  // 0：自定义
          "startDate": this.state.selDate1,
          "endDate": this.state.selDate2,
          "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
          "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
          "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        };
        this.tableData(params);
      })
    }
  }
  /**
   * 秩序分页
   */
  jumpPage = (pageNumber) => {
    if (this.props.comp === "课堂秩序任务报表") {
      this.setState({
        page: pageNumber
      }, () => {
        let params = {
          "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
          "gradeName": this.state.collegeName, //String类型，学院唯一标识//
          "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
          "teacherId": this.state.teacherVal,//String类型，老师Id// 
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
          "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
          "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.tableData(params);
      })
    } else {
      this.setState({
        page1: pageNumber
      }, () => {
        let params = {
          "trgId": this.state.collegeVal,
          "teacherId": this.state.teacherVal,
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0,  // 0：自定义
          "startDate": this.state.selDate1,
          "endDate": this.state.selDate2,
          "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
          "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
          "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        };
        this.tableData(params);
      })
    }

  }
  /**
     * 输入框值
     */
  changeInput = (e) => {
    if (this.props.comp === "课堂秩序任务报表") {
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
    if (this.props.comp === "课堂秩序任务报表") {
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
          "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
          "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
          "gradeName": this.state.collegeName, //String类型，学院唯一标识//
          "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
          "teacherId": this.state.teacherVal,//String类型，老师Id// 
          "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
          "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
          "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
          "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
          "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
          "pageSize": this.state.pageSize,//每页显示条数//
          "pageIndex": this.state.page//当前页//
        }
        this.tableData(params);
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
          "trgId": this.state.collegeVal,
          "teacherId": this.state.teacherVal,
          "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
          "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
          "timeType": 0,  // 0：自定义
          "startDate": this.state.selDate1,
          "endDate": this.state.selDate2,
          "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
          "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
          "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
          "pageIndex": this.state.page1,//页数
          "pageSize": this.state.pageSize1//每页条数
        };
        this.tableData(params);
      })
    }
  }

  /**
   * 秩序导出报表
   */
  dcTable = () => {
    let params = {
      "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
      "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
      "gradeName": this.state.collegeName, //String类型，学院唯一标识//
      "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
      "teacherId": this.state.teacherVal,//String类型，老师Id// 
      "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
      "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
      "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
      "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
      "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
    };
    _x.util.request.request('api/web/classroom_order_report/export_task_report', params, (res) => {
      if (res.data && res.result) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("style", "display: none");
        iframe.setAttribute("src", G.dataServices + res.data);
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(iframe);
      }
    })
  }
  /**
   * 质量导出报表
   */
  dcTable1 = () => {
    let params = {
      "trgId": this.state.collegeVal,
      "teacherId": this.state.teacherVal,
      "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
      "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
      "timeType": 0,  // 0：自定义
      "startDate": this.state.selDate1,
      "endDate": this.state.selDate2,
      "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
      "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
      "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
    };
    _x.util.request.request('api/web/class_score/export_score_job', params, (res) => {
      if (res.data && res.result) {
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
    const columns = G.isVer === "0" ? [
      {
        title: '巡课人',
        dataIndex: 'patrolName',
        width: 200,
        align: 'left',
      }, {
        title: '任务数',
        dataIndex: 'taskNumber',
        width: 200,
        align: 'left',
        sorter: true,
      }, {
        title: '完成数',
        dataIndex: 'overNumber',
        width: 200,
        align: 'left',
        sorter: true,
      }, {
        title: '完成率',
        render: (text) => (text * 100) + '%',
        dataIndex: 'completionRate',
        width: 200,
        align: 'left',
        sorter: true,
      }] :
      [
        {
          title: '学院',
          dataIndex: 'collegeName',
          width: 140,
          align: 'left',
        }, {
          title: '巡课人',
          dataIndex: 'patrolName',
          width: 200,
          align: 'left',
        }, {
          title: '任务数',
          dataIndex: 'taskNumber',
          width: 200,
          align: 'left',
          sorter: true,
        }, {
          title: '完成数',
          dataIndex: 'overNumber',
          width: 200,
          align: 'left',
          sorter: true,
        }, {
          title: '完成率',
          dataIndex: 'completionRate',
          render: (text) => (text * 100) + '%',
          width: 200,
          align: 'left',
          sorter: true,
        }];
    const columns1 = G.isVer === "0" ? [{
      title: '教师',
      dataIndex: 'teacher',
      width: 200,
      align: 'left',
      // sorter: true,
      // sortOrder: false,
    }, {
      title: '任务数',
      dataIndex: 'courseCount',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '完成数',
      dataIndex: 'courseComplete',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '完成率',
      dataIndex: 'courseRatio',
      render: (text) => (text * 100) + '%',
      width: 200,
      align: 'left',
      sorter: true,
    }] : [{
      title: '学院',
      dataIndex: 'college',
      width: 140,
      align: 'left',
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '教师',
      dataIndex: 'teacher',
      width: 200,
      align: 'left',
      // sorter: true,
      // sortOrder: false,
    }, {
      title: '任务数',
      dataIndex: 'courseCount',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '完成数',
      dataIndex: 'courseComplete',
      width: 200,
      align: 'left',
      sorter: true,
    }, {
      title: '完成率',
      dataIndex: 'courseRatio',
      render: (text) => (text * 100) + '%',
      width: 200,
      align: 'left',
      sorter: true,
    }];
    return (
      // <div className="kyl-crc-allBox">
      //   <table></table>
      <div className="kyl-crc-tableBox" >
        {/* 头部内容 */}
        <div className="kyl-crc-header" style={{ height: this.props.comp !== "课堂秩序任务报表" ? "115px" : "" }}>
          {
            this.props.comp === "课堂秩序任务报表" ?
              <div className="kyl-crc-HContent">
                <span>{G.isVer === "0" ? "教师" : "机构"}&nbsp;:&nbsp;</span>
                {
                  G.isVer === "0"
                    ?
                    /**普教----老师 */
                    <Select
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={this.state.teacherVal}
                      showSearch={true}
                      style={{ width: "150px", marginLeft: '12px' }}
                      getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                      onChange={this.clickTEA}>
                      {
                        this.state.teacher.map((item, index) => (
                          <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                        ))
                      }
                    </Select>
                    :
                    /**高教 */
                    <div style={{ display: 'inline-block' }}>
                      <Select
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={this.state.collegeVal}
                        showSearch={true}
                        style={{ width: "150px" }}
                        getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                        onChange={this.clickJG}>
                        {/* 学院 */}
                        {
                          this.state.college.map((item, index) => (
                            <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                          ))
                        }
                      </Select>
                      <Select
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={this.state.teacherVal}
                        showSearch={true}
                        style={{ width: "150px", marginLeft: '12px' }}
                        getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                        onChange={this.clickTEA}>
                        {
                          this.state.teacher.map((item, index) => (
                            <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                          ))
                        }
                      </Select>
                    </div>
                }
                {
                  G.isVer === "0"
                    ?
                    ""
                    :
                    <div style={{ display: 'inline-block' }}>
                      <span className="kyl-crc-xkdw">巡课单位&nbsp;:&nbsp;</span>
                      <Checkbox checked={this.state.isChecked1} onChange={() => {
                        this.setState({ isChecked1: !this.state.isChecked1 }, () => {
                          let params = {
                            "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
                            "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
                            "gradeName": this.state.collegeName, //String类型，学院唯一标识//
                            "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
                            "teacherId": this.state.teacherVal,//String类型，老师Id// 
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
                            "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
                            "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          };
                          this.tableData(params);
                        })
                      }}>学校</Checkbox>
                      <Checkbox checked={this.state.isChecked2} onChange={() => {
                        this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                          let params = {
                            "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
                            "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
                            "gradeName": this.state.collegeName, //String类型，学院唯一标识//
                            "gradeId": this.state.collegeVal, //String类型，学院唯一标识//
                            "teacherId": this.state.teacherVal,//String类型，老师Id// 
                            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
                            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
                            "taskNum": this.state.taskNum,//String类型,任务数排序 0表示降序 1表示升序,没点击为空//
                            "completeNum": this.state.completeNum, //String类型,完成数排序 0表示降序 1表示升序，没点击为空//
                            "completion": this.state.completion, //String类型,完成率排序 0表示降序 1表示升序，没点击为空//
                            "pageSize": this.state.pageSize,//每页显示条数//
                            "pageIndex": this.state.page//当前页//
                          };
                          this.tableData(params);
                        })
                      }}>学院</Checkbox>
                    </div>
                }
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
                  导出报表</span>
              </div>
              :
              <div className="kyl-crc-HContent">
                <span>{G.isVer === "0" ? "教师" : "机构"}&nbsp;:&nbsp;</span>
                {
                  G.isVer === "0"
                    ?
                    ""
                    :
                    <Select
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      value={this.state.collegeVal}
                      showSearch={true}
                      style={{ minWidth: "11%" }}
                      getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                      onChange={this.clickJG}>
                      {/* 学院 */}
                      {
                        this.state.college.map((item, index) => (
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
                  style={{ minWidth: "11%", marginLeft: '12px' }}
                  getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                  onChange={this.clickTEA}>
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
                      <div style={{ display: 'inline-block' }}>
                        <span>听课安排&nbsp;:&nbsp;</span>
                        <Checkbox checked={this.state.isChecked1} onChange={() => {
                          this.setState({ isChecked1: !this.state.isChecked1 }, () => {
                            let params1 = {
                              "trgId": this.state.collegeVal,
                              "teacherId": this.state.teacherVal,
                              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
                              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
                              "timeType": 0,  // 0：自定义
                              "startDate": this.state.selDate1,
                              "endDate": this.state.selDate2,
                              "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
                              "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
                              "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
                              "pageIndex": this.state.page1,//页数
                              "pageSize": this.state.pageSize1//每页条数
                            };
                            this.tableData(params1);
                          })
                        }}>学校</Checkbox>
                        <Checkbox checked={this.state.isChecked2} onChange={() => {
                          this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                            let params1 = {
                              "trgId": this.state.collegeVal,
                              "teacherId": this.state.teacherVal,
                              "school": this.state.isChecked1 ? 1 : 0, //0不选中 1选中 学校
                              "college": this.state.isChecked2 ? 1 : 0,//0不选中 1选中 学院
                              "timeType": 0,  // 0：自定义
                              "startDate": this.state.selDate1,
                              "endDate": this.state.selDate2,
                              "courseCountOrder": this.state.courseCountOrder,//1正序 0：反序  -1 不选择
                              "courseCompleteOrder": this.state.courseCompleteOrder,//1正序 0：反序  -1 不选择
                              "courseRatioOrder": this.state.courseRatioOrder,//1正序 0：反序  -1 不选择
                              "pageIndex": this.state.page1,//页数
                              "pageSize": this.state.pageSize1//每页条数
                            };
                            this.tableData(params1);
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
                </div>
              </div>
          }

        </div>
        {/* 表格内容 */}
        <div className="kyl-crc-body">
          {
            this.props.comp === "课堂秩序任务报表" ?
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
              <div className="kyl-kt-clear" >
                <Table
                  key="table"
                  className="zn-report-table"
                  columns={columns1}
                  pagination={false}
                  loading={this.state.loading}
                  // scroll={{ y: this.props.boxHei }}
                  onChange={this.handleTableChange1}
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

export default TaskTable;