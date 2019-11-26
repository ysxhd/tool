/*
 * @Author: junjie.lean 
 * @Date: 2018-07-23 14:20:38 
 * @Last Modified by: JC.Liu
 * @Last Modified time: 2018-08-23 14:21:41
 * 公共课堂主页
 */
import React from 'react';
import { connect } from 'react-redux';
import { PubClassMenu } from './../components/publicClassMenu';
import PubClassList from './../components/publicClassList';
import { HeaderNav } from './JC_header';
import { Q_FooterBar } from '../components/JC_footer';
import { handleUpdateParams } from './../../redux/lxx.pubClass.reducer';

@connect(
    state => state,
    { handleUpdateParams }
)
export default class Q_PubClass extends React.Component {

    componentDidMount() {
        let params = this.props.publicClass.params;
        // let param = JSON.parse(decodeURIComponent(this.props.match.params.id));
        // params.collegeId = param.collegeId;
        // params.subjectId = param.subjectId;
        // params.teacherId = param.teacherId;
        // params.sort = param.sort;
        let param = this.props.match.params;
        params.grdId = param.cid;
        params.subjectId = param.sid;
        params.teacherId = param.tid;
        params.sort = param.sta;
        this.props.handleUpdateParams(params);
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
        const ShowThisPage = true;
        if (!ShowThisPage) {
            return false
        }
        let param = this.props.match.params;
        let obj = {
            grdId: param.cid,
            subjectId: param.sid,
            teacherId: param.tid,
            sort: param.sta,
        }
        return (
            <div>
                <HeaderNav />
                <div ref={node => this.contentNode = node} >
                    <PubClassMenu params={obj} />
                    <div className="lxx-g-boxShadow"></div>
                    <PubClassList params={obj} />
                </div>
                <Q_FooterBar />
            </div>
        )
    }

}