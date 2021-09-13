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
import AuthContext from '../contexts/AuthContext';
import BottomSheet from '../components/BottomSheet'

moment.locale('pt-br')

const HistoryScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const { expenseList, removeExpense, refreshExpenseList } = React.useContext(ExpenseContext);
  const { users } = React.useContext(AuthContext)
  const styles = useStyle();
  const [openDetail, setOpenDetail] = React.useState(null)
  const [selectedKpi, setSelectedKpi] = React.useState(null)
  const [filteredList, setFilteredList] = React.useState([])
  const [refreshingList, setRefreshingList] = React.useState(false)

  React.useEffect(() => {
    filterList()
  }, [expenseList])

  React.useEffect(() => {
    filterList()
  }, [selectedKpi])

  const filterList = () => {
    if (selectedKpi)
      setFilteredList(expenseList.filter(e => e.user?.id === selectedKpi).sort((a, b) => a.date?.toString() < b.date?.toString()))
    else
      setFilteredList(expenseList.sort((a, b) => a.date?.toString() < b.date?.toString()))
  }

  const renderExpense = ({ item }) => (
    <SwipableListItem onDelete={() => deleteExpense(item)}>
      <TouchableOpacity style={styles.listItem} activeOpacity={0.7} onPress={() => navigation.navigate('ExpenseDetail', { ...item })}>
        <View style={styles.leftContainer}>
          <Image style={styles.image} source={{ uri: item.user?.profilepic }} />
          <View style={styles.splitersContainer}>
            {
              item.spliters.map((s, i) => (
                <Image key={i} style={[styles.imageSpliter, { backgroundColor: s.color }]} source={{ uri: s.profilepic }} />
              ))
            }
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.amountsContainer}>
              <Text style={styles.amountText}>€ {item.amount.toFixed(2)}</Text>
              <Text style={styles.amountConvText}> ~R$ {item.convertedAmount.toFixed(2)} </Text>
            </View>
            <Text style={styles.mutedText}> {item.description} </Text>
          </View>
        </View>
        <Text style={styles.mutedText}>{moment(item.date).calendar()}</Text>
      </TouchableOpacity>
    </SwipableListItem>
  )

  const renderUserKpi = (e, i) => {
    const amountLocal = expenseList.filter((exp) => { return exp.user.id === e.id }).map(el => { return el.amount }).reduce((a, b) => (+a + +b).toFixed(2), 0)
    const amountConverted = expenseList.filter((exp) => { return exp.user.id === e.id }).map(el => { return el.convertedAmount }).reduce((a, b) => (+a + +b).toFixed(2), 0)
    if (amountLocal)
      return (
        <KpiItem title={e.name} color={e.color} colorContrast={e.colorContrast} key={i} selected={selectedKpi === e.id} onPress={() => setSelectedKpi(e.id)}
          value1={`€ ${amountLocal}`}
          value2={`R$ ${amountConverted}`} />
      )
    return
  }


  const deleteExpense = (expense) => {
    removeExpense(expense);
  }

  const refreshList = async () => {
    setRefreshingList(true);
    await refreshExpenseList();
    setRefreshingList(false);
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
            users.map(renderUserKpi)
          }
          <View style={styles.blankSpace} />
        </ScrollView>
      </View>
      <FlatList
        data={filteredList}
        renderItem={renderExpense}
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        onRefresh={refreshList}
        refreshing={refreshingList}
      />
      <BottomSheet open={openDetail} changeStateCallback={isOpen => setOpenDetail(isOpen)} height={700} >
        <TouchableOpacity style={styles.btnOkContainer} onPress={() => { setOpenDetail(false) }}>
          <Text style={styles.btnOk}>OK</Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );

  function useStyle() {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: Colors[colorScheme].background
      },
      list: {
        flex: 1
      },
      listItem: {
        backgroundColor: Colors[colorScheme].background,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomColor: Colors[colorScheme].mutedFade,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      leftContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
        height: 50,
        width: 50,
        borderRadius: 100,
        marginRight: 15
      },
      amountsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
      },
      amountText: {
        color: Colors[colorScheme].text,
        fontSize: 16,
        fontWeight: 'bold',
      },
      amountConvText: {
        marginLeft: 5,
        color: '#999',
      },
      mutedText: {
        color: '#999',
      },
      kpis: {
        flexDirection: 'row'
      },
      blankSpace: {
        marginLeft: 5
      },
      infoContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        maxWidth: 200
      },
      splitersContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -5,
        left: 10
      },
      imageSpliter: {
        height: 20,
        width: 20,
        borderRadius: 100,
        marginLeft: -10,
        borderWidth: 2,
        borderColor: Colors[colorScheme].background,
        backgroundColor: Colors[colorScheme].background,
        overflow: 'hidden'
      }
    });
  }
}

export default HistoryScreen;