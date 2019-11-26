/*
 * @Author: Summer
 * @Date: 2017-08-01 17:01:55
 * @Last Modified by: SummerSKW
 * @Last Modified time: 2017-12-29 14:03:23
 * 事件统一
 */
export const Observer = window.MutationObserver || window.WebKitMutationObserver;
export const requestAnimationFrame = window.requestAnimationFrame || function (fn) {
    return setTimeout(fn, 1000 / 60);
};

export const loaded = 'loaded.base.xt';

var hasTouchEvents = 'ontouchstart' in window;
var hasPointerEvents = window.PointerEvent;
export const hasPromise = 'Promise' in window;
export const hasTouch = 'ontouchstart' in window || window.DocumentTouch || (navigator.msPointerEnabled && navigator.msMaxTouchPoints); // IE 10 || navigator.pointerEnabled && navigator.maxTouchPoints; // IE >=11

export const pointerDown = !hasTouch ? 'mousedown' : `mousedown ${hasTouchEvents ? 'touchstart' : 'pointerdown'}`;
export const pointerMove = !hasTouch ? 'mousemove' : `mousemove ${hasTouchEvents ? 'touchmove' : 'pointermove'}`;
export const pointerUp = !hasTouch ? 'mouseup' : `mouseup ${hasTouchEvents ? 'touchend' : 'pointerup'}`;
export const pointerEnter = hasTouch && hasPointerEvents ? 'pointerenter' : 'mouseenter';
export const pointerLeave = hasTouch && hasPointerEvents ? 'pointerleave' : 'mouseleave';

export const transitionend = prefix('transition', 'transition-end');
export const animationstart = prefix('animation', 'animation-start');
export const animationend = prefix('animation', 'animation-end');

function prefix(name, event) {

    var ucase = classify(name),
        lowered = classify(event).toLowerCase(),
        classified = classify(event),
        element = document.body || document.documentElement,
        names = {
            [`Webkit${ucase}`]: `webkit${classified}`,
            [`Moz${ucase}`]: lowered,
            [`o${ucase}`]: `o${classified} o${lowered}`,
            [name]: lowered
        };

    for (name in names) {
        if (element.style[name] !== undefined) {
            return names[name];
        }
    }
}

function classify(str) {
    return str.replace(/(?:^|[-_/])(\w)/g, (_, c) => c ?
        c.toUpperCase() : '');
}

/**
 * @description 绑定事件到指定的节点对象
 * @author Summer
 * @export on
 * @param {element} el 绑定事件的对象
 * @param {event} type 事件名称
 * @param {function} listener 回调函数
 * @param {Boolean} useCapture 在哪个阶段触发事件回调，一般不用传
 */
export function on(el, type, listener, useCapture) {
    if(document.addEventListener){
        el.addEventListener(type, listener, useCapture || false);
    }else{
        el.attachEvent(type, listener);
    }
}

/**
 * @description 解除事件绑定
 * @author Summer
 * @export off
 * @param {element} el 绑定事件的对象
 * @param {event} type 事件名称
 * @param {function} listener 回调函数
 * @param {Boolean} useCapture 在哪个阶段触发事件回调，一般不用传
 */
export function off(el, type, listener, useCapture) {
    if(document.removeEventListener){
        el.removeEventListener(type, listener, useCapture || false);
    }else{
        el.detachEvent(type, listener);
    }
}

/**
 * @description 绑定只响应一次的事件
 * @author Summer
 * @export one
 * @param {element} el 绑定事件的对象
 * @param {event} type 事件名称
 * @param {function} listener 回调函数
 * @param {Boolean} useCapture 在哪个阶段触发事件回调，一般不用传
 */
export function one(el, type, listener, useCapture) {
    var fn = function(event){
        listener.call(el, event);
        off(el, type, fn, useCapture);
    }
    on(el, type, fn, useCapture);
}

/**
 * @description 触发事件
 * @author Summer
 * @export dispatch
 * @param {any} el 触发事件的DOM对象
 * @param {any} type 事件名称
 */
export function dispatch(el, type, udata){
    var event;
    if(window.Event){
        event = udata ? new CustomEvent(type, {detail: udata}) : new Event(type);
        el.dispatchEvent(event);
    }else{
        event = document.createEventObject();
        event.detail = {udata: udata};
        el.fireEvent(type, event);
    }
}

(function () {
    if (typeof window.CustomEvent === "function") return false;

    function CustomEvent(event, params) {
        params = params || {
        bubbles: false,
        cancelable: false,
        detail: undefined
        };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

export default {on, off, one, dispatch, loaded, hasPromise, hasTouch, pointerDown, pointerMove, pointerUp, pointerEnter, pointerLeave, transitionend, animationstart, animationend}