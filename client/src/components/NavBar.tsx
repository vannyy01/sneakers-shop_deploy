import * as React from 'react';
import {connect} from "react-redux";
import AppBar from '@material-ui/core/AppBar';
import Cart from './ShoppingCart';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import PollButton from './poll/PollButton';
import PollModal from './poll/PollModal';
import CartButton from './ShoppingCart/CartButton';
import {ShoeInterface, UserInterface} from "../actions/types";
import {getCartItems} from "../actions";
import AuthMenu from "./AuthMenu";


const styles = {
    aStyle: {
        color: 'white',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: '1.16667em',
        textDecoration: "none",
        '&:hover': {
            textDecoration: "none",
        }
    },
    flex: {
        flex: 1,
        top: '3em'
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    root: {
        backgroundColor: "#03A9F4",
        flexGrow: 1,
    },
};

interface HeaderPropsI {
    classes: {
        aStyle: string,
        root: string,
        flex: string,
        menuButton: string,
    },
    user?: UserInterface | null,
    getCartItems: () => void,
    cartItems: { [id: string]: ShoeInterface },
}

class NavBar extends React.PureComponent<HeaderPropsI, { showCart: boolean, showModal: boolean }> {
    constructor(props: HeaderPropsI) {
        super(props);
        this.state = {
            showCart: false,
            showModal: false
        }
    }

    public componentDidMount():void {
        this.props.getCartItems();
    }

    public render() {
        const modal = this.state.showModal ?
            (<PollModal onClick={this.handleShowModal}/>) : null;
        const {classes} = this.props;
        return (
            <AppBar position="fixed" className={classes.root}>
                <Toolbar>
                    <Typography variant="inherit" color="inherit" className={classes.flex}>
                        <a href='/' className={classes.aStyle}>
                            Sneakers-shop
                        </a>
                    </Typography>
                    <PollButton onClick={this.handleShowModal}/>
                    {modal}
                    <CartButton totalItems={Object.keys(this.props.cartItems).length} openCart={this.handleCart}/>
                    <Cart cartItems={this.props.cartItems} handleCart={this.handleCart} showCart={this.state.showCart}/>
                    <AuthMenu user={this.props.user}/>
                </Toolbar>
            </AppBar>
        );
    }



    protected handleCart = (): void => {
        this.setState(state => ({showCart: !state.showCart}))
    };
    protected handleShowModal = (): void => {
        if (this.state.showModal) {
            document.title = 'Sneakers-shop';
        }
        this.setState(state => ({showModal: !state.showModal}))
    };
}

const mapStateToProps = ({
                             auth: {user},
                             cartItems
                         }: { auth: { user: UserInterface | null }, cartItems: { [id: string]: ShoeInterface } }):
    { user: UserInterface | null, cartItems: { [id: string]: ShoeInterface } } => {
    return {user, cartItems};
};

export default connect(mapStateToProps, {getCartItems})(withStyles(styles)(NavBar));