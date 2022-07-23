import React from 'react';
import {Button, Card, CardActions, CardContent, Typography} from "@material-ui/core";
import {NavLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import {SiteOptionType} from "../../../actions/types";

const useStyles = makeStyles(() => createStyles({
    root: {
        maxWidth: 300,
        width: 250,
        marginTop: 50,
    },
    description: {
        fontSize: "1rem"
    },
    link: {
        textDecoration: "none !important"
    },
    button: {
        fontWeight: 500,
        color: "rgb(25 118 210) !important",
    }
}));

const SiteOptionCard: React.FC<{ option: SiteOptionType }> = ({option: {name, label, description}}) => {
    const classes = useStyles();
    return (
        <Card className={"d-flex flex-column justify-content-between col-sm-6 " + classes.root} variant="outlined">
            <CardContent>
                <Typography variant="h5" component="h2">
                    {label}
                </Typography>
                <Typography color="textSecondary">
                    {name}
                </Typography>
                <Typography className={classes.description} variant="body2" component="p">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <NavLink className={classes.link}  to={`/admin/options/edit/${name}`}>
                    <Button className={classes.button} size="medium">Змінити</Button>
                </NavLink>
            </CardActions>
        </Card>
    );
}

export default SiteOptionCard;