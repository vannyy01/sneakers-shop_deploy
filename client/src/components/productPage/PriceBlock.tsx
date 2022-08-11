import React from 'react';
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => createStyles({
    price: {
        fontSize: 20,
        fontWeight: 600
    },
    priceWrapper: {
        float: "left",
        width: 100
    },
    priceDiscount: {
        textDecoration: "line-through",
        color: "#777777"
    }
}));

const PriceBlock: React.FC<{ price: number, priceDiscount?: number }> = ({price, priceDiscount}) => {
    const classes = useStyles();

    return (
        <div className={"col-12 align-items-start " + classes.price + " " + classes.priceWrapper}
             style={{marginBottom: 10}}>
            <div className="d-flex justify-content-start flex-row">
                <div style={{margin: "0 1rem 0 0"}}>
                    {price}грн
                </div>
                {priceDiscount && <div style={{margin: "0 1rem 0 0"}}>
                    <s className={classes.priceDiscount}>
                        {priceDiscount}грн
                    </s>
                </div>}
            </div>
        </div>
    );
}

export default PriceBlock;