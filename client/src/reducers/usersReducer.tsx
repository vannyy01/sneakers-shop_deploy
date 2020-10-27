import {
    FETCH_USERS, FetchUsersAction
} from "../actions/types";

type AuthAction = FetchUsersAction;

/**
 * @param {any} state
 * @param {AuthAction} action
 * @returns {any}
 */

export const usersReducer = (state: any[] = [], action: AuthAction) => {
    switch (action.type) {
        case FETCH_USERS:
            if (action.payload.length > 0 && state.length > 0) {
                return state[0]._id === action.payload[0]._id ? state : [...state, ...action.payload];
            }
            return action.payload;
        default:
            return state;
    }
};