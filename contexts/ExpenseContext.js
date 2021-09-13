import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import AuthContext from './AuthContext';
import CurrencyContext from './CurrencyContext';
import { expensesAPI } from '../api'

const ExpenseContext = createContext({});

export const ExpenseProvider = ({ children }) => {
    const [loadingExpenses, setLoading] = useState(true);
    const [expenseList, setExpenseList] = useState([]);
    const { user, spliters } = React.useContext(AuthContext)
    const { convertCurrency } = React.useContext(CurrencyContext)

    useEffect(() => {
        refreshExpenseList();
    }, []);

    const addExpense = async expense => {
        expense.user = user;
        expense.spliters = spliters;
        expense.convertedAmount = convertCurrency(expense.amount);
        const response = await fetch(expensesAPI,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
        if (response.ok)
            refreshExpenseList();
        return response.ok;
    }

    const removeExpense = async expense => {
        const newArray = expenseList.filter(function (el) {
            return el.txid != expense.txid;
        });
        try {
            const response = await fetch(`${expensesAPI}/${expense._id}`, { method: 'DELETE' });
            if (!response.ok) throw Error(response.statusText)
            setExpenseList(newArray);
        } catch (error) {
            Alert.alert("Erro", error.toString());
            console.error(error);
        }
    }

    const updateExpense = async expense => {
        console.log(expense);
        try {
            await setTimeout(() => {
            }, 1000);
            const response = await fetch(`${expensesAPI}/${expense._id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(expense)
                });
            if (!response.ok) throw Error(response.statusText)
            refreshExpenseList();
            return true;
        } catch (error) {
            Alert.alert("Erro", error.toString());
            console.error(error);
        }
    }

    const refreshExpenseList = async expense => {
        try {
            const response = await fetch(expensesAPI, { method: 'GET' });
            const json = await response.json();
            setExpenseList(json);
        } catch (error) {
            Alert.alert("Erro", error.toString(),
                [{ text: "Tentar novamente", onPress: refreshExpenseList }]
            );
            console.error(error);
        }
    }

    return (
        <ExpenseContext.Provider value={{ expenseList, addExpense, removeExpense, loadingExpenses, refreshExpenseList, updateExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
}

export default ExpenseContext;