import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usersAPI } from '../api'
import { Alert } from 'react-native';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        getUsers();
        async function loadStorageData() {
            const user = await AsyncStorage.getItem('@RNAuth:user');
            setLoggedUser(JSON.parse(user));
            setLoading(false);
        }
        loadStorageData();
    }, []);

    //Chama API de Login
    async function signIn(user) {
        setLoading(true);
        console.log(` ${JSON.stringify(user)}`);
        await AsyncStorage.setItem('@RNAuth:user', JSON.stringify(user));
        setLoggedUser(user)
        setLoading(false);
    }

    //Chama a API de logout e remove os dados do storage
    function signOut() {
        AsyncStorage.clear().then(() => {
            setLoggedUser(null);
        });
    }

    const getUsers = async () => {
        try {
            const response = await fetch(usersAPI, { method: 'GET' });
            const json = await response.json();
            setUserList(json);
        } catch (error) {
            Alert.alert("Erro", error.toString(),
                [{ text: "Tentar novamente", onPress: refreshExpenseList }]
            );
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ user: loggedUser, signIn, signOut, loading, users: userList }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;