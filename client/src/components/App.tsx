import * as  React from 'react';
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import AdminModule from './admin/Admin';
import NavBar from './NavBar';
import Landing from './Main';
import { fetchUser, logout } from '../actions';
import ProtectedRoute from "./ProtectedRoute";
import ProductPage from './productPage';
import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { UserInterface } from "../actions/types";
import Panel from './clientPanel/Panel';

interface AppPropsI {
    fetchUser: () => void,
    logout: () => void,
    user: UserInterface | null
}

class App extends React.PureComponent<AppPropsI, { auth: boolean }> {
    constructor(props: AppPropsI) {
        super(props);
        this.state = {
            auth: false
        }
    }

    public componentDidMount() {
        document.title = 'Sneakers-shop';
        this.props.fetchUser();
        // window.addEventListener("beforeunload", this.alertUser);
        // window.addEventListener("unload", this.handleUnload);
    }

    // public componentWillUnmount() {
    //     window.removeEventListener("beforeunload", this.alertUser);
    //     window.removeEventListener("unload", this.handleUnload);
    // }

    // public alertUser = (e: BeforeUnloadEvent) => {
    //     e.preventDefault()
    //     e.returnValue = ''
    // }

    // public handleUnload = (event: Event): void => {
    //     event.preventDefault();
    //     this.props.logout();
    // }

    public render() {
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <BrowserRouter>
                    <div>
                        <NavBar />
                        <Switch>
                            <Route path="/good/:id" component={ProductPage} />
                            <Route exact={true} path="/" component={Landing} />
                            {this.props.user !== null &&
                                <>
                                    <ProtectedRoute
                                        authenticationPath="/auth/google"
                                        isAuthenticated={Boolean(this.props.user)}
                                        path='/admin'
                                        component={AdminModule}
                                    />

                                    <ProtectedRoute
                                        authenticationPath="/auth/google"
                                        path="/client/:id" 
                                        component={Panel}
                                        isAuthenticated={Boolean(this.props.user)} />
                                </>
                            }
                        </Switch>
                    </div>
                </BrowserRouter>
            </MuiPickersUtilsProvider>
        )
    }
}

const mapStateToProps = ({ auth: { user } }: { auth: { user: UserInterface | null, error: { message: string } | null } }): { user: UserInterface | null } => {
    return { user };
};
export default connect(mapStateToProps, { fetchUser, logout })(App);