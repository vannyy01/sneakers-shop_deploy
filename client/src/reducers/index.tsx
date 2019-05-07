import {combineReducers} from "redux";
import {authReducer} from "./authReducer";
import {cartReducer} from "./cartReducer";
import {goodsReducer} from "./goodsReducer";
import {pollReducer} from "./pollReducer";
import {usersReducer} from "./usersReducer";

export default combineReducers({
    auth: authReducer,
    cartItems: cartReducer,
    goods: goodsReducer,
    poll: pollReducer,
    users: usersReducer,
});