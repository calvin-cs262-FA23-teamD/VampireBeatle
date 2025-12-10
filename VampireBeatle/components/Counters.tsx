import * as React from 'react';
import { Text, View } from 'react-native';

// code will go here. Can't work on this until BoxyBox and AccentButtons are converted because it imports them. TODO
/* Import component files */
import BoxyBox from '@/components/BoxyBox';
import AccentButtons from '@/components/AccentButtons';

/* Import style code */
import { stylesMain } from '@/styles/stylesMain';

// type properties done 121025 AM
type CounterProps = {
    width: number;
    beat: number;       // passed to value from BoxyBox (number)
    setBeat: React.Dispatch<React.SetStateAction<number>>;      // passed to setValue from BoxyBox
    BPM: number;        // passed to value from BoxyBox (number)
    setBPM: React.Dispatch<React.SetStateAction<number>>;       // passed to setValue from BoxyBox
    buttonStates: number[];     // passed to buttonStates from AccentButtons
    setButtonStates: React.Dispatch<React.SetStateAction<number[]>>;  // passed to setButtonStates from AccentButtons
};

// Besides the function header, everything else stays the same
export default function Counters({
    width,
    beat, setBeat,
    BPM, setBPM,
    buttonStates, setButtonStates,
}: CounterProps) {
    return (
        <View style={[stylesMain.subView, {}]}>
            <View style={stylesMain.boxed}>
                <Text style={[stylesMain.text, { alignSelf: 'center', marginBottom: -5 }]}>Tempo:</Text>
                <BoxyBox w={width} h={width / 3} value={BPM} setValue={setBPM} min={20} max={200} />
            </View>
            <View style={stylesMain.boxed}>
                <Text style={[stylesMain.text, { alignSelf: 'center', marginBottom: -5 }]}>  Beats Per Measure: </Text>
                <BoxyBox w={width} h={width / 3} value={beat} setValue={setBeat} min={1} max={12} />
            </View>
            <View style={[stylesMain.boxed, { width: '100%', justifyContent: 'flex-end' }]}>
                <AccentButtons
                    numButtons={beat}
                    buttonStates={buttonStates}
                    setButtonStates={setButtonStates}
                    buttonSize={width / 7}
                />
            </View>
        </View>
    );
}