/*
 * @Author: junjie.lean 
 * @Date: 2018-07-25 10:50:13 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 14:04:02
 */
/**
 * 最热课堂
 */

import React from "react";
// import { Link } from 'react-router-dom';
import { SVG } from './../common';
import G from "./../../js/g";
import './../../css/hotClass.css';
import publicPng from './../../icon/myHot_public.png';
import ownPng from './../../icon/myHot_own.png';
import headPng from './../../icon/til_red.png';
import url from './../../js/_x/util/url';


const goWith = url.goWith;

// Myhotclass
export default class MyHotClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            myHotPubClass: [],
            myHotPriClass: []
        };
    }

    static getDerivedStateFromProps(props, state) {
        // console.log(props.hotClassReducer);
        // console.log(props);
        if (props.hotClassReducer && props.hotClassReducer.myHotPubClass && props.hotClassReducer.myHotPriClass) {
            return {
                ...state,
                myHotPubClass: props.hotClassReducer.myHotPubClass.data,
                myHotPriClass: props.hotClassReducer.myHotPriClass.data,
            }
        } else {
            return { ...state }
        }
    }

    jumpTo(id, classType, userType) {
        let pr = {
            to: "q_recordVideo",
            with: [userType, id, classType]
        }
        goWith(pr)
    }
    render() {
        if (!this.state.myHotPubClass) {
            return false
        }
        let [isShowPublic, isShowPrivent] = [G.configInfo.pubCurType === 1, true];
        let { myHotPubClass, myHotPriClass } = this.state;
        // console.log(myHotPriClass)
        let usertype = G.userInfo.accTypeId == 3 ? "reception" : "admin";
        let renderlist = (data, isPub) => {
            if (data.length > 0) {
                return <ul>
                    {
                        data.map((item, index) => {
                            return <li key={index} >
                                <span className={`lean-myHotClass-order lean-myHotClass-order-${index + 1}`}>{index + 1}</span>
                                {/* <Link className="lean-myHotClass-link"  to={`/q_recordVideo/${usertype}/${item.classId}/${isPub ? "true" : "false"}`}>{item.name}</Link> */}
                                <span
                                    title={item.name}
                                    className="lean-myHotClass-link"
                                    style={{ cursor: "pointer" }}
                                    onClick={this.jumpTo.bind(this, item.classId, isPub ? "true" : "false", usertype)}>
                                    {item.name.sliceWords(35)}
                                </span>
                                <span className="lean-myHotClass-view">
                                    <SVG type="browseNum" />
                                    &nbsp;
                                    &nbsp;
                                    {item.view}
                                </span>
                            </li>
                        })
                    }
                </ul>
            } else {
                return <div className="lxx-g-noData" style={{ margin: '50px auto' }}>
                    <img src={require('./../../icon/null_b.png')} />
                    <p>暂无列表数据</p>
                </div>
            }
        }

        return (
            <div className="lean-myHotClass">
                <div className="lean-myHotClass-title">
                    <h3 >
                        <img src={headPng} />
                        &nbsp;
                        &nbsp;
                        我的最热
                        &nbsp;
                        &nbsp;
                        <img src={headPng} />
                    </h3>
                </div>
                {
                    isShowPublic
                        ?
                        <div className={isShowPrivent ? "lean-myHotClass-publicClass lxx-g-boxShadow" : "lean-myHotClass-publicClass-only  lxx-g-boxShadow"}>
                            <p>
                                <span className="lean-myHotClass-innerHead">公共课堂</span>
                                <img className="lean-myHotClass-innerpic" src={publicPng} />
                            </p>
                            {
                                renderlist(myHotPubClass, true)
                            }
                        </div>
                        :
                        null
                }
                {
                    isShowPrivent
                        ?
                        <div className={isShowPublic ? "lean-myHotClass-priventClass lxx-g-boxShadow" : "lean-myHotClass-priventClass-only lxx-g-boxShadow"}>
                            <p>
                                <span className="lean-myHotClass-innerHead">私有课堂</span>
                                <img className="lean-myHotClass-innerpic" src={ownPng} />
                            </p>
                            {
                                renderlist(myHotPriClass, false)
                            }
                        </div>
                        :
                        null
                }
            </div>
        )
    }
}