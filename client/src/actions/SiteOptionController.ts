import axios from "axios";
import {SiteOptionType} from "./types";
import {Dispatch} from "redux";

type FETCH_SITES_OPTIONS = 'FETCH_SITES_OPTIONS';
export const FETCH_SITES_OPTIONS: FETCH_SITES_OPTIONS = 'FETCH_SITES_OPTIONS';

export interface FetchSiteOptionsAction {
    type: FETCH_SITES_OPTIONS,
    payload: SiteOptionType[]
}

/**
 * @param blockContent
 */
export const fetchSiteOptions = (blockContent: string[]) => async (dispatch: Dispatch<FetchSiteOptionsAction>) => {
    try {
        const localBlockContent = blockContent.toString() === "*" ? undefined : blockContent;
        const res = await axios.get(`/api/site_options/blocks`, {params: {blockContent: localBlockContent}});
        dispatch({type: FETCH_SITES_OPTIONS, payload: res.data});
    } catch (error) {
        console.log("Failed to fetch site options.");
        console.error(error);
    }
}

type UPDATE_SITE_OPTION = 'UPDATE_SITE_OPTION';
export const UPDATE_SITE_OPTION: UPDATE_SITE_OPTION = 'UPDATE_SITE_OPTION';

export interface UpdateSiteOptionAction {
    type: UPDATE_SITE_OPTION,
}

export const updateSiteOption = (option: SiteOptionType, onSuccessCallback: () => void) => async (dispatch: Dispatch<UpdateSiteOptionAction>) => {
    try {
        await axios.put(`/api/site_options/blocks/edit/${option.name}`, option);
        dispatch({type: UPDATE_SITE_OPTION});
        onSuccessCallback();
    } catch (error) {
        console.log("Failed to update site options.");
        console.error(error);
    }
}

type CLEAR_SITE_OPTIONS = 'CLEAR_SITE_OPTIONS';
export const CLEAR_SITE_OPTIONS: CLEAR_SITE_OPTIONS = 'CLEAR_SITE_OPTIONS';

export interface ClearSiteOptionsAction {
    type: CLEAR_SITE_OPTIONS,
}

export const cleatSiteOptions = () => async (dispatch: Dispatch<ClearSiteOptionsAction>) => {
    dispatch({type: CLEAR_SITE_OPTIONS});
}