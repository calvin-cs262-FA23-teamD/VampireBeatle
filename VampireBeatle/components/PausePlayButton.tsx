import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// app icons
import { AntDesign } from '@expo/vector-icons';

// type props addition 120825 AM
type Props = {
    onPress: () => void;
    pausePlayIcon: keyof typeof AntDesign.glyphMap;
    width: number;
}

export default function PausePlayButton({ onPress, pausePlayIcon, width }: Props) {
    return (
        <View style={[styles.subView, { padding: 7 }]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: colors.buttonBackground, width, height: width / 3 },
                ]}
                onPress={onPress}
                >
                <AntDesign name={pausePlayIcon} size={24} color={colors.orange} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 25,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    subView: {
        justifyContent: 'flex-start',
        rowGap: 10,
        width: '100%',
        alignItems: 'center',
    },
});

const colors = {
    background: '#0a0e0f',
    offWhite: '#f0f5f5',
    orange: '#ff6900',
    buttonBackground: '#1f2e2e',
    darkOrange: '#a23600',
};