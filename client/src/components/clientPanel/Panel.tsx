import React from 'react';
import { NavLink, Route, Switch, useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import HomeIcon from '@material-ui/icons/Home';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { UserData } from './UserData';
import { Orders } from './Orders';
import { useLinkStyles, useSelectedLinkStyles } from '../commonStyles';

const Panel: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [selectedItem, setSelectedItem] = React.useState<string>("user_data");
    const linkStyles = useLinkStyles();
    const activeLinkStyles = useSelectedLinkStyles();
    const handleListItemClick = (item: string) => {
        setSelectedItem(item);
    };

    return (
        <section className="container" style={{ marginTop: 100 }}>
            <div className="d-flex flex-column flex-md-row">
                <List component="nav" aria-label="main mailbox folders" style={{minWidth: 240}}>
                    <NavLink className={selectedItem === "user_data" ? activeLinkStyles.selected : linkStyles.link} isActive={() => selectedItem === "user_data"} to={`/client/${id}`}>
                        <ListItem button selected={selectedItem === "user_data"} onClick={() => handleListItemClick("user_data")}>
                            <ListItemIcon>
                                <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary="Мої данні" />
                        </ListItem>
                    </NavLink>
                    <NavLink className={selectedItem === "addresses" ? activeLinkStyles.selected : linkStyles.link} isActive={() => selectedItem === "addresses"} to={`/client/${id}/addresses`}>
                        <ListItem button selected={selectedItem === "addresses"} onClick={() => handleListItemClick("addresses")}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Мої адреси" />
                        </ListItem>
                    </NavLink>
                    <NavLink className={selectedItem === "orders" ? activeLinkStyles.selected : linkStyles.link} isActive={() => selectedItem === "orders"} to={`/client/${id}/orders`}>
                        <ListItem button selected={selectedItem === "orders"} onClick={() => handleListItemClick("orders")}>
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Мої замовлення" />
                        </ListItem>
                    </NavLink>
                    <NavLink className={selectedItem === "seen" ? activeLinkStyles.selected : linkStyles.link} isActive={() => selectedItem === "seen"} to={`/client/${id}/seen`}>
                        <ListItem button selected={selectedItem === "seen"} onClick={() => handleListItemClick("seen")}>
                            <ListItemIcon>
                                <VisibilityIcon />
                            </ListItemIcon>
                            <ListItemText primary="Переглянуті товари" />
                        </ListItem>
                    </NavLink>
                </List>
                <Switch>
                    <Route path={`/client/${id}`} component={() => <UserData id={id} />} />
                    {/* <Route path={`/client/${id}/user_data/edit`} component={() => <EditUserData/>} /> */}
                    <Route exact path={`/client/${id}/orders`} component={Orders} />
                    {/* <Redirect to={`/client/${id}/user_data`} /> */}
                </Switch>
            </div>
        </section>
    )
};

export default Panel;  