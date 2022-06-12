import {useEffect, useRef} from "react";
import _ from "lodash";
import {SearchItemParameters} from "./GridView";

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