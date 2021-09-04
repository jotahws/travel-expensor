import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ScanScreen from '../screens/ScanScreen';
import NewExpenseScreen from '../screens/NewExpenseScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SplitScreen from '../screens/SplitScreen';
import CustomHeader from '../components/CustomHeader';
import CustomHeaderUsers from '../components/CustomHeaderUsers';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Scan"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint, tabStyle: {backgroundColor: Colors[colorScheme].background} }}>
      <BottomTab.Screen
        name="Novo Gasto"
        component={NewExpenseNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="card-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Escanear"
        component={ScanNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="scan" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Histórico"
        component={HistoryNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="receipt-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Raxadinha"
        component={SplitNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="swap-horizontal-outline" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const NewExpenseStack = createStackNavigator();

function NewExpenseNavigator() {
  return (
    <NewExpenseStack.Navigator>
      <NewExpenseStack.Screen
        name="NewExpenseScreen"
        component={NewExpenseScreen}
        options={{
          title: 'Novo Gasto',
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            return (
              <CustomHeaderUsers/>
            );
          },
        }}
      />
    </NewExpenseStack.Navigator>
  );
}

const ScanStack = createStackNavigator();

function ScanNavigator() {
  return (
    <ScanStack.Navigator>
      <ScanStack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          title: 'Escanear',
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            return (
              <CustomHeaderUsers/>
            );
          }
        }}
      />
    </ScanStack.Navigator>
  );
}

const HistoryStack = createStackNavigator();

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            return (
              <CustomHeader {...navigation} hasLeftButton={previous} title={options.title} />
            );
          }
        }}
      />
    </HistoryStack.Navigator>
  );
}

const SplitStack = createStackNavigator();

function SplitNavigator() {
  return (
    <SplitStack.Navigator>
      <SplitStack.Screen
        name="SplitScreen"
        component={SplitScreen}
        options={{
          title: 'Raxadinha',
          header: ({ scene, previous, navigation }) => {
            const { options } = scene.descriptor;
            return (
              <CustomHeader {...navigation} hasLeftButton={previous} title={options.title} />
            );
          }
        }}
      />
    </SplitStack.Navigator>
  );
}
