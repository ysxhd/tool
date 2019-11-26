/*
 * @Author: SummerSKW 
 * @Date: 2017-12-28 10:36:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-02-07 11:08:01
 * 菜单项配置
 */

/**
 * 管理员菜单项
 */
export const ADMINMENU = [{
  group: 'work',
  text: '工作空间',
  icon: 'plane',
  children: [{
    key: 'publish',
    text: '日常发布',
    children: [{
      key: 'notice',
      icon: 'bell',
      text: '校园通知'
    }, {
      key: 'news',
      icon: 'news',
      text: '校园新闻'
    }, {
      key: 'activities',
      icon: 'gift',
      text: '校园活动'
    }, {
      key: 'story',
      icon: 'windmill',
      text: '风采事记'
    }, {
      key: 'honor',
      icon: 'honor',
      text: '荣誉公布'
    }, {
      key: 'features',
      icon: 'house',
      text: '校园风貌'
    }, {
      key: 'websites',
      icon: 'earth',
      text: '常用网站'
    }]
  }]
}, {
  group: 'mobile',
  text: '终端管理',
  icon: 'mobile',
  children: [{
    key: 'watching',
    text: '状态监管',
    children: [{
      key: 'class',
      icon: 'mobile',
      text: '智慧班牌'
    }, {
      key: 'school',
      icon: 'mobile',
      text: '智慧校牌',
      disable: true
    },]
  }, {
    key: 'upgrade',
    text: '在线升级',
    children: [{
      key: 'class',
      icon: 'mobile',
      text: '智慧班牌'
    }, {
      key: 'school',
      icon: 'mobile',
      text: '智慧校牌',
      disable: true
    },]
  }, {
    key: 'settings',
    text: '参数设置',
    children: [{
      key: 'class',
      icon: 'mobile',
      text: '智慧班牌'
    }, {
      key: 'school',
      icon: 'mobile',
      text: '智慧校牌',
      disable: true
    },]
  }]
}, {
  group: 'resource',
  text: '资源管理',
  icon: 'supervise',
  children: [{
    key: 'mine',
    text: '我的资源',
    children: [{
      key: 'cloud',
      icon: 'cloud',
      text: '我的云盘'
    }, {
      key: 'collection',
      icon: 'collection',
      text: '我的收藏'
    },]
  }]
}, {
  group: 'settings',
  text: '系统设置',
  icon: 'gear',
  children: [{
    key: 'auditing',
    text: '审核设置',
  }, {
    key: 'upload',
    text: '文件上传',
    disable: true
  }]
}];