import {
    CLEAR_SITE_OPTIONS, ClearSiteOptionsAction,
    FETCH_SITES_OPTIONS,
    FetchSiteOptionsAction,
    UPDATE_SITE_OPTION,
    UpdateSiteOptionAction
} from "../actions/SiteOptionController";
import {SiteOptionType} from "../actions/types";

type SiteOptionAction =
    FetchSiteOptionsAction
    | UpdateSiteOptionAction
    | ClearSiteOptionsAction;

type StateType = SiteOptionType[];

const initialState: StateType = [];
export const siteOptionsReducer = (state: StateType = initialState, action: SiteOptionAction): StateType => {
    switch (action.type) {
        case FETCH_SITES_OPTIONS:
            return action.payload;
        case UPDATE_SITE_OPTION:
            return initialState;
        case CLEAR_SITE_OPTIONS:
            return initialState;
        default:
            return state
    }
};