import axios from 'axios';
import {FETCH_GOODS,FETCH_USER, FETCH_USERS}
    from './types';

/**
 * @returns {(dispatch: any) => Promise<void>}
 */
export const fetchUser = () => async (dispatch: any) => {
    const res = await axios.get('/api/current_user');
    dispatch({type: FETCH_USER, payload: res.data});
};

/**
 * @returns {(dispatch: any) => Promise<void>}
 */
export const fetchUsers = () => async (dispatch: any) => {
    const res = await axios.get('/api/users');
    dispatch({type: FETCH_USERS, payload: res.data});
};

/**
 * @returns {(dispatch: any) => Promise<void>}
 */
export const fetchGoods = () => async (dispatch: any) => {
    const res = await axios.get('/api/commodity');
    dispatch({type: FETCH_GOODS, payload: res.data})
};