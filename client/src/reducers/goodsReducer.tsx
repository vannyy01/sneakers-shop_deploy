import {FETCH_GOOD, FETCH_GOODS, FetchGoodAction, FetchGoodsAction, ShoeInterface} from "../actions/types";

type AuthAction =  FetchGoodAction | FetchGoodsAction;
type StateType = ShoeInterface[] | [];

export const goodsReducer = (state: StateType = [], action: AuthAction) => {
    switch (action.type) {
        case FETCH_GOODS:
            if (action.payload.length > 0 && state.length > 0) {
                return state[0]._id === action.payload[0]._id ? state : [...state, ...action.payload];
            }

            return action.payload;
        case FETCH_GOOD:
            return action.payload;
        default:
            return state;
    }
};