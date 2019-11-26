/*
 * @Author: junjie.lean 
 * @Date: 2018-05-17 18:27:17 
<<<<<<< .mine
 * @Last Modified by: kyl
 * @Last Modified time: 2018-05-29 10:05:00
||||||| .r2069
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-21 18:35:06
=======
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-30 13:24:07
>>>>>>> .r2072
 */


import React from 'react';
import { SVG } from '../common';
import { Spin, Icon, Input, Select, Button, message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { G, _x } from '../../js/index';
import _ from 'lodash';
import '../../css/static_alert_modal.css';

const Option = Select.Option;
const Ajax = _x.util.request.request;
export default class StaticAlertModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // currentId: '',//当前考场ID
            currentContition: {},//当前请求参数
            nendRender: {},//当前渲染数据
            cache: [[], []],//所有数据缓存
            type: "",//调用模块类型 0：考中，1：考后
            isHide: true,//展示隐藏
            isRequest: !false,//是否在请求数据
            isGrep: !false//是否在数据里grep
        }
    }

    closeModal() {
        let nendRender = {
            orgName: "",
            logicExrNo: "",
            examNum: "",
            studentList: [
                {
                    name: "",//姓名
                    sex: "",//男
                    certNo: "",	//身份证号码	
                    examNo: "",//考号
                    cfmRusult: ""
                }
            ]
        }, currentContition = {
            examplanID: "",
            examNum: "",
            orgCode: "",
            logicExrNo: "",
            orgName: "",
            searchText: "",
            cerStatus: "",
            type: ""
        }

        this.setState({
            isHide: true,
            isRequest: true,
            isGrep: true,
            type: "",
            nendRender,
            currentContition
        })
    }
    openModal(condition) {
        let _this = this;
        let newCondition = {
            examplanID: condition.examId,
            examNum: condition.examTime,
            orgCode: condition.orgcode,
            logicExrNo: condition.id,
            orgName: condition.orgname,
            searchText: condition.searchText,
            cerStatus: condition.cerStatus,
            type: condition.type
        }
        if (condition.hasOwnProperty('searchText')) {
            newCondition.searchText = condition.searchText
        } else {
            newCondition.searchText = ""
        }
        if (condition.hasOwnProperty('cerStatus')) {
            newCondition.cerStatus = condition.cerStatus
        } else {
            newCondition.cerStatus = ""
        }

        this.setState({
            isHide: false,
            isRequest: true,
            isGrep: true,
            currentContition: {
                ...newCondition
            },
            type: newCondition.type
        })
        let thisCache = this.state.cache;

        if (newCondition.type === "") {
            return false;
        }
        let searchKey,
            beforeExamDataCache = this.state.cache[0],
            afterExamDataCache = this.state.cache[1];

        if (newCondition.type === 0) {
            //考前验证
            searchKey = `id_${condition.id}_${condition.examId}_${condition.searchText}_${condition.cerStatus}`;
            let cacheIndex = _.findIndex(beforeExamDataCache, { cacheId: searchKey });
            //请求之前先查询是否有缓存

            /**
             * lean 2018-05-25 15:08:08
             * 缓存命中逻辑有bug，不能在一次组件完整的生命周期里监听到数据的变化。暂时解决此bug的可行方案。
             * 补救措施：
             * 修改判断条件，不进入命中缓存模式，考后验证逻辑一样  
             */
            let useCache = cacheIndex > -1 && false;

            if (useCache) {
                //如果命中缓存
                this.setState({
                    isRequest: false,
                    isGrep: false,
                    nendRender: {
                        ...beforeExamDataCache[cacheIndex]
                    }
                })
            } else {
                //如果没命中缓存
                let pr = {
                    ...newCondition
                }
                Ajax('examinationDetails', pr, (res) => {
                    if (res.result && res.code == 200) {
                        beforeExamDataCache.push({
                            ...res.data,
                            cacheId: `id_${pr.logicExrNo}_${pr.examplanID}_${pr.searchText}_${pr.cerStatus}`
                        })
                        _this.setState({
                            isRequest: false,
                            isGrep: false,
                            currentContition: pr,
                            nendRender: {
                                ...res.data
                            }
                        })
                    } else if (res.result && res.code !== 200) {
                        message.error('获取数据失败，请重试！')
                        _this.setState({
                            isRequest: true,
                            isGrep: true,
                        })
                    } else {
                        message.error('接口异常！');
                        _this.setState({
                            isRequest: true,
                            isGrep: true,
                        })
                    }
                })
            }
        } else {
            //考后验证
            searchKey = `id_${condition.id}_${condition.examId}_${condition.searchText}_${condition.cerStatus}`;
            let cacheIndex = _.findIndex(afterExamDataCache, { cacheId: searchKey });
            //请求之前先查询是否有缓存
            /**
             * 逻辑变更同上
             */
            let useCache = cacheIndex > -1 && false;
            if (useCache) {
                //如果命中缓存
                this.setState({
                    isRequest: false,
                    isGrep: false,
                    nendRender: {
                        ...afterExamDataCache[cacheIndex]
                    }
                })
            } else {
                //如果没命中缓存
                let pr = {
                    ...newCondition
                }
                Ajax('get_logic_room_info', pr, (res) => {
                    if (res.result && res.code == 200) {
                        afterExamDataCache.push({
                            ...res.data,
                            cacheId: `id_${pr.logicExrNo}_${pr.examplanID}_${pr.searchText}_${pr.cerStatus}`
                        })
                        _this.setState({
                            isRequest: false,
                            isGrep: false,
                            currentContition: pr,
                            nendRender: {
                                ...res.data
                            }
                        })
                    } else if (res.result && res.code !== 200) {
                        message.error('获取数据失败，请重试！')
                        _this.setState({
                            isRequest: true,
                            isGrep: true,
                        })
                    } else {
                        message.error('接口异常！');
                        _this.setState({
                            isRequest: true,
                            isGrep: true,
                        })
                    }
                })
            }
        }
    }
    setCerStatus(v) {
        let currentContition = this.state.currentContition;
        currentContition.cerStatus = v;
        this.setState({
            currentContition
        })
    }
    setSearchText(e) {
        let v = e.target.value;
        let currentContition = this.state.currentContition;
        currentContition.searchText = v;
        this.setState({
            currentContition
        })
    }
    goSearch() {
        if (this.state.isGrep || this.state.isRequest) {
            message.warning('正在获取数据，请稍等');
            return false;
        }
        let condition = this.state.currentContition;

        let pr = {
            examId: condition.examplanID,
            examTime: condition.examNum,
            orgcode: condition.orgCode,
            id: condition.logicExrNo,
            orgname: condition.orgName,
            searchText: condition.searchText,
            cerStatus: condition.cerStatus,
            type: this.state.type
        }
        pr.cerStatus = pr.cerStatus === "" ? "" : pr.cerStatus;
        console.log('查询入参', pr)
        this.openModal(pr);
    }
    render() {
        if (this.state.type === "") {
            return false
        }
        let data = this.state.nendRender;
        let antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />
        return (
            <div className={this.state.isHide ? "lean-alertmodal-hide" : "lean-alertmodal-show"}>
                <div className="lean-alertmodal-container" onClick={this.closeModal.bind(this)}>
                    <div onClick={(e) => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                    }} className={this.state.isHide ? "lean-alertmodal-content-hide" : "lean-alertmodal-content-show"}>
                        <div>
                            <p className="lean-alertmodal-head">
                                {
                                    this.state.type == 0
                                        ?
                                        "考场考中验证情况"
                                        :
                                        "考场考后验证情况"
                                }
                                <span onClick={this.closeModal.bind(this)}>
                                    <SVG type="close" color="red"></SVG>
                                </span>
                            </p>
                            <div className="lean-alertmodal-examroom">
                                <p>考场考试信息</p>
                                <div className="lean-alertmodal-examroom-inner">
                                    {
                                        this.state.isRequest
                                            ?
                                            <div className="lean-alertmodal-loadingbox">
                                                <Spin indicator={antIcon} />
                                            </div>
                                            :
                                            <div className="lean-alertmodal-examroom-detail" >
                                                <p>
                                                    考点：{data.orgName ? data.orgName : "-"}
                                                </p>
                                                <p>
                                                    逻辑考场：{data.logicExrNo ? data.logicExrNo : "-"}
                                                </p>
                                                <p>
                                                    场次：第 {data.examNum} 场
                                                </p>
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="lean-alertmodal-searchbox">
                                <p>考场考生验证情况</p>
                                <div className="lean-alertmodal-searchbox-inner">
                                    <span>关键字：</span>
                                    <Input placeholder="姓名/身份证号/考号" title="姓名/身份证号/考号" onChange={this.setSearchText.bind(this)} />
                                    <span>{this.state.type == 0 ? "验证状态：" : "验证结果："}</span>
                                    {
                                        this.state.type == 0
                                            ?
                                            <Select defaultValue=" " onChange={this.setCerStatus.bind(this)}>
                                                <Option value=" ">全部</Option>
                                                <Option value="-1">未通过</Option>
                                                <Option value="1">通过</Option>
                                                <Option value="2">未验证</Option>
                                                <Option value="0">存疑</Option>
                                            </Select>
                                            :
                                            <Select defaultValue=" " onChange={this.setCerStatus.bind(this)}>
                                                <Option value=" ">全部</Option>
                                                <Option value="0">未确认</Option>
                                                <Option value="1">通过</Option>
                                                <Option value="2">不通过</Option>
                                                <Option value="3">人工确认缺考</Option>
                                                <Option value="4">存疑</Option>
                                            </Select>
                                    }
                                    <Button className="lean-alertmodal-searchbtn" onClick={this.goSearch.bind(this)} >搜索</Button>
                                </div>
                            </div>
                            <div className="lean-alertmodal-datalist">
                                <table className="lean-alertmodal-table">
                                    <thead>
                                        <tr>
                                            <th>姓名</th>
                                            <th>性别</th>
                                            <th>身份证号</th>
                                            <th>考号</th>
                                            <th>验证情况</th>
                                        </tr>
                                    </thead>
                                </table>
                                {
                                    !this.state.isGrep
                                        ?
                                        <Scrollbars>
                                            {
                                                !this.state.nendRender.studentList
                                                    ?
                                                    <div className="lean-alertmodal-nonedata">
                                                        无数据！
                                                    </div>
                                                    :
                                                    <table className="lean-alertmodal-table">
                                                        <tbody>
                                                            {
                                                                this.state.nendRender.studentList.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{item.name}</td>
                                                                            <td>{item.sex}</td>
                                                                            <td>{item.certNo}</td>
                                                                            <td>{item.examNo}</td>
                                                                            {
                                                                               this.state.type == 0
                                                                               ? <td>{item.cfmRusult == 0 ? "存疑" : item.cfmRusult == 1 ? "通过" : item.cfmRusult == 2 ? "未验证" : item.cfmRusult == -1 ? "未通过" : "其他"}</td>
                                                                               :
                                                                               <td>{item.cfmRusult == 0 ? "未确认" : item.cfmRusult == 1 ? "通过" : item.cfmRusult == 2 ? "不通过" : item.cfmRusult == 3 ? "人工确认缺考" : item.cfmRusult == 4 ? "存疑": "其他"}</td>
                                                                            }
                                                                            
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                            }
                                        </Scrollbars>
                                        :
                                        <div className="lean-alertmodal-loadingbox">
                                            <Spin indicator={antIcon} size="large" />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
