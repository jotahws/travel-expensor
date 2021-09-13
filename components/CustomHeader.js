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
            {
                props.hasLeftButton&&
                <TouchableOpacity onPress={props.pop} style={styles.backbtn}>
                    <Ionicons name="ios-arrow-back" size={30} color={Colors[colorScheme].tint} />
                </TouchableOpacity>
            }
            <View style={styles.header}>
                <Text style={styles.title}>{props.title}</Text>
                <View style={styles.emptySpace} />
            </View>
        </SafeAreaView>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                flexDirection: 'row',
				backgroundColor: Colors[colorScheme].background,
                alignItems: 'center',
            },
            header: {
                padding: 13,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            },
            title: {
                fontSize: 18,
                color: Colors[colorScheme].tint,
                fontWeight: '600',
                fontSize: 22
             },
            emptySpace: {
                width: 30
            },
            backbtn: {
                paddingLeft: 20,
            }
        });
    }
}
export default CustomHeaderContent;