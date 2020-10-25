import * as React from "react";

import {Theme, withStyles} from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";


const styles = (theme: Theme) => createStyles({
    content: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        minWidth: 700, // So the Typography noWrap works
        padding: theme.spacing(3),
        width: "100%"
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
        content: string,
        root: string,
        toolbar: string,
    }
}

const Default = (props: AdminModulePropsI) => {
    const {classes} = props;

    return (
        <div className={classes.root}>
            <main className={classes.content}/>
        </div>
    );
};

export default withStyles(styles)(Default);