/*
 * @Author: hf 
 * @Date: 2018-06-19 15:22:36 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-06 15:27:14
 * 通知管理 头部操作栏
 */

import React, { Component } from 'react';
import { Input, Icon, Button, Modal } from 'antd';
import AddNotic from './addNotic';
import { connect } from 'react-redux'
import { add_notic_modal_action , allNoticBtn_action , notice_search ,error_notic , notic_check_all} from '../../redux/notic/tableOperat.redux'
import './noticBar.css';
import { request as ajax } from '../../js/clientRequest';
import { ModalSuccess , ModalConfrim} from '../../components/public/modal';

@connect(state => state, { add_notic_modal_action , allNoticBtn_action ,notice_search ,error_notic ,notic_check_all})
export default class NoticBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      visible: false,
      newInputValue: ''
    };
    this.cancleModal = this.cancleModal.bind(this);

  }

  //关闭弹框
  cancleModal() {
    this.setState({
      visible: false
    })
  }

  // 搜索信息异常提示
  componentDidUpdate(){
    let sdata = this.props.TableOperatReducer;
    if(sdata.isError){
        ModalSuccess.show({data:sdata.errMsg})
        this.props.error_notic();
    }
  }


  // 点击批量删除，
  delete = ()=>{
    let data = this.props.TableOperatReducer;
    if(!data.allIds.length){
      ModalSuccess.show({data:"您还没有选择删除项，请选择~"});
      return;
    }else{
      ModalConfrim.show({
        okFn: () => {
          ajax("message/delete_notice_id", {"noticeid":data.allIds},
          res => {
            if (res.data.result) {
              ModalSuccess.show({ data: "刪除成功",flag:true});  
              //清空checkbox选中状态
              this.props.notic_check_all([],[]); 
              this.props.allNoticBtn_action(this.props.placeReducer.nowBuilding, "", 1);
            } else {
              ModalSuccess.show({ data: res.data.message}); 
            }
          })
        }
      })
    }

  }
  
  render() {
    let props = this.props.TableOperatReducer,buildId = this.props.placeReducer.nowBuilding;
    return (
      <div className="hf-nb-main">
        <div className="hf-nb-search">
          <Input className="hf-nb-ipt" value={props.searchText} onChange={(e) => { this.props.notice_search(e.target.value) }} />
          <Icon type="search" className="hf-nb-icon" onClick={() => { this.props.allNoticBtn_action(buildId,props.searchText,1) }} />
        </div>
        <div className="hf-nb-btns">
          <Button className="hf-nb-btn hf-nb-btn-add" onClick={() => this.props.add_notic_modal_action(true)}>新建通知</Button>
          <Button className="hf-nb-btn hf-nb-btn-info" onClick={()=>{this.props.allNoticBtn_action(buildId, "", 1)}}>全部通知</Button>
          <Button className="hf-nb-btn hf-nb-btn-dels" onClick={this.delete}>批量删除</Button>
        </div>
        <Modal
          visible={props.addNoticShow}
          width={'65%'}
          wrapClassName='hf-nb-wrap'
          footer={null}
          closable={false}
          destroyOnClose={true}
          onCancel={() => this.props.add_notic_modal_action(false)}
        >
          <AddNotic cancleModal={this.cancleModal} hideModal={this.hideModal} />
        </Modal>
      </div>
    )
  }
}