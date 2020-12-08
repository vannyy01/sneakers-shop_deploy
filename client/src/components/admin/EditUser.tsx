import {BaseUser, PropsTypeUser, StateTypeUser} from "./BaseUser";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {UserInterface} from "../../actions/types";
import {GoodStyles as UserStyles} from "./BaseGood";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core";
import {deleteUser, fetchUserByID, updateUser} from "../../actions";

interface EditUserProps extends PropsTypeUser {
    updateUser: (user: UserInterface, callback: () => void) => void;
    fetchUserByID: (id: string) => void,
    deleteUser: (id: string, callback: () => void) => void,
    user: UserInterface;
}

class EditUser extends BaseUser<EditUserProps, StateTypeUser> {
    public componentDidMount() {
        this.props.fetchUserByID(this.props.match.params.userID);
        this.setState({user: this.props.user})
    }

    public componentDidUpdate(prevProps: Readonly<EditUserProps>, prevState: Readonly<StateTypeUser>): void {
        if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
            this.setState({user: this.props.user})
        }
    }

    public render() {
        if (this.state.user.hasOwnProperty('_id')) {
            return <Paper className={this.props.classes.paper}>
                <Typography component="h1" variant="h4" align="center">
                    Користувач
                </Typography>
                {this.baseRender('Оновлення', {deleteButton: {renderDialog: true}})}
            </Paper>
        }
        return <div>Loading...</div>;
    }

    protected handleDelete(): void {
        this.props.deleteUser(this.state.user._id,
            () => this.props.history.push('/admin/users'));

    }

    protected handleSave(): void {
        this.props.updateUser(this.state.user,
            () => this.props.history.push('/admin/users'));
    }
}

const mapStateToProps = ({users}: { users: UserInterface }) => ({user: users});

export default connect(mapStateToProps, {fetchUserByID, updateUser, deleteUser})(withStyles(UserStyles)(EditUser));