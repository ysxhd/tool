/*
 * @Author: xq 
 * @Date: 2018-07-23 13:50:04 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-13 14:28:34
 * 首页-公共课堂
 */
import React from 'react';
import { Select } from 'antd';
import { connect } from 'react-redux';
import { Link, Router, withRouter } from 'react-router-dom';
import { handleUpdateParams } from './../../redux/lxx.pubClass.reducer';
import request from './../../js/_x/util/request';
import url from './../../js/_x/util/url';
import G from '../../js/g';
import '../../css/indexPubClass.css';
import {SVG,SpinLoad} from '../common';

const Request = request.request;
const Option = Select.Option;
const goWith = url.goWith;

@connect(state => state, { handleUpdateParams})
class IndexPubClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pubClassList: [],   
      treeInfos: [], 
      currCollegeId: 'all',     // 入参-当前选中学院
      currSubjectId: 'all',     // 入参-当前选中科目
      currTeacherId: 'all',     // 入参-当前选中教师
      currSubjectValue:'',      // change后，科目选中值
      isSelectChange:false,
      currTeacherValue:'',      // change后，教师值
      isSelectChangeT:false,
      sortFlag: '2',           // 入参-0最新(正) 1最新(逆) 2最热(正) 3最热(逆) 4授课时间(正) 5授课时间(逆)"
      allColleges: [],          // render-所有学校数据 
      allSubjects: [{ 'subjectId': 'all', 'subName': '全部科目' }],       // render
      allTeachers: [{ 'userId': 'all', 'username': '全部老师' }],         // render
      allSubjectsInfo: [],    // 稍后取老师名称用
      sortData: [
        { title: '最新', key: '0' },
        { title: '最热', key: '2' }
      ],
      isFirst:true,
      randomkey: 0
    }
    this.handleChange = this.handleChange.bind(this);
    this.getAllCollegesName = this.getAllCollegesName.bind(this);
    this.getAllSubjectsName = this.getAllSubjectsName.bind(this);
    this.getAllTeachersName = this.getAllTeachersName.bind(this);
    this.getClassList = this.getClassList.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.goPubPage = this.goPubPage.bind(this);
  }

  //跳转到视频页面
  goDetailPage(id) {
    let goWhere = {
      to: 'q_recordVideo',
      with:['reception',`${id}`,'true']
    }
    goWith(goWhere);
  }

  // 跳转到公共课堂页面
  goPubPage() {
    let grdId = this.state.currCollegeId,
      subjectId = this.state.currSubjectId,
      teacherId = this.state.currTeacherId,
      sortId = this.state.sortFlag;
    let obj = {
      "grdId": grdId,  
      "subjectId": subjectId,  
      "sort": sortId,  
      "teacherId": teacherId
    };
    this.props.handleUpdateParams(obj);
    this.props.history.push(`/q_publicClass/${grdId}/${subjectId}/${teacherId}/${sortId}`);
  }

  // 最新-最热切换
  handleChangeSort(value) {
    let sele1, sele2, sele3;
    this.setState({ sortFlag: value });
    this.getClassList(sele1, sele2, sele3, value);
  }

  // 请求-获取所有列表
  getClassList(sele1, sele2, sele3, sort4) {
    let params = {
      "grdId": sele1 ? sele1 : this.state.currCollegeId,
      "subjectId": sele2 ? sele2 : this.state.currSubjectId,
      "sort": sort4 ? sort4 : this.state.sortFlag,
      "teacherId": sele3 ? sele3 : this.state.currTeacherId,
    }
    Request('public/publicClass/getHomePubClassList', params, (res) => {
      if (res.data) {
        this.setState({
          pubClassList: res.data.pubClassList,
          isFirst:false
        })
      }
    })
  }

  // 下拉框值改变
  handleChange(n, value,title) {
    let sele1 ='all', sele2='all', sele3='all', sort4=this.state.sortFlag;
    let state = this.state;
      if (n === '1' && value !== state.currCollegeId) {
          if (value === 'all') {
            this.setState({
              allSubjects: null,
              allTeachers: null,
              currCollegeId: 'all',
              currSubjectId: 'all',
              currTeacherId: 'all',
            })
            sele1 = 'all'; 
          } else {
            sele1 = value;
            this.setState({ 
              currCollegeId: value,
              currSubjectId:'all' ,
              currTeacherId: 'all'     // 入参-当前选中教师
            });
            this.getAllSubjectsName(value);
          }
          sele2 = 'all'; sele3 = 'all';
          this.setState({isSelectChange:true})
        } else if (n == '2' && value !== state.currSubjectId) {
          if (value === 'all') {
            this.setState({
              allTeachers: null,
              currSubjectId: 'all',
              currTeacherId: 'all'
            });
            sele2 = 'all';
          } else {
            sele2 = value;
            this.setState({ 
              currSubjectId: value,
              currTeacherId: 'all'
            });
            this.getAllTeachersName(value);
          }
          this.setState({currSubjectValue:title.props.title,isSelectChange:false,isSelectChangeT:true})
          sele1 =this.state.currCollegeId;sele3 = 'all';
          
        } else if (n === '3' && value !== state.currTeacherId) {

          sele3 = value;
          sele1 = this.state.currCollegeId;
          sele2 = this.state.currSubjectId;
          this.setState({ currTeacherId: value,isSelectChangeT:false,currTeacherValue:title.props.title });
        }
        this.getClassList(sele1, sele2, sele3, sort4);
      
  }

  // 所有教师名称 入参是科目ID
  getAllTeachersName(value) {
    let allSubjectsInfo = this.state.allSubjectsInfo;
    let Teachers = [];
    let obj = {
      'userId': 'all',
      'username': '全部教师'
    };
    for (var j = 0; j < allSubjectsInfo.length; j++) {
      if (allSubjectsInfo[j].subjectId === value) {
        Teachers = allSubjectsInfo[j].userList; // 所有教师数据
      }
    }
    if(Teachers[0].userId !=='all'){
      Teachers.unshift(obj);
    } 
    this.setState({ allTeachers: Teachers })
  }

  // 所有科目名称  入参是学院ID
  getAllSubjectsName(value) {
    let treeInfos = this.state.treeInfos;
    let Subjects = [];
    for (var m = 0; m < treeInfos.length; m++) {
      if (treeInfos[m].trgId === value) {
        Subjects = treeInfos[m].subjectList; // 某学院所有科目和教师数据
      }
    }
    let allSubjects = [];
    let allSubjectsInfo = [];   //给教师方法用
    let obj = {
      'subjectId': 'all',
      'subName': '全部科目'
    };
    allSubjects.unshift(obj);
    for (var n = 0; n < Subjects.length; n++) {
      allSubjects.push({ 'subjectId': Subjects[n].subjectId, 'subName': Subjects[n].subName });
      allSubjectsInfo.push({ 'userList': Subjects[n].userList, 'subjectId': Subjects[n].subjectId })
    }
    this.setState({
      allSubjects: allSubjects,
      allSubjectsInfo: allSubjectsInfo
    })
  }

  // 1 获取所有学院名称
  getAllCollegesName() {
    let treeInfos = G.colSubTeaInfo.treeInfos;
    let allColleges = [];
    let obj = {
      'trgId': 'all',
      'trgName': '全部学院'
    };
    allColleges.unshift(obj);
    for (var j = 0; j < treeInfos.length; j++) {
      allColleges.push({
        'trgId': treeInfos[j].trgId, 'trgName': treeInfos[j].trgName
      });
    }

    this.setState({
      allColleges: allColleges,
      treeInfos: treeInfos
    })
  }

  // 跳转到直播页
  goLivePage() {
    if (this.state.liveNum !== 0 || this.state.preview !== 0) {
      let collId = this.state.currCollegeId, subIn = this.state.currSubjectId;
      this.props.history.push(`/q_livepage/${collId}/${subIn}`)
    }
  }

  componentDidMount() {
    // 1 获取所有学院名称，并赋给下拉框
    this.getAllCollegesName();
    // 2 进入页面后请求列表数据
    this.getClassList();

  }
  render() {
    let pubClassList = this.state.pubClassList;   // 公有课堂列表
    pubClassList = pubClassList.slice(0, 4);
    let allColleges = this.state.allColleges;     // 所有学院名称
    let allSubjects = this.state.allSubjects;     // 所有科目列表
    let allTeachers = this.state.allTeachers;     // 所有教师名称
    let sortData = this.state.sortData;           // 所有排序
    let randomkey = this.state.randomkey;
    let GLiveShow = G.configInfo.liveCurType;     // 是否开启直播课堂 0关1开
    let GPubShow = G.configInfo.pubCurType;      // 是否开启公开课堂 0关1开
    let isFirst = this.state.isFirst;

    return (
      <div>
        {
          GPubShow ? (
            <div className='xq-index-classroom'>
              <div className='xq-class-head'>
                <div className='xq-class-head-l'>
                  <div className='xq-class-head-li'>
                    <Select defaultValue='全部学院' onChange={(value) => { this.handleChange('1', value) }}>
                      {
                        allColleges.map((item, index) => {
                          return <Option key={index} value={item.trgId} title={item.trgNam}>{item.trgName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className='xq-class-head-li'>
                    {
                      allSubjects
                        ? (
                          <Select onChange={(value,title) => { this.handleChange('2', value,title)}} value={this.state.isSelectChange?"全部科目":((this.state.currSubjectValue!=='')?this.state.currSubjectValue:"全部科目")}>
                            {
                              allSubjects.map((item, index) => {
                                return <Option value={item.subjectId} key={index} title={item.subName}>{item.subName}</Option>
                              })
                            }
                          </Select>
                        )
                        : (
                          <div>
                            <Select value="全部科目" onChange={value => { this.handleChange('2', value) }}>
                              <Option value="all">全部科目</Option>
                            </Select>
                          </div>
                        )
                    }
                  </div>
                  <div className='xq-class-head-li'>
                    {
                      allTeachers ? (
                        <Select onChange={(value,title) => { this.handleChange('3', value,title) }} value={this.state.isSelectChangeT?"全部教师":((this.state.currTeacherValue!=='')?this.state.currTeacherValue:"全部教师")}>
                          {
                            allTeachers ?
                              allTeachers.map((item, index) => {
                                return <Option value={item.userId} key={index} title={item.username}>{item.username}</Option>
                              }) : null
                          }
                        </Select>
                      ) : (
                          <div>
                            <Select value="全部老师" onChange={value => { this.handleChange('3', value) }}>
                              <Option value="all">全部老师</Option>
                            </Select>
                          </div>
                        )
                    }
                  </div>
                </div>
                <div className='xq-class-head-center'>公共课堂</div>
                <div className='xq-class-head-right'>
                  <div className='xq-class-more'>
                    <div className='xq-public-class-btn' onClick={this.goPubPage}>更多>></div>
                  </div>
                  <div className='xq-class-sort'>
                    <Select defaultValue={sortData?"最热":''} onChange={value => { this.handleChangeSort(value) }}
                      style={{ 'width': '90px', 'fontSize': '12px', 'marginLeft': '10px' }}>
                      {
                        sortData.map((item, index) => {
                          return <Option value={item.key} key={index}>{item.title}</Option>
                        })
                      }
                    </Select>
                  </div>
                </div>
              </div>
              <div className='xq-class-items'>
                {
                  pubClassList.length ? (
                    pubClassList.map((item, index) => {
                      let url = G.dataServices + '/default/resource/getOnlineResource/';
                      url += G.paramsInfo.orgcode + '/' + item.thumbnailId + '/jpg';
                      return (
                        <div className='xq-class-item' key={index} onClick={this.goDetailPage.bind(this, item.curResourceId)}>
                          <div className='xq-class-cover'>
                            <img style={item.thumbnailId == null ? { display: 'none' } : { display: 'block' }} src={url} alt="" />
                            <div className='xq-class-cover-t'>{item.subName}</div>
                          </div>
                          <div className='xq-item-info'>
                            <div className='xq-item-info-t' title={item.curName}>{item.curName}</div>
                            <div className='xq-item-info-ul'>
                              <div className='xq-item-info-li'>
                                <span>
                                  <SVG type='teacher'></SVG>
                                </span>
                                <div className='xq-item-infor-p'>{item.teacherName}</div>
                              </div>
                              <div className='xq-item-info-li'>
                                <span>
                                  <SVG type='browseNum'></SVG>
                                </span>
                                <div className='xq-item-infor-p'>{item.pubWatchNum || 0}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div>
                        {
                            isFirst?
                            <div className='xq-live-loading'>
                                <SpinLoad />
                            </div>
                            :(
                                <div className='lxx-g-noData xq-noData'>
                                    <img src={require('./../../icon/null_b.png')} alt=""/>
                                    <p>暂无数据列表</p>
                                </div>
                            )
                        }
                    </div>
                    )
                }
              </div>
            </div>
          ) : null
        }
      </div>
    )
  }
}
export default withRouter(IndexPubClass); 