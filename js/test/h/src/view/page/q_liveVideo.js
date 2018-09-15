/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 14:49:47 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-30 19:44:43
 */
/**
 * 在线直播/录播页面
 */
import React from 'react';
import { message } from 'antd';
import { HeaderNav, TeacherNav, AdminNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import ClassrommRes from './../components/q_relateClassromRes';
import VideoPlayer from './../components/JC_video';
import { _x } from './../../js/index';
import noImg from './../../icon/null_b.png';

const Request = _x.util.request.request;

export default class LiveVideo extends React.Component {
    constructor() {
        super();
        this.state = {
            curData: '',
            curId: '',
            resNum: 0,
            resList: [],
        }
    }

    componentDidMount() {
        let params = this.props.match.params,
            id = params.id;
        let param = { "curResourceId": id };
        this.setState({
            curId: id,
        })
        this.getLiveTrailData(param);
    }

    /**
     * 获取直播预告数据
     */
    getLiveTrailData(param) {
        Request('default/resource/getLiveCurResourceInfo', param, (res) => {
            if (res.result && res.data) {
                let data = res.data,
                    resList = data.resourceList || [],
                    curData = {
                        "live": true,
                        "deviceId": data.deviceId,
                        "curResourceId": data.curResourceId,
                        "curName": data.curName,
                        "actureDate": data.actureDate,
                        "weekday": data.weekday,
                        "lessonOrder": data.lessonOrder,
                        "classroomName": data.classroomName,
                        "teacherName": data.teacherName,
                        "subName": data.subName,
                        "livePublishTime": data.livePublishTime,
                        "curDesc": data.curDesc,
                    };
                // console.log(curData);
                this.setState({
                    resList: resList,
                    curData: curData,
                    resNum: resList.length - 1 || 0,
                });
            } else {
                let curData = {
                    "live": false,
                    "message": res.message,
                }
                this.setState({
                    curData: curData,
                })
            }
        }, () => {
            message.warning('请求失败');
        })
    }
    render() {
        let state = this.state;

        const ShowThisPage = true;
        if (!ShowThisPage) {
            return false
        }

        let paramsTarget = this.props.match.params.target;
        return (
            <div>
                {
                    paramsTarget === "reception" ?
                        <HeaderNav />
                        : paramsTarget === "teacher" ?
                            <TeacherNav />
                            :
                            <AdminNav />
                }
                <div className="lxx-g-player">
                    <VideoPlayer liveVideo={1} curData={state.curData} />
                </div>
                <div className="lxx-g-mainCnt">
                    <div className="lxx-m-tab">
                        <span className="lxx-u-tab tab-selectd" onClick={() => { this.setState({ selected: 0 }) }}>相关课堂资源（{state.resNum}）</span>
                    </div>
                    <div style={{ paddingBottom: 30 }}>
                        {
                            state.resList.length === 1 || !state.resList.length
                                ?
                                <div className="lxx-g-noData">
                                    <img src={noImg} alt="" />
                                    <p>暂无课堂关联数据</p>
                                </div>
                                :
                                <ClassrommRes resList={state.resList} />
                        }
                    </div>
                </div>

                <Q_FooterBar />
            </div>
        )
    }
}