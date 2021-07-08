import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

// import { Container } from './styles';

const NumPad = props => {
    const colorScheme = useColorScheme();
    const styles = useStyle();

    return (
        <View style={styles.container}>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(1)}>
                    <Text style={styles.btnText}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(2)}>
                    <Text style={styles.btnText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(3)}>
                    <Text style={styles.btnText}>3</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(4)}>
                    <Text style={styles.btnText}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(5)}>
                    <Text style={styles.btnText}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(6)}>
                    <Text style={styles.btnText}>6</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(7)}>
                    <Text style={styles.btnText}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(8)}>
                    <Text style={styles.btnText}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(9)}>
                    <Text style={styles.btnText}>9</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.btn, styles.btnWarning]} onPress={props.onBackspace}>
                <Ionicons size={30} name="arrow-back-outline" color={'#000'} style={styles.btnText} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => props.onType(0)}>
                    <Text style={styles.btnText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnSuccess]} onPress={props.onSend}>
                    <Ionicons size={30} name="checkmark-circle-outline" color={'#000'} style={styles.btnText} />
                </TouchableOpacity>
            </View>
        </View>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                flex: 1,
                maxHeight: 100 * 4,
                marginHorizontal: 30,
                marginVertical: 40
            },
            btnRow: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
            },
            btn: {
                backgroundColor: Colors[colorScheme].tintLight,
                padding: 10,
                width: 80,
                height: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 90,
                margin: 10
            },
            btnText: {
                fontSize: 30,
                fontWeight: '200',
                textAlign: 'center',
                alignSelf: 'center'
            },
            btnSuccess: {
                backgroundColor: '#87CA9D'
            },
            btnWarning: {
                backgroundColor: '#ddd'
            }
        });
    }
}



export default NumPad;