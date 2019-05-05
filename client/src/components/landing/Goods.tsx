import * as _ from "lodash";
import * as React from "react";

import {ShoeInterface} from "../../actions/types";
import CommodityCard from "./CommodityCard";

import {Theme} from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton/IconButton";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import FilterList from "@material-ui/icons/FilterList";

import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";

interface GoodsPropsI {
    classes: {
        formControl: string
    },
    justifyCards: string,
    goods?: ShoeInterface[]
}

interface GoodsStateI {
    data?: ShoeInterface[],
    open: boolean,
    order: 'asc' | 'desc',
    orderBy: string,
}

const styles = (theme: Theme) => createStyles(
    {
        formControl: {
            margin: theme.spacing.unit,
            minWidth: 120,
        }
    });

class Goods extends React.PureComponent<GoodsPropsI, GoodsStateI> {
    private static readonly rows: Array<{ row: string, label: string }> =
        [{row: 'priceAsc', label: 'За зростанням ціни'},
            {row: 'priceDesc', label: 'За зменшенням ціни'},
            {row: 'title', label: 'За назвою'}];

    constructor(props: GoodsPropsI) {
        super(props);
        this.state = {
            data: props.goods,
            open: false,
            order: 'asc',
            orderBy: 'priceAsc',
        }
    }

    public render() {
        const {order, orderBy} = this.state;
        return (
            <div className="container">
                <div className="d-flex justify-content-center">
                    <Tooltip title="Фільтри" placement="top">
                        <IconButton>
                            <FilterList/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className="d-flex justify-content-sm-start">
                <FormControl className={this.props.classes.formControl}>
                    <InputLabel htmlFor="orderBy-simple">Фільтр</InputLabel>
                    <Select
                        value={this.state.orderBy}
                        onChange={this.handleChange}
                        inputProps={{
                            id: 'orderBy-simple',
                            name: 'orderBy',
                        }}
                    >
                        {Goods.rows.map(item =>
                            <MenuItem key={item.row} value={item.row}>{item.label}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                </div>
                <div className={`row ${this.props.justifyCards}`}>
                    {!this.props.goods ?
                        <div>Loading...</div> :
                        _.map(this.props.goods.sort(this.getSorting(order, orderBy)), (good, index) =>
                            <CommodityCard key={index} good={good}/>
                        )
                    }
                </div>
            </div>
        )
    }

    private handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        this.setState({orderBy: event.target.value});
    };

    private desc(a: any, b: any, orderBy: string): number {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    private getSorting(order: string, orderBy: string) {
        return order === 'desc' ? (a: any, b: any) => this.desc(a, b, orderBy) : (a: any, b: any) => -this.desc(a, b, orderBy);
    }
}

export default withStyles(styles)(Goods);