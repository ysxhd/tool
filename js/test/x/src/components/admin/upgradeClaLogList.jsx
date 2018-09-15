/*
 * @Author: kangyl 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-01-31 09:11:09
 * 在线升级——更新日志组件
 */
import React, { Component } from 'react';
import { Button, Timeline } from 'antd';
import { SVG ,IMG} from '../base';
import { UpgradeClaLogListCon } from './upgradeClaLogListCon';
import _x from './../../js/_x/index';
import '../../css/admin/upgradeClaLogList.css';

export class UpgradeClaLogList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:[],
      isHaveData:false
    }
    this.backCli = this.backCli.bind(this);
  }
  backCli(){
    this.props.diaChan(false);
  }
  requestData(){
    var req={
      action:'api/web/manager_device_software/logs',
      data:{}
    }
    _x.util.request.formRequest(req,(res)=>{
      const data=res.data;
      if(res){
        //发送请求，如果有数据，将isHaveData修改为true，将数据放入this.state.data中去
        this.setState({
          isHaveData:true,
          data:data
        })
      }
     
    })
  }
  componentWillMount(){
    // 调用发送请求方法
    this.requestData()
  }
  render() { 
    return (
      <div>
        {/* <img src='./../../img/noData.png'/> */}
        <div className="kyl-ucll-updateLog">
          <div className="kyl-ucll-header">
            <p className="kyl-ucll-title">班牌程序更新日志</p>
            <div>
              <Button className="kyl-ucll-back" onClick={this.backCli}>返回</Button>
            </div>
          </div>
          <div className="kyl-ucll-container">
          {/* 判断this.state.isHaveData的值，如果为true  加载列表内容组件   如果为false  加载无数据图片 */}
          {
            this.state.isHaveData
            ?
            <div>
              <UpgradeClaLogListCon key={this.index} data={this.state.data}></UpgradeClaLogListCon>
              <div className="kyl-ucll-footer"></div>
            </div>
            :
            <div className="kyl-ucll-noData">
              <div className="kyl-ucll-noDataPic">
                <IMG src={require("../../img/noData.png")} className='kyl-ucll-myImg' alt=""/>
                <p className="kyl-ucll-noDataWord">暂无相关内容</p>
              </div> 
            </div>   
          }
          </div>
        </div>
      </div>
    );
  }
}