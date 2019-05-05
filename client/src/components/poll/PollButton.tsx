import IconButton from "@material-ui/core/IconButton/IconButton";
import Poll from "@material-ui/icons/Poll";
import * as React from "react";

interface CartButtonI {
    openCart?: () => void,
}

const CartButton = (props: CartButtonI) => <IconButton
    onClick={props.openCart}
    color="inherit"
>
    <Poll/>
</IconButton>;

export default CartButton;