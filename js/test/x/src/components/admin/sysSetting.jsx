/*
 * @Author: huangjing 
 * @Date: 2018-01-05 16:31:10 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:31:49
 * 系统设置
 */

import React, { Component } from 'react'
import {Panel,SVG} from './../../components/base'
import './../../css/admin/sysSetting.css'
import { Switch } from 'antd';

export class SysSetting extends Component {
    thisOnchange = (checked) =>{
    }
    render () {
        return (
            <Panel>
                <div className='content'>
                    <div className='audit'>
                        <div className='circle'>
                            <svg className="icon" aria-hidden="true" >
                                <use xlinkHref={"#icon-tablet" }></use>
                            </svg>
                        </div>
                        <div className='switchContent'>
                            <p>班牌自动审核</p>
                            <Switch onChange = {(checked)=>thisOnchange(checked)} />
                        </div>
                        <div className='note'>
                            <p>系统自动审核<span>学生发布</span>的终端内容</p>
                            <p>（非自动审核需要班主任人工审核）</p>
                        </div>
                    </div>
                </div>
            </Panel>
        )
    }
}

 