/*
 * @Author: hf 
 * @Date: 2018-08-02 13:36:58 
 * @Last Modified by: hf
 * @Last Modified time: 2018-08-15 19:24:41
 */

/**
 * 教师的课堂管理页面 > 课堂详情  关联我的上传
 */
import number from './../../js/_x/util/number';
import React from 'react';
import { Button, Checkbox, Select, message } from 'antd';
import './../../css/tm_DetailRelMyupload.css';
import { ResFormat, PubType } from './../common';
import Sfolder from './../../icon/folder.png';
import request from './../../js/_x/util/request';
const Request = request.request;
import { withRouter } from 'react-router-dom';
import '../../js/_x/util/sundry';
import { addCurResInfo_ac } from './../../redux/b_teacherClassDetail.reducer';
import { connect } from 'react-redux';
import { SpinLoad } from './../common';
import noData from './../../icon/null_b.png';
import G from './../../js/g';
const Option = Select.Option;
@withRouter
@connect(
  state => state.B_TacherClassManDetailReducer,
  { addCurResInfo_ac }
)
export default class TmDetailRelMyupload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plainOptions: null,
      checkedList: [],
      indeterminate: true,
      checkAll: false,
    }
  };

  componentDidMount() {
    this.getTotalFolderAndFileList({
      folderId: G.userInfo.user.userId,
      resFormatId: '0'
    })
  }

  /**
   * 获取我的上传列表
   * folderId=当前文件夹id
	 * resFormatId=资源格式类型id(初始化为0)
   */
  getTotalFolderAndFileList = (obj) => {
    Request('default/cloudDiskManage/getTotalFolderAndFileList', obj, (res) => {
      if (res.result) {
        this.setState({
          plainOptions: {
            fetchFolderList: res.data.fetchFolderList,
            fetchFileList: this.dealData(res.data.fetchFileList),
          }
        })
      }
      else {
        this.setState({
          plainOptions: {
            fetchFolderList: [],
            fetchFileList: [],
          }
        })
      }
    })
  }

  /**
   * 点击文件夹，获取文件夹里面的内容
   */
  getThisFolderMsg = (folderId) => {
    this.getTotalFolderAndFileList({
      folderId: folderId,
      resFormatId: "0"
    })
  }

  /**
   * 处理数据，在每个数据后面加一个默认选择checked=false
   */
  dealData = (data) => {
    data.map((item) => {
      item.checked = false
    })
    return data
  }

  /**
   * 选择单一资源
   */
  HandleChange = (e, id) => {
    var checkedList = this.state.checkedList;
    var plainOptions = this.state.plainOptions;
    var fetchFileList = this.state.plainOptions.fetchFileList;
    var data = this.state.plainOptions.fetchFileList;
    let index = _.findIndex(data, function (o) { return o.resourceId == id });
    data[index].check = e.target.checked;
    plainOptions.fetchFileList = fetchFileList;
    if (e.target.checked) {
      checkedList.push({ "resourceId": id, "pubType": data[index].pubType || 1 });
    } else {
      let index = _.findIndex(checkedList, function (o) { return o.resourceId == id })
      checkedList.splice(index, 1);
    }

    this.setState({
      checkedList,
      plainOptions: plainOptions,
      indeterminate: !!checkedList.length && (checkedList.length < fetchFileList.length),
      checkAll: checkedList.length === fetchFileList.length,
    });

  }
  /**
   * 全选资源
   */
  onCheckAllChange = (e) => {
    let plainOptions = this.state.plainOptions;
    let data = this.state.plainOptions.fetchFileList;
    let checkedList = [];
    data.map((item) => {
      item.check = e.target.checked;
      if (e.target.checked) {
        checkedList.push({ resourceId: item.resourceId, "pubType": item.pubType || 1 })
      } else {
        checkedList = []
      }

    });
    plainOptions.fetchFileList = data;
    this.setState({
      plainOptions,
      checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  /**
   * 确认关联
   */

  addCurResInfo = () => {
    let obj = {
      "curResourceId": this.props.match.params.id,
      "resourceList": this.state.checkedList
    };
    if (this.state.checkedList.length != 0) {
      this.props.addCurResInfo_ac(obj)
    }

  }

  /**
   * 类型选择
   */
  typeSelect = (val) => {
    let arr = String(val).split('/');
    let plainOptions = this.state.plainOptions;
    let fetchFileList = plainOptions.fetchFileList;
    let i = arr[0];
    if (fetchFileList[i].check) {
      message.warning('请先取消本项的选择！');
      return false;
    }
    fetchFileList[i].pubType = new Number(arr[1]);
    plainOptions.fetchFileList = fetchFileList;
    this.setState({
      plainOptions
    })
  }

  render() {
    const styleCss = {
      container: {
        height: 600,
        overflow: 'auto',
      },
      comfirmBtn: {
        marginRight: 50,
        background: 'transparent',
        color: '#797e81',
        position: 'absolute',
        top: 10,
        right: 0
      },
      flexDiv: {
        display: 'flex',
        marginLeft: 10,
      },
      flex1: {
        flex: 1,
      },
      title: {
        background: '#2b3238',
        color: '#fff'
      },

      marginLeft: {
        marginLeft: 10
      },
      curName: {
        width: 350,
        cursor: 'pointer',
        marginLeft: 10,
        overflow: 'hidden',
        height: 24,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }
    };
    const data = this.state.plainOptions;

    if (!data) {
      return (<div style={{ textAlign: 'center', margin: 30, height: 300 }}>
        <SpinLoad />
      </div>)
    }

    if (!data.fetchFolderList.length && !data.fetchFileList.length) {
      return (<div className="lxx-g-noData">
        <img src={noData} />
        <p style={{ paddingBottom: 20 }}>无相关资源</p>
      </div>)
    }

    return (
      <div style={styleCss.container}>
        <Button onClick={this.addCurResInfo} style={styleCss.comfirmBtn}>确认关联</Button>
        <div className="hf-tmdrm-flexDiv hf-tmdrm-titleBar">
          <Checkbox className="hf-tmdrm-check"
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >资源名称</Checkbox>
          <div className="hf-tmdrm-size">大小</div>
          <div className="hf-tmdrm-time">修改时间</div>
        </div>
        <div className="hf-tmdrm-content">
          {
            data.fetchFolderList.map((item) => {
              return <div className="hf-tmdrm-flexDiv" key={item.folderId} style={{ cursor: 'pointer' }} onClick={(folderId) => this.getThisFolderMsg(item.folderId)}>
                <div style={styleCss.flexDiv} >
                  <img src={Sfolder} style={styleCss.marginLeft} />
                  <div style={styleCss.curName} title={item.folderName}> {item.folderName} </div>
                </div>
                <div style={styleCss.flex1}></div>
                <div className="hf-tmdrm-size">-</div>
                <div className="hf-tmdrm-time">-</div>
              </div>
            })
          }
          {
            data.fetchFileList.map((item, i) => {
              return <div className="hf-tmdrm-flexDiv" key={item.resourceId}>
                <Checkbox checked={item.check} onChange={(e, id) => this.HandleChange(e, item.resourceId)} />
                <div style={styleCss.flexDiv}>
                  <ResFormat size="small" resFormat={item.resFormat} fileType={item.resFileType} />
                  <div style={styleCss.curName} title={item.resName}> {item.resName} </div>
                </div>
                <div style={styleCss.flex1}></div>
                <div className="hf-tmdrm-size">
                  <Select value={item.pubType ? i + '/' + item.pubType : i + '/' + 1} style={{ width: 120 }} onChange={this.typeSelect}>
                    <Option value={i + '/' + 1}>导学</Option>
                    <Option value={i + '/' + 2}>教案</Option>
                    <Option value={i + '/' + 3} >教材</Option>
                    <Option value={i + '/' + 4}>素材</Option>
                    <Option value={i + '/' + 5}>习题</Option>
                    <Option value={i + '/' + 6} >课件</Option>
                    <Option value={i + '/' + 7}>其他</Option>
                  </Select>
                </div>
                <div className="hf-tmdrm-size">{item.resSize.formatSize()}</div>
                <div className="hf-tmdrm-time">{Number(item.uplaodTime).formatTime(false)}</div>
              </div>
            })
          }
        </div>
      </div>
    )
  }

}
