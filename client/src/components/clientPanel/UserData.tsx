import { isEmpty } from 'lodash';
import React, { useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import { fetchUserByID } from 'src/actions';
import { UserInterface } from 'src/actions/types';
import EditUserData from './EditUserData';
import ViewUserData from './ViewUserData';

export const UserData: React.FC<{ id: string }> = ({ id }) => {
    const dispatch = useDispatch();
    const getSelector = ({ users: { users } }: { users: { users: UserInterface } }): UserInterface => { return users[0] };
    const client: UserInterface = useSelector(getSelector, shallowEqual);

    useEffect(() => {
        dispatch(fetchUserByID(id));
    }, [dispatch]);

    return (
        !isEmpty(client) &&
        <>
            <Switch>
                <Route exact path={`/client/${id}`} component={() => <ViewUserData client={client} />} />
                <Route path={`/client/${id}/user_data/edit`} component={() => <EditUserData client={client} />} />
            </Switch>
        </>
    )
}
