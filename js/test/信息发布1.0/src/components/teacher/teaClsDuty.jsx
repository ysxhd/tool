/*
 * @Author: zhangning 
 * @Date: 2018-01-12 11:16:06 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-21 13:23:58
 */
import React, { Component } from 'react';
import '../../css/teacher/teaClsDuty.css';
import { Table,Button  } from 'antd';
import { SVG } from './../base.js';
import _x from '../../js/_x/index';

export class TeaClsDuty extends Component {
  constructor(){
    super();
    this.state={
      dataList:[] //存储内容列表的数据
    }
  }

  //ajax请求数据
  getClsDuty(){
    var that = this;
    let req = {
      action: 'api/web/teacher_class_brand_management/get_class_duty',
      data: {
        classId: this.props.clsId
      }
    }
    _x.util.request.formRequest(req, function (ret) {
      //更新父组件的数据
      that.props.changeData("clsD",ret.data);
    });
  }

  //点击通过、不通过当前点击的dom消失  1表示审核通过 ，2 审核不通过
  passOrNo(e){
    var cont = e.target.firstChild.innerHTML,
        id = e.target.parentNode.dataset.id,
        that = this;
    if(cont === "通 过"){
         this.clwPsNoFun(id,1);
    }else if(cont === "不通过"){
        this.clwPsNoFun(id,2);
    }
}

//审核执行ajax
clwPsNoFun(id,num){
  var that = this;
  let req = {
    action: 'api/web/teacher_class_brand_management/audit_class_duty',
    data: {
      id: id,
      status:num
    }
  }
  _x.util.request.formRequest(req, function (ret) {
    //审核成功重新请求数据
    if(ret.result){
      that.getClsDuty();
    }
  });
}




  render(){
    const columns = [{
        title: '',
        dataIndex: 'name',
         render: text => <div className="zn-b-teaClsDutyIcon"><SVG type="brush"/><p>值日{text}</p></div>,
      }, {
        title: '周一',
        dataIndex: 'monday',
         render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      }, {
        title: '周二',
        dataIndex: 'tusthday',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      }, {
        title: '周三',
        dataIndex: 'thirdDay',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      }, {
        title: '周四',
        dataIndex: 'fifDay',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      },{
        title: '周五',
        dataIndex: 'fiveDay',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      },
      {
        title: '周六',
        dataIndex: 'sixDay',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      },{
        title: '周天',
        dataIndex: 'sevenDay',
        render: text => <div className="zn-b-teaClsDutycont">{text.map((item,index)=>{ 
            return <div key={index}>{item}</div>;
        })}</div>,
      }
    ];

    let allData,dataId,dutyWeek,firstDay,lastDay,students,data;
    
     if(this.props.data){
        //获取父组件传递过来的所有班级值日学生
       allData = this.props.data.dutyDay;
      //获取班级值日Id
       dataId = this.props.data.id;

      //获取班级值日周次
       dutyWeek = allData[0].weekOrder;
    

      //获取值日开始时间以及结束时间
       firstDay = new Date(allData[0].dutyTime);
       lastDay = new Date(allData[6].dutyTime);
      firstDay = _x.util.date.format(firstDay, 'yyyy-MM-dd');
      lastDay = _x.util.date.format(lastDay, 'yyyy-MM-dd');

      students = [];
      allData.map((item) =>{
        //存储每个班级的学生
        let sonArr = [];
        item.dutyStudent.map((value) =>{
          sonArr.push(value.name);
        })
        //每个班级学生获取以后放入数组
        students.push(sonArr);
      })
        data = [{
        key: '1',
        name: '',
        monday: students[0],
        tusthday: students[1],
        thirdDay:students[2],
        fifDay:students[3],
        fiveDay:students[4],
        sixDay:students[5],
        sevenDay:students[6]
      }];

     }

      
    return (
      <div className="zn-teaContBox">
      {/* 如果没有数据时 */}
        {!this.props.data ? <img className="zn-tea-b-noDataPic" src={require('./../../img/noData.png')} />
                   :
          <div className="zn-b-duty-cont">
              <h5>第{dutyWeek}周<span>{firstDay} ~ {lastDay}</span></h5>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    pagination={false}
                />
                <div className="zn-b-duty-btn" data-id={dataId} onClick={this.passOrNo.bind(this)}><Button>通过</Button><Button>不通过</Button></div>
          </div>
        }
      </div>
    );
  }
}