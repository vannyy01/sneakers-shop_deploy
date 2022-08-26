import * as  React from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import AdminModule from './admin/Admin';
import NavBar from './NavBar';
import Landing from './Main';
import {fetchUser} from '../actions';
import ProtectedRoute from "./ProtectedRoute";
import ProductPage from './productPage';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {UserInterface} from "../actions/types";

interface AppPropsI {
    fetchUser: any,
    user: UserInterface | null
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
        if (JSON.stringify(this.props.user) !== JSON.stringify(prevProps.user)) {
            this.setState({auth: !!this.props.user});
        }
    }

    public render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <BrowserRouter>
                    <div>
                        <NavBar/>
                        <div>
                            <Switch>
                                <Route path="/good/:id" component={ProductPage}/>
                                <Route exact={true} path="/" component={Landing}/>
                                {this.props.user !== null &&
                                    <ProtectedRoute
                                        authenticationPath="/auth/google"
                                        isAuthenticated={!!this.props.user}
                                        path='/admin'
                                        component={AdminModule}
                                    />
                                }
                            </Switch>
                        </div>
                    </div>
                </BrowserRouter>
            </MuiPickersUtilsProvider>
        )
    }
}

const mapStateToProps = ({auth: {user}}: { auth: { user: UserInterface | null, error: { message: string } | null } }): { user: UserInterface | null } => {
    return {user};
};
export default connect(mapStateToProps, {fetchUser})(App);