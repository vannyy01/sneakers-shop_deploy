import {url} from "../../index";
import {Order, OrderBy} from "../../types";
import {replaceURL} from "../../utils";
import {FilterStateType, PriceType} from "./Goods";
import {useEffect, useState} from "react";

export const BASE_SKIP = 0;
export const BASE_LIMIT = 6;

interface GoodsSearchParamsType {
    baseFilterList: any,
    initialBrands: FilterStateType,
    initialSexes: FilterStateType,
    initialTypes: FilterStateType,
    initialAvailability: FilterStateType,
    initialColors: FilterStateType,
    initialSizes: FilterStateType,
    initialPrice: PriceType,
}

const useGoodsSearchParams = ({
                                  baseFilterList,
                                  initialBrands,
                                  initialSexes,
                                  initialTypes,
                                  initialAvailability,
                                  initialColors,
                                  initialSizes,
                                  initialPrice
                              }: GoodsSearchParamsType) => {

    const initialSkip = BASE_SKIP;
    let initialLimit = BASE_LIMIT;
    let initialOrder: Order = 'asc';
    let initialOrderBy: OrderBy = 'priceAsc';
    const initialFilterList = structuredClone(baseFilterList);
    const initialBrandFilterState: FilterStateType = structuredClone(initialBrands);
    const initialSexFilterState: FilterStateType = structuredClone(initialSexes);
    const initialTypeFilterState: FilterStateType = structuredClone(initialTypes);
    const initialAvailabilityFilterState: FilterStateType = structuredClone(initialAvailability);
    const initialColorFilterState: FilterStateType = structuredClone(initialColors);
    const initialSizeFilterState: FilterStateType = structuredClone(initialSizes);
    const initialPriceFilterState: PriceType = structuredClone(initialPrice);
    let initialOpenFavourites = false;

    const [mounted, setMounted] = useState<boolean>(false);

    if (!mounted) {
        if (url.searchParams.toString().length > 0) {
            url.searchParams.forEach((value, key) => {
                switch (key) {
                    case 'skip':
                        url.searchParams.set('skip', initialSkip.toString());
                        break;
                    case 'limit':
                        initialLimit = +value;
                        break;
                    case 'favourites':
                        initialOpenFavourites = value as unknown as boolean;
                        break;
                    case 'order':
                        initialOrder = value as Order;
                        break;
                    case 'orderBy':
                        initialOrderBy = value as OrderBy;
                        break;
                    case 'priceFrom':
                        initialPriceFilterState.priceFrom = +value;
                        break;
                    case 'priceTo':
                        initialPriceFilterState.priceTo = +value;
                        break;
                    default:
                        const val: string[] = JSON.parse(value);
                        val.forEach(item => {
                                switch (key) {
                                    case 'brand':
                                        initialBrandFilterState[item] = true;
                                        break;
                                    case 'sex':
                                        initialSexFilterState[item] = true;
                                        break;
                                    case 'type':
                                        initialTypeFilterState[item] = true;
                                        break;
                                    case 'color':
                                        initialColorFilterState[item] = true;
                                        break;
                                    case 'sizes':
                                        initialSizeFilterState[item] = true;
                                        break;
                                    case 'availability':
                                        initialAvailabilityFilterState[item] = true;
                                }
                            }
                        );
                        val.forEach(thing => {
                                initialFilterList[key].selectedOption.push({
                                    label: initialFilterList[key].fields[thing].label,
                                    value: initialFilterList[key].fields[thing].value
                                })
                            }
                        );
                }
            });
        } else {
            url.searchParams.set('skip', initialSkip.toString());
            url.searchParams.set('limit', initialLimit.toString());
            url.searchParams.set('order', initialOrder as string);
            url.searchParams.set('orderBy', initialOrderBy);
            replaceURL();
        }
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    return {
        initialSkip,
        initialLimit,
        initialOrder,
        initialOrderBy,
        initialFilterList,
        initialBrandFilterState,
        initialSexFilterState,
        initialTypeFilterState,
        initialAvailabilityFilterState,
        initialColorFilterState,
        initialSizeFilterState,
        initialPriceFilterState,
        initialOpenFavourites
    };
};

export default useGoodsSearchParams;