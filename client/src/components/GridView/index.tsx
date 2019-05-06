import * as React from 'react';
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
import * as _ from 'lodash';

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

function desc(a: any, b: any, orderBy: string): number {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getSorting(order: string, orderBy: string) {
    return order === 'desc' ? (a: any, b: any) => desc(a, b, orderBy) : (a: any, b: any) => -desc(a, b, orderBy);
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

interface EnhancedTablePropsI {
    classes: {
        root: string,
        table: string,
        tableWrapper: string
    },
    data: any,
    idField: string,
    title: string
}

interface EnhancedTableStateI {
    data: any[],
    order: 'asc' | 'desc',
    orderBy: string,
    selected: number[],
    page: number,
    rowsPerPage: number,
}

class EnhancedTable extends React.Component<EnhancedTablePropsI, EnhancedTableStateI>{
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
        const {classes, title} = this.props;
        const {data, order, orderBy, selected, rowsPerPage, page} = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
        return (
            <Paper className={classes.root}>
                <EnhancedTableToolbar title={title} numSelected={selected.length}/>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rows={this.getRows()}
                            rowCount={data.length}
                        />
                        <TableBody>
                            {data
                                .sort(getSorting(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(n => {
                                    const isSelected = this.isSelected(n.id);
                                    const obj = Object.assign({}, n);
                                    delete obj[this.props.idField];
                                    let i = -1;
                                    return (
                                        <TableRow
                                            hover={true}
                                            onClick={this.handleClick(n.id)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            key={n[this.props.idField]}
                                            selected={isSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={isSelected}/>
                                            </TableCell>
                                            {_.map(obj, item => {
                                                    i++;
                                                    return <TableCell key={i} component={i === 0 ? "th" : "td"}
                                                                      scope="row"
                                                                      padding={i === 0 ? "none" : "default"}>
                                                        {item}
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

    protected getRows = (): any[] => {
        const {data} = this.state;
        const items = _.keys(data[0]);
        const result: any[] = [];
        items.map((row) => {
                if (row !== this.props.idField) {
                    result.push(
                        {
                            disablePadding: typeof data[0][row] === 'string',
                            id: row,
                            label: _.capitalize(row),
                            numeric: typeof data[0][row] === 'number',
                        },
                    )
                }
            }
        );
        return result;
    };
    protected handleRequestSort = (event: React.MouseEvent<HTMLElement>, property: string): void => {
        const orderBy = property;
        let order: 'asc' | 'desc' = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState(() => ({order, orderBy}));
    };

    protected handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
        if (checked) {
            this.setState(state => ({selected: state.data.map(n => n.id)}));
            return;
        }
        this.setState({selected: []});
    };

    protected handleClick = (id: number) => (event: React.MouseEvent<HTMLTableRowElement>): void => {
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

    protected isSelected = (id: number) => this.state.selected.indexOf(id) !== -1;
}

export default withStyles(styles)(EnhancedTable);
