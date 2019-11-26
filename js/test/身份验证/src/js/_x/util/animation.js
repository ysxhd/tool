/*
 * @Author: Summer
 * @Date: 2017-08-02 11:29:16
 * @Last Modified by: SummerSKW
 * @Last Modified time: 2017-12-29 13:56:39
 * 动画循环
 */
import {
  requestAnimationFrame
} from '../env/env';
import _ from 'lodash';

var tasks = [];
var running = false;
var startTime = 0;
/**
 * 添加动画或计时任务
 * @param   {number}  [delay=1]        持续时长或计时长度，单位秒，最小值为0.1秒，默认1秒
 * @param   {boolean} [isseries=false] 是否连续执行
 * @param   {fun}     todo             回调函数
 * @param   {boolean}     [isloop=false]   是否循环调用
 * @returns {boolean} 任务是否添加成功
 */
export const add = function (delay, isseries, todo, isloop) {
  if (typeof todo === 'function') {
    delay = delay || 1;
    delay = Math.max(delay, 0.1);
    delay = delay * 1000;
    isseries = isseries || false;
    isloop = isloop || false;
    var key = newkey();
    var task = {
      delay: delay,
      todo: todo,
      isseries: isseries,
      isloop: isloop,
      startTime: startTime,
      key: key
    };
    tasks.push(task);
    return key;
  } else {
    return 0;
  }
};

export const remove = function(key){
  if(typeof key === 'number'){
    if(key > 0){
      _.remove(tasks, function(task){
        return task.key === key;
      });
    }else{
      tasks = [];
    }
  }
};
/**
 * 启动循环
 */
export const start = function () {
  document.addEventListener('unload', function () {
    running = false;
    tasks = [];
  });
  running = true;
  requestAnimationFrame(anloop);
};
/**
 * 停止循环
 */
export const stop = function () {
  running = false;
  tasks = [];
};
/**
 * 动画循环执行主体方法
 */
function anloop(timestamp) {
  if (running) {
    startTime = timestamp;
    requestAnimationFrame(anloop);
    var shifts = [];
    tasks.forEach(function (item, index) {
      var delay = timestamp - item.startTime, over;
      if (delay >= item.delay) {
        item.todo(item.startTime, timestamp);
        if (over === false || !item.isloop) {
          shifts.push(item);
        } else {
          item.startTime = startTime;
        }
      } else if (item.isseries) {
        item.todo(item.startTime, timestamp);
        if (over === false) {
          shifts.push(item);
        }
      }
    });
    if (shifts.length) {
      tasks = _.difference(tasks, shifts);
    }
  }
}

function newkey(){
  var newkey = _.random(1, Number.MAX_VALUE);
  while(_.find(tasks, {key: newkey})){
    newkey = _.random(1, Number.MAX_VALUE);
  }
  return newkey;
}

export default { add, remove, start, stop };