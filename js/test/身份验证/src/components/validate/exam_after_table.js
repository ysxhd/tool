/*
 * @Author: kyl 
 * @Date: 2018-05-17 11:04:14 
 * @Last Modified by: kyl
 * @Last Modified time: 2018-05-30 17:09:58
 */

import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table, message } from 'antd';
import { Container } from './../../components/common';
import { _x } from "../../js/index"

const { Column } = Table;
const ajax = _x.util.request.request;
export default class ExamAfterTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            datas: [],
            orgCode: '',  //机构
            examId: '',   //考试计划
            examTimeList: ''  //场次
        }
    }

    componentDidMount() {
        // console.log('1111111111111', this.props)
        this.initPage();
        let exmOrg = this.props.exmOrg;
        let examid = this.props.exmOrg.curExamid.id || '',
            examTimeList = this.props.exmOrg.examTimeList.num || '',
            code = this.props.bfOrgCode || '';
        // console.log(examid,examTimeList,code);
        if (!!this.props.isJu && !!this.props.isDetail) {
            this.getData2(examid, code, this.props.typeId, examTimeList);
        }
        if (!!this.props.isJu && !this.props.isDetail) {
            this.getData(examid, code, this.props.typeId, examTimeList);
        }
        // 更新组件state
        this.setState({
            examId: examid,
            orgCode: code,
            examTimeList
        })
    }
    initPage = () => {
        if (!this.props.isJu) {
            if (this.props.exmOrg.curExamid.id !== this.state.examId || this.props.exmOrg.curOrgcode.value !== this.state.orgCode || this.props.exmOrg.examTimeList.num !== this.state.examTimeList) {
                let examid = this.props.exmOrg.curExamid.id,
                    examTimeList = this.props.exmOrg.examTimeList.num,
                    code = this.props.exmOrg.curOrgcode;
                // 获取对应机构数据
                if (G.initOrginfo.org_type_id === "4" || code.type === 4) {
                    // console.log("考点级~~~~~~111");
                    // 获取登录考点统计数据
                    this.getData2(examid, code.value, 4, examTimeList);
                } else {
                    // 获取对应机构数据
                    // console.log("coming~~~~~~");
                    this.getData(examid, code.value, code.type, examTimeList)

                }
                // 更新组件state
                this.setState({
                    examId: examid,
                    orgCode: code.value,
                    examTimeList
                })
                this.props.setSet({
                    orgLevel2: 0,
                    parentName2: {
                        0: code.label
                    },
                    typeId2: code.type
                })
            }
        }
    }


    /**
     * 下穿下级，并获取数据
     * @param {* 机构代码} code 
     * @param {* 机构类型} type 
     */
    handleJumpNext(orgC, orgN, type, has) {
        //后台返回的has考点---->考场：false   如果要改，让后台去判断
        if (has || type === 4) {
            var orgLevel = this.props.orgLevel;
            var parentName = this.props.parentName;
            let examId = this.state.examId;
            let examTimeList = this.state.examTimeList;
            if (type === 4) {
                orgLevel++;
                parentName[orgLevel] = orgN;
                // 若为考点，更新父组件type，并获取考点数据
                this.props.setSet({
                    typeId2: type,
                    // curOrgCode: orgC,
                    bfOrgCode2: orgC,
                    orgLevel2: orgLevel,
                    orgname2: orgN,
                    parentName2: parentName,
                    isDetail2: false
                })
            } else {
                orgLevel++;
                parentName[orgLevel] = orgN;
                // 获取对应code数据
                this.getData(examId, orgC, type, examTimeList);
                this.props.setSet({
                    orgLevel2: orgLevel,
                    orgname2: orgN,
                    parentName2: parentName,
                    bfOrgCode2: orgC,
                    typeId2: type
                })
            }
        }
    }

    /**
     * 获取对应机构数据
     * @param {* 机构代码} code 
     */
    getData(examId, code, type, examTimeList) {
        let data = [];
        this.setState({
            loading: true
        })
        ajax("get_finexstu_count_info", {
            "orgCode": code,
            "examNum": examTimeList,
            "examplanID": examId,
            "type": type
        }, (res) => {
            if (res.result && res.data) {
                var data = res.data;
                this.setState({
                    loading: false,
                    datas: data
                })
            } else {
                this.setState({
                    loading: false,
                    datas: []
                }, () => {
                    // message.warning(res.message);
                })
            }
        })
    }

    /**
 * 获取考点级数据
 * @param {* 机构代码} code 
 */
    getData2(examId, code, type, examTimeList) {
        let data = [];
        this.setState({
            loading: true
        })
        ajax("get_finish_exam_count", {
            "orgCode": code,
            "examNum": examTimeList,
            "examplanID": examId,
            "type": type
        }, (res) => {
            if (res.result && res.data) {
                var data = res.data;
                this.setState({
                    loading: false,
                    datas: data
                })
            } else {
                this.setState({
                    loading: false,
                    data: []
                })
            }
        })
    }




    /* 回退 */
    handleGoBack() {
        let bfOrgCode = this.props.bfOrgCode,
            type = this.props.typeId,
            orgLevel = this.props.orgLevel;
        let curOrgIndex = bfOrgCode.lastIndexOf('.');
        bfOrgCode = bfOrgCode.substr(0, curOrgIndex);
        this.props.setSet({
            curOrgCode2: bfOrgCode,
            bfOrgCode2: bfOrgCode,
            typeId2: type - 1,
            orgLevel2: orgLevel - 1,
            orgname2: this.props.parentName[orgLevel - 1]
        })
        this.getData(this.state.examId, bfOrgCode, type - 1, this.state.examTimeList);

    }

    componentWillReceiveProps(nextProps) {
        let examid = nextProps.exmOrg.curExamid.id,
            examTimeList = nextProps.exmOrg.examTimeList.num,
            code = nextProps.exmOrg.curOrgcode;
        if (!nextProps.isJu) {
            if (nextProps.exmOrg.curExamid.id !== this.state.examId || nextProps.exmOrg.curOrgcode.value !== this.state.orgCode || nextProps.exmOrg.examTimeList.num !== this.state.examTimeList) {
                if (!!nextProps.exmOrg.curExamid.id && !!nextProps.exmOrg.curOrgcode.value && nextProps.exmOrg.examTimeList.num) {
                    // 获取对应机构数据
                    if (G.initOrginfo.org_type_id === "4" || code.type === 4) {
                        // 获取登录考点统计数据
                        this.getData2(examid, code.value, 4, examTimeList);
                    } else {
                        // 获取对应机构数据
                        if (nextProps.bfOrgCode) {
                            this.getData(examid, code.value, code.type, examTimeList);
                        }

                    }
                    // 更新组件state
                    this.setState({
                        examId: examid,
                        orgCode: code.value,
                        examTimeList
                    })
                    this.props.setSet({
                        orgLevel2: 0,
                        parentName2: {
                            0: code.label
                        },
                        // typeId2: code.type,
                        bfOrgCode2: code.value
                    })
                }

            }
        }

    }


    render() {
        let state = this.state;
        const dataSource = this.state.datas && this.state.datas.length ?
            this.state.datas.map((item, index) => {
                return {
                    ...item,
                    key: index + 1
                }
            })
            : []
        return (
            <Container>
                {
                    this.props.orgLevel === 0
                        ?
                        ''
                        :
                        <div className="lxx-g-po-search">
                            <a className="lxx-m-poIcon" onClick={this.handleGoBack.bind(this)}>
                                <svg className="icon" aria-hidden="true" >
                                    <use xlinkHref="#icon-back"></use>
                                </svg>
                                <span>{this.props.orgName}</span>
                            </a>
                        </div>
                }
                <Table className="lxx-tablebox"
                    key="dispose2"
                    pagination={false}
                    loading={this.state.loading}
                    dataSource={dataSource} loading={state.loading}>
                    <Column title="机构名称" dataIndex="orgName" key="orgName" render={(text, record) => {
                        var styleColor;
                        if (record.type === 4) {
                            styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline' };
                        } else {
                            // console.log(record.hasNext)
                            if (record.hasNext) { //可下钻
                                styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline' };
                            } else {
                                styleColor = { color: '#575757' };
                            }
                        }
                        return <div style={styleColor} className="hf-table-overflow" onClick={this.handleJumpNext.bind(this, record.orgCode, record.orgName, record.type, record.hasNext)}>{text}</div>
                    }}></Column>
                    <Column title="验证通过" dataIndex="yztg" key="yztg"></Column>
                    <Column title="人工通过" dataIndex="rgtg" key="rgtg"></Column>
                    <Column title="已验证未通过" dataIndex="yyzwtg" key="yyzwtg"></Column>
                    <Column title="未验证未通过" dataIndex="wyzwtg" key="wyzwtg"></Column>
                    <Column title="身份验证缺考数" dataIndex="sfyzqk" key="sfyzqk"></Column>
                </Table>
            </Container>

        )
    }
}