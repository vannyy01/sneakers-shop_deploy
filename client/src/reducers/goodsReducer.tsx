import {
    CLEAR_GOODS,
    ClearGoodsAction,
    CREATE_GOOD,
    CreateGoodAction,
    DELETE_GOOD,
    DELETE_MANY_GOODS,
    DeleteGoodAction,
    DeleteManyGoodsAction,
    FETCH_FAVOURITE_GOODS,
    FETCH_GOOD,
    FETCH_GOODS, FetchFavouriteGoodsAction,
    FetchGoodAction,
    FetchGoodsAction,
    SEARCH_GOODS,
    SearchGoodsAction,
    ShoeInterface,
    UPDATE_GOOD,
    UpdateGoodAction,
} from "../actions/types";
import {SearchItemParameters} from "../components/GridView";

type AuthAction =
    FetchGoodAction
    | FetchFavouriteGoodsAction
    | SearchGoodsAction
    | FetchGoodsAction
    | ClearGoodsAction
    | UpdateGoodAction
    | CreateGoodAction
    | DeleteGoodAction
    | DeleteManyGoodsAction;

interface StateType {
    goods: ShoeInterface[],
    count?: number,
    searchMode: boolean,
    filters: SearchItemParameters
}

const initialState: StateType = {goods: [], searchMode: false, filters: {}};
export const goodsReducer = (state: StateType = initialState, action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_GOODS:
            // If previously SEARCH_GOODS was used
            if (state.searchMode) {
                return {searchMode: false, ...action.payload};
            }
            // If loads the next part of the same query condition OR data from the new query condition
            if (Array.isArray(state.goods)) {
                if (JSON.stringify(action.payload.filters) !== JSON.stringify(state.filters)) {
                    return {
                        ...state,
                        ...action.payload
                    };
                }
                if (state.goods.length !== 0) {
                    return {
                        ...state,
                        goods: [...state.goods, ...action.payload.goods],
                        count: action.payload.count
                    };
                }
            }
            return {...state, ...action.payload};
        case FETCH_FAVOURITE_GOODS:
            return {...initialState, ...action.payload};
        case SEARCH_GOODS:
            // If previously FETCH_GOODS was used
            if (!state.searchMode) {
                return {
                    ...state,
                    ...action.payload,
                    searchMode: true
                }
            }
            if (Array.isArray(state.goods)) {
                // If loads the next part of the same query condition
                if (state.count === action.payload.count &&
                    JSON.stringify(state.goods) !== JSON.stringify(action.payload.goods)) {
                    return {
                        ...state,
                        goods: [...state.goods, ...action.payload.goods],
                    }
                }
                // If loads data from the new query condition
                if (state.goods.length !== action.payload.goods.length) {
                    return {
                        ...state,
                        ...action.payload
                    }
                }
            }
            return state;
        case CLEAR_GOODS:
            return initialState;
        case FETCH_GOOD:
            action.payload.availability = action.payload.sizes.reduce((acc, size) => acc + size.count, 0) > 0;
            return {...state, goods: [action.payload]};
        case UPDATE_GOOD:
            return initialState;
        case CREATE_GOOD:
            return initialState;
        case DELETE_GOOD:
            return initialState;
        case DELETE_MANY_GOODS:
            return initialState;
        default:
            return state;
    }
};