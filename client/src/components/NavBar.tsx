import * as React from 'react';
import {connect} from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Cart from './ShoppingCart';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {withStyles} from '@material-ui/core/styles';
import PollButton from './poll/PollButton';
import PollModal from './poll/PollModal';
import CartButton from './ShoppingCart/CartButton';


const styles = {
    aStyle: {
        color: 'white',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        fontSize: '1.125rem',
        fontWeight: 500,
        lineHeight: '1.16667em',
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
    auth?: any
}

class NavBar extends React.PureComponent<HeaderPropsI, { showCart: boolean, showModal: boolean }> {
    constructor(props: HeaderPropsI) {
        super(props);
        this.state = {
            showCart: false,
            showModal: false
        }
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
                    <CartButton openCart={this.handleCart}/>
                    <Cart handleCart={this.handleCart} showCart={this.state.showCart}/>
                    {this.renderContent()}
                </Toolbar>
            </AppBar>
        );
    }

    protected renderContent() {
        switch (!!this.props.auth) {
            case null:
                return 'Still logging';
            case false:
                return <Button className={this.props.classes.aStyle} href="/auth/google">Ввійти через
                    гугл</Button>;
            default:
                return <Button className={this.props.classes.aStyle} href="/api/logout">Вийти</Button>
        }
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

const mapStateToProps = ({auth}: any) => {
    return {auth};
};

export default connect(mapStateToProps)(withStyles(styles)(NavBar));