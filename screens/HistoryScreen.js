import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SwipableListItem from '../components/SwipableListItem';
import KpiItem from '../components/KpiItem';
import ExpenseContext from '../contexts/ExpenseContext';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Image } from 'react-native';
import moment from 'moment';
import '../node_modules/moment/locale/pt-br'
import { users } from '../constants/Users'

moment.locale('pt-br')

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const { expenseList, clearExpenses, removeExpense } = React.useContext(ExpenseContext);
  const styles = useStyle();
  const [selectedKpi, setSelectedKpi] = React.useState(null)
  const [filteredList, setFilteredList] = React.useState([])

  React.useEffect(() => {
    setFilteredList(expenseList.sort((a, b) => a.date?.toString() < b.date?.toString()))
  }, [expenseList])

  React.useEffect(() => {
    if (selectedKpi)
      setFilteredList(expenseList.filter(e => e.user?.id === selectedKpi).sort((a, b) => a.date?.toString() < b.date?.toString()))
    else
      setFilteredList(expenseList.sort((a, b) => a.date?.toString() < b.date?.toString()))

  }, [selectedKpi])

  const renderExpense = ({ item }) => (
    <SwipableListItem onDelete={() => deleteExpense(item)}>
      <View style={styles.listItem}>
        <View style={styles.leftContainer}>
          <Image style={styles.image} source={item.user?.profilepic} />
          <View style={styles.listItemTexts}>
            <Text style={styles.amountText}>€ {item.amount}</Text>
            <Text style={styles.userText}> ~R$ {item.convertedAmount}</Text>
          </View>
        </View>
        <Text style={styles.userText}>{moment(item.date).calendar()}</Text>
      </View>
    </SwipableListItem>
  )

  const deleteExpense = (expense) => {
    removeExpense(expense);
  }

  return (
    <View style={styles.container}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpis}>
          <View style={styles.blankSpace} />
          <KpiItem title={'Todos'} selected={!selectedKpi} color={'#444'} colorContrast={'#fff'} onPress={() => setSelectedKpi(null)}
            value1={`€ ${expenseList.map(el => { return el.amount }).reduce((a, b) => (+a + +b).toFixed(2), 0)}`}
            value2={`R$ ${expenseList.map(el => { return el.convertedAmount }).reduce((a, b) => (+a + +b).toFixed(2), 0)}`}
          />
          {
            users.map((e, i) => (
              <KpiItem title={e.name} color={e.color} colorContrast={e.colorContrast} key={i} selected={selectedKpi === e.id} onPress={() => setSelectedKpi(e.id)}
                value1={`€ ${expenseList.filter((exp) => { return exp.user.id === e.id }).map(el => { return el.amount }).reduce((a, b) => (+a + +b).toFixed(2), 0)}`}
                value2={`R$ ${expenseList.filter((exp) => { return exp.user.id === e.id }).map(el => { return el.convertedAmount }).reduce((a, b) => (+a + +b).toFixed(2), 0)}`} />
            ))
          }
          <View style={styles.blankSpace} />
        </ScrollView>
      </View>
      <FlatList
        data={filteredList}
        renderItem={renderExpense}
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  function useStyle() {
    return StyleSheet.create({
      container: {
        flex: 1
      },
      list: {
        flex: 1
      },
      listItem: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      leftContainer: {
        flexDirection: 'row',
      },
      btn: {
        padding: 5,
        backgroundColor: 'white'
      },
      sumText: {
        fontSize: 18,
        color: 'white'
      },
      image: {
        height: 45,
        width: 45,
        borderRadius: 100,
        marginRight: 15
      },
      listItemTexts: {
        justifyContent: 'center'
      },
      amountText: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
      },
      userText: {
        color: '#999'
      },
      kpis: {
        flexDirection: 'row'
      },
      blankSpace: {
        marginLeft: 5
      }
    });
  }
}