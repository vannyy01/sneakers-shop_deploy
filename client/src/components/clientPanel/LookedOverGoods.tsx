import React from 'react';
import {useLookOverGoods} from "../common/useLookOverGood";
import {CommodityCard} from "../landing";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    paper: {
        [theme.breakpoints.up('md')]: {
            maxWidth: "65%",
            marginTop: theme.spacing(1),
            marginLeft: theme.spacing(8),
            marginRight: theme.spacing(4)
        },
        maxWidth: "100%",
    },
    header: {
        fontSize: 23,
        margin: "8px 0 16px 0",
    }
}));

const LookedOverGoods: React.FC = () => {
    const lookedOverGoods = useLookOverGoods();
    const classes = useStyles();

    return lookedOverGoods && <div className={classes.paper}>
        <h1 className={classes.header + " text-center text-md-left"}>
            Переглянуті товари
        </h1>
        <div className="row justify-content-center justify-content-md-between">
            {lookedOverGoods.map(good => <CommodityCard key={good._id} good={good} cardSize="col-12 col-md-6"/>)}
        </div>
    </div>
};

export default LookedOverGoods;