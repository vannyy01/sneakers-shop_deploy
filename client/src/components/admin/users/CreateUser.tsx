import {BaseUser, PropsTypeUser, StateTypeUser} from "./BaseUser";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {UserInterface} from "../../../actions/types";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core";
import {createUser} from "../../../actions";
import CRUDStyles from "../crudStyles";

interface CreateUserProps extends PropsTypeUser {
    createUser: (user: UserInterface, callback: () => void) => void;
}

class CreateUser extends BaseUser<CreateUserProps, StateTypeUser> {
    constructor(props:CreateUserProps) {
        super(props);
        this.state = this.defaultState();
    }

    public render() {
        return <Paper className={this.props.classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Користувач
            </Typography>
            {this.baseRender('Створення')}
        </Paper>
    }

    protected handleSave(): void {
        this.props.createUser(this.state.user,
            () => this.props.history.push('/admin/users'));
    }

    protected handleDelete(): void {
        this.setState(this.defaultState());
    };
}

export default connect(null, {createUser})(withStyles(CRUDStyles)(CreateUser));