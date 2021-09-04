import * as React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
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
  const [description, setDescription] = React.useState('');

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
      "date": currDate,
      "description": description
    }
    if (amount && amount !== '0.00') {
      const ok = addExpense(newExpense);
      if (ok) {
        setAmount('0.00')
        setDescription('')
        alert.current.alertWithType('success', `€ ${amount}`, 'Adicionado!', undefined, 800);
      } else {
        alert.current.alertWithType('error', '', 'Erro ao adicionar!', undefined, 800);
      }
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
      <View style={styles.descContainer}>
        <Text style={styles.description}>{description}</Text>
        {
          !!description ?
            <TouchableOpacity style={styles.descriptionBtn} onPress={() => setDescription('')} activeOpacity={.7}>
              <Text style={styles.descriptionBtnText}>{"Remover descrição"}</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.descriptionBtn} onPress={() => Alert.prompt('Descrição', 'Insira a descrição do gasto', text => setDescription(text))} activeOpacity={.7}>
              <Text style={styles.descriptionBtnText}>{"Add descrição"}</Text>
            </TouchableOpacity>
        }
      </View>
      <NumPad onType={number => maskAmount(amount + number)} onBackspace={removeLastNumber} onSend={handleAddExpense} />
      <DropdownAlert ref={alert} closeInterval={800} successImageSrc={require('../assets/images/check-mark.png')} />
    </View>
  );

  function useStyle() {
    return StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors[colorScheme].background
      },
      amount: {
        color: Colors[colorScheme].text,
        fontSize: 70,
        textAlign: 'center',
      },
      descContainer: {
        alignItems: 'center',
      },
      descriptionBtn: {
        backgroundColor: '#123456',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 100
      },
      descriptionBtnText: {
        color: "#fff",
        fontSize: 16
      },
      description: {
        color: Colors[colorScheme].text,
        marginBottom: 10,
        marginHorizontal: 30,
        textAlign: 'center'
      }
    });
  }
}

