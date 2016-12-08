import React, { Component } from 'react';
import { Text, Navigator, TouchableHighlight, View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import Home from '../components/home';
import Question from '../components/question';
import { init } from '../actions/inferenceMachine';

const navigationBarRouteMapper = {
    LeftButton: (route, navigator, index, navState) => {
        if(route.index === 0) {
            return null;
        }
        return (
            <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => {
                    navigator.pop();
                }}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    marginLeft: 10,
                }}
            >
                <Text style={{color: '#fff'}}>Salir</Text>
            </TouchableHighlight>
        );
    },
    RightButton: (route, navigator, index) => {
        return null;
    },
    Title: (route, navigator, index) => {
        return (
            <TouchableHighlight
                underlayColor={'transparent'}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 20, color: '#fff' }}>
                    {route.title}
                </Text>
            </TouchableHighlight>
        );
    }
};

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            initialRoute: {
                title: 'Inicio',
                index: 0,
                component: Home,
            },
        };
        StatusBar.setBarStyle('light-content', true);
        StatusBar.setBackgroundColor('#102345', true);
        this.renderScene = this.renderScene.bind(this);
        this.configureScene = this.configureScene.bind(this);
        props._init();
    }

    componentWillReceiveProps(next) {
        next.inferenceMachine.navigator.push({
            component: Question,
        });
    }

    renderScene(route, navigator) {
        return (
            <route.component
                navigator={navigator}
                route={route}
            />
        );
    }

    configureScene(route) {
        if(route.SceneConfig) {
            return route.SceneConfig;
        }
        return Navigator.SceneConfigs.FloatFromRight;
    }

    render() {
        const { initialRoute } = this.state;
        return (
            <Navigator
                initialRoute={initialRoute}
                renderScene={this.renderScene}
                style={{ backgroundColor: '#1E4383' }}
                configureScene={this.configureScene}
                navigationBar={
                    <Navigator.NavigationBar
                        style={{
                            backgroundColor: '#102345', height: 56
                        }}
                        routeMapper={navigationBarRouteMapper}
                    />
                }
            />
        );
    }
}

export default connect(
    state => state,
    dispatch => ({
        _init: () => {
            dispatch(init());
        },
    })
)(Navigation);
