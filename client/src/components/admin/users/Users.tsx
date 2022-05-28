import * as React from 'react';
import {connect} from "react-redux";
import GridView, {FilterListTypeArray} from '../../GridView';
import {
    fetchUsers as fetchItems,
    searchUsers as searchItems,
    clearUsersState as clearItemsState,
    deleteManyUsers as deleteManyItems
} from "../../../actions";
import {UserInterface} from "../../../actions/types";
import {roles} from "./BaseUser";
import {useEffect} from "react";

interface PropsInterface {
    users: UserInterface[],
    count: number,
    fetchUsers: (skip: number, limit: number, count: boolean) => void,
    searchUsers: (condition: string, skip: number, limit: number, count: boolean) => void,
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

const filterList: FilterListTypeArray<UserInterface> = {
    [headCells[0].id]: {
        filterName: headCells[0],
        filterLabel: "Роль",
        fields: roles
    }
};

const Users
    :
    React.FC<PropsInterface> = ({fetchUsers, searchUsers, clearUsersState, deleteManyUsers, users, count}) => {

    const usersCount = 10;

    useEffect(() => {
        const {searchParams} = new URL(window.location.href);
        searchParams.forEach((value, key) => {
            filterList[key].selectedOption = {
                label: filterList[key].fields[value].label,
                value
            };
        })
    }, []);

    const onDeleteCallback = (): void => {
        alert('Items are successfully deleted.');
        fetchUsers(0, usersCount, true);
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
        />
    )
};

const mapStateToProps = ({users: {users, count}}: any) => ({users, count});

export default connect(mapStateToProps, {
    fetchUsers: fetchItems,
    searchUsers: searchItems,
    clearUsersState: clearItemsState,
    deleteManyUsers: deleteManyItems
})(Users);