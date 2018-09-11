import {combineReducers} from "redux";
import {authReducer} from "./authReducer";
import {cartReducer} from "./cartReducer";
import {goodsReducer} from "./goodsReducer";
import {usersReducer} from "./usersReducer";

export default combineReducers({
    auth: authReducer,
    cartItems: cartReducer,
    goods: goodsReducer,
    users: usersReducer,
});