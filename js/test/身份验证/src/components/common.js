import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Menu, Breadcrumb, Spin, Icon } from 'antd';
import { _x, G } from './../js/index';
import _ from 'lodash';
import './common.css';

const SubMenu = Menu.SubMenu;

/**
 * svg图片
 */

export class SVG extends Component {
  render() {
    var style = {};
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;
    if (this.props.color) style.color = this.props.color;

    return (
      <svg title="" className="icon" aria-hidden="true" style={style}>
        <use xlinkHref={"#icon-" + this.props.type}></use>
      </svg>
    );
  }
}

/**
 * 虚拟容器，直接返回内容
 * @param {*} props 
 */
export const Container = function (props) {
  return props.children;
}

/**
 * 右侧弹框
 */
export class RightModal extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={this.props.isHide ? "lean-rightmodal hideVi" : "lean-rightmodal showVi"} onClick={(e) => {
        this.props.onClick();
      }}>
        <div onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }} className={this.props.isHide ? "lean-rightmoadl-arrt  lean-rightmodal-hide" : "lean-rightmoadl-arrt lean-rightmodal-show"}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

/**
 * 板块容器，（ps：外部改变loading的状态）
 * @param {*} props 
 */
export class Panel extends Component {
  state = {
    content: this.props.children
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.loading) {
      this.state.content = this.props.children;
    } else {
      this.state.content = null;
    }
  }

  render() {
    var props = this.props,
      size = props.size || 'small',
      loading = props.loading || false,
      bodystyle,
      bodycontent,
      addclass = props.className || '';

    if (props.bodyheight) {
      bodystyle = {
        height: props.bodyheight,
        overflowY: 'hidden'
      };
    }

    if (loading) {
      bodycontent = this.state.children;
    } else {
      bodycontent = props.children;
    }
    if (bodystyle) {
      bodycontent = <div style={bodystyle}>
        {bodycontent}
      </div>;
    }

    return (
      <Spin spinning={loading}>
        <div className={`xt-panel xt-${size} ${addclass}`}>
          {
            props.title ?
              (<div className="xt-title">{props.title}
                <div className="xt-right">{props.more}</div>
              </div>) : null
          }
          <div className="xt-body">
            {bodycontent}
          </div>
        </div>
      </Spin>)
  }
}

/**
 * img,包括图片加载，图片报错
 */
export class IMG extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: true,
      loading: true,
      src: this.props.src
    }
    this.onImgError = this.onImgError.bind(this);
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.src != this.props.src) {
      if (nextProps.src) {
        this.setState({
          loading: true,
          success: true
        });
      } else {
        this.setState({
          loading: false,
          success: false
        });
      }
    }
  }

  onImgError() {
    this.setState({
      success: false,
      loading: false
    })
  }

  onImgLoad() {
    this.setState({
      success: true,
      loading: false
    });
  }

  render() {
    var alt = this.props.alt || 'picture', style = {};
    if (this.props.width) style.width = this.props.width;
    if (this.props.height) style.height = this.props.height;

    var content;

    if (this.state.loading) {
      content = <Spin spinning={this.state.loading} wrapperClassName="xt-imgbox">
        {
          this.state.success ? <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style} />
            : <div className="xt-imgerror" style={style}><SVG type={alt} /></div>
        }
      </Spin>
    } else {
      content = this.state.success ? <img src={this.props.src} style={style} />
        : <div className="xt-imgerror" style={style}><SVG type={alt} /></div>
    }

    return content;
  }
}

/**
 * 顶部菜单
 */
class TMenu extends Component {
  render() {
    var menus = this.props.menus;
    var path = this.props.match.params.page;
    var curpath = '';
    var icon = '';
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].key === path) {
        curpath = menus[i].name;
        icon = menus[i].icon;
        break;
      } else {
        for (var j = 0; j < menus[i].children.length; j++)
          if (menus[i].children[j].key === path) {
            curpath = menus[i].name + '>' + menus[i].children[j].name;
            icon = menus[i].icon;
            break;
          }
      }
    }

    return (
      <div className="xt-header">

        <h2 className="xt-title" >
          <svg className="icon" aria-hidden="true">
            <use xlinkHref={"#icon-" + icon}></use>
          </svg>
          <span>{curpath}</span>
        </h2>

        <div className='xt-uinfo'>
          <div title={this.props.uname} className="xt-ellipsis xt-right" style={{ width: '80px' }}>{this.props.uname}</div>
          <div className="xt-right">：</div>
          <div title={this.props.orgname} className="xt-ellipsis xt-right" style={{ width: '112px' }} >{this.props.orgname}</div>
        </div>

      </div>
    )
  }
}

/**
 * 上方菜单
 */
export const TopMenu = withRouter(TMenu);

class LMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selKey: '',
      openKey: ''
    }
  }
  componentWillMount() {
    //刷新时，让焦点保持正确位置
    var menus = this.props.menus,
      path = this.props.match.params.page;
    for (var i = 0; i < menus.length; i++) {
      if (menus[i].key === path) {
        this.setState({
          selKey: path
        })
        break;
      } else {
        for (var j = 0; j < menus[i].children.length; j++)
          if (menus[i].children[j].key === path) {
            this.setState({
              selKey: path,
              openKey: menus[i].key
            })
            break;
          }
      }
    }
  }
  render() {
    var menus = this.props.menus,
      content = [],
      group = this.props.match.params.group,
      page = this.props.match.params.page;

    _.forEach(menus, (menus, index) => {
      if (menus.children.length > 0) {
        content.push(
          <SubMenu key={menus.key} title={<span>
            <svg className="icon lxx-m-menu" aria-hidden="true">
              <use xlinkHref={"#icon-" + menus.icon}></use>
            </svg>
            <span>{menus.name}</span></span>}>
            {
              menus.children.map((item, i) => {
                return <Menu.Item key={item.key}>
                  <Link to={`/${group}/${item.key}`}>
                    {item.name}
                  </Link>
                </Menu.Item>
              })
            }
          </SubMenu>
        );
      } else {
        content.push(
          <Menu.Item key={menus.key} >
            <Link to={`/${group}/${menus.key}`}>
              <svg className="icon lxx-m-menu" aria-hidden="true">
                <use xlinkHref={"#icon-" + menus.icon}></use>
              </svg>
              {menus.name}
            </Link>
          </Menu.Item>)
      }
    });


    return (
      <div>
        <div className="lxx-m-tilImg">
          <img src={require('./../img/title.png')} />
        </div>
        <div className="xt-leftmenu">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[this.state.selKey]}
            defaultOpenKeys={['msgstatic', 'validate']}
          >
            {content}
          </Menu>

        </div>
      </div>
    );
  }
}

/**
 * 左侧菜单
 */
export const LeftMenu = withRouter(LMenu);



