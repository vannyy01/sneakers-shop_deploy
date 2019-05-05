import * as _ from "lodash";
import * as React from "react";
import {RefObject} from "react";
import {connect} from "react-redux";
import {deleteCartItem, getCartItems} from "../../actions";
import {ShoeInterface} from "../../actions/types";

import Scrollbars from "react-custom-scrollbars";

import Button from '@material-ui/core/Button';

import {Theme} from "@material-ui/core";
import CartItem from './CartItem';

import createStyles from "@material-ui/core/styles/createStyles";
import {findDOMNode} from "react-dom";

import Done from '@material-ui/icons/Done';

import withStyles from "@material-ui/core/styles/withStyles";

import './Cart.css';

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
    getCartItems: () => void,
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
        top: '48px',
        zIndex: 2
    },
    button: {
        margin: theme.spacing.unit,
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
        marginLeft: theme.spacing.unit,
    }
});

const EmptyCart = () => (<div>Ваша корзина пуста :(</div>);

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
        this.props.getCartItems();
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
                    <Scrollbars style={{width: 360, height: 320}}>
                        {!this.state.cart ? <EmptyCart/> :
                            _.map(this.state.cart, (item, index) =>
                                <CartItem key={index}
                                          product={item}
                                          productID={index}
                                          removeProduct={this.handleRemoveProduct}/>
                            )
                        }
                    </Scrollbars>
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
                        <Button size="large" disabled={_.isEmpty(this.state.cart)}
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
        _.map(this.state.cart, item =>
            total += item.price
        );
        this.setState(() => ({
            totalAmount: total
        }));
    };

    protected handleRemoveProduct = (id: string) => (event: React.MouseEvent<HTMLDivElement>): void => {
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
          //When the bottom is reached and we're scrolling down, prevent scrolling of the window
          if (positions.top >= 1) {
              console.log("Reached scroll end!");
              event.stopPropagation();
          }
      } */
}

const mapStateToProps = ({cartItems}: any) => ({cartItems});

export default connect(mapStateToProps, {getCartItems, deleteCartItem})(withStyles(styles)(Cart));