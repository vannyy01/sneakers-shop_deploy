import axios from 'axios';
import {
    ANSWER_POLL, CALC_POLL, CREATE_GOOD, CREATE_USER,
    DELETE_CART_ITEM, DELETE_GOOD, DELETE_USER,
    FETCH_GOOD,
    FETCH_GOODS,
    FETCH_USER, FETCH_USER_BY_ID,
    FETCH_USERS,
    GET_CART_ITEMS,
    SET_CART_ITEM,
    ShoeInterface, UPDATE_GOOD, UPDATE_USER, UserInterface
}
    from './types';

/**
 * @param user
 * @param onSuccessCallback
 */
export const createUser = (user: UserInterface, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.post('/api/user/create', user);
        dispatch({type: CREATE_USER, payload: res.data});
        onSuccessCallback();
    } catch (err) {
        alert('Помилка ' + err.response.data.message);
    }
};

/**
 * @returns {(dispatch: any) => Promise<void>}
 */
export const fetchUser = () => async (dispatch: any) => {
    try {
        const res = await axios.get('/api/current_user');
        dispatch({type: FETCH_USER, payload: res.data});
    } catch (error) {
        console.log('Unable to fetch user', error);
    }
};

/**
 *
 * @param id
 * @param onErrorCallback
 */
export const fetchUserByID = (id: string, onErrorCallback: () => void) => async (dispatch: any) => {
    try {
        const user = await axios.get(`/api/users/get/${id}`);
        dispatch({type: FETCH_USER_BY_ID, payload: user.data});
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                alert('Server error 500: ' + error.response.data);
            } else if (error.response.status === 404) {
                alert(`User with id: ${id} did not found`);
            } else {
                alert('Response error: ' + error.response.data);
            }
        } else if (error.request) {
            console.log('request', error.data);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.message);
        onErrorCallback();
    }
};

/**
 *
 */
export const fetchUsers = () => async (dispatch: any) => {
    try {
        const user = await axios.get('/api/users');
        dispatch({type: FETCH_USERS, payload: user.data});
    } catch (error) {
        console.log('Unable to fetch list of users', error);
    }
};

export const updateUser = (user: UserInterface, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.put(`/api/users/edit/${user._id}`, user);
        dispatch({type: UPDATE_USER, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to update user. ${error}`);
    }
};

export const deleteUser = (id: string, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.delete(`/api/users/delete/${id}`);
        dispatch({type: DELETE_USER, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete user. ${error}`);
    }
};

/**
 * @param to
 * @param fields
 */
export const fetchGoods = (to: number, fields?: string[]) => async (dispatch: any) => {
    try {
        const res = await axios.get(`/api/commodity`, {params: {to, fields}});
        dispatch({type: FETCH_GOODS, payload: res.data});
    } catch (error) {
        console.log(error);
    }
};

/**
 * @param id
 * @param onErrorCallback
 */
export const fetchGoodByID = (id: string, onErrorCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.get(`/api/commodity/get/${id}`);
        dispatch({type: FETCH_GOOD, payload: res.data});
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                alert('Server error 500: ' + error.response.data);
            } else if (error.response.status === 404) {
                alert(`Good with id: ${id} did not found`);
            } else {
                alert('Response error: ' + error.response.data);
            }
        } else if (error.request) {
            console.log('request', error.data);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.message);
        onErrorCallback();
    }
};

/**
 * @param good
 * @param onSuccessCallback
 */
export const createGood = (good: ShoeInterface, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.post(`/api/commodity/create`, good);
        dispatch({type: CREATE_GOOD, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to create good. ${error}`);
    }
};

/**
 * @param good
 * @param onSuccessCallback
 */
export const updateGood = (good: ShoeInterface, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.put(`/api/commodity/edit/${good._id}`, good);
        dispatch({type: UPDATE_GOOD, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to update good. ${error}`);

    }
};

/**
 * @param id
 * @param onSuccessCallback
 */
export const deleteGood = (id: string, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.delete(`/api/commodity/delete/${id}`);
        dispatch({type: DELETE_GOOD, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete good. ${error}`);
    }
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