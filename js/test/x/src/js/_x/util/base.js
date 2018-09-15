/*
 * @Author: Summer
 * @Date: 2017-08-02 09:29:31
 * @Last Modified by: SummerSKW
 * @Last Modified time: 2017-12-29 14:05:12
 * 基础功能扩展
 */

/**
 * 为类设置属性（和方法）
 * @param   {number}   nMask     属性各项配置，四位二进制数，依次为accessor descriptor（访问器）,writable,configurable,enumerable，可是数字或字符串
 *                             可用的配置项
 *                             0 : readonly data descriptor - not configurable, not enumerable (0000).
 *                             1 : readonly data descriptor - not configurable, enumerable (0001).
 *                             2 : readonly data descriptor - configurable, not enumerable (0010).
 *                             3 : readonly data descriptor - configurable, enumerable (0011).
 *                             4 : writable data descriptor - not configurable, not enumerable (0100).
 *                             5 : writable data descriptor - not configurable, enumerable (0101).
 *                             6 : writable data descriptor - configurable, not enumerable (0110).
 *                             7 : writable data descriptor - configurable, enumerable (0111).
 *                             8 : accessor descriptor - not configurable, not enumerable (1000).
 *                             9 : accessor descriptor - not configurable, enumerable (1001).
 *                             10 : accessor descriptor - configurable, not enumerable (1010).
 *                             11 : accessor descriptor - configurable, enumerable (1011).
 *                             Note: If the flag 0x8 is setted to "accessor descriptor" the flag 0x4 (writable)
 *                             will be ignored. If not, the fSet argument will be ignored.
 * @param   {object}   oObj      接收属性的对象
 * @param   {string}   sKey      属性名称
 * @param   {object}   vVal_fGet 属性值或者geter访问器
 * @param   {function} fSet      （可选）seter访问器
 * @returns {object}   被设置属性/方法的对象本上
 */
const setProperty = function (nMask, oObj, sKey, vVal_fGet, fSet) {
  var oDesc = {};
  if (typeof nMask === "string") {
    nMask = parseInt(nMask, 2);
  }
  if (nMask & 8) {
    // accessor descriptor
    if (vVal_fGet) {
      oDesc.get = vVal_fGet;
    }
    if (fSet) {
      oDesc.set = fSet;
    }
  } else {
    // data descriptor
    if (arguments.length > 3) {
      oDesc.value = vVal_fGet;
    }
    oDesc.writable = Boolean(nMask & 4);
  }
  oDesc.enumerable = Boolean(nMask & 1);
  oDesc.configurable = Boolean(nMask & 2);
  Object.defineProperty(oObj, sKey, oDesc);
  return oObj;
};

export default { setProperty }