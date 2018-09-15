/*
 * @Author: 甘维添 
 * @Date: 2018-04-11 14:40:02 
 * @Last Modified by: JC.liu
 * @Last Modified time: 2018-05-30 13:24:15
 */
import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { withRouter } from 'react-router-dom';
import './title.css';

const menu = (
  <Menu>
    <Menu.Item>
      <a 
        onClick={() => {
          if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
              window.opener = null; window.close();
            }
            else {
              window.open('', '_top'); window.top.close();
            }
          }
          else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
          }
          else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
          }  
        }}
        rel="noopener noreferrer" >退出</a>
    </Menu.Item>
  </Menu>
);

@withRouter
class Title extends Component {
  constructor(props) {
    super(props);
    this.loginData = JSON.parse(sessionStorage.loginData)
  }

  render() {
    return (
      <div className="gwt-title-component">
        <h3>{this.loginData.orgName}</h3>
        <h2>{this.loginData.examName}</h2>
        <div className="gwt-right">
          <p
            onClick={() => this.props.history.push('/overview')}
          >
            <span className="iconfont icon-huizhuye"></span>
            回主页
            </p>
          <div>
            <img src={require('./../../../static/img/avatar.jpg')} alt="" />
            <Dropdown overlay={menu}>
              <span className="ant-dropdown-link" href="#">
                Superuser <Icon type="down" />
              </span>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}

export default Title;