/**
 *角色权限设置 
 * @param {机构类型} typeID 
 */
export const GetMenu = function (typeID) {

  //不是考点情况下，隐藏"人工验证"
  if (typeID !== "4" && typeof typeID !== 'undefined') {
    for (let i = 0; i < MENUCONFIG.length; i++) {
      if (MENUCONFIG[i].key === 'validate') {
        for (var j = 0; j < MENUCONFIG[i].children.length; j++) {
          if (MENUCONFIG[i].children[j].key === 'manconfirm') {
            MENUCONFIG[i].children.splice(j, 1)
          }
        }
      }
    }
  }

  return MENUCONFIG
}

export const MENUCONFIG = [

  /**
   * 管理员菜单项
   */
  {
    key: 'platoverview',
    name: '平台总览',
    icon: 'overview',
    children: []
  }, {
    key: 'msgstatic',
    name: '信息统计',
    icon: 'infCount',
    children: [
      {
        key: 'msgdevice',
        name: '设备信息统计',
      },
      {
        key: 'msgcollect',
        name: '采集信息统计',
      },
      {
        key: 'msgready',
        name: '数据准备统计',
      }
    ],
  }, {
    key: 'validate',
    name: '验证管理',
    icon: 'validateManage',
    children: [
      {
        key: 'valstatic',
        name: '验证统计',
      },
      {
        key: 'manconfirm',
        name: '人工确认',
      },
    ],
  }];