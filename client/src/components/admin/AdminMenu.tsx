import * as React from 'react';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";

interface RowArrayI {
    icon: JSX.Element,
    route: string,
    title?: string
}

interface AdminMenuPropsI {
    classes: {
        drawerPaper: string,
        toolbar: string
    },
    rows: RowArrayI[],
    props?: any
}

const AdminMenu = ({classes, rows, props}: AdminMenuPropsI) =>
    <Drawer
        variant="permanent"
        classes={{
            paper: classes.drawerPaper,
        }}
        {...props}
    >
        <div className={classes.toolbar}/>
        <List>
            {rows.map((row, index) =>
                <Link key={index} to={row.route}>
                    <ListItem button={true}>
                        <ListItemIcon>
                            {row.icon}
                        </ListItemIcon>
                        {typeof row.title === 'undefined' ?
                            null :
                            <ListItemText inset={true} primary={row.title}/>
                        }
                    </ListItem>
                </Link>
            )}
        </List>
        <Divider/>
    </Drawer>;

export default AdminMenu;