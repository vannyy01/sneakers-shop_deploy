import * as React from "react";

import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import {ShoeInterface} from "../../actions/types";

interface CartItemI {
    classes: {
        amount: string,
        cartItem: string,
        productImage: string,
        productInfo: string,
        productName: string,
        productRemove: string,
        productTotal: string,
    }
    product: ShoeInterface,
    productID: string,
    removeProduct: (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => void
}

const styles = () => createStyles({
        amount: {
            color: '#333',
            fontWeight: 700
        },
        cartItem: {
            alignItems: 'center',
            display: 'flex',
            padding: '8px',
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
    });

const CartItem = ({classes, product, productID, removeProduct}: CartItemI) => (
    <li className={classes.cartItem}>
        <img className={classes.productImage} src={product.mainImage}/>
        <div className={classes.productInfo}>
            <p className={classes.productName}>{product.brand + " " + product.title}</p>
        </div>
        <div className={classes.productTotal}>
            <p className={classes.amount}>{product.price}</p>
        </div>
        <a
            className={classes.productRemove}
            href="#"
            onClick={removeProduct(productID)}
        >
            ×
        </a>
    </li>
);
export default withStyles(styles)(CartItem);