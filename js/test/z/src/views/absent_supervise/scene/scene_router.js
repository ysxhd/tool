import React, { Component } from 'react';
import { Scene_second_component, IdentityDetail, Scene_first_component } from "../../../components/absent_supervise/index";
import { Route, Switch, Redirect  } from 'react-router-dom';

export default class Scene_router extends Component {
  render() {
    var match = this.props.match;
    return (
      <div>
        <Switch>
          <Route exact path="/absent_supervise/site_invigilate" component={Scene_first_component} />
          <Route exact path={`${match.url}/:id`} component={Scene_second_component} />
          <Route path={`${match.url}/detail/:id`} component={IdentityDetail} />
          <Redirect to="/absent_supervise/site_invigilate" />
        </Switch>
      </div>
    )
  }
}