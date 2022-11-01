import * as _ from "lodash";
import * as React from "react";
import {ShoeInterface} from "../../actions/types";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, IconButton,
    InputAdornment,
    OutlinedInput,
    Theme
} from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import createStyles from "@material-ui/core/styles/createStyles";
import {useEffect, useState} from "react";
import {ItemDataType, ItemsType, Order, OrderBy} from "../../types";
import {getFilters, replaceURL, updateURL, usePrevious} from "../../utils";
import {FilterListTypeArray, SearchItemParameters} from "../GridView";
import {
    clearGoodsState,
    fetchAvailabilityCount,
    fetchBrands, fetchColorsCount, fetchSelectedGoods,
    fetchGoods,
    fetchSexesCount, fetchSizesCount,
    fetchTypesCount
} from "../../actions";
import {headCells} from "../admin/goods/Goods";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {forIn, isEmpty, mapValues} from "lodash";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Button from "../button";
import {url} from "../../index";
import {FiltersReducerStateType} from "../../reducers/filtersReducer";
import CloseIcon from '@material-ui/icons/Close';
import {getStorage, validateNumberInput} from "../../actions/validation";
import GoodsToolbar from "./GoodsToolbar";
import GoodsList from "./GoodsList";
import AccordionFilterMenu from "./AccordionFilterMenu";
import useGoodsSearchParams, {BASE_LIMIT, BASE_SKIP} from "./useGoodsSearchParams";


const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        formControl: {
            margin: theme.spacing(1),
            marginRight: "auto",
            minWidth: 120,
        },
        margin: {
            margin: theme.spacing(1),
        },
        accordionExpanded: {
            margin: "0 !important",
        },
        colorDirection: {
            justifyContent: "space-evenly"
        },
        filterHeader: {
            padding: "0.7rem 0.8rem",
            textAlign: "center",
            display: "flex",
            position: "sticky",
            top: 0,
        },
        filterHeaderInner: {
            flexGrow: 1,
            position: "relative",
        },
        filterHeading: {
            fontSize: 18,
            margin: 0,
        },
        filterCount: {
            color: "#777777",
            fontSize: 14,
            margin: 0,
            flexGrow: 1,
        },
        drawerPaper: {
            maxWidth: '20%',
        },
        drawerFormGroup: {
            marginBottom: 0,
        },
        drawerFormControl: {
            fontSize: '15px',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexShrink: 0,
        },
    })
);

interface GoodsPropsI {
    brands: ItemsType,
    sexes: ItemsType,
    types: ItemsType,
    availability: ItemsType,
    colors: ItemsType,
    sizes: ItemsType
}

export interface FilterStateType {
    [key: keyof ItemsType]: boolean
}

export interface PriceType {
    priceFrom: number | undefined,
    priceTo: number | undefined
}

export const availabilityFields: ItemsType = {
    1: {
        label: "Доступно",
        value: 1
    },
    0: {
        label: "Немає в наявності",
        value: 0
    }
};

interface BaseFilterListType {
    brands: ItemsType,
    sexes: ItemsType,
    types: ItemsType,
    availability: ItemsType,
    colors: ItemsType,
    sizes: ItemsType
}

export type GoodsFilterList = FilterListTypeArray<ShoeInterface & { availability: boolean, size: number } & PriceType>;

const baseFilterList = ({
                            brands,
                            sexes,
                            types,
                            availability,
                            colors,
                            sizes
                        }: BaseFilterListType = {
                            brands: {},
                            sexes: {},
                            types: {},
                            availability: {},
                            colors: {},
                            sizes: {}
                        }
): GoodsFilterList => ({
    availability: {
        filterName: {id: 'availability', numeric: false, disablePadding: true, label: 'Наявність'},
        filterLabel: "Наявність",
        fields: availability,
        selectedOption: []
    },
    brand: {
        filterName: headCells[1],
        filterLabel: "Бренд",
        fields: brands,
        selectedOption: []
    },
    type: {
        filterName: headCells[4],
        filterLabel: "Тип",
        fields: types,
        selectedOption: []
    },
    sex: {
        filterName: headCells[5],
        filterLabel: "Стать",
        fields: sexes,
        selectedOption: []
    },
    color: {
        filterName: {id: 'color', numeric: false, disablePadding: true, label: 'Колір'},
        filterLabel: "Колір",
        fields: colors,
        selectedOption: []
    },
    sizes: {
        filterName: {id: 'sizes', numeric: false, disablePadding: true, label: 'Розмір'},
        filterLabel: "Розмір",
        fields: sizes,
        selectedOption: []
    }
});

const Goods: React.FC<GoodsPropsI> = ({brands, sexes, types, availability, colors, sizes}) => {

    const fieldsList = ['_id', 'brand', 'description', 'price', 'title', 'sex', 'type', 'color', 'sizes', 'mainImage', 'discount', 'discountPrice'];
    const initialBrands = mapValues(brands, () => false);
    const initialSexes = mapValues(sexes, () => false);
    const initialTypes = mapValues(types, () => false);
    const initialAvailability = mapValues(availability, () => false);
    const initialColors = mapValues(colors, () => false);
    const initialSizes = mapValues(sizes, () => false);
    const initialPrice: PriceType = {priceFrom: undefined, priceTo: undefined};

    const {
        initialSkip,
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
    } = useGoodsSearchParams({
        baseFilterList: baseFilterList({brands, sexes, types, availability, colors, sizes}),
        initialBrands,
        initialSexes,
        initialTypes,
        initialAvailability,
        initialColors,
        initialSizes,
        initialPrice
    });

    const getSelector = ({
                             goods: {
                                 goods: goodsList,
                                 count: goodsCount
                             },
                         }: { goods: { goods: ShoeInterface[], count: number } }): { goods: ShoeInterface[], count: number } => {
        return {goods: goodsList, count: goodsCount};
    };

    const {goods, count} = useSelector(getSelector, shallowEqual);

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [expandedFilterItem, setExpandedFilterItem] = React.useState<string | false>(false);
    const [order, setOrder] = useState<Order>(initialOrder);
    const [orderBy, setOrderBy] = useState<OrderBy>(initialOrderBy);
    const [skip, setSkip] = useState<number>(initialSkip);
    // BASE_LIMIT uses instead of limit
    const [filterList, setFilterList] = useState<GoodsFilterList>(initialFilterList);
    const [brandFilterState, setBrandFilterState] = React.useState<FilterStateType>(initialBrandFilterState);
    const [sexFilterState, setSexFilterState] = React.useState<FilterStateType>(initialSexFilterState);
    const [typeFilterState, setTypeFilterState] = React.useState<FilterStateType>(initialTypeFilterState);
    const [availabilityFilterState, setAvailabilityFilterState] = React.useState<FilterStateType>(initialAvailabilityFilterState);
    const [colorFilterState, setColorFilterState] = React.useState<FilterStateType>(initialColorFilterState);
    const [sizeFilterState, setSizeFilterState] = React.useState<FilterStateType>(initialSizeFilterState);
    const [priceFieldState, setPriceFieldState] = React.useState<PriceType>(initialPriceFilterState);
    const [priceFilterState, setPriceFilterState] = React.useState<PriceType>(initialPriceFilterState);
    const [priceOnBlur, setPriceOnBlur] = React.useState<boolean>(false);
    const [openFavourites, setOpenFavourites] = React.useState<boolean>(initialOpenFavourites);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        if (openFavourites) {
            const favourites = getStorage("FavouritesGoods");
            dispatch(fetchSelectedGoods({orderBy, fields: fieldsList}, favourites));
        } else {
            dispatch(fetchGoods({
                    skip,
                    limit: BASE_LIMIT,
                    orderBy,
                    count: true,
                    fields: fieldsList,
                }, {
                    ...getFilters(getSelectedOptions()),
                    priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                    priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
                }
            ));
        }
    }, [dispatch]);

    const prevOpenFavourites = usePrevious(openFavourites);

    useEffect(() => {
        if (prevOpenFavourites !== undefined && openFavourites && openFavourites !== prevOpenFavourites) {
            const favourites = getStorage("FavouritesGoods");
            dispatch(fetchSelectedGoods({orderBy, fields: fieldsList}, favourites));
            url.searchParams.set('favourites', 'true');
            handleClearFilters();
        } else if (prevOpenFavourites !== undefined && !openFavourites) {
            dispatch(fetchGoods({
                    skip,
                    limit: BASE_LIMIT,
                    orderBy,
                    count: true,
                    fields: fieldsList,
                }, {
                    ...getFilters(getSelectedOptions()),
                    priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                    priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
                }
            ));
            url.searchParams.delete('favourites');
            replaceURL();
        }
    }, [openFavourites]);

    const prevOrderBy = usePrevious(orderBy);

    useEffect(() => {
        if (prevOrderBy && orderBy !== prevOrderBy) {
            dispatch(fetchGoods({
                    skip: 0,
                    limit: BASE_LIMIT,
                    orderBy,
                    count: true,
                    fields: fieldsList,
                }, {
                    ...getFilters(getSelectedOptions()),
                    priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                    priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
                }
            ));
            setSkip(0);
            url.searchParams.set('skip', '0');
            replaceURL();
        }
    }, [orderBy]);

    const prevBrands = usePrevious(brands);
    const prevSexes = usePrevious(sexes);
    const prevTypes = usePrevious(types);
    const prevColors = usePrevious(colors);
    const prevSizes = usePrevious(sizes);
    const prevAvailability = usePrevious(availability);

    useEffect(() => {
        const newFilterList = filterList;
        if (JSON.stringify(brands) !== JSON.stringify(prevBrands)) {
            newFilterList.brand.fields = brands;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
        if (JSON.stringify(sexes) !== JSON.stringify(prevSexes)) {
            newFilterList.sex.fields = sexes;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
        if (JSON.stringify(types) !== JSON.stringify(prevTypes)) {
            newFilterList.type.fields = types;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
        if (JSON.stringify(colors) !== JSON.stringify(prevColors)) {
            newFilterList.color.fields = colors;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
        if (JSON.stringify(sizes) !== JSON.stringify(prevSizes)) {
            newFilterList.sizes.fields = sizes;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
        if (JSON.stringify(availability) !== JSON.stringify(prevAvailability)) {
            newFilterList.availability.fields = availability;
            setFilterList(newFilterList);
            updateURL(newFilterList);
        }
    }, [brands, sexes, types, colors, sizes, availability]);

    const prevPriceState = usePrevious(priceFilterState);

    useEffect(() => {
        if (prevPriceState && JSON.stringify(prevPriceState) !== JSON.stringify(priceFilterState) && priceOnBlur) {
            dispatch(fetchGoods({
                skip,
                limit: BASE_LIMIT,
                orderBy,
                count: true,
                fields: fieldsList,
            }, {
                ...getFilters(getSelectedOptions()),
                priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
            }));
            setPriceOnBlur(false);
        }
    }, [priceFilterState, priceOnBlur]);

    const prevFilterList = usePrevious(filterList);

    useEffect(() => {
        if (prevFilterList && JSON.stringify(filterList) !== JSON.stringify(prevFilterList)) {
            fetchItemsWithFilters();
        }
    }, [filterList]);

    useEffect(() => {
        return () => {
            dispatch(clearGoodsState());
        }
    }, []);

    const getSelectedOptions = (): GoodsFilterList => _.pickBy(filterList, (value) => {
        return !!value.selectedOption;
    });

    const fetchItemsWithFilters = (): void => {
        const selectedOptions = getSelectedOptions();
        if (!_.isEmpty(selectedOptions)) {
            const selectedFilters = getFilters(selectedOptions);
            dispatch(fetchGoods({
                skip: 0,
                limit: BASE_LIMIT,
                orderBy,
                count: true,
                fields: fieldsList,
            }, {
                ...selectedFilters,
                priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
            }));
            dispatch(fetchBrands(selectedFilters));
            dispatch(fetchSexesCount(selectedFilters));
            dispatch(fetchTypesCount(selectedFilters));
            dispatch(fetchColorsCount(selectedFilters));
            dispatch(fetchSizesCount(selectedFilters));
            dispatch(fetchAvailabilityCount(selectedFilters));
            setSkip(0);
            url.searchParams.set('skip', '0');
        } else {
            dispatch(fetchGoods({
                    skip: 0,
                    limit: BASE_LIMIT,
                    orderBy,
                    count: true,
                }, {
                    priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                    priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
                }
            ));
            dispatch(fetchBrands());
            dispatch(fetchSexesCount());
            dispatch(fetchTypesCount());
            dispatch(fetchColorsCount());
            dispatch(fetchSizesCount());
            dispatch(fetchAvailabilityCount());
            setSkip(0);
            url.searchParams.set('skip', '0');
        }
        replaceURL();
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        switch (event.target.value) {
            case "priceAsc":
                setOrderBy("priceAsc");
                url.searchParams.set('orderBy', "priceAsc");
                setOrder("asc");
                url.searchParams.set('order', "asc");
                break;
            case "priceDesc":
                setOrderBy("priceDesc");
                url.searchParams.set('orderBy', "priceDesc");
                setOrder("desc");
                url.searchParams.set('order', "asc");
                break;
            default:
                setOrderBy(event.target.value as OrderBy);
                url.searchParams.set('orderBy', event.target.value);
        }
        replaceURL();
    };

    const handleChangeFilterOption = (newValue: ItemDataType, filterName: keyof GoodsFilterList): void => {
        const filterArr: GoodsFilterList = {};
        forIn(filterList, (value, key) => {
            if (filterList[key].selectedOption.find(item => item.value === newValue.value)) {
                return filterArr[key] = {
                    ...value,
                    selectedOption: filterList[key].selectedOption.filter(item => item.value !== newValue.value)
                }
            } else if (newValue === null && value.filterName.id === filterName) {
                if (filterName === "sex" || filterName === "availability") {
                    return filterArr[key] = {
                        ...value,
                        selectedOption: []
                    }
                }
            } else if (value.filterName.id === filterName) {
                if (filterName === "sex") {
                    return filterArr[key] = {
                        ...value,
                        selectedOption: [newValue]
                    }
                }
                return filterArr[key] = {
                    ...value,
                    selectedOption: [...filterList[key].selectedOption, newValue]
                }
            }
            return filterArr[key] = value;
        });
        setFilterList(filterArr);
        updateURL(filterArr);
    };

    const handleLoadClick = (): void => {
        const newSkip = skip + 6;
        if (goods.length < count) {
            dispatch(fetchGoods({
                skip: newSkip,
                limit: BASE_LIMIT,
                orderBy,
                count: true,
                fields: fieldsList,
            }, {
                ...getFilters(getSelectedOptions()),
                priceFrom: priceFilterState.priceFrom ? [priceFilterState.priceFrom.toString()] : undefined,
                priceTo: priceFilterState.priceTo ? [priceFilterState.priceTo.toString()] : undefined
            }));
            setSkip(newSkip);
            url.searchParams.set('skip', newSkip.toString());
            replaceURL();
        }
    }

    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpenDrawer(!openDrawer);
    };

    const handleChangeFilter = (panel: string | false) => (event: React.ChangeEvent<{}>, isExpanded: boolean): void => {
        setExpandedFilterItem(isExpanded ? panel : false);
    };

    const handleChangeFilterBrand = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setBrandFilterState({...brandFilterState, [event.target.name]: event.target.checked});
        handleChangeFilterOption({label: event.target.name, value: event.target.name}, "brand");
    };

    const handleChangeFilterSex = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSexFilterState({...initialSexes, [event.target.name]: event.target.checked});
        handleChangeFilterOption({label: event.target.name, value: event.target.name}, "sex");
    };

    const handleChangeFilterType = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setTypeFilterState({...typeFilterState, [event.target.name]: event.target.checked});
        handleChangeFilterOption({label: event.target.name, value: event.target.name}, "type");
    };

    const handleChangeFilterColor = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setColorFilterState({...colorFilterState, [event.target.value]: event.target.checked});
        handleChangeFilterOption({label: event.target.name, value: event.target.value}, "color");
    };

    const handleChangeFilterSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSizeFilterState({...sizeFilterState, [event.target.name]: event.target.checked});
        handleChangeFilterOption({label: event.target.name, value: event.target.name}, "sizes");
    };

    const handleChangeFilterPrice = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = validateNumberInput(event.target.value);
        if (value <= 99999) {
            setPriceFieldState({...priceFieldState, [event.target.name]: value});
        }
    };

    const handleChangeFilterPriceBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        setPriceFilterState({...priceFilterState, [event.target.name]: priceFieldState[event.target.name]});
        setPriceOnBlur(true);
        if (event.target.name === 'priceFrom') {
            if (priceFieldState.priceFrom) {
                url.searchParams.set('priceFrom', priceFieldState.priceFrom ? priceFieldState.priceFrom.toString() : '');
            } else {
                url.searchParams.delete('priceFrom');
            }
        } else {
            if (priceFieldState.priceTo) {
                url.searchParams.set('priceTo', priceFieldState.priceTo ? priceFieldState.priceTo.toString() : '');
            } else {
                url.searchParams.delete('priceTo');
            }
        }
        replaceURL();
    };

    const handleChangeFilterAvailability = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setAvailabilityFilterState({
            ...availabilityFilterState,
            [event.target.name === "Доступно" ? 1 : 0]: event.target.checked
        });
        handleChangeFilterOption({
            label: event.target.name,
            value: event.target.name === "Доступно" ? 1 : 0
        }, "availability");
    };

    const handleClearFilters = (): void => {
        setFilterList(baseFilterList({brands, sexes, types, availability, colors, sizes}));
        setSkip(BASE_SKIP);
        url.searchParams.set('skip', BASE_SKIP.toString());
        setBrandFilterState(initialBrands);
        setSexFilterState(initialSexes);
        setTypeFilterState(initialTypes);
        setColorFilterState(initialColors);
        setSizeFilterState(initialSizes);
        setAvailabilityFilterState(initialAvailability);
        setPriceFieldState({priceFrom: undefined, priceTo: undefined});
        setPriceFilterState({priceFrom: undefined, priceTo: undefined});
        handleChangeFilter(false);
        updateURL({
            ...baseFilterList({brands, sexes, types, availability, colors, sizes}),
            priceFrom: undefined,
            priceTo: undefined
        });
        setOpenDrawer(false);
    }

    return (
        <>
            <div className="container">
                <GoodsToolbar
                    orderBy={orderBy}
                    formControlClass={classes.formControl}
                    handleChange={handleChange}
                    setOpenDrawer={setOpenDrawer}
                    openFavourites={openFavourites}
                    setOpenFavourites={setOpenFavourites}
                />
                <GoodsList goods={goods} order={order} orderBy={orderBy}
                           handleLoadClick={handleLoadClick}/>
            </div>
            {!openFavourites && <Drawer
                anchor="left"
                open={openDrawer}
                onClose={toggleDrawer}
                classes={{paper: classes.drawerPaper}}
            >
                <div className={classes.filterHeader}>
                    <IconButton onClick={toggleDrawer}>
                        <CloseIcon fontSize="medium"/>
                    </IconButton>
                    <div className={classes.filterHeaderInner}>
                        <h2 className={classes.filterHeading}>Фільтри</h2>
                        <p className={classes.filterCount}>{count} товарів</p>
                    </div>
                </div>
                <AccordionFilterMenu
                    name="availability"
                    label="Наявність"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.availability.fields}
                    filterState={availabilityFilterState}
                    handleChangeFilterOption={handleChangeFilterAvailability}
                />
                <Accordion expanded={expandedFilterItem === 'price'} onChange={handleChangeFilter('price')}
                           classes={{expanded: classes.accordionExpanded}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="price-content"
                        id="price-header"
                    >
                        <Typography className={classes.heading}>Ціна</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl fullWidth={true} className={classes.margin} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-price-from">Від</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-price-from"
                                name="priceFrom"
                                value={priceFieldState.priceFrom ? priceFieldState.priceFrom.toString() : ''}
                                onChange={handleChangeFilterPrice}
                                onBlur={handleChangeFilterPriceBlur}
                                startAdornment={<InputAdornment position="start">грн</InputAdornment>}
                                labelWidth={30}
                            />
                        </FormControl>
                        <FormControl fullWidth={true} className={classes.margin} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-price-to">До</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-price-to"
                                name="priceTo"
                                type="number"
                                value={priceFieldState.priceTo ? priceFieldState.priceTo.toString() : ''}
                                onChange={handleChangeFilterPrice}
                                onBlur={handleChangeFilterPriceBlur}
                                startAdornment={<InputAdornment position="start">грн</InputAdornment>}
                                labelWidth={30}
                            />
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <AccordionFilterMenu
                    name="brand"
                    label="Бренд"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.brand.fields}
                    filterState={brandFilterState}
                    handleChangeFilterOption={handleChangeFilterBrand}
                />
                <AccordionFilterMenu
                    name="sex"
                    label="Стать"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.sex.fields}
                    filterState={sexFilterState}
                    handleChangeFilterOption={handleChangeFilterSex}
                />
                <AccordionFilterMenu
                    name="type"
                    label="Тип"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.type.fields}
                    filterState={typeFilterState}
                    handleChangeFilterOption={handleChangeFilterType}
                />
                <AccordionFilterMenu
                    name="color"
                    label="Колір"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.color.fields}
                    filterState={colorFilterState}
                    handleChangeFilterOption={handleChangeFilterColor}
                />
                <AccordionFilterMenu
                    name="sizes"
                    label="Розмір"
                    expandedFilterItem={expandedFilterItem}
                    handleChangeFilter={handleChangeFilter}
                    filterFields={filterList.sizes.fields}
                    filterState={sizeFilterState}
                    handleChangeFilterOption={handleChangeFilterSize}
                    row={true}
                />
                <div className="d-flex">
                    <Button text="Застосувати" onClick={() => setOpenDrawer(false)}/>
                    <Button text="Очистити" onClick={handleClearFilters}/>
                </div>
            </Drawer>
            }
        </>
    )
};

const BrandsWrapper: React.FC = (props) => {
    const filters: SearchItemParameters = {};
    if (url.searchParams.toString().length > 0) {
        url.searchParams.forEach((value, key) => {
            if (['brand', 'sex', 'type', 'availability', 'color', 'sizes', 'priceFrom', 'priceTo'].includes(key)) {
                const item = JSON.parse(value);
                filters[key] = Array.isArray(item) ? item : [item];
            }
        })
    }

    const getBrands = ({
                           brands,
                           filters: {sexes, types, availability, colors, sizes}
                       }: { brands: ItemsType, filters: FiltersReducerStateType }):
        { brands: ItemsType, sexes: ItemsType, types: ItemsType, availability: ItemsType, colors: ItemsType, sizes: ItemsType } => {
        return {brands, sexes, types, availability, colors, sizes};
    };

    const {
        brands: brandsList,
        sexes: sexesList,
        types: typesList,
        availability: availabilityList,
        colors: colorsList,
        sizes: sizesList
    }: { brands: ItemsType, sexes: ItemsType, types: ItemsType, availability: ItemsType, colors: ItemsType, sizes: ItemsType } = useSelector(getBrands, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBrands(filters));
        dispatch(fetchSexesCount(filters));
        dispatch(fetchTypesCount(filters));
        dispatch(fetchColorsCount(filters));
        dispatch(fetchSizesCount(filters));
        dispatch(fetchAvailabilityCount(filters));
    }, [dispatch]);

    return !isEmpty(brandsList)
        && !isEmpty(sexesList)
        && !isEmpty(typesList)
        && !isEmpty(colorsList)
        && !isEmpty(sizesList)
        && !isEmpty(availabilityList) &&
        <Goods {...props} brands={brandsList} sexes={sexesList} types={typesList} availability={availabilityList}
               colors={colorsList} sizes={sizesList}/>
};

export default BrandsWrapper;