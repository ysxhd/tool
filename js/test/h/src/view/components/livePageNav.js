/*
 * @Author: xq 
 * @Date: 2018-07-26 09:39:46 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-03 16:45:34
 * 直播首页-头部导航组件
 */
import React from 'react';
import request from '../../js/_x/util/request';
import { getLiveList_ac } from '../../redux/xq_livePage.reducer';
import { Router ,withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import G from '../../js/g';
import '../../css/livePage.css';
import {SVG} from '../common';

const Request = request.request;
let timer;
@connect(state => state, { getLiveList_ac})
class LivePageNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            treeInfos:[],               // 请求拿到的学院与科目
            colleges:[],                // 所有学院
            subjects:[],                // 所有科目
            collegeIndex:0,             // 选中学院索引
            collegeId:0,                // 选中学院id
            collegeSelName:'全部',      // 选中学院名称
            subjectIndex:0,             // 选中科目索引
            subjectId:0,                // 选中科目id
            subjectSelName:'全部',      // 选中科目名称
            delColl:false,              // 显示学院选择关闭按钮
            delSub:false  ,             // 显示科目选择关闭按钮
            isBtnShow:false,            // 展开收缩按钮是否显示
            isBtnUp:true,              // 按钮方向，true：  展开，向下   false:收起，向上
            isBtnShowSub:false,          // 展开收缩按钮是否显示
            isBtnUpSub:true,            // 按钮方向，true：  展开，向下   false:收起，向上
            colHeight:'',
            subHeight:'',
            liveList:{
               test:'测试下嘿嘿'
            },
            adviceListBox:{
                time:'2018-8-2',
                adviceList:[
                    {
                        test:'测试预告'
                    }
                ]
            },
            initRedux:false
        }
        this.getSubject = this.getSubject.bind(this);
        this.cancelCollege = this.cancelCollege.bind(this);
        this.cancelSubject = this.cancelSubject.bind(this);
        this.getBoxHeight = this.getBoxHeight.bind(this);
    }

    componentDidMount(){
        this.getAllColloege();      // 根据缓存，拿到导航所有数据
        let _this = this;
        timer = setInterval(function(){
            let obj = {
                grdId:_this.state.collegeId?_this.state.collegeId:'all',
                subjectId:_this.state.subjectId?_this.state.subjectId:'all',
            }
            _this.props.getLiveList_ac(obj);
        }, 30*1000)
    }

    componentWillUnmount(){
        clearTimeout(timer);
    }

    // 初始化筛选条件
    getAllColloege = () => {
        // 拿到筛选条件和所有筛选数据
        let getParams = this.props.match.params;
        let collegeId = getParams.cid;
        let subjectId = getParams.sid;
        let treeInfos = G.colSubTeaInfo.treeInfos;

        // 把所有学院渲染到列表
        let colleges=[];
        let obj = {
            'trgId':'all',
            'trgName':'全部'
        }
        colleges.unshift(obj);
        treeInfos.map((item)=>{
            colleges.push({'trgId':item.trgId,'trgName':item.trgName})
        })
        this.setState({colleges:colleges})

        // 根据选中的学院，拿到所有科目和教师数据
        let subjectListAll = [];
        treeInfos.map((it)=>{
            if(it.trgId===collegeId){
                subjectListAll = it.subjectList; // 某学院所有科目和教师数据
              }
        })
        // 从所有科目和教师数据中，遍历出所有科目的数据
        let subjectList=[];
        let objj = {
            'subjectId':'all',
            'subName':'全部'
        };
        subjectList.unshift(objj);
        subjectListAll.map((item)=>{
            subjectList.push({'subjectId':item.subjectId,'subName':item.subName})
        })
        this.setState({subjects:subjectList})

        // 遍历学院，选中传过来的学院id
        colleges.map((item,index)=>{
            if(item.trgId===collegeId){
                let idIndex = index;
                this.currCollege(idIndex,collegeId,item.trgName);
            }
        })

        // 根据传来的科目id，拿到选中科目的id
        subjectList.map((i,index)=>{
            if(i.subjectId===subjectId){
                let idIndex = index;
                this.currSubject(idIndex,subjectId,i.subName);
            }
        })

        // 把学院、科目、及所有筛选数据，存进state
        this.setState({
            colleges:colleges,
            treeInfos:treeInfos,
            subjects:subjectList,
            subjectsBF:subjectList,
            initRedux:true
        },()=>{
                this.getBoxHeight();
                this.getSubHeight();
        })
        let reduxParams = {
            grdId:collegeId,
            subjectId:subjectId
        }
        this.props.getLiveList_ac(reduxParams)
    }

    // 点击某学院后触发-获取科目列表
    getSubject(id){
        let treeInfos = G.colSubTeaInfo.treeInfos;
        let subjectListAll = [];
    
        treeInfos.map((it)=>{
            if(it.trgId===id){
                subjectListAll = it.subjectList; // 某学院所有科目和教师数据
            }
        })
        let obj = {
            'subjectId':'all',
            'subName':'全部'
        }
        let subjectList = [];
        subjectList.unshift(obj);
        subjectListAll.map((item)=>{
            subjectList.push({'subjectId':item.subjectId,'subName':item.subName})
        })
        this.setState({subjects:subjectList})
    }

    getSubHeight(){
        let subBox = this.subbox;
        subBox.style.height = 'auto';
        let subhei = subBox.clientHeight;
        this.setState({subHeight:subhei})
        if(subhei>40){
            this.setState({isBtnShowSub:true,isBtnUpSub:true})
            subBox.style.height = '40px';
            subBox.style.overflow ='hidden';
        } else {
            this.setState({isBtnShowSub:false,isBtnUpSub:true})
        }
    }

    // 获取学院高度
    getBoxHeight(){
        
        let box = this.colbox;
        let hei = box.clientHeight;
        this.setState({colHeight:hei})
        if(hei>40){
            this.setState({isBtnShow:true})
            box.style.height = '40px';
            box.style.overflow ='hidden';
        } else {
            this.setState({isBtnShow:false})
        }
    }

    // 按钮换方向
    changeBtn(n){
        let toggleBtn = this.state.isBtnUp;
        let toggleBtnSub = this.state.isBtnUpSub;
        let box = this.colbox;
        let hei = this.state.colHeight;
        let subBox = this.subbox;
        let subhei = this.state.subHeight;
       if(n==1){
            if(toggleBtn){
                box.style.height = hei+'px';
                box.style.overflow ='visible';
            } else {
                box.style.height = '40px';
                box.style.overflow ='hidden';
            }
            this.setState({isBtnUp:!toggleBtn})
       } else if(n==2){
            if(toggleBtnSub){
                subBox.style.height = subhei+'px';
                subBox.style.overflow ='visible';
            } else {
                subBox.style.height = '40px';
                subBox.style.overflow ='hidden';
            }
            this.setState({isBtnUpSub:!toggleBtnSub})
       }
    }

    // 点击选中的学院
    currCollege(index,id,name){
        if( id !== this.state.collegeId){
            let reduxParams = {};
            if( id !== 'all' ){
                this.setState({
                    collegeIndex:index,
                    collegeId:id,
                    collegeSelName:name,
                    subjectIndex:0,
                    subjectSelName:'全部',
                    delColl:true
                },()=>{this.getSubHeight()})
                this.getSubject(id);
                reduxParams.subjectId=this.state.subjectId
            } else {
                this.setState({
                    delSub:false,
                    delColl:false,
                    collegeIndex:0,
                    subjectIndex:0,
                    collegeSelName:'全部',
                    collegeId:'all',
                    subjectId:'all',
                    subjects:[
                        {
                            "subName":"全部",
                            "subjectId":"all" 
                        }
                    ]
                },()=>{this.getSubHeight()})
                reduxParams.subjectId='all'
            }
            if(this.state.initRedux){
                reduxParams.grdId = id;
                this.props.getLiveList_ac(reduxParams);
            }
        }
    }

    // 当前选中科目
    currSubject(index,id,name){
        if( id !== this.state.subjectId ){
            this.setState({
                subjectIndex:index,
                subjectId:id,
                subjectSelName:name
            })
            if(id!=='all'){
                this.setState({
                    delSub:true
                })
            } else {
                this.setState({
                    delSub:false
                })
            }
            if(this.state.initRedux){
                let reduxParams = {
                    grdId:this.state.collegeId,
                    subjectId:id
                }
                this.props.getLiveList_ac(reduxParams)
            }
        }
    }

    // 取消选中大学
    cancelCollege(){
        this.setState({
            subjectSelName:'全部',
            collegeSelName:'全部',
            delSub:false,
            delColl:false,
            collegeIndex:0,
            collegeId:0,  
            subjectIndex:0,
            subjectId:0,
            subjects:[
                {
                 "subName":"全部",
                 "subjectId":"all" 
                }
             ], 
        })
        let reduxParams = {
            grdId:'all',
            subjectId:'all'
        }
        this.props.getLiveList_ac(reduxParams)
    }

    // 取消选中科目
    cancelSubject(){
        this.setState({
            subjectSelName:'全部',
            subjectIndex:0,
            subjectId:0,
            delSub:false
        })
        let reduxParams = {
            grdId:this.state.collegeId,
            subjectId:'all'
        }
        this.props.getLiveList_ac(reduxParams)
    }

    render (){
        let state = this.state;
        let colleges = state.colleges;
        let subjects = state.subjects;
        let n = state.colleges[state.collegeIndex];
        const getCol=colleges.map((item,index)=>{
            return (
                <span 
                    className={state.collegeIndex===index?'xq-live-nav-item curr':'xq-live-nav-item'} 
                    key={index} 
                    onClick={this.currCollege.bind(this,index,item.trgId,item.trgName)}
                    >{item.trgName}
                </span>
            )
        })

        const getSub =  subjects.map((item,index)=>{
            return (
                <div className={this.state.subjectIndex===index?'xq-live-nav-item curr':'xq-live-nav-item'} key={index} onClick={this.currSubject.bind(this,index,item.subjectId,item.subName)}>{item.subName}</div>
            )
        });
         
        return (
            <div className='xq-live-nav-box'>
                <div className='xq-live-nav'>
                    <div className='xq-live-nav-ul'>
                        <div className='xq-live-nav-li xq-clear'>
                            <div className='xq-live-nav-t'>学院：</div>
                            <div className='xq-live-nav-items'>
                                <div ref={(ref) => this.colbox = ref}>
                                    {getCol}
                                </div>
                            </div>
                            {
                                state.isBtnShow
                                ?<div className='xq-live-btn' onClick={this.changeBtn.bind(this,1)}>
                                    {
                                        state.isBtnUp
                                        ?<span>展开</span>
                                        :<span>收缩</span>
                                    }
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref={state.isBtnUp? '#icon-pullDown' : '#icon-pullUp'}></use>
                                    </svg>
                                </div>
                                :null
                            }
                        </div>
                        <div className='xq-live-nav-li xq-clear'>
                            <div className='xq-live-nav-t'>班级：</div>
                            <div className='xq-live-nav-items'>
                                <div ref={(ref) => this.subbox = ref}>
                                    {getSub}
                                </div>
                            </div>
                            {
                                state.isBtnShowSub
                                ?<div className='xq-live-btn' onClick={this.changeBtn.bind(this,2)}>
                                    {
                                        state.isBtnUpSub
                                        ?<span>展开</span>
                                        :<span>收缩</span>
                                    }
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref={state.isBtnUpSub? '#icon-pullDown' : '#icon-pullUp'}></use>
                                    </svg>
                                </div>
                                :null
                            }
                        </div>
                    </div>
                    <div className='xq-live-condition xq-clear'>
                        <div className='xq-live-condition-t'>当前条件：</div>
                        <div className='xq-live-condition-ul'>
                                {
                                    this.state.delColl?(
                                        <div className='xq-live-condition-li' onClick={this.cancelCollege}>
                                            {this.state.collegeSelName}
                                            <SVG type='close' style={{width:'10px',height:'10px',color:'blue'}}></SVG>
                                        </div>
                                    ):null
                                }
                                {
                                    this.state.delSub?'>':null
                                }
                                {
                                    this.state.delSub?(
                                        <div className='xq-live-condition-li' onClick={this.cancelSubject}>        
                                            {this.state.subjectSelName}
                                            <SVG type='close' style={{width:'10px',height:'10px',color:'blue'}}></SVG>
                                        </div>
                                    ):null
                                }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(LivePageNav)