import * as _ from "lodash";
import * as React from "react";
import {RefObject} from "react";
import {connect} from "react-redux";
import {deleteCartItem, getCartItems} from "../../actions";
import {ShoeInterface} from "../../actions/types";
import Button from '@material-ui/core/Button';
import {Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import {findDOMNode} from "react-dom";

import Done from '@material-ui/icons/Done';

import withStyles from "@material-ui/core/styles/withStyles";

import './Cart.css';
import {map} from "lodash";
import CartItemsList from "./CartItemsList";

interface CartPropsI {
    deleteCartItem: (id: string) => void,
    cartItems: { [id: string]: ShoeInterface },
    classes: {
        actionBlock: string,
        active: string,
        button: string,
        cartItems: string,
        count: string,
        paragraph: string
        rightIcon: string,
    },
    handleCart: () => void,
    showCart: boolean,
}

interface CartStateI {
    cart: { [id: string]: ShoeInterface },
    totalAmount: number,
    totalItems: number,
}

const styles = (theme: Theme) => createStyles({
    actionBlock: {
        background: '#fff',
        bottom: 0,
        padding: '16px',
        position: 'absolute',
        top: '312px',
        width: '87%'
    },
    active: {
        boxShadow: '0 10px 20px rgba(0,0,0,.19), 0 6px 6px rgba(0,0,0,.23)',
        display: 'block',
        height: '464px',
        position: 'absolute',
        top: 55,
        zIndex: 2
    },
    button: {
        margin: theme.spacing(1),
    },
    cartItems: {
        height: '320px',
        width: '360px'
    },
    count: {
        backgroundColor: "lavender",
        margin: '8px',
        paddingBottom: '0px !important',
        paddingLeft: '0.25em !important',
        paddingRight: '0.25em !important',
        paddingTop: '0.25em !important',
    },
    paragraph: {
        color: 'black',
        fontSize: 14
    },
    rightIcon: {
        marginLeft: theme.spacing(1),
    }
});

class Cart extends React.PureComponent<CartPropsI, CartStateI> {
    private readonly cartPreview: RefObject<any>;

    constructor(props: CartPropsI) {
        super(props);
        this.state = {
            cart: props.cartItems,
            totalAmount: 0,
            totalItems: 0
        };
        this.cartPreview = React.createRef();
    }

    public componentDidMount() {
        window.addEventListener(
            "click",
            this.handleClickOutside,
            true
        );
    }

    public componentWillUnmount() {
        window.removeEventListener(
            "click",
            this.handleClickOutside,
            true
        );
    }


    public componentDidUpdate() {
        this.setState(() => ({cart: this.props.cartItems}));
        this.sumTotalItems();
        this.sumTotalAmount();
    }

    public render() {
        const {classes} = this.props;
        if (this.props.showCart) {
            return (
                <div
                    className={"cart-preview " + classes.active}
                    ref={this.cartPreview}
                >
                    <CartItemsList cartItems={this.state.cart} removeCartItem={this.handleRemoveProduct}/>
                    <div className={classes.actionBlock}>
                        <div className={classes.count + " rounded"}>
                            <div className={classes.paragraph + "  p-1 d-flex justify-content-between"}>
                                <b>Загальна сумма</b>
                                <span style={{margin: '0 2px 0 5px'}}>{this.state.totalAmount} грн.</span>
                            </div>
                            <div className={classes.paragraph + " p-1 d-flex justify-content-between"}>
                                <b>Усього товарів</b>
                                <span style={{margin: '0 2px 0 5px'}}>{this.state.totalItems} шт.</span>
                            </div>
                        </div>
                        <Button type='button' size="large" disabled={_.isEmpty(this.state.cart)}
                                variant="contained" color="primary" className={classes.button}>
                            Купити
                            <Done className={classes.rightIcon}/>
                        </Button>
                    </div>
                </div>
            );
        }
        return <div style={{visibility: 'hidden'}}/>;
    }

    protected sumTotalItems = (): void => {
        this.setState(state => ({
            totalItems: Object.keys(state.cart).length
        }));
    };

    protected sumTotalAmount = (): void => {
        let total = 0;
        map(this.state.cart, item =>
            total += item.price
        );
        this.setState(() => ({
            totalAmount: total
        }));
    };

    protected handleRemoveProduct = (id: string) => (): void => {
        this.props.deleteCartItem(id);
    };

    protected handleClickOutside = (event: any): void => {
        const cartNode = findDOMNode(this.cartPreview.current);
        if (this.props.showCart) {
            if (!cartNode || !cartNode.contains(event.target)) {
                this.props.handleCart();
                event.stopPropagation();
            }
        }
    };

    /*  protected handleScroll(event: any) {
          console.log(event);
          const positions = this.refs.scrollbars.getValues();
          //When the bottom is reached, and we're scrolling down, prevent scrolling of the window
          if (positions.top >= 1) {
              console.log("Reached scroll end!");
              event.stopPropagation();
          }
      } */
}

export default connect(null, {getCartItems, deleteCartItem})(withStyles(styles)(Cart));