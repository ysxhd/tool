/*
 * @Author: zhengqi 
 * @Date: 2018-08-31 13:47:04 
 * @Last Modified by: zhengqi
 * @Last Modified time: 2018-09-06 16:50:45
 */
/*功能菜单设置*/
import React, { Component } from 'react';
import { Switch, Checkbox, Input } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { getFunctionsData, chageSwitch, openChild, onChangeSelet, handleName } from './../../../redux/zq-initComp-reducer';
import './../../../css/Initialize.css';

@connect(
  state => state.initReducer,
  {
    getFunctionsData, chageSwitch, openChild, onChangeSelet, handleName
  }
)
class InitializeCompnent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    console.log(this.props.type);
    this.props.getFunctionsData(this.props.type);
  }
  render() {
    let props = this.props;
    let selectIndex = props.selectIndex;
    let functions = props.functions.function;
    let selectData = functions[selectIndex];
    let checkVal = [];
    if (selectIndex !== null) {
      selectData.childList.map(item => {
        if (item.status) {
          checkVal.push(item.functionId);
        }
      });
    }
    return (
      <div>
        <div className='zq-init-row'>
          <p style={{ lineHeight: "40px" }}>平台名称：</p>
          <Input value={props.functions.projectName} onChange={props.handleName} />
        </div>
        <div className='zq-init-menu'>
          <div className='zq-init-menuLeft'>
            {
              functions.map((item, i) => {
                return <div key={item.functionId} className='zq-init-fucRow'>
                  <Switch checked={item.status ? true : false} onChange={(checked) => { props.chageSwitch(i, checked) }} />
                  {
                    item.status ?
                      <p className={selectIndex === i ? "zq-init-select" : ''}>
                        <span onClick={() => props.openChild(i)}>{item.functionName}</span></p> :
                      <p style={{ color: '#abb4bf' }}>{item.functionName}</p>
                  }
                  <i></i>
                </div>

              })
            }
          </div>
          {
            selectIndex !== null ?
              <div className='zq-init-menuRight'>
                <p>{selectData.functionName}</p>
                {
                  selectData.childList ?
                    <Checkbox.Group style={{ width: '100%' }} onChange={props.onChangeSelet} value={checkVal}>
                      {
                        selectData.childList.map((item, i) => {
                          return <Checkbox key={item.functionId} value={item.functionId}> {item.functionName}</Checkbox>
                        })
                      }
                    </Checkbox.Group>
                    : null
                }
              </div> :
              <div className='zq-init-menuRight'>
                <p style={{ fontSize: '15px' }} > 二级模块启用设置页面</p>
                <div className='zq-init-nodata'>
                  <img src={require("./../../../img/hint.png")} alt='' />
                  <p>请在右侧选择上级模块</p>
                </div>
              </div>

          }
        </div>
      </div>
    );
  }
}

export default InitializeCompnent;