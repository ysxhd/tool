/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 14:28:47 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-23 11:13:10
 * 搜索结果首页  根据参数判断搜索条件是搜索全局课堂还是公共课堂还是私有课堂
 */
import React, { Component } from 'react';
import { HeaderNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import SearchResult from '../components/JC_searchResult';

export default class Q_SearchResult extends React.Component {

    constructor() {
        super();
    }

    componentDidMount() {
        this.setFooterTop();
    }

    setFooterTop = () => {
        let _this = this;
        // 视口高度
        let clientHeight = document.documentElement.clientHeight;
        // header高度
        let headerHeight = 80;
        // footer 高度
        let footerHeight = 200;
        // 拿到中间内容的最小的高度 
        let distanceHeight = clientHeight - 80 - 200;
        // 当中间内容的高度 小于 最小高度 则给他赋值最小高度
        if (_this.contentNode.clientHeight < distanceHeight) {
            _this.contentNode.style.minHeight = distanceHeight + "px";
        }
    }


    render() {
        return (
            <div>
                <HeaderNav />
                <div ref={node => this.contentNode = node} >
                    <SearchResult />
                </div>
                <Q_FooterBar />
            </div>
        )
    }
}