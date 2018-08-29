import * as React from 'react';

import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import PeopleIcon from '@material-ui/icons/People';

import AdminMenu from './AdminMenu';

import {Theme, withStyles} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Route, Switch} from "react-router";
import Goods from "./Goods";
import Users from "./Users";

const drawerWidth = 200;

const styles = (theme: Theme) => createStyles({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    content: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        minWidth: 0, // So the Typography noWrap works
        padding: theme.spacing.unit * 3,
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

const AdminModule = (props: AdminModulePropsI) => {
    const {classes} = props;

    return (
        <div className={classes.root}>
            <AdminMenu classes={{drawerPaper: classes.drawerPaper, toolbar: classes.toolbar}} rows={[
                {
                    icon: <AddShoppingCart/>,
                    route: '/admin/goods',
                    title: 'Товари',
                },
                {
                    icon: <PeopleIcon/>,
                    route: `/admin/users`,
                    title: 'Користувачі'
                }
            ]}/>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                <Switch>
                    <Route path="/admin/goods" component={Goods}/>
                    <Route path="/admin/users" component={Users}/>
                </Switch>
            </main>
        </div>
    );
};

export default withStyles(styles)(AdminModule);