/*
 * @Author: xq 
 * @Date: 2018-08-01 13:04:25 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:25:32
 * 后台-意见反馈列表
 */
import React from 'react';
import { Pagination } from 'antd';
import { withRouter } from 'react-router-dom';
import request from '../../js/_x/util/request';
import '../../css/feedbackList.css';
import _x from '../../js/_x/util/index';

const format = _x.date.format;
const Request = request.request;
const FEEDDETAIL = 'feeddetail';
class FeekbackList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedbackCount: '',           // 接口返回-意见反馈总的数量
            feedbackList: [],
            currentPage:1,          // 接口入参-列表请求 第几页
            pageSize:10          // 接口入参-列表请求 每页显示的条数-写死
        };
        this.getFeedbackList = this.getFeedbackList.bind(this);
    }


    goDetailFeedback(item){
        this.setState({feedbackDetail:item.feedbackContent});
        let feeddetail = item;
        localStorage.setItem(FEEDDETAIL, JSON.stringify(feeddetail));
        this.props.history.push(`/b_feedback_detail/${item.feedbackId}`)
    }

    // 页码改变,(当前页数，每页展示的条数)
    pageChangeHandle(page,pageSize){
        this.setState({
            currentPage:page
        })
        this.getFeedbackList(page);
    }; 

    // 进入页面后请求列表数据
    getFeedbackList(page){
        let params = {
            "currentPage":page,
            "pageSize":10
        };
        Request('default/feedback/getFeedbackList',params,(res) => {
            if(res.result){
                let data = res.data;
                this.setState({feedbackList:data.feedbackList})
            } else {
                this.setState({feedbackList:[]})
            }
        })
    } 

    componentDidMount(){
        this.getFeedbackList();
        Request('default/feedback/getFeedbackCount',{},(res) => {
            if(res.result){
                let data = res.data;
                this.setState({feedbackCount:data.feedbackCount})
            } else {
                this.setState({feedbackCount:''})
            }
        })
    }

    render() {
        const itemRender = (current, type, originalElement) => {
            if (type === 'prev') {
                return <a>上一页</a>;
            } if (type === 'next') {
                return <a>下一页</a>;
            }
            return originalElement;
        }
        let feedbackList = this.state.feedbackList;     // 列表返回数据
        return (
            <div className='xq-feedback-container'>
                <div className='xq-feedback-t'>意见反馈</div>
                <div className='xq-feedback-box'>
                    <div className='xq-feedback-head'>
                        <div>时间</div>
                        <div>内容</div>
                        <div>反馈人信息</div>
                        <div>处理</div>
                    </div>
                    <div className='xq-feedback-ul'>
                        {
                            feedbackList.map((item, index) => {
                                return (
                                    <div className={item.readStatus === 0 ? 'xq-feedback-li' : 'xq-feedback-li xq-feedback-li-read'} 
                                    key={index} onClick={this.goDetailFeedback.bind(this,item)}>
                                        <div>{format(new Date(item.feedbackTime), 'yyyy-MM-dd')}</div>
                                        <div dangerouslySetInnerHTML={{__html:`${item.feedbackContent}`}}></div>
                                        <div>
                                            {   item.feedbackInfo=
                                                (item.feedbackInfo.substr(item.feedbackInfo.length-1,1) ==',' || item.feedbackInfo.substr(item.feedbackInfo.length-1,1) =='，')
                                                ?item.feedbackInfo = item.feedbackInfo.substring(0,item.feedbackInfo.length-1)
                                                :item.feedbackInfo
                                            }
                                        </div>
                                        <div>{item.readStatus === 0 ? '未读' : '已读'}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                        <div className='xq-feedback-foot'>
                            <div className='xq-feedback-foot-r'>
                                <Pagination
                                    defaultCurrent={1}
                                    current={this.state.currentPage}
                                    pageSize={this.state.pageSize}
                                    total={Number(this.state.feedbackCount)}
                                    onChange={this.pageChangeHandle.bind(this)}
                                    itemRender={itemRender}
                                />
                            </div>
                            <div className="xq-feedback-foot-l">
                                共{this.state.feedbackCount}条数据，每页显示{this.state.pageSize}条
                            </div>
                        </div>
                        
                </div>
                
            </div>
        )
    }
}
export default withRouter(FeekbackList); 