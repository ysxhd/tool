/*
 * @Author: zhangning 
 * @Date: 2018-01-15 11:02:09 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-20 15:26:27
 */
import React, { Component } from 'react';
import { Input, Checkbox } from 'antd';
import { SVG } from '../base.js';
import '../../css/teacher/teaModal.css';
import _x from '../../js/_x/index';
import { G } from '../../js/g';
import { error } from './../../components/student/index';

// const CheckboxGroup = Checkbox.Group;
const Search = Input.Search;

export class TeaModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            disabled:false, //发起网络请求button禁用
            noData:false,
            clsId:"",//班级Id
            json:{}, //存储选中的学生信息
            searchStu:"",//查询本班学生
            select:null, //头像是否被勾选中
            monitorId:null //被选中的班长Id
        };
    }
   //切换班级重新选中班长

    componentWillReceiveProps(nextProps){
        this.setState({
            clsId: nextProps.clsId,
            monitorId: nextProps.monitorId,
            select: nextProps.select,
            json: {}
        })
    }


    componentDidMount(){
        this.setState({
            clsId: this.props.clsId,
            monitorId: this.props.monitorId,
            select: this.props.select,
            json: {}
        })
    }


    // 搜索学生
    searchStu = (value) => {
        var that = this;
        let req = {
            action: 'api/web/teacher_class_brand_management/get_my_students',
            data:{
                "name":value,
                "classId":this.props.clsId
            }
          }
          _x.util.request.formRequest(req, function (ret) {
              if(ret.result){
                  that.props.stuSearch(ret.data);
                //无数据时出现提示
                  if(ret.data.length == 0){
                      that.setState({
                         noData:true
                      })
                  }else{
                    that.setState({
                        noData:false,
                        select:null
                     })
                  }
              }
              
          });
    }
    
    // 选中完学生传值父组件及关闭弹窗
    submitArrAndCloseDia(){
        //如果设置重复的班长
        if (!this.state.json.stuId) {
            //失败关闭弹窗
            this.props.setSet({
                showSetModal: false
            });
            return;
        }
        var that = this;
        this.setState({disabled:true});
        let req = {
            action: 'api/web/teacher_class_brand_management/add_or_update_monitor',
            data:{
                "classId":this.state.clsId,
                "studentId":this.state.json.stuId,
                "monitorId":this.state.monitorId ? this.state.monitorId:""
            }
          }
          _x.util.request.formRequest(req, function (ret) {
            that.setState({disabled:false});
              if(ret.result){
                that.props.setSet({
                    showSetModal: false,
                    monitor:that.state.json,
                    select:that.state.select
                });
                // 设置成功后刷新页面重新请求数据，如果不刷新用户重新设置班长会无法得到班长Id
              }else{
                //失败关闭弹窗
                that.props.setSet({
                    showSetModal: false
                });
                error("修改失败"+ret.message,1000);
              }
          });
 
    }


    //选中当前的头像状态
    selectCheck(obj){
       this.setState({
           json:obj,
           select:obj.index
       })
    }

    render(){
        let data = this.props.stuData;
        return(
            <div>
                <div className="lxx-set-g-search lxx-g-flex">
                    <Search className="lxx-se-g-sear"  placeholder="姓名" enterButton="搜索" onSearch={value =>this.searchStu(value)}/>
                    <div className="lxx-m-flex" ></div>
                    <button className={!this.state.disabled ? "lxx-se-g-que" : "zn-disable-btn lxx-se-g-que"}   value="确定" disabled={this.state.disabled} onClick={this.submitArrAndCloseDia.bind(this)}>确定</button>
                </div>
                <div className="zn-set-g-cnt">
                     {this.state.noData || !data.length ? <img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} /> :""}
                    {
                        data.length > 0 
                        ?
                        data.map(function(item, index){
                            let url = item.studentPcture;
                            let sex = parseInt(item.sex);
                            let img = '';  //默认显示的图片
                            let selectImg=''; //被选中后的图片
                            if(!url){
                                if(!sex){
                                    img = <SVG type="female-o" />;
                                    selectImg = <SVG type="female" />;
                                } else {
                                    img = <SVG type="male-o" />;
                                    selectImg = <SVG type="male" />;
                                }
                            } else {
                                // url = G.serverUrl + url;
                                img = <img src={url} />;
                            }

                            return(
                                <div key={index} onClick={this.selectCheck.bind(this,{index:index,sex: item.sex,clsId:item.classId, monitorName: item.studentName,stuId:item.studentId,mntId:item.monitorId})}>
                                    <Checkbox style={this.state.select == index ?{display:'block'}:{display:'none'}} checked={true}></Checkbox>
                                    {this.state.select == index ? selectImg : img}  
                                    <span>{item.studentName}</span>
                                </div>
                            )
                        }.bind(this))
                        :
                        <div></div>
                    }
                    
                </div>
            </div>
        )
    }
}