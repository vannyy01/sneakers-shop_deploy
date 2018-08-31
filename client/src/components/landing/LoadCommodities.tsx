import * as React from 'react';

import classnames from "classnames";

import {Theme} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import RotateRight from '@material-ui/icons/RotateRight';

const styles = (theme: Theme) => createStyles({
    expand: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(360deg)',
    },
});

interface LoadCommoditiesPropsI {
    classes: {
        expand: string,
        expandOpen: string,
    },
    expanded: boolean,
    handleLoadClick: () => void,
    onTransitionEnd: () => void
}

const LoadCommodities = ({classes, expanded, handleLoadClick, onTransitionEnd}: LoadCommoditiesPropsI) => (
    <div className="d-flex justify-content-center">
        <div>
            <IconButton
                className={classnames(classes.expand, {
                    [classes.expandOpen]: expanded,
                })}
                style={{fontSize: 35}}
                onTransitionEnd={onTransitionEnd}
                onClick={handleLoadClick}
                aria-expanded={expanded}
                aria-label="Show more"
            >
                <RotateRight fontSize="inherit"/>
            </IconButton>
        </div>
    </div>
);

export default withStyles(styles)(LoadCommodities);