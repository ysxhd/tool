/*
 * @Author: junjie.lean 
 * @Date: 2018-07-19 12:56:17 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 12:38:26
 */
/**
 *  初始化页面  所有外部链接均指向此页面
 */

import React, { Component } from 'react';
import ReactLoading from "react-loading";
import { connect } from "react-redux";
import { getUserType_action, loadingGetGloabl_action } from "../../redux/lean.reducers";
import G from '../../js/g';
import request from '../../js/_x/util/request';
import _ from 'lodash';
import './../../css/public.css';
// import { _x as js } from './../../js';
import { message } from 'antd';

const ajax = request.request;
const RequestList = request.requestMultiple;


@connect(state => state, { getUserType_action, loadingGetGloabl_action })
export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 3,
            isJump: false,
        }
        message.config({
            maxCount: 1,
            duration: 3
        })

        //逻辑变更  所有接口都在此接口之后
        let _this = this;
        ajax('default/login/getUserInfo', {}, (res) => {
            if (res.result && res.data) {
                G.userInfo = res.data;
                sessionStorage.userInfo = JSON.stringify(res.data);
                _this.props.getUserType_action(res.data)
            } else {
                message.error(res.message)
            }
            this.getAjaxData();
        })
    }

    //loadingGetUserReducer
    static getDerivedStateFromProps(props, state) {
        G.userInfo = props.loadingGetUserReducer.userInfo;
        sessionStorage.setItem("userInfo", JSON.stringify(props.loadingGetUserReducer.userInfo));
        sessionStorage.setItem("configInfo", JSON.stringify(props.loadingGatGloablReducer.configInfo));
        return {
            ...state,
            userInfo: props.loadingGetUserReducer.userInfo,
        }

    }

    componentDidMount() {
        //文字动效
        let [stopAnimationTimer, that] = [null, this];
        //重定向跳转逻辑
        let redirectTimer = () => {
            setTimeout(() => {
                let tm = that.state.timer - 1;
                that.setState({
                    ...that.state,
                    timer: tm
                });
                if (that.state.timer <= 0 && that.state.isJump) {
                    let redirect = that.state.redirect ? '/' + that.state.redirect : '/index';
                    // that.props.history.push('/index');
                    that.props.history.push(redirect);
                    window.clearTimeout(stopAnimationTimer);
                } else {
                    redirectTimer()
                }
            }, 1000)
        }
        redirectTimer();
    }

    getAjaxData() {
        /**
         * 多接口请求
         */
        // alert('begin')
        let _this = this;
        let reList = [
            // {
            //     method: 'default/login/getUserInfo',
            //     params: {},
            //     success: (res) => {
            //         if (res.result && res.data) {
            //             G.userInfo = res.data;
            //             sessionStorage.userInfo = JSON.stringify(res.data);
            //             _this.props.getUserType_action(res.data)
            //         }
            //     }
            // },
            {
                method: 'default/index/getConfigInfo',
                params: {},
                success: (res) => {
                    if (res.result && res.data) {
                        G.configInfo = res.data;
                        sessionStorage.configInfo = JSON.stringify(res.data);
                        let serverTitle = res.data.sysName;
                        document.querySelector('title').innerHTML = serverTitle || G.title;
                        _this.props.loadingGetGloabl_action(res.data)
                    }
                }
            },
            {
                method: 'default/index/getColSubTeaInfo',
                params: {},
                success: (res) => {
                    if (res.data) {
                        let treeInfos = res.data;
                        G.colSubTeaInfo = treeInfos;
                        sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
                    }
                },
                fail: () => {
                    let treeInfos = { treeInfos: [] };
                    G.colSubTeaInfo = treeInfos;
                    sessionStorage.setItem("colSubTeaInfo", JSON.stringify(treeInfos));
                }
            },
            {
                method: "default/cloudDiskManage/getResourceFormatList",
                params: {},
                success: (res) => {
                    if (res.result && res.message === "OK") {
                        G.resourceFormatList = [...res.data];
                        sessionStorage.resourceFormatList = JSON.stringify(G.resourceFormatList)
                    }
                }
            },
            {
                method: "default/MyClass/getYearSemWeekInfo",
                params: {},
                success: (res) => {
                    if (res.result && res.data) {
                        G.yearTermWeek = res.data;
                        sessionStorage.setItem("yearTermWeek", JSON.stringify(res.data));
                    }
                }
            }
        ];
        RequestList(reList, () => {
            this.setState({
                isJump: true
            })
        })
    }

    render() {

        let msg = `${G.configInfo ? G.configInfo.sysName : G.title} 正在准备数据，请稍等...`;
        return (
            <div className="lean-loading-container">
                <div className="lean-loading-innerCon">
                    <h3 ref={ref => this.msg = ref} style={{ opacity: this.state.op }}>{msg}</h3>
                    <ReactLoading type="bars" color="#fff" />
                </div>
            </div>
        )
    }
}
