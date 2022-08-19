import {ItemsType} from "../types";
import {SearchItemParameters} from "../components/GridView";

export interface UserInterface {
    _id: string,
    googleID?: string,
    email: string,
    role: 0 | 10 | 20,
    givenName: string,
    familyName: string,
    secondName?: string,
    sex?: string,
    phone?: string,
    birthday?: Date,
    photo?: string,
    password?: string
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
    payload: { users: UserInterface }
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
}

type DELETE_MANY_USERS = 'DELETE_MANY_USERS';
export const DELETE_MANY_USERS: DELETE_MANY_USERS = 'DELETE_MANY_USERS';

export interface DeleteManyUsersAction {
    type: DELETE_MANY_USERS,
}


type FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS: FETCH_USERS = 'FETCH_USERS';

export interface FetchUsersAction {
    type: FETCH_USERS,
    payload: { users: UserInterface[], count?: number, filters: { [key: string]: string[] } }
}

type SEARCH_USERS = 'SEARCH_USERS';
export const SEARCH_USERS: SEARCH_USERS = 'SEARCH_USERS';

export interface SearchUsersAction {
    type: SEARCH_USERS,
    payload: { users: UserInterface[], count: number }
}


type CLEAR_USERS = 'CLEAR_USERS';
export const CLEAR_USERS: CLEAR_USERS = 'CLEAR_USERS';

export interface ClearUsersAction {
    type: CLEAR_USERS,
}

type FETCH_GOODS = 'FETCH_GOODS';
export const FETCH_GOODS: FETCH_GOODS = 'FETCH_GOODS';

export interface FetchGoodsAction {
    type: FETCH_GOODS,
    payload: { goods: ShoeInterface[], count?: number, filters: SearchItemParameters }
}

type FETCH_FAVOURITE_GOODS = 'FETCH_FAVOURITE_GOODS';
export const FETCH_FAVOURITE_GOODS: FETCH_FAVOURITE_GOODS = 'FETCH_FAVOURITE_GOODS';

export interface FetchFavouriteGoodsAction {
    type: FETCH_FAVOURITE_GOODS,
    payload: { goods: ShoeInterface[] }
}

type SEARCH_GOODS = 'SEARCH_GOODS';
export const SEARCH_GOODS: SEARCH_GOODS = 'SEARCH_GOODS';

export interface SearchGoodsAction {
    type: SEARCH_GOODS,
    payload: { goods: ShoeInterface[], count?: number }
}


type CLEAR_GOODS = 'CLEAR_GOODS';
export const CLEAR_GOODS: CLEAR_GOODS = 'CLEAR_GOODS';

export interface ClearGoodsAction {
    type: CLEAR_GOODS,
    payload: []
}

type CREATE_GOOD = 'CREATE_GOOD';
export const CREATE_GOOD: CREATE_GOOD = 'CREATE_GOOD';

export interface CreateGoodAction {
    type: CREATE_GOOD,
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
    callback: () => void
}

type DELETE_GOOD = 'DELETE_GOOD';
export const DELETE_GOOD: DELETE_GOOD = 'DELETE_GOOD';

export interface DeleteGoodAction {
    type: DELETE_GOOD,
    callback: () => void
}


type DELETE_MANY_GOODS = 'DELETE_MANY_GOODS';
export const DELETE_MANY_GOODS: DELETE_MANY_GOODS = 'DELETE_MANY_GOODS';

export interface DeleteManyGoodsAction {
    type: DELETE_MANY_GOODS,
}

type FETCH_BRANDS = 'FETCH_BRANDS';
export const FETCH_BRANDS: FETCH_BRANDS = 'FETCH_BRANDS';

export interface FetchBrandsAction {
    type: FETCH_BRANDS,
    payload: ItemsType
}

type CREATE_BRAND = 'CREATE_BRAND';
export const CREATE_BRAND: CREATE_BRAND = 'CREATE_BRAND';

export interface CreateBrandAction {
    type: CREATE_BRAND,
    payload: ItemsType
}


type DELETE_BRAND = 'DELETE_BRAND';
export const DELETE_BRAND: DELETE_BRAND = 'DELETE_BRAND';

export interface DeleteBrandAction {
    type: DELETE_BRAND,
    payload: ItemsType
}

type FETCH_SEXES_COUNT = 'FETCH_SEXES_COUNT';
export const FETCH_SEXES_COUNT: FETCH_SEXES_COUNT = 'FETCH_SEXES_COUNT';

export interface FetchSexesCountAction {
    type: FETCH_SEXES_COUNT,
    payload: { "чоловічі": number, "жіночі": number }
}

type FETCH_TYPES_COUNT = 'FETCH_TYPES_COUNT';
export const FETCH_TYPES_COUNT: FETCH_TYPES_COUNT = 'FETCH_TYPES_COUNT';

export interface FetchTypesCountAction {
    type: FETCH_TYPES_COUNT,
    payload: { "чоловічі": number, "жіночі": number }
}

type FETCH_COLORS_COUNT = 'FETCH_COLORS_COUNT';
export const FETCH_COLORS_COUNT: FETCH_COLORS_COUNT = 'FETCH_COLORS_COUNT';

export interface FetchColorsCountAction {
    type: FETCH_COLORS_COUNT,
    payload: { [key: string]: number }
}


type FETCH_SIZES_COUNT = 'FETCH_SIZES_COUNT';
export const FETCH_SIZES_COUNT: FETCH_SIZES_COUNT = 'FETCH_SIZES_COUNT';

export interface FetchSizesCountAction {
    type: FETCH_SIZES_COUNT,
    payload: { [key: string]: number }
}

type FETCH_AVAILABILITY_COUNT = 'FETCH_AVAILABILITY_COUNT';
export const FETCH_AVAILABILITY_COUNT: FETCH_AVAILABILITY_COUNT = 'FETCH_AVAILABILITY_COUNT';

export interface FetchAvailabilityCountAction {
    type: FETCH_AVAILABILITY_COUNT,
    payload: Array<CommodityInterface & { totalShoes: number, availability: boolean }>
}

export interface SizeInterface {
    sizeValue: number,
    count: number,
}

export interface CommodityInterface {
    _id: string,
    title: string,
    brand: string,
    type: string,
    sex: string,
    mainImage: string,
    price: number,
    description?: string,
    fullDescription?: string,
    availability?: boolean,
}

export interface ShoeInterface extends CommodityInterface {
    color: string,
    size?: SizeInterface,
    sizes?: SizeInterface[],
}

export interface SiteOptionType {
    _id: string,
    name: string,
    label: string,
    title: string,
    description?: string,
    backgroundImage?: string
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
