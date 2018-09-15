/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 14:51:42 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-07-25 16:59:09
 */
/**
 * PDF播放页
 * 播放方式沿用2.0的解决方案
 */

import React from 'react';

export default class PDFShow extends React.Component {
    render() {
        const ShowThisPage = true;
        if (!ShowThisPage) {
            return false
        }
        return (
            <div>pdf页面</div>
        )
    }
}