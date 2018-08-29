import {
    FETCH_USERS, FetchUsersAction
} from "../actions/types";

type AuthAction = FetchUsersAction;

/**
 * @param {any} state
 * @param {AuthAction} action
 * @returns {any}
 */

export const usersReducer = (state = null, action: AuthAction) => {
    switch (action.type) {
        case FETCH_USERS:
            return action.payload || [];
        default:
            return state;
    }
};