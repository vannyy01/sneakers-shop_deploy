import {
    FETCH_USER, FetchUserAction, UserInterface
} from "../actions/types";
import {LOGIN_BY_EMAIL_ERROR, LoginByEmailErrorAction} from "../actions";

type AuthAction = FetchUserAction
    | LoginByEmailErrorAction;

type StateType = { user: UserInterface | null, error: { message: string, ERROR: string } | null };

const initialState: StateType = {user: null, error: null};
export const authReducer = (state = initialState, action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_USER:
            return {...state, user: action.payload};
        case LOGIN_BY_EMAIL_ERROR:
            console.log(action.payload)
            return {...state, error: action.payload};
        default:
            return state;
    }
};