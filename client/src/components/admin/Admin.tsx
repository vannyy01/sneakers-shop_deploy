import * as React from 'react';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import Bookmark from '@material-ui/icons/Bookmark';
import Payment from '@material-ui/icons/Payment';
import AdminMenu from './AdminMenu';
import {Theme, makeStyles} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Route, Switch} from "react-router-dom";
import SiteOptions from "./site_options/SiteOptions";
import Edit from "./goods/EditGood";
import Goods from "./goods/Goods";
import Users from "./users/Users";
import CreateGood from "./goods/CreateGood";
import CreateUser from "./users/CreateUser";
import EditUser from "./users/EditUser";
import SiteOptionEdit from "./site_options/SiteOptionEdit";

const useStyles = makeStyles((theme: Theme) => createStyles({
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
        width: 250,
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
}));

const routes = [
    {
        icon: <Payment/>,
        route: `/admin`,
        title: 'Налаштування сайту'
    },
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
    }
];

function AdminModule() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AdminMenu classes={{drawerPaper: classes.drawerPaper, toolbar: classes.toolbar}} rows={routes}/>
            <main className={classes.content}>
                <Switch>
                    <Route path="/admin" exact={true} component={SiteOptions}/>
                    <Route path="/admin/options/edit/:optionName" component={SiteOptionEdit}/>
                    <Route path="/admin/goods" exact={true} component={Goods}/>
                    <Route path="/admin/goods/create" component={CreateGood}/>
                    <Route path="/admin/goods/edit/:commID" component={Edit}/>
                    <Route path="/admin/users" exact={true} component={Users}/>
                    <Route path="/admin/users/create" component={CreateUser}/>
                    <Route path="/admin/users/edit/:userID" component={EditUser}/>
                    <Route path="/admin/orders" component={SiteOptions}/>
                    <Route path="/admin/payments" component={SiteOptions}/>
                </Switch>
            </main>
        </div>
    );
}

export default AdminModule;