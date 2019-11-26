/*
 * @Author: lxx 
 * @Date: 2018-01-12 17:12:52 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-03-09 16:00:30
 * 失败/成功提示框
 */
import React, { Component } from 'react';
import { Modal } from 'antd';
import './../css/modal.css';


/**
 * 操作成功提示弹窗
 * @param {* 成功提示内容} content 
 * @param {* 计时} time 
 */
export function success(content, time){
    let cnt = content || '操作成功';
    let t = typeof time === 'undefined' ? 3000 : time;
    let eng = /^[A-Za-z]+$/;
    let wid = 145;
    if(cnt){
        let len = cnt.length;
        if(eng.test(cnt)){
            len <= 11 ?
            wid = 145
            :
            wid = 8 * len + 80;
        } else {
            len <= 4 ?
            wid = 145
            :
            wid = 18 * len + 80;
        }
    }
    var modal = Modal.success({
        className: 'lxx-g-infoDia',
        width: wid,
        title: '',
        content: cnt,
        maskClosable: true,
        okText: '',
        cancelText: '',
    })
    if(t > 0){
        setTimeout(function() {
            modal.destroy();
        }, t);
    }
    return modal;
}

/**
 * 操作失败提示弹窗
 * @param {* 失败提示内容} content 
 * @param {* 计时} time 
 */
export function error(content, time){
    let cnt = content || '操作失败';
    let t = typeof time === 'undefined' ? 3000 : time;
    let eng = /^[A-Za-z]+$/;
    let wid = 145;
    if(cnt){
        let len = cnt.length;
        if(eng.test(cnt)){
            len <= 11 ?
            wid = 145
            :
            wid = 8 * len + 80;
        } else {
            len <= 4 ?
            wid = 145
            :
            wid = 18 * len + 80
        }
    }
    var modal = Modal.error({
        className: 'lxx-g-infoDia',
        width: wid,
        iconType: 'exclamation-circle',
        title: '',
        content: cnt,
        maskClosable: true,
        okText: '',
        cancelText: '',
    })
    if(t > 0){
        setTimeout(function() {
            modal.destroy();
        }, t);
    }
    return modal;
}

/**
 * 信息确认提示弹窗
 * @param {* 标题} title 
 * @param {* 提示内容} content 
 * @param {* 样式类型} type 
 * @param {* 弹窗宽度} width 
 * @param {* 确认按钮文字} okText 
 * @param {* 点击确认按钮回调} fnOk 
 * @param {* 取消按钮文字} cancelText 
 * @param {* 点击取消按钮回调} fnCancel 
 */
export function confirmDia(obj){
    let til = obj.title || '操作提示';
    let cnt = obj.content || '你确定要进行该操作吗？';
    let okTe = obj.okText || '确定';
    let calTe = obj.cancelText || '取消';
    let wid = obj.width || 400;
    Modal.confirm({
        title: cnt,
        content: til,
        iconType: 'info-circle-o',
        className: !obj.className ? 'lxx-g-admConDia': 'lxx-g-stuConDia',
        okText: okTe,
        width: wid,
        onOk: function() {
            if(typeof obj.fnOK === 'function'){
                obj.fnOK();
            }
        },
        cancelText: calTe,
        onCancel: function() {
            if(typeof obj.fnCancel === 'function'){
                obj.fnCancel();
            }
        }
    })
}

/**
 * token过期提示回调弹窗
 */
export function tokenDia(obj){
    let til = obj.title || '操作提示';
    let cnt = obj.content || '你确定要进行该操作吗？';
    let okTe = obj.okText || '确定';
    let wid = obj.width || 400;
    Modal.confirm({
        closable:false,
        title: cnt,
        content: til,
        iconType: 'info-circle-o',
        className: !obj.className ? 'zn-tokenFirm': 'lxx-g-stuConDia',
        okText: okTe,
        width: wid,
        onOk: function() {
            if(typeof obj.fnOK === 'function'){
                obj.fnOK();
            }
        }
    })
}