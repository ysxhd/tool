/*
 * @Author: lxx 
 * @Date: 2018-07-24 10:41:17 
 * @Last Modified by: lxx
 * @Last Modified time: 2018-08-09 17:29:47
 * 公共课堂-菜单模块
 */

import React, { Component } from 'react';
import { Container } from './../common';
import { Row, Col, Menu } from 'antd';
import { connect } from 'react-redux';
import G from './../../js/g';
import './../../css/publicClass.css';
import { handleUpdateParams, getPublicTotal, getPublicData, updateGetStatus, getTreeInfos } from './../../redux/lxx.pubClass.reducer';

const actionCreators = { handleUpdateParams, getPublicTotal, getPublicData, updateGetStatus, getTreeInfos };
const SubMenu = Menu.SubMenu;
const menu = ['学院', '科目', '老师'];

class PubClaMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeInfo: [],
      collegeData: [],
      subjectData: [],
      teacherData: [],
      colSelected: 0,
      subSelected: 0,
      teaSelected: 0,
      selectedName: [],
      unfoldCol: false,
      colHei: 44,
      unfoldSub: false,
      subHei: 44,
      unfoldTea: false,
      teaHei: 44,
      showBox: [false, false, false],
      param: {
        "grdId": "all",
        "subjectId": "all",
        "teacherId": "all",
      },
      params: ''
    }
  }

  componentDidMount() {
    let params = this.props.publicClass.params;
    // let param = JSON.parse(decodeURIComponent(this.props.params));
    let param = this.props.params;
    params.grdId = param.grdId;
    params.subjectId = param.subjectId;
    params.teacherId = param.teacherId;
    params.sort = param.sort;
    this.props.handleUpdateParams(params);

    let infos = sessionStorage.getItem('colSubTeaInfo');
    if (!infos) {
      this.props.getTreeInfos();
    } else {
      let Data = JSON.parse(infos);
      if (Data && Data.treeInfos) {
        let treeInfo = Data.treeInfos;
        this.dealColSubTeaInfo(treeInfo, params);
      } else {
        this.dealColSubTeaInfo([]);
      }
    }
  }

  /**
   * 处理学院科目老师数据
   */
  dealColSubTeaInfo(treeInfo, urlParam) {
    let status = { status: false };
    treeInfo.map(dt => {
      let sub = dt.subjectList;
      sub.unshift({
        "subjectId": "all",
        "subName": "全部",
        "userList": [],
      })
    })
    treeInfo.map(dt => {
      let sub = dt.subjectList;
      sub.map(li => {
        let tea = li.userList;
        tea.unshift({
          "userId": "all",
          "username": "全部"
        })
      })
    })
    treeInfo.map(dt => {
      Object.assign(dt, status);
      let sub = dt.subjectList;
      sub.map(li => {
        Object.assign(li, status);
        let tea = li.userList;
        tea.map(te => {
          Object.assign(te, status);
        })
      })
    })
    treeInfo.unshift({
      "trgId": "all",
      "trgName": "全部",
      "status": false,
      "subjectList": [{
        "subjectId": "all",
        "subName": "全部",
        "status": false,
        "userList": [{
          "userId": "all",
          "username": "全部",
          "status": false
        }],
      }]
    });
    // console.log(treeInfo);
    let arr = [];
    let subjectData = [],
      teacherData = [],
      colId, subId, teaId;
    treeInfo.map((li, index) => {
      if (li.trgId === urlParam.grdId) {
        colId = index;
        li.status = true;
        arr.push({
          name: li.trgName,
          isShow: li.trgId === 'all' ? false : true
        });
        // 科目
        subjectData = li.subjectList;
        subjectData.map((it, index) => {
          if (it.subjectId === urlParam.subjectId) {
            subId = index;
            it.status = true;
            arr.push({
              name: it.subName,
              isShow: it.subjectId === 'all' ? false : true
            });
            // 老师
            teacherData = it.userList;
            teacherData.map((item, index) => {
              if (item.userId === urlParam.teacherId) {
                teaId = index;
                item.status = true;
                arr.push({
                  name: item.username,
                  isShow: item.userId === 'all' ? false : true
                });
              }
            })
          }
        })

      }
    })
    this.setState({
      treeInfo: treeInfo,
      collegeData: treeInfo,
      subjectData: subjectData,
      teacherData: teacherData,
      selectedName: arr,
      colSelected: colId,
      subSelected: subId,
      teaSelected: teaId,
    }, () => {
      this.getBoxHei(1);
      this.getBoxHei(2);
      this.getBoxHei(3);
    })
  }

  /**
   * 菜单切换
   * @param {* 切换标识} val 1 学院   2 科目   3 老师
   * @param {* 选中项下标} ind
   * @param {* 选中项id} id 
   */
  handleSelected(val, ind, id) {
    // console.log(val, ind, id);
    let param = this.props.publicClass.params;
    let state = this.state,
      treeInfo = state.treeInfo;
    switch (val) {
      case 1:
        if (ind === state.colSelected) {
          return
        } else {
          state.collegeData[ind].status = true;
          state.collegeData[state.colSelected].status = false;
          id === 'all'
            ?
            state.selectedName[0] = { name: '全部学院', isShow: false }
            :
            state.selectedName[0] = { name: state.collegeData[ind].trgName, isShow: true }
        }
        state.colSelected = ind;
        param.grdId = id;
        state.param.grdId = id;

        // 重置科目数据
        state.subjectData = treeInfo[ind].subjectList || [];
        state.subjectData.map(dt => {
          dt.status = false
        });
        state.subjectData.length ? state.subjectData[0].status = true : '';
        state.subSelected = 0;
        state.selectedName[1] = { name: '全部科目', isShow: false };
        state.showBox[1] = false;
        // this.subbox.style = '';
        this.subbox.style.height = 44;
        this.subbox.style.paddingRight = 0;
        param.subjectId = 'all';
        state.param.subjectId = 'all';

        // 重置老师数据
        state.teacherData = treeInfo[ind].subjectList[0].userList || [];
        state.teacherData.map(dt => {
          dt.status = false
        });
        state.teacherData.length ? state.teacherData[0].status = true : '';
        state.teaSelected = 0;
        state.selectedName[2] = { name: '全部老师', isShow: false };
        state.showBox[2] = false;
        // this.teabox.style = '';
        this.teabox.style.height = 44;
        this.teabox.style.paddingRight = 0;
        param.teacherId = 'all';
        state.param.teacherId = 'all';
        break;
      case 2:
        if (ind === state.subSelected) {
          return
        } else {
          state.subjectData[ind].status = true;
          state.subjectData[state.subSelected].status = false;
          id === 'all'
            ?
            state.selectedName[1] = { name: '全部科目', isShow: false }
            :
            state.selectedName[1] = { name: state.subjectData[ind].subName, isShow: true }
        }
        state.subSelected = ind;
        param.subjectId = id;
        state.param.subjectId = id;

        // 重置老师数据
        state.teacherData = state.subjectData[ind].userList || [];
        state.teacherData.map(dt => {
          dt.status = false
        })
        state.teacherData.length ? state.teacherData[0].status = true : '';
        state.teaSelected = 0;
        state.selectedName[2] = { name: '全部老师', isShow: false };
        // this.teabox.style = '';
        this.teabox.style.height = 44;
        this.teabox.style.paddingRight = 0;
        state.showBox[2] = false;
        param.teacherId = 'all';
        state.param.teacherId = 'all';
        break;
      case 3:
        if (ind === state.teaSelected) {
          return
        } else {
          state.teacherData[ind].status = true;
          state.teacherData[state.teaSelected].status = false;
          id === 'all'
            ?
            state.selectedName[2] = { name: '全部科目', isShow: false }
            :
            state.selectedName[2] = { name: state.teacherData[ind].username, isShow: true }
        }
        state.teaSelected = ind;
        param.teacherId = id;
        state.param.teacherId = id;
        break;
    }
    param.currentPage = 1;

    this.setState(state, () => {
      if (val === 1) {
        this.getBoxHei(2);
        this.getBoxHei(3);
      } else if (val === 2) {
        this.getBoxHei(3);
      }
    });
    // 更新入参
    this.props.handleUpdateParams(param);
    // 获取公共课堂当前页列表
    this.props.getPublicData(param);
    // 获取公共课堂总数
    // this.props.getPublicTotal(state.param);
  }

  /**
   * 删除当前选项返回初始化
   * @param {* 当前筛选下标} ind 
   */
  handleGoBackAll(ind) {
    let state = this.state;
    if (state.selectedName[ind].isShow) {
      let val = ind + 1;
      this.handleSelected(val, 0, 'all');
    }
  }

  /**
   * 获取模块菜单高度
   * @param {* 模块标识} id  1 学院   2 科目   3 老师
   */
  getBoxHei(id) {
    let hei = 0;
    switch (id) {
      case 1:
        let col = this.colbox;
        hei = col.clientHeight;
        if (hei > 50) {
          col.style.paddingRight = '60px';
          col.style.height = '44px';
          this.setState({
            unfoldCol: true,
            colHei: hei,
          });
        };
        break;
      case 2:
        let sub = this.subbox;
        hei = sub.clientHeight;
        if (hei > 50) {
          sub.style.paddingRight = '60px';
          sub.style.height = '44px';
          this.setState({
            unfoldSub: true,
            subHei: hei
          });
        } else {
          this.setState({
            unfoldSub: false
          });
        };
        break;
      case 3:
        let tea = this.teabox;
        hei = tea.clientHeight;
        if (hei > 50) {
          tea.style.paddingRight = '60px';
          tea.style.height = '44px';
          this.setState({
            unfoldTea: true,
            teaHei: hei,
          })
        } else {
          this.setState({
            unfoldTea: false
          })
        }
    }
  }


  /**
   * 展开收缩菜单
   * @param {* 当前筛选下标} ind 1 学院   2 科目   3 老师
   * @param {* 操作指向状态} staus 
   */
  handleShowHide(ind, staus) {
    let state = this.state, id = ind - 1;
    state.showBox[id] = staus;
    switch (ind) {
      case 1:
        let col = this.colbox;
        if (state.showBox[id]) {
          col.style.height = state.colHei + 'px';
        } else {
          col.style.height = '44px';
        }
        break;
      case 2:
        let sub = this.subbox;
        if (state.showBox[id]) {
          sub.style.height = state.subHei + 'px';
        } else {
          sub.style.height = '44px';
        };
        break;
      case 3:
        let tea = this.teabox;
        if (state.showBox[id]) {
          tea.style.height = state.teaHei + 'px';
        } else {
          tea.style.height = '44px';
        };
        break;
    }
    this.setState(state);
  }

  componentDidUpdate() {
    // console.log(this.props.publicClass.params);
    if (this.props.publicClass.params !== this.state.params) {
      // 获取公共课堂列表
      this.props.getPublicData(this.props.publicClass.params);
      this.setState({
        params: this.props.publicClass.params
      })
    }
  }

  componentWillUnmount() {
    let param = {
      "grdId": "all",  // 学院ID
      "subjectId": "all",  // 科目ID
      "sort": "2",  // 排序标识
      "currentPage": 1,  // 当前页
      "teacherId": "all",  // 老师ID
      "pageSize": 20 // 每页条数
    }
    // 更新入参
    this.props.handleUpdateParams(param);

  }


  render() {
    let state = this.state,
      treeInfo = state.treeInfo;

    // 学院
    const getCol = state.collegeData.map((item, index) => {
      return (
        <span
          key={index}
          value={item.trgId}
          className={item.status ? "lxx-m-menuList lxx-u-selected" : "lxx-m-menuList"}
          onClick={this.handleSelected.bind(this, 1, index, item.trgId)}
        >{item.trgName}</span>
      )
    })

    // 科目
    const getSub = state.subjectData.map((item, index) => {
      return (
        <span
          key={index}
          value={item.subjectId}
          className={item.status ? "lxx-m-menuList lxx-u-selected" : "lxx-m-menuList"}
          onClick={this.handleSelected.bind(this, 2, index, item.subjectId)}
        >{item.subName}</span>
      )
    })

    // 老师
    const getTea = state.teacherData.map((item, index) => {
      return (
        <span
          key={index}
          value={item.userId}
          className={item.status ? "lxx-m-menuList lxx-u-selected" : "lxx-m-menuList"}
          onClick={this.handleSelected.bind(this, 3, index, item.userId)}
        >{item.username}</span>
      )
    })

    return (
      <Container>
        <div className="lxx-g-pubTil">
          <span>公共课堂</span>
        </div>
        <div className="lxx-g-container lxx-g-pubMenu">
          <Row type="flex">
            <Col span={1} className="lxx-u-menuName">{menu[0]}：</Col>
            <Col span={22} className="lxx-g-menuList">
              <div ref={(ref) => this.colbox = ref}>
                {getCol}
              </div>
              {
                !state.unfoldCol
                  ?
                  ''
                  : <div className="lxx-m-isUnfold" onClick={this.handleShowHide.bind(this, 1, !state.showBox[0])}>
                    <span>{!state.showBox[0] ? '展开' : '收缩'}</span>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={!state.showBox[0] ? '#icon-pullDown' : '#icon-pullUp'}></use>
                    </svg>
                  </div>
              }
            </Col>
          </Row>
          <Row type="flex">
            <Col span={1} className="lxx-u-menuName">{menu[1]}：</Col>
            <Col span={22} className="lxx-g-menuList">
              <div ref={(ref) => this.subbox = ref}>
                {getSub}
              </div>
              {
                !state.unfoldSub
                  ?
                  ''
                  : <div className="lxx-m-isUnfold" onClick={this.handleShowHide.bind(this, 2, !state.showBox[1])}>
                    <span>{!state.showBox[1] ? '展开' : '收缩'}</span>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={!state.showBox[1] ? '#icon-pullDown' : '#icon-pullUp'}></use>
                    </svg>
                  </div>
              }
            </Col>
          </Row>
          <Row type="flex">
            <Col span={1} className="lxx-u-menuName">{menu[2]}：</Col>
            <Col span={22} className="lxx-g-menuList">
              <div ref={(ref) => this.teabox = ref}>
                {getTea}
              </div>
              {
                !state.unfoldTea
                  ?
                  ''
                  : <div className="lxx-m-isUnfold" onClick={this.handleShowHide.bind(this, 3, !state.showBox[2])}>
                    <span>{!state.showBox[2] ? '展开' : '收缩'}</span>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref={!state.showBox[2] ? '#icon-pullDown' : '#icon-pullUp'}></use>
                    </svg>
                  </div>
              }
            </Col>
          </Row>
          <Row type="flex" align="middle">
            <Col span={1} style={{ width: '6.33333%' }} className="lxx-u-menuName">当前条件：</Col>
            <Col span={22} style={{ flex: 1 }} className="lxx-g-label">
              {
                state.selectedName.map((li, index) => {
                  return <Container key={index}>
                    {
                      li.isShow
                        ? <div>
                          {li.name}
                          {
                            !li.isShow
                              ? ''
                              : <svg className="icon lxx-u-close" aria-hidden="true" onClick={this.handleGoBackAll.bind(this, index)}>
                                <use xlinkHref={"#icon-close"}></use>
                              </svg>
                          }
                          <label>></label>
                        </div>
                        : ''
                    }
                  </Container>
                })
              }
            </Col>
          </Row>
        </div>
      </Container>
    )
  }
};

export const PubClassMenu = connect(state => state, actionCreators)(PubClaMenu);