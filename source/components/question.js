import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { next } from '../actions/inferenceMachine';

function questionComponent({ navigator, question, _next }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{color: '#fff'}}>
                { 'Se cumple ' + question.get('description') + ' ?' }
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <TouchableHighlight
                    onPress={() => {
                        _next('yes', navigator);
                    }}
                    style={{ backgroundColor: '#102345', padding: 10, marginRight: 5 }}
                >
                    <Text style={{color: '#fff'}}>Si</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => {
                        _next('no', navigator);
                    }}
                    style={{ backgroundColor: '#102345', padding: 10, marginRight: 5 }}
                >
                    <Text style={{color: '#fff'}}>No</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default connect(
    state => ({
        question: state.inferenceMachine.question,
    }),
    dispatch => ({
        _next: (answer, nav) => {
            dispatch(next(answer, nav));
        },
    })
)(questionComponent);
