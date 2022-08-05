import IconButton from "@material-ui/core/IconButton/IconButton";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import * as React from "react";
import {Badge} from "@material-ui/core";

interface CartButtonI {
    totalItems: number,
    openCart: () => void,
}

const CartButton = ({totalItems, openCart}: CartButtonI) => <IconButton
    onClick={openCart}
    color="inherit"
>
    <Badge badgeContent={totalItems} color="primary">
        <ShoppingCart/>
    </Badge>
</IconButton>;

export default CartButton;