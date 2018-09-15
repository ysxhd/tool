import React, { Component } from 'react';
import { Layout } from 'antd';
import { LeftMenu, TopMenuAdmin, MyBreadcrumb } from './../../components/base';
import { Route, Switch, Redirect } from 'react-router-dom';
import { WorkRouter, MobileRouter, ResourceRouter, SettingsRouter } from './index';
import { G } from './../../js/g';
import './../../css/frameAdmin.css';

const { Header, Content, Sider } = Layout;

export class FrameAdmin extends Component {
  
  render() {
    var uinfo = G.uinfo;
    return (
      <Layout className="xt-admin">
        <Sider>
          <div className="xt-title">
          信息发布系统
          </div>
          <Route path="/admin/:group/:menu" component={LeftMenu} />
        </Sider>
        <Layout className='xt-content'>
          <Header>
            <Route path="/admin/:group/:menu/:page" render={() => <TopMenuAdmin uname={uinfo.name} img={uinfo.img} gender={uinfo.gender}/>} /> 
          </Header>
          <Content>
            <MyBreadcrumb />
            <Switch>
              <Route path='/admin/work'  component={WorkRouter} />
              <Route path='/admin/mobile'  component={MobileRouter} />
              <Route path='/admin/resource'  component={ResourceRouter} />
              <Route path='/admin/settings'  component={SettingsRouter} />
              <Redirect to='/admin/work' />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}