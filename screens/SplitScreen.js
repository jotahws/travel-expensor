import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KpiItem from '../components/KpiItem';
import ExpenseContext from '../contexts/ExpenseContext';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Image } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br'
import { color, lessThan } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../contexts/AuthContext';

moment.locale('pt-br')

export default function HistoryScreen() {
	const colorScheme = useColorScheme();
	const { expenseList, refreshExpenseList } = React.useContext(ExpenseContext);
	const { users } = React.useContext(AuthContext)
	const styles = useStyle();
	const [splitSteps, setSplitSteps] = React.useState([])
	const [refreshingList, setRefreshingList] = React.useState(false)

	React.useEffect(() => {
		calcSplit()
	}, [expenseList])

	const refreshList = async () => {
		setRefreshingList(true);
		await refreshExpenseList();
		setRefreshingList(false);
	}

	const calcSplit = () => {
		const steps = [];
		for (let e of expenseList) {
			const receiver = e.user;
			const payers = e.spliters;
			for (let payer of payers) {
				const step = { payer, receiver, amount: e.amount / (payers.length + 1) }
				steps.push(step)
			}
		}
		const agregatedSteps = []
		for (let step of steps) {
			const idx = agregatedSteps.findIndex((s => (s.payer.id === step.payer.id && s.receiver.id === step.receiver.id)))
			if (idx === -1) {
				const idx2 = agregatedSteps.findIndex((s => (s.payer.id === step.receiver.id && s.receiver.id === step.payer.id)))
				if (idx2 === -1) {
					agregatedSteps.push(step)
				} else {
					agregatedSteps[idx2].amount -= step.amount
				}
			} else {
				agregatedSteps[idx].amount += step.amount
			}
		}
		//prevent negative values
		for (let step of agregatedSteps) {
			if (step.amount < 0) {
				const payerTemp = step.payer
				step.amount = step.amount * -1
				step.payer = step.receiver
				step.receiver = payerTemp
			} else if (step.amount === 0) {
				agregatedSteps.splice(agregatedSteps.indexOf(step), 1)
			}
		}
		setSplitSteps(agregatedSteps)
	}

	const getTotal = () => (expenseList.map(el => { return el.amount }).reduce((a, b) => (+a + +b), 0))

	const getSpentPerUser = () => {
		return users.map((e, i) => {
			let userTotal = {
				...e,
				total: expenseList.filter((exp) => { return exp.user.id === e.id }).map(el => { return el.amount }).reduce((a, b) => (+a + +b), 0)
			}
			return userTotal;
		})
	}

	const renderSplitSteps = ({ item }) => (
		<View style={[styles.stepContainer]}>
			<View style={[styles.stepItem, { backgroundColor: item.payer.color }]}>
				<Text style={[styles.stepItemText, { color: item.payer.colorContrast }]}>{item.payer.name}</Text>
			</View>
			<View style={styles.stepMiddle}>
				<Text style={styles.stepMiddleText}>€ {item.amount.toFixed(2)}</Text>
				<Text style={styles.stepMiddleText}> <Ionicons size={20} name="arrow-forward-outline" color={Colors[colorScheme].text} /> </Text>
			</View>
			<View style={[styles.stepItem, { backgroundColor: item.receiver.color }]}>
				<Text style={[styles.stepItemText, { color: item.receiver.colorContrast }]}>{item.receiver.name}</Text>
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<Text style={styles.info}>€ {getTotal().toFixed(2)}</Text>
			<View style={styles.stepHeaderContainer}>
				<Text style={styles.stepHeaderText}>Paga</Text>
				<Text style={styles.stepHeaderSpace}></Text>
				<Text style={styles.stepHeaderText}>Recebe</Text>
			</View>
			<FlatList
				data={splitSteps}
				renderItem={renderSplitSteps}
				style={styles.list}
				keyExtractor={(item, index) => index.toString()}
				onRefresh={refreshList}
				refreshing={refreshingList}
			/>
		</View>
	);

	function useStyle() {
		return StyleSheet.create({
			container: {
				flex: 1,
				paddingHorizontal: 15,
				backgroundColor: Colors[colorScheme].background
			},
			stepHeaderContainer: {
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				marginTop: 10,
			},
			stepHeaderText: {
				flex: 2,
				color: Colors[colorScheme].tint,
				fontSize: 18,
			},
			stepHeaderSpace: {
				flex: 1
			},
			stepContainer: {
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				marginVertical: 5,
			},
			stepItem: {
				flex: 3,
				alignItems: 'center',
				backgroundColor: "#ddd",
				borderRadius: 10,
				padding: 7,
				justifyContent: 'center',
			},
			stepMiddle: {
				flex: 2,
				padding: 7
			},
			stepItemText: {
				textAlign: 'center',
				fontWeight: 'bold',
				color: Colors[colorScheme].text
			},
			stepMiddleText: {
				textAlign: 'center',
				color: Colors[colorScheme].text
			},
			info: {
                fontSize: 18,
                color: Colors[colorScheme].tint,
                fontWeight: 'bold',
                textAlign: 'center'
			},
			list: {
				marginHorizontal: -15,
				paddingHorizontal: 15,
			}
		});
	}
}
