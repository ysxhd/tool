/*
 * @Author: huangjing 
 * @Date: 2018-01-09 17:01:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-28 17:37:15
 * 我的收藏
 */
import React, { Component } from 'react';
import {Panel,SVG,IMG} from './../../components/base';
import './../../css/admin/myCollection.css';
import { Button, Checkbox, Input,Select,Spin} from 'antd';
import { DailyUrgentNo } from './index';
import Mask from '../shared/maskLayer';
import _x from '../../js/_x/index';
import NumberCtr from "../../js/_x/util/number.js";
import DateCtr from "../../js/_x/util/date.js";
import Session from "../../js/_x/util/session.js";
import {success,error,confirmDia} from './index.js';


export class Mycollection extends Component {
 



    render () {
      let _this = this;
        return (
            <Panel>
                
                <div className="hj-mc-noData">
                  <IMG src={require('../../img/noData.png')} width="180px" height="180px"/>
                        <br />
                        <p>暂无相关数据</p>
                  </div>
                
            </Panel>
        )
    }
}



