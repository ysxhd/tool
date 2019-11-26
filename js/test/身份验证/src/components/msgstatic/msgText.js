/*
 * @Author: lxx 
 * @Date: 2018-05-16 17:31:24 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-05-22 10:49:22
 */

import React, { Component } from 'react';
import { Container } from './../../components/common';
import { _x } from './../../js/index';

const Request = _x.util.request.request;

export class MsgText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            planName: '',
            orgName: '',
            orgCode: '',
            examId: '',
            data: {
                "build": {
                    "device_sum": 0,//设备总数
                    "device_identity_num": 0,//身份验证设备数
                    "device_gather_num": 0,//身份采集设备数
                },//建设情况汇报
                "exam": {
                    "use_device": 0,//启用设备总数
                    "use_rate": 0,//启用率
                },//考试启用汇报
                "inspection_progress": {
                    "has_inspected": 0,//已巡检设备数
                    "un_inspected": 0,//未巡检设备数
                    "inspection_rate": 0,//
                },//巡检进度汇报
                "inspection_status": {
                    "err_sum": 0,//异常总数
                    "err_software_num": 0,//软件异常
                    "err_hardware_num": 0,//硬件异常
                    "err_data_num": 0,//数据准备异常
                },//巡检状态汇报
            },
            isShow: false
        }
    }

    /**
     * 获取简报数据
     * @param {* 考试计划ID} examId 
     * @param {* 机构ID} code 
     */
    getTextData(examId, code) {
        let pr = {
            "orgCode": code,
            "ex_id": examId
        }
        Request('device/get_count_info', pr, (res) => {
            // console.log(res);
            if(res.result) {
                this.setState({
                    data: res.data
                })
            }
        })
    }

    /* 收缩展开 */
    showHide() {
        this.setState({
            isShow: !this.state.isShow
        })
    }
    
    componentDidUpdate() {
        // 考试计划或机构变更时，更新对应数据
        if(this.props.exmOrg.curExamid.id !== this.state.examId || this.props.exmOrg.curOrgcode.value !== this.state.orgCode) {
            if(!!this.props.exmOrg.curExamid && !!this.props.exmOrg.curOrgcode.value) {
                let examId = this.props.exmOrg.curExamid,
                    orgCode = this.props.exmOrg.curOrgcode;
                // 获取对应机构数据
                this.getTextData(examId.id, orgCode.value);
                // 更新组件state
                this.setState({
                    examId: examId.id,
                    orgCode: orgCode.value,
                    planName: examId.name,
                    orgName: orgCode.label
                })
            }

        } 
    }

    render() {
        let state = this.state,
            build = state.data.build,
            exam = state.data.exam,
            progress = state.data.inspection_progress,
            status = state.data.inspection_status;

        return(
            <div className="lxx-g-text">
                <svg className="icon lxx-m-meg" aria-hidden="true" onClick={this.showHide.bind(this)}>
                    <use xlinkHref={!state.isShow ? '#icon-down' : '#icon-up'}></use>
                </svg>
                <h2>{state.planName}</h2>
                <h2>{state.orgName} 设备信息统计简报</h2>
                <div className={!state.isShow ? 'hideVi' : 'showVi'}>
                    <p>建设情况汇报：身份验证系统共建设设备合计 {build.device_sum} 台，其中身份采集设备 {build.device_identity_num} 台，身份验证设备 {build.device_gather_num} 台。</p>
                    <p>考试启用汇报：本次考试共启用设备 {exam.use_device} 台，启用率为 {exam.use_rate}%。</p>
                    <p>巡检进度汇报：本次考试已巡检设备 {progress.has_inspected} 台，未巡检设备 {progress.un_inspected} 台，整体巡检进度为 {progress.inspection_rate}%。</p>
                    <p>巡检状态汇报：本次考试已巡检出异常设备 {status.err_sum} 台，其中软件检测异常 {status.err_software_num} 台（占{status.err_software_rate}%），硬件检测异常 {status.err_hardware_num} 台（占{status.err_hardware_rate}%），数据准备异常 {status.err_data_num} 台。</p>
                </div>
            </div>
        )
    }
}