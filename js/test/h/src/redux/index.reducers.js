/*
 * @Author: junjie.lean
 * @Date: 2018-07-19 15:13:26
 * @Last Modified by: junjie.lean
 * @Last Modified time: 2018-08-26 11:49:17
 */

/**
 *     所有reducers的导出
 */

import { combineReducers } from 'redux';
import {
  hotClassReducer,
  loadingGetUserReducer,
  netDeskReducer,
  screenMaskReducer,
  uploadComReducer,
  netDeskFliterStateReducer,
  cloudDiskDataReducer,
  cloudDiskRemoveStateReducer,
  netDeskFolderEnterReducer,
  systeamConfigReducer,
  screenDrawerReducer,
  loadingGatGloablReducer,
  systeamCloudDiskDataReducer,
  uploadTimelineReducer,
  screenDrawerDataReducer
}
  from './lean.reducers';
// JC.Liu
import { HeaderReducer } from './JC.header.reducer';
import { CheckMan_Reducer } from './JC_b_checkMan.reducer';
import { VideoReducer } from './JC_video.reducer';
// hf
import { YearTermWeekReducer } from './mc_YearTermWeek.reducer';
import { SubClassReducer } from './mc_SubClass.reducer';
import { MmSubClassReducer } from './mm_SubClass.reducer';
import { timeTableReducer } from './mc_Table.reducer';
import { B_TacherClassManReducer } from './b_teacherClassMan.reducer';
import { B_TacherClassManDetailReducer } from './b_teacherClassDetail.reducer';
import { B_ManagerClassManDetaileReducer } from './b_managerClassDetail.reducer';
import { B_ManagerClassManReducer } from './b_managerClassMan.reducer';
import { cancelOrPubCurModalReducer } from './cancelOrPubCurModal.reducer';
import { Tm_timeTableReducer } from './tm_Table.reducer';
import { Mm_timeTableReducer } from './mm_Table.reducer';
import { Tm_sourceTabReducer } from './tm_sourceTab.reducer';
import { Mm_sourceTabReducer } from './mm_sourceTab.reducer';
// lxx
import { publicClass } from './lxx.pubClass.reducer';
import { commentReducer } from './lxx.comment.reducer';
import { downloadReducer } from './lxx.download.reducer';
import { classroomResReducer } from './lxx.classroomRes.reducer';

// xq
import { LivePageReducer } from './xq_livePage.reducer';

export default combineReducers({
  hotClassReducer,
  loadingGetUserReducer,
  netDeskReducer,
  screenMaskReducer,
  cloudDiskDataReducer,
  cloudDiskRemoveStateReducer,
  netDeskFolderEnterReducer,
  netDeskFliterStateReducer,
  uploadComReducer,
  loadingGatGloablReducer,
  uploadTimelineReducer,
  systeamConfigReducer,
  systeamCloudDiskDataReducer,
  screenDrawerReducer,
  screenDrawerDataReducer,
  HeaderReducer,
  YearTermWeekReducer,
  SubClassReducer,
  MmSubClassReducer,
  timeTableReducer,
  B_TacherClassManReducer,
  B_TacherClassManDetailReducer,
  B_ManagerClassManDetaileReducer,
  B_ManagerClassManReducer,
  cancelOrPubCurModalReducer,
  Tm_timeTableReducer,
  Mm_timeTableReducer,
  Tm_sourceTabReducer,
  Mm_sourceTabReducer,
  publicClass,
  CheckMan_Reducer,
  LivePageReducer,
  VideoReducer,
  commentReducer,
  downloadReducer,
  classroomResReducer
});
