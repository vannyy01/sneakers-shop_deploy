import * as React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";


export interface ProtectedRouteProps extends RouteProps {
    authenticationPath: string;
    isAuthenticated: boolean;
}

export default class ProtectedRoute extends Route<ProtectedRouteProps> {

    public render() {
        let redirectPath: string = '';
        if (!this.props.isAuthenticated) {
            redirectPath = this.props.authenticationPath;
        }

        if (redirectPath) {
            const renderComponent = () => (<Redirect to={{pathname: redirectPath}}/>);
            return <Route {...this.props} component={renderComponent}/>;
        }
        return <Route {...this.props}/>;

    }

}
