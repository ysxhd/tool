import React, { Component } from 'react';
import '../../css/teacher/teaBot.css';
import { Tabs } from 'antd';
import { TeaClassWind , TeaClassNotification ,TeaClsActivity,TeaFindStuff,TeaClsDuty,TeaClsSpecial,TeaHomeWork} from './../../components/teacher/index';
import _x from '../../js/_x/index';
const TabPane = Tabs.TabPane;


export class TeaBot extends Component {
  constructor(props){
    super(props);
    this.state = {
      clsId:"",//班级Id
      isLoad:false,
      numSelect: 1, //被选中的tab
        clsW:'',//班级风采
        clsN:'',//班级通知
        clsA:'',//班级活动
        clsF:'',//寻物招领
        clsWish:'',//心愿墙
        clsD:'',//班级值日
        clsS:'',//班风特训
        clsH:'' //老师留言或作业
    };
  }

  //tab切换数字改变
   tabChangeNum = (name,n) =>{
      this.setState({
          name:n
      })
   }

    // 如果班级切换那么重新请求数据
   componentDidUpdate(){
    if(this.state.clsId != this.props.clsId){
        this.setState({clsId: this.props.clsId});  //重设当前班级Id
        if(!this.props.clsId){
          return;
        }
        this.getAjax('api/web/teacher_class_brand_management/get_class_style','clsW');  //获取班级风采
        this.getAjax('api/web/teacher_class_brand_management/get_class_inform','clsN');  //获取班级通知
        this.getAjax('api/web/teacher_class_brand_management/get_class_vote','clsA');  //获取班级活动
        this.getAjax('api/web/teacher_class_brand_management/get_lost_and_found','clsF');  //获取寻物招领
        this.getAjax('api/web/teacher_class_brand_management/get_class_duty','clsD');  //获取班级值日
        this.getAjax('api/web/teacher_class_brand_management/get_class_motto','clsS');  //获取班风特训
        this.getAjax('api/web/teacher_class_brand_management/get_teacher_message','clsH');  //获取老师留言或作业

    }
  }

  //子组件更新数据改变父组件的state
  nowChange = (who,data) =>{
    let obj ={};
    obj = {[who] : data};
    this.setState(obj);
  }

   //ajax封装请求
   getAjax = (url,name) =>{
     var that = this;
     let req = {
       action: url,
       data: {
         classId: this.props.clsId
       }
     }
     _x.util.request.formRequest(req, function (ret) {
       if (ret.result) {
          let obj ={};
          obj = {[name] : ret.data};
          that.setState(obj);
       }
     });
   }

    //改变tab选中时数字的颜色
    handleclick =(e) =>{
      this.setState({numSelect:e});
    }

  render(){
    return (
      <div>
          <div className="zn-tea-b-con">
          {this.state.clsW.length > 0 ? <div className="zn-b-tea-num zn-b-tea-num1"  style={this.state.numSelect == 1 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>{this.state.clsW.length}</div>:""}
          {this.state.clsN.length > 0 ? <div className="zn-b-tea-num zn-b-tea-num2" style={this.state.numSelect == 2 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>{this.state.clsN.length}</div>:""}
          {this.state.clsA.length > 0 ? <div className="zn-b-tea-num zn-b-tea-num3" style={this.state.numSelect == 3 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>{this.state.clsA.length}</div>:""}
          {this.state.clsF.length > 0 ? <div className="zn-b-tea-num zn-b-tea-num4" style={this.state.numSelect == 4 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>{this.state.clsF.length}</div>:""}
          {this.state.clsD ? <div className="zn-b-tea-num zn-b-tea-num5" style={this.state.numSelect == 6 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>1</div>:""}
          {this.state.clsS ? <div className="zn-b-tea-num zn-b-tea-num6" style={this.state.numSelect == 7 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>1</div>:""}
          {this.state.clsH ? <div className="zn-b-tea-num zn-b-tea-num7" style={this.state.numSelect == 8 ? {color:'#ffb266',backgroundColor:'#fff'}:{color:'#fff'} }>1</div>:""}
              <h4>班牌内容审核</h4>
          <Tabs onTabClick={this.handleclick} type="card">
            <TabPane tab="班级风采" key="1" className="zn-b-tea-rela"><TeaClassWind changeData={(who,data) => this.nowChange(who,data)} data={this.state.clsW} clsId={this.state.clsId}/></TabPane>
              <TabPane tab="班级通知" key="2"><TeaClassNotification changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsN}/></TabPane>
              <TabPane tab="班级活动" key="3"><TeaClsActivity changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsA}/></TabPane>
              <TabPane tab="寻物招领" key="4"><TeaFindStuff changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsF}/></TabPane>
              <TabPane tab="班级值日" key="6"><TeaClsDuty changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsD}/></TabPane>
              <TabPane tab="班风班训" key="7"><TeaClsSpecial changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsS}/></TabPane>
              <TabPane tab="老师寄语" key="8"><TeaHomeWork changeData={(who,data) => this.nowChange(who,data)} clsId={this.state.clsId} data={this.state.clsH}/></TabPane>
          </Tabs>
          </div> 

      </div>
    );
  }
}