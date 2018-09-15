/*
 * @Author: xq 
 * @Date: 2018-07-30 16:24:59 
 * @Last Modified by: xq
 * @Last Modified time: 2018-09-13 15:53:58
 * 课堂管理-查看列表-选择导航
 */
import React from 'react';
import { Link,withRouter } from 'react-router-dom';
import { Input ,message } from 'antd';
import { connect } from 'react-redux';
import CancelOrPubCurModal from './cancelorPubCurModal';
import { HfModal } from './../common';
import { Tm_getScheduleList_ac } from '../../redux/tm_Table.reducer';
import { modifyCurName_ac,getCurDetailed_ac } from '../../redux/b_teacherClassDetail.reducer';
import '../../css/classLook.css';
import _x from '../../js/_x/util/index';

const format = _x.date.format;

const { TextArea } = Input;
@connect(
    state => state, { 
        Tm_getScheduleList_ac, 
        modifyCurName_ac,
        getCurDetailed_ac
    }
)
@withRouter
export default class ClassLookDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuData: [                     // 切换导航标题
                { title: '未开始' },
                { title: '进行中' },
                { title: '已完成' }
            ],
            doingCancle: false,  // 进行中，false 正在直播-可以终止直播;true 直播已终止
            willList: [],        // 未开始
            doingList: [],       // 进行中
            didList: [],         // 已完成
            menuIndex: 0,        // 0 未开始；1 进行中； 2 已完成（导航）
            itemIndex: 0,         // 0 未开始；1 进行中； 2 已完成（列表）
            ModalType: '',      // 
            ModalShowOrHide: false,      // 弹框默认关闭
            curClickId: '000', 
            editable: false,        // 课堂名称是否可修改
            pubDesc: '',           // 课堂名称
            keId: '',             // 修改名称的课堂的id
            reduxData2: {},
            reduxGetName:null,
            clickChangeName:true,   // 输入框获取焦点后，改变了名称
            changeNameTrue:false
        }
        this.renderCard = this.renderCard.bind(this);
    }
    // Role:分角色         manager: 管理员        teacher:老师
    // 确定取消发布         id：课堂资源id       Role：角色判断
    // 发布                id：课堂资源id       Role：角色判断      type: pub:公有、pri:私有  
    // 直播的发布与取消     id：课堂资源id       Role:角色判断       status: A:发布，S:取消       
    /**
     * 打开弹窗
     * obj:{
     * puborcancel:pub:发布、cancel:取消
     * puborpri:pri:私有、pub:公有
     * }
      */
    openModal = (obj) => {
        let puborcancel = obj.puborcancel;
        let puborpri = obj.puborpri;
        let obj2 = obj.puborpri?{ puborcancel,puborpri }:{ puborcancel };
        this.setState({
            ModalShowOrHide: true,
            ModalType: obj2,
            ifMessage:obj.puborcancel,
            curClickId: obj.currid
        })
        if (obj.isZz == 0) {
            this.setState({ doingCancle: true })
        }
    }

    /**
   * 关闭Modal
   */
    closeModal = () => {
        this.setState({
            ModalShowOrHide: false
        })
    }

    // 导航状态切换
    navChange(i) {
        this.setState({
            menuIndex: i,
            itemIndex: i
        })
    }
 
    //点击修改，输入框获取焦点
    handleEdit(Id) {
        // console.log(Id)
        this.setState({
            editable: true,
            keId: Id
        })
    }

    // 修改课堂名称，onChange
    nameChange(e) {
        this.setState({
            pubDesc: e.target.value,
            clickChangeName:true
        })
    }

    // 修改课堂名称 onBlur
    pubDescChange(Id) {
        if(this.state.clickChangeName){
            this.setState({
                editable: false,
                keId: Id
            })
            if(this.state.pubDesc!==''){
                let obj = {
                    "curResourceId": Id,
                    "curName": this.state.pubDesc
                };
                this.props.modifyCurName_ac(obj);
            }
        }
    }

    componentWillReceiveProps(nextprops) {
        let changeNameResult = nextprops.B_TacherClassManDetailReducer.curName_data ;
        if(this.state.pubDesc!=='' && this.state.clickChangeName){
            if(changeNameResult.result){
                message.success(changeNameResult.message);
                this.props.getCurDetailed_ac(this.state.keId)
                this.setState({changeNameTrue:true,pubDesc:''})
            } else {
                message.error(changeNameResult.message)
                // this.setState({pubDesc:''})
            }
        }
      }


    // 3个列表dom
    renderCard() {
        let newCurData = this.props.B_TacherClassManDetailReducer.detailData;
        let newCurName = newCurData?newCurData.curName:null;
        
        let doingCancleRes = this.props.cancelOrPubCurModalReducer.broadcast.result;
        let doingCancle = (doingCancleRes&&this.state.doingCancle)?true:false;
        let willData = [], doingData = [], didData = [];
        let data = this.props.Tm_timeTableReducer.timeTable;
        let itemIndex = this.state.itemIndex;
        data = data.curList;
        let dataAll = [];
        for (var i in data) {
            dataAll.push(data[i]);
        }
        dataAll.map((item, index) => {
            if (item.curFinishStatus === -1) {
                willData.push(item);
            } else if (item.curFinishStatus === 0) {
                doingData.push(item);
            } else if (item.curFinishStatus === 1) {
                didData.push(item)
            }
        })

        // 未开始
        if (itemIndex === 0 && willData.length > 0) {
            return willData.map((item, index) => {
                return <div className='xq-all-li' key={index}>
                    <div className='xq-all-img'>
                        <div>{item.subName}</div>
                    </div>
                    <div className='xq-all-info'>
                        <div className='xq-all-info-head'>
                            <span className='xq-all-info-state will'>未完成</span>
                            <div className='xq-all-info-t'>
                                {
                                    (this.state.editable && this.state.keId === item.curResourceId)
                                        ?
                                        <TextArea defaultValue={newCurName?newCurName:item.curName} autoFocus={this.state.editable} style={{ resize: 'none' }} rows={1} onBlur={this.pubDescChange.bind(this, item.curResourceId)} onChange={this.nameChange.bind(this)}></TextArea>
                                        :
                                        <Link to={`/b_teacherClassMan/detail/${item.curResourceId}`}>
                                            <span>
                                            {
                                                (!this.state.editable && (this.state.keId === item.curResourceId) && this.state.changeNameTrue && newCurName!==null)? newCurName : item.curName
                                            }
                                            </span>
                                        </Link>
                                }
                                <span className={this.state.editable && this.state.keId === item.curResourceId ? 'xq-xgNo' : 'xq-xgYes'} onClick={this.handleEdit.bind(this, item.curResourceId)}>修改</span>
                            </div>
                        </div>
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                科目：{item.subName}
                            </div>
                            <div className='xq-all-info-li'>
                                授课时间：{format(new Date(item.actureDate), 'yyyy-MM-dd')}&nbsp;（周{Number(item.weekday).toChinese()}）&nbsp;第{Number(item.lessonOrder).toChinese()}节
                        </div>
                            <div className='xq-all-info-li'>
                                授课老师：{item.teacherName}
                            </div>
                        </div>
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                录播：{item.videoNum}
                            </div>
                            <div className='xq-all-info-li'>
                                导学:{item.daoxueNum}
                            </div>
                            <div className='xq-all-info-li'>
                                教案：{item.jiaoanNum}
                            </div>
                            <div className='xq-all-info-li'>
                                素材：{item.jiaocaiNum}
                            </div>
                            <div className='xq-all-info-li'>
                                习题：{item.xitiNum}
                            </div>
                        </div>
                    </div>
                    <div className='xq-all-action'>
                        <div className='xq-all-action-text'>
                            {
                                item.livePubStatus === 1 ? '直播审核中' : (
                                    item.livePubStatus === 2 ? '待直播' : '未申请直播'
                                )
                            }
                        </div>
                        <div className='xq-all-action-btn'>
                            {
                                (item.livePubStatus === 1 || item.livePubStatus === 2) ?
                                    <div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'liveCancel', currid: item.curResourceId })}>取消直播</div> :
                                    <div className='lxx-s-blue' onClick={(obj) => this.openModal({ puborcancel: 'livePub', currid: item.curResourceId })}>申请直播</div>
                            }
                        </div>
                    </div>
                </div>
            })
        } else if (itemIndex === 0 && willData.length === 0) {
            return <div className='lxx-g-noData xq-noData'>
                <img src={require('./../../icon/null_b.png')} alt="" />
                <p>暂无数据列表</p>
            </div>
        }

        // 进行中
        if (itemIndex === 1 && doingData.length > 0) {     
            return doingData.map((item, index) => {
                return <div className='xq-all-li' key={index}>
                    <div className='xq-all-img'>
                        <div>{item.subName}</div>
                    </div>
                    <div className='xq-all-info'>
                        <div className='xq-all-info-head'>
                            <span className='xq-all-info-state doing'>进行中</span>
                            <div className='xq-all-info-t'>
                                {
                                    (this.state.editable && this.state.keId === item.curResourceId)
                                        ?
                                        <TextArea defaultValue={newCurName?newCurName:item.curName} autoFocus={this.state.editable} style={{ resize: 'none' }} rows={1} onBlur={this.pubDescChange.bind(this, item.curResourceId)} onChange={this.nameChange.bind(this)}></TextArea>
                                        :
                                        <Link to={`/b_teacherClassMan/detail/${item.curResourceId}`}>
                                            <span>
                                                {
                                                    (!this.state.editable && (this.state.keId === item.curResourceId) && this.state.changeNameTrue && newCurName!==null)? newCurName : item.curName
                                                }
                                            </span>
                                        </Link>
                                }
                                <span className={this.state.editable && this.state.keId === item.curResourceId ? 'xq-xgNo' : 'xq-xgYes'} onClick={this.handleEdit.bind(this, item.curResourceId)}>修改</span>
                            </div> 
                        </div>
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                科目：{item.subName}
                            </div>
                            <div className='xq-all-info-li'>
                                授课时间：{format(new Date(item.actureDate), 'yyyy-MM-dd')}&nbsp;（周{Number(item.weekday).toChinese()}）&nbsp;第{Number(item.lessonOrder).toChinese()}节
                            </div>
                            <div className='xq-all-info-li'>
                                授课老师：{item.teacherName}
                            </div>
                        </div> 
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                录播：{item.videoNum}
                            </div>
                            <div className='xq-all-info-li'>
                                导学:{item.daoxueNum}
                            </div>
                            <div className='xq-all-info-li'>
                                教案：{item.jiaoanNum}
                            </div>
                            <div className='xq-all-info-li'>
                                素材：{item.jiaocaiNum}
                            </div>
                            <div className='xq-all-info-li'>
                                习题：{item.xitiNum}
                            </div>
                        </div>
                    </div>
                    {
                        item.livePubStatus === 2 ? (
                          
                            <div className='xq-all-action'>
                                <div className='xq-all-action-text'>正在直播</div>
                                <div className='xq-all-action-btn'>
                                    <div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'liveCancel', currid: item.curResourceId, isZz: item.curFinishStatus })}>终止直播</div>
                                </div>
                            </div>
                                
                        ) : (
                                <div className='xq-all-action'>
                                {
                                    ( item.livePubStatus !== -2 )?(
                                        <div className='xq-all-action-text'>
                                        {
                                            item.livePubStatus === 0 ? ' 未申请直播' : '直播审核中'
                                        }
                                    </div>
                                    ):(
                                        <div className='xq-all-action-text live-stop'>直播已终止</div>
                                    )
                                }
                                    
                                </div>
                            )
                    }
                </div>
            })
        } else if (itemIndex === 1 && doingData.length === 0) {
            return <div className='lxx-g-noData xq-noData'>
                <img src={require('./../../icon/null_b.png')} alt="" />
                <p>暂无数据列表</p>
            </div>
        }

        // 已完成
        if (itemIndex === 2 && didData.length > 0) {
            return didData.map((item, index) => {
                return <div className='xq-all-li' key={index}>
                    <div className='xq-all-img'>
                        <div>{item.subName}</div>
                    </div>
                    <div className='xq-all-info'>
                        <div className='xq-all-info-head'>
                            <span className='xq-all-info-state did'>已完成</span>
                            <div className='xq-all-info-t'>
                                {
                                    (item.vodPubStatus <2) ? (
                                        <div>
                                            {
                                                (this.state.editable && this.state.keId === item.curResourceId)
                                                    ?
                                                    <TextArea defaultValue={newCurName?newCurName:item.curName} autoFocus={this.state.editable} style={{ resize: 'none' }} rows={1} onBlur={this.pubDescChange.bind(this, item.curResourceId)} onChange={this.nameChange.bind(this)}></TextArea>
                                                    :
                                                    <Link to={`/b_teacherClassMan/detail/${item.curResourceId}`}>
                                                        <span>
                                                            {
                                                                (!this.state.editable && (this.state.keId === item.curResourceId) && this.state.changeNameTrue && newCurName!==null)? newCurName : item.curName
                                                            }
                                                        </span>
                                                    </Link>
                                            }
                                            <span className={this.state.editable && this.state.keId === item.curResourceId ? 'xq-xgNo' : 'xq-xgYes'} onClick={this.handleEdit.bind(this, item.curResourceId)}>修改</span>
                                        </div>
                                    ) : 
                                        <Link to={`/b_teacherClassMan/detail/${item.curResourceId}`}>
                                            <span>
                                                {item.curName}
                                            </span>
                                        </Link>
                                }
                            </div>
                        </div>
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                科目：{item.subName}
                            </div>
                            <div className='xq-all-info-li'>
                                授课时间：{format(new Date(item.actureDate), 'yyyy-MM-dd')}&nbsp;（周{Number(item.weekday).toChinese()}）&nbsp;第{Number(item.lessonOrder).toChinese()}节
                            </div>
                            <div className='xq-all-info-li'>
                                授课老师：{item.teacherName}
                            </div>
                        </div>
                        <div className='xq-all-info-ul'>
                            <div className='xq-all-info-li'>
                                录播：{item.videoNum}
                            </div>
                            <div className='xq-all-info-li'>
                                导学:{item.daoxueNum}
                            </div>
                            <div className='xq-all-info-li'>
                                教案：{item.jiaoanNum}
                            </div>
                            <div className='xq-all-info-li'>
                                素材：{item.jiaocaiNum}
                            </div>
                            <div className='xq-all-info-li'>
                                习题：{item.xitiNum}
                            </div>
                        </div>
                    </div>
                    {
                        ( item.vodPubStatus<1 ) ? (
                            <div className='xq-all-action'>
                                <div className='xq-all-action-texttwo'>
                                    {
                                        item.autoPubType === 1 ? '自动私有发布中...' : (
                                            item.autoPubType === 2 ?'自动公有发布中...':(
                                                item.videoNum>0?'未发布':'无录播资源'
                                            )
                                        )
                                    }
                                </div>
                                {
                                    item.autoPubType>0?(
                                        <div className='xq-all-action-btn'>
                                        {
                                            item.autoPubType === 1
                                            ?<div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pri',currid: item.curResourceId})}>
                                                取消发布
                                            </div>
                                            :(item.autoPubType === 2
                                                ?<div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pub',currid: item.curResourceId})}>
                                                    取消发布
                                                </div>:''
                                            )
                                        }
                                        </div>
                                    ):(
                                        item.videoNum>0?(
                                            <div className='xq-all-action-go'>
                                                <div className='lxx-s-blue' onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pri',currid: item.curResourceId})}>发布到私有</div>
                                                <div className='lxx-s-blue' onClick={(obj) => this.openModal({ puborcancel: 'pub', puborpri: 'pub',currid: item.curResourceId})}>发布到公有</div>
                                            </div>
                                        ):''
                                    )
                                }
                            </div>
                        ) : (
                            item.vodPubStatus>1?(
                                <div className='xq-all-action'>
                                    <div className='xq-all-action-texttwo'>
                                        {item.vodPubType === 1 ? '私有课堂' : (item.vodPubType === 2?'公有课堂':'')}
                                    </div>
                                    <div className='xq-all-action-btn'>
                                        {
                                            item.vodPubType === 1?
                                            <div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pri',currid: item.curResourceId})}>取消发布</div>
                                            :(item.vodPubType === 2?<div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pub',currid: item.curResourceId})}>取消发布</div>:null)
                                         }          
                                    </div>
                                </div>
                            ):(
                                <div className='xq-all-action'>
                                    <div className='xq-all-action-texttwo'>
                                        {
                                            item.vodPubStatus === 1?(
                                                item.vodPubType === 1 ? '私有发布待审核' : (item.vodPubType === 2?'公有发布待审核':'')
                                            ):''
                                        }
                                    </div>
                                    <div className='xq-all-action-btn'>
                                        {
                                            item.vodPubType === 1?
                                            <div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pri',currid: item.curResourceId})}>取消发布</div>
                                            :(item.vodPubType === 2?<div className='lxx-s-orange' onClick={(obj) => this.openModal({ puborcancel: 'cancel',puborpri:'pub',currid: item.curResourceId})}>取消发布</div>:null)
                                         }          
                                    </div>
                                </div>
                                
                            )
                        )
                    }
                </div>
            })
        } else if (itemIndex === 2 && didData.length === 0) {
            return <div className='lxx-g-noData xq-noData'>
                <img src={require('./../../icon/null_b.png')} alt="" />
                <p>暂无数据列表</p>
            </div>
        }
    }

    render() {
        let state = this.state;
        let menuData = state.menuData;
        let menuIndex = state.menuIndex;
        let itemIndex = state.itemIndex;
        let doingCancle = this.state.doingCancle;
        return (
            <div className='xq-all-box'>
                <div className='xq-all-nav'>
                    <div className='xq-all-nav-head'>课堂状态:</div>
                    <div className='xq-all-menus'>
                        {
                            menuData.map((item, i) => (
                                <div className={menuIndex === i ? 'xq-all-menu curr' : 'xq-all-menu'} key={i} onClick={this.navChange.bind(this, i)}>
                                    {item.title}
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='xq-all-ul'>
                    {this.renderCard()}
                </div>
                <HfModal
                    title="消息提示"
                    width={600}
                    ModalShowOrHide={this.state.ModalShowOrHide}
                    closeModal={this.closeModal}
                    contents={
                        <CancelOrPubCurModal Role='teacher' closeModal={this.closeModal} ID={this.state.curClickId} ModalType={this.state.ModalType} />
                    }
                />
            </div>
        )
    }
}
