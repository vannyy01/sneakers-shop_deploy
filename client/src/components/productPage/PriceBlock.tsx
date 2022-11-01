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

const PriceBlock: React.FC<{ discount: boolean, price: number, priceDiscount?: number }> = ({
                                                                                                discount,
                                                                                                price,
                                                                                                priceDiscount
                                                                                            }) => {
    const classes = useStyles();

    return (
        <div className={"col-12 align-items-start " + classes.price + " " + classes.priceWrapper}
             style={{marginBottom: 10}}>
            <div className="d-flex justify-content-start flex-row">
                {priceDiscount && <div style={{margin: "0 1rem 0 0"}}>
                    <div style={{margin: "0 1rem 0 0"}}>
                        {priceDiscount}грн
                    </div>
                </div>}
                {discount ?
                    <s className={classes.priceDiscount}>
                        {price}грн
                    </s>
                    : <div style={{margin: "0 1rem 0 0"}}>
                        {price}грн
                    </div>
                }
            </div>
        </div>
    );
}

export default PriceBlock;