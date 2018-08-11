import * as  React from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route} from 'react-router-dom';
import NavBar from './NavBar';

import Landing from './Landing';

import {fetchUser} from '../actions';

import 'bootstrap/dist/css/bootstrap.min.css';

import 'animate.css/animate.min.css';

const CashBag = () => <h2>Cash Bag</h2>;

interface AppI {
    fetchUser: any
}

class App extends React.Component<AppI> {
    public componentDidMount() {
        this.props.fetchUser();
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <div>
                        <Route exact={true} path="/" component={Landing}/>
                        <Route path="/bag" component={CashBag}/>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

export default connect<{}, AppI>(null, {fetchUser})(App);