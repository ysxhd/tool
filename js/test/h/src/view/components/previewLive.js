/*
 * @Author: xq 
 * @Date: 2018-07-23 17:11:10 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-07-27 14:23:42
 * 直播预告
 */

import React from 'react';
import '../../css/indexPubClass.css';
import { Link,Router } from 'react-router-dom';
import {SVG} from './../common';

export default class PreviewLive extends React.Component{
    constructor(){
        super();
        this.state = {
            liveNum:15,
            preview:20
        }
    }
    render(){
        return (
            <Link to='/q_livepage'>
                <div className='xq-live-entrance'>
                    <div className='xq-live-icon'>
                        <SVG type='live' style={{width:'36px'}}></SVG>
                    </div>
                    <div>当前共{this.state.liveNum}个直播，{this.state.preview}个预播</div>
                </div>
            </Link>
        )
    }
}