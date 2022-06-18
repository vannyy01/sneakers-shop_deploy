import * as _ from "lodash";
import * as React from "react";
import {ShoeInterface} from "../../actions/types";
import CommodityCard from "./CommodityCard";
import {Accordion, AccordionDetails, AccordionSummary, FormGroup, Theme} from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SortSelect from '@material-ui/core/Select';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import FilterList from "@material-ui/icons/FilterList";
import createStyles from "@material-ui/core/styles/createStyles";
import {useEffect, useState} from "react";
import {ItemDataType, ItemsType, Order} from "../types";
import {getComparator, getFilters, usePrevious} from "../utils";
import _map from "lodash/map";
import {FilterListTypeArray} from "../GridView";
import {sexes, shoeTypes} from "../admin/goods/BaseGood";
import {clearGoodsState, fetchBrands, fetchGoods} from "../../actions";
import {headCells} from "../admin/goods/Goods";
import FilterSelect, {ActionMeta} from 'react-select';
import _forIn from "lodash/forIn";
import _forEach from "lodash/forEach";
import Placeholder from "../select/Placeholder";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {isEmpty, mapValues} from "lodash";
import {makeStyles} from "@material-ui/core/styles";
import {LoadCommodities} from "./index";
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme: Theme) => createStyles(
    {
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        accordionExpanded: {
            margin: "0 !important",
        },
        drawerPaper: {
            width: '20%',
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
    justifyCards: string,
    brands: ItemsType,
}

type CompareGoods = Omit<ShoeInterface, "description">;

const Goods: React.FC<GoodsPropsI> = ({justifyCards, brands}) => {

    const rows: Array<{ row: string, label: string }> =
        [{row: 'priceAsc', label: 'За зростанням ціни'},
            {row: 'priceDesc', label: 'За зменшенням ціни'},
            {row: 'title', label: 'За назвою'}];

    let initialFilterList: FilterListTypeArray<ShoeInterface & {availability: boolean}> = {
        availability: {
            filterName: {id: 'availability', numeric: false, disablePadding: true, label: 'Наявність'},
            filterLabel: "Наявність",
            fields: {
                "Доступно": {
                    label: "Доступно",
                    value: "Доступно"
                },
                "Немає в наявності": {
                    label: "Немає в наявності",
                    value: "Немає в наявності"
                }
            }
        },
        brand: {
            filterName: headCells[1],
            filterLabel: "Бренд",
            fields: brands
        },
        type: {
            filterName: headCells[4],
            filterLabel: "Тип",
            fields: shoeTypes
        },
        sex: {
            filterName: headCells[5],
            filterLabel: "Стать",
            fields: sexes
        }
    };
    const fieldsList = ['_id', 'brand', 'description', 'price', 'title', 'sex', 'type', 'mainImage'];
    let initialSkip = 0;
    let initialLimit = 6;
    let initialOrder: Order = 'asc';
    let initialOrderBy = 'priceAsc';

    const url = new URL(window.location.href);

    const replaceURL = (): void => {
        url.searchParams.sort();
        window.history.pushState(null, null, url);
    }

    if (url.searchParams.toString().length > 0) {
        url.searchParams.forEach((value, key) => {
            switch (key) {
                case 'skip':
                    initialSkip = +value;
                    break;
                case 'limit':
                    initialLimit = +value;
                    break;
                case 'order':
                    initialOrder = value as Order;
                    break;
                case 'orderBy':
                    initialOrderBy = value;
                    break;
                default:
                    const newFilterList = Object.assign({}, initialFilterList);
                    newFilterList[key].selectedOption = {
                        label: initialFilterList[key].fields[value].label,
                        value
                    };
                    initialFilterList = newFilterList;
            }
        });
    } else {
        url.searchParams.set('order', initialOrder as string);
        url.searchParams.set('orderBy', initialOrderBy);
        replaceURL();
    }

    const getSelector = ({
                             goods: {
                                 goods: goodsList,
                                 count: goodsCount
                             }
                         }: { goods: { goods: ShoeInterface[], count: number } }): { goods: ShoeInterface[], count: number } => {
        return {goods: goodsList, count: goodsCount};
    };

    const {goods, count}: { goods: ShoeInterface[], count: number } = useSelector(getSelector, shallowEqual);

    const [open, setOpen] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
    const [expandedFilterItem, setExpandedFilterItem] = React.useState<string | false>(false);
    const [order, setOrder] = useState<Order>(initialOrder);
    const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
    const [skip, setSkip] = useState<number>(initialSkip);
    const [limit, setLimit] = useState<number>(initialLimit);
    const [filterList, setFilterList] = useState<FilterListTypeArray<ShoeInterface & {availability: boolean}>>(initialFilterList);
    const initialBrands = mapValues(brands, () => false);
    const [brandFilterState, setBrandFilterState] = React.useState<{ [key: string]: boolean }>(initialBrands);
    const initialSexes = mapValues(sexes, () => false);
    const [sexFilterState, setSexFilterState] = React.useState<{ [key: string]: boolean }>(initialSexes);
    const initialTypes = mapValues(shoeTypes, () => false);
    const [typeFilterState, setTypeFilterState] = React.useState<{ [key: string]: boolean }>(initialTypes);
    const initialAvailability = mapValues(initialFilterList.availability.fields, () => false);
    const [availabilityFilterState, setAvailabilityFilterState] = React.useState<{ [key: string]: boolean }>(initialAvailability);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGoods(0, limit, true, fieldsList, getFilters(getSelectedOptions())));
    }, [dispatch]);

    useEffect(() => {
        const newFilterList = filterList;
        if (!isEmpty(newFilterList.brands)) {
            newFilterList.brands.fields = brands;
            setFilterList(newFilterList);
            _forEach(newFilterList, (item, key) => {
                if (item.selectedOption) {
                    url.searchParams.set(key, item.selectedOption.value as string);
                } else {
                    url.searchParams.delete(key);
                }
            });
            replaceURL();
        }
    }, [brands]);

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

    const handleOpenFilters = (): void => {
        // setOpen(!open);
        setOpenDrawer(!openDrawer);
    };

    const getSelectedOptions = (): FilterListTypeArray<ShoeInterface & {availability: boolean}> => _.pickBy(filterList, (value) => {
        return !!value.selectedOption;
    });

    const fetchItemsWithFilters = (): void => {
        const selectedOptions = getSelectedOptions();
        if (!_.isEmpty(selectedOptions)) {
            const filters = getFilters(selectedOptions);
            dispatch(fetchGoods(0, limit, true, fieldsList, filters));
            setSkip(0);
            url.searchParams.set('skip', '0');
            setLimit(limit);
            url.searchParams.set('limit', limit.toString());
        } else {
            dispatch(fetchGoods(0, limit, true));
            setSkip(0);
            url.searchParams.set('skip', '0');
        }
        replaceURL();
    };

    const handleChange = ({target: {value}}: React.ChangeEvent<HTMLSelectElement>): void => {
        switch (value) {
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
                setOrderBy(value);
                url.searchParams.set('orderBy', value);
        }
        replaceURL();
    };

    const handleChangeFilterOption = (newValue: ItemDataType, actionMeta: ActionMeta<ItemDataType>): void => {
        const filterArr: FilterListTypeArray<ShoeInterface & {availability: boolean}> = {};
        _forIn(filterList, (value, key) => {
            return filterArr[key] = value.filterName.id === actionMeta.name ? {
                ...value,
                selectedOption: newValue
            } : value;
        });
        setFilterList(filterArr);
        _forEach(filterArr, (item, key) => {
            if (item.selectedOption) {
                url.searchParams.set(key, item.selectedOption.value as string);
            } else {
                url.searchParams.delete(key);
            }
        });
        replaceURL();
    };

    const handleLoadClick = (): void => {
        const newLimit = limit + 6;
        if (goods.length < count) {
            dispatch(fetchGoods(limit, newLimit, true, fieldsList, getFilters(getSelectedOptions())));
            setSkip(limit);
            url.searchParams.set('skip', limit.toString());
            setLimit(newLimit);
            url.searchParams.set('limit', newLimit.toString());
            replaceURL();
            setExpanded(true);
        }
    }

    const onSpin = (): void => {
        setExpanded(false);
    };

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

    const handleChangeFilter = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        setExpandedFilterItem(isExpanded ? panel : false);
    };

    const handleChangeFilterBrand = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setBrandFilterState({...brandFilterState, [event.target.name]: event.target.checked});
    };

    const handleChangeFilterSex = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setSexFilterState({...initialSexes, [event.target.name]: event.target.checked});
    };

    const handleChangeFilterType = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setTypeFilterState({...typeFilterState, [event.target.name]: event.target.checked});
    };

    const handleChangeFilterAvailability = (event: React.ChangeEvent<HTMLInputElement>):void => {
        setAvailabilityFilterState({...typeFilterState, [event.target.name]: event.target.checked});
    };

    return (
        <>
            <div className="container">
                <div className="d-flex justify-content-sm-between">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="orderBy-simple">Сортування</InputLabel>
                        <SortSelect
                            value={orderBy}
                            onChange={handleChange}
                            inputProps={{
                                id: 'orderBy-simple',
                                name: 'orderBy',
                            }}
                        >
                            {rows.map(item =>
                                <MenuItem key={item.row} value={item.row}>{item.label}</MenuItem>
                            )}
                        </SortSelect>
                    </FormControl>
                    <div className="d-flex justify-content-end align-items-center">
                        {/*{open && (_map(filterList, ({*/}
                        {/*                                filterName,*/}
                        {/*                                filterLabel,*/}
                        {/*                                fields,*/}
                        {/*                                selectedOption*/}
                        {/*                            }) =>*/}
                        {/*    <FilterSelect*/}
                        {/*        key={filterName.id as string}*/}
                        {/*        closeMenuOnSelect={true}*/}
                        {/*        isClearable={true}*/}
                        {/*        isSearchable={false}*/}
                        {/*        name={filterName.id as string}*/}
                        {/*        components={{Placeholder}}*/}
                        {/*        placeholder={filterLabel}*/}
                        {/*        onChange={handleChangeFilterOption}*/}
                        {/*        styles={{*/}
                        {/*            container: (base) => ({*/}
                        {/*                ...base,*/}
                        {/*                minWidth: '160px',*/}
                        {/*                margin: '5px'*/}
                        {/*            })*/}
                        {/*        }}*/}
                        {/*        options={_map(fields, ({label, value}) => ({label, value}))}*/}
                        {/*        value={selectedOption}*/}
                        {/*    />*/}
                        {/*))}*/}
                        <Tooltip title="Фільтри" placement="top">
                            <IconButton onClick={handleOpenFilters} style={{width: "50px"}}>
                                <FilterList/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={`row ${justifyCards}`}>
                    {goods ?
                        _.map(goods.sort(getComparator<CompareGoods>(order, orderBy.includes("price") ? "price" : orderBy)),
                            (good, index) =>
                                <CommodityCard key={index} good={good}/>
                        ) : <div>Loading...</div>
                    }
                </div>
            </div>
            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={toggleDrawer}
                classes={{paper: classes.drawerPaper}}
            >
                <Accordion expanded={expandedFilterItem === 'availability'} onChange={handleChangeFilter('availability')}
                           classes={{expanded: classes.accordionExpanded}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="availability-content"
                        id="availability-header"
                    >
                        <Typography className={classes.heading}>Наявність</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {_map(filterList.availability.fields, item =>
                                <FormControlLabel
                                    key={item.label}
                                    className={classes.drawerFormGroup}
                                    control={
                                        <Checkbox
                                            checked={brandFilterState[item.label]}
                                            onChange={handleChangeFilterAvailability}
                                            name={item.label}
                                            color="primary"
                                        />
                                    }
                                    classes={{label: classes.drawerFormControl}}
                                    label={item.label}
                                />
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFilterItem === 'brand'} onChange={handleChangeFilter('brand')}
                           classes={{expanded: classes.accordionExpanded}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="brand-content"
                        id="brand-header"
                    >
                        <Typography className={classes.heading}>Бренд</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {_map(filterList.brand.fields, brand =>
                                <FormControlLabel
                                    key={brand.label}
                                    className={classes.drawerFormGroup}
                                    control={
                                        <Checkbox
                                            checked={brandFilterState[brand.label]}
                                            onChange={handleChangeFilterBrand}
                                            name={brand.label}
                                            color="primary"
                                        />
                                    }
                                    classes={{label: classes.drawerFormControl}}
                                    label={brand.label}
                                />
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFilterItem === 'sex'} onChange={handleChangeFilter('sex')}
                           classes={{expanded: classes.accordionExpanded}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="sex-content"
                        id="sex-header"
                    >
                        <Typography className={classes.heading}>Стать</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {_map(filterList.sex.fields, sex =>
                                <FormControlLabel
                                    key={sex.label}
                                    className={classes.drawerFormGroup}
                                    control={
                                        <Checkbox
                                            checked={sexFilterState[sex.label]}
                                            onChange={handleChangeFilterSex}
                                            name={sex.label}
                                            color="primary"
                                        />
                                    }
                                    classes={{label: classes.drawerFormControl}}
                                    label={sex.label}
                                />
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFilterItem === 'type'} onChange={handleChangeFilter('type')}
                           classes={{expanded: classes.accordionExpanded}}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls="type-content"
                        id="type-header"
                    >
                        <Typography className={classes.heading}>Тип</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {_map(filterList.type.fields, type =>
                                <FormControlLabel
                                    key={type.label}
                                    className={classes.drawerFormGroup}
                                    control={
                                        <Checkbox
                                            checked={typeFilterState[type.label]}
                                            onChange={handleChangeFilterType}
                                            name={type.label}
                                            color="primary"
                                        />
                                    }
                                    classes={{label: classes.drawerFormControl}}
                                    label={type.label}
                                />
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </Drawer>
            <LoadCommodities onTransitionEnd={onSpin} expanded={expanded}
                             handleLoadClick={handleLoadClick}/>
        </>
    )
};

const BrandsWrapper: React.FC<Omit<GoodsPropsI, "brands">> = (props) => {
    const getBrands = ({brands}: { brands: ItemsType }): ItemsType => {
        return brands;
    };

    const brandsList: ItemsType = useSelector(getBrands, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);
    return !isEmpty(brandsList) && <Goods {...props} brands={brandsList}/>
};

export default BrandsWrapper;