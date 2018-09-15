/*
 * @Author: lxx 
 * @Date: 2018-05-16 15:42:21 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-05-24 10:54:07
 */
import React, { Component } from 'react';
import { Table, Select, Input, message } from 'antd';
import { Container } from './../../components/common';
import { G, _x } from './../../js/index';
import './../../css/msgdevice.css';

const { Column } = Table;
const Option = Select.Option;
const Request = _x.util.request.request;

const selectBarStyle = {
  width: '140px',
  height: '34px'
}
const devTypeList = [
    {
        text: '全部',
        value: '-1'
    },{
        text: '采集设备',
        value: '0'
    },{
        text: '验证设备',
        value: '1'
    },
]
const PatStatusList = [
    {
        text: '全部',
        value: '-1'
    },{
        text: '正常',
        value: '0'
    },{
        text: '硬件检查异常',
        value: '1'
    },{
        text: '软件检查异常',
        value: '2'
    },{
        text: '数据准备异常',
        value: '3'
    },
]

export class PointTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            loading: false,
            devTypeValue: '-1',
            patStatusValue: '-1',
            inputValue: '',
            orgCode: '',
            exmId: '',
            promps: {
                "keywords" : "",//关键字 传空位查询所有
                "devicetype_type" : -1,//设备类型 传-1查询所有
                "check_status" : -1,//巡检状态 传-1查询全部
                "orgCode" : '', //机构code
                "pageSize":20, //每页显示数量
                "pageIndex" : 1, //当前页
            },
            pagination: {
                pageSize: 20,
                total: 0
            },
        }
    }
    componentWillMount() {
        // 获取详情数据
        let prom = this.state.promps;
        prom.orgCode = this.props.bfOrgCode
        // console.log(prom);
        this.getData(prom);

        this.setState({
            orgCode: this.props.bfOrgCode,
            exmId: this.props.exmOrg.curExamid.id
        })
    }

    /**
     * 获取该设备下设备详情
     * @param {* 入参} pr 
     */
    getData(pr) {
        // console.log(pr);
        this.setState({
            loading: true
        })
        Request("device/get_device_list", pr, (res) => {
            if(res.result) {
                if(!res.data) {
                    let page = {
                        pageSize: 12,
                        total: 0
                    }
                    this.setState({
                        pagination: page,
                        datas: [],
                        loading: false
                    })
                } else {
                    let pagesize = res.data.pageSize,
                        total = res.data.totalElements;
                    let page = {
                        pageSize: pagesize,
                        total: total
                    }
                    this.setState({
                        pagination: page,
                        datas: res.data.pageContent,
                        loading: false
                    })
                }
            } else {
                let page = {
                    pageSize: 12,
                    total: 0
                }
                this.setState({
                    pagination: page,
                    datas: [],
                    loading: false
                })
                message.warning(res.message);
            }
        })
    }

    /* 回退 */
    handleGoBack() {
        let bfOrgCode = this.props.bfOrgCode,
            type = this.props.typeId,
            orgLevel = this.props.orgLevel;
        if(G.initOrginfo.org_type_id === "4" || type === 4) {
            // console.log(G.initOrginfo.org_type_id,orgLevel)
            this.props.setSet({
                typeId: type,
                orgLevel: orgLevel - 1,
                orgname: this.props.parentName[orgLevel - 1],
                isJump: true,
                isDetail: true
            })
        } else {
            let curOrgIndex = bfOrgCode.lastIndexOf('.');
                bfOrgCode = bfOrgCode.substr(0, curOrgIndex);
            this.props.setSet({
                curOrgCode: bfOrgCode,
                bfOrgCode: bfOrgCode,
                typeId: type - 1,
                orgLevel: orgLevel - 1,
                orgname: this.props.parentName[orgLevel - 1],
                isJump: true,
                isDetail: false
            })
        }
    }

    // 监听关键词输入
    changeInput(e) {
        let textCnt = e.target.value;
        if(textCnt.length < 100) {
            this.setState({
                inputValue: textCnt
            })
        }
    }

    /**
     * 设备类型切换
     * @param {* 选中值} value 
     */
    handleDevTypeChange(value) {
        this.setState({
            devTypeValue: value
        })
    }

    /**
     * 巡查状态切换
     * @param {* 选中值} value 
     */
    handlePatStatusChange(value) {
        this.setState({
            patStatusValue: value
        })
    }

    // 进行搜索查询
    handleSearch() {
        let state = this.state,
            inputValue = state.inputValue, // 输入框内容
            typeId = Number(state.devTypeValue), // 设备类型
            statusId = Number(state.patStatusValue);  // 巡查状态
        // console.log(typeId,statusId)
        let pr = state.promps;
        pr.keywords = inputValue;
        pr.devicetype_type = typeId;
        pr.check_status = statusId;
        // 获取数据
        this.getData(pr);
    }

    //table 分页
    handleTableChange = (pagination, filters, sorter) => {
        var promps = this.state.promps;
        promps.pageIndex = pagination.current;
        this.setState({
            promps
        })
        // 获取数据
        this.getData(promps);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.exmOrg.curOrgcode.value !== this.state.orgCode) {
            if(!!nextProps.exmOrg.curOrgcode.value) {
                let orgCode = nextProps.exmOrg.curOrgcode;
                if(orgCode.type === 4) {
                    // console.log(nextProps.exmOrg);
                    this.setState({
                        orgCode: orgCode.value
                    })
                    this.props.setSet({
                        orgLevel: 0,
                        typeId: orgCode.type,
                        bfOrgCode: orgCode.value,
                        parentName: {
                            0: orgCode.label
                        },
                        isJump: true,
                        isDetail: true
                    })
                    return;
                } else {
                    // console.log(nextProps.exmOrg);
                    this.props.setSet({
                        typeId: orgCode.type,
                        bfOrgCode: orgCode.value,
                        orgLevel: 0,
                        parentName: {
                            0: orgCode.label
                        },
                        isJump: true,
                        isDetail: false
                    })
                }
            }
        } else {
            if(!!nextProps.exmOrg.curOrgcode.value) {
                let orgCode = nextProps.exmOrg.curOrgcode;
                this.props.setSet({
                    orgLevel: 0,
                    typeId: orgCode.type,
                    bfOrgCode: orgCode.value,
                    parentName: {
                        0: orgCode.label
                    },
                    isJump: true,
                    isDetail: true
                })
                return;
            }
        }

        // 考点登录时考试计划切换
        if(G.initOrginfo.org_type_id == "4" && nextProps.exmOrg.curExamid.id !== this.state.exmId) {
            let bfOrgCode = this.props.bfOrgCode,
                type = this.props.typeId,
                orgLevel = this.props.orgLevel;
            let orgCode = nextProps.exmOrg.curOrgcode;
            this.props.setSet({
                typeId: type,
                orgLevel: 0,
                parentName: {
                    0: orgCode.label
                },
                isJump: true,
                isDetail: true
            })
        }
    }

    render(){
        let state = this.state;

        return(
            <Container>
                <div className="lxx-g-flex-center lxx-g-po-search">
                    {
                        this.props.typeId === 4 && this.props.orgLevel === 0
                            ?
                            ''
                            :
                            <div className="lxx-m-poBack">
                                <a className="lxx-m-poIcon" onClick={this.handleGoBack.bind(this)}>
                                    <svg className="icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-back"></use>
                                    </svg>
                                    <span>{this.props.orgName}</span>
                                </a>
                            </div>
                    }
                    
                    <div className="lxx-m-flex">
                        <div>
                            <span>关键词：</span>
                            <Input
                                placeholder="设备名称/序列号"
                                value={state.inputValue}
                                maxLength="100"
                                onChange={this.changeInput.bind(this)}
                                style={{height: 30, width: 140}}
                            />
                        </div>
                        <div>
                            <span>设备类型：</span>
                            <Select
                                value={state.devTypeValue}
                                style={selectBarStyle}
                                onChange={this.handleDevTypeChange.bind(this)}>
                                {devTypeList
                                    .map(function (item, index) {
                                    return <Option key={index} value={item.value.toString()} title={item.text}>{item.text}</Option>
                                    })
                                }
                            </Select>
                        </div>
                        <div>
                            <span>巡查状态：</span>
                            <Select
                                value={state.patStatusValue}
                                style={selectBarStyle}
                                onChange={this
                                    .handlePatStatusChange
                                    .bind(this)}>
                                    {PatStatusList
                                        .map(function (item, index) {
                                        return <Option key={index} value={item.value.toString()} title={item.text}>{item.text}</Option>
                                        })
                                }
                            </Select>
                        </div>
                        <div><button className="lxx-m-po-btn" onClick={this.handleSearch.bind(this)}>搜索</button></div>
                    </div>
                </div>
                <Table className="lxx-tablebox" 
                    key="table" 
                    pagination={{ 
                        ...this.state.pagination, 
                        size: "small", 
                        showQuickJumper: false, 
                        showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
                    dataSource={state.datas} 
                    loading={state.loading} 
                    rowKey="uid"
                    onChange={this.handleTableChange.bind(this)}>
                    <Column title="设备名称" dataIndex="name" key="name"></Column>
                    <Column title="设备类型" dataIndex="devicetype_name" key="devicetype_name"></Column>
                    <Column title="设备序列号" dataIndex="no" key="no"></Column>
                    <Column title="设备型号" dataIndex="model" key="model"></Column>
                    <Column title="软件版本" dataIndex="version_software" key="version_software"></Column>
                    <Column title="硬件版本" dataIndex="version_hardware" key="version_hardware"></Column>
                    <Column title="固件版本" dataIndex="version_firmware" key="version_firmware"></Column>
                    <Column title="巡检状态"  dataIndex="check_status" key="check_status" render={(text, record) => {
                        var status = record.check_status;
                        return (
                            <div>
                                {
                                    status.map((item, index) => {
                                        switch(item) {
                                            case 0:
                                                return <span key={index}>正常</span>
                                            case 1:
                                                return <span className="lxx-u-yl" key={index}>硬件检查异常<i>/</i></span>
                                            case 2:
                                                return <span className="lxx-u-yl" key={index}>软件检查异常<i>/</i></span>
                                            case 3:
                                                return <span className="lxx-u-yl" key={index}>数据准备异常<i>/</i></span>
                                        }
                                    })
                                }
                            </div>
                        )
                    }}></Column>
                </Table>
            </Container>

        )
    }
}