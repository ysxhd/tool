import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { Layout } from 'antd';
import { TopMenu } from './../components/common';
import G from './../js/g';
import { GroupPage } from './grouppage';
import { Overview, MsgCollect, MsgDevice, MsgReady, ValStatic, ManConfirm } from './page';

const { Header, Content } = Layout;

class Page extends GroupPage {
  constructor(props) {
    super(props);
  }

  render() {
    var match = this.props.match;

    return (
      <Layout>
        <Header>
          <Route path="/:group/:page" render={
            () => <TopMenu
              menus={G.G.menus}
              uname={G.G.uinfo.Real_name}
              orgname={G.G.uinfo.Org_name}
            />
          }
          />
        </Header>
        <Scrollbars>
          <Content>
            <Switch>
              <Route path={`${match.url}/platoverview`} component={Overview} />

              <Route path={`${match.url}/msgcollect`} component={MsgCollect} />
              <Route path={`${match.url}/msgdevice`} component={MsgDevice} />
              <Route path={`${match.url}/msgready`} component={MsgReady} />

              <Route path={`${match.url}/valstatic`} component={ValStatic} />
              <Route path={`${match.url}/manconfirm`} component={ManConfirm} />
              <Redirect to={`${match.url}/platoverview`} />
            </Switch>
          </Content>
        </Scrollbars>
      </Layout>
    );
  }
}

export const PaltOv = withRouter(Page);