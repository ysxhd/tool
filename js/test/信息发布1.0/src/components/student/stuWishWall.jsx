/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-26 16:42:21
 * 心愿墙审核组件
 */
import React, { Component } from 'react';
import { Checkbox, Menu, Dropdown, Button, Icon, message } from 'antd';
import { confirmDia, success, error } from './index.js';
import _x from '../../js/_x/index.js';

import '../../css/student/stuWishWall.css';

export class StuWishWall extends Component {
  constructor(props){
    super(props);
    this.state = {
      thisPage: 1,
      pageSize: 20,
      totalPage: 1,
      condition: {
        "classId": this.props.classId,
        "pageIndex": "1",
        "pageSize": "20"
      },
      totalNum: 0,
      // wishPageData: [],
      curPageData: [],
      isChooseAll: false,
      saveChooseId: [],
      check0:false
    }
  }

  componentWillMount() {
    this.setState({
      curPageData: this.props.data,
      totalNum: this.props.num
    },() => {
      // this.getNewPageArr(this.props.data, this.props.num, this.state.pageSize);
      this.getNewPaging(this.props.num, this.state.pageSize);
    })
  }

  /**
   * 计算总页数
   * @param {* 待审核心愿总条数} total 
   * @param {* 每页条数} pageSize 
  //  * @param {* 当前页数据} data 
   */
  getNewPaging(total, pageSize){
    if(!total){
      this.setState({
        totalPage: 1,
        totalNum: 0,
      })
    } else {
      // 计算页数
      let pageNum = Math.ceil(total/pageSize);
      this.setState({
        totalPage: pageNum,
        totalNum: total
      }, () => {
        // 判断上一页、下一页是否可点击
        this.pageChoiceYesNo(this.state.thisPage);
      })
    }
  }

  // 接收入参存入，并请求数据
  getApplyWishCondition(obj){
    var t = this.state.condition;
    for (var k in obj) {
        t[k] = obj[k];
    }
    this.setState({
      condition: t
    }, () => {
      // ajax请求数据
      this.getApplyWishData(this.state.condition)
    })
  }

  /**
   * 请求当前页心愿审核数据
   * @param {* 请求入参} data 
   */
  getApplyWishData(data){
    if(this.state.isChooseAll) {
      this.setState({
        isChooseAll: false
      })
    }
    let pr = {
      action: 'api/web/monitor_class_for_students/wish_wall/resend_wish',
      data: data
    }
    _x.util.request.formRequest(pr, (res) => {
      let data = res.data,
        num = res.total;
      for(let i in data) {
        this.setState({
          ["check" + i]: false
        })
      }
      this.setState({
        curPageData: data
      })
      if(!data.length) {
        if(!num) {
          this.setState({
            totalPage: 1,
            totalNum: 0,
          })
        } else {
          // 判断当前页是否是第一页
          if(this.state.thisPage !== 1) {
            let pageIndex = Number(this.state.thisPage) - 1;
            this.setState({
              thisPage: pageIndex
            }, () => {
              // 获取前一页数据
              this.getApplyWishCondition({pageIndex: pageIndex});
            })
          } else {
            return
          }
        }
      } else {
        // 计算总页数
        this.getNewPaging(num, this.state.pageSize);
      }

    })
  }

  // 全选当前页
  handleChooseAll(){
    this.setState({
      isChooseAll: !this.state.isChooseAll
    })
    let data = this.state.curPageData;
    if(!this.state.isChooseAll){
      let arr = [];
      for(let i in data){
        arr.push(data[i].id);
        this.setState({
          ["check" + i]: true
        })
      }
      this.setState({
        saveChooseId: arr
      })
    } else {
      for(let i in data){
        this.setState({
          ["check" + i]: false
        })
      }
      this.setState({
        saveChooseId: []
      })
    }
  }

  // 单选
  handleChooseEach(i){
    let data = this.state.curPageData,
      arr = this.state.saveChooseId;
    this.setState({
      ["check" + i]: !this.state["check" + i]
    })
    if(!this.state["check" + i]){
      this.setState({
        ["check" + i]: true
      })
      arr.push(data[i].id);
      if(arr.length === data.length){
        this.setState({
          isChooseAll: true
        })
      }
    } else {
      this.setState({
        ["check" + i]: false
      })
      for(let n in arr){
        if(data[i].id === arr[n]){
          arr.splice(n, 1);
        }
      }
      if(arr.length < data.length){
        this.setState({
          isChooseAll: false
        })
      }
    }
    this.setState({
      saveChooseId: arr
    })
  }

  // 批量通过或删除
  applyWishArr(t){
    let arr = this.state.saveChooseId;
    if(!arr.length){
      error('请选择您需审核的内容！', 1500)
    } else {
      if(!t){
        confirmDia({
          title: '信息提示',
          content:'确认要通过所选心愿吗？',
          className: 1,
          okText: '确认',
          fnOK: function(){
            // ajax请求审批通过
            let obj = {
              "classId": this.props.classId,
              "id": arr,
              "status": "1"
            }
            this.applyChooseWish(obj);
          }.bind(this)
        })
      } else {
        confirmDia({
          title: '信息提示',
          content:'确认要拒绝通过所选心愿吗？',
          className: 2,
          okText: '确认',
          fnOK: function(){
            // ajax请求审批不通过
            let obj = {
              "classId": this.props.classId,
              "id": arr,
              "status": "2"
            }
            this.applyChooseWish(obj);
          }.bind(this)
        })
      }
    }

  }

  // 审批通过、不通过
  applyChooseWish(obj){
    let pr = {
      action: 'api/web/monitor_class_for_students/wish_wall/check_wish',
      data: obj
    }
    _x.util.request.formRequest(pr,(res) => {
      let result = res.result;
      if(result) {
        if(obj.status === "1"){
          success('通过成功');
        } else if(obj.status === "2") {
          success('拒绝成功');
        }
        // ajax请求当前页数据
        this.getApplyWishCondition(this.state.condition);
      } else {
        error('审核失败，请稍后重试');
      }
    })

  }

  // 进行上一页/上一页数据切换
  clickPageChoice(k) {
    let btnArr = document.querySelectorAll('.lxx-m-page>button');
    let thisPage = parseInt(this.state.thisPage);
    if(!k){
      thisPage --;
      btnArr[1].disabled = false;
      btnArr[1].style.cursor = "pointer";
    } else {
      thisPage ++;
      btnArr[0].disabled = false;
      btnArr[0].style.cursor = "pointer";
    }
    this.setState({
      thisPage: thisPage
    }, () => {
      if(thisPage === 1) {
        // 上一页不可点击
        btnArr[0].disabled = true;
        btnArr[0].style.cursor = "no-drop";
      } else if(thisPage === parseInt(this.state.totalPage)) {
        // 下一页不可点击
        btnArr[1].disabled = true;
        btnArr[1].style.cursor = "no-drop";
      } else {
        btnArr[0].disabled = false;
        btnArr[1].disabled = false;
        btnArr[0].style.cursor = "pointer";
        btnArr[1].style.cursor = "pointer";
      }
      this.getApplyWishCondition({pageIndex: this.state.thisPage});
    })
  }

  // 判断是否上一页下一页可点击
  pageChoiceYesNo(page){
    let btnArr = document.querySelectorAll('.lxx-m-page>button');
    if(page === 1) {
      // 上一页不可点击
      btnArr[0].disabled = true;
      btnArr[0].style.cursor = "no-drop";
    } else {
      btnArr[0].disabled = false;
      btnArr[0].style.cursor = "pointer";
    }
    if(page === parseInt(this.state.totalPage)){
      // 下一页不可点击
      btnArr[1].disabled = true;
      btnArr[1].style.cursor = "no-drop";
    } else {
      btnArr[1].disabled = false;
      btnArr[1].style.cursor = "pointer";
    }
  }

  componentDidMount() {
    
  }

  componentDidUpdate() {
    
  }

  render(){
    let curData = this.state.curPageData;

    // 每页条数改变
    var setPageSize = function ({ key }) {
      this.setState({
        pageSize: key,
        thisPage: 1
      })
      this.getApplyWishCondition({
        pageSize: key,
        pageIndex: 1
      })
    };

    var menu = (
        <Menu onClick={setPageSize.bind(this)}>
            <Menu.Item key="10">10</Menu.Item>
            <Menu.Item key="20">20</Menu.Item>
            <Menu.Item key="50">50</Menu.Item>
            <Menu.Item key="100">100</Menu.Item>
        </Menu>
    );

    return (
      <div> 
        <div className="lxx-wi-g-top lxx-g-flex-center">
          <p>
            <Checkbox checked={this.state.isChooseAll} onChange={this.handleChooseAll.bind(this)}></Checkbox>
            <span>全选</span>
          </p>
          <p className="lxx-m-flex">
            <button className="pass" onClick={this.applyWishArr.bind(this, 0)}>批量通过</button>
            <button className="refuse" onClick={this.applyWishArr.bind(this, 1)}>批量不通过</button>
          </p>
          <p>共<span>{this.state.totalNum}</span>条心愿</p>
        </div>
        {
          curData.length > 0
          ?
          <div className="lxx-wi-g-list">
            {
              curData.map(function(item, index){
                return(
                  <div key={index}>
                    <p><Checkbox checked={this.state["check" + index]} onChange={this.handleChooseEach.bind(this, index)}></Checkbox></p>
                    <p>{!item.userName ? '匿名' : item.userName}</p>
                    <p title={item.content}>{item.content}</p>
                    <p onClick={this.applyChooseWish.bind(this,{"classId": this.props.classId,"id": [item.id],"status": "1"})}>通过</p>
                    <p onClick={this.applyChooseWish.bind(this,{"classId": this.props.classId,"id": [item.id],"status": "2"})}>不通过</p>
                  </div>
                )
              }.bind(this))
            }
          </div>
          :
          <div className="lxx-wi-g-list">
            <div className="lxx-g-noData">
              <img src={require('../../img/noData.png')} />
              <span>暂无待审核心愿</span>
            </div>
          </div>
        }
        {
          this.state.totalNum > 0
          ?
          <div className="lxx-wi-g-page lxx-g-flex-center">
            <p>共<span>{this.state.totalNum}</span>条数据，每页
              <Dropdown overlay={menu}>
                <Button style={{ margin: '0 5px', borderRadius: "16px" }}>
                  {this.state.pageSize} <Icon type="down" />
                </Button>
              </Dropdown>条
            </p>
            <p className="lxx-m-flex"></p>
            <p className="lxx-m-page">
              <button onClick={this.clickPageChoice.bind(this, 0)}>上一页</button>
              <span style={{margin: '0 5px'}}>{this.state.thisPage}/{this.state.totalPage}</span>
              <button onClick={this.clickPageChoice.bind(this, 1)}>下一页</button>
            </p>
          </div>
          :
          ''
        }

      </div>
    );
  }
}