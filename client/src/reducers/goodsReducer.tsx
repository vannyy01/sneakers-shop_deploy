import {
    CREATE_GOOD, CreateGoodAction, DELETE_GOOD, DeleteGoodAction,
    FETCH_GOOD,
    FETCH_GOODS,
    FetchGoodAction,
    FetchGoodsAction,
    ShoeInterface,
    UPDATE_GOOD,
    UpdateGoodAction
} from "../actions/types";

type AuthAction =  FetchGoodAction | FetchGoodsAction | UpdateGoodAction | CreateGoodAction | DeleteGoodAction;
type StateType = ShoeInterface[] | [];

export const goodsReducer = (state: StateType = [], action: AuthAction) => {
    switch (action.type) {
        case FETCH_GOODS:
            // if (action.payload.length > 0 && state.length > 0) {
            //     return state[0]._id === action.payload[0]._id ? state : [...state, ...action.payload];
            // }
            return action.payload;
        case FETCH_GOOD:
            // TODO process find good error
            return action.payload;
        case UPDATE_GOOD:
            return [];
        case CREATE_GOOD:
            return  [];
        case DELETE_GOOD:
            return [];
        default:
            return state;
    }
};