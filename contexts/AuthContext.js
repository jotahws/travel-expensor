import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usersAPI } from '../api'
import { Alert } from 'react-native';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [payer, setPayer] = useState(null);
    const [spliters, setSpliters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        getUsers();
        async function loadStorageData() {
            const user = await AsyncStorage.getItem('@RNAuth:user');
            setPayer(JSON.parse(user));
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function selectPayer(user) {
        setLoading(true);
        console.log(` ${JSON.stringify(user)}`);
        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(user));
        setPayer(user)
        setLoading(false);
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setPayer(null);
        });
    }

    const getUsers = async () => {
        try {
            const response = await fetch(usersAPI, { method: 'GET' });
            const json = await response.json();
            setUserList(json);
        } catch (error) {
            Alert.alert("Erro", error.toString(),
                [{ text: "Tentar novamente", onPress: getUsers }]
            );
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user: payer, spliters, setSpliters, setPayer: selectPayer, signOut, loading, users: userList }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;