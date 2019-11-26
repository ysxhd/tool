import React, { Component } from 'react';
import { Layout, Row, Col } from 'antd';
import { SVG } from './../../components/base';
import './../../css/frameTeacher.css';
import ReactDOM from 'react-dom';
import { FrameTeacher } from './frameTeacher';
import { FrameTeacherToStudent } from './frameTeacherToStudent';
import { G } from './../../js/g';
//import { Redirect } from 'react-router';
import {Router , Route, Link ,NavLink, Switch,Redirect} from 'react-router-dom';

const { Header } = Layout;
export class FrameTeaRouter extends Component {
  constructor(){
      super();
      this.state={
          userId:null,
          isActive:true  // 判断是否被选中active  
      }
  }

  isActive = ()=>{
      this.setState({
          isActive:!this.state.isActive
      })
  }

  componentDidMount(){
      var userId = sessionStorage.getItem('userId');
      this.setState({
        userId
      })
  }



  render() {
    return (
      <Layout className="zn-g-teacher">
                <img className="zn-tea-u-bgImg" src={require('./../../img/teaBg  Top.png')} />
                <img className="zn-tea-u-bgImg zn-tea-u-bgImg1" src={require('./../../img/teaBg.png')} />
                <Header></Header>
            <div className="zn-routerBox">
                <Row className="zn-g-t-box">
                    <Col className="zn-text-center zn-fontSize-20" span={4}>信息发布系统</Col>
                    <Col className="zn-text-center " span={2}>
                        <NavLink activeClassName="zn-text-select" to="/teacher/home">班牌管理</NavLink>
                    </Col>
                    <Col className="zn-text-center" span={2}>
                        <NavLink activeClassName="zn-text-select" to="/teacher/class">班级空间</NavLink>
                    </Col>
                    <Col span={12}></Col>
                    <Col className="zn-t-logo-svg" span={4}>
                        <SVG type="man" />
                        {
                            !this.state.userId 
                            ?
                            <span></span>
                            :
                            <span>{this.state.userId }</span>
                        }
                    </Col>
                    <Switch>
                        <Route exact path="/teacher/home" component={FrameTeacher} />
                        <Route  path="/teacher/class" component={FrameTeacherToStudent} />
                        <Redirect to = '/teacher/home'/>
                    </Switch>
                </Row>
             </div>
       </Layout>
    );
  }
}


  
