import React, { useEffect, useState } from 'react';
import { Avatar, createStyles, Divider, IconButton, makeStyles, Menu, MenuItem, Tooltip } from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { Settings, ExitToApp as Logout, AccountCircle } from "@material-ui/icons";
import { UserInterface } from "../actions/types";
import SingInUp from "./SingIn";
import SingInWindow from "./SingIn/SingInWindow";
import SingUpWindow from "./SingIn/SingUpWindow";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => createStyles({
    link: {
        color: 'inherit',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        textDecoration: "none",
        "&:hover": {
            textDecoration: "none"
        }
    },
    userMenu: {
        top: "55px !important",
        '&::before': {
            content: "''",
            display: 'block',
            backgroundColor: "#fff",
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
        },
    },
    userAvatar: {
        width: 32,
        height: 32,
        marginLeft: -4,
        marginRight: 8
    }
})
);

const AuthMenu: React.FC<{ user: UserInterface }> = ({ user }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [showSingIn, setShowSingIn] = useState<boolean>(false);
    const [showSingUp, setShowSingUp] = useState<boolean>(false);
    const classes = useStyles();

    useEffect(() => {
        window.addEventListener("keydown", toggleModal);
        return () => {
            window.removeEventListener("keydown", toggleModal);
        };
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
        if (!!user) {
            !open && setAnchorEl(event.currentTarget);
        } else {
            setShowSingIn(true);
        }
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const handleCloseSign = (event?: React.MouseEvent): void => {
        event && event.preventDefault();
        setShowSingUp(false);
        setShowSingIn(false);
    };

    const toggleModal = (event: KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as KeyboardEvent).key === 'Escape')
        ) {
            setShowSingIn(false);
            setShowSingUp(false);
        }
    };

    const handleShowSingUp = (event: React.MouseEvent): void => {
        event.preventDefault();
        setShowSingIn(false);
        setShowSingUp(true);
    };

    const handleShowSingIn = (event: React.MouseEvent): void => {
        event.preventDefault();
        setShowSingUp(false);
        setShowSingIn(true);
    };

    const onSignUpCallback = (): void => {
        alert("Вітаємо, Вас зареєстровано.");
        setShowSingUp(false);
        setShowSingIn(true);
    };

    const renderContent = (): string | JSX.Element => {
        if (!!user) {
            return (
                <a href="/api/logout" className={classes.link}>
                    <MenuItem>
                        <ListItemIcon style={{ minWidth: 36 }}>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Вийти
                    </MenuItem>
                </a>
            )

        } else if (!!user === null) {
            return 'Still logging';
        }
        return null;
    }

    return (
        <>
            {showSingIn && <SingInUp>
                <SingInWindow goSingUp={handleShowSingUp} onClose={handleCloseSign} />
            </SingInUp>}
            {showSingUp && <SingInUp>
                <SingUpWindow goSingIn={handleShowSingIn} onClose={handleCloseSign}
                    onSignUpCallback={onSignUpCallback} />
            </SingInUp>}
            <Tooltip title={user ? "Мій профіль" : "Увійти"}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <AccountCircle style={{ color: "#fff" }} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    className: classes.userMenu
                }}
            >
                {user &&
                    <MenuItem>
                        <Avatar
                            className={classes.userAvatar}>{user.givenName[0] + user.familyName[0]}</Avatar>
                        {user.givenName + " " + user.familyName}
                    </MenuItem>}
                <Divider />
                {user &&
                    <Link to={`/client/${user._id}`}>
                        <MenuItem>
                            <ListItemIcon style={{ minWidth: 36 }}>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Мій профіль
                        </MenuItem>
                    </Link>
                }
                {user?.role === 20 &&
                    <a href="/admin" className={classes.link}>
                        <MenuItem>
                            <ListItemIcon style={{ minWidth: 36 }}>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            Налаштування сайту
                        </MenuItem>
                    </a>}
                {renderContent()}
            </Menu>
        </>
    )
}

export default AuthMenu;