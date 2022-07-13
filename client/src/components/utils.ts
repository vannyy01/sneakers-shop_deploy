import {useEffect, useRef} from "react";
import {forEach, isEmpty, map} from "lodash";
import {FilterListTypeArray, SearchItemParameters} from "./GridView";
import {ItemDataType, Order} from "./types";
import _mapValues from "lodash/mapValues";
import {url} from "../index";
import {GoodsFilterList} from "./landing/Goods";

export const inArray = <T>(item: T, label: string, items: T[]): boolean =>
    items.findIndex(value => value[label] === item[label]) >= 0;

export const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value
    });
    return ref.current;
};

export const addFilters = (filters?: SearchItemParameters): string => {
    let params = "";
    if (filters) {
        params += "?";
        forEach(filters, (item, key) => {
            if (item !== undefined) {
                item.forEach(thing => {
                    params += `filters[${key}]=${thing}`;
                    params += '&';
                })
            }
        });
        params = params.slice(0, -1);
    }
    return params;
};

export const descendingComparator = <T>(a: T, b: T, orderBy: string): number => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

export const getComparator = <T>(
    order: Order,
    orderBy: string,
): (a: T, b: T) => number => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const getFilters = <T>(options: FilterListTypeArray<T>): SearchItemParameters => _mapValues(options, (item) => {
        return map(item.selectedOption, (thing: ItemDataType) => thing.value as string);
    }
);

export const replaceURL = (): void => {
    url.searchParams.sort();
    window.history.pushState(null, null, url);
}

export const updateURL = (filterArr: GoodsFilterList): void => {
    forEach(filterArr, (item, key) => {
        if (item && !isEmpty(item.selectedOption)) {
            url.searchParams.set(key, JSON.stringify(item.selectedOption.map(thing => thing.value)));
        } else {
            url.searchParams.delete(key);
        }
    });
    replaceURL();
};

