import {
    FETCH_USER, FetchUserAction, UserInterface
} from "../actions/types";

type AuthAction = FetchUserAction;

type StateType = UserInterface | null;

const initialState: StateType = null;
export const authReducer = (state = initialState, action: AuthAction): StateType => {
    switch (action.type) {
        case FETCH_USER:
            return action.payload;
        default:
            return state;
    }
};