import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { connect } from 'react-redux';

import { start } from '../actions/inferenceMachine';
import { push } from '../actions/navigation';
import Question from './question';

function homeComponent({ navigator, _start, _push }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <TouchableHighlight
                underlayColor={'transparent'}
                onPress={() => {
                    _start(navigator);
                }}
            >
                <Text style={{color: '#fff'}}>Iniciar Test</Text>
            </TouchableHighlight>
        </View>
    );
};

export default connect(
    null,
    dispatch => ({
        _start: (nav) => {
            dispatch(start(nav));
        },
    })
)(homeComponent)
