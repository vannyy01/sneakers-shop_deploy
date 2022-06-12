import {
    CREATE_BRAND, CreateBrandAction, DELETE_BRAND, DeleteBrandAction,
    FETCH_BRANDS,
    FetchBrandsAction
} from "../actions/types";
import {ItemsType} from "../components/types";

type AuthAction =
    FetchBrandsAction |
    CreateBrandAction |
    DeleteBrandAction;

type StateType = ItemsType;

const initialState: StateType = {};
export const brandsReducer = (state: StateType = Object.assign({}, initialState), action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_BRANDS:
            return action.payload;
        case CREATE_BRAND:
            return action.payload;
        case DELETE_BRAND:
            return action.payload;
        default:
            return state
    }
};