import {AxiosPromise} from "axios";

type FETCH_USER = 'FETCH_USER';
export const FETCH_USER: FETCH_USER = 'FETCH_USER';

export interface FetchUserAction {
    type: FETCH_USER,
    payload: AxiosPromise<any>
}

type FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS: FETCH_USERS = 'FETCH_USERS';

export interface FetchUsersAction {
    type: FETCH_USERS,
    payload: AxiosPromise<any>
}

type FETCH_GOODS = 'FETCH_GOODS';
export const FETCH_GOODS: FETCH_GOODS = 'FETCH_GOODS';

export interface FetchGoodsAction {
    type: FETCH_GOODS,
    payload: AxiosPromise<ShoeInterface[]>
}

export interface SizeInterface {
    sizeValue: number,
    count: number,
}

export interface ShoeInterface {
    description?: string,
    brand: string,
    price: number,
    _id: string,
    mainImage: string,
    images?: [string],
    size?: [
        SizeInterface
        ],
    type?: string,
    title: string,
    sex?: string
}

type GET_CART_ITEMS = 'GET_CART_ITEMS';
export const GET_CART_ITEMS: GET_CART_ITEMS = 'GET_CART_ITEMS';

export interface GetCartItemsAction {
    type: GET_CART_ITEMS,
}

type SET_CART_ITEM = 'SET_CART_ITEM';
export const SET_CART_ITEM: SET_CART_ITEM = 'SET_CART_ITEM';

export interface SetCartItemsAction {
    type: SET_CART_ITEM,
    payload: ShoeInterface[]
}

type DELETE_CART_ITEM = 'DELETE_CART_ITEM';
export const DELETE_CART_ITEM: DELETE_CART_ITEM = 'DELETE_CART_ITEM';

export interface DeleteCartItemsAction {
    type: DELETE_CART_ITEM,
    payload: string
}