import { StyleSheet, View, Pressable, Text } from 'react-native';
// font import according to the tutorial 120525 AM
import FontAwesome from '@expo/vector-icons/FontAwesome';

// type props (TS stuff) 120525 AM
type Props = {
    label: string;
    theme?: 'primary';  // nullable
    onPress?: () => void;   // step 3 use an image picker. call pickImageAsync() on the Button component
};

// created after StyleSheet (below) 120525 AM
export default function Button({ label, theme, onPress }: Props) {
    if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: '#fff' }]} onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

    return (
        <View style={styles.buttonContainer}>
            <Pressable style={styles.button}
                onPress={() =>
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
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});