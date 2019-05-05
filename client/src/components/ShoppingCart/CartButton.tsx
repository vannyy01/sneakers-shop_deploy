import IconButton from "@material-ui/core/IconButton/IconButton";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import * as React from "react";

interface CartButtonI {
    openCart: () => void,
}

const CartButton = (props: CartButtonI) => <IconButton
    onClick={props.openCart}
    color="inherit"
>
    <ShoppingCart/>
</IconButton>;

export default CartButton;