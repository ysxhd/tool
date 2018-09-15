/*
 * @Author: zhangning 
 * @Date: 2018-04-17 15:07:08 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-11 09:30:15
 */
import React, { Component } from 'react';
import { G } from '../../utils/g'
import { Select } from 'antd';

const Option = Select.Option;
export default class SelectPlace extends Component {
    constructor() {
        super();
        this.state = {
            examSessionNum: G.examSessionNum
        }
        this.allExam = JSON.parse(sessionStorage.getItem("loginData")).examSessionInfos;
    }

    componentWillMount(){
        if (!G.examSessionNum) {
            G.examSessionNum = this.allExam[0].examSessionNum;
        }
    }

    Screening = (value) => {
        if (value) {
            this.setState({
                examSessionNum: value
            })
            G.examSessionNum = value;
            this.props.getSelect(value);
        }
    }

    render() {
        return (
            <Select defaultValue={this.state.examSessionNum} className="fr" style={{ width: 174 }} onChange={this.Screening}>
                {this.allExam.map((val, i) => {
                    return <Option key={i} value={val.examSessionNum}>{val.subjectName}</Option>
                })}
            </Select>
        );
    }
}