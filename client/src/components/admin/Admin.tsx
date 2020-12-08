import * as React from 'react';

import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import Bookmark from '@material-ui/icons/Bookmark';
import Payment from '@material-ui/icons/Payment';
import AdminMenu from './AdminMenu';
import {Theme, withStyles} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Route, Switch} from "react-router-dom";
import Default from "./Default";
import Edit from "./EditGood";
import Goods from "./Goods";
import Users from "./Users";
import CreateGood from "./CreateGood";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";

const drawerWidth = 250;

const styles = (theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    content: {
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'center',
        minHeight: '100vh',
        minWidth: 0, // So the Typography noWrap works
        padding: '3vh',
        paddingTop: '8vh',
    },
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    root: {
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
    },
    toolbar: theme.mixins.toolbar,
});

interface AdminModulePropsI {
    classes: {
        appBar: string,
        content: string,
        drawerPaper: string,
        root: string,
        toolbar: string,
    }
}

function AdminModule(props: AdminModulePropsI) {
    const {classes} = props;

    return (
        <div className={classes.root}>
            <AdminMenu classes={{drawerPaper: classes.drawerPaper, toolbar: classes.toolbar}} rows={[
                {
                    icon: <AddShoppingCart/>,
                    route: '/admin/goods',
                    title: 'Склад',
                },
                {
                    icon: <PeopleIcon/>,
                    route: `/admin/users`,
                    title: 'Користувачі'
                },
                {
                    icon: <Bookmark/>,
                    route: `/`,
                    title: 'Замовлення'
                },
                {
                    icon: <Payment/>,
                    route: `/`,
                    title: 'Оплата'
                }
            ]}/>
            <main className={classes.content}>
                <Switch>
                    <Route path="/" exact={true} component={Default}/>
                    <Route path="/admin/goods" exact={true} component={Goods}/>
                    <Route path="/admin/goods/create" component={CreateGood}/>
                    <Route path="/admin/goods/edit/:commID" component={Edit}/>
                    <Route path="/admin/users" exact={true} component={Users}/>
                    <Route path="/admin/users/create" component={CreateUser}/>
                    <Route path="/admin/users/edit/:userID" component={EditUser}/>
                    <Route path="/admin/orders" component={Default}/>
                    <Route path="/admin/payments" component={Default}/>
                </Switch>
            </main>
        </div>
    );
}

export default withStyles(styles)(AdminModule);