import { combineReducers } from "redux";
import dataAnalyzer from "./dataAnalyzer";

const rootReducer = combineReducers({
  showdata: dataAnalyzer,
});

export default rootReducer;
