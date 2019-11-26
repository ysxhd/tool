/*
 * @Author: xq 
 * @Date: 2018-07-23 13:50:04 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-13 14:29:15
 * 首页-直播课堂
 */
import React from 'react';
import { Select } from 'antd';
import { Link, Router,withRouter } from 'react-router-dom';
import request from './../../js/_x/util/request';
import url from './../../js/_x/util/url';
import G from '../../js/g';
import '../../css/indexPubClass.css';
import {SVG,SpinLoad} from '../common';

const Option = Select.Option;
const Request = request.request;
const goWith = url.goWith;
class IndexLiveClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liveClassList: [],        // 直播列表
      treeInfos: [],
      currCollegeId: 'all',     // 入参-当前选中学院
      currSubjectId: 'all',     // 入参-当前选中科目
      currSubjectValue:'',      // change后，科目选中值
      isSelectChange:false,
      allColleges: [],          // render-所有学校数据 
      allSubjects: [{'subjectId': 'all', 'subName': '全部科目'}],       // render-所有科目数据
      liveNum: 0,
      preview: 0,
      isFirst:true
    }
    this.handleChange = this.handleChange.bind(this);
    this.getAllCollegesName = this.getAllCollegesName.bind(this);
    this.getAllSubjectsName = this.getAllSubjectsName.bind(this);
    this.getClassList = this.getClassList.bind(this);
    this.goLiveListPage = this.goLiveListPage.bind(this);
  }
  // 跳转到直播列表页面
  goLiveListPage(n){
    let collegeId = this.state.currCollegeId;
    let subjectId = this.state.currSubjectId;
    if( n==1 ){
      if(this.state.liveNum !==0 || this.state.preview !==0){
        this.props.history.push(`/q_livepage/${collegeId}/${subjectId}`);
      } 
    } else {
      this.props.history.push(`/q_livepage/${collegeId}/${subjectId}`);
    }
  }

  //跳转到 直播/直播预告 页面
  goLivePage(isLive, id,stime) {
    if (isLive === '2') {
      let goWhere = {
        to: 'q_liveTrail',
        with:['reception',`${id}`,'true',`${stime}`]
      }
      goWith(goWhere);
    } else if (isLive === '1') {
      let goWhere = {
        to: 'q_liveVideo',
        with:['reception',`${id}`,'true']
      }
      goWith(goWhere);
    }
  }

  // 获取课堂列表
  getClassList(sele1,sele2) {
    let params = {
      "grdId":sele1?sele1:this.state.currCollegeId,
      "subjectId":sele2?sele2:this.state.currSubjectId,
    }
    Request('live/liveAdvice/getHomeLiveAdviceList',params,(res)=>{
      if(res.data){
          this.setState({
            liveClassList:res.data.liveAdviceList
          })
      }
    })
  }

  // 下拉框值改变
  handleChange(n,value,title) {
    // console.log(value)
    let sele1 ='all', sele2='all';
      if( n==='1' && value !== this.state.currCollegeId){
          if(value==='all'){
            this.setState({
              allSubjects:[{'subjectId': 'all', 'subName': '全部科目'}],
              currSubjectId:'all',
              currCollegeId: 'all'
            })
            sele1 = 'all',sele2 = 'all';
          } else {
            sele1 = value,sele2 = 'all';
            this.setState({
              currCollegeId:value,
              currSubjectId: 'all'
            });
            this.getAllSubjectsName(value);
          }
          sele2 = 'all'; 
        this.setState({isSelectChange:true})
      } else if( n==='2' && value !== this.state.currSubjectId ){
          if(value==='all'){
            sele2 = 'all';
          } else {
            sele2=value;
            this.setState({currSubjectId:value});
          }
          this.setState({currSubjectValue:title.props.title,isSelectChange:false})
          sele1 =this.state.currCollegeId;
      } 
      this.getClassList(sele1,sele2);
      this.getPubNum(sele1, sele2);
    
  }

  // 所有科目名称  入参是学院ID
  getAllSubjectsName(value) {
    let treeInfos = G.colSubTeaInfo.treeInfos;
    let Subjects = [];
    for (var m = 0; m < treeInfos.length; m++) {
      if (treeInfos[m].trgId === value) {
        Subjects = treeInfos[m].subjectList; 
      }
    }
    let allSubjects = [];
    let obj = {
      'subjectId':'all',
      'subName':'全部科目'
    };
    allSubjects.unshift(obj);
    for (var n = 0; n < Subjects.length; n++) {
      allSubjects.push({ 'subjectId': Subjects[n].subjectId, 'subName': Subjects[n].subName });
    }
    this.setState({
      allSubjects: allSubjects
    })
  }

  // 所有学院名称
  getAllCollegesName() {
    let treeInfos =G.colSubTeaInfo.treeInfos;
    let allColleges = [];
    let obj = {
      'trgId':'all',
      'trgName':'全部学院'
    };
    allColleges.unshift(obj);
    treeInfos.map(dt=>{
      allColleges.push({
        'trgId':dt.trgId,'trgName':dt.trgName
      });
    })
    this.setState({ allColleges: allColleges,treeInfos:treeInfos })
  }

  // 3 请求直播数量和预告数量
  getPubNum = (sele1, sele2) => {
    let params = {
      "grdId": sele1 ? sele1 : this.state.currCollegeId,
      "subjectId": sele2 ? sele2 : this.state.currCollegeId
    };
    Request('live/liveAdvice/getLiveAdviceCount', params, (res) => {
      if (res.data) {
        let data = res.data;
        this.setState({
          liveNum: data.liveNum,
          preview: data.adviceNum,
          isFirst:false
        })
      }
    })
  }

  componentDidMount() {
    this.getAllCollegesName();
    this.getClassList();
    this.getPubNum();
  }

  render() {
    let liveClassList = this.state.liveClassList;   // 直播课堂列表
    liveClassList = liveClassList.slice(0, 4);
    let allColleges = this.state.allColleges;     
    let allSubjects = this.state.allSubjects;     
    let GLiveShow = G.configInfo.liveCurType;     // 是否开启直播课堂 0关1开
    let isFirst = this.state.isFirst;
    return (
     <div>
        {
          (GLiveShow === 1)?(
            <div className='xq-index-classroom'>
              <div className='xq-class-head'>
                <div className='xq-class-head-l'>
                  <div className='xq-class-head-li'>
                    <Select defaultValue="全部学院" onChange={value => { this.handleChange('1', value) }}>
                      {
                        allColleges.map((item, index) => {
                          return <Option value={item.trgId} key={index} title={item.trgName}>{item.trgName}</Option>
                        })
                      }
                    </Select>
                  </div>
                  <div className='xq-class-head-li'>
                  {
                    allSubjects.length>1
                      ? (
                        <Select onChange={(value,title) => { this.handleChange('2', value,title) }} value={this.state.isSelectChange?"全部科目":((this.state.currSubjectValue!=='')?this.state.currSubjectValue:"全部科目")}>
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
                </div>
                <div className='xq-class-live-center'>直播课堂</div>
                <div className='xq-class-head-right'>
                  <div className='xq-class-more'>
                    <div className='xq-public-class-btn' onClick={this.goLiveListPage}>更多>></div>
                  </div>
                </div>
              </div>
              <div className='xq-class-items'>
                {
                  liveClassList.length?
                  liveClassList.map((item, index) => {
                    let url = G.dataServices + '/default/resource/getOnlineResource/';
                  url += G.paramsInfo.orgcode + '/' + item.thumbnailId + '/jpg';
                    return (
                      <div className='xq-class-item' key={index} onClick={this.goLivePage.bind(this, item.isLive, item.curResourceId,item.actureStartTime)}>
                        <div className='xq-class-cover'>
                          <img style={item.thumbnailId == null ? { display: 'none' } : { display: 'block' }} src={url} alt="" />
                          <div className='xq-class-cover-t'>{item.subName}</div>
                           <div className={item.isLive === '1' ? 'xq-live-tag-on' : 'xq-live-tag-preview'}>
                            {item.isLive === '1' ? '直播中' : '预告'}
                          </div>
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
                              <div className='xq-item-infor-p'>{item.concurrentNum || 0}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                  :(
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
              <div className='xq-live-entrance' onClick={this.goLiveListPage.bind(this,'1')}>
                  <div className='xq-live-icon'>
                    <SVG type='live' style={{ width: '36px' }}></SVG>
                  </div>
                  <div>
                    当前共{this.state.liveNum}个直播，{this.state.preview}个预告
                  </div>
              </div>
            </div>
          ):null
        }  
      </div>
    )
  }
}
export default withRouter(IndexLiveClass); 