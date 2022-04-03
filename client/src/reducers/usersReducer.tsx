import {
    CREATE_USER, CreateUserAction, DELETE_USER, DeleteUserAction, FETCH_USER_BY_ID,
    FETCH_USERS, FetchUserByIdAction, FetchUsersAction, UPDATE_USER, UpdateUserAction
} from "../actions/types";

type AuthAction = FetchUsersAction | FetchUserByIdAction | CreateUserAction | UpdateUserAction | DeleteUserAction;

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
        case FETCH_USER_BY_ID:
            return action.payload;
        case CREATE_USER:
            return [];
        case UPDATE_USER:
            return [];
        case DELETE_USER:
            return [];
        default:
            return state;
    }
};