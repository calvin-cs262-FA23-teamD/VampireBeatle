import * as React from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';      // StyleSheet imported because I don't have a main styles file yet
import { SelectList } from 'react-native-dropdown-select-list'; // dropdown list for selecting sound
// ran command to expo install the above

/* Import style code */
import { AntDesign } from '@expo/vector-icons';
// more imports will go here once I have a style file TODO TODO TODO
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

// attempt to type the sound names 120925 AM
export type SoundName = 'Drum' | 'Piano' | 'Shotgun' | 'Snap' | 'Default';

// define/type SoundItem
type SoundItem = {
    key: string;
    value: SoundName;
}

// changed soundList to a list of SoundItem types (see above for def of SoundItem) 120925 AM
/* Default sound and list of possible selectedSounds */
const soundList: SoundItem[] = [
  { key: '1', value: 'Default' },
  { key: '2', value: 'Drum' },
  { key: '3', value: 'Piano' },
  { key: '4', value: 'Shotgun' },
  // Snap contributed by Abigail's friend Noah
  { key: '5', value: 'Snap' },
  // Clap contributed by Abigail's friend Angela (removed)
  // { key: '6', value: 'Clap' },
];

export async function switchSound(
    selectedSound: SoundName,
    // type mp3 files - require() calls for mp3s to return a number in Expo 120925 AM
    setSelectedSoundFile: (value: number) => void,
    setAccentSoundFile: (value: number) => void,
    setSilentSoundFile: (value: number) => void,
) {
    switch (selectedSound) {
        case 'Drum':
            setSelectedSoundFile(require('@/assets/sounds/drum/floor_tom_louder.mp3'));
            setAccentSoundFile(require('@/assets/sounds/drum/snare_drum_louder.mp3'));
            setSilentSoundFile(require('@/assets/sounds/silent/silence.mp3'));
            break;
        case 'Piano':
            setSelectedSoundFile(require('@/assets/sounds/piano/pianoD.mp3'));
            setAccentSoundFile(require('@/assets/sounds/piano/pianoG.mp3'));
            setSilentSoundFile(require('@/assets/sounds/silent/silence.mp3'));
        case 'Shotgun':
            setSelectedSoundFile(require('@/assets/sounds/shotgun/Shotgun.mp3'));
            setAccentSoundFile(require('@/assets/sounds/shotgun/Shotgun2.mp3'));
            setSilentSoundFile(require('@/assets/sounds/silent/silence.mp3'));
        case 'Snap':
            setSelectedSoundFile(require('@/assets/sounds/snap/snap-click-2.0.mp3'));
            setAccentSoundFile(require('@/assets/sounds/snap/snap-accent-2.0.mp3'));
            setSilentSoundFile(require('@/assets/sounds/silent/silence.mp3'));            
        default:
            setSelectedSoundFile(require('@/assets/sounds/metronome/metronomesound.mp3')); // Default
            setAccentSoundFile(require('@/assets/sounds/metronome/metronomeaccent.mp3'));
            setSilentSoundFile(require('@/assets/sounds/silent/silence.mp3'));
    }
}

// Properly typed the props -- convert to TypeScript 120925 AM
type SoundSelectionProps = {
    setSelectedSound: (value: SoundName) => void;
    w: number;
};

export function SoundSelection({ setSelectedSound, w }: SoundSelectionProps) {
    return (
        // Set val type to SoundName below 120925 AM
        <View style={[stylesMain.subView]}>
            <View style={stylesMain.boxed}>
                <Text style={[stylesMain.text, { alignSelf: 'center' }]}>Sound</Text>

                <SelectList
                    setSelected={(val: SoundName) => setSelectedSound(val)}
                    data={soundList}
                    save="value"
                    boxStyles={{ backgroundColor: COLORS.orange, width: w }}
                    dropdownStyles={{ position: 'absolute', width: '100%' }}
                    dropdownTextStyles={{ color: COLORS.orange }}
                    placeholder="Default"
                    search={false}
                    maxHeight={100}
                />
            </View>
        </View>
    );
}

// typed SoundModalProps for conversion to TS 120925 AM
type SoundModalProps = {
    selectedSound: SoundName;
    setSelectedSound: (value: SoundName) => void;
    isModalVisible: boolean;
    setIsModalVisible: (value: boolean | ((prev: boolean) => boolean)) => void;
    handleModal?: () => void;
};

// export SoundModal
export default function SoundModal({
    selectedSound, setSelectedSound,
    isModalVisible, setIsModalVisible,
    // eslint-disable-next-line no-unused-vars
    handleModal,
}: SoundModalProps) {
    const selectSound = (item: SoundItem) => {
        if (selectedSound !== item.value) {
            setSelectedSound(item.value);
        }
    };

    const renderSoundButton = ({ item }: { item: SoundItem }) => {
        const SoundButtonColor = item.value === selectedSound ? '#a23600' : '#ff6900'; // dark orange if selected, orange if not
        const textColor = item.value === selectedSound ? '#f0f5f5' : '#0a0e0f';

        // NO CHANGES MADE
        return (
            <TouchableOpacity
                style={[stylesMain.flatButton,
                    {
                        backgroundColor: SoundButtonColor,
                        width: 300,
                        alignSelf: 'center',
                        marginBottom: 10,
                    },
                ]}
                onPress={() => selectSound(item)}
            >
                <Text style={[stylesMain.text, {color: textColor }]}>{item.value}</Text>
            </TouchableOpacity>
        );
    };

    // NO CHANGES MADE
    return (
        <View style={{ height: 500, width: '100%' }}>
            <View style={{
                flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20,
            }}>
                <Text style={[stylesMain.title, { marginTop: 0 }]}> Select Sound </Text>
            </View>
            <View style={{ flex: 5, padding: 10, justifyContent: 'center' }}>

                <FlatList
                    // ref={flatListRef}
                    data={soundList}
                    renderItem={renderSoundButton}
                    keyExtractor={(sound) => sound.key}
                    extraData={selectedSound}
                    //vertical      // commented out because it was erroring TODO LOOK AT THIS
                    showsVerticalScrollIndicator
                />

            </View>
            <View style={{
                flex: 1,
                paddingBottom: 12,
                justifyContent: 'flex-end',
                flexDirection: 'row',
                alignItems: 'flex-end',
            }}>
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TouchableOpacity
                        style={[stylesMain.flatButton, { backgroundColor: COLORS.orange, width: 50 }]}
                        onPress={() => setIsModalVisible(() => !isModalVisible)}
                    >
                        <AntDesign name="arrow-left" size={24} color={COLORS.background} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// properly typed the props -- convert to TypeScript
type SoundButtonProps = {
    onPress: () => void;
    w: number;
    selectedSound: SoundName;
};

// only change made in function header 120925 AM
export function SoundButton({ onPress, w, selectedSound }: SoundButtonProps) {
    return (
        <View style={[stylesMain.subView, { paddingBottom: 40 }]}>
            <View style={stylesMain.boxed}>
                <Text style={[stylesMain.text, { alignSelf: 'center', marginBottom: -5 }]}>Sound:</Text>
                <TouchableOpacity
                    style={[stylesMain.flatButton, {
                        alignSelf: 'center',
                        marginBottom: 10,
                        backgroundColor: COLORS.buttonBackground,
                        width: w,
                    }]}
                    onPress={onPress}
                >
                    <Text style={stylesMain.text}>
                        {selectedSound}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}