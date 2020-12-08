import * as React from 'react';

import {connect} from "react-redux";
import GridView from '../GridView/index';

import {fetchUsers} from "../../actions";
import {UserInterface} from "../../actions/types";

interface PropsInterface {
    users: UserInterface[],
    fetchUsers: () => void
}
interface HeadCell {
    disablePadding: boolean;
    id: keyof UserInterface;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    { id: 'role', numeric: true, disablePadding: false, label: 'Роль' },
    { id: 'googleID', numeric: false, disablePadding: true, label: 'GoogleID' },
    { id: 'email', numeric: false, disablePadding: true, label: 'Ел.Пошта' },
    { id: 'givenName', numeric: false, disablePadding: true, label: "Ім'я" },
    { id: 'familyName', numeric: false, disablePadding: true, label: 'Прізвище' },
];


class Users extends React.Component<PropsInterface, any> {
    public componentDidMount() {
        this.props.fetchUsers();
    }

    public render() {
        if (this.props.users.length > 0) {
            return <GridView idField="_id" createLocationPath='/admin/users/create' editRoute='/admin/users/edit' data={this.props.users}
                             headCells={headCells} title="Користувачі"/>
        }
        return <div>Loading...</div>
    }
}

const mapStateToProps = ({users}: any) => ({users});

export default connect(mapStateToProps, {fetchUsers})(Users);