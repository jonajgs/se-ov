import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Navigation from './Navigation';
import store from '../store';

class Main extends Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}

export default Main;
