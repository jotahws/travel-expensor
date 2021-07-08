import React, { Component } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const SwipableListItem = props => {
    const swipe = React.useRef();

    const renderRightActions = (progress, dragX) => {
        return (
            <RectButton style={styles.button} onPress={() => {swipe.current.close(); props.onDelete();}}>
                <Animated.Text style={styles.actionText}>
                    Apagar
                </Animated.Text>
            </RectButton>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions} ref={swipe} onSwipeableWillOpen={props.closeOthers}>
            {props.children}
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionText: {
        color: 'white',
        padding:10

    }
});


export default SwipableListItem;