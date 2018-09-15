/*
 * @Author: LEAN 
 * @Date: 2017-08-09 10:13:20 
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-09-03 18:23:27
 * 公共函数库
 */

//url跳转
String.prototype.go = function () {
  let baseUrl = readDataFromSessionStorage('baseUrl');
  let needGo = this;
  window.open(baseUrl + needGo)
}


//字符串截取函数
String.prototype.sliceWords = function (n) {
  if (typeof n != "number") {
    return false;
  }
  var s = this.toString();
  if (s.length <= n) {
    return s;
  } else {
    s = s.slice(0, n);
    s += "..."
    return s
  }
}

//文件大小转换
Number.prototype.formatSize = function (baseUnit) {
  baseUnit = baseUnit || 'K';
  baseUnit = baseUnit.toUpperCase();
  var units = ['K', 'M', 'G', 'T'],
    cnt = 0,
    size = this,
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
  return (size.toFixed(1) + units[index + cnt] + 'B');
}

// 分数格式化
Number.prototype.formatPoint = function () {
  let tmp = this + "";
  if (tmp.length == 1) {
    tmp += ".01"
  } else if (tmp.length == 3) {
    tmp += "1"
  }
  let cc = tmp.slice(0, 1);
  let rate = tmp.slice(2, 4);
  if (rate >= 75) {
    return (cc - 0) + 1
  } else if (rate >= 25 && rate < 75) {
    return (cc + ".5") - 0
  } else {
    return (cc) - 0
  }
}

//时间戳格式化
Number.prototype.formatTime = function () {
  let formateType = arguments.length == 0 ? true : arguments[0];
  let sourceTime = new Date(this);
  let returnValue = '';
  returnValue = sourceTime.getFullYear()
    + '-'
    + ((sourceTime.getMonth() + 1) >= 10
      ?
      (sourceTime.getMonth() + 1)
      :
      ('0' + (sourceTime.getMonth() + 1)))
    + '-'
    + (sourceTime.getDate() >= 10
      ?
      sourceTime.getDate()
      :
      '0' + sourceTime.getDate()
    );
  if (!formateType) {
    returnValue += ' ' +
      (sourceTime.getHours() >= 10
        ?
        sourceTime.getHours()
        :
        '0' + sourceTime.getHours()
      )
      + ':'
      + (sourceTime.getMinutes() >= 10
        ?
        sourceTime.getMinutes()
        :
        '0' + sourceTime.getMinutes()
      );
  }
  return returnValue;
}

//获取从某一年开始计算到当前日期值的周数
Date.prototype.getWeekFromYear = function (nYear, nWeekStart) {
  nWeekStart = (nWeekStart || 1) - 0;
  if (isNaN(nWeekStart) || nWeekStart > 6)
    nWeekStart = 1;
  if (!nYear) {
    nYear = this.getFullYear();
  }
  var dFirstDay = new Date(nYear, 0, 1);
  var nFirstWeekDays = 7 - dFirstDay.getDay() + nWeekStart;
  var nDayOfYear = (((new Date(this.getFullYear(), this.getMonth(), this.getDate())) - dFirstDay) / (24 * 3600 * 1000)) + 1;
  return Math.ceil((nDayOfYear - nFirstWeekDays) / 7) + 1;
};

//文件后缀判断
String.prototype.getSuffix = function () {
  let s = this.toString();
  if (s.indexOf('.') > -1) {
    let suffix = s.slice(s.lastIndexOf('.') + 1).toLowerCase();
    return suffix;
  } else {
    return 'other';
  }
}

//将数字转换成中文文本
Number.prototype.toChinese = function (bIsCapital) {
  var str = this + '';
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
    if ($1[0] != '0') {
      pos = len - idx;
      if (idx == 0 && $1[0] == 1 && idxs[pos] == '十') {
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

//判断变量类型的通用方法
const valueTypeCheck = (v) => {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}

//缓存数据读取
const sessionSave = function () {
  /*2017-12-04 
    为了解决不能在新页面打开播放页的情况，将sessionStorage修改为localStorage，并添加退出清除缓存逻辑；
    修改：改回sessionStorage，以免造成同时打开两个页面互相干扰的问题
  */
  let g = {
    systeam: {
      sessionPrefix: "_jyzy_"
    }
  }
  let prefix = g.systeam.sessionPrefix;
  let l = localStorage,
    s = sessionStorage;
  if (arguments.length == 1) {
    let pr = arguments[0];
    if ('object' != valueType(pr)) {
      throw new Error('sava data error:"The parame must be a key-vlaue or a object!"')
    } else {
      for (let k in pr) {
        let newk = prefix + k;
        s.setItem(newk, JSON.stringify(pr[k]));
      }
    }
  } else if (arguments.length == 2) {
    let newk = prefix + arguments[0],
      v = arguments[1];
    s.setItem(newk, JSON.stringify(v));
  } else {
    throw new Error('sessionStorage or localStorage sava data error:"The parame must be a key-vlaue or a object!"')
  }
}
const sessionRead = function (k) {
  let l = localStorage,
    s = sessionStorage;


  let g = {
    systeam: {
      sessionPrefix: "_jyzy_"
    }
  }

  let newk = g.systeam.sessionPrefix + k;
  return newk === null ? undefined : JSON.parse(s.getItem(newk));
}

//阿拉伯数字转化为汉字
const toChinese = function (Num) {
  for (var i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(",", "")//替换Num中的“,”
    Num = Num.replace(" ", "")//替换Num中的空格
  }
  if (isNaN(Num)) { //验证输入的字符是否为数字
    //alert("请检查小写金额是否正确");
    return;
  }
  //字符处理完毕后开始转换，采用前后两部分分别转换
  var part = String(Num).split(".");
  var newchar = "";
  //小数点前进行转化
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      //alert("位数过大，无法计算");
      return "";
    }//若数量超过拾亿单位，提示
    var tmpnewchar = ""
    var perchar = part[0].charAt(i);
    switch (perchar) {
      case "0": tmpnewchar = "零" + tmpnewchar; break;
      case "1": tmpnewchar = "一" + tmpnewchar; break;
      case "2": tmpnewchar = "二" + tmpnewchar; break;
      case "3": tmpnewchar = "三" + tmpnewchar; break;
      case "4": tmpnewchar = "四" + tmpnewchar; break;
      case "5": tmpnewchar = "五" + tmpnewchar; break;
      case "6": tmpnewchar = "六" + tmpnewchar; break;
      case "7": tmpnewchar = "七" + tmpnewchar; break;
      case "8": tmpnewchar = "八" + tmpnewchar; break;
      case "9": tmpnewchar = "九" + tmpnewchar; break;
    }
    switch (part[0].length - i - 1) {
      case 0: tmpnewchar = tmpnewchar; break;
      case 1: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
      case 2: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
      case 3: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
      case 4: tmpnewchar = tmpnewchar + "万"; break;
      case 5: if (perchar != 0) tmpnewchar = tmpnewchar + "十"; break;
      case 6: if (perchar != 0) tmpnewchar = tmpnewchar + "百"; break;
      case 7: if (perchar != 0) tmpnewchar = tmpnewchar + "千"; break;
      case 8: tmpnewchar = tmpnewchar + "亿"; break;
      case 9: tmpnewchar = tmpnewchar + "十"; break;
    }
    newchar = tmpnewchar + newchar;
  }
  //替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
    newchar = newchar.replace("零亿", "亿");
    newchar = newchar.replace("亿万", "亿");
    newchar = newchar.replace("零万", "万");
    newchar = newchar.replace("零零", "零");
  }
  //替换以“一十”开头的，为“十”
  if (newchar.indexOf("一十") == 0) {
    newchar = newchar.substr(1);
  }
  //替换以“零”结尾的，为“”
  if (newchar.lastIndexOf("零") == newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
}

//通用下载函数
const downloadFile = () => {
  /**
   * 2018年08月07日 下载函数重构
   */

  /**
   * fType: 0 录播资源  1 普通资源
   * fQuality: 'pt' 普通文件   'un' 未知清晰度  'hd/ld' 高标清
   */

}

//上传文件
const uploadFile = () => {
  /**
   * 2018年08月07日重构
   */
}


/**
 * 
 * @param {接收一个字符串} str 
 */
const encodeUnicode = function (str) {
  if (typeof str === 'string') {
    var repStr = '';
    for (var i = 0; i < str.length; i++) {
      var thisUnicode = str.charCodeAt(i).toString(16)
      while (thisUnicode.length < 4) {
        thisUnicode = '0' + thisUnicode;
      }
      thisUnicode = '\\u' + thisUnicode;
      repStr += thisUnicode;
    }
    return repStr;
  } else {
    // console.log('入参格式有误')
  }
}


const decodeUnicode = function (str) {
  if (typeof str === 'string') {
    return eval("'" + str + "'")
  } else {
    // console.log('入参格式有误')
  }
}



export  default {
  valueTypeCheck,
  sessionSave,
  sessionRead ,
  toChinese,
  downloadFile,
  uploadFile,
  encodeUnicode,
  decodeUnicode
};
