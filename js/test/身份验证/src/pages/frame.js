import React, { Component } from 'react';
import { Route, Switch, Redirect, matchPath, withRouter } from 'react-router-dom';
import { Layout, Modal, message } from 'antd';
import { LeftMenu, } from './../components/common';
import { PaltOv } from './index';
import { G, _x, GetMenu } from './../js/index';
import _ from 'lodash';
import './../css/frame.css';


const { Sider, Content } = Layout;

var loopKey, loopKey2;

class FrameBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(G.initOrginfo.org_type_id)
    var menus = GetMenu(G.initOrginfo.org_type_id);

    return (
      <Layout className="xt-layout">
        <Sider>
          <Route path="/:group/:page" render={() => <LeftMenu menus={menus} />} />
        </Sider>

        <Content className="xt-content-box">
          <div className="xt-content">
            <Switch>
              <Route path={`/w`} component={PaltOv} />
              <Redirect to={`/w/platoverview`} />
            </Switch>
          </div>
        </Content>
      </Layout>

    )
  }
}

export const Frame = withRouter(FrameBox);