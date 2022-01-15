export interface UserInterface {
    googleID?: string,
    email: string,
    _id: string,
    role: 0 | 10 | 20,
    givenName?: string,
    familyName?: string,
    photo?: string
}

type CREATE_USER = 'CREATE_USER';
export const CREATE_USER: CREATE_USER = 'CREATE_USER';

export interface CreateUserAction {
    type: CREATE_USER,
    payload: UserInterface
}

type FETCH_USER = 'FETCH_USER';
export const FETCH_USER: FETCH_USER = 'FETCH_USER';

export interface FetchUserAction {
    type: FETCH_USER,
    payload: UserInterface
}

type FETCH_USER_BY_ID = 'FETCH_USER_BY_ID';
export const FETCH_USER_BY_ID: FETCH_USER_BY_ID = 'FETCH_USER_BY_ID';

export interface FetchUserByIdAction {
    type: FETCH_USER_BY_ID,
    payload: UserInterface
}

type UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER: UPDATE_USER = 'UPDATE_USER';

export interface UpdateUserAction {
    type: UPDATE_USER,
    payload: UserInterface
}

type DELETE_USER = 'DELETE_USER';
export const DELETE_USER: DELETE_USER = 'DELETE_USER';

export interface DeleteUserAction {
    type: DELETE_USER,
    callback: () => void
}

type FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS: FETCH_USERS = 'FETCH_USERS';

export interface FetchUsersAction {
    type: FETCH_USERS,
    payload: UserInterface[]
}

type FETCH_GOODS = 'FETCH_GOODS';
export const FETCH_GOODS: FETCH_GOODS = 'FETCH_GOODS';

export interface FetchGoodsAction {
    type: FETCH_GOODS,
    payload: UserInterface
}

type CREATE_GOOD = 'CREATE_GOOD';
export const CREATE_GOOD: CREATE_GOOD = 'CREATE_GOOD';

export interface CreateGoodAction {
    type: CREATE_GOOD,
    payload: ShoeInterface
}


type FETCH_GOOD = 'FETCH_GOOD';
export const FETCH_GOOD: FETCH_GOOD = 'FETCH_GOOD';

export interface FetchGoodAction {
    type: FETCH_GOOD,
    payload: ShoeInterface
}

type UPDATE_GOOD = 'UPDATE_GOOD';
export const UPDATE_GOOD: UPDATE_GOOD = 'UPDATE_GOOD';

export interface UpdateGoodAction {
    type: UPDATE_GOOD,
    payload: ShoeInterface,
    callback: () => void
}

type DELETE_GOOD = 'DELETE_GOOD';
export const DELETE_GOOD: DELETE_GOOD = 'DELETE_GOOD';

export interface DeleteGoodAction {
    type: DELETE_GOOD,
    callback: () => void
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
    images?: string[],
    sizes?: [
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

type ANSWER_POLL = 'ANSWER_POLL';
export const ANSWER_POLL: ANSWER_POLL = 'ANSWER_POLL';

export interface AnswerI {
    count: number
    description: string,
    image: string,
    item?: string,
    title: string
}

export interface PollReducerI {
    answerA: AnswerI,
    answerB: AnswerI,
    answerC: AnswerI
}

export interface AnswerPollAction {
    type: ANSWER_POLL,
    payload: { id: number, answerKey: string }
}

type CALC_POLL = 'CALC_POLL';
export const CALC_POLL: CALC_POLL = 'CALC_POLL';

export interface CalcPollAction {
    type: CALC_POLL,
}
