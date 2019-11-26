import React, { Component } from 'react';
import { withRouter, matchPath } from 'react-router-dom';
import _ from 'lodash';
import { G } from './../js/index';

export class GroupPage extends Component {
  constructor(props) {
    super(props);

    var match = matchPath(this.props.history.location.pathname, {
      path: "/:group"
    });
    this.group = match.params.group;
  }

  GetMenus() {
    return _.find(G.menus, { 'group': 'manage' }).children;
  }
}