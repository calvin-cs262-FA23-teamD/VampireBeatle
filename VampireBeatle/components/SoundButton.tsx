import * as React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

/* Import style code -- use @ instead of .. */
import { stylesMain } from '@/styles/stylesMain';
import { COLORS } from '@/styles/colors';
import { SoundName } from '@/components/SoundSelection';

// addition of typed props 120925 AM
//type SoundName = 'Default' | 'Drum' | 'Piano' | 'Shotgun' | 'Snap';       // this line commented out because SoundName imported from SoundSelection

type Props = {
    onPress: () => void;
    w: number;
    selectedSound: SoundName;
}

// Props in the header of the SoundButton function 120925 AM
export default function SoundButton({ onPress, w, selectedSound }: Props) {
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