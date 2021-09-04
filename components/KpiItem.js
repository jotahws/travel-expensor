import React from 'react';
import { Image } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';

const KpiItem = props => {
    const colorScheme = useColorScheme();
    const styles = useStyle();
    const { onItemSelected = () => { }, selected } = props

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress} style={styles.summary}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.valuesContainer}>
                <Text style={styles.itemText}>{props.value1}</Text>
                <Text style={styles.itemText}> | </Text>
                <Text style={styles.itemText}>{props.value2}</Text>
            </View>
        </TouchableOpacity>
    );

    function useStyle() {
        return StyleSheet.create({
            summary: {
                backgroundColor: props.selected ? props.color : '#ddd',
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 10,
                marginHorizontal: 5,
                marginBottom: 15,
            },
            valuesContainer: {
                flexDirection: 'row'
            },
            title: {
                color: props.selected ? props.colorContrast : props.color,
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: 5
            },
            itemText: {
                color: props.selected ? props.colorContrast : '#555',
            }
        });
    }
}

export default KpiItem;