import {FETCH_GOODS, FetchGoodsAction} from "../actions/types";

type AuthAction = FetchGoodsAction;


export const goodsReducer = (state = null, action: AuthAction) => {
    switch (action.type) {
        case FETCH_GOODS:
            return action.payload || [];
        default:
            return state;
    }
};