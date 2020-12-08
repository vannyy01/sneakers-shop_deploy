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
import {Theme, withStyles} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {NavLink} from "react-router-dom";

/*
interface DataInterface {
    calories: number,
    carbs: number,
    fat: number,
    id: number,
    name: string,
    protein: number
}

let counter = 0;

function createData(name: string, calories: number, fat: number, carbs: number, protein: number): DataInterface {
    counter += 1;
    return {id: counter, name, calories, fat, carbs, protein};
}
*/

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

const styles = (theme: Theme) => createStyles({
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
});

// For @data and @headCells used any type due to delegation typechecking to a client class
interface EnhancedTablePropsI {
    classes: {
        root: string,
        table: string,
        tableWrapper: string
    },
    createLocationPath?: string | '/',
    data: any,
    headCells: any[],
    idField: string,
    editRoute?: string | '/',
    title: string
}

interface EnhancedTableStateI {
    data: any[],
    order: Order,
    orderBy: string,
    selected: string[],
    page: number,
    rowsPerPage: number,
}

class EnhancedTable extends React.Component<EnhancedTablePropsI, EnhancedTableStateI> {
    constructor(props: EnhancedTablePropsI) {
        super(props);
        this.state = {
            data: props.data,
            order: 'asc',
            orderBy: 'calories',
            page: 0,
            rowsPerPage: 5,
            selected: [],
        };
    }

    public render() {
        const {classes,createLocationPath, title} = this.props;
        const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar location={createLocationPath} title={title} numSelected={selected.length}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rows={this.props.headCells}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {stableSort(this.state.data, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((tableRow, index) => {
                                    const row = Object.assign({}, tableRow);
                                    const rowId: string = row._id;
                                    const isItemSelected = this.isSelected(rowId);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    let cellCounter = -1;
                                    delete row._id;
                                    return (
                                        <TableRow
                                            hover={true}
                                            onClick={(event) => this.handleClick(event, rowId)}
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
                                                                  to={`${this.props.editRoute}\\${rowId}`}>{item}</NavLink>
                                                        </TableCell> :
                                                        <TableCell key={cellCounter}>
                                                            <NavLink style={{color: 'black'}}
                                                                  to={`${this.props.editRoute}\\${rowId}`}>{item}</NavLink>
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
                </div>
                <TablePagination
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
        );
    }

    protected handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: string): void => {
        const orderBy = property;
        let order: 'asc' | 'desc' = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState(() => ({order, orderBy}));
    };

    protected handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.checked) {
            this.setState(state => ({selected: state.data.map(n => n._id)}));
            return;
        }
        this.setState({selected: []});
    };


    protected handleClick = (event: React.MouseEvent<HTMLTableRowElement>, id: string): void => {
        const {selected} = this.state;
        const selectedIndex = this.state.selected.indexOf(id);
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
        this.setState({selected: newSelected});
    };

    protected handleChangePage = (event: React.MouseEvent<HTMLButtonElement>, page: number) => {
        this.setState(() => ({page}));
    };

    protected handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        this.setState({
            rowsPerPage: Number.parseInt(event.target.value)
        });
    };

    protected isSelected = (id: string): boolean => {
        return this.state.selected.indexOf(id) !== -1;
    }
}

export default withStyles(styles)(EnhancedTable);
