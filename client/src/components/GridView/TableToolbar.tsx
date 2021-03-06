import * as React from 'react';

import classNames from "classnames";
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {Theme, withStyles} from "@material-ui/core/styles";
import {lighten} from '@material-ui/core/styles/colorManipulator';
import createStyles from "@material-ui/core/styles/createStyles";
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Add from '@material-ui/icons/Add';
import {NavLink} from "react-router-dom";

const toolbarStyles = (theme: Theme) => createStyles({
    actions: {
        color: theme.palette.text.secondary,
        display: 'flex'
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
                color: theme.palette.secondary.main,
            }
            : {
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.text.primary,
            },
    root: {
        paddingRight: theme.spacing(1),
    },
    spacer: {
        flex: '1 1 100%',
    },
    title: {
        flex: '0 0 auto',
    },
});

interface EnhancedTableToolbarPropsI {
    classes: {
        actions: string,
        highlight: string,
        spacer: string,
        root: string,
        title: string
    },
    numSelected: number,
    title: string,
    location: string
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarPropsI) => {
    const {numSelected, classes, title, location} = props;
    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle2">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="subtitle1" id="tableTitle">
                        {title}
                    </Typography>
                )}
            </div>
            <div className={classes.spacer}/>
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                ) : (
                    <React.Fragment>
                        <Tooltip title="Створити новий запис">
                            <NavLink to={location}>
                                <IconButton aria-label="Створити новий запис">
                                <Add/>
                            </IconButton>
                            </NavLink>
                        </Tooltip>
                        <Tooltip title="Filter list">
                            <IconButton aria-label="Filter list">
                                <FilterListIcon/>
                            </IconButton>
                        </Tooltip>
                    </React.Fragment>
                )}
            </div>
        </Toolbar>
    );
};


export default withStyles(toolbarStyles)(EnhancedTableToolbar);