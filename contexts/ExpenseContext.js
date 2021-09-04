import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import AuthContext from './AuthContext';
import CurrencyContext from './CurrencyContext';

const ExpenseContext = createContext({});

export const ExpenseProvider = ({ children }) => {
    const [loadingExpenses, setLoading] = useState(true);
    const [expenseList, setExpenseList] = useState([]);
    const { user } = React.useContext(AuthContext)
    const { convertCurrency } = React.useContext(CurrencyContext)

    useEffect(() => {
        refreshExpenseList();
    }, []);

    const addExpense = async expense => {
        expense.user = user;
        expense.convertedAmount = convertCurrency(expense.amount);
        console.log(JSON.stringify(expense));
        await AsyncStorage.setItem('@RNAuth:expenses', JSON.stringify([...expenseList, expense]));
        setExpenseList([...expenseList, expense]);
    }

    const clearExpenses = () => {
        AsyncStorage.multiRemove(['@RNAuth:expenses']).then(() => {
            setExpenseList([]);
        });
    }

    const removeExpense = async expense => {
        const newArray = expenseList.filter(function (el) {
            return el.txid != expense.txid;
        });
        await AsyncStorage.setItem('@RNAuth:expenses', JSON.stringify(newArray));
        setExpenseList(newArray);
    }

    const refreshExpenseList = async expense => {
        let expenses = await AsyncStorage.getItem('@RNAuth:expenses');
        if (expenses) {
            setExpenseList(JSON.parse(expenses));
        }
    }

    return (
        <ExpenseContext.Provider value={{ expenseList, addExpense, clearExpenses, removeExpense, loadingExpenses, refreshExpenseList }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export default ExpenseContext;