/*
 * @Author: lxx 
 * @Date: 2018-07-31 10:31:53 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-04 10:10:20
 * 评论组件
 */
import React, { Component } from 'react';
import { Container } from './../common';
import { Row, Col, Menu, Input, Rate, Button, Checkbox, Pagination, Modal, message } from 'antd';
import { connect } from 'react-redux';
import { SVG } from './../common';
import './../../css/q_comment.css';
import { _x } from './../../js/index';
import G from '../../js/g';
import { getCommentData, getCommentTotal, updateReplayNum } from './../../redux/lxx.comment.reducer';
import { listen_pri_argument_ac } from './../../redux/JC_video.reducer';

const actionCreators = { getCommentData, getCommentTotal, updateReplayNum };
const toChinese = _x.util.number.toChinese;
const formatPoint = _x.util.number.formatPoint;
const formatDate = _x.util.date.format;
const Request = _x.util.request.request;
const { TextArea } = Input;

class CommList extends Component {
    constructor() {
        super();
        this.state = {
            replyData: [],
            isShow: false,
            replyText: '',
            commentId: '',
            param: {
                "curCommentId": "",
            },
            isClick: false,
        };
    }

    /**
     * 显示或隐藏回复列表
     */
    handleShowReply(uid) {
        let param = this.state.param;
        param.curCommentId = uid;
        this.setState({
            isShow: !this.state.isShow,
            param
        });
        if (!this.state.isShow) {
            // 获取二级评价列表
            this.getSecondComment(param);
        }
    }

    /**
     * 获取二级评论列表
     * @param {* 一级评论id} param 
     */
    getSecondComment(param) {
        Request('comment/resource/getCommentReply', param, (res) => {
            if (res.result && res.data) {
                this.props.updateReplayNum(res.data.length, this.props.list);
                this.setState({
                    replyData: res.data
                })
            } else {
                message.warning(res.message || '请求失败');
            }
        }, () => {
            message.warning('请求失败');
        })
    }

    /**
     * 修改回复输入框内容
     */
    handleChangeReplyCnt(e) {
        let val = e.target.value;
        val = val.replace(/\s+/g, ' ');
        if (val.length < 140 && val !== ' ') {
            if (val.length > 0) {
                this.setState({
                    isClick: true,
                    replyText: val
                })
            } else {
                this.setState({
                    isClick: false,
                    replyText: val
                })
            }
        } else {
            return;
        }
    }

    /**
     * 提交回复内容
     * @param {* 课堂ID} curId 
     * @param {* 一级评论ID} comId 
     * @param {* 一级评论公私有标志} pType 
     */
    handleReplyContent(curId, comId, pType) {
        if (this.state.isClick) {
            let text = this.state.replyText;
            let params = {
                "curId": curId,
                "comment": text,
                "curCommentId": comId,
                "priType": pType
            };
            Request('comment/resource/addCommentReply', params, (res) => {
                if (res.result && res.data) {
                    message.success('回复成功');
                    this.setState({
                        replyText: '',
                        isClick: false,
                    });
                    // 获取回复列表
                    this.getSecondComment(this.state.param);
                } else {
                    message.warning(res.message || '回复失败');
                }
            }, () => {
                message.warning('请求失败');
            });
        } else {
            return;
        }
    }

    /**
     * 删除一级评论
     * @param {* 课堂ID} curId 
     * @param {* 课堂评分} score 
     * @param {* 一级评论ID} comId 
     * @param {* 一级评论共私有标识} pType 
     */
    handleDeleteComment(curId, score, comId, pType) {
        let params = {
            "curId": curId,
            "score": score,
            "curCommentId": comId,
            "priType": pType
        };
        Request('comment/resource/deleteCommentAndScore', params, (res) => {
            if (res.result && res.data) {
                message.success('评论删除成功');
                this.props.getCommentData(this.props.params);
            } else {
                message.warning(res.message || '评论删除失败');
            }
        }, () => {
            message.warning('请求失败');
        });

    }

    /**
     * 
     * @param {* 父级评论ID} fathId 
     * @param {* 该条回复ID} curId 
     */
    handleDeleteReplyCom(fathId, curId) {
        let params = {
            "fatherCommentId": fathId,
            "curCommentId": curId
        }
        Request('comment/resource/deleteCommentReply', params, (res) => {
            if (res.result && res.data) {
                message.success('回复删除成功');
                // 获取回复列表
                this.getSecondComment(this.state.param);
            } else {
                message.warning(res.message || '回复删除失败');
            }
        }, () => {
            message.warning('请求失败');
        });
    }
    render() {
        let list = this.props.list,
            commentStar = list.score;
        let replyData = this.state.replyData;
        let state = this.state;
        let roleId = G.userInfo ? G.userInfo.accTypeId : '', // 角色id
            userId = G.userInfo ? G.userInfo.user.userId : ''; // 登录id
        let url = G.dataServices + '/default/resource/getOnlineResource/';
        url += G.paramsInfo.orgcode + '/' + list.user.faceImgCloudId + '/jpg';

        return (
            <div className="lxx-g-cmt lxx-g-flex">
                <div className="lxx-cmt-g-img">
                    {
                        !list.user.faceImgCloudId
                            ? list.user.sex === 2
                                ? <div className="woman">
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-woman"></use>
                                    </svg>
                                </div>
                                : <div className="man">
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref="#icon-man"></use>
                                    </svg>
                                </div>
                            : <img src={url} alt="" />
                    }
                </div>
                <div className="lxx-cmt-g-cnt lxx-m-flex">
                    <div>
                        {/* <span className="lxx-cmt-u-flooer">{this.props.index + 1}楼</span> */}
                        <span className="lxx-cmt-u-name">{list.user.username}</span>
                        <div className="lxx-cmt-m-right">
                            {
                                roleId === 0 || roleId === 1 || roleId === 2
                                    ? <span onClick={this.handleDeleteComment.bind(this, list.curId, list.score, list.curCommentId, list.priType)}>删除评论</span>
                                    : userId === list.userId
                                        ? <span onClick={this.handleDeleteComment.bind(this, list.curId, list.score, list.curCommentId, list.priType)}>删除评论</span>
                                        : ''
                            }
                            <span onClick={this.handleShowReply.bind(this, list.curCommentId)}>回复（{list.replyNum}）</span>
                        </div>
                    </div>
                    <div className="lxx-cmt-m-sorce">
                        <span className="lxx-cmt-u-gray">{formatDate(new Date(list.timestamp), 'yyyy-MM-dd HH:mm:ss')}</span>
                        <Rate disabled={true} value={commentStar == 0 ? 0 : formatPoint(commentStar)} allowHalf />
                        {list.score}分</div>
                    <div style={{ wordBreak: 'break-word' }}>{list.comment}</div>
                    {
                        !state.isShow
                            ? ''
                            : <div className="lxx-cmt-g-reply">
                                {
                                    roleId === 0 || roleId === 1 || roleId === 2
                                        ?
                                        ''
                                        :
                                        <Row style={{ marginBottom: 30, padding: '0 20px' }}>
                                            <Col span={21}>
                                                <Input
                                                    onChange={this.handleChangeReplyCnt.bind(this)}
                                                    value={state.replyText}
                                                    placeholder="可输入140字回复" />
                                            </Col>
                                            <Col span={3}>
                                                <Button className={!state.isClick ? 'lxx-rep-m-btn lxx-s-blueUnable' : 'lxx-rep-m-btn lxx-s-blue'} onClick={this.handleReplyContent.bind(this, list.curId, list.curCommentId, list.priType)}>回复</Button>
                                            </Col>
                                        </Row>
                                }

                                {
                                    replyData.length
                                        ?
                                        replyData.map((item, index) => {
                                            let reUrl = G.dataServices + '/default/resource/getOnlineResource/';
                                            reUrl += G.paramsInfo.orgcode + '/' + item.user.faceImgCloudId + '/jpg';
                                            return (
                                                <Row key={item.curCommentId} style={{ marginBottom: 20, padding: '0 20px' }}>
                                                    <Col className="lxx-rep-g-img" span={1}>
                                                        {
                                                            !item.user.faceImgCloudId
                                                                ? item.user.sex === 2
                                                                    ? <div className="woman">
                                                                        <svg className="icon" aria-hidden="true">
                                                                            <use xlinkHref="#icon-woman"></use>
                                                                        </svg>
                                                                    </div>
                                                                    : <div className="man">
                                                                        <svg className="icon" aria-hidden="true">
                                                                            <use xlinkHref="#icon-man"></use>
                                                                        </svg>
                                                                    </div>
                                                                : <img src={reUrl} alt="" />
                                                        }
                                                    </Col>
                                                    <Col span={22}>
                                                        <div className="lxx-g-flex">
                                                            <div className="lxx-rep-g-name">{item.user.username}：</div>
                                                            <div className="lxx-m-flex" style={{ wordBreak: 'break-word' }}>{item.comment}</div>
                                                            {
                                                                roleId === 0 || roleId === 1 || roleId === 2
                                                                    ? <div className="lxx-rep-u-del" onClick={this.handleDeleteReplyCom.bind(this, list.curCommentId, item.curCommentId)}>删除回复</div>
                                                                    : userId === item.userId
                                                                        ? <div className="lxx-rep-u-del" onClick={this.handleDeleteReplyCom.bind(this, list.curCommentId, item.curCommentId)}>删除回复</div>
                                                                        : ''
                                                            }
                                                        </div>
                                                        <div className="lxx-s-gray">{formatDate(new Date(item.timestamp), 'yyyy-MM-dd HH:mm:ss')}</div>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                        :
                                        <div className="lxx-rep-g-noData">暂无回复</div>
                                }
                                <div className="lxx-rep-g-up">
                                    <span onClick={this.handleShowReply.bind(this)}>收起<SVG type="pullUp" /></span>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}
const CommontList = connect(state => state, actionCreators)(CommList);

@connect(
    state => state,
    { getCommentData, getCommentTotal, updateReplayNum, listen_pri_argument_ac }
)
export default class CommentInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            commText: '',
            isClick: false,
            personType: false,  // false 1所有 true 2私有
            courPage: 1,
            params: {
                "curId": props.curId,
                "priType": 2,
                "currentPage": 1,
                "pageSize": 20
            }
        }
    }

    componentDidMount() {
        let params = {
            "curId": this.props.curId,
            "priType": 2,
            "currentPage": 1,
            "pageSize": 20
        }
        this.setState({
            params: params
        })
        // 获取一级评论列表
        this.props.getCommentData(params);
    }

    /**
     * 输入评论内容
     */
    handleChangeText(e) {
        let val = e.target.value;
        val = val.replace(/\s+/g, ' ');
        if (val.length < 140 && val !== ' ') {
            this.setState({
                commText: e.target.value
            });
            if (val.length && this.state.score > 0) {
                this.setState({
                    isClick: true
                })
            } else {
                this.setState({
                    isClick: false
                })
            }
        } else {
            return
        }
    }

    /**
     * 修改评分
     */
    handleChangeRate(value) {
        if (this.state.commText.length && value > 0) {
            this.setState({
                isClick: true
            })
        } else {
            this.setState({
                isClick: false
            })
        }
        this.setState({
            score: value
        })
    }

    /**
     * 修改获取评论列表类型
     */
    handleChangeType(e) {
        let checked = e.target.checked,
            params = this.state.params;
        if (!checked) {
            params.priType = 2;
        } else {
            params.priType = 1;
        }
        // 更改分数
        this.props.listen_pri_argument_ac(params.priType);
        // 获取一级评论列表
        this.props.getCommentData(params);

        this.setState({
            personType: checked,
            params: params
        })
    }

    /**
     * 
     * @param {* 当前页码} p 
     */
    handlePageChange(p) {
        let params = this.state.params;
        params.currentPage = p;
        this.setState({
            courPage: p,
            params
        })
        // 获取一级评论列表
        this.props.getCommentData(params);
    }

    /**
     * 提交评论
     */
    handleSubmitComm() {
        if (this.state.isClick) {
            let params = {
                "curId": this.props.curId,
                "comment": this.state.commText,
                "score": this.state.score,
            };
            // 提交评论数据
            Request('comment/resource/addScoreAndComment', params, (res) => {
                if (res.result && res.data) {
                    message.success('评论成功');
                    // 置空
                    this.setState({
                        commText: '',
                        score: 0,
                        isClick: false
                    })
                    // 获取一级评论列表
                    this.props.getCommentData(this.state.params);
                } else {
                    message.warning(res.message || '评论请求失败');
                }
            }, () => {
                message.warning('请求失败');
            });
        } else {
            return;
        }
    }

    componentWillUnmount() {
        this.props.listen_pri_argument_ac(2);
    }

    render() {
        let state = this.state,
            commentReducer = this.props.commentReducer,
            commList = commentReducer.commentList,
            totalNum = commentReducer.total;

        function itemRender(current, type, originalElement) {
            if (type === 'prev') {
                return <a>上一页</a>;
            } if (type === 'next') {
                return <a>下一页</a>;
            }
            return originalElement;
        }

        let ele = commList.map((list, index) => {
            return (
                <CommontList
                    index={index}
                    key={list.curCommentId}
                    list={list}
                    params={this.state.params}></CommontList>
            )
        })

        let userRole = G.userInfo.accTypeId, // 0是超管，1是普管，2是管理者，3是教师，4是学生
            classType = this.props.classType,  // 0 不属于这堂课，判断共有 1属于这堂课，判断私有
            configInfo = G.configInfo, // 配置信息
            configCom;
        if (userRole === 0 || userRole === 1 || userRole === 2) {
            configCom = true;
        } else if (userRole === 3) {
            if (!Number(classType) && !configInfo.teachPubCurCommentType) {
                configCom = true;
            } else {
                configCom = false;
            }
        } else if (userRole === 4) {
            if (!Number(classType) && !configInfo.stuPubCurCommentType) {
                configCom = true;
            } else if (Number(classType) && !configInfo.stuPrivCurCommentType) {
                configCom = true;
            } else {
                configCom = false;
            }
        }

        return (
            <Container>
                {
                    !configCom
                        ? <div className="lxx-g-comment">
                            <TextArea
                                className="lxx-g-comText"
                                rows={6}
                                placeholder="可输入140字评论"
                                value={state.commText}
                                onChange={this.handleChangeText.bind(this)} />
                            <div className="lxx-g-comRate lxx-g-flex-center">
                                课堂评分：
                            <div className="lxx-m-flex" style={{ color: '#FF9F40' }}>
                                    <Rate
                                        value={state.score}
                                        allowHalf
                                        defaultValue={0}
                                        onChange={this.handleChangeRate.bind(this)} />
                                    {state.score}分
                            </div>
                                <Button className={!state.isClick ? 'lxx-s-blueUnable' : 'lxx-s-blue'} onClick={this.handleSubmitComm.bind(this)}>提交评论</Button>
                            </div>
                        </div>
                        :
                        ''
                }

                <div className="lxx-g-perType">
                    {
                        this.props.isPub
                            ? <Checkbox onChange={this.handleChangeType.bind(this)}>只看私有评论和评分</Checkbox>
                            : ''
                    }
                </div>
                <div>
                    {
                        !commList.length
                            ? <div className="lxx-g-noData">
                                <img src={require('./../../icon/null_b.png')} alt="" />
                                <p>暂无评论数据</p>
                            </div>
                            : <div>
                                {ele}
                                <Pagination
                                    className="lxx-g-pagination"
                                    total={totalNum}
                                    style={{ marginTop: 20 }}
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
        );
    }
}

// export const CommentInfo = connect(state => state, actionCreators)(CommentInf);