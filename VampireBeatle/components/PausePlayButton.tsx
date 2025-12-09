import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

// app icons
import { AntDesign } from '@expo/vector-icons';

/* Import style code -- readded 120925 */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// type props addition 120825 AM
type Props = {
    onPress: () => void;
    pausePlayIcon: keyof typeof AntDesign.glyphMap;
    width: number;
}

export default function PausePlayButton({ onPress, pausePlayIcon, width }: Props) {
    return (
        <View style={[stylesMain.subView, { padding: 7 }]}>
            <TouchableOpacity
                style={[
                    stylesMain.button,
                    { backgroundColor: COLORS.buttonBackground, width, height: width / 3 },
                ]}
                onPress={onPress}
                >
                <AntDesign name={pausePlayIcon} size={24} color={COLORS.orange} />
            </TouchableOpacity>
        </View>
    );
}