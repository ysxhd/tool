/*
 * @Author: zhengqi 
 * @Date: 2018-08-29 14:45:08 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-05 14:38:44
 */
/*可视化公用头部 菜单组件*/
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { _x } from './../../../js/index';
import { SVG } from './../../common';
import './../../../css/menu.css';

let loopkey;

/*顶部标题时间*/
export class VisualTop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: _x.util.date.format(new Date(), 'HH:mm'),
      data: {
        date: '',
        weekDay: '',
        weeks: 0,
        lessonOrder: 0,
      }
    }
  };

  componentWillMount() {
    this.getTime();
    loopkey = _x.util.animation.add(1, false, function () {
      let time = _x.util.date.format(new Date(), 'HH:mm');
      this.setState({
        time: time
      });
    }.bind(this), true);
  }

  /**
   * 获取时间
   */
  getTime = () => {
    _x.util.request.request('api/web/common/get_initialization_time', {}, ret => {
      if (ret.result) {
        this.setState({ data: ret.data });
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
    let data = this.state.data;
    return (
      <div className='zq-vis-top'>
        <div className='zq-vis-title'>{`可视化中心（${this.props.curVisMenu}）`}</div>
        <div className='zq-vis-time'>
          <span>{data.date}</span>
          <span>{data.weekDay}</span>
          <span>{data.weeks ? `第${data.weeks}周` : null}</span>
          <span>{data.lessonOrder ? `第${data.lessonOrder}节` : null}</span>
          <span>{this.state.time}</span>
        </div>
      </div>
    );
  }
}



// @connect(
//   state => state.menuReducer,
//   {
//     getVisMenuData
//   }
// )
/*菜单*/
@withRouter
export class VisualMenu extends Component {
  constructor(props) {
    super(props);
    this.visMenu = [
      {
        name: '课堂秩序',
        key: 'ktzx',
        reqPath: '/bd/s_crd',
        icon: 'ktzx'
      },
      {
        name: '课堂质量',
        key: 'ktzl',
        reqPath: '/bd/s_crq',
        icon: 'ktzl'
      },
      {
        name: '学生出勤',
        key: 'xscq',
        reqPath: '/bd/s_crs',
        icon: 'xscq'
      },
      {
        name: '教师考勤',
        key: 'jskq',
        reqPath: '/bd/s_crt',
        icon: 'jskq'
      }
    ]
  }


  // componentWillMount() {
  //   console.log(this.props.match.path);
  //   this.props.getVisMenuData(this.props.match.path)
  // }

  render() {
    return (
      <div className='zq-vis-menu'>
        <div className='zq-vis-linkBox'>
          {
            this.visMenu.map(item => (
              <NavLink key={item.key} activeClassName="zq-vis-active" to={item.reqPath}>
                <span><SVG type={item.icon} /></span>
                <p>{item.name}</p>
                <i></i>
              </NavLink>

            ))
          }
          {/* <NavLink activeClassName="zq-vis-active" to='/bd/s_crq'>
            <span><SVG type='ktzl' /></span>
            <p>课堂质量</p>
            <i></i>
          </NavLink>
          <NavLink activeClassName="zq-vis-active" to='/bd/s_crs'>
            <span><SVG type='xscq' /></span>
            <p>学生出勤</p>
            <i></i>
          </NavLink>
          <NavLink activeClassName="zq-vis-active" to='/bd/s_crt'>
            <span><SVG type='jskq' /></span>
            <p>教师考勤</p>
            <i></i>
          </NavLink> */}
        </div>
      </div>
    );
  }
}
