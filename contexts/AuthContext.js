import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [loggedUser, setLoggedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    return (
        <AuthContext.Provider value={{ user: loggedUser, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;