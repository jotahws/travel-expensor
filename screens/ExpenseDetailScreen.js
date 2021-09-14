import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import KpiItem from '../components/KpiItem';
import ExpenseContext from '../contexts/ExpenseContext';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Image } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br'
import { color, lessThan } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../contexts/AuthContext';
import BottomSheet from '../components/BottomSheet';

moment.locale('pt-br')

const DetailScreen = ({ route, navigation }) => {
    const colorScheme = useColorScheme();
    const { expenseList, refreshExpenseList, updateExpense } = useContext(ExpenseContext);
    const { users } = useContext(AuthContext)
    const [user, setUser] = useState(route.params.user)
    const [description, setDescription] = useState(route.params.description)
    const [date, setDate] = useState(route.params.date)
    const [amount, setAmount] = useState(route.params.amount)
    const [spliters, setSpliters] = useState(route.params.spliters)
    const [txid, setTxid] = useState(route.params.txid)
    const [spliterList, setSpliterList] = useState(users.filter(u => u.id !== user.id))
    const styles = useStyle();
    const [inputAmount, setInputAmount] = useState(amount.toFixed(2))
    const [inputDescription, setInputDescription] = useState(description)
    const [updating, setUpdating] = useState(false)
    const [openVarAmount, setOpenVarAmount] = useState(false)

    useEffect(() => {
        setSpliterList(users.filter(u => u.id !== user.id))
        setSpliters(spliters.filter(u => u.id !== user.id))
    }, [user])

    const maskAmount = text => {
        var masked = text.replace(/\D/g, '')
        masked = masked.replace(/^((00)|(0))/g, '')
        if (masked.length === 1) {
            masked = '00' + masked;
        } else if (masked.length === 2) {
            masked = '0' + masked;
        }
        masked = masked.replace(/^(\d*)(\d{2})$/, '$1.$2');

        if (!masked) masked = '0.00';
        setInputAmount(masked)
    }

    const toggleSpliter = (spliter) => {
        const oldSpliter = spliters.findIndex(s => s.id === spliter.id)
        const newSpliters = spliters.filter(s => s.id !== spliter.id)
        if (oldSpliter < 0) {
            newSpliters.push(spliter)
        }
        setSpliters(newSpliters)
    }

    const handleSave = async () => {
        const newExpense = route.params;
        newExpense.user = user;
        newExpense.amount = inputAmount;
        newExpense.spliters = spliters;
        newExpense.description = inputDescription;

        setUpdating(true);
        const success = await updateExpense(newExpense)
        setUpdating(false);
        if (success)
            navigation.pop()
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.info}>{moment(date).format('DD/MM/YYYY')}</Text>
                <Text style={styles.label}>Pago por</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
                    {
                        users.map((e, i) => (
                            <TouchableOpacity key={i} style={[styles.userItem, (e.id === user.id && styles.selectedItem)]} onPress={() => { setUser(e) }}>
                                <Image style={styles.userImage} source={{ uri: e.profilepic }} />
                                <Text style={styles.userName}>{e.name}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
                <Text style={styles.label}>Montante</Text>
                <TextInput style={styles.input} placeholder="Montante" onChangeText={maskAmount} value={inputAmount} keyboardType={'decimal-pad'} />
                <Text style={styles.label}>Descrição </Text>
                <TextInput style={styles.input} placeholder="Descrição" onChangeText={setInputDescription} value={inputDescription} />
                <Text style={styles.label}>A dividir a despesa com</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userList}>
                    {
                        spliterList.map((e, i) => (
                            <View key={i}>
                                <TouchableOpacity key={i} style={[styles.userItem, (spliters.findIndex(s => s.id === e.id) > -1 && styles.selectedItem)]} onPress={() => toggleSpliter(e)}>
                                    <Image style={styles.userImage} source={{ uri: e.profilepic }} />
                                    <Text style={styles.userName}>{e.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                </ScrollView>
                {/* <TouchableOpacity style={styles.buttonSecondary} onPress={() => setOpenVarAmount(true)}>
                    <Text style={styles.buttonTextSecondary}>Usar valores específicos</Text>
                </TouchableOpacity> */}
            </ScrollView>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                {
                    updating ?
                        <ActivityIndicator animating={true} size="small" color={Colors[colorScheme].text} />
                        :
                        <Text style={styles.buttonText}>Salvar</Text>
                }
            </TouchableOpacity>
            <BottomSheet open={openVarAmount} changeStateCallback={isOpen => setOpenVarAmount(isOpen)} full >
                <ScrollView>
                    {
                        spliters.map((e, i) => (
                            <View key={i} style={styles.varAmountItem}>
                                <View>
                                    <Image style={styles.userImage} source={{ uri: e.profilepic }} />
                                    <Text style={styles.userName}>{e.name}</Text>
                                </View>
                                <TouchableOpacity style={styles.btnCircle} onPress={() => {}}>
                                    <Text style={styles.btnCircleText}>+</Text>
                                </TouchableOpacity>
                                <Text style={styles.userName}>{e.name}</Text>
                                <TouchableOpacity style={styles.btnCircle} onPress={() => {}}>
                                    <Text style={styles.btnCircleText}>-</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    }
                    <TouchableOpacity style={styles.buttonSecondary} onPress={() => { setOpenVarAmount(false) }}>
                        <Text style={styles.buttonTextSecondary}>OK</Text>
                    </TouchableOpacity>
                </ScrollView>
            </BottomSheet>
        </>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                flex: 1,
                paddingTop: 10,
                paddingHorizontal: 15,
                backgroundColor: Colors[colorScheme].background
            },
            label: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: Colors[colorScheme].text
            },
            input: {
                borderColor: Colors[colorScheme].muted,
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
                fontSize: 18,
                color: Colors[colorScheme].text
            },
            button: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: Colors[colorScheme].tint,
                padding: 10,
                marginBottom: 20,
                marginHorizontal: 15,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center'
            },
            buttonText: {
                color: Colors[colorScheme].background,
                fontSize: 20,
            },
            buttonSecondary: {
                backgroundColor: Colors[colorScheme].mutedFade,
                padding: 10,
                marginBottom: 20,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center'
            },
            buttonTextSecondary: {
                color: Colors[colorScheme].text,
                fontSize: 16,
            },
            info: {
                fontSize: 16,
                color: Colors[colorScheme].tint,
                fontWeight: 'bold',
                textAlign: 'center'
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
            selectedItem: {
                backgroundColor: Colors[colorScheme].tintLight
            },
            varAmountItem: {
                flexDirection: 'row',
                marginHorizontal: 15,
            }
        });
    }
}

export default DetailScreen;