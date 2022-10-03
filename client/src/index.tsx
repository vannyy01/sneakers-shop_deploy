import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from "redux";
import App from './components/App';

import reduxThunk from 'redux-thunk';
import reducers from './reducers';

import {Provider} from 'react-redux';
import {DevSupport} from "@react-buddy/ide-toolbox";
import ComponentPreviews from "./dev/previews";
import {useInitial} from "./dev";

export const url = new URL(window.location.href);
const store = createStore(reducers, applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store={store}><DevSupport ComponentPreviews={ComponentPreviews}
                                                    useInitialHook={useInitial}
    >
        <App/>
    </DevSupport></Provider>,
    document.getElementById('root')
);