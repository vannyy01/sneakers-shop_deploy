import {FETCH_GOODS, FetchGoodsAction, ShoeInterface} from "../actions/types";

type AuthAction = FetchGoodsAction;
type StateType = ShoeInterface[] | [];

export const goodsReducer = (state: StateType = [], action: AuthAction) => {
    switch (action.type) {
        case FETCH_GOODS:
            const array : any = action.payload;
            return [...state, ...array];
        default:
            return state;
    }
};