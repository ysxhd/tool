/*
 * @Author: zhangning 
 * @Date: 2018-05-17 10:19:04 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-05-30 16:35:44
 */
import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Table } from 'antd';
import { Container } from './../../components/common';
import { _x } from "../../js/index"

const { Column } = Table;
const ajax = _x.util.request.request;
export default class ValidateTongJi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            datas: [],
            orgCode: '',  //机构
            examId: '',   //考试计划
            examTimeList:''  //场次
        }
    }

    componentWillMount() {
        let exmOrg = this.props.exmOrg;

        let examid = this.props.exmOrg.curExamid.id || '',
            examTimeList = this.props.exmOrg.examTimeList.num || '',
            code = this.props.bfOrgCode || '';
        if(!!this.props.isJu && !!this.props.isDetail) {
            this.getData2(examid, code, this.props.typeId,examTimeList);
        }
        if(!!this.props.isJu && !this.props.isDetail) {
            this.getData(examid, code, this.props.typeId,examTimeList);
        }

                    // 更新组件state
            this.setState({
               examId: examid,
               orgCode: code,
               examTimeList
             })
    }


    /**
     * 下穿下级，并获取数据
     * @param {* 机构代码} code 
     * @param {* 机构类型} type 
     */
    handleJumpNext(orgC, orgN,type,has) {
        var orgLevel = this.props.orgLevel;
        var parentName = this.props.parentName;
        let examId = this.state.examId;
        let examTimeList = this.state.examTimeList;
        if(type === 4) {
            orgLevel++;
            parentName[orgLevel] = orgN;
            // 若为考点，更新父组件type，并获取考点数据
            this.props.setSet({
                typeId: type,
                // curOrgCode: orgC,
                bfOrgCode: orgC,
                orgLevel: orgLevel,
                orgname: orgN,
                parentName: parentName,
                isDetail: false
            })
        } else {
            if(has){
                orgLevel++;
                parentName[orgLevel] = orgN;
                // 获取对应code数据
                this.getData(examId, orgC, type,examTimeList);
                this.props.setSet({
                    orgLevel: orgLevel,
                    orgname: orgN,
                    parentName: parentName,
                    bfOrgCode:orgC,
                    typeId: type
                })
            }else {
              return false;
            }

        }
    }
    
    /**
     * 获取对应机构数据
     * @param {* 机构代码} code 
     */
    getData(examId,code,type,examTimeList) {
        let data = [];
        // console.log(type);
        this.setState({
            loading: true
          })
          ajax("cityDetails", {
            "orgCode": code,
            "examNum": examTimeList,
            "examplanID":examId,
            "type":type
          }, (res) => {
            if (res.result && res.data) {
              var data = res.data;
              this.setState({
                  loading:false, 
                  datas:data
              })
              
            }else{
              this.setState({ 
                  loading:false, 
                  data:[]
              }) 
            }
          })
    }

        /**
     * 获取考点级数据
     * @param {* 机构代码} code 
     */
    getData2(examId,code,type,examTimeList) {
        let data = [];
        // console.log(type);
        this.setState({
            loading: true
          })
          ajax("findExamDetails", {
            "orgCode": code,
            "examNum": examTimeList,
            "examplanID":examId,
            "type":type
          }, (res) => {
            if (res.result && res.data) {
              var data = res.data;
              this.setState({
                  loading:false, 
                  datas:data
              })
            }else{
              this.setState({ 
                  loading:false, 
                  data:[]
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
            curOrgCode: bfOrgCode,
            bfOrgCode: bfOrgCode,
            typeId: type - 1,
            orgLevel: orgLevel - 1,
            orgname: this.props.parentName[orgLevel - 1]
        })
        this.getData(this.state.examId, bfOrgCode, type - 1,this.state.examTimeList);
    }

    componentWillReceiveProps(nextProps) {
        let examid = nextProps.exmOrg.curExamid.id,
        examTimeList = nextProps.exmOrg.examTimeList.num,
        code = nextProps.exmOrg.curOrgcode;
        if(!nextProps.isJu) {
            if(nextProps.exmOrg.curExamid.id !== this.state.examId || nextProps.exmOrg.curOrgcode.value !== this.state.orgCode || nextProps.exmOrg.examTimeList.num !== this.state.examTimeList ) {
                if(!!nextProps.exmOrg.curExamid.id && !!nextProps.exmOrg.curOrgcode.value && nextProps.exmOrg.examTimeList.num) {   
                // 获取对应机构数据
                    if(G.initOrginfo.org_type_id === "4") {
                        // 获取登录考点统计数据
                        this.getData2(examid, code.value, 4,examTimeList);
                    } else if(code.type !== 4){
                        // 获取对应机构数据
                        this.getData(examid, code.value, code.type,examTimeList);
                    }else if(code.type === 4){
                        this.getData2(examid, code.value, 4,examTimeList);
                    }
             
                   // 更新组件state
                   this.setState({
                    examId: examid,
                    orgCode: code.value,
                    examTimeList
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
        const dataSource = this.state.datas && this.state.datas.length?
        this.state.datas.map((item,index)=>{
          return{
            ...item,
            key:index+1
          }
        })
      :[]

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
                <Table className="lxx-tablebox" key="dispose" pagination={false}
                    loading={this.state.loading}
                    dataSource={dataSource} >
                    <Column title="机构名称" dataIndex="orgName" key="orgName" render={(text, record) => {
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
                      
                        return <div style={styleColor} className="hf-table-overflow" onClick={this.handleJumpNext.bind(this, record.orgCode, record.orgName, record.type,record.org_type)}>{text}</div>
                    }}></Column>
                    <Column title="入场进度" dataIndex="progressRate" key="progressRate" render={(text, record) => {
                                return <div>{text}%</div>
                    }}></Column>
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