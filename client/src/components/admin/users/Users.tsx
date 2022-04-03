import * as React from 'react';
import {connect} from "react-redux";
import GridView from '../../GridView';
import {fetchUsers as fetchItems, clearUsersState as clearItemsState, deleteManyUsers as deleteManyItems} from "../../../actions";
import {UserInterface} from "../../../actions/types";

interface PropsInterface {
    users: UserInterface[],
    count: number,
    fetchUsers: (skip: number, limit: number, count: boolean) => void,
    clearUsersState: () => void,
    deleteManyUsers: (users: string[], onSuccessCallback: () => void) => void
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof UserInterface;
    label: string;
    numeric: boolean;
}

const headCells: HeadCell[] = [
    {id: 'role', numeric: true, disablePadding: false, label: 'Роль'},
    {id: 'googleID', numeric: false, disablePadding: true, label: 'GoogleID'},
    {id: 'email', numeric: false, disablePadding: true, label: 'Ел.Пошта'},
    {id: 'givenName', numeric: false, disablePadding: true, label: "Ім'я"},
    {id: 'familyName', numeric: false, disablePadding: true, label: 'Прізвище'},
];


const Users: React.FC<PropsInterface> = ({fetchUsers, clearUsersState, deleteManyUsers, users, count}) => {

    const usersCount = 10;

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchUsers(0, usersCount, true);
    }

    return (
        <GridView
            idField="_id"
            createLocationPath='/admin/users/create'
            editRoute='/admin/users/edit'
            rowsCount={usersCount}
            count={count}
            data={users}
            fetchItems={fetchUsers}
            clearItems={clearUsersState}
            deleteItems={[deleteManyUsers, onDeleteCallback]}
            deleteMessage="Ви справді хочете видалити виділених користувачів?"
            deleteButtons={["Скасувати", "Видалити"]}
            headCells={headCells} title="Користувачі"
        />
    )
};

const mapStateToProps = ({users: {users, count}}: any) => ({users, count});

export default connect(mapStateToProps, {fetchUsers: fetchItems, clearUsersState: clearItemsState, deleteManyUsers: deleteManyItems})(Users);