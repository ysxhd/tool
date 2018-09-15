import React, { Component } from 'react';
import '../../../css/absent_supervise/comprehensive.css';
import { Select, Table } from 'antd';
import _x from '../../../utils/_x/index';
import { G } from '../../../utils/g';
import SelectPlace from '../../public_components/select';
import QueueAnim from 'rc-queue-anim';

const { Column } = Table;
export class ComprehensiveChild extends Component {
  constructor() {
    super();
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectCode: [],//选中的违纪代码
      allCode: [],//所有的违纪代码
      flag: false,//小三角的开关
      pagination: {
        total: 0,
        pageSize: 10,
        current:1
      },
      data: [],
      screen: '',
      defaultValue: '',
      loading: false,
      pageindex:1
    }
    this.Li = this.Li.bind(this);
    this.inner = '';
    this.examId = JSON.parse(sessionStorage.getItem("examId")); 
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
  }

  componentWillMount() {
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
    var OrgCode = params.orgCode;
    var orgTypeId = params.orgTypeId;
    var schoolName = params.schoolName;
    if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
    this.setState({
      schoolName,
      OrgCode,
      orgTypeId,
      examSessionNum:G.examSessionNum
    })
    this.getAbsenceCount(OrgCode,1,G.examSessionNum);
    this.checkAllCode();
  }

  getAbsenceCount(OrgCode,paegindex,examSessionNum) {
    this.setState({ load: true });
    var index = paegindex ? paegindex : this.state.pageindex;
    _x.request('/disciplineManage/getDisciplineDetailList', {
      "examId": this.examId,
      "orgCode": OrgCode,
      "currentPage": index,
      "pageSize": 10,
      "examSessionNum": examSessionNum
    }, (res) => {
      if (res.result) {
        var data = res.data;
        this.setState({
          load: false,
          data: data.pageData,
          pagination: {
            total: data.totalRow,
            pageSize: 10,
            current: index
          }
        });
      }else{
        this.setState({
          load: false
        })
      }
    })
  }



  // 查询所有违纪代码
  checkAllCode() {
    _x.request('/disciplineManage/getDisciplineCodeList', {
      "examId": this.examId,
    }, (res) => {
      if (res.result) {
        var data = res.data;
        this.setState({
          allCode: data
        });
      }
    })
  }

  // input获得焦点
  onFocus(index) {
    // 获取下面的ul相对屏幕的位置
    var ul = document.getElementById(`${'zn-click-select' + index}`);
    ul.style.display = "block";

  }



  Li(index, e) {
    e.preventDefault();
    e.stopPropagation();
    var value = e.target.value;
    var ul = document.getElementById(`${'zn-click-select' + index}`);
    var state = this.state.data[index];
    //获取参数，考生姓名，准考证号，机构类型，考籍号
    var examineeName = state.examineeName;
    var examNum = state.examNum;
    var subjectCode = state.subjectCode;
    var recordNum = state.recordNum;
    if (value === 3 || value === -1) {

      // div.innerHTML = value === 3 ? "确认正常" : "未确认";
      ul.style.display = "none";

      // 做请求
      this.changeData(value, examineeName, examNum, subjectCode, recordNum, index);

    } else {
      //多选的情况
      var selectCode = this.state.selectCode;
      var data = this.state.data;

      //判断是否有重复的选择
      if (selectCode.indexOf(value) < 0) {
        selectCode.push(value);
      }

      data[index].confirmAbsentStatus = 0;
      data[index].lastDisciplineCodeList = selectCode.join(",");

      this.setState({
        selectCode,
        data
      })

    }
  }

  onLeave(index) {
    var ul = document.getElementById(`${'zn-click-select' + index}`);
    var state = this.state.data[index];
    //获取参数，考生姓名，准考证号，机构类型，考籍号
    var examineeName = state.examineeName;
    var examNum = state.examNum;
    var subjectCode = state.subjectCode;
    var recordNum = state.recordNum;

    ul.style.display = "none";
    if (this.state.selectCode.length) {
      this.changeData(1, examineeName, examNum, subjectCode, recordNum, index);
    }
  }

  // 改变状态
  changeData(value, examineeName, examNum, subjectCode, recordNum, index) {
    this.setState({ load: true });
    _x.request('/disciplineManage/finalDisciplineConfirm', {
      "examId": this.examId,//考试计划编号
      "examSessionNum": G.examSessionNum, //场次
      "recordNum": recordNum,
      "examNum": examNum,//准考证号
      "examineeName": examineeName,//考生姓名
      "orgCode": this.state.OrgCode,
      "subjectCode": subjectCode, //机构类型
      "vodeFlag": value,
      "certNo": "544",
      "fcode": "",
      "certTypeCode": "1",
      "examineeCollegeNum": "",
      "subjectName": "",
      "remarkMessage": "",
      "examTime": "",
      "fcodesList": this.state.selectCode

    }, (res) => {

      this.setState({
        load: false,
        selectCode: []
      });
      this.getAbsenceCount(this.state.OrgCode,1,G.examSessionNum);
      if (!res.result) {
        console.log(res.message);
      }
    })
  }

  /**
* 场次
* @param {*} value 
*/
  Screening = (value) => {
    if (value) {
      this.setState({
        examSessionNum: value
      })
      this.getAbsenceCount(this.state.OrgCode,1,value);
    }
  }

    /**
   * 分页
   */
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getAbsenceCount(this.state.OrgCode,pager.current,G.examSessionNum);
  }




  render() {
    const dataSource = this.state.data && this.state.data.length ?
      this.state.data.map((item, index) => {
        return {
          ...item,
          key: index + 1
        }
      })
      : []
    return (
      <QueueAnim delay={300} type="bottom" className="queue-simple">
      <div key="1" className="zn-decre-bg" >
        <div className="zn-decre-bg">
          <div className="zn-decre-head clearfix">
            <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i>{this.state.schoolName}</div>
                <SelectPlace getSelect={this.Screening}/>
            <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
              <Table key="identity"
                loading={this.state.load}
                className="zn-dashline"
                pagination={{ ...this.state.pagination, showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
                dataSource={dataSource}
                onChange={this.handleTableChange.bind(this)}
              >
                <Column title="姓名" dataIndex="examineeName" key="1" className="ljc-col-font-blue"></Column>
                <Column title="性别" dataIndex="sex" key="2" render={(text, record, index) => {
                  return <div key={index} >{!text ? "未知性别" : text === "1" ? "男" : "女"}</div>
                }}></Column>
                <Column title="考籍号" className="ljc-col-font-blue" dataIndex="recordNum" key="3"></Column>
                <Column title="准考证号" className="ljc-col-font-blue" dataIndex="examNum" key="4"></Column>
                <Column title="科目类别" dataIndex="subjectCode" key="5" render={(text, record, index) => {
                     return text ? <div>【{text}】</div> : ""
               }}></Column>
                <Column title={
                  <div className="zn-narrow">
                    <span>现场上报违规</span>
                  </div>
                } dataIndex="localDisciplineFoulCodeList" key="6"
                  render={(text, record, index) => {
                    return <div key={index}>
                      {
                        text.map((v, i) => {
                          return <div key={i} title={v.fname} className="zn-wid200-textOverflow"><span className="zn-font-brown">【{v.fcode}】</span>{v.fname}</div>
                        })
                      }
                    </div>
                  }}
                ></Column>
                <Column title={
                  <div className="zn-narrow">
                    <span>视频上报违规</span>
                  </div>
                }
                  dataIndex="videoDisciplineFoulCodeList" key="7"
                  render={(text, record, index) => {
                    return <div key={index}>
                      {
                        text.map((v, i) => {
                          return <div key={i} title={v.fname} className="zn-wid200-textOverflow"><span className="zn-font-brown">【{v.fcode}】</span>{v.fname}</div>
                        })
                      }
                    </div>
                  }}
                ></Column>
                <Column title={
                  <div className="zn-narrow">
                    <span>最终违规</span>
                  </div>
                }
                  dataIndex="confirmAbsentStatus" key="8" className="zn-detail-select"
                  render={(text, data, index) => {
                    // 获取多选的结果
                    return <div key={index} onMouseLeave={this.onLeave.bind(this, index)} className="zn-mutiple-select">
                      <div id={"zn_" + index} title={text === 0 ? data.lastDisciplineCodeList :""} className={text === 1 ? "zn-mutiple-select-input zn-select-bg-blue" :text === -1 ? "zn-mutiple-select-input zn-select-bg-gray": "zn-mutiple-select-input zn-select-bg-orange"}
                        ref="zn" onClick={this.onFocus.bind(this, index)}>
                        {
                          text === 0 ? data.lastDisciplineCodeList.split(",").map((v, i) => {
                            return <span key={i}>【{v}】</span>
                          }) : text === 1 ? "确认正常" : "未确认"
                        }

                      </div>
                      <span className="ant-select-arrow ant-select-arrow2"></span>
                      <ul id={`zn-click-select` + index} onMouseLeave={this.onLeave.bind(this, index)} className="zn-click-select" >
                        <li onClick={this.Li.bind(this, index)} value="3">确认正常</li>
                        <li onClick={this.Li.bind(this, index)} value="-1">未确认</li>
                        {
                          this.state.allCode.map((val, i) => {
                            return <li key={i} onClick={this.Li.bind(this, index)} value={val.fcode}>{val.fcode}</li>
                          })
                        }
                      </ul>
                    </div>
                  }}
                ></Column>
              </Table>

        </div>
      </div>
      </QueueAnim>
    );
  }
}

