import axios from 'axios';
import {
    ANSWER_POLL, CALC_POLL, CLEAR_GOODS, CLEAR_USERS, CREATE_BRAND, CREATE_GOOD, CREATE_USER, DELETE_BRAND,
    DELETE_CART_ITEM, DELETE_GOOD, DELETE_MANY_GOODS, DELETE_MANY_USERS, DELETE_USER, FETCH_BRANDS,
    FETCH_GOOD,
    FETCH_GOODS,
    FETCH_USER, FETCH_USER_BY_ID,
    FETCH_USERS,
    GET_CART_ITEMS, SEARCH_GOODS, SEARCH_USERS,
    SET_CART_ITEM,
    ShoeInterface, UPDATE_GOOD, UPDATE_USER, UserInterface
}
    from './types';
import {addFilters} from "../components/utils";
import {SearchItemParameters} from "../components/GridView";
import {ItemDataType} from "../components/types";

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
 * @param skip
 * @param limit
 * @param count
 * @param fields
 * @param filters
 */
export const fetchUsers = (skip: number, limit: number, count: boolean = false, fields: string[] = ["*"], filters?: SearchItemParameters) => async (dispatch: any) => {
    try {
        const params = addFilters(filters);
        const user = await axios.get(`/api/users/${params}`, {params: {skip, limit, count, fields}});
        dispatch({type: FETCH_USERS, payload: user.data});
    } catch (error) {
        console.log('Unable to fetch list of users', error);
    }
};

/**
 * @param condition
 * @param skip
 * @param limit
 * @param count
 * @param fields
 * @param filters
 */
export const searchUsers = (condition: string, skip: number, limit: number, count: boolean = false, fields: string[] = ["*"], filters?: SearchItemParameters) => async (dispatch: any) => {
        try {
            const params = addFilters(filters);
            const res = await axios.get(`/api/users_search/${params}`, {params: {condition, skip, limit, count, fields}});
            dispatch({type: SEARCH_USERS, payload: res.data});
        } catch (error) {
            console.log(error);
        }
    }
;

export const clearUsersState = () => (dispatch: any) => {
    dispatch({type: CLEAR_USERS});
};

/**
 * @param user
 * @param onSuccessCallback
 */
export const updateUser = (user: UserInterface, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.put(`/api/users/edit/${user._id}`, user);
        dispatch({type: UPDATE_USER, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to update user. ${error}`);
    }
};

/**
 * @param id
 * @param onSuccessCallback
 */
export const deleteUser = (id: string, onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        await axios.delete(`/api/users/delete/${id}`);
        dispatch({type: DELETE_USER});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete user. ${error}`);
    }
};

/**
 * @param users
 * @param onSuccessCallback
 */
export const deleteManyUsers = (users: string[], onSuccessCallback: () => void) => async (dispatch: any) => {
    try {
        await axios.delete(`/api/users/delete_many`, {params: {users}});
        dispatch({type: DELETE_MANY_USERS});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete user. ${error}`);
    }
};

/**
 * @param skip
 * @param limit
 * @param count
 * @param fields
 * @param filters
 */
export const fetchGoods = (skip: number, limit: number, count: boolean = false, fields?: string[], filters?: SearchItemParameters) => async (dispatch: any) => {
    try {
        const params = addFilters(filters);
        const res = await axios.get(`/api/commodity/${params}`, {params: {skip, limit, count, fields}});
        dispatch({type: FETCH_GOODS, payload: res.data});
    } catch (error) {
        console.log(error);
    }
};

/**
 * @param condition
 * @param skip
 * @param limit
 * @param count
 * @param fields
 * @param filters
 */
export const searchGoods = (condition: string, skip: number, limit: number, count: boolean = false, fields?: string[], filters?: SearchItemParameters) => async (dispatch: any) => {
    try {
        const params = addFilters(filters);
        const res = await axios.get(`/api/commodity_search/${params}`, {params: {condition, skip, limit, count, fields}});
        dispatch({type: SEARCH_GOODS, payload: res.data});
    } catch (error) {
        console.log(error);
    }
};

export const clearGoodsState = () => (dispatch: any) => {
    dispatch({type: CLEAR_GOODS, payload: []});
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
        console.log(good);
        const res = await axios.post(`/api/commodity/create`, good);
        if (res.data.error) {
            throw new Error(res.data.message);
        }
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
export const deleteGood = (id: string, onSuccessCallback?: () => void) => async (dispatch: any) => {
    try {
        await axios.delete(`/api/commodity/delete/${id}`);
        dispatch({type: DELETE_GOOD});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete good. ${error}`);
    }
};

/**
 * @param goods
 * @param onSuccessCallback
 */
export const deleteManyGoods = (goods: string[], onSuccessCallback?: () => void) => async (dispatch: any) => {
    try {
        await axios.delete(`/api/commodity/delete_many`, {params: {items: goods}});
        dispatch({type: DELETE_MANY_GOODS});
        onSuccessCallback();
    } catch (error) {
        alert(`Failed to delete goods. ${error}`);
    }
};

export const fetchBrands = () => async (dispatch: any) => {
    try {
        const res = await axios.get('/api/commodity/brands');
        dispatch({type: FETCH_BRANDS, payload: res.data});
    } catch (error) {
        console.log(error);
    }
};

export const createBrand = (brand: ItemDataType) =>  async (dispatch: any) => {
    try {
        const res = await axios.post('/api/commodity/brand/create', brand);
        dispatch({type: CREATE_BRAND, payload: res.data});
    } catch (error) {
        console.log(error);
    }
};

export const deleteBrand = (brand: string, onSuccessCallback?: () => void) => async (dispatch: any) => {
    try {
        const res = await axios.delete(`/api/commodity/brand/delete/${brand}`);
        dispatch({type: DELETE_BRAND, payload: res.data});
        onSuccessCallback();
    } catch (error) {
        console.log(error);
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