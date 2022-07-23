import {
    FETCH_SITES_OPTIONS,
    FetchSiteOptionsAction,
    UPDATE_SITE_OPTION,
    UpdateSiteOptionAction
} from "../actions/siteOptionController";
import {SiteOptionType} from "../actions/types";

type SiteOptionAction =
    FetchSiteOptionsAction
    | UpdateSiteOptionAction;

type StateType = SiteOptionType[];

const initialState: StateType = [];
export const siteOptionsReducer = (state: StateType = Object.assign({}, initialState), action: SiteOptionAction): StateType => {
    switch (action.type) {
        case FETCH_SITES_OPTIONS:
            return action.payload;
        case UPDATE_SITE_OPTION:
            return initialState;
        default:
            return state
    }
};