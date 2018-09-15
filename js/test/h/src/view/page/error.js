/*
 * @Author: junjie.lean 
 * @Date: 2018-07-20 14:21:36 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-14 10:05:52
 */
/**
 * 登录错误及其他界面
 */
import React from 'react';
import FailImg from './../../icon/404.png'

export default class Error extends React.Component {

    render() {
        return <div className="lxx-g-error">
            <div>
                <img src={FailImg} alt="" />
                <p>登录错误，请联系管理员</p>
            </div>

        </div>
    }
}