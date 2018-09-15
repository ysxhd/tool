/*
 * @Author: summer 
 * @Date: 2018-01-22 14:45:03 
 * @Last Modified by: summer
 * @Last Modified time: 2018-01-22 16:27:36
 * 颜色处理工具
 */

/**
 * 将16进制颜色字符串转换为三个数组数值
 * @param {String} hexStr 16进制颜色字符串，如 #121212 支持短格式 #fff 
 */
export const rgbToHex = function (hexStr) {
  return hexStr.length === 4 ?
    hexStr.substr(1).split('').map(function (s) {
      return 0x11 * parseInt(s, 16);
    })
    : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
      return parseInt(s, 16);
    });
}

/**
 * 将十进制rgb值转换为字符串 #ffffff
 * @param {Array} hex rgb值数组 
 */
function hexToRgb(hex) {
  var hex = ((hex[0] << 16) | (hex[1] << 8) | hex[2]).toString(16);
  return '#' + new Array(Math.abs(hex.length - 7)).join("0") + hex;
}

/**
 * 取两个颜色值的中间值
 * @param {String} color1 颜色字符串 #ffffff
 * @param {String} color2 颜色字符串 #ffffff
 */
export const middleRgb = function (color1, color2) {
  var d1 = rgbToHex(color1),
    d2 = rgbToHex(color2);

  var rgb = d1.map((c1, index) => {
    return Math.floor((c1 + d2[index]) / 2);
  });

  return hexToRgb(rgb);
}

export default { rgbToHex, hexToRgb, middleRgb }