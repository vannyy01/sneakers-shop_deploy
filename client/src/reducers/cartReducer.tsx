import * as _ from "lodash";
import {
    DELETE_CART_ITEM,
    DeleteCartItemsAction,
    GET_CART_ITEMS,
    GetCartItemsAction,
    SET_CART_ITEM,
    SetCartItemsAction,
    ShoeInterface
} from "../actions/types";

type AuthAction = GetCartItemsAction | SetCartItemsAction | DeleteCartItemsAction;
type StateType = { [id: string]: ShoeInterface };

export const cartReducer = (state: StateType = {}, action: AuthAction) => {
    switch (action.type) {
        case GET_CART_ITEMS:
            return state;
        case SET_CART_ITEM:
            return {...state, ...action.payload};
        case DELETE_CART_ITEM:
            return _.filter(state,
                (item: any, index) => {
                    return index !== action.payload
                });
        default:
            return state;
    }
};