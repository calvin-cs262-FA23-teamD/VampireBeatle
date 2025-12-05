import { StyleSheet, View, Pressable, Text } from 'react-native';

// type props (TS stuff) 120525 AM
type Props = {
    label: string;
};

// created after StyleSheet (below) 120525 AM
export default function Button({ label }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={() =>
                alert('You pressed the button.')}>
                    <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
        </View>
    );
}

// create StyleSheet first (usable in this file) 120525 AM
const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});