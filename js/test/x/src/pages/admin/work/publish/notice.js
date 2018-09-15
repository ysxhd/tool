import React, { Component } from 'react';
import { DailyNoBox,UrgentNoBox } from '../../index';
import { Panel } from './../../index';

export class Notice extends Component {
  render(){
    return (
      <div className="cjy-notice">
        <DailyNoBox></DailyNoBox>
        <UrgentNoBox></UrgentNoBox>
      </div>
    );
  }
}