import * as  React from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AdminModule from './admin/Admin';
import NavBar from './NavBar';

import Landing from './Landing';

import {fetchUser} from '../actions';

import 'bootstrap/dist/css/bootstrap.min.css';

interface AppPropsI {
    fetchUser: any
}

class App extends React.Component<AppPropsI, any> {
    public componentDidMount() {
        this.props.fetchUser();
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <div>
                        <Switch>
                            <Route exact={true} path="/" component={Landing}/>
                            <Route path="/admin" component={AdminModule}/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default connect<any, AppPropsI>(null, {fetchUser})(App);