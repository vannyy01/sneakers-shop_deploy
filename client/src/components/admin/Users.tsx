import * as React from 'react';

import {connect} from "react-redux";
import GridView from '../GridView/index';

import {fetchUsers} from "../../actions";

interface UserInterface {
    googleID: string,
    email: string,
    _id: string,
    role: 0 | 10 | 20,
    __v: number
}

interface PropsInterface {
    users: UserInterface[] | [],
    fetchUsers: () => void
}

class Users extends React.Component<PropsInterface, any> {
    public componentDidMount() {
        this.props.fetchUsers();
    }

    public render() {
        console.log(this.props.users);
        if (this.props.users) {
            return <GridView idField="_id" data={this.props.users} title="Користувачі"/>
        }
        return <div>Loading...</div>
    }
}

const mapStateToProps = ({users}: any) => ({users});

export default connect(mapStateToProps, {fetchUsers})(Users);