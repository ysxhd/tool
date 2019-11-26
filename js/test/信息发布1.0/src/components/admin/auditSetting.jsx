/*
 * @Author: huangjing 
 * @Date: 2018-01-05 16:31:10 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:27:33
 * 系统设置-审核设置
 */
import React, { Component } from 'react'
import {Panel,SVG} from './../../components/base'
import './../../css/admin/auditSetting.css'
import { Switch } from 'antd';
import _x from '../../js/_x/index';

export class AuditSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            ischeck : true,
            checked:true
        }
        this.ischeck = this.ischeck.bind(this);
    }
    ischeck = (e) =>{
        this.setState({ischeck:!this.state.ischeck}); 

    }
  
    componentWillMount = () =>{
        let _this = this;
        let req = {
            action:'api/web/information/system/get_status',
            data:{
            }
        }
        _x.util.request.formRequest(req,function(res){
            if(res.data){
                _this.setState({
                    ischeck:true,
                    checked:true
                })
            }else{
                _this.setState({
                    ischeck:false,
                    checked:false
                })
            }
        })
      }
    
    onChange = (checked) => {
        this.setState({
            checked : !this.state.checked
        })
        let flag;
        if(checked){
            flag='1';
        }else{
            flag='0';
        }
        let req = {
            action:'api/web/information/system/content_approval',
            data:{
                status:flag
            }
        }
        _x.util.request.formRequest(req,function(res){})
      }
    render () {
        let _this = this;
        return (
            <Panel>
                    <div className='hj-as-content'>
                        <div className='hj-as-audit'>
                            <div className='hj-as-circle'>
                                <svg className="icon" aria-hidden="true" style={this.state.ischeck?{color:'#ff9934'}:{color:'#bbbdbf'} }>
                                    <use xlinkHref={"#icon-tablet" }></use>
                                </svg>
                            </div>
                            <div className='hj-as-switchContent'>
                                <p>班牌自动审核</p>
                                <Switch onClick ={this.ischeck} checked = {_this.state.checked} onChange={this.onChange} />
                            </div>
                            <div className='hj-as-note'>
                                <p>系统自动审核<span>学生发布</span>的终端内容</p>
                                <p>（非自动审核需要班主任人工审核）</p>
                            </div>
                        </div>
                    </div>
            </Panel>
        )
    }
}

 