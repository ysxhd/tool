/*
 * @Author: junjie.lean 
 * @Date: 2018-05-17 13:22:49 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-05-24 10:22:54
 */

import React, { Component } from 'react';
import { G, _x } from '../../js/index';

const Ajax = _x.util.request.request;

export class MsgTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            location: G.uinfo.Org_name,
            exam: G.exam.name
        }
    }

    componentWillReceiveProps(newProps) {
        let exam_id = newProps.curExamid.id,
            _this = this,
            org_code = newProps.curOrgcode.value;

        if (!exam_id || !org_code) {
            return false;
        }

        let exam = G.exam.name;

        if (newProps.type == 0) {
            Ajax('gather/info', {
                exam_id,
                org_code
            }, (res) => {
                if (res.result && res.code == 200 && res.data && res.data.gather) {
                    let msg = <p>整体采集汇报：应采集考生总数为{res.data.gather.all_num}人，已采集 {res.data.gather.get_count}人，未采集 {res.data.gather.none} 人。</p>;
                    _this.setState({
                        msg,
                        exam,
                        location: res.data.gather.org_name
                    })
                } else {
                    let msg = <p>整体采集汇报：采集信息获取失败，请稍后重试。</p>;
                    _this.setState({
                        msg
                    })
                }
            }, () => {
                let msg = <p>整体采集汇报：采集信息获取失败，请稍后重试。</p>;
                _this.setState({
                    msg
                })
            })

        } else if (newProps.type == 1) {

            Ajax('data_count/info', {
                exam_id,
                org_code
            }, (res) => {
                if (res.result && res.code == 200 && res.data && res.data.dataCount) {
                    let msg = <p>应下发考点数{res.data.dataCount.all_exam}个，已下发考点数{res.data.dataCount.get_exam}个。应下发人数{res.data.dataCount.all_person}人，已下发人数 {res.data.dataCount.get_person}人。</p>
                    _this.setState({
                        msg,
                        exam,
                        location: res.data.dataCount.org_name
                    })
                } else {
                    let msg = <p>数据查询失败，请稍后重试。</p>;
                    _this.setState({
                        msg
                    })
                }
            }, () => {
                let msg = <p>数据查询失败，请稍后重试。</p>;
                _this.setState({
                    msg
                })
            })

        } else {
            return false
        }
    }

    /* 收缩展开 */
    showHide() {
        this.setState({
            isShow: !this.state.isShow
        })
    }

    render() {
        let location = this.state.location || "";

        let exam_name = this.state.exam || "";
        return (
            <div className="lxx-g-text">
                <svg className="icon lxx-m-meg" aria-hidden="true" onClick={this.showHide.bind(this)}>
                    <use xlinkHref={!this.state.isShow ? '#icon-down' : '#icon-up'}></use>
                </svg>
                <h2>{exam_name}</h2>
                <h2>{location} {this.props.type == 0 ? "采集信息" : "数据准备"}统计简报</h2>
                <div className={!this.state.isShow ? 'hideVi' : 'lxx-m-text showVi'}>
                    {this.state.msg}
                </div>
            </div>
        )
    }
}
