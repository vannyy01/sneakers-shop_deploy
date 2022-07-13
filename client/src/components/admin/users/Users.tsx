import * as React from 'react';
import {connect} from "react-redux";
import GridView, {FilterListTypeArray, SearchItemParameters} from '../../GridView';
import {
    fetchUsers as fetchItems,
    searchUsers as searchItems,
    clearUsersState as clearItemsState,
    deleteManyUsers as deleteManyItems
} from "../../../actions";
import {UserInterface} from "../../../actions/types";
import {roles} from "./BaseUser";
import {HeadCell} from "../../types";

interface PropsInterface {
    users: UserInterface[],
    count: number,
    fetchUsers: ({skip, limit, count, fields}: {
                     skip: number,
                     limit: number,
                     count: boolean,
                     fields?: string[]
                 },
                 filters?: SearchItemParameters) => void,
    searchUsers?: (condition: string,
                   skip: number,
                   limit: number,
                   count: boolean,
                   fields?: string[],
                   filters?: SearchItemParameters) => void,
    clearUsersState: () => void,
    deleteManyUsers: (users: string[], onSuccessCallback: () => void) => void
}

const Users: React.FC<PropsInterface> = ({
                                             fetchUsers,
                                             searchUsers,
                                             clearUsersState,
                                             deleteManyUsers,
                                             users,
                                             count
                                         }) => {

    const usersCount = 10;
    const headCells: Array<HeadCell<UserInterface>> = [
        {id: 'role', numeric: true, disablePadding: false, label: 'Роль'},
        {id: 'googleID', numeric: false, disablePadding: true, label: 'GoogleID'},
        {id: 'email', numeric: false, disablePadding: true, label: 'Ел.Пошта'},
        {id: 'givenName', numeric: false, disablePadding: true, label: "Ім'я"},
        {id: 'familyName', numeric: false, disablePadding: true, label: 'Прізвище'},
    ];
    const filterList: FilterListTypeArray<UserInterface> = {
        [headCells[0].id]: {
            filterName: headCells[0],
            filterLabel: "Роль",
            fields: roles
        }
    };

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchUsers({skip: 0, limit: usersCount, count: true});
    }

    return (
        <GridView
            idField="_id"
            filterList={filterList}
            createLocationPath='/admin/users/create'
            editRoute='/admin/users/edit'
            rowsCount={usersCount}
            count={count}
            data={users}
            fetchItems={fetchUsers}
            searchItems={searchUsers}
            clearItems={clearUsersState}
            deleteItems={[deleteManyUsers, onDeleteCallback]}
            deleteMessage="Ви справді хочете видалити виділених користувачів?"
            deleteButtons={["Скасувати", "Видалити"]}
            headCells={headCells} title="Користувачі"
            searchFieldPlaceholder="Email, ім'я, прізвище"
        />
    )
};

const mapStateToProps = ({users: {users, count}}: { users: { users: UserInterface[], count: number } }) => ({
    users,
    count
});

export default connect(mapStateToProps, {
    fetchUsers: fetchItems,
    searchUsers: searchItems,
    clearUsersState: clearItemsState,
    deleteManyUsers: deleteManyItems
})(Users);