/*
 * @Author: SummerSKW 
 * @Date: 2017-12-29 13:42:51 
 * @Last Modified by: SummerSKW
 * @Last Modified time: 2017-12-29 13:58:28
 * Number对象方法扩展
 */

/**
 * 将数字转换成中文文本
 * @param   {Number} number      需要转换的数字
 * @param   {Boolean} bIsCapital 是否中文大写
 * @returns {String}  转换后的字符串
 */
const toChinese = function (number, bIsCapital) {
  var str = number + '';
  var len = str.length - 1;
  var idxs = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿'
  ];
  var num;
  if (bIsCapital) {
    num = [
      '零',
      '壹',
      '贰',
      '叁',
      '肆',
      '伍',
      '陆',
      '柒',
      '捌',
      '玖'
    ];
  } else {
    num = [
      '零',
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九'
    ];
  }
  return str.replace(/([1-9]|0+)/g, function ($, $1, idx, full) {
    var pos = 0;
    if ($1[0] !== '0') {
      pos = len - idx;
      if (idx === 0 && $1[0] === 1 && idxs[pos] === '十') {
        return idxs[pos];
      }
      return num[$1[0]] + idxs[pos];
    } else {
      var left = len - idx;
      var right = left + $1.length;
      if (Math.floor(right / 4) - Math.floor(left / 4) > 0) {
        pos = left - left % 4;
      }
      if (pos) {
        return idxs[pos] + num[$1[0]];
      } else if (idx + $1.length >= len) {
        return '';
      } else {
        return num[$1[0]];
      }
    }
  })
};
/**
 * 格式化字节大小字符串（精确到小数点后两位）
 * @param   {Number} number    需要转换的数字
 * @param   {Boolean} baseUnit 基准单位，默认为K
 * @returns {String}  转换后的字符串
 */
const formatSize = function (number, baseUnit) {
  baseUnit = baseUnit || '';
  baseUnit = baseUnit.toUpperCase();
  var units = ['', 'K', 'M', 'G', 'T'],
    cnt = 0,
    size = number,
    index = 0;
  while (size > 1024) {
    size = size / 1024;
    cnt++;
  }
  units.forEach(function (item, idx) {
    if (item === baseUnit) {
      index = idx;
    }
  });
  return (size.toFixed(2) + units[index + cnt] + 'B');
};

export default { toChinese, formatSize }