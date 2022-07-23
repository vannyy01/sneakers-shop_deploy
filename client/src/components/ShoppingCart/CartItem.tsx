import * as React from "react";
import {createStyles, makeStyles} from "@material-ui/core";
import {ShoeInterface} from "../../actions/types";

const useStyles = makeStyles(() => createStyles({
    amount: {
        color: '#333',
        fontWeight: 700
    },
    productImage: {
        height: '48px',
        width: '48px',
    },
    productInfo: {
        flexGrow: 1,
        marginLeft: '16px',
    },
    productName: {
        color: '#999',
        fontSize: '14px'
    },

    productRemove: {
        color: '#ccc',
        cursor: 'pointer',
        fontSize: '22px',
        height: '24px',
        lineHeight: '24px',
        marginLeft: '24px',
        textAlign: 'center',
        width: '24px',
    },
    productTotal: {
        marginLeft: '16px'
    },
}));

interface CartItemI {
    product: ShoeInterface,
    productID: string,
    removeProduct: (id: string) => (event: React.MouseEvent<HTMLDivElement>) => void
}

const CartItem: React.FC<CartItemI> = ({product, productID, removeProduct}) => {
    const classes = useStyles();
    const {_id, brand, title, mainImage, price} = product;
    const imageUrl = `/resources/commodities/${_id}/${mainImage}`;

    return (
        <li className="cart-item">
            <img className={classes.productImage} alt={brand + " " + title} src={imageUrl}/>
            <div className={classes.productInfo}>
                <p className={classes.productName}>{brand + " " + title}</p>
            </div>
            <div className={classes.productTotal}>
                <p className={classes.amount}>{price}</p>
            </div>
            <div
                className={classes.productRemove}
                onClick={removeProduct(productID)}
            >
                ×
            </div>
        </li>
    )
};

export default CartItem;