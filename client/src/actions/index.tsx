import axios from 'axios';
import {
    ANSWER_POLL, CALC_POLL,
    DELETE_CART_ITEM,
    FETCH_GOOD,
    FETCH_GOODS,
    FETCH_USER,
    FETCH_USERS,
    GET_CART_ITEMS,
    SET_CART_ITEM,
    ShoeInterface
}
    from './types';

/**
 * @returns {(dispatch: any) => Promise<void>}
 */
export const fetchUser = () => async (dispatch: any) => {
    const res = await axios.get('/api/current_user');
    dispatch({type: FETCH_USER, payload: res.data});
};

/**
 *
 */
export const fetchUsers = () => async (dispatch: any) => {
    const res = await axios.get('/api/users');
    dispatch({type: FETCH_USERS, payload: res.data});
};

/**
 *
 * @param to
 */
export const fetchGoods = (to: number) => async (dispatch: any) => {
    const res = await axios.get(`/api/commodity/${to}`);
    dispatch({type: FETCH_GOODS, payload: res.data})
};


export const fetchGoodByID = (id: string) => async (dispatch: any) => {
    const res = await axios.get(`/api/commodity/get/${id}`);
    dispatch({type: FETCH_GOOD, payload: res.data})
};

/**
 * @param item
 */
export const setCartItem = (item: { [id: number]: ShoeInterface; }) => (dispatch: any) => {
    dispatch({type: SET_CART_ITEM, payload: item})
};

export const getCartItems = () => async (dispatch: any) => {
    dispatch({type: GET_CART_ITEMS})
};

export const deleteCartItem = (id: string) => (dispatch: any) => {
    dispatch({type: DELETE_CART_ITEM, payload: id})
};

export const answerOnPoll = (id: number, answerKey: string) => async (dispatch: any) => {
    dispatch({type: ANSWER_POLL, payload: {id, answerKey}});
};

export const getAnswersResult = () => async (dispatch: any) => {
    dispatch({type: CALC_POLL});
};