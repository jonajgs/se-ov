import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

function questionComponent({ navigator }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text>
                ¿ Te gustaria ... ?
            </Text>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <TouchableHighlight style={{ backgroundColor: '#102345', padding: 10, marginRight: 5 }}>
                    <Text>Si</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{ backgroundColor: '#102345', padding: 10, marginRight: 5 }}>
                    <Text>No se</Text>
                </TouchableHighlight>
                <TouchableHighlight style={{ backgroundColor: '#102345', padding: 10, marginRight: 5 }}>
                    <Text>No</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default questionComponent;
