// code will go here TODO TODO
import { StyleSheet } from 'react-native';

import { COLORS } from '@/styles/colors';   // use @ instead of ./ 120925

// alphabeticized StylesMain
export const stylesMain = StyleSheet.create({
    boxed: {
        rowGap: 7,
    },

    button: {
        borderRadius: 25,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    flatButton: {
        borderRadius: 20,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        width: 300,
        height: 50,
        backgroundColor: COLORS.orange,
    },

    subView: {
        justifyContent: 'flex-start',
        rowGap: 10,
        width: '100%',
        alignItems: 'center',
    },

    text: {
        color: COLORS.offWhite,
        fontWeight: 'bold',
        fontSize: 20,
    },

    title: {
        color: COLORS.offWhite,
        fontWeight: 'bold',
        fontSize: 26,
        marginTop: -5,
    }
});
