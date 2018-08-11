import {AxiosPromise} from "axios";

type FETCH_USER = 'FETCH_USER';
export const FETCH_USER: FETCH_USER = 'FETCH_USER';
export interface FetchUserAction {
    type: FETCH_USER,
    payload: AxiosPromise<any>
}