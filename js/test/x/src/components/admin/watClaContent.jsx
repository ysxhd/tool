/*
 * @Author: MinJ 
 * @Date: 2018-01-05 10:57:44 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-12 11:09:24
 * 状态监督——列表管理组件
 */
import React, { Component } from 'react';
import { Badge, Select, Input, Button, Popover, Checkbox, Pagination, Slider, Spin } from 'antd';
import { SVG, IMG } from '../../components/base';
import _ from 'lodash';
import { success, error } from './../../components/student/index';
import { WatClaTabOnOff, WatClaViewListCon, WatClaTabListCon, WatClaDel } from '../../components/admin/index';
import _x from '../../js/_x/index';
import '../../css/admin/watClaContent.css';
const Option = Select.Option;
const Search = Input.Search;

export class WatClaContent extends Component {
  constructor() {
    super();
    this.state = {
      versionData: [],     //版本号列表***
      version: '',         //选择的版本
      key: '',            //查询关键字
      type: 0,             //设备状态
      sortType: 1,         //排序方式
      adressId: '',        //场所Id
      classId: '',       //教室Id
      pageSize: 20,      //分页大小
      pageIndex: 1,        //页码
      listData: [],      //列表数据***
      checkList: [],         //选择列表
      oneCheck: '',          //单项选择————删除
      ifList: false,           //是否是批量删除
      ifCheckAll: false,       //全选按钮状态
      listTotal: 20,       //列表数据总数
      ifView: true,      //列表显示或视图显示：true视图,false列表
      onOff: false,      //定时开关机modal
      sureDel: false,      //删除确定modal框
      voiceVal: 1,           //音量
      ifVoiceVal: 1,         //音量中间值
      voiceShow: false,        //音量控制条出现
      screenVal: true,          //屏幕是否开启
      powerVal: 0,               //电源控制
      isNew: true,              //是否为初始化
      // isF5: true,               //是否为切换
      state: '',     //场所类型
      seleType: '',     //年级还是场所
    }
    this.requestListData = this.requestListData.bind(this);
    this.requestVersionData = this.requestVersionData.bind(this);
    this.requestBatchDele = this.requestBatchDele.bind(this);
    this.requestContrlMemory = this.requestContrlMemory.bind(this);
    this.versionChange = this.versionChange.bind(this);
    this.orderChange = this.orderChange.bind(this);
    this.onOff = this.onOff.bind(this);
    this.itemRender = this.itemRender.bind(this);
    this.pageSizeChange = this.pageSizeChange.bind(this);
    this.viewListChange = this.viewListChange.bind(this);
    this.listCli = this.listCli.bind(this);
    this.onOffCli = this.onOffCli.bind(this);
    this.keySearch = this.keySearch.bind(this);
    this.pageindexChange = this.pageindexChange.bind(this);
    this.batchDele = this.batchDele.bind(this);
    this.checkAllChan = this.checkAllChan.bind(this);
    this.statusChan = this.statusChan.bind(this);
    this.deleCli = this.deleCli.bind(this);
    this.sliderChan = this.sliderChan.bind(this);
    this.voiceBtn = this.voiceBtn.bind(this);
    this.voiceSure = this.voiceSure.bind(this);
    this.deleData = this.deleData.bind(this);
  }
  componentWillMount() {
    this.requestVersionData();

  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.state.isNew);
    var data = this.state.listData;
    var selectPla = nextProps.selectPla,
      seleType = nextProps.seleType,
      ifNone = false,
      adressId = this.state.adressId,
      classId = this.state.classId;
    if (this.state.isNew) {
      // console.log(1);
      this.requestListData(this.state.version, nextProps.keyword, this.state.type, this.state.sortType,
        '', this.state.classId, this.state.pageSize, this.state.pageIndex, nextProps.state);
      for (let i in data) {
        this.setState({
          ["check" + data[i].ssid]: false
        })
      }
      this.setState({
        isNew: false,
        state: nextProps.state,
        key: nextProps.keyword,
        seleType: 'nj',
        ifCheckAll: false,
        checkList: []
      })
    } else if (seleType === 'nj') {
      // console.log(2)
      //按年纪查询则把对应的地址清空
      this.requestListData(this.state.version, nextProps.keyword, this.state.type, this.state.sortType,
        "", selectPla, this.state.pageSize, this.state.pageIndex, nextProps.state);
      for (let i in data) {
        this.setState({
          ["check" + data[i].ssid]: false
        })
      }
      this.setState({
        classId: selectPla,
        adressId: '',
        state: nextProps.state,
        key: nextProps.keyword,
        seleType: seleType,
        ifCheckAll: false,
        checkList: []
      })
    } else if (seleType === 'cs') {
      // console.log(3);
      // console.log(selectPla);
      this.requestListData(this.state.version, nextProps.keyword, this.state.type, this.state.sortType,
        selectPla, "", this.state.pageSize, this.state.pageIndex, nextProps.state);
      for (let i in data) {
        this.setState({
          ["check" + data[i].ssid]: false
        })
      }
      this.setState({
        classId: '',
        adressId: selectPla,
        state: nextProps.state,
        key: nextProps.keyword,
        seleType: seleType,
        ifCheckAll: false,
        checkList: []
      })
    }
  }

  /**
   * 获取列表数据
   * version软件版本(''全部),  key查询关键字(''),  type设备状态(0全部), sortType排序方式(1默认)
   * adressId场所ID,  classId年级Id,  pageSize分页大小,  pageIndex第几页
   */
  requestListData(version, key, type, sortType, adressId, classId, pageSize, pageIndex, placeType) {
    // console.log(1111);
    // console.log(classId);
    // console.log('ListData:\\' + version + ':\\' + key + ':\\' + type + ':\\' + sortType + ':\\' +
    //   adressId + ':\\' + classId + ':\\' + pageSize + ':\\' + pageIndex);
    var classid = classId;
    if (classid.length) {
      classid = classid[0]
    } else {
      classid = '';
    }
    var req = {
      action: 'api/web/manager_manage_class_card/find',
      data: {
        cardVersion: version,
        key: key,
        sortType: sortType,
        type: type,
        addressId: adressId,
        cId: classid,
        // sortType: 1,
        // type:0,
        // addressId: '',
        // cId:'',
        pageSize: pageSize,
        pageIndex: pageIndex,
        placeType: placeType
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret.data);    
      if (ret.result) {
        var data = ret.data;
        this.setState({
          listData: data,
          listTotal: ret.total,
          key: ''
        })
      }
    })
  }
  /**
   * 获取版本号(无入参)
   */
  requestVersionData() {
    var req = {
      action: 'api/web/manager_manage_class_card/software_version',
      data: {}
    }
    _x.util.request.formRequest(req, (ret) => {
      if (ret.result) {
        const data = ret.data;
        var versionData = [];
        versionData.push({ name: `全部版本`, id: 'all' });
        for (var i = 0, len = data.length; i < len; i++) {
          versionData.push(data[i]);
        }
        this.setState({
          versionData: versionData
        })
        // console.log(versionData);
      }
    });
  }
  /**
   * 设备删除
   * ids设备id
   */
  requestBatchDele(ids) {
    // console.log(ids);
    var req = {
      action: 'api/web/manager_manage_class_card/unbind',
      data: {
        // ids: ['1']
        ids: ids
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret);
      if (ret.result) {
        var data = this.state.listData;
        for (let i in data) {
          this.setState({
            ["check" + data[i].ssid]: false
          })
        }
        this.setState({
          checkList: [],
          ifCheckAll: false
        });
        this.requestListData(this.state.version, this.state.key, this.state.type, this.state.sortType,
          this.state.adressId, this.state.classId, this.state.pageSize, 1, this.state.state);
        success('删除成功', 1000);
      } else {
        error('删除失败', 1000);
      }
    })
  }
  /**
   * 远程控制 数据存储
   * ids需要控制的设备id列表,   voice声音(小数),   screen屏幕是否开启,  power电源控制   
   */
  requestContrlMemory(ids, voice, screen, power) {
    // console.log('requestContrlMemory:\\' + ids + ':\\' + voice + ':\\' + screen + ':\\' + power);
    var req = {
      action: 'api/web/manager_manage_class_card/control',
      data: {
        ids: ids,
        voice: voice,
        screen: screen,
        power: power,
        // ids: ['2']
      }
    }
    _x.util.request.formRequest(req, (ret) => {
      // console.log(ret.data);
      if (ret.result) {
        success('操作成功', 1000);
      } else {
        error('操作失败', 1000);
      }
    })
  }

  /**
   * 各点击事件：进行列表搜索
   */
  //2在线、1离线点击事件  
  onOffCli(status) {
    // console.log(status);
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    this.setState({
      type: status,
      pageIndex: 1,
      ifCheckAll: false,
      checkList: []
    });

    this.requestListData(this.state.version, this.state.key, status, this.state.sortType,
      this.state.adressId, this.state.classId, this.state.pageSize, 1, this.state.state);
  }
  //版本选择
  versionChange(value) {
    // console.log(value);
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    var val = value;
    value === 'all'
      ?
      val = ''
      :
      val = value
    this.setState({
      version: val,
      pageIndex: 1,
      ifCheckAll: false,
      checkList: []
    });
    this.requestListData(val, this.state.key, this.state.type, this.state.sortType,
      this.state.adressId, this.state.classId, this.state.pageSize, 1, this.state.state);
  }
  //关键字输入及搜索
  keySearch(value) {
    // console.log(value);
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    this.setState({
      key: value,
      pageIndex: 1,
      ifCheckAll: false,
      checkList: []
    });
    // console.log(this.state.addressId);
    this.state.seleType === 'nj' ?
      this.props.requestOnlineNum(this.state.classId, "", 0, value, this.state.classId, 'nj', this.state.state) :
      this.props.requestOnlineNum("", this.state.adressId, this.state.state, value, this.state.adressId, 'cs', this.state.state)
    // this.requestListData(this.state.version, value, this.state.type, this.state.sortType,
    //   this.state.adressId, this.state.classId, this.state.pageSize, 1);
  }
  //排序选择
  orderChange(value) {
    // console.log(value);
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    this.setState({
      sortType: value,
      pageIndex: 1,
      ifCheckAll: false,
      checkList: []
    });
    this.requestListData(this.state.version, this.state.key, this.state.type, value,
      this.state.adressId, this.state.classId, this.state.pageSize, 1, this.state.state);
  }
  //分页大小
  pageSizeChange(value) {
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    this.setState({
      pageSize: value,
      pageIndex: 1,
      ifCheckAll: false,
      checkList: []
    });
    this.requestListData(this.state.version, this.state.key, this.state.type, this.state.sortType,
      this.state.adressId, this.state.classId, value, 1, this.state.state);
  }
  //页码改变
  pageindexChange(page) {
    var data = this.state.listData;
    for (let i in data) {
      this.setState({
        ["check" + data[i].ssid]: false
      })
    }
    this.setState({
      pageIndex: page,
      ifCheckAll: false,
      checkList: []
    });
    this.requestListData(this.state.version, this.state.key, this.state.type, this.state.sortType,
      this.state.adressId, this.state.classId, this.state.pageSize, page, this.state.state);
  }
  //批量删除点击
  deleCli() {
    this.setState({
      sureDel: true,
      ifList: true
    })
  }
  //是否确认删除
  batchDele(ifOk, status, ifList) {
    if (ifOk === 'OK') {
      // console.log('删除');
      this.state.ifList
        ?
        this.requestBatchDele(this.state.checkList)
        :
        this.requestBatchDele(this.state.oneCheck);

      this.setState({
        ifCheckAll: false,
        sureDel: false
      })
    } else {
      // console.log('拒绝删除');
      this.setState({
        // ifCheckAll: false,
        sureDel: false
      })
    }
  }

  //单项选中
  listCli(ifcheck, val) {
    // console.log(ifcheck);
    // console.log(val);
    var checkList = this.state.checkList,
      data = this.state.listData;
    this.setState({
      ['check' + val]: ifcheck
    })
    if (ifcheck) {
      checkList.push(val);
      if (checkList.length === data.length) {
        this.setState({
          ifCheckAll: true
        })
      }
    } else {
      for (var n in checkList) {
        if (val === checkList[n]) {
          checkList.splice(n, 1);
        }
      }
      if (checkList.length !== data.length) {
        this.setState({
          ifCheckAll: false
        })
      }
    }
    this.setState({
      checkList: checkList
    })
  }
  //全选点击
  checkAllChan(e) {
    this.setState({
      ifCheckAll: e.target.checked,
    })
    var data = this.state.listData;
    if (e.target.checked) {
      var arr = [];
      for (var i in data) {
        arr.push(data[i].ssid);
        this.setState({
          ['check' + data[i].ssid]: true
        })
      }
      this.setState({
        checkList: arr
      })
    } else {
      for (let i in data) {
        this.setState({
          ["check" + data[i].ssid]: false
        })
      }
      this.setState({
        checkList: []
      })
    }
  }
  //列表、视图切换
  viewListChange(type) {
    this.setState({
      ifView: type
    })
  }
  //单项删除
  deleData(id) {
    // console.log(id);
    this.setState({
      sureDel: true,
      ifList: false,
      oneCheck: [id]
    })
  }

  /**
   * 远程控制
   */
  // 点击音量按钮
  voiceBtn() {
    this.setState({
      voiceShow: true
    });
  }
  //音量控制
  sliderChan(val) {
    // console.log(val);
    this.setState({
      ifVoiceVal: val
    })
  }
  //远程控制各选项
  voiceSure(ifRel) {
    switch (ifRel) {
      case 'voiceON':
        this.setState({
          voiceVal: 1,
          ifVoiceVal: 1
        });
        this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, 0);
        // this.requestContrlMemory(this.state.checkList, 1, this.state.screenVal, this.state.powerVal);
        break;
      case 'voiceOFF':
        this.setState({
          voiceVal: 0,
          ifVoiceVal: 0
        });
        this.requestContrlMemory(this.state.checkList, 0, this.state.screenVal, 0);
        // this.requestContrlMemory(this.state.checkList, 0, this.state.screenVal, this.state.powerVal);
        break;
      case 'OK':
        this.setState({
          voiceShow: false,
          voiceVal: this.state.ifVoiceVal
        });
        this.requestContrlMemory(this.state.checkList, this.state.ifVoiceVal, this.state.screenVal, 0);
        // this.requestContrlMemory(this.state.checkList, this.state.ifVoiceVal, this.state.screenVal, this.state.powerVal);
        break;
      case 'NO':
        this.setState({
          voiceShow: false,
          ifVoiceVal: this.state.voiceVal
        });
        // this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, this.state.powerVal);
        break;
      case 'screenON':
        this.setState({
          screenVal: true
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, true, 0);
        break;
      case 'screenOFF':
        this.setState({
          screenVal: false
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, false, 0);
        break;
      case 'powerON':  //重启
        this.setState({
          powerVal: 2
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, 2);
        break;
      case 'powerOFF':
        this.setState({
          powerVal: 1
        });
        this.requestContrlMemory(this.state.checkList, this.state.voiceVal, this.state.screenVal, 1);
        break;
    }
  }
  // 定时开关机modal
  onOff() {
    this.setState({
      onOff: true
    })
  }
  //modal状态改变
  statusChan() {
    this.setState({
      onOff: false
    })
  }
  //分页样式
  itemRender(current, type, originalElement) {
    if (type === 'prev') {
      // if (this.state.pageIndex === 1) {
      //   return <Button disabled>上一页</Button>;
      // } else {
      return <Button>上一页</Button>;
      // }
    } else if (type === 'next') {
      // console.log(current);
      // var max = Math.ceil(this.state.listTotal / this.state.pageSize);
      // var currentPage = current - 1;
      // console.log(max);
      // if (currentPage === max) {
      //   return <Button disabled>下一页</Button>;
      // } else {
      return <Button>下一页</Button>;
      // }
    }
    return originalElement;
  }

  render() {
    // console.log(this.state.checkList);
    // console.log(this.state.ifCheckAll);
    const content = (
      <div>
        {/* 声音 */}
        <div className='mj-wcc-voice'>
          <span>声音：</span>
          <Button className='mj-wcc-btn mj-wcc-btn1' onClick={() => this.voiceSure('voiceON')}>
            <SVG type={'voice'}></SVG>
            <span>打开</span>
          </Button>
          <Button className='mj-wcc-btn mj-wcc-btn2' onClick={() => this.voiceSure('voiceOFF')}>
            <SVG type={'mute'}></SVG>
            <span>关闭</span>
          </Button>
          <Button className={this.state.voiceShow ? 'mj-wcc-ifvoiceShow' : 'mj-wcc-btn mj-wcc-btn3'}
            onClick={this.voiceBtn}>
            <SVG type={'adjust'}></SVG>
            <span>音量</span>
          </Button>
          <div className={this.state.voiceShow ? 'mj-wcc-voiceContral cjy-clearfix' : 'mj-wcc-ifvoiceShow'}>
            <Slider
              max={1}
              step={0.1}
              defaultValue={this.state.voiceVal}
              value={this.state.ifVoiceVal}
              tipFormatter={() => { return `${this.state.ifVoiceVal * 100}%`; }}
              onChange={this.sliderChan} />
            <span className='mj-wcc-voiceShow'>{`${this.state.ifVoiceVal * 100}%`}</span>
            <Button className='mj-wcc-okBtn' onClick={() => this.voiceSure('OK')}>确定</Button>
            <Button className='mj-wcc-cancelBtn' onClick={() => this.voiceSure('NO')}>取消</Button>
          </div>
        </div>
        {/* 屏幕 */}
        <div className='mj-wcc-screen'>
          <span>屏幕：</span>
          <Button className='mj-wcc-btn mj-wcc-btn1' onClick={() => this.voiceSure('screenON')}>
            <SVG type={'monitor'}></SVG>
            <span>打开</span>
          </Button>
          <Button className='mj-wcc-btn mj-wcc-btn2' onClick={() => this.voiceSure('screenOFF')}>
            <SVG type={'monitor2'}></SVG>
            <span>关闭</span>
          </Button>
        </div>
        {/* 电源 */}
        <div className='mj-wcc-power'>
          <span>电源：</span>
          <Button className='mj-wcc-btn mj-wcc-btn1' onClick={() => this.voiceSure('powerON')}>
            <SVG type={'reboot'}></SVG>
            <span>重启</span>
          </Button>
          <Button className='mj-wcc-btn mj-wcc-btn2' onClick={() => this.voiceSure('powerOFF')}>
            <SVG type={'shutdown'}></SVG>
            <span>关机</span>
          </Button>
        </div>
      </div>
    );
    return (
      <div className='mj-wcc-content'>
        {/* 头部 */}
        <div className='mj-wcc-contentTop'>
          <p>状态监管</p>
          <div className='mj-wcc-num'>
            <span
              onClick={() => this.onOffCli(0)}
              className={this.state.type === 0 ? 'mj-wcc-all mj-wcc-allLight' : 'mj-wcc-all'}>全部</span>
            <div
              className={this.state.type === 2 ? 'mj-wcc-allLight' : ''}
              onClick={() => this.onOffCli(2)}>
              <Badge status='success' text={`在线 ${this.props.onlineNumber}`} />
            </div>
            <div
              className={this.state.type === 1 ? 'mj-wcc-allLight' : ''}
              onClick={() => this.onOffCli(1)}>
              <Badge status='default' text={`离线 ${this.props.offlineNumber}`} />
            </div>
          </div>
          <div className='mj-wcc-search cjy-clearfix'>
            <Select
              className='mj-wcc-sele'
              defaultValue='全部版本'
              onChange={this.versionChange}>
              {
                this.state.versionData.map((item) => (
                  <Option value={item.id} key={item.id}>{item.name}</Option>
                ))
              }
            </Select>
            <Search
              className='mj-wcc-inp'
              placeholder='班级、场所、IP、终端标识'
              enterButton='搜索'
              size='large'
              onSearch={this.keySearch} />
          </div>
        </div>
        {/* 表格 */}
        <div className='cjy-clearfix'>
          {/* 操作栏 */}
          <div className={!this.state.checkList.length ? 'mj-wcc-oprate mj-wcc-dis' : 'mj-wcc-oprate'}>
            <div className='mj-wcc-choiceAll'>
              <Checkbox onChange={this.checkAllChan} checked={this.state.ifCheckAll}>全选</Checkbox>
            </div>
            {
              !this.state.checkList.length
                ?
                (
                  <div className='mj-wcc-oprateDiv'>
                    <Button disabled onClick={this.batchDele}>批量删除</Button>
                    <Popover content={content} title="" placement="bottom" trigger="click">
                      <Button className='' disabled type="primary">批量远程控制</Button>
                    </Popover>
                    <Button disabled onClick={this.onOff}>定时开关机</Button>
                  </div>
                )
                :
                (
                  <div className='mj-wcc-oprateDiv'>
                    <Button onClick={this.deleCli} >批量删除</Button>
                    <Popover content={content} title="" placement="bottom" trigger="click">
                      <Button type="primary">批量远程控制</Button>
                    </Popover>
                    <Button onClick={this.onOff}>定时开关机</Button>
                    <WatClaTabOnOff
                      checkList={this.state.checkList}
                      statusChan={this.statusChan}
                      status={this.state.onOff} ></WatClaTabOnOff>
                  </div>
                )
            }
            <div className='mj-wcc-orderType'>
              <Select
                className='mj-wcc-order'
                defaultValue={1}
                onChange={this.orderChange}>
                <Option value={1}>默认</Option>
                <Option value={2}>按年级</Option>
                <Option value={3}>按场所</Option>
              </Select>
              <Button
                className={this.state.ifView ? 'mj-wcc-view mj-wcc-light' : 'mj-wcc-view'}
                onClick={() => this.viewListChange(true)}>
                <SVG type={'view'}></SVG>
                <span className='mj-wcc-viewIcon'>视图</span>
              </Button>
              <Button
                className={!this.state.ifView ? 'mj-wcc-list mj-wcc-light' : 'mj-wcc-list'}
                onClick={() => this.viewListChange(false)}>
                <SVG type={'list'}></SVG>
                <span className='mj-wcc-viewIcon'>列表</span>
              </Button>
            </div>
          </div>
          {/* 列表 */}
          <div className={this.state.ifView ? 'mj-wcc-listContent cjy-clearfix' : 'mj-wcc-viewContent cjy-clearfix'}>
            {
              this.state.listData.length
                ?
                (
                  this.state.ifView
                    ?
                    (
                      this.state.listData.map((item, index) => (
                        <div key={index} className='mj-wcc-viewCon'>
                          <WatClaViewListCon
                            data={item}
                            listCli={this.listCli}
                            ifChecked={this.state["check" + item.ssid]}
                            deleData={this.deleData}></WatClaViewListCon>
                        </div>
                      ))
                    )
                    :
                    (
                      this.state.listData.map((item, index) => (
                        <WatClaTabListCon
                          key={index}
                          data={item}
                          listCli={this.listCli}
                          ifChecked={this.state["check" + item.ssid]}
                          deleData={this.deleData}></WatClaTabListCon>
                      ))
                    )
                )
                :
                <div className='mj-wcc-noneData'>
                  <div></div>
                  <span>暂无相关内容</span>
                </div>
            }
          </div>
        </div>
        {/* 分页 */}
        <div className={this.state.listData.length ? "mj-wcc-page" : "mj-wcc-nonePage"}>
          <div className='mj-wcc-pageCon'>
            <span>{`共${this.state.listTotal}条数据，每页`}</span>
            <Select
              className='mj-wcc-pageSele'
              defaultValue={20}
              onChange={this.pageSizeChange}>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
              <Option value={100}>100</Option>
            </Select>
            条
          </div>
          <Pagination
            simple
            defaultPageSize={20}
            pageSize={this.state.pageSize}
            current={this.state.pageIndex}
            total={this.state.listTotal}
            onChange={this.pageindexChange}
            itemRender={this.itemRender}></Pagination>
        </div>
        <WatClaDel
          sureDel={this.state.sureDel}
          ifList={this.state.ifList}
          batchDele={this.batchDele}></WatClaDel>
      </div>
    );
  }
}