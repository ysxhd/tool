/*
 * @Author: zhengqi 
 * @Date: 2018-09-04 13:18:28 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-11 17:59:49
 */
/*设置页面*/
import React, { Component } from 'react';
import { Button, message, Modal } from 'antd';
import { connect } from 'react-redux';
import InitializeCompnent from './../components/base/initializeCompnent';
import { _x } from './../../js/index';
import G from './../../js/g';
import './../../css/setting.css';

let loopkey;

const Request = _x.util.request.request;

@connect(
  state => state.initReducer,
  {}
)
class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      time: 5
    }
  }


  /**
   * 设置
   */
  handleSet = () => {
    let functions = this.props.functions;
    let params = {
      projectName: functions.projectName,
      function: functions.function
    }
    this.setState({ visible: true });


    Request('api/web/user_setting/user_setting', params, (ret) => {
      if (ret.result) {
        loopkey = _x.util.animation.add(1, false, function () {
          let time = --this.state.time;
          if (time === 0) {
            this.setState({ visible: false });
            _x.util.animation.remove(loopkey);
            window.location.href = G.dataServices;
          } else {
            this.setState({ time: time });
          }
        }.bind(this), true);
        // Request('getBigDataFunction', { key: G.baseinfo.ukey }, (res) => {
        //   if (res.result && res.data) {
        //     sessionStorage.configInfo = JSON.stringify(res.data);
        //     G.configInfo = res.data;
        //     let serverTitle = res.data[0].functionName;
        //     document.querySelector('title').innerHTML = serverTitle || G.title;

        //     res.data[0].childrenList.map(item => {
        //       if (item.functionName === '生态大数据') {
        //         this.setState({ childMenu: item.childrenList });
        //         let i = _.findIndex(tem.childrenList, { functionName: '报表中心' });
        //         if (i !== -1) {
        //           sessionStorage.isShowdetail = JSON.stringify(true);
        //         } else {
        //           sessionStorage.isShowdetail = JSON.stringify(false);
        //         }
        //         return;
        //       }
        //     });
        //   }
        //   // this.props.history.goBack();
        // });
        // window.history.go(-1);
      } else {
        message.error('设置失败');
      }
    })
  }

  componentWillUnmount() {
    _x.util.animation.remove(loopkey);
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <div className='zq-set-container'>
        <Button type="primary" onClick={() => window.history.go(-1)}>返回</Button>
        <div className='zq-set-config'>
          <InitializeCompnent type={2} />
          <Button onClick={this.handleSet} type="primary">设置</Button>
        </div>
        <Modal
          visible={this.state.visible}
          footer={false}
          closable={false}
          className='zq-set-modal'
        >
          <h4><span>{this.state.time}</span>秒</h4>
          <p>设置成功，请重新登录。</p>
        </Modal>
      </div>
    );
  }
}

export default Setting;