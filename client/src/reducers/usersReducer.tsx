import {
    CLEAR_USERS,
    ClearUsersAction,
    CREATE_USER,
    CreateUserAction,
    DELETE_MANY_USERS,
    DELETE_USER,
    DeleteManyUsersAction,
    DeleteUserAction,
    FETCH_USER_BY_ID,
    FETCH_USERS,
    FetchUserByIdAction,
    FetchUsersAction,
    UPDATE_USER,
    UpdateUserAction, UserInterface
} from "../actions/types";

type AuthAction =
    FetchUsersAction
    | FetchUserByIdAction
    | CreateUserAction
    | UpdateUserAction
    | DeleteUserAction
    | DeleteManyUsersAction | ClearUsersAction;

interface StateType {
    users: UserInterface | UserInterface[],
    count?: number
}

const initialState: StateType = {users: []}
/**
 * @param {StateType} state
 * @param {AuthAction} action
 * @returns {StateType}
 */
export const usersReducer = (state: StateType = Object.assign({}, initialState), action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_USERS:
            // if (action.payload.length > 0 && state.length > 0) {
            //     return state[0]._id === action.payload[0]._id ? state : [...state, ...action.payload];
            // }
            return Array.isArray(state.users) ? {
                users: [...state.users, ...action.payload.users],
                count: action.payload.count
            } : action.payload;
        case FETCH_USER_BY_ID:
            return action.payload;
        case CREATE_USER:
            return initialState;
        case UPDATE_USER:
            return initialState;
        case DELETE_USER:
            return initialState;
        case DELETE_MANY_USERS:
            return initialState;
        case CLEAR_USERS:
            return initialState;
        default:
            return state;
    }
};