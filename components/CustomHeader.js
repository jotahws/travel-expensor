import React, { useContext } from 'react';
import { Text, StyleSheet, View, SafeAreaView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';


const CustomHeaderContent = (props) => {
    const colorScheme = useColorScheme();
    const styles = useStyle();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{props.title}</Text>
                <View style={styles.emptySpace} />
            </View>
        </SafeAreaView>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
				backgroundColor: Colors[colorScheme].background
            },
            header: {
                padding: 13,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            title: {
                fontSize: 18,
                color: '#CA9D87',
                fontWeight: '600',
                fontSize: 22
             },
            emptySpace: {
                width: 30
            }
        });
    }
}
export default CustomHeaderContent;