import {createStyles, Theme} from "@material-ui/core";

export const CRUDStyles = (theme: Theme) => createStyles({
    alert: {
        marginTop: theme.spacing(7)
    },
    button: {
        margin: theme.spacing(1)
    },
    paper: {
        marginBottom: theme.spacing(3),
        marginTop: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginBottom: theme.spacing(6),
            marginTop: theme.spacing(6),
            padding: theme.spacing(3),
        },
        width: "60em"
    },
    root: {height: 27},
});

export default CRUDStyles;