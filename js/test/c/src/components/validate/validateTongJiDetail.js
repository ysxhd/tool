/*
 * @Author: zhangning 
 * @Date: 2018-05-17 10:19:04 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-30 14:21:18
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table, Select, Input, message } from 'antd';
import { Container } from './../../components/common';
import { _x } from "../../js/index"

const { Column } = Table;
const Option = Select.Option;
const ajax = _x.util.request.request;
const selectBarStyle = {
  width: '140px',
  height: '34px'
}


export default class ValidateTongJiDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            loading: false,
            devTypeValue: '0',
            patStatusValue: '0',
            inputValue: '', //输入框内容
            promps: {
                "orgCode": this.props.bfOrgCode,
                "examNum": this.props.examList.num,
                "searchText":"",
                "examplanID":this.props.planId.id,
                "pageIndex":1,//当前页
                "pageSize":10, //每页显示数量
                "type":4
            },
            pagination: {
                pageSize: 20,
                total: 0
            },
        }
    }


    componentDidMount(){
        let prom = this.state.promps;
        this.getData(prom);
        this.setState({
            orgCode: this.props.bfOrgCode,
            examId: this.props.examList.num,
            planId:this.props.planId.id
        })
    }

    componentWillReceiveProps(nextProps) {
        let examid = nextProps.exmOrg.curExamid.id,
        examTimeList = nextProps.exmOrg.examTimeList.num,
        code = nextProps.exmOrg.curOrgcode;
        if(nextProps.exmOrg.curExamid.id !== this.state.examId || nextProps.exmOrg.curOrgcode.value !== this.state.orgCode || nextProps.exmOrg.examTimeList.num !== this.state.examTimeList) {
              // 更新组件state
              this.setState({
                examId: examid,
                orgCode: code.value,
                examTimeList
            })
            let orgCode = nextProps.exmOrg.curOrgcode;
            
            //如果选择考点级
            if(orgCode.type === 4){
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

             //如果是其他级别
            this.props.setSet({
                orgLevel: 0,
                typeId: orgCode.type,
                bfOrgCode: orgCode.value,
                parentName: {
                    0: orgCode.label
                },
                isJump: true,
                isDetail: false
            })
        
        }
    }


    getData(prom){
        this.setState({loading: true});
        ajax("examDetails", prom, (res) => {
            if(res.result) {
                if(!res.data) {
                    let page = {
                        pageSize: 10,
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
    if(G.initOrginfo.org_type_id === "4" || G.curOrgTree.type === 4) {
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



    // 进行搜索查询
    handleSearch() {
        let value = this.state.inputValue;
        let prom = this.state.promps;
        prom.searchText = value;
        this.getData(prom);
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

    render(){
        let state = this.state;
        const dataSource = this.state.datas && this.state.datas.length ?
        this.state.datas.map((item,index)=>{
          return{
            ...item,
            key:index+1
          }
        })
      :[]
        return(
            <Container>
                <div className="lxx-g-flex-center lxx-g-po-search">
                    <div className="lxx-m-poBack">
                        <a className="lxx-m-poIcon" onClick={this.handleGoBack.bind(this)}>
                            <svg className="icon" aria-hidden="true" >
                                <use xlinkHref="#icon-back"></use>
                            </svg>
                            <span>{this.props.orgName}</span>
                        </a>
                    </div>
                    <div className="lxx-m-flex">
                        <div>
                            <span>关键词：</span>
                            <Input
                                placeholder="考场号"
                                value={state.inputValue}
                                onChange={this.changeInput.bind(this)}
                                style={{height: 30, width: 140}}
                            />
                        </div>
                        <div><button className="lxx-m-po-btn" onClick={this.handleSearch.bind(this)}>搜索</button></div>
                    </div>
                </div>
                <Table 
                    className="lxx-tablebox"
                    key="table"
                    onChange={this.handleTableChange.bind(this)}
                    pagination={{ 
                        ...this.state.pagination, 
                        size: "small", 
                        showQuickJumper: false, 
                        showTotal: (total) => `每页${this.state.pagination.pageSize}条，共${total}条 ` }}
                    dataSource={dataSource} loading={state.loading}>
                    <Column title="考场号" dataIndex="logicExrNo" key="logicExrNo" render={(text, record) => {
                        var styleColor;
                            styleColor = { color: '#1AA3AB', cursor: 'pointer', textDecoration: 'underline'} ;
                        var json = {'id':record.logicExrNo,type: 0, orgname: this.props.orgName, orgcode: this.props.bfOrgCode, examTime: this.props.examList.num, examId: this.props.planId.id};
                        return <div style={styleColor} className="hf-table-overflow" onClick={this.props.openChildModal.bind(this,json)}>{text}</div>
                    }}></Column>
                    <Column title="入场进度" dataIndex="progressRate" key="progressRate"></Column>
                    <Column title="人证合一(通过数)" dataIndex="renzhengPassNum" key="renzhengPassNum"></Column>
                    <Column title="人证合一(未通过数)" dataIndex="renzhengNoPassNum" key="renzhengNoPassNum"></Column>
                    <Column title="人照合一(通过数)" dataIndex="renzhaoPassNum" key="renzhaoPassNum"></Column>
                    <Column title="人照合一(未通过数)" dataIndex="renzhaoNoPassNum" key="renzhaoNoPassNum"></Column>
                    <Column title="未验证数" dataIndex="unverified" key="unverified"></Column>
                </Table>
            </Container>

        )
    }
}