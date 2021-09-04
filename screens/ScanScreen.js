import { BarCodeScanner } from 'expo-barcode-scanner';
import * as React from 'react';
import { Button, StyleSheet, Text, View, Vibration, AppState } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { decodePTInvoice } from '../constants/util';
import ExpenseContext from '../contexts/ExpenseContext';
import DropdownAlert from 'react-native-dropdownalert';
import { LongPressGestureHandler } from 'react-native-gesture-handler';
import moment from 'moment';

export default function ScanScreen() {
  const { expenseList, addExpense } = React.useContext(ExpenseContext);
  const [hasPermission, setHasPermission] = React.useState(null);
  const [justScanned, setJustScanned] = React.useState(false);
  const alert = React.useRef();
  const [isFocus, setIsFocus] = React.useState(true);

  //-----------------------------------------
  //Request Camera permission
  React.useEffect(() => {
    async function requestPermission() {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    AppState.addEventListener("change", _handleAppStateChange);
    requestPermission()
    return () => {
      setIsFocus(false);
      AppState.removeEventListener("change", _handleAppStateChange);
    }
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState !== "active") {
      setIsFocus(false);
    } else {
      setIsFocus(true);
    }
  };

  //-------------------------------------------
  //Get expense object from QR code
  const handleBarCodeScanned = ({ type, data }) => {
    let scannedExpense = decodePTInvoice(data)
    scannedExpense.date = new moment()
    setJustScanned(true)
    if (!scannedExpense.isInvoice) {
      alert.current.alertWithType('error', ``, 'Recibo inválido!', undefined, 800);
      return;
    }
    //Check if expense has been added before 
    let newExp = true;
    expenseList.forEach(e => {
      if (e.txid === scannedExpense.txid) {
        newExp = false
        alert.current.alertWithType('error', ``, 'Compra repetida!', undefined, 800);
      }
    })
    if (newExp && Object.keys(scannedExpense).length !== 0) {
      Vibration.vibrate(400);
      const ok = addExpense(scannedExpense);
      if (ok) {
        alert.current.alertWithType('success', `€ ${amount}`, 'Adicionado!', undefined, 800);
      } else {
        alert.current.alertWithType('error', '', 'Erro ao adicionar!', undefined, 800);
      }
    }
  };

  //-----------------------------------------
  return (
    <View style={styles.container}>
      {
        hasPermission === null || hasPermission === false || !isFocus ?
          <Text>É preciso permissão para acessar a câmera</Text> :
          <BarCodeScanner
            onBarCodeScanned={justScanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
      }
      <DropdownAlert ref={alert} closeInterval={800} onClose={() => setJustScanned(false)} successImageSrc={require('../assets/images/check-mark.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
