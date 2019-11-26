/*
 * @Author: junjie.lean 
 * @Date: 2018-07-26 15:10:20 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-08-30 13:07:41
 */

/**
 * 最热教师模块
 */

import React from 'react';
import { connect } from "react-redux";
import bg from './../../icon/hotTeacher.png';
import titlePic from './../../icon/til_white.png'
import './../../css/hotTeacher.css';
import { SVG } from '../common';

export default class HotTeacher extends React.Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    static getDerivedStateFromProps(props, state) {
        // console.log(props.hotClassReducer)
        if (props.hotClassReducer.hotTeacher) {
            return {
                ...state,
                data: props.hotClassReducer.hotTeacher.data
            }
        } else {
            return {
                ...state
            }
        }
    }

    gotoSearchWithTeacher(tid, name) {
        this.props.header_search_kerWorld_ac('all', name, 1, 0, () => {
            this.props.history.push('q_searchResult');
        });
    }

    render() {
        if (!this.state.data) {
            return <div></div>
        }
        const data = this.state.data;
        return (
            <div className="lean-hotTeacher-container">
                <img src={bg} />
                <h3>
                    <img src={titlePic} />
                    &nbsp;
                    &nbsp;
                        最热教师
                    &nbsp;
                    &nbsp;
                    <img src={titlePic} />
                </h3>
                <div className="lean-hotTeacher-innerCon">
                    <ul>
                        {
                            data.map((item, index) => {
                                let hasHeadPic = false, headPic = null;
                                if (item.faceImgCloudId !== "") {
                                    hasHeadPic = true;
                                    headPic = `${G.dataServices}/default/resource/getOnlineResource/${G.paramsInfo.orgcode}/${item.faceImgCloudId}/jpg`;
                                }
                                return <li key={index} >
                                    <div
                                        onClick={this.gotoSearchWithTeacher.bind(this, item.tid, item.name)}
                                        className="lxx-g-boxShadow"
                                        style={item.sex === 0 ? { background: "#e6aee5" } : { background: "#8cd2fb" }}>
                                        {
                                            hasHeadPic
                                                ?
                                                <img src={headPic} />
                                                :
                                                item.sex === 0
                                                    ?
                                                    <SVG type="woman" width="80%" height="80%" />
                                                    :
                                                    <SVG type="man" width="80%" height="80%" />
                                        }
                                    </div>
                                    <div className="lean-hotTeacher-name">
                                        {/* <span>{item.name}</span>
                                        <span>&nbsp;&lt;{item.subject.sliceWords(8)}&gt;&nbsp;</span> */}
                                        <span>{item.name} &nbsp;&lt;{item.subject.sliceWords(8)}&gt;&nbsp;</span>
                                    </div>
                                    <div className="lean-hotTeacher-view">
                                        <span>课堂数：{item.classNum}</span>
                                        <span>浏览量：{item.view}</span>
                                    </div>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
}