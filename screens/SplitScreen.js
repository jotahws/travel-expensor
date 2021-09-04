import * as React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import KpiItem from '../components/KpiItem';
import ExpenseContext from '../contexts/ExpenseContext';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { Image } from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br'
import { users } from '../constants/Users'
import { color, lessThan } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

moment.locale('pt-br')

export default function HistoryScreen() {
	const colorScheme = useColorScheme();
	const { expenseList } = React.useContext(ExpenseContext);
	const styles = useStyle();
	const [splitSteps, setSplitSteps] = React.useState([])

	React.useEffect(() => {
		calcSplit()
	}, [expenseList])

	const calcSplit = () => {
		let payers = []
		let receivers = []
		let neutrals = []
		let steps = []
		const usersTotal = getSpentPerUser()
		const generalTotal = getTotalPerCapta()
		for (let u of usersTotal) {
			if (u.total > generalTotal) {
				receivers.push({ ...u, mustReceive: u.total - generalTotal });
			} else if (u.total < generalTotal) {
				payers.push({ ...u, mustPay: generalTotal - u.total });
			} else {
				neutrals.push(u);
			}
		}

		for (let p of payers) {
			for (let r of receivers) {
				if (r.mustReceive && p.mustPay) {
					const recIdx = receivers.findIndex((rec => rec.id === r.id));
					const payIdx = payers.findIndex((pay => pay.id === p.id));
					if (p.mustPay > r.mustReceive) {
						//reveiver will receive all and payer must pay to another
						const payerRest = p.mustPay - r.mustReceive
						const step = { payer: p, receiver: r, amount: r.mustReceive }
						steps.push(step)
						//update values
						payers[payIdx].mustPay = payerRest;
						receivers[recIdx].mustReceive = 0;
					} else if (p.mustPay < r.mustReceive) {
						//payer will pay off and receiver must receive from another
						const receiverRest = r.mustReceive - p.mustPay
						const step = { payer: p, receiver: r, amount: p.mustPay }
						steps.push(step)
						//update values
						receivers[recIdx].mustReceive = receiverRest;
						payers[payIdx].mustPay = 0;
						break;
					} else {
						//receiver and payer paid off
						const step = { payer: p, receiver: r, amount: p.mustPay }
						steps.push(step)
						//update values
						payers[payIdx].mustPay = 0;
						receivers[recIdx].mustReceive = 0;
						break;
					}
				}
			}
		}
		setSplitSteps(steps)
	}

	const getTotal = () => (expenseList.map(el => { return el.amount }).reduce((a, b) => (+a + +b), 0))

	const getTotalPerCapta = () => ((+getTotal() / users.length))

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
			<View style={styles.stepItem}>
				<Text style={[styles.stepItemText, {color: item.payer.color}]}>{item.payer.name}</Text>
			</View>
			<View style={styles.stepMiddle}>
				<Text style={styles.stepMiddleText}>€ {item.amount.toFixed(2)}</Text>
				<Text style={styles.stepMiddleText}> <Ionicons size={30} name="arrow-forward-outline" color={Colors[colorScheme].text} /> </Text>
			</View>
			<View style={styles.stepItem}>
				<Text style={[styles.stepItemText, {color: item.receiver.color}]}>{item.receiver.name}</Text>
			</View>
		</View>
	)

	return (
		<View style={styles.container}>
			<Text style={styles.info}>Total: {getTotal().toFixed(2)}</Text>
			<Text style={styles.info}>Cada um deve pagar: {getTotalPerCapta().toFixed(2)}</Text>
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
				flex: 1,
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
				color: Colors[colorScheme].text
			}
		});
	}
}
