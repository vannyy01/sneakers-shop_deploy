import {combineReducers} from "redux";
import {authReducer} from "./authReducer";
import {goodsReducer} from "./goodsReducer";
import {usersReducer} from "./usersReducer";

export default combineReducers({
    auth: authReducer,
    goods: goodsReducer,
    users: usersReducer
});