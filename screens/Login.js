import React from 'react';
import { View } from 'react-native';
import PersonSelector from '../components/PersonSelector';

const Login = () => {
    const styles = useStyle();
    return (
        <View>
            <PersonSelector/>
        </View>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                flex: 1,
            },
        });
    }
}

export default Login;