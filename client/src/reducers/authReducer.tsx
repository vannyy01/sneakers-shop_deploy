import {
    FETCH_USER, FetchUserAction
} from "../actions/types";

type AuthAction = FetchUserAction;

/**
 * @param {{}} state
 * @param {AuthAction} action
 * @returns {{}}
 */

export const authReducer = (state:any = null, action: AuthAction) => {
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false;
        default:
            return state;
    }
};