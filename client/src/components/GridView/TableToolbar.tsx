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

const toolbarStyles = (theme: Theme) => createStyles({
    actions: {
        color: theme.palette.text.secondary,
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
        paddingRight: theme.spacing.unit,
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
    title: string
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarPropsI) => {
    const {numSelected, classes, title} = props;
    return (
        <Toolbar
            className={classNames(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subheading">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="title" id="tableTitle">
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
                    <Tooltip title="Filter list">
                        <IconButton aria-label="Filter list">
                            <FilterListIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};


export default withStyles(toolbarStyles)(EnhancedTableToolbar);