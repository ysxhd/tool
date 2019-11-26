/*
 * @Author: kyl 
 * @Date: 2018-08-28 13:18:23 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-09-13 14:53:16
 */

import React from 'react';
import { Select, Checkbox, DatePicker, Table, Pagination, Input, message } from 'antd';
import moment from 'moment';
import { SVG } from '../../common';
import '../../../css/college_table.css';
import KtzxInitDataTable from './ktzxInitData_table';
import KtzlInitDataTable from './ktzlInitData_table';
import G from '../../../js/g';
import _x from '../../../js/_x/index';

const Option = Select.Option;
const Format = _x.util.date.format;
class InitDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked1: true,   //课堂秩序---学校
      isChecked2: false,   //课堂秩序---学院
      college: [],             //全部学院data
      classroom: [],           //全部班级data
      kkxyjg: [],           //开科学院data
      kcType: [],           //课程类型data
      teacher: [],           //老师data
      kc: [],                //课程data
      wjThing: [],             //违纪事件data
      xxPeople: [],             //学校记录员
      collegeXY: [],            //学院      
      xyPeople: [],             //学院记录员
      xxPeople: [],             //学校记录员
      collegeVal: '',          //学院筛选VAL
      classVal: '',            //全部班级VAL
      kkxyjgVal: '',            //开科学院VAL
      kcTypeVal: '',            //课程类型VAL
      teacherVal: '',            //老师VAL
      kcVal: '',                //课程VAL
      wjThingVal: '',          //违纪事件VAL
      xxPeopleVal: '',           //学校记录员VAL
      xyPeopleVal: '',           //学院记录员VAL
      collegeXYVal: '',           //纪录学院VAL
      collegeXYName: '',           //记录学院名字
      wjObj: 'all',                //违纪对象
      selDate1: Format(new Date(), 'yyyy/MM/dd'),            //课堂秩序开始时间
      selDate2: Format(new Date(), 'yyyy/MM/dd'),            //课堂秩序结束时间
      teacherName: '',               //学院记录人name
      zxTableData: [],               //秩序
      zlTableData: [],               //质量
      data: [],                      //秩序
      data1: [],                      //质量
      page: 1,                        //秩序当前页
      page1: 1,                        //质量当前页
      pageSize: 20,                    //秩序每页条目
      pageSize1: 20,                   //质量每页条目
      gradeName: "",                   //机构名字
      inputValue: "",                   //分页请求
      collogeName: '',                   //学院名称

      // 质量参数
      teacher1: [],                   //根据学院老师下拉
      teacher1Val: '',                //根据学院老师下拉Val
      selDate3: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量开始时间
      selDate4: Format(new Date(), 'yyyy/MM/dd'),            //课堂质量结束时间
      course: [],                      //根据开课机构课程下拉
      courseVal: '',                      //根据开课机构课程下拉Val
      courseName: '',                      //根据开课机构课程名称
      inputValue1: "",                   //分页请求
      loading: true,
    }
  }

  componentDidMount() {
    //违纪事件请求
    console.log(G.typeList)
    this.xxPeople();
    this.collogeReq();
    this.setState({
      college: G.trgList,
      kkxyjg: G.openTrgList,
      kcType: G.typeList,
      selDate1: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate2: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
      selDate3: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(0, 0, 0, 0),
      selDate4: new Date(Format(new Date(), 'yyyy/MM/dd')).setHours(23, 59, 59, 59),
    }, () => {
      this.setState({
        collegeVal: this.state.college[0] ? this.state.college[0].trgId : '',
        kkxyjgVal: this.state.kkxyjg[0] ? this.state.kkxyjg[0].orgId : '',
        kcTypeVal: this.state.kcType[0] ? this.state.kcType[0].id : '',
        gradeName: this.state.college[0] ? this.state.college[0].trgName : '',
        collogeName: this.state.college[0] ? this.state.college[0].trgName : '',
      }, () => {
        if (this.props.comp === "课堂秩序原始数据") {
          this.wjTing({ roleEventType: 'all' });
          this.classReq({
            "trgName": this.state.collogeName, //学院id，如果为所有传  "all " //
          });
          this.teaReq({
            "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
            "courseType": this.state.kcTypeVal //Integer类型，课程类型
          })
          this.initDataTable({
            "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
            "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
            "gradeName": this.state.gradeName, //String类型，学院唯一标识// 
            "classId": "all",//班级id 如果为所有传 " "//
            "orgId": this.state.kkxyjgVal,// 机构//
            "courseType": "all", //0表示选修 1 表示必修 如果为所有传 " "//
            "teacherId": "all",//教教师id 如果为所有传 " "//
            "courseId": "all",//课程名称 如果为所有传 " "//
            "roleType": this.state.wjObj === "all" ? 0 : (this.state.wjObj === "1" ? 1 : 2),//1表示学生，2表示老师，0表示全部//
            "eventTypeId": "all", //违纪类型id 若查询所有 传 " "//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.college[0] ? this.state.college[0].trgName : "")), //学院ID//
            "recorder": "all",//记录人标识 如果查询所有 传" "//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          })
        } else {
          this.reqTea({ "trgId": this.state.collegeVal });
          this.course({ "orgId": this.state.kkxyjgVal, "teacherId": "", "courseType": this.state.kcTypeVal });
        }
      })
    })
  }

  // componentDidUpdate() {
  //   if()
  //   console.log(this.state.zxReqParams);
  // }

  /**
   * 学院老师请求----质量
   */
  reqTea = (params) => {
    _x.util.request.request('api/web/common/get_teacher_trgId', params, (res) => {
      if (res.result && res.data) {
        console.log(res);
        this.setState({
          teacher1: res.data
        }, () => {
          this.setState({
            teacher1Val: this.state.teacher1[0] ? this.state.teacher1[0].teacherId : ''
          }, () => {
            this.ReqTableAll1();
          })
        })
      }
    })
  }

  /**
   * 开课机构课程下拉请求
   */
  course = (params) => {
    _x.util.request.request('api/web/public/get_all_course', params, (res) => {
      if (res.result && res.data) {
        this.setState({
          course: res.data,
        }, () => {
          this.setState({
            courseVal: this.state.course[0] ? this.state.course[0].id : '',
            courseName: this.state.course[0] ? this.state.course[0].courseName : '',
          }, () => {
            this.zlInitDataTable({
              "startTime": this.state.selDate3, //开始时间 ，如果type！= 4 则 为0;//
              "endTime": this.state.selDate4, //结束时间，如果type！= 4 则 为0;//
              "gradeId": this.state.gradeName, //String类型，学院唯一标识// 
              "teacherId": "all",//教教师id 如果为所有传 " "//
              "orgId": this.state.kkxyjgVal,// 机构//
              "courseType": this.state.kcTypeVal, //0表示选修 1 表示必修 如果为所有传 " "//
              "courseId": this.state.courseVal,//课程名称 如果为所有传 " "//
              "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
              "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
              "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.college[0] ? this.state.college[0].trgName : "")),//学院ID//
              "scoreMan": "all",//记录人标识 如果查询所有 传" "//
              "pageSize": this.state.pageSize1,//每页显示条数//
              "pageIndex": this.state.page1//当前页//
            })
          })
        })
      }
    })
  }


  /**
   *课堂秩序报表请求 
   */
  initDataTable = (params) => {
    this.setState({
      loading: true
    })
    _x.util.request.request('api/web/classroom_order_report/get_raw_data_report', params, (res) => {
      if (res.result && res.data) {
        console.log(res);
        this.setState({
          zxTableData: res
        }, () => {
          let data = this.state.zxTableData.data;
          for (let i = 0; i < data.length; i++) {
            data[i].key = 'index' + i;
          }
          setTimeout(() => {
            this.setState({
              data,
              loading: false
            })
          }, 500);
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
   * 课堂质量报表请求
   */
  zlInitDataTable = (params) => {
    this.setState({
      loading: true
    })
    _x.util.request.request('api/web/classroom_order_report/get_quality_raw_report', params, (res) => {
      if (res.result && res.data) {
        console.log(res);
        this.setState({
          zlTableData: res
        }, () => {
          let data1 = this.state.zlTableData.data;
          for (let i = 0; i < data1.length; i++) {
            data1[i].key = 'index' + i;
          }
          console.log(this.state.data1);
          setTimeout(() => {
            this.setState({
              data1,
              loading: false
            })
          }, 500);
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
   * 请求学院
   */
  collogeReq = () => {
    _x.util.request.request('api/web/common/college_dropdown', {}, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          collegeXY: res.data,
        }, () => {
          this.setState({
            collegeXYVal: this.state.collegeXY[0] ? this.state.collegeXY[0].trgId : '',
            teacherName: this.state.collegeXY[0] ? this.state.collegeXY[0].trgName : ''
          }, () => {
            this.xyPeople({ "trgId": this.state.teacherName });
          })
        })
      }
    })
  }
  /**
   * 学院记录员
   */
  xyPeople = (params) => {
    _x.util.request.request('api/web/common/college_tea_dropdown', params, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          xyPeople: res.data,
        }, () => {
          this.setState({
            xyPeopleVal: this.state.xyPeople[0] ? this.state.xyPeople[0].teacherId : '',
          }, () => {
            if (this.props.comp === "课堂秩序原始数据") {
              this.ReqTableAll();
            } else {
              this.ReqTableAll1();
            }
          })
        })
      }
    })
  }

  /**
   * 学校记录员
   */
  xxPeople = () => {
    _x.util.request.request('api/web/common/school_teacher_dropdown', {}, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          xxPeople: res.data,
        }, () => {
          console.log(this.state.xxPeople);
          this.setState({
            xxPeopleVal: this.state.xxPeople[0] ? this.state.xxPeople[0].teacherId : '',
          })
        })
      }
    })
  }

  /**
   * 违纪事件请求
   */
  wjTing = (params) => {
    _x.util.request.request('api/web/common/get_event_type', params, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          wjThing: res.data,
        }, () => {
          this.ReqTableAll();
          this.setState({
            wjThingVal: this.state.wjThing[0] ? this.state.wjThing[0].eventTypeId : '',
          })
        })
      }
    })
  }

  /**
   * 学院班级请求
   */
  classReq = (params) => {
    _x.util.request.request('api/web/common/get_class_trgId', params, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          classroom: res.data,
        }, () => {
          this.ReqTableAll();
          this.setState({
            classVal: this.state.classroom[0] ? this.state.classroom[0].classId : ''
          })
        })
      }
    })
  }

  /**
   * 学院老师请求---秩序
   */
  teaReq = (params) => {
    _x.util.request.request('api/web/public/get_all_teacher', params, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          teacher: res.data,
        }, () => {
          this.setState({
            teacherVal: this.state.teacher[0] ? this.state.teacher[0].id : '',
          }, () => {
            // 请求全部课程
            this.courseReq({
              "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
              "teacherId": this.state.teacherVal,//String类型，教师ID//
              "courseType": this.state.kcTypeVal //Integer类型，课程类型
            })
          })
        })
      }
    })
  }

  /**
   * 秩序筛选请求表格函数
   */
  ReqTableAll = () => {
    for (let i = 0; i < this.state.college.length; i++) {
      if (this.state.college[i].trgId === this.state.collegeVal) {
        this.setState({
          gradeName: this.state.college[i].trgName
        }, () => {
          let params = {
            "startTime": this.state.selDate1, //开始时间 ，如果type！= 4 则 为0;//
            "endTime": this.state.selDate2, //结束时间，如果type！= 4 则 为0;//
            "gradeName": this.state.gradeName, //String类型，学院唯一标识// 
            "classId": this.state.classVal,//班级id 如果为所有传 " "//
            "orgId": this.state.kkxyjgVal,// 机构//
            "courseType": this.state.kcTypeVal, //0表示选修 1 表示必修 如果为所有传 " "//
            "teacherId": this.state.teacherVal,//教教师id 如果为所有传 " "//
            "courseId": this.state.kcVal,//课程名称 如果为所有传 " "//
            "roleType": this.state.wjObj === "all" ? 0 : (this.state.wjObj === "1" ? 1 : 2),//1表示学生，2表示老师，0表示全部//
            "eventTypeId": this.state.wjThingVal, //违纪类型id 若查询所有 传 " "//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.collegeXY[0] ? this.state.collegeXYName : "")), //学院ID//
            "recorder": this.state.isChecked1 ? this.state.xxPeopleVal : this.state.xyPeopleVal,//记录人标识 如果查询所有 传" "//
            "pageSize": this.state.pageSize,//每页显示条数//
            "pageIndex": this.state.page//当前页//
          }
          this.initDataTable(params)
        })
      }
    }
  }

  /**
   * 质量筛选请求表格函数
   */
  ReqTableAll1 = () => {
    for (let i = 0; i < this.state.college.length; i++) {
      if (this.state.college[i].trgId === this.state.collegeVal) {
        this.setState({
          gradeName: this.state.college[i].trgName
        }, () => {
          let params = {
            "startTime": this.state.selDate3, //开始时间 ，如果type！= 4 则 为0;//
            "endTime": this.state.selDate4, //结束时间，如果type！= 4 则 为0;//
            "gradeName": this.state.gradeName, //String类型，学院唯一标识// 
            "teacherId": this.state.teacher1Val,//教教师id 如果为所有传 " "//
            "orgId": this.state.kkxyjgVal,// 机构//
            "courseType": this.state.kcTypeVal, //0表示选修 1 表示必修 如果为所有传 " "//
            "courseId": this.state.courseVal,//课程名称 如果为所有传 " "//
            "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
            "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
            "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.collegeXY[0] ? this.state.collegeXYName : "")),//学院ID//
            "scoreMan": this.state.isChecked1 ? this.state.xxPeopleVal : this.state.xyPeopleVal,//记录人标识 如果查询所有 传" "//
            "pageSize": this.state.pageSize1,//每页显示条数//
            "pageIndex": this.state.page1//当前页//
          }
          this.zlInitDataTable(params)
        })
      }
    }
  }

  /**
   * 全部课程请求
   */
  courseReq = (params) => {
    _x.util.request.request('api/web/public/get_all_course', params, (res) => {
      if (res.result && res.data) {
        // console.log(res);
        this.setState({
          kc: res.data,
        }, () => {
          if (this.props.comp === "课堂秩序原始数据") {
            this.ReqTableAll();
            this.setState({
              kcVal: this.state.kc[0] ? this.state.kc[0].id : '',
            })
          } else {
            this.ReqTableAll1();
            this.setState({
              courseVal: this.state.course[0] ? this.state.course[0].id : '',
            })
          }
        })
      }
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
      if (this.props.comp === "课堂秩序原始数据") {
        for (let i = 0; i < this.state.college.length; i++) {
          if (this.state.college[i].trgId === this.state.collegeVal) {
            this.setState({
              collogeName: this.state.college[i].trgName,
            }, () => {
              this.classReq({ "trgName": this.state.collogeName });
            })
          }
        }
      } else {
        for (let i = 0; i < this.state.college.length; i++) {
          if (this.state.college[i].trgId === this.state.collegeVal) {
            this.setState({
              collogeName: this.state.college[i].trgName,
            }, () => {
              this.reqTea({ "trgId": this.state.collogeName });
            })
          }
        }
      }
    })
  }
  /**
   * 课堂秩序
   * 选择机构
   */
  clickCla = (e) => {
    console.log(e);
    this.setState({
      classVal: e
    }, () => {
      this.ReqTableAll();
    })
  }
  /**
   * 课堂质量
   * 选择老师
   */
  clickTeacher = (e) => {
    console.log(e);
    this.setState({
      teacher1Val: e
    }, () => {
      this.ReqTableAll1();
    })
  }
  /**
   * 课堂秩序
   * 选择开课机构
   */
  clickXY = (e) => {
    console.log(e);
    this.setState({
      kkxyjgVal: e
    }, () => {
      if (this.props.comp === "课堂秩序原始数据") {
        this.teaReq({
          "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
          "courseType": this.state.kcTypeVal //Integer类型，课程类型
        })
      } else {
        this.setState({
          kcTypeVal: this.state.kcType[0] ? this.state.kcType[0].id : '',
        }, () => {
          this.courseReq({
            "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
            "teacherId": "",//String类型，教师ID//
            "courseType": this.state.kcTypeVal //Integer类型，课程类型
          })
        })


      }
    })
  }
  /**
   * 课堂秩序
   * 选择课程类型
   */
  clickKCTYPE = (e) => {
    console.log(e);
    this.setState({
      kcTypeVal: e
    }, () => {
      if (this.props.comp === "课堂秩序原始数据") {
        this.teaReq({
          "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
          "courseType": this.state.kcTypeVal //Integer类型，课程类型
        })
      } else {
        this.courseReq({
          "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
          "teacherId": "",//String类型，教师ID//
          "courseType": this.state.kcTypeVal //Integer类型，课程类型
        })
      }
    })
  }
  /**
   * 课堂秩序
   * 选择授课老师
   */
  clickTEA = (e) => {
    console.log(e);
    this.setState({
      teacherVal: e
    }, () => {
      this.courseReq({
        "orgId": this.state.kkxyjgVal,//String类型，开课机构ID//
        "teacherId": this.state.teacherVal,//String类型，教师ID//
        "courseType": this.state.kcTypeVal //Integer类型，课程类型
      })
    })
  }
  /**
   * 课堂秩序
   * 选择课程
   */
  clickKC = (e) => {
    console.log(e);
    if (this.props.comp === "课堂秩序原始数据") {
      this.setState({
        kcVal: e
      }, () => {
        this.ReqTableAll();
      })
    } else {
      this.setState({
        courseVal: e
      }, () => {
        this.ReqTableAll1();
      })
    }
  }
  /**
   * 课堂秩序
   * 违纪对象
   */
  clickSJOBJ = (e) => {
    console.log(e);
    this.setState({
      wjObj: e
    }, () => {
      this.wjTing({ roleEventType: this.state.wjObj });
    })
  }
  /**
   * 课堂秩序
   * 违纪事件
   */
  clickSJWJ = (e) => {
    console.log(e);
    this.setState({
      wjThingVal: e
    }, () => {
      this.ReqTableAll();
    })
  }
  /**
   * 课堂秩序
   * 记录人
   */
  schoolPeo = (e) => {
    this.setState({
      xxPeopleVal: e
    }, () => {
      if (this.props.comp === "课堂秩序原始数据") {
        this.ReqTableAll();
      } else {
        this.ReqTableAll1();
      }
    })
  }
  xy = (e) => {
    this.setState({
      collegeXYVal: e
    }, () => {
      if (this.props.comp === "课堂秩序原始数据") {
        console.log(this.state.collegeXY)
        for (let i = 0; i < this.state.collegeXY.length; i++) {
          if (this.state.collegeXY[i].trgId === this.state.collegeXYVal) {
            this.setState({
              collegeXYName: this.state.collegeXY[i].trgName
            }, () => {
              this.xyPeople({ "trgId": this.state.collegeXYName });
            })
          }
        };
      } else {
        for (let i = 0; i < this.state.collegeXY.length; i++) {
          if (this.state.collegeXY[i].trgId === this.state.collegeXYVal) {
            this.setState({
              collegeXYName: this.state.collegeXY[i].trgName
            }, () => {
              this.xyPeople({ "trgId": this.state.collegeXYName });
            })
          }
        };
      }
    })
  }
  collegePeo = (e) => {
    this.setState({
      xyPeopleVal: e
    }, () => {
      if (this.props.comp === "课堂秩序原始数据") {
        this.ReqTableAll();
      } else {
        this.ReqTableAll1();
      }
    })
  }
  /**
   * 秩序
   */
  onPanelChange1 = (value, mode) => {
    let selDate1 = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate1
    }, () => {
      this.ReqTableAll();
    })
  }
  onPanelChange2 = (value, mode) => {
    let selDate2 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate2
    }, () => {
      this.ReqTableAll();
    })
  }
  /**
   * 质量
   */
  onPanelChange3 = (value, mode) => {
    let selDate3 = new Date(value).setHours(0, 0, 0, 0)
    this.setState({
      selDate3
    }, () => {
      this.ReqTableAll1();
    })
  }
  onPanelChange4 = (value, mode) => {
    let selDate4 = new Date(value).setHours(23, 59, 59, 59)
    this.setState({
      selDate4
    }, () => {
      this.ReqTableAll1();
    })
  }

  /**
   * 秩序分页
   */
  jumpPage = (pageNumber) => {
    if (this.props.comp === "课堂秩序原始数据") {
      this.setState({
        page: pageNumber
      }, () => {
        this.ReqTableAll();
      })
    } else {
      this.setState({
        page1: pageNumber
      }, () => {
        this.ReqTableAll1();
      })
    }
  }

  /**
   * 秩序分页框
   */
  changeInput = (e) => {
    if (this.props.comp === "课堂秩序原始数据") {
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
    if (this.props.comp === "课堂秩序原始数据") {
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
        this.ReqTableAll();
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
        this.ReqTableAll1();
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
      "gradeName": this.state.gradeName, //String类型，学院唯一标识// 
      "classId": this.state.classVal,//班级id 如果为所有传 " "//
      "orgId": this.state.kkxyjgVal,// 机构//
      "courseType": this.state.kcTypeVal, //0表示选修 1 表示必修 如果为所有传 " "//
      "teacherId": this.state.teacherVal,//教教师id 如果为所有传 " "//
      "courseId": this.state.kcVal,//课程名称 如果为所有传 " "//
      "roleType": this.state.wjObj === "all" ? 0 : (this.state.wjObj === "1" ? 1 : 2),//1表示学生，2表示老师，0表示全部//
      "eventTypeId": this.state.wjThingVal, //违纪类型id 若查询所有 传 " "//
      "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
      "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
      "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.college[0] ? this.state.college[0].trgName : "")), //学院ID//
      "recorder": this.state.isChecked1 ? this.state.xxPeopleVal : this.state.xyPeopleVal,//记录人标识 如果查询所有 传" "//
    };
    _x.util.request.request('api/web/classroom_order_report/export_raw_data_report', params, (res) => {
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
      "startTime": this.state.selDate3, //开始时间 ，如果type！= 4 则 为0;//
      "endTime": this.state.selDate4, //结束时间，如果type！= 4 则 为0;//
      "gradeName": this.state.gradeName, //String类型，学院唯一标识// 
      "teacherId": this.state.teacher1Val,//教教师id 如果为所有传 " "//
      "orgId": this.state.kkxyjgVal,// 机构//
      "courseType": this.state.kcTypeVal, //0表示选修 1 表示必修 如果为所有传 " "//
      "courseId": this.state.courseVal,//课程名称 如果为所有传 " "//
      "school": this.state.isChecked1 ? 1 : 0,//Integer类型，学校   0表示未选中，1表示选中//
      "college": this.state.isChecked2 ? 1 : 0,//Integer类型，学院   0表示未选中，1表示选中//
      "collegeId": this.state.isChecked1 ? "" : (!this.state.isChecked2 ? "" : (this.state.college[0] ? this.state.college[0].trgName : "")),//学院ID//
      "scoreMan": this.state.isChecked1 ? this.state.xxPeopleVal : this.state.xyPeopleVal,//记录人标识 如果查询所有 传" "//
    };
    _x.util.request.request('api/web/classroom_order_report/export_quality_raw_report', params, (res) => {
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
    const columns = G.isVer === "0" ? [{
      title: '年级',
      dataIndex: 'collegeName',
      width: 200,
      align: 'left',
    }, {
      title: '上课班级',
      dataIndex: 'className',
      width: 200,
      align: 'left',
    }, {
      title: '授课老师',
      dataIndex: 'teacherName',
      width: 140,
      align: 'left',
    }, {
      title: '科目',
      dataIndex: 'courseName',
      width: 140,
      align: 'left',
    }, {
      title: '违纪对象',
      dataIndex: 'roleEventType',
      render: (text) => text === "0" ? "全部对象" : (text === "1" ? "学生" : "老师"),
      width: 140,
      align: 'left',
    }, {
      title: '违纪事件',
      dataIndex: 'eventName',
      width: 200,
      align: 'left',
    }, {
      title: '扣分',
      dataIndex: 'deductScore',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'eventHappenTime',
      width: 200,
      align: 'left',
    }, {
      title: '记录人',
      dataIndex: 'recorderName',
      width: 140,
      align: 'left',
    }] : [{
      title: '学院',
      dataIndex: 'collegeName',
      width: 200,
      align: 'left',
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '上课班级',
      dataIndex: 'className',
      width: 200,
      align: 'left',
    }, {
      title: '授课老师',
      dataIndex: 'teacherName',
      width: 140,
      align: 'left',
    }, {
      title: '科目',
      dataIndex: 'courseName',
      width: 140,
      align: 'left',
    }, {
      title: '课类型',
      dataIndex: 'type',
      width: 140,
      align: 'left',
    }, {
      title: '违纪对象',
      dataIndex: 'roleEventType',
      render: (text) => text === "0" ? "全部对象" : (text === "1" ? "学生" : "老师"),
      width: 140,
      align: 'left',
    }, {
      title: '违纪事件',
      dataIndex: 'eventName',
      width: 200,
      align: 'left',
    }, {
      title: '扣分',
      dataIndex: 'deductScore',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'eventHappenTime',
      width: 200,
      align: 'left',
    }, {
      title: '记录人',
      dataIndex: 'recorderName',
      width: 140,
      align: 'left',
    }];
    const columns1 = G.isVer === "0" ? [{
      title: '班级',
      dataIndex: 'className',
      width: 200,
      align: 'left',
    }, {
      title: '授课老师',
      dataIndex: 'tTeacher',
      width: 140,
      align: 'left',
    }, {
      title: '科目',
      dataIndex: 'courseName',
      width: 200,
      align: 'left',
    }, {
      title: '评分老师',
      dataIndex: 'sTeacher',
      width: 140,
      align: 'left',
    }, {
      title: '评分',
      dataIndex: 'score',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'recordTime',
      width: 200,
      align: 'left',
    }] : [{
      title: '学院',
      dataIndex: 'collegeName',
      width: 200,
      align: 'left',
      // render: text => <a href="javascript:;">{text}</a>,
    }, {
      title: '班级',
      dataIndex: 'className',
      width: 200,
      align: 'left',
    }, {
      title: '授课老师',
      dataIndex: 'tTeacher',
      width: 140,
      align: 'left',
    }, {
      title: '科目',
      dataIndex: 'courseName',
      width: 200,
      align: 'left',
    }, {
      title: '评分老师',
      dataIndex: 'sTeacher',
      width: 140,
      align: 'left',
    }, {
      title: '评分',
      dataIndex: 'score',
      width: 140,
      align: 'left',
    }, {
      title: '发生时间',
      dataIndex: 'recordTime',
      width: 200,
      align: 'left',
    }];
    return (
      // <div className="kyl-crc-allBox">
      //   <table></table>
      <div className="kyl-crc-tableBox">
        {/* 头部内容 */}
        <div className="kyl-crc-header" style={{ height: this.props.comp === "课堂秩序原始数据" ? "250px" : "198px" }}>
          {
            this.props.comp === "课堂秩序原始数据" ?
              //课堂秩序
              <div className="kyl-crc-HContent">
                <div className="kyl-crc-Hpadding">
                  <span>{G.isVer === "0" ? "班级" : "机构"}&nbsp;:&nbsp;</span>
                  {
                    G.isVer === "0"
                      ?
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
                      :
                      <div style={{ display: 'inline-block' }}>
                        {/* 学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.collegeVal}
                          showSearch={true}
                          style={{ width: "150px" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickJG}>
                          {
                            this.state.college.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                            ))
                          }
                        </Select>
                        {/* 班级 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.classVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickCla}>
                          {
                            this.state.classroom.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.classId}>{item.className}</Option>
                            ))
                          }
                        </Select>
                      </div>
                  }
                  <span className="kyl-crc-dcbb" onClick={this.dcTable}>
                    <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                    导出报表
              </span>
                </div>
                <div className="kyl-crc-Hpadding">
                  <span>课程&nbsp;:&nbsp;</span>
                  {
                    G.isVer === "0"
                      ?
                      <div style={{ display: 'inline-block' }}>
                        {/* 授课教师 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.teacherVal}
                          showSearch={true}
                          style={{ minWidth: "150px", marginLeft: G.isVer === "0" ? "0" : '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickTEA}>
                          {
                            this.state.teacher.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.id}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        {/* 课程 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.kcVal}
                          showSearch={true}
                          style={{ minWidth: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickKC}>
                          {
                            this.state.kc.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.id}>{item.courseName}</Option>
                            ))
                          }
                        </Select>
                      </div>
                      :
                      <div style={{ display: 'inline-block' }}>
                        {/* 开课学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.kkxyjgVal}
                          showSearch={true}
                          style={{ width: "150px" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickXY}>
                          {
                            this.state.kkxyjg.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.orgId}>{item.orgName}</Option>
                            ))
                          }
                        </Select>
                        {/* 课程类型 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.kcTypeVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickKCTYPE}>
                          {
                            this.state.kcType.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.id}>{item.name}</Option>
                            ))
                          }
                        </Select>
                        {/* 授课教师 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.teacherVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: G.isVer === "0" ? "0" : '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickTEA}>
                          {
                            this.state.teacher.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.id}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        {/* 课程 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.kcVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickKC}>
                          {
                            this.state.kc.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.id}>{item.courseName}</Option>
                            ))
                          }
                        </Select>
                      </div>
                  }
                </div>
                <div className="kyl-crc-Hpadding">
                  <span>事件&nbsp;:&nbsp;</span>
                  {/* 违纪对象 */}
                  <Select
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={this.state.wjObj}
                    showSearch={true}
                    style={{ width: "150px" }}
                    getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                    onChange={this.clickSJOBJ}>
                    <Option title="全部对象" value="all">全部对象</Option>
                    <Option title="老师" value="2">老师</Option>
                    <Option title="学生" value="1">学生</Option>
                  </Select>
                  {/* 违纪类型 */}
                  <Select
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={this.state.wjThingVal}
                    showSearch={true}
                    style={{ width: "150px", marginLeft: '12px' }}
                    getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                    onChange={this.clickSJWJ}>
                    {
                      this.state.wjThing.map((item, index) => (
                        <Option title={item.trgName} key={index} value={item.eventTypeId}>{item.eventName}</Option>
                      ))
                    }
                  </Select>
                </div>
                <div className="kyl-crc-Hpadding">
                  {
                    G.isVer === "0"
                      ?
                      <div style={{ display: 'inline-block' }}>
                        <span style={{ marginLeft: "-28px" }}>巡课单位&nbsp;:&nbsp;</span>
                        {/* 记录人 ---学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.xyPeopleVal}
                          showSearch={true} style={{ width: 150, }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.collegePeo}>
                          {
                            this.state.xyPeople.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                      </div>
                      :
                      <div style={{ display: 'inline-block' }}>
                        <span style={{ marginLeft: "-28px" }}>巡课单位&nbsp;:&nbsp;</span>
                        <Checkbox checked={this.state.isChecked1} onChange={() => {
                          this.setState({ isChecked1: !this.state.isChecked1 }, () => {
                            //请求表格数据
                            this.ReqTableAll();
                          })
                        }}>学校</Checkbox>
                        <Checkbox checked={this.state.isChecked2} onChange={() => {
                          this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                            //请求表格数据
                            this.ReqTableAll();
                          })
                        }}>学院</Checkbox>
                      </div>
                  }
                  {
                    G.isVer === "0"
                      ?
                      ""
                      :
                      <div style={{ display: 'inline-block' }}>
                        {/* 记录人 ---学校 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.xxPeopleVal}
                          showSearch={true}
                          style={{ width: 150, marginLeft: "15px", display: this.state.isChecked1 && this.state.isChecked2 || this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.schoolPeo}>
                          {
                            this.state.xxPeople.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        {/* 学院 ---学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.collegeXYVal}
                          showSearch={true}
                          style={{ width: 150, marginLeft: "15px", display: this.state.isChecked2 && !this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.xy}>
                          {
                            this.state.collegeXY.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                            ))
                          }
                        </Select>
                        {/* 记录人 ---学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.xyPeopleVal}
                          showSearch={true} style={{ width: 150, marginLeft: "15px", display: this.state.isChecked2 && !this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.collegePeo}>
                          {
                            this.state.xyPeople.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        <Select defaultValue="jack" showSearch={true} style={{ width: 200, visibility: 'hidden' }} >
                          <Option value="jack">Jack</Option>
                        </Select>
                      </div>
                  }
                </div>
                <div className="kyl-crc-Hpadding">
                  <span>时间&nbsp;:&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="开始时间"
                    defaultValue={moment(this.state.selDate1, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px" }}
                    onChange={this.onPanelChange1} />
                  <span>&nbsp;--&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="结束时间"
                    defaultValue={moment(this.state.selDate2, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px" }}
                    onChange={this.onPanelChange2} />
                </div>
              </div>
              :
              // 课堂质量
              <div className="kyl-crc-HContent">
                <div className="kyl-crc-Hpadding">
                  <span>{G.isVer === "0" ? "教师" : "机构"}&nbsp;:&nbsp;</span>
                  {
                    G.isVer === "0"
                      ?
                      <Select
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={this.state.teacher1Val}
                        showSearch={true}
                        style={{ width: "150px" }}
                        getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                        onChange={this.clickTeacher}>
                        {/* 老师 */}
                        {
                          this.state.teacher1.map((item, index) => (
                            <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                          ))
                        }
                      </Select>
                      :
                      <div style={{ display: 'inline-block' }}>
                        {/* 学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.collegeVal}
                          showSearch={true}
                          style={{ width: "150px" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickJG}>
                          {
                            this.state.college.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                            ))
                          }
                        </Select>
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.teacher1Val}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickTeacher}>
                          {/* 老师 */}
                          {
                            this.state.teacher1.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                      </div>
                  }
                  <span className="kyl-crc-dcbb" onClick={this.dcTable1}>
                    <SVG type="dcbb" width={25} height={17} color="#3498db"></SVG>
                    导出报表</span>
                </div>
                <div className="kyl-crc-Hpadding">
                  <span>时间&nbsp;:&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="开始时间"
                    defaultValue={moment(this.state.selDate3, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px" }}
                    onChange={this.onPanelChange3} />
                  <span>&nbsp;--&nbsp;</span>
                  <DatePicker
                    allowClear={false}
                    placeholder="结束时间"
                    defaultValue={moment(this.state.selDate4, dateFormat)}
                    format={dateFormat}
                    className="kyl-crc-selectSj"
                    style={{ width: "140px" }}
                    onChange={this.onPanelChange4} />
                </div>
                <div className="kyl-crc-Hpadding">
                  <span>课程&nbsp;:&nbsp;</span>
                  {/* 开课学院 */}
                  <Select
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    value={this.state.kkxyjgVal}
                    showSearch={true}
                    style={{ minWidth: "11%" }}
                    onChange={this.clickXY}>
                    {
                      this.state.kkxyjg.map((item, index) => (
                        <Option title={item.trgName} key={index} value={item.orgId}>{item.orgName}</Option>
                      ))
                    }
                  </Select>
                  {
                    G.isVer === "0"
                      ?
                      ""
                      :
                      <div style={{ display: "inline-block" }}>
                        {/* 课程类型 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.kcTypeVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.clickKCTYPE}>
                          {
                            this.state.kcType.map((item, index) => (
                              <Option title={item.name} key={index} value={item.id}>{item.name}</Option>
                            ))
                          }
                        </Select>
                        {/* 课程 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.courseVal}
                          showSearch={true}
                          style={{ width: "150px", marginLeft: '12px' }}
                          onChange={this.clickKC}>
                          {
                            this.state.course.map((item, index) => (
                              <Option title={item.courseName} key={index} value={item.id}>{item.courseName}</Option>
                            ))
                          }
                        </Select>
                      </div>
                  }
                </div>
                <div className="kyl-crc-Hpadding">
                  <span style={{ marginLeft: "-28px" }}>听课安排&nbsp;:&nbsp;</span>
                  {
                    G.isVer === "0"
                      ?
                      ""
                      :
                      <div style={{ display: "inline-block" }}>
                        <Checkbox checked={this.state.isChecked1} onChange={() => {
                          this.setState({ isChecked1: !this.state.isChecked1 }, () => {
                            //请求表格数据
                            this.ReqTableAll1();
                          })
                        }}>学校</Checkbox>
                        <Checkbox checked={this.state.isChecked2} onChange={() => {
                          this.setState({ isChecked2: !this.state.isChecked2 }, () => {
                            //请求表格数据
                            this.ReqTableAll1();
                          })
                        }}>学院</Checkbox>
                      </div>
                  }
                  {
                    G.isVer === "0"
                      ?
                      <Select
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        value={this.state.xyPeopleVal}
                        showSearch={true}
                        style={{ width: 150 }}
                        getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                        onChange={this.collegePeo}>
                        {
                          this.state.xyPeople.map((item, index) => (
                            <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                          ))
                        }
                      </Select>
                      :
                      <div style={{ display: "inline-block" }}>
                        {/* 记录人 ---学校 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.xxPeopleVal}
                          showSearch={true}
                          style={{ width: 150, marginLeft: G.isVer === "0" ? 0 : "15px", display: this.state.isChecked1 && this.state.isChecked2 || this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.schoolPeo}>
                          {
                            this.state.xxPeople.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        {/* 学院 ---学院 */}
                        <Select filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.collegeXYVal}
                          showSearch={true}
                          style={{ width: 150, marginLeft: "15px", display: this.state.isChecked2 && !this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.xy}>
                          {
                            this.state.collegeXY.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.trgId}>{item.trgName}</Option>
                            ))
                          }
                        </Select>
                        {/* 记录人 ---学院 */}
                        <Select
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          value={this.state.xyPeopleVal}
                          showSearch={true}
                          style={{ width: 150, marginLeft: "15px", display: this.state.isChecked2 && !this.state.isChecked1 ? "inline-block" : "none" }}
                          getPopupContainer={() => document.getElementsByClassName('kyl-crc-HContent')[0]}
                          onChange={this.collegePeo}>
                          {
                            this.state.xyPeople.map((item, index) => (
                              <Option title={item.trgName} key={index} value={item.teacherId}>{item.teacherName}</Option>
                            ))
                          }
                        </Select>
                        <Select defaultValue="jack" showSearch={true} style={{ width: 200, visibility: 'hidden' }} >
                          <Option value="jack">Jack</Option>
                        </Select>
                      </div>
                  }
                </div>
              </div>
          }
          {/* 表格内容 */}
          <div className="kyl-crc-body" style={{ marginTop: this.props.comp === "课堂质量原始数据" ? "-10px" : "" }}>
            {
              this.props.comp === "课堂秩序原始数据" ?
                <div className="kyl-kt-clear" >
                  <Table
                    key="table"
                    className="zn-report-table"
                    columns={columns}
                    pagination={false}
                    loading={this.state.loading}
                    // scroll={{ y: this.props.boxHei }}
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
                </div> :
                <div className="kyl-kt-clear" >
                  <Table
                    key="table"
                    className="zn-report-table"
                    columns={columns1}
                    pagination={false}
                    loading={this.state.loading}
                    // scroll={{ y: this.props.boxHei }}
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
      </div >
    );
  }
}

export default InitDataTable;