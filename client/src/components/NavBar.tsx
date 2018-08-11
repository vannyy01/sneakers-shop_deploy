import * as React from 'react';
import {connect} from "react-redux";

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import {withStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";

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

interface HeaderI {
    classes: {
        aStyle: string,
        root: string,
        flex: string,
        menuButton: string,
    },
    auth: any
}

class NavBar extends React.Component<HeaderI> {
    public render() {
        console.log(this.props.auth);
        const {classes} = this.props;
        return (
            <AppBar position="fixed" className={classes.root}>
                <Toolbar>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        <Link to='/bag' className={classes.aStyle}>
                            Sneakers-shop
                        </Link>
                    </Typography>
                    {this.renderContent()}
                </Toolbar>
            </AppBar>
        );
    }

    private renderContent() {
        switch (this.props.auth) {
            case null:
                return 'Still logging';
            case false:
                return <Button className={this.props.classes.aStyle} href="/auth/google">Війти через
                    гугл</Button>;
            default:
                return <Button className={this.props.classes.aStyle} href="/api/logout">Вийти</Button>
        }
    }
}

const mapStateToProps = ({auth}: any) => {
    return {auth};
};

export default connect(mapStateToProps)(withStyles(styles)(NavBar));