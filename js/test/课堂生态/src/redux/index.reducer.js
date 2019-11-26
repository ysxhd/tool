/*
 * @Author: lxx 
 * @Date: 2018-08-27 22:42:24 
 * @Last Modified by: zhangning
 * @Last Modified time: 2018-09-12 18:43:52
 */

/**
 * 导出所有的reducers
 */
import { combineReducers } from 'redux';

// lxx
import { studentReducer } from './lxx.student.reducer';

// zn=
import { znSystemReducer } from './zn.systemreducer';

//zq
import { menuReducer } from './zq.menu.reducer';
import { initReducer } from './zq-initComp-reducer';

export default combineReducers({
    studentReducer,
    menuReducer,
    initReducer,
    znSystemReducer
});