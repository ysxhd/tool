import React, { Component } from 'react';
import '../../css/absent_supervise/comprehensive.css'
import { Select, Table } from 'antd';
import _x from '../../utils/_x/index';
import {G} from '../../utils/g';
import SelectPlace from '../public_components/select';

const Option = Select.Option;
const { Column } = Table;
export class ComprehensiveChild extends Component {
  constructor() {
    super();
    // this.handleChange = this.handleChange.bind(this);
    this.state = {
      OrgCode:"",
      data:[],
      load:false,
      paegindex:1,
      flag: false,//小三角的开关
      pagination: {
        total: 0,
        pageSize: 10,
        current:1
      },
      screen: '',
      flag1: 0,
      flag2: 2,
      flag3: 2,
      flag4: 2,
      flag5: 2,
      flag6: 2,
    }
    this.examId = JSON.parse(sessionStorage.getItem("examId")); 
    this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos; 
    this._isMounted = true;
  }

  handleChange(index, value,op) {
      var allData = this.state.data;
      var sdata = allData[index];
      this.changeData(value,sdata.examineeName,sdata.examNum,sdata.subjectCode,sdata.recordNum);
      if(value === "2"){
        value = 1;
      }
     
      allData[index].confirmAbsentStatus = Number(value)
      this.setState({
        data: allData
      })
  }


  // 改变状态
  changeData(value,name,num,subjectCode,recordNum) {
    this.setState({load:true});
    _x.request('/absenceGeneralManage/getFinalAbsenceConfirm', {
      "examId": this.examId,//考试计划编号
      "examSessionNum": G.examSessionNum, //场次
      "recordNum":recordNum,
      "examNum":num,//准考证号
      "examineeName":name,//考生姓名
      "orgCode": this.state.OrgCode,
      "subjectCode":subjectCode, //机构类型
      "vodeFlag":value,
      "certNo":"544",
      "fcode":"",
      "certTypeCode":"1",
      "examineeCollegeNum":"",
      "subjectName":"",
      "remarkMessage":"",
      "examTime":"",
      "fcodesList":[]
      
    }, (res) => {
      this.setState({load:false});
      if (!res.result) {
        console.log(res.message);
      }
    })
  }


  componentWillMount(){
    var params = JSON.parse(decodeURIComponent(this.props.match.params.id))
     var OrgCode = params.orgCode;
     var schoolName = params.schoolName;
     var orgTypeId = params.orgTypeId;
     if(!G.examSessionNum){
      G.examSessionNum = this.allExam[0].examSessionNum;
    }
     this.setState({
      OrgCode,
      schoolName,
      orgTypeId,
      examSessionNum:G.examSessionNum
     })
     this.getData(OrgCode,orgTypeId,1,G.examSessionNum);
   }
 
   getData(OrgCode,orgTypeId,paegindex,examSessionNum) {

    var index = paegindex ? paegindex : this.state.pageindex;

     this.setState({load:true});
     _x.request('/absenceGeneralManage/getAllAbsenceByOrgInfo', {
       "examId": this.examId,//考试计划编号
       "orgCode": OrgCode,
       "orgTypeId":orgTypeId, //机构类型
       "currentPage":index,
       "pageSize":10,
       "examSessionNum": examSessionNum //场次
     }, (res) => {
       if (res.result) {
        if (this._isMounted){
          var data = res.data;
          this.setState({
            load:false,
            data:data.pageData,
            pagination: {
              total: data.totalRow,
              pageSize: 10,
              current: index
            }
          });
        }
       }else{
        this.setState({
          load:false
        });
       }
     })
   }

   componentWillUnmount(){
    this._isMounted = false;
  }

  // 点击小三角排序
  upAndDown(index) {
    console.log(index)
    switch (index) {
      case 1:
        if(this.state.flag1 === 0){
          this.setState({
            flag1: 1,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        } else if (this.state.flag1 === 1){
          this.setState({
            flag1: 0,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })   
        }else{
          this.setState({
            flag1: 0,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })   
        }
        break;
        
      case 2:
        if (this.state.flag2 === 0) {
          this.setState({
            flag1: 2,
            flag2: 1,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        } else if (this.state.flag2 === 1){
          this.setState({
            flag1: 2,
            flag2: 0,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        }else{
          this.setState({
            flag1: 2,
            flag2: 0,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        }
        break;
      case 3:
        if (this.state.flag3 === 0) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 1,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        } else if (this.state.flag3 === 1) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 0,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        } else {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 0,
            flag4: 2,
            flag5: 2,
            flag6: 2,
          })
        }
        break;

      case 4:
        if (this.state.flag4 === 0) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 1,
            flag5: 2,
            flag6: 2,
          })
        } else if (this.state.flag4 === 1) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 0,
            flag5: 2,
            flag6: 2,
          })
        } else {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 0,
            flag5: 2,
            flag6: 2,
          })
        }
        break;


      case 5:
        if (this.state.flag5 === 0) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 1,
            flag6: 2,
          })
        } else if (this.state.flag5 === 1) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 0,
            flag6: 2,
          })
        } else {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 0,
            flag6: 2,
          })
        }
        break;

      case 6:
        if (this.state.flag6 === 0) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 1,
          })
        } else if (this.state.flag6 === 1) {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 0,
          })
        } else {
          this.setState({
            flag1: 2,
            flag2: 2,
            flag3: 2,
            flag4: 2,
            flag5: 2,
            flag6: 0,
          })
        }
        break;
      default:
        return;
    } 
  }
  // "examId": this.examId,//考试计划编号
  // "orgCode": OrgCode,
  // "orgTypeId":orgTypeId, //机构类型
  // "currentPage":index,
  // "pageSize":10,
  // "examSessionNum": G.examSessionNum //场次


    /**
   * 场次
   * @param {*} value 
   */
  Screening = (value) => {
    if (value) {
      this.setState({
        examSessionNum: value
      })
      this.getData(this.state.OrgCode,this.state.orgTypeId,1,value);
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
    this.getData(this.state.OrgCode, this.state.orgTypeId, pager.current,this.state.examSessionNum);
  }




  render() {
    const dataSource = this.state.data && this.state.data.length?
    this.state.data.map((item,index)=>{
      return{
        ...item,
        key:index+1
      }
    })
  :[]
    return (
      <div className="zn-decre-bg" >
        <div className="zn-decre-bg">
          <div className="zn-decre-head clearfix">
            <div className="zn-decre-head-name fl" onClick={() => { this.props.history.goBack() }}><i className="iconfont icon-xiala"></i>{this.state.schoolName}</div>
               <SelectPlace getSelect={this.Screening}/>
            <div className="zn-decre-head-title fr">场次&nbsp;:</div>
          </div>
            <Table key="identity1"
            className="zn-dashline"
            loading={this.state.load}
            pagination={{ ...this.state.pagination, showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
            dataSource={dataSource}
            onChange={this.handleTableChange.bind(this)}
            >
            <Column title="姓名" dataIndex="examineeName" key="1" className="ljc-col-font-blue"></Column>
            <Column title="性别" dataIndex="sex" key="2" render={(text, record, index) => {
                  return <div key={index} >{!text ? "未知性别" : text === 1 ? "男":"女"}</div>
            }}></Column>
            <Column title="考籍号" className="ljc-col-font-blue" dataIndex="recordNum" key="3"></Column>
            <Column title="准考证号" className="ljc-col-font-blue" dataIndex="examNum" key="4"></Column>
            <Column title="科目类别" dataIndex="subjectCode" key="5" render={(text, record, index) => {
                  return text ? <div>【{text}】</div> : ""
            }}></Column>

            <Column title={
              // <div>1</div>zn-narrow zn-narrow-isclick-up zn-narrow-isclick-down
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 1)}>
                <span>身份验证缺考</span>
                  {/* {
                    this.state.flag1 ===0 ? 
                      <div>
                        <div className="zn-narrow-up"></div>
                      <div className="zn-narrow-downActive"></div>
                      </div>
                    : this.state.flag1 === 1 ?
                      <div>
                        <div className="zn-narrow-upActive"></div>
                        <div className="zn-narrow-down "></div>
                      </div>
                    : 
                      <div>
                        <div className="zn-narrow-up "></div>
                        <div className="zn-narrow-down "></div>
                      </div>
                  }  */}
              </div>
            } dataIndex="authentication" key="6"
              render={(text, record, index) => {
                   return text ? <div key={index} className="zn-block-text">缺考</div> :"";  
              }}
            ></Column>


            <Column title={
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 2)}>
                <span>现场上报缺考</span>
              </div>
            } dataIndex="localAppear" key="7"
              render={(text, record, index) => {

                return  text ? <div key={index} className="zn-block-text">缺考</div> :""; 
              }}

            // dataIndex="7" key="7"
            // render={(text, record, index) => (
            //    <div key={index} className="zn-block-text">{text}</div>
            // )}
            ></Column>


            <Column title={
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 3)}>
                <span>视频上报缺考</span>
              </div>
            }
              dataIndex="videoAppear" key="8"
              render={(text, record, index) => {

                return text ? <div key={index} className="zn-block-text">缺考</div> :""; 
              }}
            ></Column>
            <Column title={
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 4)}>
                <span>阅卷缺考</span>
              </div>
            }
              dataIndex="paperAbsence" key="9"
              render={(text, record, index) => {

                return text ? <div key={index} className="zn-block-text">{text}</div> :""; 
              }}
            ></Column>
            <Column title={
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 5)}>
                <span>成绩缺考</span>
              </div>
            }
              dataIndex="scoreAbsence" key="10"
              render={(text, record, index) => {

                return text ? <div key={index} className="zn-block-text">缺考</div> :""; 
              }}
            ></Column>
            <Column title={
              <div className="zn-narrow" onClick={this.upAndDown.bind(this, 6)}>
                <span>最终缺考</span>
              </div>
            }
              dataIndex="confirmAbsentStatus" key="11" className="zn-detail-select"
              render={(text, data, index) => {
                return <Select key={index} value={text === 0 ? "缺考":text === 1 ? "参考":"未确认"}  className={text === -1 ? "zn-select-bg-gray" : text === 1 ? "zn-select-bg-blue" : "zn-select-bg-red"}  style={{ width: 86 }} onSelect={this.handleChange.bind(this, index)}>
                  <Option value="0">缺考</Option>
                  <Option value="2">参考</Option>
                  <Option value="-1">未确认</Option>
                </Select>
              }}
            ></Column>
          </Table>
          
        </div>
      </div>
    );
  }
}

