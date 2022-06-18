import {useEffect, useRef} from "react";
import _ from "lodash";
import {FilterListTypeArray, SearchItemParameters} from "./GridView";
import {Order} from "./types";
import _mapValues from "lodash/mapValues";

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
        _.forEach(filters, (item, key) => {
            params += `filters[${key}]=${item}`;
            params += '&';
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

export const getFilters = <T>(options: FilterListTypeArray<T>): SearchItemParameters => _mapValues(options, (value) => {
        return value.selectedOption.value
    }
);

