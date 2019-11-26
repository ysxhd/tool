/*
 * @Author: lxx 
 * @Date: 2018-07-24 10:54:19 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-31 16:31:24
 * 公共课堂资源列表
 */
import React, { Component } from 'react';
import { Row, Col, Menu, Rate, Pagination, Tooltip } from 'antd';
import { Container, SVG, SpinLoad } from './../common';
import { connect } from 'react-redux';
import { _x } from './../../js/index';
import { withRouter } from 'react-router-dom';
import G from './../../js/g';
import { getPublicTotal, handleUpdateParams, getPublicData, updateGetStatus } from './../../redux/lxx.pubClass.reducer';
import defalImg from './../../icon/default_1.png';
import noImg from './../../icon/null_b.png';

const actionCreators = { getPublicTotal, handleUpdateParams, getPublicData, updateGetStatus };
const toChinese = _x.util.number.toChinese;
const formatPoint = _x.util.number.formatPoint;
const formatDate = _x.util.date.format;
const goWith = _x.util.url.goWith;

const ovStyle = {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 200,
}

@withRouter
class ClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    /**
     * 跳转播放页
     */
    handleJump(curId) {
        let goWhere = {
            to: 'q_recordVideo',
            with: ['reception', `${curId}`, 'true']
        }
        goWith(goWhere);
        // window.open(`q_recordVideo/reception/${curId}/true`);
    }

    render() {
        let list = this.props.list;
        let commentStar = list.pubScoreAvg;
        let url = G.dataServices + '/default/resource/getOnlineResource/';
        url += G.paramsInfo.orgcode + '/' + list.thumbnailId + '/jpg';

        return (
            <div className="lxx-g-flex lxx-pc-g-licnt">
                <div className="lxx-li-g-img">
                    <span>{list.subName}</span>
                    {
                        !list.thumbnailId
                            ? <img src={defalImg} alt="" />
                            : <img src={url} alt="" />
                    }
                </div>
                <div className="lxx-li-g-detail" style={{ flex: 1 }}>
                    <div className="lxx-li-m-name">
                        <Tooltip placement="right" title={list.curName} >
                            <span onClick={this.handleJump.bind(this, list.curResourceId)}>{list.curName }</span>
                        </Tooltip>
                    </div>
                    <div>
                        <p style={ovStyle} title={list.subName}>科目：{list.subName}</p>
                        <p>授课时间：{formatDate(new Date(list.actureStartTime), 'yyyy-MM-dd')}（周{toChinese(list.weekday, false)}）第{toChinese(list.lessonOrder, false)}节</p>
                        <p>授课老师：{list.teacherName}</p>
                        <p>发布时间：{formatDate(new Date(list.vodPublishTime), 'yyyy-MM-dd')}</p>
                    </div>
                    <div>
                        <p>录播：{list.videoNum}</p>
                        <p>导学：{list.daoxueNum}</p>
                        <p>教案：{list.jiaoanNum}</p>
                        <p>课件：{list.kejianNum}</p>
                        <p>素材：{list.sucaiNum}</p>
                        <p>习题：{list.xitiNum}</p>
                        <p>其他：{list.qitaNum}</p>
                    </div>
                </div>
                <div className="lxx-li-g-num">
                    <div>
                        <Rate disabled={true} value={commentStar == 0 ? 0 : formatPoint(commentStar)} allowHalf />
                        {list.pubScoreAvg || 0}分</div>
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-browseNum"><title>浏览量</title></use>
                        </svg> 
                        {list.pubWatchNum}
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref="#icon-feedback"><title>评论数</title></use>
                        </svg>
                        {list.pubCommentNum}
                    </div>
                </div>
            </div>
        )
    }
}

@connect(
    state => state,
    { getPublicTotal, handleUpdateParams, getPublicData, updateGetStatus }
)
export default class PubClassList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courPage: 1,
            hotRank: 0,
            classRank: 0,
            publishRank: 0,
            selectedTab: 0, // 0热度  1授课时间  2发布时间
            isLoading: true,
        }
    }
    componentDidMount() {
        // let param = JSON.parse(decodeURIComponent(this.props.params));
        let param = this.props.params;
        let selectedId = Number(param.sort);
        switch (selectedId) {
            case 0:
                this.setState({
                    selectedTab: 2,
                    publishRank: 0
                });
                break;
            case 1:
                this.setState({
                    selectedTab: 2,
                    publishRank: 1
                });
                break;
            case 2:
                this.setState({
                    selectedTab: 0,
                    hotRank: 0
                });
                break;
            case 3:
                this.setState({
                    selectedTab: 0,
                    hotRank: 1
                });
                break;
            case 4:
                this.setState({
                    selectedTab: 1,
                    classRank: 0
                });
                break;
            case 5:
                this.setState({
                    selectedTab: 1,
                    classRank: 1
                });
                break;
        }
    }

    /**
     * 排序切换
     * @param {* 切换标识} val  0热度  1授课时间  2发布时间
     */
    handleSelectTab(val) {
        let param = this.props.publicClass.params;
        if (val !== this.state.selectedTab) {
            this.setState({
                selectedTab: val,
                hotRank: 0,
                classRank: 0,
                publishRank: 0,
            })
            switch (val) {
                case 0:
                    param.sort = "2";
                    break;
                case 1:
                    param.sort = "4";
                    break;
                case 2:
                    param.sort = "0";
                    break;
            }
        } else {
            switch (val) {
                case 0:
                    let hot = this.state.hotRank;
                    this.setState({
                        hotRank: !hot,
                    });
                    if (!hot) {
                        param.sort = "3";
                    } else {
                        param.sort = "2";
                    }
                    break;
                case 1:
                    let cla = this.state.classRank;
                    this.setState({
                        classRank: !cla,
                    });
                    if (!cla) {
                        param.sort = "5";
                    } else {
                        param.sort = "4";
                    }
                    break;
                case 2:
                    let pub = this.state.publishRank;
                    this.setState({
                        publishRank: !pub,
                    });
                    if (!pub) {
                        param.sort = "1";
                    } else {
                        param.sort = "0";
                    }
                    break;
            }
        }
        // 更新入参
        this.props.handleUpdateParams(param);
        // 获取公共课堂当前页列表
        this.props.getPublicData(param);
    }

    /**
     * 切换页码
     * @param {* 当前页码} p 
     */
    handlePageChange(p) {
        let param = this.props.publicClass.params;
        this.setState({
            courPage: p
        })
        param.currentPage = String(p);
        // 更新入参
        this.props.handleUpdateParams(param);
        // 获取公共课堂当前页列表
        this.props.getPublicData(param);
    }


    render() {
        // console.log(this.props);
        let publicClass = this.props.publicClass;
        let totalNum = publicClass.totalNum,
            classData = publicClass.classData;
        let state = this.state;

        function itemRender(current, type, originalElement) {
            if (type === 'prev') {
                return <a>上一页</a>;
            } if (type === 'next') {
                return <a>下一页</a>;
            }
            return originalElement;
        }

        return (
            <div className="lxx-g-container lxx-g-pubClass">
                {
                    publicClass.isGetTotal
                        ? <SpinLoad />
                        : ''
                }
                <Container>
                    <Row type="flex" align="middle" style={{ marginBottom: 25 }}>
                        <Col span={5}>共{totalNum}个课堂</Col>
                        <Col span={19} className="lxx-pc-g-til">
                            <div className={state.selectedTab === 0 ? 'selected' : ''} onClick={this.handleSelectTab.bind(this, 0)}>
                                热度<SVG type={!state.hotRank ? 'down' : 'up'} />
                            </div>
                            <div className={state.selectedTab === 1 ? 'selected' : ''} onClick={this.handleSelectTab.bind(this, 1)}>
                                授课时间<SVG type={!state.classRank ? 'down' : 'up'} />
                            </div>
                            <div className={state.selectedTab === 2 ? 'selected' : ''} onClick={this.handleSelectTab.bind(this, 2)}>
                                发布时间<SVG type={!state.publishRank ? 'down' : 'up'} />
                            </div>
                        </Col>
                    </Row>
                    <div className="lxx-pc-g-list">
                        {
                            !classData.length
                                ? <div className="lxx-g-noData">
                                    <img src={noImg} alt="" />
                                    <p>暂无列表数据</p>
                                </div>
                                : <div>
                                    {
                                        classData.map((list, index) => {
                                            return (
                                                <ClassList
                                                    key={list.curResourceId}
                                                    list={list}
                                                />
                                            )
                                        })
                                    }
                                    <Pagination
                                        className="lxx-g-pagination"
                                        total={totalNum}
                                        showTotal={totalNum => `共 ${totalNum} 条数据，每页显示20条`}
                                        pageSize={20}
                                        defaultCurrent={1}
                                        current={state.courPage}
                                        itemRender={itemRender}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                </div>
                        }
                    </div>
                </Container>
            </div>
        )
    }
};
