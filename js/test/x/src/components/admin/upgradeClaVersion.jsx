/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-20 17:11:13
 * 在线升级——版本管理组件
 */
import React, { Component } from 'react';
import { Carousel, Button, Modal, Form, Input, Upload, Spin } from 'antd';
import { SVG, IMG } from '../../components/base';
import { success, error, confirmDia } from './../../components/student/index';
import _x from '../../js/_x/index';

import '../../css/admin/upgradeClaVersion.css';
const FormItem = Form.Item;
const { TextArea } = Input;

export class UpgradeClaVersion extends Component {
  constructor() {
    super();
    this.state = {
      versionData: [],         //软件版本列表
      versionList: [],         //软件版本列表  原始数据
      point: [],
      versionLen: 0,           //软件版本列表元素个数
      visible: false,            //modal是否可见
      wordNum: 0,
      isSelect: false,
      preImgs: 0,
      preWidth: 0,
      nowPage: 0,
      perPageWidth: 0,
      points: [],
      upDiary: '',           //更新日志
      upVersion1: undefined,         //版本号1
      upVersion2: undefined,         //版本号2
      upVersion3: null,           //版本号3
      upData: '',              //上传版本
      upDataName: '',            //上传版本的命名
    }
    this.requestVersion = this.requestVersion.bind(this);
    this.btnClick = this.btnClick.bind(this);
    this.okCli = this.okCli.bind(this);
    this.backCli = this.backCli.bind(this);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.keyNum = this.keyNum.bind(this);
    this.dialogChan = this.dialogChan.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.deleVersion = this.deleVersion.bind(this);
    this.versionDataClean = this.versionDataClean.bind(this);
    this.deleCli = this.deleCli.bind(this);
  }
  componentWillMount() {
    // console.log(1);
    this.requestVersion();
  }
  componentDidMount() {
    // console.log(this.state.versionData.length);
    if (this.state.versionData.length) {
      var Pagepercent = document.getElementsByClassName('mj-ucv-upgradeCom')[0].style.width;

      var a = document.getElementsByClassName("kyl-ucv-versionPic")[0];
      this.setState({
        perPageWidth: Pagepercent
      })
      var preWidth = a.clientWidth;
      this.setState({ preWidth: preWidth })


      var point = document.getElementsByClassName('kyl-ucv-point')[0]
      point.style.width = "22px";       //将其设置样式
      point.style.background = "#ff9934"
    }
  }


  /**
   * 获取软件版本列表(无入参)
   */
  requestVersion() {
    // console.log(1111);
    var req = {
      action: 'api/web/manager_manage_class_card/software_version',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      var data = ret.data;
      // for (var n = 0; n < 12; n++) {
      //   data.push({ name: `V${n}.0.0`, id: n });
      // }
      this.versionDataClean(data);
      this.setState({
        versionList: data
      })
    })
  }
  /**
   * 上传版本
   * upData需上传的文件, upVersion版本号, upDiary更新日志
   */
  requestUpVersion(upData, upVersion, upDiary) {
    // upVersion = `V${upVersion[0]}.${upVersion[1]}`;
    // console.log(upData);
    var req = {
      action: 'api/web/manager_device_software/upload',
      data: {
        versionNumber: upVersion,
        updateLog: upDiary
      },
      file: upData
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        this.requestVersion();
        success('上传成功', 1000);
        this.props.diaChan(false, true);
      } else {
        var versionList = this.state.versionList;
        versionList.splice(0, 1);
        this.versionDataClean(versionList);
        error('上传失败', 1000);
      }
    })
  }
  /**
   * 删除版本
   * ids需删除的版本号
   */
  deleVersion(ids) {
    // console.log(ids);
    var req = {
      action: 'api/web/manager_device_software/delete',
      data: {
        ids: ids
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        success('删除成功', 1000);
        this.requestVersion();
      } else {
        error('删除失败', 1000);
      }
    })
  }
  /**
   * 验证版本好是否重复
   * name:版本号
   */
  versionTest(name) {
    var req = {
      action: 'api/web/manager_device_software/check_name',
      data: {
        name: name
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        // console.log(ret.data);
        var data = ret.data;
        if (data) {
          var upVersion = `v${this.state.upVersion1}.${this.state.upVersion2}.${this.state.upVersion3}`
          var versionData = this.state.versionList;
          versionData.unshift({ name: upVersion, update: true });
          this.versionDataClean(versionData);
          this.requestUpVersion(this.state.upData, upVersion, this.state.upDiary);
          this.setState({
            visible: false
          });
        } else {
          error(`已存在${name}版本。`, 1000);
        }
      }
    })
  }

  // 版本数组整理
  versionDataClean(data) {
    // console.log(data)
    if (data && data.length) {
      var num = 6;//每个子数组里的元素个数
      var Arr = new Array(Math.ceil(data.length / num));
      for (var i = 0; i < Arr.length; i++) {
        Arr[i] = new Array();
        for (var k = 0; k < num; k++) {
          Arr[i][k] = {};
          // Arr[i][k] = { name: "v1.1", update: true };
        }
      }
      for (var l = 0; l < data.length; l++) {
        Arr[parseInt(l / num)][l % num] = data[l];
        // console.log(Arr)
      }
    } else {
      Arr = data;
    }
    this.setState({
      versionData: Arr,
      versionLen: data ? data.length : 0
    })

    if (Arr && Arr.length) {
      var point = document.getElementsByClassName('kyl-ucv-point')[0]
      point.style.width = "22px";       //将其设置样式
      point.style.background = "#ff9934"
    }
  }
  //上传按钮
  btnClick() {
    this.setState({
      visible: true,
      upVersion1: '',
      upVersion2: '',
      upVersion3: '',
      upDataName: '',
      upDiary: ''
    })
  }
  //上传确定
  okCli() {
    //检测版本号是否可用
    if (!this.state.upVersion1 || !this.state.upVersion2 || !this.state.upVersion3) {
      error('请输入完整版本号', 1500);
    } else if (!this.state.upData) {
      error('请选择上传版本', 1500);
    } else {
      let reg = new RegExp(/^[0-9]*$/);
      // console.log(reg);
      if (!reg.test(parseFloat(this.state.upVersion1)) || !reg.test(parseFloat(this.state.upVersion2)) || !reg.test(parseFloat(this.state.upVersion3))) {
        error('输入的版本号只能输入数字', 1500);
      }else if(this.state.upVersion1.length>1||this.state.upVersion2.length>1||this.state.upVersion3.length>1){
        error('输入的版本号每个输入框只能输入一位',1500);
      }else {
        var upVersion = `v${this.state.upVersion1}.${this.state.upVersion2}.${this.state.upVersion3}`;
        this.versionTest(upVersion);
      }

    }
  }
  // 上传取消
  backCli() {
    // console.log(this.state.upDataName)
    this.setState({
      visible: false,
      upDiary: '',
      upVersion: [],
      upData: '',
    });
  }
  //删除按钮
  deleCli(ids) {
    confirmDia({
      title: '删除提示',
      content: '确认删除？',
      className: 1,
      okText: '删除',
      fnOK: function () {
        this.deleVersion([ids]);
      }.bind(this)
    })
  }
  // modal更新日志文字统计
  keyNum(e) {
    // console.log(e.target.value);
    var len = e.target.value.length;
    this.setState({
      wordNum: len,
      upDiary: e.target.value
    })
  }
  //切换至更新日志
  dialogChan() {
    this.props.diaChan(true, false);
  }
  //版本号
  upVersion(page, e) {
    // console.log(page);
    if (page === '1') {
      this.setState({
        upVersion1: e.target.value
      })
    } else if (page === '2') {
      this.setState({
        upVersion2: e.target.value
      })
    } else {
      this.setState({
        upVersion3: e.target.value
      })
    }
    // console.log(upVersion);
  }
  // 上传版本
  uploadMeinImg(e) {
    // console.log(e.target.files);
    // var files = e.target.value;
    var files = e.target.files;
    let file = files ? files[0].name : '';
    var three = file.split(".");
    var last = three[three.length - 1];
    var tp = "apk";
    //返回符合条件的后缀名在字符串中的位置
    var rs = tp.indexOf(last.toLowerCase());
    //获取截取的最后一个字符串，即为后缀名
    if (rs >= 0) {
      this.setState({
        upData: files,
        upDataName: files[0].name
      })
    } else {
      error("请上传有效的Android安装包", 1500)
    }
  }

  /**
   * 走马灯
   */
  // 走马灯上一页
  prev() {
    if (this.state.nowPage < 1) {
    } else {
      this.setState({ nowPage: this.state.nowPage - 1 })
      setTimeout(() => {
        // console.log(this.state.nowPage)
        let point = document.getElementsByClassName('kyl-ucv-point')[this.state.nowPage];
        point.style.width = "22px";       //将其设置样式
        point.style.background = "#ff9934"
        let pointBox = document.getElementsByClassName('kyl-ucv-point')
        for (var j = 0; j < pointBox.length; j++) {
          if (pointBox[j] != pointBox[this.state.nowPage]) {
            pointBox[j].setAttribute("style", "background:#aaaeb3")
            pointBox[j].setAttribute("style", "width:12px")
          }
        }
        this.move(this.state.nowPage);
      }, 1);
    }
  }
  /**
   * 左右滚动的函数
   * offset ：滚动的距离
   */
  move(offset) {
    var imgs = document.getElementsByClassName("kyl-ucv-box")[0];
    var left = -100 * offset + "%";
    imgs.style.left = left;
  }
  // 走马灯下一页
  next() {
    if (this.state.nowPage < this.state.versionData.length - 1) {
      this.setState({ nowPage: this.state.nowPage + 1 });
      setTimeout(() => {
        let point = document.getElementsByClassName('kyl-ucv-point')[this.state.nowPage];
        point.style.width = "22px";       //将其设置样式
        point.style.background = "#ff9934"
        let pointBox = document.getElementsByClassName('kyl-ucv-point')
        for (var j = 0; j < pointBox.length; j++) {
          if (pointBox[j] != pointBox[this.state.nowPage]) {
            pointBox[j].setAttribute("style", "background:#aaaeb3")
            pointBox[j].setAttribute("style", "width:12px")
          }
        }
        this.move(this.state.nowPage);
      }, 1);
    } else {
    }
  }

  //走马灯  圆点点击
  handleClick(val) {
    this.setState({ nowPage: val })
    setTimeout(() => {
      let point = document.getElementsByClassName('kyl-ucv-point')[this.state.nowPage];
      point.style.width = "22px";       //将其设置样式
      point.style.background = "#ff9934"
      let pointBox = document.getElementsByClassName('kyl-ucv-point')
      for (var j = 0; j < pointBox.length; j++) {
        if (pointBox[j] != pointBox[this.state.nowPage]) {
          pointBox[j].setAttribute("style", "background:#aaaeb3")
          pointBox[j].setAttribute("style", "width:12px")
        }
      }
      this.move(val);
    }, 1);
  }

  render() {
    // console.log(this.state.upData);
    // const dataq = this.versionList;
    const onlyOnePage = (this.state.versionData && this.state.versionData.length == 1) ? "hidden" : "visible";
    return (
      <div className='mj-ucv-contain'>
        {/* title */}
        <div className='mj-ucv-title'>
          <span>版本管理</span>
          <div className='mj-ucv-titDiv' onClick={this.dialogChan}>
            <SVG type={'logs'}></SVG>
            <span>更新日志</span>
          </div>
        </div>

        {/* content */}
        {/* 版本轮播图 */}
        {
          this.state.versionData && this.state.versionData.length
            ?
            <div className='kyl-ucv-content'>
              <div className="kyl-ucv-prev">
                <div onClick={this.prev} style={{ visibility: onlyOnePage }}>
                  <SVG type="prev"></SVG>
                </div>
              </div>
              <div className="kyl-ucv-versionPic" style={{}}>
                <div className="kyl-ucv-box" style={{ left: 0, width: this.state.versionData.length * 100 + '%' }}>
                  {
                    this.state.versionData.map((item, index) => {
                      return <div key={index} className='mj-ucv-upgradeCom' style={{ width: 100 / this.state.versionData.length + "%" }}>
                        {
                          item.map((val, ji) => (
                            val.name
                              ?
                              <div className='mj-ucv-androidCon' key={ji}>
                                <div className={val.update ? 'mj-ucv-androidAgo1' : 'mj-ucv-androidAgo'}>
                                  <SVG type='android' ></SVG>
                                  <div style={{ backgroundColor: val.update ? '#ff9934' : '#ced3d9' }}>{val.name}</div>
                                </div>
                                {
                                  val.update
                                    ?
                                    <div>
                                      <Spin className="kyl-ucv-loading"></Spin>
                                      <span className="kyl-ucv-loadWord">上传中...</span>
                                    </div>
                                    :
                                    <Button className='mj-ucv-upBtn' onClick={() => this.deleCli(val.id)}>删除</Button>
                                }
                              </div>
                              :
                              ''
                          ))
                        }
                      </div>
                    })
                  }
                </div>
              </div>
              <div className="kyl-ucv-next">
                <div onClick={this.next} style={{ visibility: onlyOnePage }}>
                  <SVG type="next"></SVG>
                </div>
              </div>
            </div>
            :
            <div className='mj-ucv-content1'>
              <div>
                <IMG src={require('../../img/noData.png')} width="130px" height="130px" />
                <div className="mj-ucv-txt">暂无相关内容</div>
              </div>
            </div>
        }
        <div className="kyl-ucv-lineBox">
          <div className="kyl-ucv-bottomLine">
            {
              this.state.versionData && this.state.versionData.map((item, index) => (
                <div className="kyl-ucv-pointBox" key={index} style={{
                  width: 34 * this.state.versionData.length + "px",
                  visibility: onlyOnePage
                }}>
                  <div className="kyl-ucv-point" id={"point" + index} onClick={() => this.handleClick(index)} style={{ width: "12px", background: "#aaaeb3" }}></div>
                </div>

              ))
            }
          </div>
        </div>

        <div className='mj-ucv-btn'>
          <Button onClick={this.btnClick}>上传APK</Button>
        </div>

        {/* modal */}
        <Modal title="版本信息"
          visible={this.state.visible}
          onCancel={this.backCli}
          className='mj-ucv-modalCon'
          footer={[
            <Button className='mj-wcto-okBtn' key="submit" onClick={this.okCli}>保存</Button>,
            <Button className='mj-wcto-cancelBtn' key="back" onClick={this.backCli}>
              取消
            </Button>,
          ]}
        >
          <Form layout="inline" onSubmit={this.handleSubmit}>
            {/* 文件选择 */}
            <FormItem>
              <span className='mj-ucv-firSpan'>选择文件：</span>
              <Input
                className='mj-ucv-apkChoice'
                readOnly
                value={this.state.upDataName} />
              <div className='mj-ucv-version'>
                <input
                  type="file"
                  name="files"
                  ref={(file) => { this.file = file }}
                  // accept="image/*"
                  onChange={this.uploadMeinImg.bind(this)}
                />
                <Button>选择文件</Button>
              </div>
            </FormItem>
            {/* 版本号 */}
            <FormItem>
              <span className='mj-ucv-firSpan'>版本号：</span>
              <span className='mj-ucv-secSpan'>V</span>
              <Input className='mj-ucv-versionLef' value={this.state.upVersion1} onChange={this.upVersion.bind(this, '1')} />.
              <Input className='mj-ucv-versionLef' value={this.state.upVersion2} onChange={this.upVersion.bind(this, '2')} />.
              <Input className='mj-ucv-versionLef' value={this.state.upVersion3} onChange={this.upVersion.bind(this, '3')} />
              <span className='mj-ucv-sampleSpan'>例：V1.0.2</span>
            </FormItem>
            {/* 更新日志 */}
            <FormItem>
              <span className='mj-ucv-firSpan mj-ucv-updSpan'>更新日志：</span>
              <TextArea maxLength='500' value={this.state.upDiary} onChange={this.keyNum} className='mj-ucv-textarea' />
              <div className='mj-ucv-num'>{`${this.state.wordNum}/500`}</div>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}