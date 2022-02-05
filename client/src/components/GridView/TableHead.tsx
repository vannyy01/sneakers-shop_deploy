import * as React from "react";

import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

interface EnhancedTableHeadPropsI {
    order: 'asc' | 'desc',
    orderBy: string,
    numSelected: number,
    rowCount: number,
    rows: Array<{
        id: string,
        numeric: boolean,
        disablePadding: boolean,
        label: string
    }>,
    onRequestSort: (event: React.MouseEvent<HTMLElement>, property: string) => void,
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

class EnhancedTableHead extends React.Component<EnhancedTableHeadPropsI, any> {
    public render() {
        const {onSelectAllClick, order, orderBy, numSelected, rowCount} = this.props;
        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>
                    {this.props.rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                padding={row.disablePadding ? 'none' : 'normal'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={this.createSortHandler(row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
    protected createSortHandler = (property: string) => (event: React.MouseEvent<HTMLElement>) => {
        this.props.onRequestSort(event, property);
    };

}

export default EnhancedTableHead;