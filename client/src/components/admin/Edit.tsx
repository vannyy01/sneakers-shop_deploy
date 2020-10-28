import * as React from 'react';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import {createStyles, Theme} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => createStyles({
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
    }
});

function AddressForm(props: { classes: {paper: string} }) {
    return (
        <Paper className={props.classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
            <React.Fragment>
                <Typography variant="h6" gutterBottom={true}>
                    Shipping address
                </Typography>
                <Grid container={true} spacing={3}>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="firstName"
                            name="firstName"
                            label="First name"
                            fullWidth={true}
                            autoComplete="given-name"
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="lastName"
                            name="lastName"
                            label="Last name"
                            fullWidth={true}
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item={true} xs={12}>
                        <TextField
                            required={true}
                            id="address1"
                            name="address1"
                            label="Address line 1"
                            fullWidth={true}
                            autoComplete="shipping address-line1"
                        />
                    </Grid>
                    <Grid item={true} xs={12}>
                        <TextField
                            id="address2"
                            name="address2"
                            label="Address line 2"
                            fullWidth={true}
                            autoComplete="shipping address-line2"
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="city"
                            name="city"
                            label="City"
                            fullWidth={true}
                            autoComplete="shipping address-level2"
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField id="state" name="state" label="State/Province/Region" fullWidth={true}/>
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="zip"
                            name="zip"
                            label="Zip / Postal code"
                            fullWidth={true}
                            autoComplete="shipping postal-code"
                        />
                    </Grid>
                    <Grid item={true} xs={12} sm={6}>
                        <TextField
                            required={true}
                            id="country"
                            name="country"
                            label="Country"
                            fullWidth={true}
                            autoComplete="shipping country"
                        />
                    </Grid>
                </Grid>
            </React.Fragment>
        </Paper>
    );
}

export default withStyles(styles)(AddressForm);