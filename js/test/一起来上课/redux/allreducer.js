import { combineReducers } from "redux";
// 教室管理
import { ClassRoomReducer } from "./classRoom/classRoom.redux";
// 通知管理
import { TableOperatReducer } from "./notic/tableOperat.redux";
// 意见分析
import { TableAdvise_reducer } from "./analysis/advise.redux";
// 使用情况
import { UseMatter_reducer } from "./analysis/use.redux";
//  场所
import { placeReducer } from "./place/place.redux";
export const allReducer = combineReducers({
  ClassRoomReducer,
  TableOperatReducer,
  TableAdvise_reducer,
  placeReducer,
  UseMatter_reducer
});
