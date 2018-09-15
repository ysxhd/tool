/*
 * @Author: lxx 
 * @Date: 2018-05-16 15:16:15 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-05-24 10:40:54
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table,} from 'antd';
import { Container } from './../../components/common';
import { G, _x } from './../../js/index';
import './../../css/msgdevice.css';

const { Column } = Table;
const Request = _x.util.request.request;

export class StaticTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            datas: [],
            orgCode: '',
            examId: '',
        }
    }
    
    componentWillMount() {
        let exmOrg = this.props.exmOrg;
        this.setState({
            orgCode: exmOrg.curExamid.id || '',
            examId: exmOrg.curOrgcode.value || ''
        })
        let examid = this.props.exmOrg.curExamid.id,
            code = this.props.bfOrgCode;
        if(!!this.props.isJu && !!this.props.isDetail) {
            this.getPointData(examid, code, this.props.typeId);
        }
        if(!!this.props.isJu && !this.props.isDetail) {
            this.getData(examid, code, this.props.typeId);
            this.props.setSet({
                isDetail: true
            })
        }
        // 更新组件state
        this.setState({
            examId: examid,
            orgCode: code,
        })
    }

    /**
     * 下穿下级，并获取数据
     * @param {* 机构代码} code 
     * @param {* 机构是否下钻} has 
     * @param {* 机构名称} orgN 
     * @param {* 机构类型} type 
     */
    handleJumpNext(orgC, has, orgN, type) {
        var orgLevel = this.props.orgLevel;
        var parentName = this.props.parentName;
        let examId = this.state.examId;
        // console.log(orgC,type, orgN, has, orgLevel,parentName);
        if(type === 4) {
            console.log(orgC,type, orgN, has, orgLevel,parentName);
            orgLevel++;
            // parentName[orgLevel] = orgN;
            // 若为考点，更新父组件type，并获取考点数据
            this.props.setSet({
                typeId: type,
                // curOrgCode: orgC,
                bfOrgCode: orgC,
                orgLevel: orgLevel,
                orgname: orgN,
                // parentName: parentName,
                isDetail: false
            })
        } else {
            if (has) {
                orgLevel++;
                parentName[orgLevel] = orgN;
                // 获取对应code数据
                this.getData(examId, orgC, type);
                this.props.setSet({
                    orgLevel: orgLevel,
                    orgname: orgN,
                    parentName: parentName,
                    isDetail: true
                })
            } else {
                return false;
            }
        }
    }

    /* 回退 */
    handleGoBack() {
        let bfOrgCode = this.props.bfOrgCode,
            type = this.props.typeId,
            orgLevel = this.props.orgLevel;
        // console.log('rog', orgLevel);
        let curOrgIndex = bfOrgCode.lastIndexOf('.');
        bfOrgCode = bfOrgCode.substr(0, curOrgIndex);
        this.props.setSet({
            curOrgCode: bfOrgCode,
            bfOrgCode: bfOrgCode,
            typeId: type - 1,
            orgLevel: orgLevel - 1,
            orgname: this.props.parentName[orgLevel - 1]
        })
        this.getData(this.state.examId, bfOrgCode, type - 1)
    }
    
    /**
     * 获取对应机构数据
     * @param {* 机构代码} code 
     */
    getData(examId, code, type) {
        this.setState({
            loading: true
        });
        let pr = {
            "orgCode": code,
            "ex_id": examId
        }
        Request("device/get_org_list", pr, (res) => {
            // console.log(res);
            if(res.result) {
                this.setState({
                    datas: res.data,
                    loading: false,
                })
                if(!!res.data.length) {
                    this.props.setSet({
                        bfOrgCode: code,
                        typeId: type,
                    })
                }
            } else {
                this.setState({
                    datas: [],
                    loading: false,
                })
            }
        })
    }

    /**
     * 当登录机构为考点时，获取该考点统计数据
     * @param {* 考试计划id} examId 
     * @param {* 机构id} code 
     * @param {* 机构类型} type 
     */
    getPointData(examId, code, type) {
        this.setState({
            loading: true
        });
        let pr = {
            "orgCode": code,
            "ex_id": examId
        }
        Request("device/get_org_details", pr, (res) => {
            // console.log(res);
            if(res.result) {
                this.setState({
                    datas: res.data,
                    loading: false,
                })
                if(!!res.data.length) {
                    this.props.setSet({
                        bfOrgCode: code,
                        typeId: type,
                    })
                }
            } else {
                this.setState({
                    datas: [],
                    loading: false,
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.isJu) {
            if(nextProps.exmOrg.curExamid.id !== this.state.examId || nextProps.exmOrg.curOrgcode.value !== this.state.orgCode) {
                if(!!nextProps.exmOrg.curExamid && !!nextProps.exmOrg.curOrgcode.value) {
                    let exam = nextProps.exmOrg.curExamid,
                        code = nextProps.exmOrg.curOrgcode;
                    if(G.initOrginfo.org_type_id === "4") {
                        // 获取登录考点统计数据
                        this.getPointData(exam.id, code.value, 4);
                    } else if(code.type !== 4) {
                        // 获取对应机构数据
                        // console.log(exam.id, code);
                        this.getData(exam.id, code.value, code.type);
                    } else if(code.type === 4) {
                        // 获取登录考点统计数据
                        this.getPointData(exam.id, code.value, 4);
                        // this.props
                    }
                    // 更新组件state
                    this.setState({
                        examId: exam.id,
                        orgCode: code.value,
                    })
                    this.props.setSet({
                        orgLevel: 0,
                        parentName: {
                            0: code.label
                        },
                        // typeId: code.type,
                        bfOrgCode: code.value
                    })
                }
            }
        }

    }

    render(){
        let state = this.state;

        return(
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
                <Table className="lxx-tablebox" key="table" pagination={false}
                    dataSource={state.datas} loading={state.loading} rowKey="org_code">
                    <Column title="机构名称" dataIndex="org_name" key="org_name" render={(text, record) => {
                        var styleColor;
                        if(record.type === 4) {
                            styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline' };
                        } else {
                            if (record.org_type) { //可下钻
                                styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline' };
                            } else {
                                styleColor = { color: '#575757' };
                            }
                        }
                        return <div style={styleColor} className="hf-table-overflow" onClick={this.handleJumpNext.bind(this, record.org_code, record.org_type, record.org_name, record.type,)}>{text}</div>
                    }}></Column>
                    <Column title="启用身份验证设备数" dataIndex="device_identity_num" key="device_identity_num"></Column>
                    <Column title="启用身份采集设备数" dataIndex="device_gather_num" key="device_gather_num"></Column>
                    <Column title="巡检进度" dataIndex="inspection_progress" key="inspection_progress" render={(text, record) => {
                        return <span>{record.inspection_progress}%</span>
                    }}></Column>
                    <Column title="巡检异常数" dataIndex="device_err_sum" key="device_err_sum"></Column>
                </Table>
            </Container>

            
        )
    }
}