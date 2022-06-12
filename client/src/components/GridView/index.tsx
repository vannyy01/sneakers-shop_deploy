import * as React from 'react';
import * as _ from 'lodash';
import EnhancedTableHead from './TableHead';
import EnhancedTableToolbar from './TableToolbar';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {makeStyles, Theme} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {NavLink} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import {PaperComponent} from "../admin/goods/BaseGood";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {useEffect, useState} from "react";
import {TablePaginationActions} from "./TablePaginationActions";
import {HeadCell, ItemDataType, ItemsType} from "../types";
import _forEach from "lodash/forEach";
import _forIn from "lodash/forIn";
import {ActionMeta} from "react-select";
import _mapValues from "lodash/mapValues";
import {usePrevious} from "../utils";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        return order !== 0 ? order : a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        marginTop: theme.spacing(3),
        width: '100%',
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
}));


export interface FilterListType<T> {
    filterName: HeadCell<T>,
    filterLabel: string,
    fields: ItemsType,
    selectedOption?: ItemDataType
}

export interface FilterListTypeArray<T> {
    [key: string | number]: FilterListType<T>
}

export interface SearchItemParameters {
    [key: string]: string | number
}

// For @data and @headCells used any type due to delegation typechecking to a client class
interface EnhancedTablePropsI<T> {
    filterList?: FilterListTypeArray<T>,
    createLocationPath?: string | '/',
    rowsCount: number,
    count: number,
    data: any,
    fetchItems: (skip: number, limit: number, count: boolean, fields?: string[], filters?: { [key: string]: string | number }) => void,
    searchItems?: (condition: string,
                   skip: number,
                   limit: number,
                   count: boolean,
                   fields?: string[],
                   filters?: { [key: string]: string | number }) => void,
    clearItems: () => void,
    deleteItems?: [(items: string[], onSuccessCallback: () => void) => void, () => void],
    deleteMessage: string,
    deleteButtons: [cancelButton: string, actionButton: string],
    headCells: any[],
    idField: string,
    editRoute?: string | '/',
    title: string,
    searchFieldPlaceholder: string
}

const EnhancedTable = <T, >({
                                headCells,
                                filterList,
                                createLocationPath,
                                editRoute,
                                rowsCount,
                                count,
                                data = [],
                                title,
                                searchFieldPlaceholder,
                                deleteMessage,
                                deleteButtons,
                                deleteItems,
                                fetchItems,
                                searchItems,
                                clearItems
                            }: EnhancedTablePropsI<T>) => {

    const url = new URL(window.location.href);

    const replaceURL = (): void => {
        url.searchParams.sort();
        window.history.pushState(null, null, url);
    }

    let initialPage = 0;
    let initialRowsPerPage = rowsCount;
    let initialSkip = 0;
    let initialLimit = rowsCount;
    let initialOrder: Order = 'asc';
    let initialOrderBy = '';
    let initialSearchCondition;
    let initialFilterList: FilterListTypeArray<T> = Object.assign({}, filterList);

    if (url.searchParams.toString().length > 0) {
        url.searchParams.forEach((value, key) => {
            switch (key) {
                case 'page':
                    initialPage = +value;
                    break;
                case 'rowsPerPage':
                    initialRowsPerPage = +value;
                    break;
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
                case 'searchCondition':
                    initialSearchCondition = value;
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
        url.searchParams.set('page', initialPage.toString());
        url.searchParams.set('rowsPerPage', initialRowsPerPage.toString());
        url.searchParams.set('skip', initialSkip.toString());
        url.searchParams.set('limit', initialLimit.toString());
        replaceURL();
    }
    const [rowsData, setRowsData] = useState<any[]>(data);
    const [order, setOrder] = useState<Order>(initialOrder);
    const [orderBy, setOrderBy] = useState<string>(initialOrderBy);
    const [page, setPage] = useState<number>(initialPage);
    const [countItems, setCountItems] = useState<number>(count);
    const [rowsPerPage, setRowsPerPage] = useState<number>(initialRowsPerPage);
    const [selected, setSelected] = useState<string[]>([]);
    const [searchCondition, setSearchCondition] = useState<string>(initialSearchCondition);
    const [typingTimeout, setTypingTimeout] = useState<any>();
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [filterFieldValues, setFilterFieldValues] = useState<FilterListTypeArray<T>>(initialFilterList);
    const [skip, setSkip] = useState<number>(initialSkip);
    const [limit, setLimit] = useState<number>(initialLimit);

    // Firstly, request must be sent.
    useEffect(() => {
        if (data.length === 0) {
            const filters = getFilters();
            if (searchCondition) {
                searchItems(searchCondition, 0, rowsPerPage*(page+1), true, ["*"], filters);
            } else {
                fetchItems(0, rowsPerPage*(page+1), true, ["*"], filters);
            }
        }
    }, []);

    // Then data must be passed to the GridView.
    useEffect(() => {
        setRowsData(data);
    }, [data]);

    useEffect(() => {
        setCountItems(count);
    }, [count]);

    useEffect(() => {
        //  console.log('componentDidUpdate');
        const options = getSelectedOptions();
        if (!_.isEmpty(options)) {
            const filters: SearchItemParameters = _mapValues(options, (value) => {
                    return value.selectedOption.value
                }
            );
            if (rowsData.length < countItems && searchCondition) {
                searchItems(searchCondition, skip, limit, true, ["*"], filters);
            } else if (rowsData.length < countItems && !searchCondition) {
                fetchItems(skip, limit, true, ["*"], filters);
            }
        } else if (rowsData.length < countItems && searchCondition) {
            searchItems(searchCondition, skip, limit, true);
        } else if (rowsData.length < countItems && !searchCondition) {
            fetchItems(skip, limit, true);
        }
    }, [skip, limit]);

    useEffect(() => {
        //  console.log('componentDidUpdate');
        if (rowsData.length < countItems) {
            setSkip(limit);
            url.searchParams.set('skip', limit.toString());
            setLimit(rowsPerPage);
            url.searchParams.set('limit', rowsPerPage.toString());
            url.searchParams.set('rowsPerPage', rowsPerPage.toString());
            window.history.pushState(null, null, url);
        }
    }, [rowsPerPage]);

    const prevFieldValues = usePrevious(filterFieldValues);

    useEffect(() => {
        if (prevFieldValues && JSON.stringify(filterFieldValues) !== JSON.stringify(prevFieldValues)) {
            fetchItemsWithFilters();
        }
    }, [filterFieldValues]);

    // componentWillUnmount
    useEffect(() => {
        return () => {
            clearItems();
        }
    }, []);


    const handleSave = (): void => {
        setShowDialog(!showDialog);
    };

    const getSelectedOptions = (): { [key: string]: FilterListType<T> } => _.pickBy(filterFieldValues, (value) => {
        return !!value.selectedOption;
    });

    const getFilters = (): SearchItemParameters => _mapValues(getSelectedOptions(), (value) => {
            return value.selectedOption.value
        }
    );

    const fetchItemsWithFilters = (): void => {
        if (!_.isEmpty(getSelectedOptions())) {
            const filters = getFilters();
            if (searchCondition) {
                searchItems(searchCondition, 0, rowsPerPage, true, ["*"], filters);
            } else {
                fetchItems(0, rowsPerPage, true, ["*"], filters);
            }
            setPage(0);
            url.searchParams.set('page', '0');
            setSkip(0);
            url.searchParams.set('skip', '0');
            setLimit(rowsPerPage);
            url.searchParams.set('limit', rowsPerPage.toString());
            replaceURL();
        } else {
            if (searchCondition) {
                searchItems(searchCondition, 0, rowsPerPage, true);
            } else {
                fetchItems(0, limit, true);
            }
            setPage(0);
            url.searchParams.set('page', '0');
            setSkip(0);
            url.searchParams.set('skip', '0');
            replaceURL();
        }
    };

    const handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: string): void => {
        const newOrderBy = property;
        let newOrder: Order = 'desc';

        if (orderBy === property && order === 'desc') {
            newOrder = 'asc';
        }

        setOrder(newOrder);
        url.searchParams.set('order', newOrder);
        setOrderBy(newOrderBy);
        url.searchParams.set('orderBy', newOrderBy);
        replaceURL();
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            setSelected(rowsData.map(n => n._id));
        } else {
            setSelected([]);
        }
    };

    const handleDeleteManyItems = (): void => {
        deleteItems[0](selected, deleteItems[1]);
        setShowDialog(false);
    };

    const handleClick = (id: string): void => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: any = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, pageNumber: number): void => {
        if (event.currentTarget.name === "last_page") {
            setSkip(limit);
            url.searchParams.set('skip', limit.toString());
            setLimit(countItems - limit);
            url.searchParams.set('limit', (countItems - limit).toString());
        } else if (pageNumber > page) {
            setSkip(rowsPerPage * pageNumber);
            url.searchParams.set('skip', (rowsPerPage * pageNumber).toString());
        }
        setPage(pageNumber);
        url.searchParams.set('page', pageNumber.toString());
        replaceURL();
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setRowsPerPage(+event.target.value);
        url.searchParams.set('rowsPerPage', event.target.value);
        replaceURL();
    };

    const handleSearchItems = ({target: {value}}: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            const searchValue = value.trim();
            const isNewSearch = searchValue !== searchCondition;
            setSearchCondition(searchValue);
            url.searchParams.set('searchCondition', searchValue);
            if (searchValue.length === 0) {
                url.searchParams.delete('searchCondition');
                if (!_.isEmpty(getSelectedOptions())) {
                    fetchItems(0, rowsPerPage, true, ["*"], getFilters());
                } else {
                    fetchItems(0, rowsPerPage, true);
                }
                setSkip(0);
                url.searchParams.set('skip', '0');
                setLimit(rowsPerPage);
                url.searchParams.set('limit', rowsPerPage.toString());
                setPage(0);
                url.searchParams.set('page', '0');
            } else if (isNewSearch) {
                if (!_.isEmpty(getSelectedOptions())) {
                    searchItems(searchValue, 0, rowsPerPage, true, ["*"], getFilters());
                } else {
                    searchItems(searchValue, 0, rowsPerPage, true);
                }
                setSkip(0);
                url.searchParams.set('skip', '0');
                setLimit(rowsPerPage);
                url.searchParams.set('limit', rowsPerPage.toString());
                setPage(0);
                url.searchParams.set('page', '0');
            } else {
                searchItems(searchValue, skip, limit, true);
            }
            replaceURL();
        }, 300));
    };

    const handleChangeFilterOption = (newValue: ItemDataType, actionMeta: ActionMeta<ItemDataType>): void => {
        const filterArr: FilterListTypeArray<T> = {};
        _forIn(filterFieldValues, (value, key) => {
            return filterArr[key] = value.filterName.id === actionMeta.name ? {
                ...value,
                selectedOption: newValue
            } : value;
        });
        setFilterFieldValues(filterArr);
        _forEach(filterArr, (item, key) => {
            if (item.selectedOption) {
                url.searchParams.set(key, item.selectedOption.value as string);
            } else {
                url.searchParams.delete(key);
            }
        });
        replaceURL();
    };

    const isSelected = (id: string): boolean => {
        return selected.indexOf(id) !== -1;
    }

    const classes = useStyles();
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsData.length - page * rowsPerPage);
    return (
        <Paper className={classes.root}>
            <EnhancedTableToolbar
                <T>
                searchItems={handleSearchItems}
                filterList={filterFieldValues}
                handleChangeFilter={handleChangeFilterOption}
                location={createLocationPath}
                title={title}
                searchFieldPlaceholder={searchFieldPlaceholder}
                searchCondition={searchCondition}
                selected={selected}
                deleteItems={handleSave}
            />
            <div className={classes.tableWrapper}>
                {rowsData && countItems !== undefined ? (
                        (rowsData.length > 0 && countItems) ?
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rows={headCells}
                                    rowCount={data.length}
                                />
                                <TableBody>
                                    {stableSort(rowsData, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((tableRow, index) => {
                                            const row = Object.assign({}, tableRow);
                                            const rowId: any = row._id;
                                            const isItemSelected = isSelected(rowId);
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            let cellCounter = -1;
                                            delete row._id;
                                            return (
                                                <TableRow
                                                    hover={true}
                                                    onClick={() => handleClick(rowId)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={rowId}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={isItemSelected}
                                                                  inputProps={{'aria-labelledby': labelId}}
                                                        />
                                                    </TableCell>
                                                    {_.map(row, item => {
                                                            cellCounter++;
                                                            return cellCounter === 0 ?
                                                                <TableCell key={cellCounter} id={labelId} component="th"
                                                                           scope="row" padding="none">
                                                                    <NavLink style={{color: 'black'}}
                                                                             to={`${editRoute}/${rowId}`}>{item}</NavLink>
                                                                </TableCell> :
                                                                <TableCell key={cellCounter}>
                                                                    <NavLink style={{color: 'black'}}
                                                                             to={`${editRoute}/${rowId}`}>{item}</NavLink>
                                                                </TableCell>
                                                        }
                                                    )}
                                                </TableRow>
                                            );
                                        })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 49 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            :
                            <div className="d-flex justify-content-center align-items-center">
                                <h4>{title} не знайдено.</h4>
                            </div>
                    ) :
                    <div className="d-flex justify-content-center align-items-center">
                        <h4>Завантаження...</h4>
                    </div>
                }
            </div>
            <TablePagination
                component="div"
                count={countItems || 0}
                rowsPerPageOptions={[5, 10, 25]}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage="Виводити по:"
                backIconButtonProps={{
                    'aria-label': 'Попередня сторінка',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Наступна сторінка',
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
            <Dialog
                open={showDialog}
                onClose={handleSave}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        {deleteMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus={true} name="cancel" onClick={handleSave}
                            color="primary">
                        {deleteButtons[0]}
                    </Button>
                    <Button name="save" onClick={handleDeleteManyItems} color="primary">
                        {deleteButtons[1]}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default EnhancedTable;
