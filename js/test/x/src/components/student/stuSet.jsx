/*
 * @Author: lxx 
 * @Date: 2018-01-10 18:57:33 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-01-22 15:33:24
 * 选择值日学生
 */
import React, { Component } from 'react';
import { Input, Checkbox } from 'antd';
import { SVG } from '../base.js';
import _x from '../../js/_x/index.js';
import '../../css/student/stuSet.css';

const Search = Input.Search;

export class StuSet extends Component {
    constructor(props){
        super(props);
        this.state = {
            checkedValues:[],
            stuArr: [],
            searchCnt: '',
            showDel: false
        };
    }
    componentWillMount() {
        let data = this.props.stuData ? this.props.stuData : [];
        for(let i = 0; i < data.length; i++){
            this.setState({
                ["check" + i]: false
            })
        }
    }
    componentDidMount() {

    }

    // 搜索学生
    searchStu(value){
              // ajax请求该班学生列表
        let pr = {
            action: "api/web/teacher_class_brand_management/get_my_students",
            data: {
            classId: this.props.classId,
            name: value
            }
        }
        _x.util.request.formRequest(pr, (res) => {
            let data = res.data;
            if(!data){
                this.props.setSet({
                studentList : []
                })
            } else {
                this.props.setSet({
                studentList: data
                })
            }
            
        })
    }

    // 监控搜索栏内容
    changeSearchCnt(e){
        let textCnt = e.target.value;
        this.setState({
            searchCnt: textCnt
        })
        if(textCnt) {
            this.setState({
                showDel: true
            })
        } else {
            this.setState({
                showDel: false
            })
        }
    }

    // 删除输入框内容
    handleDeletInputValue(){
        document.querySelector('.lxx-se-g-sear>input').value = '';
        this.setState({
            showDel: false
        })
    }
    
    /**
     * 选中/取消选中学生
     * @param {* 选中数组} checkedValues 
     */
    onChange(obj, e) {
        let arr = this.state.stuArr;
        if(e.target.checked){
            arr.push({
                "name": obj.name,
                "id": obj.id
            })
            this.setState({
                ["check" + obj.index]: true
            })
        } else {
            for(let i in arr){
                if(obj.id === arr[i].id){
                    arr.splice(i,1);
                    this.setState({
                        ["check" + obj.index]: false
                    })
                }
            }
        }
        this.setState({
            stuArr: arr,
        })
    }

    // 选中完学生传值父组件及关闭弹窗
    submitArrAndCloseDia(){
        this.props.stuListChange(this.state.stuArr);
        this.setState({
            stuArr: []
        })
        let data = this.props.stuData;
        for(let i = 0; i < data.length; i++){
            this.setState({
                ['check' + i]: false
            })
        }
        this.props.setSet({
            showSetModal: false
        })
        
    }

    render(){
        let data = this.props.stuData ? this.props.stuData : [];
        return(
            <div>
                <div className="lxx-set-g-search lxx-g-flex">
                    <svg className={!this.state.showDel ? "icon lxx-u-inputDel hidden" : "icon lxx-u-inputDel"} aria-hidden="true" onClick={this.handleDeletInputValue.bind(this)}>
                        <use xlinkHref={"#icon-delete"}></use>
                    </svg>
                    <Search 
                        className="lxx-se-g-sear" 
                        placeholder="姓名" 
                        enterButton="搜索" 
                        onSearch={this.searchStu.bind(this)} 
                        onChange={this.changeSearchCnt.bind(this)} />
                    <div className="lxx-m-flex" ></div>
                    <button className="lxx-se-g-que" value="确定" onClick={this.submitArrAndCloseDia.bind(this)}>确定</button>
                </div>
                {
                    !data.length ?
                    <div className="lxx-set-g-cnt">
                        <div className="lxx-g-noData">
                            <img src={require('../../img/noData.png')} />
                            <span>暂未查询到对应班级学生</span>
                        </div>
                    </div>
                    :
                    <div className="lxx-set-g-cnt">
                        {
                            data.length > 0 
                            ?
                            data.map(function(item, index){
                                let url = item.studentPcture;
                                let sex = parseInt(item.sex);
                                let img = '';
                                if(!url){
                                    if(!sex){
                                        img = <SVG type="female-o" />;
                                    } else {
                                        img = <SVG type="male-o" />;
                                    }
                                } else {
                                    img = <img src={url} ref={img => this.img = img} onError={() => this.img.src = require('../../img/noHeader.png')} />;
                                }

                                return(
                                    <div key={index}>
                                        <Checkbox checked={this.state["check" + index]} onClick={this.onChange.bind(this, {index: index, id: item.studentId, name: item.studentName})}></Checkbox>
                                        {img}
                                        <span>{item.studentName}</span>
                                    </div>
                                )
                            }.bind(this))
                            :
                            <div></div>
                        }
                        
                    </div>
                }

            </div>
        )
    }
}