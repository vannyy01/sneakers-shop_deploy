import * as React from 'react';
import Scrollbars from "react-custom-scrollbars-2";
import * as _ from "lodash";
import CartItem from "./CartItem";
import {ShoeInterface} from "../../actions/types";
import {isEmpty} from "lodash";
import {useAutoAnimate} from '@formkit/auto-animate/react'

const EmptyCart = () => (<div style={{color: "#000000", marginTop:20}}>Ваша корзина пуста😐</div>);

const CartItemsList: React.FC<{ cartItems: { [id: string]: ShoeInterface }, removeCartItem: (id: string) => () => void }> = ({
                                                                                                                                 cartItems,
                                                                                                                                 removeCartItem
                                                                                                                             }) => {

    const [parent] = useAutoAnimate<any>();

    return !isEmpty(cartItems) ? (
        <Scrollbars style={{width: 360, height: 320}}
                    renderView={props => <div id="renderView" ref={parent} {...props}/>}>
            {_.map(cartItems, (item, index) =>
                <CartItem key={index}
                          product={item}
                          productID={index}
                          removeProduct={removeCartItem}/>
            )}
        </Scrollbars>
    ) : <div className="d-flex justify-content-center">
        <EmptyCart/>
        </div>
}

export default CartItemsList;