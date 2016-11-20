import React from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { connect } from 'react-redux';

import Question from './question';
import { push } from '../actions/navigation';

function homeComponent({ navigator }) {
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
                    navigator.push({
                        component: Question,
                    });
                }}
            >
                <Text>Iniciar Test</Text>
            </TouchableHighlight>
        </View>
    );
};

export default homeComponent
