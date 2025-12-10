// code will go here TODO TODO
import { StyleSheet } from 'react-native';

import { COLORS } from '@/styles/colors';   // use @ instead of ./ 120925

// alphabeticized StylesMain
export const stylesMain = StyleSheet.create({
    backButton: {
        borderRadius: 20,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        width: 50,
        height: 50,
        backgroundColor: COLORS.orange,
    },
    
    body: {
        flex: 10,
        justifyContent: 'center',
        width: '100%',
    },

    boxed: {
        rowGap: 7,
    },

    // BoxyBox (used for tempo and beat counters)
    boxyBoxes: {
        borderRadius: 25,
        alignItems: 'center',
        backgroundColor: COLORS.buttonBackground,
        padding: 5,
        //border: 10,       // TROUBLESHOOT TODO
    },

    button: {
        borderRadius: 25,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    buttonContainer: {
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },

    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
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

    footer: {
        flex: 0.75,
        width: '100%',
        alignContent: 'flex-end',
        justifyContent: 'center',
        paddingBottom: 12,
    },

    header: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1.5,
    },

    plusMinusButtons: {
        alignItems: 'center',
        flex: 1,
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
    },

    valueText: {
        alignItems: 'center',
        flex: 1,
    },
});
