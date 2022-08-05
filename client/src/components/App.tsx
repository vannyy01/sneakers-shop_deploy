import * as  React from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AdminModule from './admin/Admin';
import NavBar from './NavBar';

import Landing from './Main';

import {fetchUser} from '../actions';

import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from "./ProtectedRoute";
import ProductPage from './productPage';


interface AppPropsI {
    fetchUser: any,
    auth: object | ''
}

class App extends React.PureComponent<AppPropsI, { auth?: boolean }> {
    constructor(props: AppPropsI) {
        super(props);
        this.state = {
            auth: false
        }
    }

    public componentDidMount() {
        document.title = 'Sneakers-shop';
        this.props.fetchUser();
        //  this.setState({auth: !!this.props.auth});
    }

    public componentDidUpdate(prevProps: Readonly<AppPropsI>): void {
        if (JSON.stringify(this.props.auth) !== JSON.stringify(prevProps.auth)) {
            this.setState({auth: !!this.props.auth});
        }
    }

    public render() {
        return (
            <BrowserRouter>
                <div>
                    <NavBar/>
                    <div>
                        <Switch>
                            <Route path="/good/:id" component={ProductPage}/>
                            <Route exact={true} path="/" component={Landing}/>
                            {this.props.auth !== null &&
                            <ProtectedRoute
                                authenticationPath="/auth/google"
                                isAuthenticated={!!this.props.auth}
                                path='/admin'
                                component={AdminModule}
                            />
                            }
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}

const mapStateToProps = ({auth}: any) => {
    return {auth};
};
export default connect(mapStateToProps, {fetchUser})(App);