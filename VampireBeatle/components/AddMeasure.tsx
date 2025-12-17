/* Import react components */
import * as React from 'react';
import {
    Text, View, TouchableOpacity, TextInput,
} from 'react-native';
import { useState, useEffect } from 'react';

import { AntDesign } from '@expo/vector-icons';

/* Import style files */
// eslint-disable-next-line import/extensions
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';

/* Import components */
import Counters from '@/components/Counters';

// type props done 121725 AM
type AddMeasureProps = {
    newMeasureNum: number;
    setNewMeasureNum: React.Dispatch<React.SetStateAction<number>>;
    newTempo: number;
    setNewTempo: React.Dispatch<React.SetStateAction<number>>;
    newBeat: number;
    setNewBeat: React.Dispatch<React.SetStateAction<number>>;
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleModal: () => void;
};

// export AddMeasure
export default function AddMeasure({
    newMeasureNum, setNewMeasureNum,
    newTempo, setNewTempo,
    newBeat, setNewBeat,
    isModalVisible, setIsModalVisible,
    handleModal,
}: AddMeasureProps) {
    const [buttonStates, setButtonStates] = useState(
        Array.from({ length: newBeat }, () => 0),   // Set the default state to display numbers
    );

    // added 121725 as a temp string state to hold whatever the user types (refer to BoxyBox.tsx)
    const [raw, setRaw] = useState(newMeasureNum.toString());
    
    useEffect(() => {
        setRaw(newMeasureNum.toString());
    }, [newMeasureNum]);

    return (
        <View style={{ height: 500, width: '100%' }}>
            <View style={{
                flex: 0.5, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 20,
            }}
            >
                <Text style={[stylesMain.title, { marginTop: 0 }]}>Add Measure</Text>
            </View>

            <View style={{ flex: 4, marginTop: -10, justifyContent: 'flex-start' }}>
                <View
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        paddingBottom: 0,
                    }}
                >
                    <Text style={stylesMain.text}>Measure Num: </Text>
                    {/* Add raw and setRaw 121725 */}
                    <TextInput
                        value={raw}
                        onChangeText={setRaw}
                        defaultValue={newMeasureNum.toString()}
                        keyboardType="numeric"
                        cursorColor={COLORS.orange}
                        style={{
                            width: 50,
                            backgroundColor: COLORS.buttonBackground,
                            borderBottomWidth: 2,
                            borderBottomColor: COLORS.offWhite,
                            color: COLORS.orange,
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    />
                </View>
                <Counters
                    width={200}
                    beat={newBeat} setBeat={setNewBeat}
                    BPM={newTempo} setBPM={setNewTempo}
                    buttonStates={buttonStates} setButtonStates={setButtonStates}
                />
            </View>

            <View style={{
                flex: 0.5,
                paddingBottom: 12,
                justifyContent: 'flex-end',
                flexDirection: 'row',
            }}
            >
                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                    <TouchableOpacity
                        style={[stylesMain.backButton, { backgroundColor: COLORS.orange, width: 50 }]}
                        onPress={() => setIsModalVisible(() => !isModalVisible)}
                    >
                        <AntDesign name="arrow-left" size={24} color={COLORS.background} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={[stylesMain.smallButton, { backgroundColor: COLORS.orange }]}
                        onPress={handleModal}
                    >
                        <Text style={[stylesMain.text, { color: COLORS.background }]}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}