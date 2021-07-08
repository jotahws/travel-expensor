import React, { useContext } from 'react';
import { Text, StyleSheet, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';
import BottomSheet from './BottomSheet';
import useColorScheme from '../hooks/useColorScheme';
import PersonSelector from '../components/PersonSelector';
import AuthContext from '../contexts/AuthContext';


const CustomHeaderContent = (props) => {
    const styles = useStyle();
    const [openUsers, setOpenUsers] = React.useState(false);
    const { signIn, user } = React.useContext(AuthContext)

    const handleUserSelection = selectedUser => {
        signIn(selectedUser)
        setOpenUsers(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.changeUserContainer} onPress={() => setOpenUsers(true)} activeOpacity={.7}>
                <View style={styles.userContainer}>
                    <Image style={styles.image} source={user?.profilepic}/>
                    <Text style={styles.changeUserText}>{user?.name}</Text>
                </View>
                <View style={styles.changeUserBtn}>
                    <Text style={styles.changeUserBtnText}>Alterar</Text>
                </View>
            </TouchableOpacity>
            <BottomSheet open={openUsers} changeStateCallback={isOpen => setOpenUsers(isOpen)} height={400} >
                <PersonSelector onItemSelected={handleUserSelection} selected={user}/>
            </BottomSheet>
        </SafeAreaView>
    );

    function useStyle() {
        return StyleSheet.create({
            emptySpace: {
                width: 30
            },
            changeUserContainer: {
                flexDirection: 'row',
                marginHorizontal: 40,
                marginVertical: 15,
                padding: 10,
                justifyContent: 'space-between',
                backgroundColor: '#e1c8bc',
                borderRadius: 15,
                alignItems: 'center'
            },
            changeUserText: {
                fontSize: 18
            },
            changeUserBtn: {
                backgroundColor: '#888',
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderRadius: 100
            },
            changeUserBtnText: {
                color: '#fff',
                fontSize: 16
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
            }
        });
    }
}
export default CustomHeaderContent;