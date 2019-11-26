/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-27 10:37:58
 * 页面左列组件
 */
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { StuPubTrain, StuPubDuty, StuPubMessage, StuWishWall, success, error } from './index.js';
import { SVG } from './../base.js'; 
import _x from '../../js/_x/index.js';
import './../../css/student/stuLeft.css';

export class StuLeft extends Component {
  constructor(props){
    super(props);
    this.state = {
      classId: "",
      classInfo: '',
      showClassInfo: false,
      showInfoStatus: 1,
      teaInfo: '',
      showTeaInfoStatus: 1,
      modal1: false,
      modalOneText: '',
      showModalInform: false,
      stuDutyData: [],
      dutyTime: '',
      dutyWeekDay: '',
      showDutyList: false,
      dutyStatus: 1,
      modalTwo: false,
      weekOrder: -1,
      curWeekStuDutyData: [],
      saveCurWeekDutyData: [],
      modalThree: false,
      showWorkInform: false,
      workText: '',
      modalFour: false,
      wishData: [],
      wishNum: 0
    };
  }

  componentWillMount() {
    this.setState({
      classId: this.props.classId
    })
    this.getClassTrainData()
    this.getCurDayDutyStudent();
  }

  // 获取班风数据
  getClassTrainData() {
    // ajax获取班风班训数据
   if(!this.props.classId){
     return;
   }
    let trainPr = {
      action: 'api/web/monitor_class_for_students/message/find_class_motto',
      data: {
        "classId": this.props.classId
      }
    }
    _x.util.request.formRequest(trainPr,(res) =>{
      let data = res.data;
      if(!data){
        this.setState({
          classInfo: '',
          teaInfo: '',
          showClassInfo: false,
          showInfoStatus: 4,
          showTeaInfoStatus: 4
        })
      } else {
        this.setState({
          showInfoStatus: data.mottoStatus,
          showTeaInfoStatus: data.msgStatus,
          teaInfo: data.teacherMessage
        })
        let classInfo = data.classMotto;
        if(classInfo){
          this.setState({
            classInfo: classInfo,
            showClassInfo: true
          })
        } else {
          this.setState({
            classInfo: '',
            showClassInfo: false
          })
        }
      }
    })
  }

  // 显示发布、修改班训班风弹窗
  publishClassInfo(a) {
    if(a){
      this.setState({
        modal1: true
      })
    }
  }
  // 关闭发布、修改班训班风弹窗
  handleCancelModelOne = () => {
    this.setState({
      modal1: false,
      showModalInform: false
    });
  }
  
  // 发布新的或修改班风班训内容
  publishTrainContent(){
    this.setState({
      showModalInform: false
    })
    let info = this.state.modalOneText;
    if(!info){
      this.setState({
        showModalInform: true
      })
    } else {
      this.setState({
        showInform: false
      })
      // ajax发布班风班训
      this.handlePublishClassInfo(this.props.classId, 1, info);
    }
  }

  /**
   * 发布班风班训或老师留言
   * @param {* 班级Id} classId 
   * @param {* 发布类型} type 1:班风班训 2:老师留言 
   * @param {* 班风带发布内容} message 
   */
  handlePublishClassInfo(classId, type, message){
    let pr = {
      "action": "api/web/monitor_class_for_students/message/publish_class_motto",
      "data": {
        "classId": classId,
        "type": type,
        "msg": message
      }
    }
    _x.util.request.formRequest(pr,(res) => {
      let result = res.result;
      if(result) {
        if(type === 1) {
          success(res.message,1000);
          // 更新班风班训内容
          this.setState({
            modal1: false
          }, () =>{
            this.getClassTrainData();
          })
        } else if(type === 2) {
          success(res.message,1000);
          // 关闭弹窗
          this.setState({
            modalThree: false
          }, () => {
            this.getClassTrainData();
          })
        }
      } else {
        this.setState({
          showClassInfo: true,
          workText: ''
        })
        error('发布失败，请稍后重试');
      }
    })
  }

  // 查询当日值日信息
  getCurDayDutyStudent(){
    if(!this.props.classId){
      return;
    }

    let dutyPr = {
      action: "api/web/monitor_class_for_students/duty/find_duty",
      data: {
        "classId": this.props.classId
      }
    }
    _x.util.request.formRequest(dutyPr, (res) => {
      let data = res.data,dutyData;
       if(res.code == "200"){
         dutyData = data.dutyStudent;
         if(!dutyData.length){
          this.setState({
            showDutyList: false,
            dutyStatus: '',
            stuDutyData:[]
          })
        } else {
          this.setState({
            stuDutyData: dutyData,
            dutyTime: _x.util.date.format(new Date(data.dutyTime),'yyyy-MM-dd'),
            dutyWeekDay: _x.util.number.toChinese(new Date(data.dutyTime).getDay(), false),
            showDutyList: true,
            dutyStatus: data.auditStatus
          })
        }
       }
    })
  }

  // 显示当前周值日弹窗
  showCurrentWeekStuDuty(f){
    if(f){
      // 请求当前周值日数据
      let pr = {
        action: "api/web/monitor_class_for_students/duty/find_weeks_duty",
        data: {
          "classId": this.props.classId
        }
      }
      _x.util.request.formRequest(pr, (res) => {
      if(res.data){
        let weekOrder = res.data[0].weekOrder;
        this.setState({
          weekOrder: weekOrder,
          curWeekStuDutyData: res.data,
          saveCurWeekDutyData: res.data
        }, () =>{
          this.setState({
            curWeekStuDutyData: this.state.saveCurWeekDutyData
          }, () =>{
            this.setState({
              modalTwo: true
            })
          })
          
        })
      }
      }, (fai) => {
        error('请求数据失败')
      })
    }
  }
  // 关闭设置当前周值日弹窗
  handleCancelModelTwo(){
    this.setState({
      modalTwo: false,
    })
  }

  // 发布当前周值日列表
  submitStuDutyList(){
    let pr = {
      action: 'api/web/monitor_class_for_students/duty/publish_weeks_duty',
      data: {
        "classId": this.props.classId,
        "dutys": this.state.curWeekStuDutyData
      }
    }
    _x.util.request.formRequest(pr,(res) => {
      if(res.result) {
        success(res.message,1000);
        this.setState({
          modalTwo: false
        })
        // 重新请求当前值日数据
        this.getCurDayDutyStudent();
      } else {
        error(res.message);
      }
    })
  }

  // 打开关闭老师寄语弹窗
  publishWorkDia(a) {
    if(a){
      this.setState({
        modalThree: true
      })
    }
  }

  // 发布老师寄语
  publishWorkContent(){
    this.setState({
      showWorkInform: false
    })

    let cnt = this.state.workText;
    if(!cnt){
      this.setState({
        showWorkInform: true
      })
    } else {
      // 发送ajax请求
      this.handlePublishClassInfo(this.props.classId, 2, cnt)
    }
  }

  // 关闭发布作业弹窗
  handleCancelModelThree(){
    this.setState({
      modalThree: false,
      showWorkInform: false
    })
  }

  // 打开审核心愿弹窗
  applyWishDia(){
    let pr = {
      action: 'api/web/monitor_class_for_students/wish_wall/resend_wish',
      data: {
        "classId": this.props.classId,
        "pageIndex": 1,
        "pageSize": 20
      }
    }
    // ajax请求心愿列表
    _x.util.request.formRequest(pr, (res) => {
      let data = res.data,
        num = res.total;
      this.setState({
        wishData: data,
        wishNum: num,
        modalFour: true
      })
    })
  }
  // 关闭审核心愿弹窗
  closeStuWishDia(){
    this.setState({
      modalFour: false
    });
  }

  // 修改父组件的state值
  setSet(obj) {
    this.setState(obj);
  }

  componentDidMount() {
    
  }

  componentDidUpdate() {
    if(this.state.classId !== this.props.classId) {
      this.setState({
        classId: this.props.classId
      })


      this.getClassTrainData();
      this.getCurDayDutyStudent()
    }
  }

  render(){
    
    return (
      <div> 
        {/* 班风班训展示 */}
        <div className="lxx-left-g-pubTrain">
          <div className="lxx-g-winTop">
            <span className="lxx-u-select">班风班训</span>
            <label className={this.state.showInfoStatus === 0 ? 'lxx-u-status audit' : 'hidden'}>待审核</label>
            <label className={this.state.showInfoStatus === 2 ? 'lxx-u-status refuse' : 'hidden'}>未通过</label>
          </div>
          <div className="lxx-g-pubCnt">
            {
              !this.state.showClassInfo ?
              <div className={!this.state.showClassInfo ? 'lxx-pub-g-noCnt' : 'lxx-pub-g-noCnt hidden'}>
                <svg className="icon" aria-hidden="true" onClick={this.publishClassInfo.bind(this, true)}>
                    <use xlinkHref={"#icon-edit" }></use>
                </svg>
                <p>填写班训</p>
              </div>
              :
              <div className={!this.state.showClassInfo ? 'lxx-pub-g-hasCnt hidden' : 'lxx-pub-g-hasCnt'}>
                <p>
                  修改班风班训
                  <span>
                    <svg className="icon" aria-hidden="true" onClick={this.publishClassInfo.bind(this, true)}>
                        <use xlinkHref={"#icon-pen" }></use>
                    </svg>
                  </span>
                </p>
                <div title={this.state.classInfo}>{this.state.classInfo}</div>
              </div>
            }
            {/* 发布、修改班风班训弹窗 */}
            <Modal
              title="班风班训"
              visible={this.state.modal1}
              width={540}
              maskClosable={false}
              destroyOnClose={true}
              className="lxx-g-dialog left"
              okText="发布"
              onOk={this.publishTrainContent.bind(this)}
              cancelText="取消"
              onCancel={this.handleCancelModelOne.bind(this)}
            >
              <StuPubTrain 
                infoData={this.state.classInfo}
                showModalInform={this.state.showModalInform}
                setSet={this.setSet.bind(this)} 
                handleCancel={this.handleCancelModelOne.bind(this)}/>
            </Modal>

          </div>
        </div>

        {/* 值日安排 */}
        <div className="lxx-left-g-stuDuty">
          <div className="lxx-g-winTop">
            <span className="lxx-u-select">值日安排</span>
            <label className={this.state.dutyStatus === 0 ? 'lxx-u-status audit' : 'hidden'}>待审核</label>
            <label className={this.state.dutyStatus === 2 ? 'lxx-u-status refuse' : 'hidden'}>未通过</label>
          </div>
          <div className="lxx-left-g-dutyCnt">
            {
              !this.state.stuDutyData.length 
              ?
              <div className={!this.state.showDutyList ? 'lxx-duty-g-noCnt' : 'hidden'}>
                <svg className="icon" aria-hidden="true" onClick={this.showCurrentWeekStuDuty.bind(this, true)}>
                    <use xlinkHref={"#icon-duty" }></use>
                </svg>
                <p>发布值日安排</p>
              </div>
              :
              <div className={this.state.showDutyList ? 'lxx-duty-g-hasCnt' : 'hidden'}>
                <p>
                  <span>{this.state.dutyTime}</span>
                  <span>星期{this.state.dutyWeekDay}</span>
                  <span onClick={this.showCurrentWeekStuDuty.bind(this, true)}>
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref={"#icon-pen" }></use>
                    </svg>
                  </span>
                </p>
                <div className="lxx-duty-g-list">
                {
                  this.state.stuDutyData.map((item, index)=>{
                    let url = item.image;
                    let sex = parseInt(item.sex);
                    let img = '';
                    if(!url){
                      if(!sex){
                        img = <SVG type="female-o" />;
                      } else {
                        img = <SVG type="male-o" />;
                      }
                    } else {
                      img = <img src={url} ref={img => this.img = img} onError={() => this.img.src = require('../../img/noHeader.png')}/>;
                    }
                    return(
                      <div key={index}>
                        {img}
                        <span>{item.name}</span>
                      </div>
                    )
                  })
                }
                </div>
              </div>
            }
          </div>
        </div>
        {/* 当前周值日安排弹窗 */}
        <Modal
          title="发布值日"
          visible={this.state.modalTwo}
          width={906}
          maskClosable={false}
          destroyOnClose={true}
          className="lxx-g-dialog center lxx-dt-g-dia"
          footer={this.state.weekOrder === -1 ? '' : [
            <div>
              <Button key="back" className="ant-btn" onClick={this.handleCancelModelTwo.bind(this)}>取消</Button>,
              <Button key="submit" className="ant-btn ant-btn-primary" type="primary" onClick={this.submitStuDutyList.bind(this)}>
                发布
              </Button>,
            </div>
          ] }
          onCancel={this.handleCancelModelTwo.bind(this)}
        >  
          {
            this.state.weekOrder === -1
            ?
            <div>
              <div className="lxx-g-noData">
                  <img src={require('../../img/noData.png')} />
                  <span>啊嘞，好像没有找到当前周次</span>
              </div>
            </div>
            :
            <StuPubDuty
            classId={this.props.classId}
            curStuDutyData={this.state.curWeekStuDutyData}
            // curWeekList={this.saveCurWeekDutyData}
            setSet={this.setSet.bind(this)}/>
          }

        </Modal>

        {/* 留言及作业 */}
        <div className="lxx-left-g-work" onClick={this.publishWorkDia.bind(this, true)}>
          <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-staff"}></use>
          </svg>
          <div>
            <p>老师寄语</p>
            <p className={this.state.showTeaInfoStatus === 0 || 2 ? '' : 'hidden'}>
              <label className={this.state.showTeaInfoStatus === 0 ? 'lxx-u-status audit' : 'hidden'}>待审核</label>
              <label className={this.state.showTeaInfoStatus === 2 ? 'lxx-u-status refuse' : 'hidden'}>未通过</label>
            </p>
          </div>
        </div>
        {/* 发布、修改班风班训弹窗 */}
        <Modal
          title="发布老师寄语"
          visible={this.state.modalThree}
          width={540}
          maskClosable={false}
          destroyOnClose={true}
          className="lxx-g-dialog left"
          okText="发布"
          onOk={this.publishWorkContent.bind(this)}
          cancelText="取消"
          onCancel={this.handleCancelModelThree.bind(this)}
        >
          <StuPubMessage
            infoStatus={this.state.showTeaInfoStatus}
            teaInfo={this.state.teaInfo}
            setSet={this.setSet.bind(this)} 
            showWorkInform={this.state.showWorkInform}
            handleCancel={this.handleCancelModelThree.bind(this)}/>
        </Modal>

        {/* 心愿墙 */}
        <div className="lxx-left-g-applyWish" onClick={this.applyWishDia.bind(this)}>
          <svg className="icon" aria-hidden="true">
              <use xlinkHref={"#icon-heart" }></use>
          </svg>
          <p>审核心愿墙</p>
        </div>
        {/* 审核心愿墙弹窗 */}
        <Modal
          title="审核心愿墙"
          visible={this.state.modalFour}
          width={760}
          maskClosable={false}
          destroyOnClose={true}
          footer={false}
          className="lxx-g-dialog lxx-g-wishDia stuCheck"
          onCancel={this.closeStuWishDia.bind(this)}
        >  
          <StuWishWall
            classId={this.props.classId}
            data={this.state.wishData}
            num={this.state.wishNum}
            setSet={this.setSet.bind(this)}/>
        </Modal>
      </div>
    )
  }
}