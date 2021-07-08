import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SwipableListItem from '../components/SwipableListItem';
import NumPad from '../components/NumPad';
import BottomSheet from '../components/BottomSheet';
import ExpenseContext from '../contexts/ExpenseContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DropdownAlert from 'react-native-dropdownalert';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import moment from 'moment'

export default function NewExpenseScreen() {
  const colorScheme = useColorScheme();
  const { expenseList, addExpense } = React.useContext(ExpenseContext);
  const [amount, setAmount] = React.useState('0.00');
  const alert = React.useRef();
  const styles = useStyle();

  maskAmount = text => {
    var masked = text.replace(/\D/g, '')
    masked = masked.replace(/^((00)|(0))/g, '')
    if (masked.length === 1) {
      masked = '00' + masked;
    } else if (masked.length === 2) {
      masked = '0' + masked;
    }
    masked = masked.replace(/^(\d*)(\d{2})$/, '$1.$2');
    setAmount(masked)
  }

  const handleAddExpense = () => {
    const currDate = new moment();
    const newExpense = {
      "amount": amount,
      "txid": currDate.valueOf(),
      "isInvoice": true,
      "date": currDate
    }
    if (amount && amount !== '0.00') {
      addExpense(newExpense);
      setAmount('0.00')
      alert.current.alertWithType('success', `€ ${amount}`, 'Adicionado!', undefined, 800);
    }
  }

  const removeLastNumber = () => {
    let backspaced = amount.slice(0, -1);
    if (backspaced === '0.0') {
      setAmount('0.00')
    } else {
      maskAmount(backspaced)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.amount}>{amount}</Text>
      <NumPad onType={number => maskAmount(amount + number)} onBackspace={removeLastNumber} onSend={handleAddExpense} />
      <DropdownAlert ref={alert} closeInterval={800} successImageSrc={require('../assets/images/check-mark.png')} />
    </View>
  );

  function useStyle() {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
      },
      amount: {
        color: Colors.text,
        fontSize: 70,
        textAlign: 'center',
      },
      btn: {
        backgroundColor: '#123456',
        color: 'white',
        padding: 15,
        marginTop: 20,
        textAlign: 'center',
        marginHorizontal: 60,
      }
    });
  }
}

