import React from 'react';
import { Image } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';

const PersonSelector = props => {
    const colorScheme = useColorScheme();
    const styles = useStyle();
    const { users } = React.useContext(AuthContext)
    const { onItemSelected = () => { }, selected } = props

    return (
        <View style={styles.container}>
            {
                users.map((e, i) => (
                    <TouchableOpacity key={i} style={[styles.item, (selected?.id === e.id ? styles.selected : null)]} onPress={() => onItemSelected(e)}>
                        <Image style={styles.image} source={{ uri: e.profilepic }} />
                        <Text style={styles.itemText}>{e.name}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                flex: 1,
                alignItems: 'center',
                marginHorizontal: 10,
                marginTop: 10,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center'
            },
            selected: {
                backgroundColor: Colors[colorScheme].tint,
            },
            item: {
                alignItems: 'center',
                backgroundColor: '#eee',
                margin: 10,
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                width: 150
            },
            itemText: {
                textAlign: 'center',
                color: '#123456',
                fontSize: 18,
            },
            image: {
                height: 80,
                width: 80,
                borderRadius: 100,
                marginBottom: 10,
                borderColor: "#fff",
                borderWidth: 3
            }
        });
    }
}

export default PersonSelector;