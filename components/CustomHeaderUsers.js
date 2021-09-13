import React, { useContext } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import BottomSheet from './BottomSheet';
import useColorScheme from '../hooks/useColorScheme';
import PersonSelector from '../components/PersonSelector';
import AuthContext from '../contexts/AuthContext';
import { ScrollView } from 'react-native-gesture-handler';


const CustomHeaderContent = (props) => {
    const colorScheme = useColorScheme();
    const styles = useStyle();
    const [openUsers, setOpenUsers] = React.useState(false);
    const { setPayer, user, setSpliters, spliters } = React.useContext(AuthContext)

    const handleUserSelection = selectedUser => {
        setPayer(selectedUser)
    }

    const handleSpliterSelection = spliters => {
        setSpliters(spliters)
    }

    const handleCloseSheet = () => {
        setOpenUsers(false)
    }

    return (
        <>
            <SafeAreaView style={{ backgroundColor: Colors[colorScheme].tintLight }} />
            <SafeAreaView style={styles.container}>
                <TouchableOpacity style={styles.changeUserContainer} onPress={() => setOpenUsers(true)} activeOpacity={.7}>
                    <View style={styles.section1}>
                        <View style={styles.userContainer}>
                            <Image style={styles.image} source={{ uri: user?.profilepic }} />
                            <Text style={styles.changeUserText}>{user?.name}</Text>
                        </View>
                        <View style={styles.hr} />
                        <View style={styles.splitersContainer}>
                            <Text style={styles.label}>Dividindo com {!spliters.length && "ninguém"}</Text>
                            {
                                spliters.map((e, i) => (
                                    <Image key={i} style={[styles.spliterImage, { borderColor: e.color }]} source={{ uri: e.profilepic }} />
                                ))
                            }
                        </View>
                    </View>
                    <View style={styles.changeUserBtn}>
                        <Ionicons name="swap-vertical-outline" style={styles.changeUserBtnText} />
                    </View>
                </TouchableOpacity>
                <BottomSheet open={openUsers} changeStateCallback={isOpen => setOpenUsers(isOpen)} full >
                    <ScrollView>
                        <PersonSelector onPayerSelected={handleUserSelection} onSpliterSelected={handleSpliterSelection} selected={user} />
                        <TouchableOpacity style={styles.btnOkContainer} onPress={() => { setOpenUsers(false) }}>
                            <Text style={styles.btnOk}>OK</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </BottomSheet>
            </SafeAreaView>
        </>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                backgroundColor: Colors[colorScheme].background
            },
            emptySpace: {
                width: 30
            },
            changeUserContainer: {
                flexDirection: 'row',
                paddingVertical: 15,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                backgroundColor: Colors[colorScheme].tintLight,
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
                alignItems: 'center'
            },
            changeUserText: {
                fontSize: 18,
                color: Colors[colorScheme].text
            },
            changeUserBtn: {
                backgroundColor: Colors[colorScheme].background,
                paddingHorizontal: 6,
                paddingVertical: 5,
                borderRadius: 100
            },
            changeUserBtnText: {
                color: Colors[colorScheme].text,
                fontSize: 23,
            },
            userContainer: {
                flexDirection: 'row',
                alignItems: 'center'
            },
            image: {
                height: 30,
                width: 30,
                borderRadius: 100,
                marginRight: 15
            },
            splitersContainer: {
                flexDirection: 'row',
                alignItems: 'center'
            },
            label: {
                color: Colors[colorScheme].text,
                marginRight: 5
            },
            spliterImage: {
                height: 23,
                width: 23,
                borderRadius: 100,
                marginRight: 5,
                borderWidth: 2
            },
            hr: {
                marginVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: Colors[colorScheme].mutedFade
            },
            section1: {
                flex: 1,
                marginRight: 20
            },
            btnOkContainer: {
                marginHorizontal: 80,
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                minWidth: 80,
                backgroundColor: Colors[colorScheme].mutedFade,
            },
            btnOk: {
                color: Colors[colorScheme].text,
                textAlign: 'center',
                padding: 15,
            }
        });
    }
}
export default CustomHeaderContent;