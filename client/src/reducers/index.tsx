import {combineReducers} from "redux";
import {authReducer} from "./authReducer";
import {cartReducer} from "./cartReducer";
import {goodsReducer} from "./goodsReducer";
import {pollReducer} from "./pollReducer";
import {usersReducer} from "./usersReducer";
import {CLEAR_GOODS, CLEAR_USERS} from "../actions/types";
import {brandsReducer} from "./brandsReducer";
import {filtersReducer} from "./filtersReducer";
import {siteOptionsReducer} from "./siteOptionsReducer";

const appReducer = combineReducers({
    auth: authReducer,
    goods: goodsReducer,
    filters: filtersReducer,
    users: usersReducer,
    brands: brandsReducer,
    cartItems: cartReducer,
    poll: pollReducer,
    siteOptions: siteOptionsReducer
});

export default (state: any, action: any) => {
    if (state) {
        if (action.type === CLEAR_GOODS) {
            const {auth, cartItems, poll, users} = state;
            state = undefined;
            state = {auth, cartItems, poll, users};
        }
        if (action.type === CLEAR_USERS) {
            const {auth, cartItems, poll, goods} = state;
            state = undefined;
            state = {auth, cartItems, poll, goods};
        }
    }
    return appReducer(state, action);
};