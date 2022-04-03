import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, createStore} from "redux";
import App from './components/App';

import reduxThunk from 'redux-thunk';
import reducers from './reducers';

import {Provider} from 'react-redux';

const store = createStore(reducers, applyMiddleware(reduxThunk));

ReactDOM.render(<Provider store={store}><App/></Provider>,
    document.getElementById('root')
);