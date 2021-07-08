import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

const ModalSheet = (props) => {
    const colorScheme = useColorScheme();
    const sheetRef = React.useRef();
    const styles = useStyle();

    const screenDim = {
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    };
    const { changeStateCallback = () => { }, height = 600, full = false } = props;
    const [open, setOpen] = useState(false);
    //Chama quando a prop muda de valor.
    //Se open true, abre o sheet
    useEffect(() => {
        if (props.open) {
            sheetRef.current.open()
        } else {
            sheetRef.current.close()
        }
    }, [props.open]);

    //Chama o callback quando open muda de valor
    useEffect(() => {
        changeStateCallback(open);
    }, [open]);

    return (
        <RBSheet
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            ref={sheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={(height > screenDim.height || full) ? (screenDim.height - 50) : height}
            customStyles={styles}
            animationType={'fade'}
        >
            {props.children}
        </RBSheet>
    );

    function useStyle() {
        return StyleSheet.create({
            container: {
                backgroundColor: Colors[colorScheme].background,
                paddingTop: 12,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
            },
        });
    }
}

export default ModalSheet;