import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import AuthContext from './AuthContext';
import moment from 'moment';
import { vars } from '../env'

const CurrencyContext = createContext({});

export const CurrencyProvider = ({ children }) => {
    const [currencyList, setCurrencyList] = useState({});

    useEffect(() => {
        async function loadStorageData() {
            let currencies = await AsyncStorage.getItem('@RNAuth:currencies');
            if (currencies) {
                setCurrencyList(JSON.parse(currencies));
            }
            refreshCurrencies(JSON.parse(currencies));
        }
        loadStorageData();
    }, []);

    const clearCurrencies = () => {
        AsyncStorage.multiRemove(['@RNAuth:currencies']).then(() => {
            setCurrencyList({});
        });
    }

    const refreshCurrencies = async currCurrency => {
        if (!currCurrency || moment().subtract(1, 'days').isAfter(currCurrency?.date)) {
            try {
                let response = await fetch(
                    `http://data.fixer.io/api/latest?access_key=${vars.currencyAPIKey}`
                );
                let currencies = await response.json();
                await AsyncStorage.setItem('@RNAuth:currencies', JSON.stringify(currencies));
                setCurrencyList(currencies);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const convertCurrency = (amount, from, to) => {
        // const fromRate = currencyList.rates[from];
        // const toRate = currencyList.rates[to];
        // const base = currencyList.base;
        //TODO: deixar generico para todos os tipode de currency
        const converted = amount * currencyList.rates.BRL;
        return converted.toFixed(2)
    }

    return (
        <CurrencyContext.Provider value={{ currencies: currencyList, clearCurrencies, convertCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export default CurrencyContext;