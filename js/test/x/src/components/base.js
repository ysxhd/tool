import React, { Component } from 'react';
import { withRouter, Link, matchPath } from 'react-router-dom';
import { Menu, Breadcrumb, Spin } from 'antd';
import _ from 'lodash';
import { ADMINMENU } from './../js/menus';

export class SVG extends Component {
  render (){

    var style = {};
    if(this.props.width) style.width = this.props.width;
    if(this.props.height) style.height = this.props.height;
    if(this.props.color) style.color = this.props.color;

    return (
      <svg className="icon" aria-hidden="true" style={style}>
        <use xlinkHref={"#icon-" + this.props.type}></use>
      </svg>
    );
  }
}

/**·
 * 虚拟容器，直接返回内容
 * @param {*} props 
 */
export const Container = function(props){
  return props.children;
}

/**
 * 板块容器
 * @param {*} props 
 */
export const Panel = function(props){
  return <div className="xt-panel" {...props}>
  {props.children}
  </div>
}

export class IMG extends Component{
  constructor(props){
    super(props);
    this.state = {
      success: Boolean(this.props.src),
      loading: Boolean(this.props.src)
    }
    this.onImgError = this.onImgError.bind(this);
    this.onImgLoad = this.onImgLoad.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.src != this.props.src){
      if(nextProps.src){
        this.setState({
          loading: true,
          success: true //cjy添加
        });
      }else{
        this.setState({
          loading: false,
          success: false
        });
      }
    }
  }

  onImgError(){
    this.setState({
      success: false,
      loading: false
    })
  }

  onImgLoad(){
    this.setState({
      success: true,
      loading: false
    });
  }

  render(){
    var alt = this.props.alt || 'picture', style = {};
    if(this.props.width) style.width = this.props.width;
    if(this.props.height) style.height = this.props.height;
    return <Spin spinning={this.state.loading} wrapperClassName="xt-imgbox">
      {
        // this.state.success ? <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style}/>
        // : <div className="xt-imgerror" style={style}><SVG type={alt} /></div>
        this.state.success ? <img onError={this.onImgError} onLoad={this.onImgLoad} src={this.props.src} style={style}/>
        : <img src={require('../img/noData.png')} style={style}/>
      }
      </Spin>
  }
}

class LMenu extends Component{
  constructor(props) {
    super(props);
    this.state = {
      openKeys: [this.props.match.params.group]
    }
    this.onOpenChange = this.onOpenChange.bind(this);
  }

  onOpenChange = (openKeys) => {
    this.setState({
      openKeys: openKeys
    })
  }

  render(){
    var nowSelected = this.props.match.params.menu;
    return(
      <Menu 
        theme="dark" 
        mode="inline"
        openKeys={this.state.openKeys}
        onOpenChange={this.onOpenChange}
        selectedKeys={[nowSelected]}
      >
      {
        ADMINMENU.map((item) => item.disable ? null : <Menu.SubMenu key={item.group} title={<span><SVG type={item.icon}/><span>{item.text}</span></span>}>
          {
            item.children.map((menu) => menu.disable ? null : <Menu.Item selectedKeys={[menu.key]} key={menu.key}><Link to={`/admin/${item.group}/${menu.key}`}>
                <span className="nav-text">{menu.text}</span>
                </Link></Menu.Item>)
          }
        </Menu.SubMenu>)
      }
      </Menu>);
  }
}

/**
 * 管理员页面左侧菜单
 */
export const LeftMenu = withRouter(LMenu);

class TMenuAdmin extends Component{
  render(){
    var params = this.props.match.params,
      group = _.find(ADMINMENU, {group: params.group}),
      menu = _.find(group.children, {key: params.menu}),
      hasMenu = false,
      page;
    if(menu.children){
      hasMenu = true;
      page = params.page || menu[0].key;
    }

    return (
      <Container>
        {
          hasMenu ?
          <Menu
            onClick={this.handleClick}
            mode="horizontal"
            selectedKeys={[page]}
          >
          {
            menu.children.map((item) => item.disable ? null :
              <Menu.Item key={item.key}>
                <Link to={`/admin/${group.group}/${menu.key}/${item.key}`}><SVG type={item.icon} />{item.text}</Link>
              </Menu.Item>
            )
          }
          </Menu> 
          : <h2>{menu.text}</h2>
        }
        <div className='xt-uinfo'>
          {
            /*
            this.props.img ? 
            <img src={this.props.img} alt='头像' />
            : <SVG type={this.props.gender === 1 ? 'man-o' : 'woman-o'} />
            */
          }
          <IMG src={this.props.img} alt={this.props.gender === 1 ? 'man-o' : 'woman-o'} />
          <span>{this.props.uname}</span>
        </div>
      </Container>
    )
  }
}

/**
 * 管理员上方左侧菜单
 */
export const TopMenuAdmin = withRouter(TMenuAdmin);

class TBreadcrumb extends Component{
  render(){
    var path = this.props.location.pathname;
 
    var match = matchPath(path, {
      path: '/admin/:group/:menu/:page'
    });

    if(match){
      var params = match.params,
      group = _.find(ADMINMENU, {group: params.group}),
      menu = _.find(group.children, {key: params.menu}),
      page;
      if(menu.children && params.page){
        page = _.find(menu.children, {key: params.page});
      }

      return <div className="xt-breadcrumb" >
      <SVG type='home' />当前位置：
        <Breadcrumb separator=">">
          <Breadcrumb.Item>{group.text}</Breadcrumb.Item>
          <Breadcrumb.Item>{menu.text}</Breadcrumb.Item>
          { page ? <Breadcrumb.Item>{page.text}</Breadcrumb.Item> : null }
        </Breadcrumb>
      </div>
    }else{
      return <div className="xt-breadcrumb" >
      <SVG type='home' />当前位置：
      </div>
    }

  }
}

export const MyBreadcrumb = withRouter(TBreadcrumb);