/*
 * @Author: 甘维添 
 * @Date: 2018-05-17 13:27:31 
 * @Last Modified by: MinJ
 * @Last Modified time: 2018-05-17 19:10:56
 */

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import ugly from './../../img/ugly.png';
import { Scrollbars } from 'react-custom-scrollbars';
import { Spin, notification } from 'antd';
import { G, _x } from './../../js/index';
import './verify_info.css';

const ajax = _x.util.request.request
const format = _x.util.date.format
const toChinese = _x.util.number.toChinese

class LocusItem extends Component {
  constructor(props) {
    super(props);
    this.service = G.service
  }

  render() {
    let props = this.props
    let curr = props.data
    // 比对时间
    let date = new Date(curr.time)
    return (<li>
      <div className="gwt-session" >
        <p >第{toChinese(curr.orrder)}场</p>
      </div>
      <div className="gwt-verify-time">
        <p>{format(date)}</p>
      </div>
      <div className="gwt-img">
        <div className="gwt-img-container">
          <img src={props.collectionPhoto} alt="" />
        </div>
        <span>&nbsp;</span>
      </div>
      <div className="gwt-site-img">
        <div className="gwt-img-container">
          <img src={this.service + curr.photo} alt="" />
        </div>
        <span>对比值：{curr.value}</span>
      </div>
      <div className="gwt-verify-type">
        <p>{props.verifyType}</p>
      </div>
      <div className="gwt-com-res">
        {
          curr.passType === 1
            ? <p className="gwt-pass">通过</p>
            : <p>不通过</p>
        }
      </div>
    </li>
    )
  }
}

class VerifyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trajectory: null,
      collectionPhoto: '',
      showTips: false
    }

    // 验证类型 1 确认，2未确认
    this.verifyType = props.type
    // this.verifyType = 1
    console.log(this.props)
  }

  componentWillMount() {
    // 获取验证轨迹数据
    this.getStuDetails()
  }

  componentDidMount() {
    // 入场动画
    let verifyContent = this.node.children[0]
    verifyContent.className = "gwt-verify-content show"
  }

  /**
 * 移除该组件
 */
  remove() {
    let parentNode = this.node.parentNode
    let verifyContent = this.node.children[0]
    verifyContent.className = "gwt-verify-content hide"
    // 由于使用了CSS3动画，动画设定时长为0.4S 故0.4S后移除组件
    setTimeout(() => {
      ReactDOM.unmountComponentAtNode(parentNode)
      parentNode.parentNode.removeChild(parentNode)
    }, 400)
  }

  /**
   * 获取学生详情
   */
  getStuDetails() {
    let { planId, number, candidateNumber, type, orgCode } = this.props
    let req = {
      "orgCode": orgCode,//Stirng类型，机构代码
      "planId": planId,
      "candidateNumber": candidateNumber,//String类型，考号
      "number": number, //Integer类型，场次
    }
    ajax('artificial_confirm/get_studetail', req, (res) => {
      // 若请求成功且存在数据时，将数据渲染 否则，将列表赋值为空数组，触发暂无数据
      if (res.result && res.data) {
        let data = res.data
        let collectionPhoto = G.service + data.collectionPhoto
        this.setState({ ...data, collectionPhoto })
      } else {
        let trajectory = []
        this.setState({ trajectory })
      }
    })
  }

  /**
   * 人工确认结果，1表示通过，2表示未通过，3表示身份验证缺考
   * @param {number} type  
   */
  passHandle(type) {
    let { planId, number, candidateNumber, orgCode } = this.props
    let req = {
      "confirm": type, //Integer类型，人工确认结果，1表示通过，2表示未通过，3表示身份验证缺考
      "orgCode": orgCode,//Stirng类型，机构代码
      "planId": planId, //String 类型，计划id
      "number": number, //Integer类型，场次
      "candidateNumber": candidateNumber,//String类型，考号
    }
    ajax('artificial_confirm/validation_confirmed', req, (res) => {
      if (res.result) {
        notification.success({
          placement: 'bottomRight',
          message: '操作成功！',
          duration: 1
        })

        // 刷新列表
        this.props.pass()
        // 关闭弹窗
        this.remove()
      } else {
        notification.error({
          placement: 'bottomRight',
          message: res.message,
          duration: 2
        })
      }
    })
  }

  render() {
    let {
      name,
      sex,
      idCard,
      candidateNumber, // 考号
      sNum, // 座位号
      verifyType // 验证类型
    } = this.props

    let {
      collectionPhoto, // 采集照
      trajectory  // 验证列表 
    } = this.state
    return (
      <div
        onClick={this.remove.bind(this)}
        ref={node => this.node = node}
        className="gwt-verify-container"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="gwt-verify-content"
        >
          <Scrollbars>
            <h3>
              <span>已验证人工确认</span>
              <span
                onClick={this.remove.bind(this)}
                className="gwt-close"
              >x</span>
            </h3>
            <div className="gwt-stu-info">
              <h4>考生信息</h4>
              <div>
                <p>姓名：{name}</p>
                <p>性别：{sex === 1 ? '男' : '女'}</p>
                <p>身份证号码：{idCard}</p>
                <div className="gwt-img-container">
                  <img src={collectionPhoto} alt="" />
                </div>
              </div>
            </div>
            {/* 编排信息 */}
            <div className="gwt-arrange-info">
              <h4>编排信息</h4>
              <p>
                <span>考号：{candidateNumber}</span>
                <span>座位号：{sNum}</span>
              </p>
              {this.verifyType === 1 ? <h4>验证轨迹</h4> : null}
            </div>
            {/* 根据不同的 验证类型，展示不同的数据 */}
            {
              this.verifyType === 1
                ? <React.Fragment>
                  <div className="gwt-table-tatle">
                    <p className="gwt-session">场次</p>
                    <p className="gwt-verify-time">验证时间</p>
                    <p className="gwt-img">采集照</p>
                    <p className="gwt-site-img">现场照</p>
                    <p className="gwt-verify-type">验证类型</p>
                    <p className="gwt-com-res">对比结果</p>
                  </div>
                  {/* 根据接口通讯情况，判断显示加载中/无数据/列表 */}
                  {
                    trajectory
                      ? trajectory.length
                        ? <Scrollbars
                          style={{ width: '100%', height: '48%' }}
                        >
                          <ul className="gwt-locus">
                            {
                              trajectory.map((item, index) => {
                                return <LocusItem
                                  collectionPhoto={collectionPhoto}
                                  key={index}
                                  data={item}
                                  verifyType={verifyType}
                                ></LocusItem>
                              })
                            }
                          </ul>
                        </Scrollbars>
                        : <p>暂无数据！</p>
                      : <div style={{ textAlign: 'center', lineHeight: '50px' }}>
                        {/* 数据加载时 loading */}
                        <Spin></Spin>
                      </div>
                  }

                </React.Fragment>
                : null
            }
            {/* 操作按键,若是未确认学生详情，则展示身份验证缺考按钮 */}
            <div className="gwt-verify-footer gwt-noverify">
              <p>请确认:</p>
              <button onClick={this.passHandle.bind(this, 1)}>通过</button>
              <button onClick={this.passHandle.bind(this, 2)}>不通过</button>
              {
                this.verifyType === 2
                  ? <button onClick={this.passHandle.bind(this, 3)}>身份验证缺考</button>
                  : null
              }
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

/**
 * 渲染弹窗
 * @param {object} params 
 */
VerifyInfo.show = function (params) {
  let div = document.createElement('div')
  div.id = 'VerifyInfo'
  document.body.appendChild(div);

  ReactDOM.render(<VerifyInfo {...params} />, div);
}

// VerifyInfo.hide = function (properties, callback) {
//   let dom = document.getElementById('VerifyInfo')
//   // console.log(dom)
// }

export default VerifyInfo;