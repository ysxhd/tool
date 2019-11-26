/*
 * @Author: zhengqi 
 * @Date: 2018-08-28 10:43:28 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-09-12 10:17:30
 */
import React, { Component } from 'react';
import { Menu } from 'antd';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { SVG } from './../../common';
import './../../../css/menu.css';

// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;


class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'stdsj',
    };
    this.funcs = [
      { name: '生态大数据', key: 'stdsj', reqPath: '/bd', isOut: false },
      { name: '在线巡课', key: 'zxxk', reqPath: '/r_crd', isOut: false },
      { name: '听评课', key: 'tpk', reqPath: 'https:www.baidu.com', isOut: true },
      { name: '教学检查', key: 'jxjc', reqPath: 'https://ant.design', isOut: true }
    ]
  }

  handleClick = (e) => {
    this.setState({
      current: e.key,
    });
  }

  // handleSetting = () => {
  //   console.log(this.props);
  // }

  componentWillMount() {
    // console.log(JSON.parse(sessionStorage.configInfo))
  }

  render() {
    // var uinfo = '欢迎，' + Global.baseinfo.userid + ' (' + Global.baseinfo.uname + ')';
    let configInfo = JSON.parse(sessionStorage.configInfo);
    var uinfo = 'admin';
    return (
      <div className='zq-header'>
        <div className='zq-header-title'>{configInfo.projectName}</div>

        <div className='zq-menu'>
          {
            this.funcs.map((item, i) => {
              if (item.isOut) {
                return <a key={i} href={item.reqPath}>{item.name}</a>
              } else {
                return <NavLink key={i} activeClassName="zq-topM-active" to={item.reqPath}>{item.name}</NavLink >
              }
            })
          }
        </div>

        {/* <Menu
          // onClick={this.handleClick}
          selectedKeys={[this.props.current]}
          mode="horizontal"
          className='zq-menu'
        >
          {
            this.funcs.map(item => {
              return <Menu.Item key={item.key}>
                {
                  item.isOut ?
                    <a href={item.reqPath}>{item.name}</a> :
                    <Link to={item.reqPath}>{item.name}</Link >
                }
              </Menu.Item>
            })
          }
        </Menu> */}
        <div className='zq-header-uinfo'>
          <span>{uinfo}</span>
          <span onClick={() => this.props.history.push('/setting')}><SVG type='setting' /></span>
        </div>
      </div>
    );
  }
}

export default withRouter(TopMenu);
// class TopMenu extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       current: 'stdsj',
//     };
//     this.funcs = [
//       { name: '生态大数据', key: 'stdsj', reqPath: '/' },
//       { name: '在线巡课', key: 'zxxk', reqPath: '/sss' },
//       { name: '听评课', key: 'tpk', reqPath: 'https:www.baidu.com' },
//       { name: '教学检查', key: 'jxjc', reqPath: 'https://ant.design' }
//     ]
//   }

//   handleClick = (e) => {
//     this.setState({
//       current: e.key,
//     });
//   }

//   render() {
//     // var uinfo = '欢迎，' + Global.baseinfo.userid + ' (' + Global.baseinfo.uname + ')';
//     var uinfo = 'admin';
//     return (
//       <div className='zq-header'>
//         <div className='zq-header-title'>课堂生态平台</div>
//         <Menu
//           // onClick={this.handleClick}
//           selectedKeys={[this.props.current]}
//           mode="horizontal"
//           className='zq-menu'
//         >
//           {
//             this.funcs.map(item => {
//               if (item.key === 'stdsj') {
//                 return <Menu.Item key='stdsj'><Link to={item.reqPath}>{item.name}</Link ></Menu.Item>
//               } else {
//                 return <Menu.Item key={item.key}><a href={item.reqPath}>{item.name}</a></Menu.Item>
//               }
//             })
//           }
//         </Menu>
//         <div className='zq-header-uinfo'>
//           <span>{uinfo}</span>
//         </div>
//       </div>
//     );
//   }
// }

// export default TopMenu;