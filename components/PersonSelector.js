import React from 'react';
import { Image } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import AuthContext from '../contexts/AuthContext';
import useColorScheme from '../hooks/useColorScheme';

const PersonSelector = props => {
    const colorScheme = useColorScheme();
    const styles = useStyle();
    const { users, spliters: contSpliters } = React.useContext(AuthContext)
    const [spliters, setSpliters] = React.useState(contSpliters);
    const { onPayerSelected = () => { }, onSpliterSelected = () => { }, selected } = props

    React.useEffect(() => {
        onSpliterSelected(spliters)
    }, [spliters])

    const selectPayer = payer => {
        setSpliters(spliters.filter((s, i) => (s.id !== payer.id)))
        onPayerSelected(payer)
    }

    const toggleSpliter = newSpliter => {
        const isDuplicate = spliters.includes(newSpliter)
        if (isDuplicate) {
            setSpliters(spliters.filter((s, i) => (s.id !== newSpliter.id)))
        } else {
            setSpliters([...spliters, newSpliter])
        }
    }

    const removeAllSpliters = () => {
        setSpliters([])
    }
    const addAllSpliters = () => {
        setSpliters(users.filter((u, i) => (u.id !== selected?.id)))
    }

    const isSpliter = id => {
        return !!spliters.filter((s, i) => (s.id === id)).length
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Pagador</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
                {
                    users.map((e, i) => (
                        <TouchableOpacity key={i} style={[styles.userItem, (selected?.id === e.id ? styles.selected : null)]} onPress={() => selectPayer(e)}>
                            <Image style={styles.userImage} source={{ uri: e.profilepic }} />
                            <Text style={styles.userName}>{e.name}</Text>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
            <View style={styles.hr} />
            <Text style={styles.label}>Dividir com</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
                {
                    users.map((e, i) => (
                        <View key={i}>
                            {selected?.id !== e.id &&
                                <TouchableOpacity style={[styles.userItem, (isSpliter(e.id) ? styles.selected : null)]} onPress={() => toggleSpliter(e)}>
                                    <Image style={styles.userImage} source={{ uri: e.profilepic }} />
                                    <Text style={styles.userName}>{e.name}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    ))
                }
            </ScrollView>
            <View style={styles.allBtnContainer}>
                <TouchableOpacity style={[styles.allBtn]} onPress={() => addAllSpliters()}>
                    <Text style={styles.itemText}>Selecionar Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.allBtn]} onPress={() => removeAllSpliters()}>
                    <Text style={styles.itemText}>Remover Todos</Text>
                </TouchableOpacity>
            </View>
        </View >
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                marginTop: 10,
                paddingHorizontal: 15,
            },
            label: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: Colors[colorScheme].text
            },
            hr: {
                marginHorizontal: 10,
                marginVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: Colors[colorScheme].mutedFade
            },
            selected: {
                backgroundColor: Colors[colorScheme].tintLight,
            },
            allBtnContainer: {
                flexDirection: 'row',
                marginBottom: 5
            },
            allBtn: {
                flex: 1,
                margin: 5,
                padding: 7,
                borderRadius: 10,
            },
            itemText: {
                fontSize: 16,
                color: Colors[colorScheme].muted,
                textAlign: 'center',
            },
            userList: {
                flexDirection: 'row',
                marginHorizontal: -15,
                paddingHorizontal: 15,
            },
            userItem: {
                marginRight: 5,
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                padding: 5,
            },
            userImage: {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: Colors[colorScheme].muted,
                borderWidth: 2,
                borderColor: Colors[colorScheme].background
            },
            userName: {
                fontSize: 12,
                color: Colors[colorScheme].text,
                marginTop: 5
            },
        });
    }
}

export default PersonSelector;