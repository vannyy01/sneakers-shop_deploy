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
    FetchUsersAction, SEARCH_USERS, SearchUsersAction,
    UPDATE_USER,
    UpdateUserAction, UserInterface
} from "../actions/types";

type AuthAction =
    FetchUsersAction
    | FetchUserByIdAction
    | SearchUsersAction
    | CreateUserAction
    | UpdateUserAction
    | DeleteUserAction
    | DeleteManyUsersAction | ClearUsersAction;

interface StateType {
    users: UserInterface | UserInterface[],
    count?: number,
    searchMode: boolean,
    filters: { [key: string]: string }
}

const initialState: StateType = {users: [], searchMode: false, filters: {}};
/**
 * @param {StateType} state
 * @param {AuthAction} action
 * @returns {StateType}
 */
export const usersReducer = (state: StateType = Object.assign({}, initialState), action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_USERS:
            // If previously SEARCH_USERS was used
            console.log('previous state', state);
            console.log('next state', action.payload);
            if (state.searchMode) {
                return {searchMode: false, ...action.payload};
            }

            // If loads the next part of the same query condition OR data from the new query condition
            if (Array.isArray(state.users)) {
                if (JSON.stringify(action.payload.filters) !== JSON.stringify(state.filters)){
                    return {
                        ...state,
                        ...action.payload
                    };
                }
                if (state.users.length !== 0) {
                    return {
                        ...state,
                        users: [...state.users, ...action.payload.users],
                        count: action.payload.count
                    };
                }
            }
            return {...state, ...action.payload};
        // return Array.isArray(state.users) && state.users.length !== 0 ? {
        //     ...state,
        //     users: [...state.users, ...action.payload.users],
        //     count: action.payload.count
        // } : {...state, ...action.payload};
        case SEARCH_USERS:
            // If previously FETCH_USERS was used
            if (!state.searchMode) {
                return {
                    ...state,
                    ...action.payload,
                    searchMode: true
                }
            }
            if (Array.isArray(state.users)) {
                // If loads the next part of the same query condition
                if (state.count === action.payload.count &&
                    JSON.stringify(state.users) !== JSON.stringify(action.payload.users)) {
                    return {
                        ...state,
                        users: [...state.users, ...action.payload.users],
                    }
                }
                // If loads data from the new query condition
                if (state.users.length < action.payload.users.length
                    ||
                    state.users.length > action.payload.users.length) {
                    return {
                        ...state,
                        ...action.payload
                    }
                }
            }
            return state;
        case FETCH_USER_BY_ID:
            return {...state, ...action.payload};
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