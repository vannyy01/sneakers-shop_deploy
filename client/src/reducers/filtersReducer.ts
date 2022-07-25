import {
    FETCH_AVAILABILITY_COUNT, FETCH_COLORS_COUNT,
    FETCH_SEXES_COUNT, FETCH_SIZES_COUNT, FETCH_TYPES_COUNT, FetchAvailabilityCountAction, FetchColorsCountAction,
    FetchSexesCountAction, FetchSizesCountAction, FetchTypesCountAction
} from "../actions/types";
import {ItemsType} from "../types";
import {availabilityFields} from "../components/landing/Goods";
import {colors, sexes, shoeTypes, sizes} from "../components/admin/goods/goodTypes";

type AuthAction =
    FetchSexesCountAction |
    FetchTypesCountAction |
    FetchColorsCountAction |
    FetchSizesCountAction |
    FetchAvailabilityCountAction;

export interface FiltersReducerStateType {
    sexes?: ItemsType,
    types?: ItemsType,
    availability?: ItemsType,
    colors?: ItemsType,
    sizes?: ItemsType
}

const initialState: FiltersReducerStateType = {};
export const filtersReducer = (state: FiltersReducerStateType = initialState, action: AuthAction): FiltersReducerStateType => {
    switch (action.type) {
        case FETCH_SEXES_COUNT:
            sexes["чоловічі"].count = action.payload["чоловічі"];
            sexes["жіночі"].count = action.payload["жіночі"];
            return {...state, sexes};
        case FETCH_TYPES_COUNT:
            for (const type of Object.keys(shoeTypes)) {
                shoeTypes[type].count = action.payload[type]
            }
            return {...state, types: shoeTypes};
        case FETCH_COLORS_COUNT:
            for (const color of Object.keys(colors)) {
                colors[color].count = action.payload[color]
            }
            return {...state, colors};
        case FETCH_SIZES_COUNT:
            const newSizes = structuredClone(sizes);
            for (const size of Object.keys(newSizes)) {
                newSizes[size].count = action.payload[size]
            }
            return {...state, sizes: newSizes};
        case FETCH_AVAILABILITY_COUNT:
            // Доступно - 1, Немає в наявності - 0
            availabilityFields[1].count = action.payload.reduce((acc, item) => item.totalShoes > 0 ? ++acc : acc, 0);
            availabilityFields[0].count = action.payload.reduce((acc, item) => item.totalShoes === 0 ? ++acc : acc, 0);
            return {...state, availability: availabilityFields};

        default:
            return state
    }
};