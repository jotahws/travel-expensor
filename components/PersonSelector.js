import React from 'react';
import { Image } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
            <Text style={styles.label}>Quem é o pagador?</Text>
            {
                users.map((e, i) => (
                    <TouchableOpacity key={i} style={[styles.item, (selected?.id === e.id ? styles.selected : null)]} onPress={() => selectPayer(e)}>
                        <Image style={styles.image} source={{ uri: e.profilepic }} />
                        <Text style={styles.itemText}>{e.name}</Text>
                    </TouchableOpacity>
                ))
            }
            <View style={styles.hr} />
            <Text style={styles.label}>Com quem está sendo dividida essa despesa?</Text>
            <View style={styles.allBtnContainer}>
                <TouchableOpacity style={[styles.allBtn]} onPress={() => addAllSpliters()}>
                    <Text style={styles.itemText}>Selecionar Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.allBtn]} onPress={() => removeAllSpliters()}>
                    <Text style={styles.itemText}>Remover Todos</Text>
                </TouchableOpacity>
            </View>
            {
                users.map((e, i) => (
                    <View key={i}>
                        {selected?.id !== e.id &&
                            <TouchableOpacity style={[styles.item, (isSpliter(e.id) ? styles.selected : null)]} onPress={() => toggleSpliter(e)}>
                                <Image style={styles.image} source={{ uri: e.profilepic }} />
                                <Text style={styles.itemText}>{e.name}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                ))
            }
        </View >
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                marginTop: 10,
            },
            label: {
                fontSize: 16,
                color: Colors[colorScheme].text,
                paddingBottom: 10,
                paddingHorizontal: 10,
            },
            hr: {
                marginHorizontal: 10,
                marginVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: Colors[colorScheme].mutedFade
            },
            selected: {
                backgroundColor: Colors[colorScheme].tint,
            },
            item: {
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: Colors[colorScheme].mutedFade,
                // margin: 5,
                padding: 10,
                // borderRadius: 10,
                borderColor: Colors[colorScheme].muted,
                borderWidth: 0.5
            },
            itemText: {
                textAlign: 'center',
                color: Colors[colorScheme].text,
                fontSize: 18,
            },
            image: {
                height: 30,
                width: 30,
                borderRadius: 100,
                marginRight: 10,
            },
            allBtnContainer: {
                flexDirection: 'row',
                marginBottom: 5
            },
            allBtn: {
                flex: 1,
                backgroundColor: Colors[colorScheme].muted,
                margin: 5,
                padding: 7,
                borderRadius: 10,
            }
        });
    }
}

export default PersonSelector;